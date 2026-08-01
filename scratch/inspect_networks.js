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

    // Get networks
    const nets = await fetchJSON(`${base}/endpoints/${envId}/docker/networks`, { headers });
    console.log('--- DOCKER NETWORKS ---');
    nets.data.forEach(n => {
      console.log(`Network [${n.Id.substring(0, 12)}]: ${n.Name} (${n.Driver})`);
    });

    // Get containers and their IP addresses & networks
    const containersRes = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/json?all=true`, { headers });
    console.log('\n--- CONTAINER NETWORKS ---');
    containersRes.data.forEach(c => {
      const netNames = Object.keys(c.NetworkSettings.Networks);
      const ips = netNames.map(n => c.NetworkSettings.Networks[n].IPAddress).join(', ');
      console.log(`Container: ${c.Names.join(', ')} | Networks: ${netNames.join(', ')} | IPs: ${ips}`);
    });

  } catch (err) {
    console.error('Error:', err);
  }
}

main();
