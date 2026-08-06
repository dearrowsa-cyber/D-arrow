const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });
const fs = require('fs');
const path = require('path');

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

    const authRes = await fetchJSON(`${base}/auth`, {
      method: 'POST',
      body: JSON.stringify({ username: 'd-arrow', password: 'D-Arrow.2026' })
    });
    const token = authRes.data.jwt;
    const headers = { 'Authorization': `Bearer ${token}` };
    console.log('✅ Authenticated');

    const endpointsRes = await fetchJSON(`${base}/endpoints`, { headers });
    const endpointId = endpointsRes.data[0].Id;

    const stacksRes = await fetchJSON(`${base}/stacks`, { headers });
    const stack = stacksRes.data.find(s => s.Name.includes('d-arrow'));

    console.log(`\n--- Stack Info (ID=${stack.Id}) ---`);
    console.log('Name:', stack.Name);
    console.log('Status:', stack.Status, '(1=pending, 2=inactive, 3=active)');
    console.log('Type:', stack.Type, '(1=swarm, 2=compose/standalone)');
    console.log('FromAppTemplate:', stack.FromAppTemplate);
    console.log('ResourceControl:', stack.ResourceControl?.Id);
    console.log('GitConfig:', stack.GitConfig ? JSON.stringify(stack.GitConfig) : 'NOT SET (local stack)');

    console.log('\n--- Current StackFileContent (as Portainer has it): ---');
    console.log(stack.StackFileContent || '(empty)');

    console.log('\n--- Current Env vars (names only) ---');
    (stack.Env || []).forEach(e => console.log(`  ${e.name} = ${(e.value || '').substring(0, 8)}...`));

    // Read the local docker-compose.yml
    const localCompose = fs.readFileSync(path.join(__dirname, '..', '..', 'docker-compose.yml'), 'utf8');
    console.log('\n--- Local repo docker-compose.yml (reference) ---');
    console.log(localCompose);

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
