const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname, port: u.port || 443,
      path: u.pathname + u.search, method: options.method || 'GET',
      agent, headers: options.headers || {}, timeout: 120000
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
  const endpointId = 3;
  const stackId = 17;

  console.log('[1/2] Stopping stack to prepare for clean start...');
  try {
    const stop = await fetchJSON(`${base}/stacks/${stackId}/stop?endpointId=${endpointId}`, { method: 'POST', headers });
    console.log('Stop status:', stop.status);
  } catch (e) {
    console.log('Stop result/timeout:', e.message);
  }

  await new Promise(r => setTimeout(r, 4000));

  console.log('[2/2] Starting stack (Portainer builds/runs updated compose)...');
  try {
    const start = await fetchJSON(`${base}/stacks/${stackId}/start?endpointId=${endpointId}`, { method: 'POST', headers });
    console.log('Start status:', start.status);
  } catch (e) {
    console.log('Start triggered (async timeout):', e.message);
  }
}

main().catch(e => console.error('FATAL:', e));
