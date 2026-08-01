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

    // Get n8n-ollama-shared network ID
    const nets = await fetchJSON(`${base}/endpoints/${envId}/docker/networks`, { headers });
    const sharedNet = nets.data.find(n => n.Name === 'n8n-ollama-shared');
    
    // Get d-arrow-app-new container ID
    const containersRes = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/json?all=true`, { headers });
    const appContainer = containersRes.data.find(c => c.Names.includes('/d-arrow-app-new'));

    console.log(`Shared Net ID: ${sharedNet.Id}`);
    console.log(`App Container ID: ${appContainer.Id}`);

    // Connect appContainer to sharedNet
    console.log('Connecting d-arrow-app-new to n8n-ollama-shared network...');
    const connectRes = await fetchJSON(`${base}/endpoints/${envId}/docker/networks/${sharedNet.Id}/connect`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        Container: appContainer.Id
      })
    });

    console.log('Connect status:', connectRes.status);
    console.log('Connect response:', connectRes.data);

    // Now test pinging http://ollama:11434 from inside appContainer
    const script = `
      node -e '
        const http = require("http");
        const req = http.get("http://ollama:11434/api/tags", (res) => {
          let data = "";
          res.on("data", c => data += c);
          res.on("end", () => console.log("OLLAMA RESPONSE:", res.statusCode, data.substring(0, 200)));
        });
        req.on("error", (err) => console.log("OLLAMA ERROR:", err.message));
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

    console.log('\n--- NETWORK VERIFICATION FROM APP CONTAINER ---');
    console.log(typeof startRes.data === 'string' ? startRes.data : JSON.stringify(startRes.data));

  } catch (err) {
    console.error('Error:', err);
  }
}

main();
