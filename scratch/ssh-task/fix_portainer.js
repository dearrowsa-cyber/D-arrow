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
    
    // Step 1: Authenticate
    console.log('Step 1: Authenticating...');
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
    console.log(`Endpoint ID: ${endpointId}`);

    // Get Stack
    const stacksRes = await fetchJSON(`${base}/stacks`, { headers });
    const stack = stacksRes.data.find(s => s.Name.includes('d-arrow'));
    if (!stack) {
      console.log('Stack not found');
      return;
    }
    console.log(`Found stack: ${stack.Name} (ID: ${stack.Id})`);

    // Step 2: Stop the stack first
    console.log('\nStep 2: Stopping stack...');
    const stopRes = await fetchJSON(`${base}/stacks/${stack.Id}/stop?endpointId=${endpointId}`, {
      method: 'POST',
      headers
    });
    console.log(`Stop status: ${stopRes.status}`);
    if (stopRes.status === 200) {
      console.log('✅ Stack stopped');
    } else {
      console.log('⚠️ Stop response:', stopRes.data);
    }

    // Step 3: Delete old Docker images to bust cache
    console.log('\nStep 3: Cleaning old Docker images...');
    const imagesRes = await fetchJSON(`${base}/endpoints/${endpointId}/docker/images/json?all=false`, { headers });
    if (Array.isArray(imagesRes.data)) {
      const oldImages = imagesRes.data.filter(img => {
        const tags = img.RepoTags || [];
        return tags.some(t => t.includes('d-arrow') || t.includes('17_d-arrow') || t.includes('d_arrow'));
      });
      
      for (const img of oldImages) {
        const imgId = img.Id;
        const tags = (img.RepoTags || []).join(', ');
        console.log(`  Deleting image: ${tags} (${imgId.substring(0, 19)}...)`);
        const delRes = await fetchJSON(`${base}/endpoints/${endpointId}/docker/images/${imgId}?force=true`, {
          method: 'DELETE',
          headers
        });
        console.log(`  Delete status: ${delRes.status}`);
      }
      
      if (oldImages.length === 0) {
        console.log('  No cached d-arrow images found (that is OK)');
      }
    }

    // Step 4: Prune build cache
    console.log('\nStep 4: Pruning Docker build cache...');
    const pruneRes = await fetchJSON(`${base}/endpoints/${endpointId}/docker/build/prune`, {
      method: 'POST',
      headers
    });
    console.log(`Prune status: ${pruneRes.status}`);

    // Step 5: Wait a moment then redeploy
    console.log('\nStep 5: Waiting 5 seconds before redeploy...');
    await new Promise(r => setTimeout(r, 5000));

    // Step 6: Redeploy (fresh build from git)
    console.log('Step 6: Redeploying stack (fresh build from source)...');
    const updateRes = await fetchJSON(`${base}/stacks/${stack.Id}/git/redeploy?endpointId=${endpointId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        env: stack.Env || [],
        prune: true,
        pullImage: false
      })
    });
    
    console.log(`\nRedeploy status: ${updateRes.status}`);
    
    if (updateRes.status === 200 || updateRes.status === 204) {
      console.log('✅ Stack redeployed successfully with fresh build!');
      console.log(`Git hash: ${updateRes.data?.GitConfig?.ConfigHash || 'unknown'}`);
    } else {
      console.log('❌ Redeploy failed:', updateRes.data);
    }

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
