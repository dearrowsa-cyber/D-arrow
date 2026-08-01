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
    console.log('1. Authenticating with Portainer...');
    const authRes = await fetchJSON(`${base}/auth`, {
      method: 'POST',
      body: JSON.stringify({ username: 'd-arrow', password: 'D-Arrow.2026' })
    });
    
    if (!authRes.data.jwt) {
      console.error('Auth failed:', authRes.data);
      return;
    }
    
    const token = authRes.data.jwt;
    const headers = { 'Authorization': `Bearer ${token}` };
    console.log('Authenticated OK!');

    // Get Endpoints
    const endpointsRes = await fetchJSON(`${base}/endpoints`, { headers });
    const endpointId = endpointsRes.data[0].Id;
    console.log(`Endpoint ID: ${endpointId}`);

    // Get Stacks
    const stacksRes = await fetchJSON(`${base}/stacks`, { headers });
    console.log('\n--- STACKS ---');
    stacksRes.data.forEach(s => {
      console.log(`Stack [${s.Id}]: ${s.Name} | Status: ${s.Status}`);
    });

    // Get Containers
    const containersRes = await fetchJSON(`${base}/endpoints/${endpointId}/docker/containers/json?all=true`, { headers });
    console.log('\n--- CONTAINERS ---');
    containersRes.data.forEach(c => {
      console.log(`Container: ${c.Names.join(', ')} | Status: ${c.Status} | Image: ${c.Image}`);
    });

  } catch (err) {
    console.error('Error:', err);
  }
}

main();
