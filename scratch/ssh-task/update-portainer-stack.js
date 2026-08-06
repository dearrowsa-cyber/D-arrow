const https = require('https');
const fs = require('fs');
const path = require('path');

const agent = new https.Agent({ rejectUnauthorized: false });
const PORTAINER_BASE = 'https://apps.d-arrow.com/api';
const PORTAINER_USER = 'd-arrow';
const PORTAINER_PASS = 'D-Arrow.2026';

const STACK_FILE_LOCAL = path.join(__dirname, '..', '..', 'docker-compose.yml');
const ENV_FILE_LOCAL = path.join(__dirname, '..', '..', '.env.example');

const HTTP_TIMEOUT_MS = 120_000;
const POLL_TIMEOUT_MS = 180_000;

function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const usePoll = /stacks\/\d+(\?|$)/.test(u.pathname) || /\/containers\/json/.test(u.pathname) || /\/containers\/.*\/logs/.test(u.pathname);
    const timeout = usePoll ? POLL_TIMEOUT_MS : HTTP_TIMEOUT_MS;
    const opts = {
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      agent,
      headers: options.headers || {},
      timeout
    };
    if (options.body) {
      opts.headers['Content-Type'] = 'application/json';
      opts.headers['Content-Length'] = Buffer.byteLength(options.body);
    }
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy(new Error(`HTTP ${opts.method} ${u.pathname} timed out after ${timeout}ms`));
    });
    if (options.body) req.write(options.body);
    req.end();
  });
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function parseEnvFile(content) {
  const result = [];
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const name = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    result.push({ name, value });
  }
  return result;
}

function mergeEnv(existingEnv, newEnv) {
  const newByName = new Map(newEnv.map(e => [e.name, e.value]));
  const outByName = new Map();
  const PLACEHOLDER_RE = /(REQUIRED|REPLACE|changeme|change_me|replace_with|your-domain|your_smtp|example\.com|^$)/i;
  for (const e of (existingEnv || [])) outByName.set(e.name, e.value);
  for (const [name, newValue] of newByName) {
    const old = outByName.get(name);
    const newLooksReal = !PLACEHOLDER_RE.test(newValue);
    const oldLooksReal = old != null && !PLACEHOLDER_RE.test(String(old));
    if (!outByName.has(name)) outByName.set(name, newValue);
    else if (newLooksReal && !oldLooksReal) outByName.set(name, newValue);
  }
  return Array.from(outByName.entries()).map(([name, value]) => ({ name, value }));
}

