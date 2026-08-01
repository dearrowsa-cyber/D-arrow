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

    // Get ollama container
    const containersRes = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/json?all=true`, { headers });
    const ollamaContainer = containersRes.data.find(c => c.Names.includes('/ollama'));

    // Benchmark GLM-4 via `ollama run`
    console.log('\nBenchmarking glm4:latest in Ollama...');
    const startTime = Date.now();
    const execBody = JSON.stringify({
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
      Cmd: ['ollama', 'run', 'glm4:latest', 'مرحبا، عرف بنفسك في سطر واحد']
    });

    const execRes = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/${ollamaContainer.Id}/exec`, {
      method: 'POST',
      headers,
      body: execBody
    });

    const startRes = await fetchJSON(`${base}/endpoints/${envId}/docker/exec/${execRes.data.Id}/start`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ Detach: false })
    });

    const elapsed = Date.now() - startTime;
    console.log(`GLM-4 Execution time: ${elapsed}ms`);
    console.log('Response:', typeof startRes.data === 'string' ? startRes.data : JSON.stringify(startRes.data));

  } catch (err) {
    console.error('Error:', err);
  }
}

main();
