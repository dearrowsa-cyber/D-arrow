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

async function run() {
  try {
    const base = 'https://apps.d-arrow.com/api';
    
    // Authenticate
    console.log('Authenticating...');
    const res = await fetchJSON(`${base}/auth`, {
      method: 'POST',
      body: JSON.stringify({ username: 'd-arrow', password: 'D-Arrow.2026' })
    });
    const token = res.data.jwt;
    const headers = { 'Authorization': `Bearer ${token}` };
    console.log('✅ Authenticated');

    // Get Endpoint
    const endpointsRes = await fetchJSON(`${base}/endpoints`, { headers });
    const endpointId = endpointsRes.data[0].Id;
    console.log(`Endpoint ID: ${endpointId}`);

    // Get Stacks
    const stacksRes = await fetchJSON(`${base}/stacks`, { headers });
    const stack = stacksRes.data.find(s => s.Name.includes('d-arrow'));
    if (!stack) {
      console.log('Stack not found');
      return;
    }
    console.log(`Found stack: ${stack.Name} (ID: ${stack.Id})`);

    // Force update the stack with pullImage = true and clear cache
    console.log('Forcing stack update and pull...');
    const updateRes = await fetchJSON(`${base}/stacks/${stack.Id}/git/redeploy?endpointId=${endpointId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        env: stack.Env || [],
        prune: true,
        pullImage: true
      })
    });
    
    console.log(`Update status: ${updateRes.status}`);
    console.log('Response:', updateRes.data);

    if (updateRes.status === 200 || updateRes.status === 204) {
      console.log('✅ Stack redeployed successfully!');
    }

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
