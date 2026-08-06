const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

const PORTAINER_BASE = 'https://apps.d-arrow.com/api';
const PORTAINER_USER = 'd-arrow';
const PORTAINER_PASS = 'D-Arrow.2026';
const TIMEOUT = 180_000;

function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname, port: u.port || 443,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      agent, headers: options.headers || {},
      timeout: TIMEOUT
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
    req.on('timeout', () => req.destroy(new Error(`timeout ${opts.method} ${u.pathname}`)));
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
  const cs = await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/json?all=true`, { headers });
  const app = (cs.data || []).find(c => (c.Names || []).some(n => /d-arrow-app/.test(n)));
  if (!app) { console.error('app container not found'); process.exit(1); }
  console.log(`Found app container: ${app.Id.substring(0, 16)}...  state=${app.State}`);

  // Step 1: exec create for prisma migrate deploy
  console.log('\n[1/3] Creating exec: npx prisma migrate deploy');
  const createRes = await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/${app.Id}/exec`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      AttachStdout: true, AttachStderr: true, Tty: false,
      Cmd: ['/bin/sh', '-lc', 'cd /app && npx prisma migrate deploy && echo MIGRATE_OK']
    })
  });
  if (createRes.status >= 300) { console.log('exec create failed:', createRes); process.exit(2); }
  const execId = createRes.data?.Id;
  console.log('  execId =', execId);

  // Step 2: exec start
  console.log('[2/3] Running exec start (may take 30–90 seconds)...');
  const startRes = await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/exec/${execId}/start`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ Detach: false, Tty: false })
  });
  let text = '';
  if (typeof startRes.data === 'string') text = startRes.data;
  else if (typeof startRes.data === 'object' && startRes.data) text = JSON.stringify(startRes.data);
  console.log(text.replace(/\u0000/g, ''));

  // Step 3: generate client too for safety
  await sleep(2000);
  console.log('\n[3/3] prisma generate (safety regenerate inside container)...');
  const cr2 = await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/${app.Id}/exec`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      AttachStdout: true, AttachStderr: true, Tty: false,
      Cmd: ['/bin/sh', '-lc', 'cd /app && npx prisma generate >/dev/null && echo GENERATE_OK']
    })
  });
  const ex2 = cr2.data?.Id;
  const s2 = await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/exec/${ex2}/start`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ Detach: false, Tty: false })
  });
  console.log((typeof s2.data === 'string' ? s2.data : JSON.stringify(s2.data)).replace(/\u0000/g, ''));

  console.log('\nDone. Waiting 10s then dumping tail of app logs to confirm SeoMeta errors are gone...');
  await sleep(10000);
  const logs = await fetchJSON(
    `${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/${app.Id}/logs?stdout=true&stderr=true&tail=20&timestamps=false`,
    { headers }
  );
  let lt = '';
  if (typeof logs.data === 'string') lt = logs.data;
  else if (Array.isArray(logs.data)) lt = logs.data.join('\n');
  else lt = String(logs.data ?? '');
  console.log(lt.replace(/\u0000/g, ''));
}

run().catch(e => { console.error('FATAL:', e); process.exit(99); });
