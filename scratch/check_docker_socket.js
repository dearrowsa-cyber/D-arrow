const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname, port: u.port || 443,
      path: u.pathname + u.search, method: options.method || 'GET',
      agent, headers: options.headers || {}, timeout: 60000
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
  const auth = await fetchJSON(`${base}/auth`, {
    method: 'POST',
    body: JSON.stringify({ username: 'd-arrow', password: 'D-Arrow.2026' })
  });
  const token = auth.data.jwt;
  const headers = { 'Authorization': `Bearer ${token}` };
  const envId = 3;

  const cs = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/json?all=true`, { headers });
  const pg = (cs.data || []).find(c => (c.Names || []).some(n => /d-arrow-postgres/.test(n)));

  // Test executing docker build command using docker socket if available or checking host
  const ex = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/${pg.Id}/exec`, {
    method: 'POST', headers,
    body: JSON.stringify({
      AttachStdout: true, AttachStderr: true,
      Cmd: ['sh', '-c', 'ls -la /var/run/docker.sock 2>&1']
    })
  });

  if (ex.data?.Id) {
    const s = await fetchJSON(`${base}/endpoints/${envId}/docker/exec/${ex.data.Id}/start`, {
      method: 'POST', headers,
      body: JSON.stringify({ Detach: false, Tty: false })
    });
    console.log('Socket check:', typeof s.data === 'string' ? s.data.trim() : JSON.stringify(s.data));
  }
}

main().catch(e => console.error('FATAL:', e));
