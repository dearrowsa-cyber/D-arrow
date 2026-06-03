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

    // Get Stack
    const stacksRes = await fetchJSON(`${base}/stacks`, { headers });
    const stack = stacksRes.data.find(s => s.Name.includes('d-arrow'));
    if (!stack) {
      console.log('Stack not found');
      return;
    }
    console.log(`Found stack: ${stack.Name} (ID: ${stack.Id})`);

    // Check current env vars
    console.log('\n--- Current Environment Variables ---');
    const currentEnv = stack.Env || [];
    const zaiVar = currentEnv.find(e => e.name === 'ZAI_API_KEY');
    console.log(`ZAI_API_KEY current value: ${zaiVar ? zaiVar.value : 'NOT SET'}`);
    
    // Update ZAI_API_KEY
    const newKey = 'abd9bccf64344adb8d720773fb77d60a.PywZnQyqGWfBVBBz';
    
    let updatedEnv;
    if (zaiVar) {
      // Update existing
      updatedEnv = currentEnv.map(e => {
        if (e.name === 'ZAI_API_KEY') {
          return { ...e, value: newKey };
        }
        return e;
      });
    } else {
      // Add new
      updatedEnv = [...currentEnv, { name: 'ZAI_API_KEY', value: newKey }];
    }

    // Get endpoint
    const endpointsRes = await fetchJSON(`${base}/endpoints`, { headers });
    const endpointId = endpointsRes.data[0].Id;

    // Update the stack env vars
    console.log('\nUpdating stack environment variables...');
    const updateRes = await fetchJSON(`${base}/stacks/${stack.Id}?endpointId=${endpointId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        env: updatedEnv,
        stackFileContent: stack.StackFileContent || '',
        prune: false
      })
    });
    
    console.log(`Update status: ${updateRes.status}`);
    if (updateRes.status === 200) {
      // Verify
      const verifyEnv = updateRes.data?.Env || [];
      const verifyZai = verifyEnv.find(e => e.name === 'ZAI_API_KEY');
      console.log(`✅ ZAI_API_KEY updated to: ${verifyZai ? verifyZai.value.substring(0, 10) + '...' : 'UNKNOWN'}`);
    } else {
      console.log('Response:', JSON.stringify(updateRes.data).substring(0, 500));
    }

    // Print all env var names (not values) for reference
    console.log('\n--- All Env Var Names on Server ---');
    const finalEnv = updateRes.data?.Env || updatedEnv;
    for (const e of finalEnv) {
      const masked = e.value ? e.value.substring(0, 8) + '...' : 'EMPTY';
      console.log(`  ${e.name} = ${masked}`);
    }

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
