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

    // Get containers
    console.log('\n=== CONTAINERS ===');
    const containersRes = await fetchJSON(`${base}/endpoints/${endpointId}/docker/containers/json?all=true`, { headers });
    if (Array.isArray(containersRes.data)) {
      for (const c of containersRes.data) {
        const names = (c.Names || []).join(', ');
        if (names.includes('d-arrow') || names.includes('d_arrow')) {
          console.log(`\nContainer: ${names}`);
          console.log(`  State: ${c.State}`);
          console.log(`  Status: ${c.Status}`);
          console.log(`  Image: ${c.Image}`);
          console.log(`  Created: ${new Date(c.Created * 1000).toISOString()}`);
          
          // Get logs for this container
          if (c.State !== 'running') {
            console.log('\n  === CONTAINER LOGS (last 50 lines) ===');
            const logsRes = await fetchJSON(`${base}/endpoints/${endpointId}/docker/containers/${c.Id}/logs?stdout=true&stderr=true&tail=50`, { headers });
            const logText = typeof logsRes.data === 'string' ? logsRes.data : JSON.stringify(logsRes.data);
            // Clean docker log prefixes (binary header bytes)
            const cleanedLogs = logText.replace(/[\x00-\x08]/g, '').replace(/[\x0E-\x1F]/g, '');
            console.log(cleanedLogs.substring(0, 3000));
          } else {
            console.log('\n  === CONTAINER LOGS (last 30 lines) ===');
            const logsRes = await fetchJSON(`${base}/endpoints/${endpointId}/docker/containers/${c.Id}/logs?stdout=true&stderr=true&tail=30`, { headers });
            const logText = typeof logsRes.data === 'string' ? logsRes.data : JSON.stringify(logsRes.data);
            const cleanedLogs = logText.replace(/[\x00-\x08]/g, '').replace(/[\x0E-\x1F]/g, '');
            console.log(cleanedLogs.substring(0, 3000));
          }
        }
      }
    }

    // Get stacks
    console.log('\n\n=== STACKS ===');
    const stacksRes = await fetchJSON(`${base}/stacks`, { headers });
    if (Array.isArray(stacksRes.data)) {
      for (const s of stacksRes.data) {
        if (s.Name.includes('d-arrow')) {
          console.log(`Stack: ${s.Name} (ID: ${s.Id})`);
          console.log(`  Status: ${s.Status === 1 ? 'ACTIVE' : s.Status === 2 ? 'STOPPED' : s.Status}`);
          console.log(`  Git hash: ${s.GitConfig?.ConfigHash || 'N/A'}`);
        }
      }
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