async function run() {
  console.log('[1/7] Authenticating with Portainer...');
  const auth = await fetchJSON(`${PORTAINER_BASE}/auth`, {
    method: 'POST',
    body: JSON.stringify({ username: PORTAINER_USER, password: PORTAINER_PASS })
  });
  if (!auth.data?.jwt) { console.error('Auth failed:', auth.data); process.exit(1); }
  const token = auth.data.jwt;
  const headers = { Authorization: `Bearer ${token}` };
  console.log('✅ Authenticated');

  const eps = await fetchJSON(`${PORTAINER_BASE}/endpoints`, { headers });
  const endpointId = eps.data[0].Id;
  console.log(`[2/7] Using endpoint id=${endpointId} (${eps.data[0].Name})`);

  const stacks = await fetchJSON(`${PORTAINER_BASE}/stacks`, { headers });
  const stack = (stacks.data || []).find(s => s.Name.includes('d-arrow'));
  if (!stack) {
    console.error('No d-arrow stack found.');
    process.exit(2);
  }
  console.log(`[3/7] Found stack ${stack.Name} id=${stack.Id} status=${stack.Status} type=${stack.Type}`);

  const stackFileContent = fs.readFileSync(STACK_FILE_LOCAL, 'utf8');
  console.log(`[4/7] Read local docker-compose.yml (${Buffer.byteLength(stackFileContent)} bytes)`);
  const newEnv = parseEnvFile(fs.readFileSync(ENV_FILE_LOCAL, 'utf8'));
  console.log(`      Parsed ${newEnv.length} variables from .env.example`);
  const mergedEnv = mergeEnv(stack.Env, newEnv);
  console.log(`      Merged env: ${mergedEnv.length} total variables`);

  const detail = await fetchJSON(`${PORTAINER_BASE}/stacks/${stack.Id}?endpointId=${endpointId}`, { headers });
  const version = detail.data?.ResourceControl?.Version || stack.ResourceControl?.Version || 1;

  console.log('[5/7] Patching StackFileContent + Env variables on Portainer...');
  const patch = { StackFileContent: stackFileContent, Env: mergedEnv, Prune: false };
  const putRes = await fetchJSON(`${PORTAINER_BASE}/stacks/${stack.Id}?endpointId=${endpointId}&version=${version}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(patch)
  });
  if (putRes.status >= 200 && putRes.status < 300) {
    console.log('✅ Stack updated (compose + env pushed)');
  } else {
    console.log('PUT status:', putRes.status, '\nResponse:', putRes.data);
    process.exit(3);
  }

  // Stop only if ACTIVE (status 3). Stack 2 = inactive, no stop needed.
  if (stack.Status === 3) {
    console.log('[6/7] Stopping active stack first (force rebuild)...');
    try {
      const stop = await fetchJSON(`${PORTAINER_BASE}/stacks/${stack.Id}/stop?endpointId=${endpointId}`, { method: 'POST', headers });
      console.log('      Stop status:', stop.status);
      await sleep(6000);
    } catch (e) {
      console.log('      Stop timed out/hung — continuing anyway.', e.message);
    }
  } else {
    console.log('[6/7] Stack is inactive — skipping stop step.');
  }

  console.log('[7/7] Starting stack (triggers docker-compose build + up)...');
  try {
    const start = await fetchJSON(`${PORTAINER_BASE}/stacks/${stack.Id}/start?endpointId=${endpointId}`, { method: 'POST', headers });
    console.log('      Start status:', start.status, (start.status >= 200 && start.status < 300) ? '✅' : '⚠️');
  } catch (e) {
    console.log('      Start call returned (timeout OK since Portainer runs async):', e.message);
  }

  // Poll status
  console.log('\n=== Polling stack/containers status ===');
  let appContainerId = null;
  for (let i = 0; i < 10; i++) {
    await sleep(15000);
    try {
      const s = await fetchJSON(`${PORTAINER_BASE}/stacks/${stack.Id}?endpointId=${endpointId}`, { headers });
      const status = s.data?.Status ?? '?';
      const label = status === 1 ? 'pending(1)' : status === 2 ? 'inactive(2)' : status === 3 ? 'active(3)' : String(status);
      const cs = await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/json?all=true`, { headers });
      const list = Array.isArray(cs.data) ? cs.data : [];
      const app = list.find(c => (c.Names || []).some(n => /d-arrow-app/.test(n)));
      const pg = list.find(c => (c.Names || []).some(n => /d-arrow-postgres|postgres/.test(n)));
      if (app) appContainerId = app.Id;
      console.log(`  t=${(i + 1) * 15}s  stack=${label}   postgres: ${pg ? `${pg.State}/${pg.Status}` : 'missing'}   app: ${app ? `${app.State}/${app.Status}` : 'missing'}`);
      if (app?.State === 'running') break;
    } catch (e) {
      console.log(`  t=${(i + 1) * 15}s  poll failed: ${e.message}`);
    }
  }

  if (appContainerId) {
    await sleep(25000);
    console.log('\n=== Last 40 lines of app container logs ===');
    try {
      const logs = await fetchJSON(
        `${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/${appContainerId}/logs?stdout=true&stderr=true&tail=40&timestamps=false`,
        { headers }
      );
      let text = '';
      if (typeof logs.data === 'string') text = logs.data;
      else if (Array.isArray(logs.data)) text = logs.data.join('\n');
      else text = String(logs.data ?? '');
      console.log(text.replace(/\u0000/g, ''));
    } catch (e) {
      console.log('      logs unavailable:', e.message);
    }
  } else {
    console.log('\n⚠️ App container was not created. Check Portainer UI for stack errors.');
  }

  console.log('\nPortainer UI: https://apps.d-arrow.com/  (stack ID=17)');
}

run().catch(e => { console.error('\nFATAL:', e); process.exit(99); });
