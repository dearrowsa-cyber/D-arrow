const https = require('https');
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
  console.log('[1/5] Authenticating with Portainer...');
  const auth = await fetchJSON(`${base}/auth`, {
    method: 'POST',
    body: JSON.stringify({ username: 'd-arrow', password: 'D-Arrow.2026' })
  });
  const token = auth.data.jwt;
  const headers = { 'Authorization': `Bearer ${token}` };
  const envId = 3;
  const stackId = 17;

  // Step 1: Stop stack first so image is unlocked
  console.log('[2/5] Stopping Stack ID 17...');
  try {
    const stop = await fetchJSON(`${base}/stacks/${stackId}/stop?endpointId=${envId}`, { method: 'POST', headers });
    console.log('      Stop status:', stop.status);
  } catch (e) {
    console.log('      Stop timeout/ok:', e.message);
  }

  await new Promise(r => setTimeout(r, 6000));

  // Step 2: List and delete old d-arrow-app image to FORCE Docker rebuild
  console.log('[3/5] Inspecting & deleting old docker images to force fresh build...');
  const imagesRes = await fetchJSON(`${base}/endpoints/${envId}/docker/images/json`, { headers });
  const allImages = Array.isArray(imagesRes.data) ? imagesRes.data : [];
  const appImages = allImages.filter(img => (img.RepoTags || []).some(t => /d-arrow/.test(t)));

  for (const img of appImages) {
    console.log(`      Deleting image: ${img.RepoTags?.join(', ')} (${img.Id.slice(0,12)})...`);
    try {
      const del = await fetchJSON(`${base}/endpoints/${envId}/docker/images/${img.Id}?force=true`, {
        method: 'DELETE',
        headers
      });
      console.log(`      Delete result:`, del.status);
    } catch (e) {
      console.log(`      Delete err:`, e.message);
    }
  }

  // Step 3: Trigger Stack Start -> Portainer WILL REBUILD FROM FRESH CODE
  console.log('\n[4/5] Starting Stack (Triggers fresh docker build for /demo/store & /demo/real-estate)...');
  try {
    const start = await fetchJSON(`${base}/stacks/${stackId}/start?endpointId=${envId}`, { method: 'POST', headers });
    console.log('      Start call status:', start.status);
  } catch (e) {
    console.log('      Start async call:', e.message);
  }

  console.log('[5/5] Docker build is running in background on server...');
}

main().catch(e => console.error('FATAL:', e));
