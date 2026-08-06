const https = require('https');
const fs = require('fs');
const path = require('path');
const agent = new https.Agent({ rejectUnauthorized: false });

function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname, port: u.port || 443,
      path: u.pathname + u.search, method: options.method || 'GET',
      agent, headers: options.headers || {}, timeout: 60000
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

  const cs = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/json?all=true`, { headers });
  const pg = (cs.data || []).find(c => (c.Names || []).some(n => /d-arrow-postgres/.test(n)));
  if (!pg) { console.log('Postgres not found'); return; }
  console.log('Found postgres:', pg.Id.slice(0,12), pg.State);

  // Read migration SQL
  const sqlFile = path.join(__dirname, '..', 'prisma', 'migrations', '20260806000001_init', 'migration.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');
  
  // Also create the _prisma_migrations table so Prisma knows migration was applied
  const fullSql = `
-- Create tables (ignore if exist)
${sql}

-- Mark migration as applied in Prisma's tracking table
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" VARCHAR(36) NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMPTZ,
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMPTZ,
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY ("id")
);

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "applied_steps_count")
VALUES (gen_random_uuid()::text, 'manual_apply', now(), '20260806000001_init', 1)
ON CONFLICT DO NOTHING;
  `.trim();

  // Escape single quotes in SQL for shell command
  const escapedSql = fullSql.replace(/'/g, "'\"'\"'");

  console.log('\nExecuting migration SQL directly on postgres...');
  const execCreate = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/${pg.Id}/exec`, {
    method: 'POST', headers,
    body: JSON.stringify({
      AttachStdout: true,
      AttachStderr: true,
      Cmd: ['psql', '-U', 'darrow', '-d', 'darrow', '-c', fullSql]
    })
  });
  console.log('Exec create:', execCreate.status, execCreate.data?.Id ? 'OK' : JSON.stringify(execCreate.data));

  if (execCreate.data?.Id) {
    const startRes = await fetchJSON(`${base}/endpoints/${envId}/docker/exec/${execCreate.data.Id}/start`, {
      method: 'POST', headers,
      body: JSON.stringify({ Detach: false, Tty: false })
    });
    const out = typeof startRes.data === 'string' ? startRes.data.replace(/[\x00-\x08]/g, '') : JSON.stringify(startRes.data);
    console.log('Result:', out);
  }

  // Verify tables
  console.log('\n--- Verifying tables ---');
  const execVerify = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/${pg.Id}/exec`, {
    method: 'POST', headers,
    body: JSON.stringify({
      AttachStdout: true, AttachStderr: true,
      Cmd: ['psql', '-U', 'darrow', '-d', 'darrow', '-c', "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;"]
    })
  });
  if (execVerify.data?.Id) {
    const v = await fetchJSON(`${base}/endpoints/${envId}/docker/exec/${execVerify.data.Id}/start`, {
      method: 'POST', headers,
      body: JSON.stringify({ Detach: false, Tty: false })
    });
    const out = typeof v.data === 'string' ? v.data.replace(/[\x00-\x08]/g, '') : JSON.stringify(v.data);
    console.log(out);
  }
}

main().catch(e => console.error('FATAL:', e));
