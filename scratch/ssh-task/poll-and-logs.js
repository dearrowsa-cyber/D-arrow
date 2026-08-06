const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

const PORTAINER_BASE = 'https://apps.d-arrow.com/api';
const PORTAINER_USER = 'd-arrow';
const PORTAINER_PASS = 'D-Arrow.2026';
const POLL_TIMEOUT_MS = 180_000;

function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      agent,
      headers: options.headers || {},
      timeout: POLL_TIMEOUT_MS
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
    req.on('timeout', () => req.destroy(new Error(`HTTP ${opts.method} ${u.pathname} timed out`)));
    if (options.body) req.write(options.body);
    req.end();
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  console.log('Authing...');
  const auth = await fetchJSON(`${PORTAINER_BASE}/auth`, {
    method: 'POST',
    body: JSON.stringify({ username: PORTAINER_USER, password: PORTAINER_PASS })
  });
  const token = auth.data.jwt;
  const headers = { Authorization: `Bearer ${token}` };
  const endpointId = (await fetchJSON(`${PORTAINER_BASE}/endpoints`, { headers })).data[0].Id;

  const stacks = await fetchJSON(`${PORTAINER_BASE}/stacks`, { headers });
  const stack = stacks.data.find(s => s.Name.includes('d-arrow'));
  console.log(`Stack ${stack.Name} id=${stack.Id} status=${stack.Status}`);

  console.log('\n=== Polling stack + containers (up to 14 minutes) ===');
  let appContainerId = null;
  const START_AT = Date.now();
  for (let i = 0; i < 28; i++) {
    await sleep(30_000);
    const elapsed = Math.round((Date.now() - START_AT) / 1000);
    try {
      const s = await fetchJSON(`${PORTAINER_BASE}/stacks/${stack.Id}?endpointId=${endpointId}`, { headers });
      const status = s.data?.Status ?? '?';
      const label = { 1: 'pending(1)', 2: 'inactive(2)', 3: 'active(3)' }[status] || String(status);
      const cs = await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/json?all=true`, { headers });
      const list = Array.isArray(cs.data) ? cs.data : [];
      const app = list.find(c => (c.Names || []).some(n => /d-arrow-app/.test(n)));
      const pg = list.find(c => (c.Names || []).some(n => /d-arrow-postgres|postgres/.test(n)));
      if (app) appContainerId = app.Id;
      console.log(`  +${elapsed}s  stack=${label}   postgres: ${pg ? `${pg.State}/${pg.Status}` : 'missing'}   app: ${app ? `${app.State}/${app.Status}` : 'missing'}`);
      if (app?.State === 'running') {
        console.log('  ✅ App container running — moving to logs.');
        break;
      }
    } catch (e) {
      console.log(`  +${elapsed}s  poll: ${e.message}`);
    }
  }

  if (!appContainerId) {
    console.log('\nApp container not found after polls — build failed? Check Portainer UI.');
    return;
  }

  await sleep(25_000);
  console.log('\n=== App container logs (last 60 lines) ===');
  try {
    const logs = await fetchJSON(
      `${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/${appContainerId}/logs?stdout=true&stderr=true&tail=60&timestamps=false`,
      { headers }
    );
    let text = '';
    if (typeof logs.data === 'string') text = logs.data;
    else if (Array.isArray(logs.data)) text = logs.data.join('\n');
    else text = String(logs.data ?? '');
    console.log(text.replace(/\u0000/g, ''));
  } catch (e) {
    console.log('logs unavailable:', e.message);
  }
}

run().catch(e => { console.error('FATAL:', e); process.exit(99); });
