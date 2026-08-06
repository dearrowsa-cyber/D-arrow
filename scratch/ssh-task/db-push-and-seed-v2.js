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

  const cs = await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/json?all=true`, { headers });
  const list = Array.isArray(cs.data) ? cs.data : [];
  const app = list.find(c => (c.Names || []).some(n => /d-arrow-app/.test(n)));
  if (!app) { console.error('d-arrow-app container not found.'); process.exit(2); }
  console.log(`App container: ${app.Id.substring(0, 16)}...  State=${app.State}`);
  if (app.State !== 'running') {
    console.log('Starting container...');
    await fetchJSON(`${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/${app.Id}/start`, { method: 'POST', headers });
    await sleep(25000);
  }

  // Step 0: print relevant env vars (masked) so we know what connection string was actually set.
  const envOut = await runExec(endpointId, app.Id,
    `cd /app && for v in DATABASE_URL POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DATABASE PGHOST PGDATABASE PGUSER PGPASSWORD NEXT_PUBLIC_APP_URL; do printf '%s=' "$v"; val=$(printenv "$v"); if [ "$v" = "POSTGRES_PASSWORD" ] || [ "$v" = "PGPASSWORD" ] || [ "$v" = "DATABASE_URL" ]; then printf '%.12s...\\n' "$val"; else printf '%s\\n' "$val"; fi; done`,
    'Step 0/4: Inspect env vars (passwords masked)');

  // Step 1: prisma db push using node_modules/.bin/prisma directly, HOME=/tmp
  await runExec(endpointId, app.Id,
    `export HOME=/tmp && export NPM_CONFIG_CACHE=/tmp/.npm-cache && mkdir -p /tmp/.npm-cache && cd /app && ./node_modules/.bin/prisma db push --skip-generate 2>&1 | tail -40`,
    'Step 1/4: Prisma db push — create all tables in Postgres');

  await sleep(4000);

  // Step 2: Quick raw query — SeoMeta count + BlogPost count
  await runExec(endpointId, app.Id,
    `export HOME=/tmp && cd /app && node -e '
const {PrismaClient}=require("./node_modules/.prisma/client") || require("@prisma/client");
const p=new PrismaClient();
(async()=>{
  const [seo,blog,prod]=await Promise.all([
    p.$queryRawUnsafe(\`SELECT COUNT(*)::int AS c FROM "SeoMeta"\`).catch(e=>([{c:"-err:"+e.message}])[0]?.c||"err"),
    p.$queryRawUnsafe(\`SELECT COUNT(*)::int AS c FROM "BlogPost"\`).catch(e=>([{c:"err:"+e.message}])[0]?.c||"err"]),
    p.$queryRawUnsafe(\`SELECT COUNT(*)::int AS c FROM "Product"\`).catch(e=>([{c:"err:"+e.message}])[0]?.c||"err"])
  ]);
  console.log("SeoMeta rows =", seo[0]?.c ?? JSON.stringify(seo));
  console.log("BlogPost rows =", blog[0]?.c ?? JSON.stringify(blog));
  console.log("Product rows  =", prod[0]?.c ?? JSON.stringify(prod));
  await p.$disconnect();
})().catch(e=>{console.error(e);process.exit(1)});
'`,
    'Step 2/4: Raw counts via Prisma — SeoMeta / BlogPost / Product table counts');

  // Step 3: seed default seoMeta + one sample store + first post + one product via Prisma upsert
  await runExec(endpointId, app.Id,
    `export HOME=/tmp && cd /app && node -e '
const {PrismaClient}=require("@prisma/client");
const p=new PrismaClient();
(async()=>{
  const appUrl=process.env.NEXT_PUBLIC_APP_URL || "https://d-arrow.com";
  const defaults=[
    {slug:"/",title:"D-Arrow | Digital Marketing Agency KSA",titleEn:"D-Arrow | Digital Marketing Agency KSA",description:"Full-service digital marketing, SEO paid ads web design Riyadh Jeddah",descriptionEn:"Full-service digital marketing, SEO, paid ads, and web design.",focusKeyword:"digital marketing Saudi Arabia",focusKeywordEn:"digital marketing Saudi Arabia",canonicalUrl:appUrl,robots:"index, follow",schemaType:"Organization",ogTitle:"D-Arrow | Digital Marketing Agency KSA",ogDescription:"Grow revenue with D-Arrow — the Saudi digital marketing experts."},
    {slug:"/services",title:"Services | D-Arrow",titleEn:"Services | D-Arrow",description:"SEO paid advertising social media web design apps development Saudi",descriptionEn:"SEO, paid ads, social media, web design & apps development.",focusKeyword:"digital marketing services",focusKeywordEn:"digital marketing services",robots:"index, follow"},
    {slug:"/pricing",title:"Pricing | D-Arrow",titleEn:"Pricing | D-Arrow",description:"Flexible pricing plans for digital marketing",descriptionEn:"Flexible pricing plans. Marketing packages.",focusKeyword:"marketing pricing packages Saudi focusKeywordEn:"marketing pricing packages Saudi robots:"index, follow"},
    {slug:"/store",title:"DA Store | D-Arrow",titleEn:"DA Store | D-Arrow",description:"Digital products marketing tools templatesdescriptionEn:"Digital products, marketing tools, templates by D-Arrow",focusKeyword:"digital marketplace Saudi",focusKeywordEn:"digital marketplace Saudi robots:"index, follow",schemaType:"Store"},
    {slug:"/blog",title:"Blog | D-Arrow",titleEn:"Blog | D-Arrow",description:"Marketing guides insights guides Saudi.",descriptionEn:"Marketing insights and guides.",focusKeyword:"marketing blog KSA",focusKeywordEn:"marketing blog KSA",robots:"index, follow",schemaType:"Blog"},
    {slug:"/about",title:"About | D-Arrow",titleEn:"About | D-Arrow",description:"About D-Arrow marketing agency Saudi Arabia",descriptionEn:"About D-Arrow — the Saudi marketing agency.",focusKeyword:"D-Arrow agency",focusKeywordEn:"D-Arrow agency",robots:"index, follow"},
    {slug:"/contact",title:"Contact | D-Arrow",titleEn:"Contact | D-Arrow",description:"Contact DdescriptionEn:"Contact D-Arrow digital marketing agency.",focusKeyword:"contact D-Arrow",focusKeywordEn:"contact D-Arrow",robots:"index, follow"},
  ];
  let ups=0;
  for (const u of defaults) try { await p.seoMeta.upsert({where:{slug:u.slug},create:u,update:u}); ups++; } catch(e){ console.log("skip seo "+u.slug+": "+e.message); }
  console.log("SEO upserted:", ups);

  // 2 sample blog posts
  let bp=0;
  const posts=[
    {slug:"guide-seo-saudi-2026",title:"دليل تحسين محركات البحث SEO للسوق السعودي 2026",titleAr:"دليل تحسين محركات البحث SEO للسوق السعودي 2026",titleEn:"Saudi SEO Guide 2026",content:"محتوى تفاعلي شامل لتحسين المواقع السعودية لجوجل",contentAr:"محتوى تفاعلي شامل لتحسين المواقع السعودية لجوجل",excerpt:"استراتيجيات SEO 2026 للمشاريع السعودية",excerptAr:"استراتيجيات SEO لعام 2026 للمشاريع السعودية",author:"D-Arrow Team",category:"Digital Marketing",categoryAr:"التسويق الرقمي",date:"2026-08-01",time:"10:00",readTime:7,imageUrl:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",tags:"SEO,Saudi,DigitalMarketing",status:"published",isGated:false,ctaType:"default"},
    {slug:"real-estate-marketing-ksa",title:"تسويق العقارات في السعودية",titleAr:"تسويق العقارات في السعودية",titleEn:"Real Estate Marketing KSA",content:"طرق حديثة لتسويق المشاريع العقارية",contentAr:"طرق حديثة لتسويق المشاريع العقارية",excerpt:"أفضل استراتيجيات تسويق عقارات في السعودية",excerptAr:"أفضل استراتيجيات تسويق عقارات في السعودية",author:"D-Arrow Team",category:"Marketing",categoryAr:"تسويق",date:"2026-08-05",time:"14:30",readTime:5,imageUrl:"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200",tags:"RealEstate,Marketing,Saudi",status:"published",isGated:false,ctaType:"default"},
  ];
  for (const b of posts) try { await p.blogPost.upsert({where:{slug:b.slug},create:b,update:b}); bp++; } catch(e){ console.log("skip post "+b.slug+": "+e.message); }
  console.log("Blog posts upserted:", bp);

  // 3 sample store products (matches catalog)
  let pp=0;
  const products=[
    {name:"Real Estate Template",nameAr:"قالب تسويق العقارات",slug:"real-estate-template",description:"Saudi-market real estate template with RTL Arabic WhatsApp CTA.",descriptionAr:"قالب تسويق عقارات سوق السعودية بدعم RTL عربي واتساب",price:299,salePrice:199,currency:"SAR",images:"[\"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200\"]",category:"Template",categoryAr:"قالب",type:"template",downloadUrl:"/demo/real-estate",features:"[\"RTL/Arabic\",\"Advanced search\",\"Property gallery\",\"Agent cards\"]",featuresAr:"[\"دعم عربي\",\"بحث متقدم\",\"معرض صور\",\"بطاقات وكلاء\"]",status:"published",featured:true},
    {name:"Store Template",nameAr:"قالب المتجر الإلكتروني",slug:"store-template",description:"DA Store product catalog templatedescriptionAr:"قالب كتالوج منتجات ومتجر رقمي",price:399,salePrice:299,currency:"SAR",images:"[\"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200\"]",category:"Template",categoryAr:"قالب",type:"template",downloadUrl:"/demo/store",features:"[\"Cart\",\"Stripe ready\",\"Admin panel\",\"SEO optimized\"]",featuresAr:"[\"عربة تسوق\",\"جاهز لاستريب\",\"لوحة إدارة\",\"SEO\"]",status:"published",featured:true},
    {name:"Marketing Starter Kit",nameAr:"حزمة البداية للتسويق الرقمي",slug:"marketing-starter-kit",description:"Checklists, templates guides for startup marketing Saudi",descriptionAr:"قوائم وقوالب وإرشادات تسويق رقمي للمشاريع الناشئة",price:149,currency:"SAR",images:"[\"https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200\"]",category:"Bundle",categoryAr:"حزمة",type:"digital",downloadUrl:"",features:"[\"10 checklists\",\"Social templates\",\"SEO workbook\",\"Ads copy templates\"]",featuresAr:"[\"10 قوائم تدقيق\",\"قوالب سوشيال\",\"دليل SEO\",\"قوالب إعلانات\"]",status:"published",featured:false},
  ];
  for (const pr of products) try { await p.product.upsert({where:{slug:pr.slug},create:pr,update:pr}); pp++; } catch(e){ console.log("skip product "+pr.slug+": "+e.message); }
  console.log("Products upserted:", pp);
  await p.$disconnect();
})().catch(e=>{console.error(e);process.exit(1)});
'`,
    'Step 3/4: Seed default SEO + 2 sample blog posts + 3 store products');

  // Step 4: Final logs sanity
  console.log('\nStep 4/4: App logs, tail 20');
  await sleep(8000);
  const logs = await fetchJSON(
    `${PORTAINER_BASE}/endpoints/${endpointId}/docker/containers/${app.Id}/logs?stdout=true&stderr=true&tail=20&timestamps=false`,
    { headers }
  );
  let text = '';
  if (typeof logs.data === 'string') text = logs.data;
  else if (Array.isArray(logs.data)) text = logs.data.join('\n');
  console.log(text.replace(/\u0000/g, ''));

  console.log('\nDeployment complete. Portainer: https://apps.d-arrow.com/');
}

run().catch(e => { console.error('FATAL:', e); process.exit(99); });
