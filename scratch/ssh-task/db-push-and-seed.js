const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

const PORTAINER_BASE = 'https://apps.d-arrow.com/api';
const PORTAINER_USER = 'd-arrow';
const PORTAINER_PASS = 'D-Arrow.2026';
const TIMEOUT = 240_000;

function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname, port: u.port || 443,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      agent, headers: options.headers || {},
      timeout: TIMEOUT
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
    req.on('timeout', () => req.destroy(new Error(`timeout ${opts.method} ${u.pathname}`)));
    if (options.body) req.write(options.body);
    req.end();
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runExec(endpointId, containerId, cmd, label) {
  console.log(`\n⟹  ${label}`);
  const createRes = await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/${containerId}/exec`, {
    method: 'POST',
    headers: global._headers,
    body: JSON.stringify({
      AttachStdout: true, AttachStderr: true, Tty: false,
      Cmd: ['/bin/sh', '-lc', cmd]
    })
  });
  if (createRes.status >= 300) {
    console.log('  exec create failed:', createRes);
    return null;
  }
  const execId = createRes.data?.Id;
  if (!execId) return null;
  const start = await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/exec/${execId}/start`, {
    method: 'POST',
    headers: global._headers,
    body: JSON.stringify({ Detach: false, Tty: false })
  });
  let text = '';
  if (typeof start.data === 'string') text = start.data;
  else if (typeof start.data === 'object' && start.data !== null) text = JSON.stringify(start.data, null, 2);
  const clean = text.replace(/\u0000/g, '');
  console.log(clean.length ? clean : '(no output)');
  return clean;
}

async function run() {
  console.log('Authing...');
  const auth = await fetchJSON(`${PORTAINER_BASE}/auth`, {
    method: 'POST',
    body: JSON.stringify({ username: PORTAINER_USER, password: PORTAINER_PASS })
  });
  if (!auth.data?.jwt) { console.error('auth fail', auth.data); process.exit(1); }
  const headers = { Authorization: `Bearer ${auth.data.jwt}` };
  global._headers = headers;

  const eps = await fetchJSON(`${PORTAINER_BASE}/endpoints`, { headers });
  const endpointId = eps.data[0].Id;
  console.log(`Endpoint id=${endpointId} (${eps.data[0].Name})`);

  const cs = await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/json?all=true`, { headers });
  const list = Array.isArray(cs.data) ? cs.data : [];
  const app = list.find(c => (c.Names || []).some(n => /d-arrow-app/.test(n)));
  if (!app) { console.error('d-arrow-app container not found. List:', list.map(c => c.Names?.join(','))); process.exit(2); }
  console.log(`App container: ${app.Id.substring(0, 16)}...  State=${app.State}  Status=${app.Status}`);
  if (app.State !== 'running') {
    console.log('App container not running. Attempting start...');
    await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/${app.Id}/start`, { method: 'POST', headers });
    await sleep(20000);
  }

  // Postgres is reachable inside the compose network (d-arrow-postgres:5432). The container
  // already has the prisma schema + client + DATABASE_URL env var set.
  // `prisma db push` will create tables in Postgres directly from schema.prisma.
  await runExec(endpointId, app.Id,
    'cd /app && printenv DATABASE_URL | head -c 80 && echo && npx prisma db push --skip-generate --accept-data-loss 2>&1 | tail -30',
    'Step 1/3: Prisma db push — create all Postgres tables from schema.prisma');

  await sleep(5000);

  // Verify SeoMeta table now exists
  await runExec(endpointId, app.Id,
    'cd /app && node -e \'const {PrismaClient}=require("@prisma/client"); const p=new PrismaClient(); p.$queryRawUnsafe(`SELECT COUNT(*)::int AS c FROM "SeoMeta"`).then(r=>console.log("SeoMeta count=",r[0]?.c)).catch(e=>console.error("ERR:",e.message)).finally(()=>p.$disconnect());\'',
    'Step 2/3: Verify SeoMeta table exists via Prisma raw query');

  // Seed default SEO meta for the homepage and core routes if empty
  await runExec(endpointId, app.Id,
    `cd /app && node -e '
const {PrismaClient}=require("@prisma/client");
const p=new PrismaClient();
(async()=>{
  const upserts=[
    {slug:"/",title:"D-Arrow | Digital Marketing Agency",description:"Full-service digital marketing, web design, and online growth for Saudi brands.",focusKeyword:"digital marketing Saudi Arabia",canonicalUrl:process.env.NEXT_PUBLIC_APP_URL || "https://d-arrow.com",robots:"index, follow",schemaType:"Organization"},
    {slug:"/services",title:"Services | D-Arrow",description:"SEO, paid ads, web design, and social media marketing services.",focusKeyword:"digital marketing services",robots:"index, follow"},
    {slug:"/pricing",title:"Pricing | D-Arrow",description:"Flexible pricing plans for digital marketing.",focusKeyword:"marketing pricing",robots:"index, follow"},
    {slug:"/store",title:"DA Store | D-Arrow",description:"Digital products and templates by D-Arrow.",focusKeyword:"digital marketplace Saudi",robots:"index, follow",schemaType:"Store"},
    {slug:"/blog",title:"Blog | D-Arrow",description:"Marketing insights and guides.",focusKeyword:"marketing blog Saudi",robots:"index, follow",schemaType:"Blog"},
  ];
  let ok=0;
  for (const u of upserts) try{await p.seoMeta.upsert({where:{slug:u.slug},create:u,update:u}); ok++;}catch(e){console.log("skip "+u.slug+": "+e.message);}
  console.log("upserted", ok, "default SEO records");
  await p.$disconnect();
})().catch(e=>{console.error(e);process.exit(1)});
'`,
    'Step 3/3: Seed default SEO meta records for home/services/pricing/store/blog');

  console.log('\nAll done. Polling app container logs in 15s to confirm no more P2021 errors...');
  await sleep(15000);
  const logs = await fetchJSON(
    `${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/${app.Id}/logs?stdout=true&stderr=true&tail=30&timestamps=false`,
    { headers }
  );
  let text = '';
  if (typeof logs.data === 'string') text = logs.data;
  else if (Array.isArray(logs.data)) text = logs.data.join('\n');
  console.log(text.replace(/\u0000/g, ''));

  console.log('\nPortainer UI: https://apps.d-arrow.com/  — Stack ID=17');
}

run().catch(e => { console.error('FATAL:', e); process.exit(99); });
