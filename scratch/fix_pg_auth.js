const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });
const HTTP_TIMEOUT_MS = 30_000;

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
      timeout: HTTP_TIMEOUT_MS
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
    req.on('timeout', () => req.destroy(new Error('timeout')));
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function main() {
  const base = 'https://apps.d-arrow.com/api';
  
  // Auth
  const authRes = await fetchJSON(`${base}/auth`, {
    method: 'POST',
    body: JSON.stringify({ username: 'd-arrow', password: 'D-Arrow.2026' })
  });
  const token = authRes.data.jwt;
  const headers = { 'Authorization': `Bearer ${token}` };
  const envId = 3;

  // Find postgres container
  const cs = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/json?all=true`, { headers });
  const pg = (cs.data || []).find(c => (c.Names || []).some(n => /d-arrow-postgres/.test(n)));
  if (!pg) { console.error('Postgres container not found'); return; }
  console.log('Found postgres container:', pg.Id.slice(0,12), pg.State, pg.Status);

  // Create exec to reset password
  const newPass = 'f95RZu-bC0RMc0reKCa9oAspx_c';
  const cmd = `psql -U darrow -d darrow -c "ALTER USER darrow WITH PASSWORD '${newPass}';"`;
  
  console.log('Resetting postgres password via exec...');
  const execCreate = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/${pg.Id}/exec`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      AttachStdout: true,
      AttachStderr: true,
      Cmd: ['sh', '-c', cmd]
    })
  });
  
  console.log('Exec create response:', execCreate.status, JSON.stringify(execCreate.data));
  
  if (execCreate.data?.Id) {
    const startRes = await fetchJSON(`${base}/endpoints/${envId}/docker/exec/${execCreate.data.Id}/start`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ Detach: true })
    });
    console.log('Exec start response:', startRes.status);
  }

  // Now restart the app container to pick up the new connection
  const app = (cs.data || []).find(c => (c.Names || []).some(n => n === '/d-arrow-app'));
  if (app) {
    console.log('\nRestarting d-arrow-app container...');
    const restart = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/${app.Id}/restart`, {
      method: 'POST',
      headers
    });
    console.log('Restart response:', restart.status);
  }
}

main().catch(e => console.error('FATAL:', e));
