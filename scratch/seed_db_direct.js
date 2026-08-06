const https = require('https');
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

  const sql = `
  INSERT INTO "Product" (
    "id", "name", "nameAr", "slug", "description", "descriptionAr", "price", "salePrice", "currency", "category", "categoryAr", "type", "downloadUrl", "images", "featuresAr", "status", "featured", "createdAt", "updatedAt"
  ) VALUES 
  (
    'prod_1',
    'Saudi E-Commerce Store & Admin System',
    'قالب المتجر الإلكتروني السعودي المتكامل + لوحة التحكم',
    'saudi-ecommerce-store-system',
    'Full E-Commerce Store Template + Admin Panel',
    'قالب وسكريبت متجر إلكتروني سعودي حديث مجهز بلوحة تحكم وبوابة دفع تفاعلية وتصفح المنتجات.',
    499.0, 299.0, 'SAR', 'Ecommerce', 'متاجر إلكترونية', 'template', '/downloads/ecommerce-store-template.zip',
    '["https://images.unsplash.com/photo-1556742049-0a67e6f49969?auto=format&fit=crop&w=800&q=90"]',
    '["لوحة تحكم احترافية شاملة لإدارة المنتجات والطلبات والعملاء","دعم بوابات الدفع الإلكتروني السعودية (مدى، أبل باي، سداد، فيزا)"]',
    'published', true, NOW(), NOW()
  ),
  (
    'prod_2',
    'Saudi Real Estate Platform & CRM',
    'قالب المنصة العقارية وإدارة الأملاك (Real Estate Platform)',
    'saudi-real-estate-platform',
    'Saudi Real Estate Platform & CRM',
    'نظام متكامل للمكاتب والمطورين العقاريين لعرض المشاريع واستقبال طلبات الشراء والتحليل.',
    899.0, 599.0, 'SAR', 'Real Estate', 'عقارات وتطوير', 'template', '/downloads/real-estate-template.zip',
    '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=90"]',
    '["منظومة فلترة وتصفح العقارات بالمخططات والمدن والأسعار","نظام حجز ومعاينة فورية وربط مع واتساب المستشار العقاري"]',
    'published', true, NOW(), NOW()
  ),
  (
    'prod_3',
    'Influencer Marketing Platform SaaS',
    'منصة تسويق المؤثرين والحملات الإعلانية (SaaS Platform)',
    'influencer-marketing-platform',
    'Influencer Marketing Platform SaaS',
    'منصة سحابية لإدارة الحملات الإعلانية مع المؤثرين والمشاهير وتتبع نتائج الإعلانات.',
    1299.0, 849.0, 'SAR', 'SaaS', 'أنظمة سحابية', 'software', '/downloads/influencer-platform.zip',
    '["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=90"]',
    '["نظام إدارة وتتبع حملات المشاهير والمؤثرين","تحليلات وصول الحملات ونسبة التفاعل والعائد على الاستثمار ROI"]',
    'published', true, NOW(), NOW()
  ),
  (
    'prod_4',
    'Digital Marketing & SEO Mastery Course',
    'كورس التسويق الرقمي وتصدر محركات البحث (SEO Course)',
    'digital-marketing-seo-course',
    'Digital Marketing & SEO Mastery Course',
    'دورة تدريبية شاملة لتنميتها أعمالك وحصيلة مبيعاتك عبر محركات البحث والتسويق.',
    299.0, 149.0, 'SAR', 'Courses', 'كورسات وأدوات', 'course', '/downloads/seo-course-access.pdf',
    '["https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=90"]',
    '["شرح عملي ومبسط لاستراتيجيات تصدر نتائج البحث الأولى Google","أدوات وتحليلات الكلمات المفتاحية بالسوق السعودي والخليجي"]',
    'published', true, NOW(), NOW()
  )
  ON CONFLICT ("slug") DO UPDATE SET
    "nameAr" = EXCLUDED."nameAr",
    "price" = EXCLUDED."price",
    "salePrice" = EXCLUDED."salePrice",
    "status" = EXCLUDED."status";
  `;

  const ex = await fetchJSON(`${base}/endpoints/${envId}/docker/containers/${pg.Id}/exec`, {
    method: 'POST', headers,
    body: JSON.stringify({
      AttachStdout: true, AttachStderr: true,
      Cmd: ['psql', '-U', 'darrow', '-d', 'darrow', '-c', sql]
    })
  });

  if (ex.data?.Id) {
    const s = await fetchJSON(`${base}/endpoints/${envId}/docker/exec/${ex.data.Id}/start`, {
      method: 'POST', headers,
      body: JSON.stringify({ Detach: false, Tty: false })
    });
    const out = typeof s.data === 'string' ? s.data.replace(/[\x00-\x08]/g, '') : JSON.stringify(s.data);
    console.log('Insert SQL Result:', out);
  }
}

main().catch(e => console.error('FATAL:', e));
