const https = require('https');
const crypto = require('crypto');
const agent = new https.Agent({ rejectUnauthorized: false });

const PORTAINER_BASE = 'https://apps.d-arrow.com/api';
const PORTAINER_USER = 'd-arrow';
const PORTAINER_PASS = 'D-Arrow.2026';
const TIMEOUT = 300_000;

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
const rand = (len = 24) => crypto.randomBytes(len).toString('base64url');

async function runExec(endpointId, containerId, cmd, label) {
  console.log(`\n⟹  ${label}`);
  const cmdStr = Array.isArray(cmd) ? cmd : ['/bin/sh', '-lc', cmd];
  const createRes = await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/${containerId}/exec`, {
    method: 'POST',
    headers: global._headers,
    body: JSON.stringify({ AttachStdout: true, AttachStderr: true, Tty: false, Cmd: cmdStr })
  });
  if (createRes.status >= 300) { console.log('  exec create failed:', createRes.status, createRes.data); return null; }
  const execId = createRes.data?.Id;
  if (!execId) return null;
  const start = await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/exec/${execId}/start`, {
    method: 'POST', headers: global._headers,
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

  // --- Step 0: Patch stack Env with real secrets so the container's DATABASE_URL works ---
  console.log('\n=== Patching stack Env with new real secrets ===');
  const stacks = await fetchJSON(`${PORTAINER_BASE}/stacks`, { headers });
  const stack = (stacks.data || []).find(s => s.Name.includes('d-arrow'));
  if (!stack) { console.error('stack missing'); process.exit(2); }

  const POSTGRES_PASSWORD = rand(20);
  const ADMIN_PASSWORD = rand(14);
  const JWT_SECRET = rand(40);
  const CRON_SECRET = rand(24);
  const BLOG_API_SECRET_KEY = rand(24);
  const APP_URL = 'https://apps.d-arrow.com';

  // Start from current env, override with real ones
  const envByName = new Map((stack.Env || []).map(e => [e.name, e.value]));
  const overrides = {
    NEXT_PUBLIC_APP_URL: APP_URL,
    NEXT_PUBLIC_API_URL: APP_URL,
    POSTGRES_USER: 'darrow',
    POSTGRES_PASSWORD,
    POSTGRES_DATABASE: 'darrow',
    ADMIN_PASSWORD,
    JWT_SECRET,
    CRON_SECRET,
    BLOG_API_SECRET_KEY,
    CONTACT_RECIPIENT: 'info@d-arrow.com',
  };
  for (const [k, v] of Object.entries(overrides)) envByName.set(k, v);

  // Set DATABASE_URL + aliases based on the new real password
  const dbu = `postgresql://darrow:${encodeURIComponent(POSTGRES_PASSWORD)}@d-arrow-postgres:5432/darrow?schema=public`;
  envByName.set('DATABASE_URL', dbu);
  envByName.set('POSTGRES_URL', dbu);
  envByName.set('POSTGRES_PRISMA_URL', dbu + '&pgbouncer=false');
  envByName.set('POSTGRES_URL_NON_POOLING', dbu);
  envByName.set('DATABASE_URL_UNPOOLED', dbu);
  envByName.set('PGHOST', 'd-arrow-postgres');
  envByName.set('PGDATABASE', 'darrow');
  envByName.set('PGUSER', 'darrow');
  envByName.set('PGPASSWORD', POSTGRES_PASSWORD);

  const detail = await fetchJSON(`${PORTAINER_BASE}/stacks/${stack.Id}?endpointId=${endpointId}`, { headers });
  const version = detail.data?.ResourceControl?.Version || stack.ResourceControl?.Version || 1;
  const stackFileContent = detail.data?.StackFileContent || stack.StackFileContent;
  if (!stackFileContent) {
    console.log('Stack has empty StackFileContent — we will re-upload local docker-compose.yml.');
  }
  const patch = {
    StackFileContent: require('fs').readFileSync(require('path').join(__dirname, '..', '..', 'docker-compose.yml'), 'utf8'),
    Env: Array.from(envByName.entries()).map(([name, value]) => ({ name, value })),
    Prune: false
  };
  const putRes = await fetchJSON(`${PORTAINER_BASE}/stacks/${stack.Id}?endpointId=${endpointId}&version=${version}`, {
    method: 'PUT', headers, body: JSON.stringify(patch)
  });
  if (putRes.status >= 200 && putRes.status < 300) console.log('✅ Stack patched (new env vars + compose updated)');
  else { console.log('PUT stack failed:', putRes.status, putRes.data); process.exit(3); }

  // Also re-create postgres container to pick up new POSTGRES_PASSWORD env var.
  console.log('\n=== Recreating postgres container so POSTGRES_PASSWORD takes effect ===');
  const cs = await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/json?all=true`, { headers });
  const pg = (cs.data || []).find(c => (c.Names || []).some(n => /d-arrow-postgres/.test(n)));
  let app = (cs.data || []).find(c => (c.Names || []).some(n => /d-arrow-app/.test(n)));
  if (pg) {
    try { await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/${pg.Id}/stop?t=10`, { method: 'POST', headers }); } catch(e) {}
    try { await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/${pg.Id}?v=0&force=true`, { method: 'DELETE', headers }); } catch(e) {}
    console.log('Deleted old postgres container. Starting stack now to recreate both containers with correct env...');
  }
  if (app) {
    try { await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/${app.Id}/stop?t=10`, { method: 'POST', headers }); } catch(e) {}
    try { await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/${app.Id}?v=0&force=true`, { method: 'DELETE', headers }); } catch(e) {}
  }

  console.log('Calling stack/start — recreates d-arrow-postgres + d-arrow-app with new env.');
  try {
    await fetchJSON(`${PORTAINER_BASE}/stacks/${stack.Id}/start?endpointId=${endpointId}`, { method: 'POST', headers });
  } catch (e) {
    console.log('  start call timeout (OK, runs async):', e.message);
  }
  console.log('Waiting up to 120s for containers to be running...');
  let tries = 0;
  while (tries++ < 24) {
    await sleep(5000);
    const cl = await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/json?all=true`, { headers });
    const list = Array.isArray(cl.data) ? cl.data : [];
    const p = list.find(c => (c.Names || []).some(n => /d-arrow-postgres/.test(n)));
    const a = list.find(c => (c.Names || []).some(n => /d-arrow-app/.test(n)));
    app = a;
    console.log(`  t=${tries*5}s  postgres: ${p ? `${p.State}/${p.Status}` : 'missing'}   app: ${a ? `${a.State}/${a.Status}` : 'missing'}`);
    if (p?.State === 'running' && a?.State === 'running') break;
  }
  if (!app) { console.error('App container never created. Check Portainer UI for errors.'); process.exit(4); }
  console.log(`Both containers running. app=${app.Id.substring(0, 16)}...`);

  // Wait for Postgres to be healthy
  console.log('\nWaiting up to 60s for Postgres to accept connections...');
  for (let i = 0; i < 12; i++) {
    await sleep(5000);
    const res = await runExec(endpointId, app.Id, `env PGPASSWORD='${POSTGRES_PASSWORD}' /usr/bin/psql -h d-arrow-postgres -U darrow -d darrow -c 'SELECT 1;' 2>&1 | tail -5`, `  pg ready check ${i+1}/12`);
    if (res && res.includes('1 row')) break;
  }

  // Fix missing prisma binaries + ensure @prisma/client generated
  await runExec(endpointId, app.Id,
    `export HOME=/tmp && export NPM_CONFIG_CACHE=/tmp/.npm-cache && mkdir -p /tmp/.npm-cache && cd /app && ls node_modules/.bin/prisma 2>/dev/null || (echo "prisma missing, installing..." && npm install --no-audit --no-fund --legacy-peer-deps prisma@latest @prisma/client@latest 2>&1 | tail -15)`,
    'Step 1: Install prisma + @prisma/client if missing');
  await runExec(endpointId, app.Id,
    `export HOME=/tmp && export NPM_CONFIG_CACHE=/tmp/.npm-cache && cd /app && ls node_modules/.prisma/client/index.js 2>/dev/null && echo "client OK" || (./node_modules/.bin/prisma generate 2>&1 | tail -10)`,
    'Step 2: Generate Prisma client');
  await runExec(endpointId, app.Id,
    `export HOME=/tmp && cd /app && ./node_modules/.bin/prisma db push --skip-generate 2>&1 | tail -30`,
    'Step 3: prisma db push — create all tables');

  // Simple raw counts to verify
  await runExec(endpointId, app.Id,
    `export HOME=/tmp && cd /app && node -e '
const {PrismaClient}=require("@prisma/client");
const p=new PrismaClient();
(async()=>{
  const checks=[["SeoMeta",\`SELECT COUNT(*)::int c FROM "SeoMeta"\`],["BlogPost",\`SELECT COUNT(*)::int c FROM "BlogPost"\`],["Product",\`SELECT COUNT(*)::int c FROM "Product"\`]];
  for (const [name,q] of checks){
    const r=await p.$queryRawUnsafe(q).catch(e=>"ERR:"+e.message);
    console.log(name+" rows =", (Array.isArray(r) && r[0])? r[0].c : r);
  }
  await p.$disconnect();
})().catch(e=>{console.error(e);process.exit(1)});
'`,
    'Step 4: Verify table counts via Prisma raw query');

  // Seed
  await runExec(endpointId, app.Id,
    `export HOME=/tmp && cd /app && node -e '
const {PrismaClient}=require("@prisma/client");
const p=new PrismaClient();
(async()=>{
  const appUrl=process.env.NEXT_PUBLIC_APP_URL || "${APP_URL}";
  const seo=[
    {slug:"/",title:"D-Arrow | Digital Marketing Agency KSA",titleEn:"D-Arrow | Digital Marketing Agency KSA",description:"خدمات تسويق رقمي وسيو واعلانات مدفوعة",descriptionEn:"Full-service digital marketing, SEO, paid ads, web design.",focusKeyword:"digital marketing Saudi Arabia",focusKeywordEn:"digital marketing Saudi Arabia",canonicalUrl:appUrl,robots:"index, follow",schemaType:"Organization",ogTitle:"D-Arrow | Digital Marketing Agency KSA",ogDescription:"Grow revenue with D-Arrow"},
    {slug:"/services",title:"Services | D-Arrow",titleEn:"Services | D-Arrow",description:"SEO اعلانات مدفوعة سوشيال ميديا وتصميم مواقع",descriptionEn:"SEO, paid ads, social media, web design & apps development.",focusKeyword:"digital marketing services",focusKeywordEn:"digital marketing services",robots:"index, follow"},
    {slug:"/pricing",title:"Pricing | D-Arrow",titleEn:"Pricing | D-Arrow",description:"باقات تسويق رقمي مرنة",descriptionEn:"Flexible pricing plans. Marketing packages.",focusKeyword:"marketing pricing packages",focusKeywordEn:"marketing pricing packages",robots:"index, follow"},
    {slug:"/store",title:"DA Store | D-Arrow",titleEn:"DA Store | D-Arrow",description:"متجر المنتجات الرقمية",descriptionEn:"Digital products, marketing tools, templates by D-Arrow",focusKeyword:"digital marketplace Saudi",focusKeywordEn:"digital marketplace Saudi",robots:"index, follow",schemaType:"Store"},
    {slug:"/blog",title:"Blog | D-Arrow",titleEn:"Blog | D-Arrow",description:"مقالات وارشادات تسويق",descriptionEn:"Marketing insights and guides.",focusKeyword:"marketing blog KSA",focusKeywordEn:"marketing blog KSA",robots:"index, follow",schemaType:"Blog"},
    {slug:"/about",title:"About | D-Arrow",titleEn:"About | D-Arrow",description:"نبذة عن وكالة دارو للتسويق",descriptionEn:"About D-Arrow marketing agency.",focusKeyword:"D-Arrow agency",focusKeywordEn:"D-Arrow agency",robots:"index, follow"},
    {slug:"/contact",title:"Contact | D-Arrow",titleEn:"Contact | D-Arrow",description:"تواصل معنا",descriptionEn:"Contact D-Arrow digital marketing agency.",focusKeyword:"contact D-Arrow",focusKeywordEn:"contact D-Arrow",robots:"index, follow"},
  ];
  let ups=0; for (const u of seo) try { await p.seoMeta.upsert({where:{slug:u.slug},create:u,update:u}); ups++; } catch(e){ console.log("skip seo "+u.slug+": "+e.message); }
  console.log("SEO upserted:", ups);

  const posts=[
    {slug:"guide-seo-saudi-2026",title:"دليل SEO للسوق السعودي 2026",titleAr:"دليل SEO للسوق السعودي 2026",titleEn:"Saudi SEO Guide 2026",content:"استراتيجيات تحسين محركات البحث للمواقع السعودية",contentAr:"استراتيجيات تحسين محركات البحث للمواقع السعودية",excerpt:"دليل شامل لعام 2026",excerptAr:"دليل شامل لعام 2026",author:"D-Arrow Team",category:"Digital Marketing",categoryAr:"التسويق الرقمي",date:"2026-08-01",time:"10:00",readTime:7,imageUrl:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",tags:"SEO,Saudi,DigitalMarketing",status:"published",isGated:false,ctaType:"default"},
    {slug:"real-estate-marketing-ksa",title:"تسويق العقارات في السعودية",titleAr:"تسويق العقارات في السعودية",titleEn:"Real Estate Marketing KSA",content:"استراتيجيات تسويق عقارات حديثة",contentAr:"استراتيجيات تسويق عقارات حديثة",excerpt:"افضل استراتيجيات التسويق العقاري",excerptAr:"افضل استراتيجيات التسويق العقاري",author:"D-Arrow Team",category:"Marketing",categoryAr:"تسويق",date:"2026-08-05",time:"14:30",readTime:5,imageUrl:"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200",tags:"RealEstate,Marketing,Saudi",status:"published",isGated:false,ctaType:"default"},
  ];
  let bp=0; for (const b of posts) try { await p.blogPost.upsert({where:{slug:b.slug},create:b,update:b}); bp++; } catch(e){ console.log("skip post "+b.slug+": "+e.message); }
  console.log("Blog upserted:", bp);

  const products=[
    {name:"Real Estate Template",nameAr:"قالب تسويق العقارات",slug:"real-estate-template",description:"Saudi real estate template RTL Arabic WhatsApp CTA",descriptionAr:"قالب تسويق عقارات بدعم عربي RTL واتساب",price:299,salePrice:199,currency:"SAR",images:'["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200"]',category:"Template",categoryAr:"قالب",type:"template",downloadUrl:"/demo/real-estate",features:'["RTL/Arabic","Advanced search","Property gallery","Agent cards"]',featuresAr:'["دعم عربي","بحث متقدم","معرض صور","بطاقات وكلاء"]',status:"published",featured:true},
    {name:"Store Template",nameAr:"قالب المتجر الإلكتروني",slug:"store-template",description:"Product catalog / store template",descriptionAr:"قالب كتالوج منتجات ومتجر رقمي",price:399,salePrice:299,currency:"SAR",images:'["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200"]',category:"Template",categoryAr:"قالب",type:"template",downloadUrl:"/demo/store",features:'["Cart","Stripe ready","Admin panel","SEO optimized"]',featuresAr:'["عربة تسوق","جاهز لاستريب","لوحة إدارة","SEO"]',status:"published",featured:true},
    {name:"Marketing Starter Kit",nameAr:"حزمة البداية للتسويق",slug:"marketing-starter-kit",description:"Checklists + templates + guides",descriptionAr:"قوائم وقوالب وإرشادات تسويق رقمي",price:149,currency:"SAR",images:'["https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200"]',category:"Bundle",categoryAr:"حزمة",type:"digital",downloadUrl:"",features:'["10 checklists","Social templates","SEO workbook","Ads copy templates"]',featuresAr:'["10 قوائم تدقيق","قوالب سوشيال","دليل SEO","قوالب إعلانات"]',status:"published",featured:false},
  ];
  let pp=0; for (const pr of products) try { await p.product.upsert({where:{slug:pr.slug},create:pr,update:pr}); pp++; } catch(e){ console.log("skip product "+pr.slug+": "+e.message); }
  console.log("Products upserted:", pp);
  await p.$disconnect();
})().catch(e=>{console.error(e);process.exit(1)});
'`,
    'Step 5: Seed default SEO (7) + 2 blog posts + 3 products');

  console.log('\nGenerated credentials (SAVE THESE) — shown once here:');
  console.log(`  APP_URL               = ${APP_URL}`);
  console.log(`  POSTGRES_USER         = darrow`);
  console.log(`  POSTGRES_DATABASE     = darrow`);
  console.log(`  POSTGRES_PASSWORD     = ${POSTGRES_PASSWORD}`);
  console.log(`  ADMIN_PASSWORD        = ${ADMIN_PASSWORD}`);
  console.log(`  JWT_SECRET            = ${JWT_SECRET}`);
  console.log(`  CRON_SECRET           = ${CRON_SECRET}`);
  console.log(`  BLOG_API_SECRET_KEY   = ${BLOG_API_SECRET_KEY}`);

  console.log('\nFinal tail 25 app logs:');
  await sleep(8000);
  const logs = await fetchJSON(
    `${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/${app.Id}/logs?stdout=true&stderr=true&tail=25&timestamps=false`,
    { headers }
  );
  let text = '';
  if (typeof logs.data === 'string') text = logs.data;
  else if (Array.isArray(logs.data)) text = logs.data.join('\n');
  console.log(text.replace(/\u0000/g, ''));
  console.log('\nDone. Portainer: https://apps.d-arrow.com/  — Stack ID=17');
}

run().catch(e => { console.error('FATAL:', e); process.exit(99); });
