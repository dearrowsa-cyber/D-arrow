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

    // Get d-arrow-app-new container ID
    const containersRes = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/json?all=true`, { headers });
    const appContainer = containersRes.data.find(c => c.Names.includes('/d-arrow-app-new'));

    // Execute test script using container IP 10.0.3.2
    const script = `
      node -e '
        const http = require("http");
        const body = JSON.stringify({ message: "أبغا تصميم موقع لشركتي", language: "ar" });
        const req = http.request({
          hostname: "10.0.3.2",
          port: 3000,
          path: "/api/chat",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body)
          }
        }, (res) => {
          let data = "";
          res.on("data", c => data += c);
          res.on("end", () => console.log("AI CHAT RESPONSE:", res.statusCode, data));
        });
        req.on("error", (err) => console.log("AI CHAT ERROR:", err.message));
        req.write(body);
        req.end();
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

    console.log('\n--- LIVE CHAT RESPONSE VERIFICATION ---');
    console.log(typeof startRes.data === 'string' ? startRes.data : JSON.stringify(startRes.data));

  } catch (err) {
    console.error('Error:', err);
  }
}

main();
