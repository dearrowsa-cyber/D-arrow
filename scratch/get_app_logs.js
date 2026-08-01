const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

async function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      agent,
      headers: options.headers || {}
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
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function main() {
  try {
    const base = 'https://apps.d-arrow.com/api';
    const authRes = await fetchJSON(`${base}/auth`, {
      method: 'POST',
      body: JSON.stringify({ username: 'd-arrow', password: 'D-Arrow.2026' })
    });
    
    const token = authRes.data.jwt;
    const headers = { 'Authorization': `Bearer ${token}` };
    const envId = 3;

    // Get d-arrow-app-new container ID
    const containersRes = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/json?all=true`, { headers });
    const appContainer = containersRes.data.find(c => c.Names.includes('/d-arrow-app-new'));

    console.log('Fetching logs for app container:', appContainer.Id);

    const logsRes = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/${appContainer.Id}/logs?stdout=true&stderr=true&tail=100`, { headers });

    console.log('\n--- APP CONTAINER LOGS ---');
    console.log(typeof logsRes.data === 'string' ? logsRes.data : JSON.stringify(logsRes.data));

  } catch (err) {
    console.error('Error:', err);
  }
}

main();
