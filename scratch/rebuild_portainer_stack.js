const https = require('https');
const fs = require('fs');
const path = require('path');
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

  const stacks = await fetchJSON(`${base}/stacks`, { headers });
  const stack = (stacks.data || []).find(s => s.Name.includes('d-arrow'));
  
  const composePath = path.join(__dirname, '..', 'docker-compose.yml');
  const stackFileContent = fs.readFileSync(composePath, 'utf8');

  console.log(`Updating Stack ID=${stack.Id} with Prune=true and pullImage=true...`);
  
  const patch = {
    StackFileContent: stackFileContent,
    Env: stack.Env,
    Prune: true,
    PullImage: true
  };

  const putUrl = `${base}/stacks/${stack.Id}?endpointId=${endpointId}&pullImage=true&prune=true`;
  const putRes = await fetchJSON(putUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify(patch)
  });

  console.log('PUT Response Status:', putRes.status);
  console.log('PUT Response Data:', putRes.data);
}

main().catch(e => console.error('FATAL:', e));
