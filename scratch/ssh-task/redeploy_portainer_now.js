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

    console.log('Step 1: Authenticating...');
    const authRes = await fetchJSON(`${base}/auth`, {
      method: 'POST',
      body: JSON.stringify({ username: 'd-arrow', password: 'D-Arrow.2026' })
    });
    const token = authRes.data.jwt;
    const headers = { 'Authorization': `Bearer ${token}` };
    console.log('✅ Authenticated');

    const endpointsRes = await fetchJSON(`${base}/endpoints`, { headers });
    const endpointId = endpointsRes.data[0].Id;
    console.log(`Endpoint ID: ${endpointId}`);

    const stacksRes = await fetchJSON(`${base}/stacks`, { headers });
    const stack = stacksRes.data.find(s => s.Name.includes('d-arrow'));
    if (!stack) {
      console.log('Stack not found');
      return;
    }
    console.log(`Found stack: ${stack.Name} (ID: ${stack.Id}, Status: ${stack.Status}, Type: ${stack.Type})`);
    console.log(`SwarmID: ${stack.SwarmId || 'local/standalone'}`);

    // Step: Start the stopped stack (images were deleted so this forces a rebuild)
    console.log('\nStep 2: Starting stack (will rebuild image since old ones were deleted)...');
    const startRes = await fetchJSON(`${base}/stacks/${stack.Id}/start?endpointId=${endpointId}`, {
      method: 'POST',
      headers
    });
    console.log(`Start status: ${startRes.status}`);
    if (startRes.status === 200 || startRes.status === 204) {
      console.log('✅ Stack started successfully — rebuilding fresh image now!');
    } else {
      console.log('Start response:', startRes.data);
    }

    // Step: Poll status a couple times to confirm it transitions out of "inactive"
    console.log('\nStep 3: Polling status...');
    for (let i = 0; i < 6; i++) {
      await new Promise(r => setTimeout(r, 10000));
      const poll = await fetchJSON(`${base}/stacks/${stack.Id}?endpointId=${endpointId}`, { headers });
      const status = poll.data?.Status || poll.status;
      console.log(`  Status after ${(i + 1) * 10}s: ${JSON.stringify(status)}`);
      if (typeof status === 'string' && status.includes('active')) {
        console.log('✅ Stack now active!');
        break;
      }
    }

    // Check the container directly
    console.log('\nStep 4: Checking container status...');
    const containers = await fetchJSON(`${base}/endpoints/${endpointId}/docker/containers/json?all=true`, { headers });
    const app = Array.isArray(containers.data)
      ? containers.data.find(c => (c.Names || []).some(n => n.includes('d-arrow-app')))
      : null;
    if (app) {
      console.log(`  Container: ${app.Id?.substring(0, 19)}...  Status=${app.Status}  State=${app.State}  Image=${app.Image}`);
      console.log(`  Ports: ${JSON.stringify(app.Ports)}`);
    } else {
      console.log('  Container not found (build still running or image build failed)');
    }

    // If build is still running, show the last 20 container logs after delay
    if (app && app.State === 'running') {
      await new Promise(r => setTimeout(r, 20000));
      console.log('\nStep 5: Latest container logs (last 30 lines)...');
      const logs = await fetchJSON(`${base}/endpoints/${endpointId}/docker/containers/${app.Id}/logs?stdout=true&stderr=true&tail=30`, { headers });
      if (typeof logs.data === 'string') {
        console.log(logs.data.split('\n').map(l => l.replace(/\u0000/g, '')).join('\n'));
      } else if (Array.isArray(logs.data)) {
        console.log(logs.data.map(l => l.replace?.(/\u0000/g, '') || l).join('\n'));
      } else {
        console.log('Logs response type:', typeof logs.data);
      }
    }

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
