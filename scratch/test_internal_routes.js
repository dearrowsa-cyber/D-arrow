const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname, port: u.port || 443,
      path: u.pathname + u.search, method: options.method || 'GET',
      agent, headers: options.headers || {}, timeout: 30000
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
  const app = (cs.data || []).find(c => (c.Names || []).some(n => /d-arrow-app/.test(n)));

  const nodeScript = `
    const http = require('http');
    const pages = ['/store', '/demo/store', '/demo/real-estate', '/about', '/services', '/'];
    pages.forEach(p => {
      http.get('http://127.0.0.1:3000' + p, r => {
        console.log(p, '=>', r.statusCode);
      }).on('error', e => console.log(p, '=> ERR', e.message));
    });
  `;

  const ex = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/${app.Id}/exec`, {
    method: 'POST', headers,
    body: JSON.stringify({
      AttachStdout: true, AttachStderr: true,
      Cmd: ['node', '-e', nodeScript]
    })
  });

  if (ex.data?.Id) {
    const s = await fetchJSON(`${base}/endpoints/${envId}/docker/exec/${ex.data.Id}/start`, {
      method: 'POST', headers,
      body: JSON.stringify({ Detach: false, Tty: false })
    });
    const out = typeof s.data === 'string' ? s.data.replace(/[\x00-\x08]/g, '') : JSON.stringify(s.data);
    console.log('Internal NodeFetch Output:\n' + out);
  }
}

main().catch(e => console.error('FATAL:', e));
