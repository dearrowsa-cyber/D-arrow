const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      agent,
      headers: options.headers || {},
      timeout: 120000
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
  const auth = await fetchJSON(`${base}/auth`, {
    method: 'POST',
    body: JSON.stringify({ username: 'd-arrow', password: 'D-Arrow.2026' })
  });
  const token = auth.data.jwt;
  const headers = { 'Authorization': `Bearer ${token}` };
  const envId = 3;

  // Get app container
  const cs = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/json?all=true`, { headers });
  const app = (cs.data || []).find(c => (c.Names || []).some(n => /d-arrow-app/.test(n)));
  if (!app) { console.log('App container not found'); return; }
  console.log('App container:', app.Id.slice(0,12));

  // Step 1: Run prisma db push
  console.log('\n[1/3] Running prisma db push inside container...');
  const execCreate1 = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/${app.Id}/exec`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      AttachStdout: true,
      AttachStderr: true,
      Cmd: ['sh', '-c', 'npx prisma db push --accept-data-loss 2>&1']
    })
  });
  console.log('Exec create:', execCreate1.status, execCreate1.data?.Id ? 'OK' : JSON.stringify(execCreate1.data));
  
  if (execCreate1.data?.Id) {
    const startRes = await fetchJSON(`${base}/endpoints/${envId}/docker/exec/${execCreate1.data.Id}/start`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ Detach: true })
    });
    console.log('Exec start:', startRes.status);
    
    // Wait for it to finish
    console.log('Waiting 15s for prisma db push to complete...');
    await new Promise(r => setTimeout(r, 15000));
    
    // Check exec status
    const inspect = await fetchJSON(`${base}/endpoints/${envId}/docker/exec/${execCreate1.data.Id}/json`, { headers });
    console.log('Exec finished:', inspect.data?.Running === false ? 'YES' : 'still running', 'ExitCode:', inspect.data?.ExitCode);
  }

  // Step 2: Run prisma generate (just in case)
  console.log('\n[2/3] Running prisma generate...');
  const execCreate2 = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/${app.Id}/exec`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      AttachStdout: true,
      AttachStderr: true,
      Cmd: ['sh', '-c', 'npx prisma generate 2>&1']
    })
  });
  if (execCreate2.data?.Id) {
    await fetchJSON(`${base}/endpoints/${envId}/docker/exec/${execCreate2.data.Id}/start`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ Detach: true })
    });
    console.log('Exec start:', 'OK');
    await new Promise(r => setTimeout(r, 8000));
  }

  // Step 3: Check what tables exist now
  console.log('\n[3/3] Checking database tables...');
  const pg = (cs.data || []).find(c => (c.Names || []).some(n => /d-arrow-postgres/.test(n)));
  if (pg) {
    const execPg = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/${pg.Id}/exec`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ['sh', '-c', "psql -U darrow -d darrow -c \"SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;\" 2>&1"]
      })
    });
    if (execPg.data?.Id) {
      const startPg = await fetchJSON(`${base}/endpoints/${envId}/docker/exec/${execPg.data.Id}/start`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ Detach: false, Tty: false })
      });
      console.log('Tables result:', typeof startPg.data === 'string' ? startPg.data.replace(/[\x00-\x08]/g, '') : JSON.stringify(startPg.data));
    }
  }

  console.log('\nDone! You may need to restart the app container for changes to take effect.');
}

main().catch(e => console.error('FATAL:', e));
