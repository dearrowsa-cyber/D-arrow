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
    console.log('Authenticating Portainer...');
    const authRes = await fetchJSON(`${base}/auth`, {
      method: 'POST',
      body: JSON.stringify({ username: 'd-arrow', password: 'D-Arrow.2026' })
    });
    
    const token = authRes.data.jwt;
    const headers = { 'Authorization': `Bearer ${token}` };
    const envId = 3;

    // Get d-arrow-app-new container
    const containersRes = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/json?all=true`, { headers });
    const appContainer = containersRes.data.find(c => c.Names.includes('/d-arrow-app-new'));

    if (!appContainer) {
      console.log('App container not found');
      return;
    }

    console.log('App container ID:', appContainer.Id);
    console.log('App networks:', Object.keys(appContainer.NetworkSettings.Networks));

    // Test pinging / fetching ollama endpoints from inside appContainer
    const script = `
      node -e '
        const http = require("http");
        const endpoints = [
          "http://ollama:11434/api/tags",
          "http://172.17.0.1:11434/api/tags",
          "http://host.docker.internal:11434/api/tags",
          "http://172.18.0.1:11434/api/tags"
        ];
        endpoints.forEach(url => {
          const req = http.get(url, (res) => {
            console.log(url, "STATUS:", res.statusCode);
          });
          req.on("error", (err) => console.log(url, "ERROR:", err.message));
          req.setTimeout(2000, () => req.destroy());
        });
      '
    `;

    const execBody = JSON.stringify({
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
      Cmd: ['sh', '-c', script]
    });

    const execRes = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/${appContainer.Id}/exec`, {
      method: 'POST',
      headers,
      body: execBody
    });

    const startRes = await fetchJSON(`${base}/endpoints/${envId}/docker/exec/${execRes.data.Id}/start`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ Detach: false })
    });

    console.log('\n--- NETWORK TEST OUTPUT FROM APP CONTAINER ---');
    console.log(typeof startRes.data === 'string' ? startRes.data : JSON.stringify(startRes.data));

  } catch (err) {
    console.error('Error:', err);
  }
}

main();
