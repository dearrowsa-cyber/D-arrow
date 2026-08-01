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

    // Get coolify network
    const nets = await fetchJSON(`${base}/endpoints/${envId}/docker/networks`, { headers });
    const coolifyNet = nets.data.find(n => n.Name === 'coolify');

    console.log('Coolify network ID:', coolifyNet ? coolifyNet.Id : 'Not found');

    // Get all containers on coolify network or proxy containers
    const containersRes = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/json?all=true`, { headers });
    console.log('\n--- CONTAINERS ON COOLIFY NETWORK ---');
    containersRes.data.forEach(c => {
      if (c.NetworkSettings.Networks.coolify) {
        console.log(`Container: ${c.Names.join(', ')} | IP: ${c.NetworkSettings.Networks.coolify.IPAddress}`);
      }
    });

    // Run test inside d-arrow-app-new to check if localhost:3000 is listening
    const appContainer = containersRes.data.find(c => c.Names.includes('/d-arrow-app-new'));
    
    const script = `
      node -e '
        const http = require("http");
        http.get("http://0.0.0.0:3000/", (res) => {
          console.log("INTERNAL APP TEST (0.0.0.0:3000):", res.statusCode);
        }).on("error", (err) => console.log("INTERNAL APP ERROR:", err.message));
      '
    `;

    const execRes = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/${appContainer.Id}/exec`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        AttachStdout: true,
        AttachStderr: true,
        Tty: false,
        Cmd: ['sh', '-c', script]
      })
    });

    const startRes = await fetchJSON(`${base}/endpoints/${envId}/docker/exec/${execRes.data.Id}/start`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ Detach: false })
    });

    console.log('\n--- INTERNAL APP LISTEN TEST ---');
    console.log(typeof startRes.data === 'string' ? startRes.data : JSON.stringify(startRes.data));

  } catch (err) {
    console.error('Error:', err);
  }
}

main();
