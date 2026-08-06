const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

function fetchJSON(url, options = {}) {
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
  const base = 'https://apps.d-arrow.com/api';
  const authRes = await fetchJSON(`${base}/auth`, {
    method: 'POST',
    body: JSON.stringify({ username: 'd-arrow', password: 'D-Arrow.2026' })
  });
  const token = authRes.data.jwt;
  const headers = { 'Authorization': `Bearer ${token}` };
  
  const stacks = await fetchJSON(`${base}/stacks`, { headers });
  const allStacks = Array.isArray(stacks.data) ? stacks.data : [];
  const stack = allStacks.find(s => s.Name.includes('d-arrow'));
  
  if (!stack) { console.log('No d-arrow stack found. All stacks:', allStacks.map(s => s.Name)); return; }
  
  console.log('Stack:', stack.Name, 'ID:', stack.Id);
  console.log('\n=== Environment Variables ===');
  for (const e of (stack.Env || [])) {
    // Mask password values for safety
    const val = /password|secret|key|jwt/i.test(e.name) ? e.value.slice(0,4) + '****' : e.value;
    console.log(`  ${e.name} = ${val}`);
  }
}

main().catch(e => console.error('FATAL:', e));
