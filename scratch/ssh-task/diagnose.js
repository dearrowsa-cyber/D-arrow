const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

async function fetchFull(url, options = {}) {
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
        resolve({ status: res.statusCode, headers: res.headers, data });
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function run() {
  try {
    console.log('=== SITE VERIFICATION ===\n');

    // 1. Check pricing API (admin endpoint with auth)
    console.log('1. Logging into admin to get token...');
    const loginRes = await fetchFull('https://d-arrow.com/api/admin/auth', {
      method: 'POST',
      body: JSON.stringify({ password: 'DArrow@2026!' })
    });
    let adminToken = null;
    try {
      const loginData = JSON.parse(loginRes.data);
      adminToken = loginData.token;
      console.log(`   Login status: ${loginRes.status}, token: ${adminToken ? 'YES' : 'NO'}\n`);
    } catch {
      console.log(`   Login status: ${loginRes.status}, response: ${loginRes.data.substring(0, 200)}\n`);
    }

    // 2. Check pricing API
    console.log('2. Checking /api/admin/pricing...');
    const pricingHeaders = adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {};
    const pricingRes = await fetchFull('https://d-arrow.com/api/admin/pricing', { headers: pricingHeaders });
    console.log(`   Status: ${pricingRes.status}`);
    try {
      const pData = JSON.parse(pricingRes.data);
      if (pData.success && pData.data?.marketing) {
        console.log('   CURRENT PRICES:');
        for (const pkg of pData.data.marketing) {
          console.log(`     ${pkg.name?.ar || pkg.name?.en}: ${pkg.price} ${pkg.currency}`);
        }
      } else {
        console.log(`   Response: ${pricingRes.data.substring(0, 500)}`);
      }
    } catch {
      console.log(`   Raw response: ${pricingRes.data.substring(0, 500)}`);
    }

    // 3. Check Cloudflare cache headers on main page
    console.log('\n3. Checking Cloudflare cache on main pages...');
    const pages = ['https://d-arrow.com/', 'https://d-arrow.com/pricing', 'https://d-arrow.com/blog'];
    for (const page of pages) {
      const pageRes = await fetchFull(page);
      const cfCache = pageRes.headers['cf-cache-status'] || 'NOT SET';
      const cacheControl = pageRes.headers['cache-control'] || 'NOT SET';
      const cfRay = pageRes.headers['cf-ray'] || 'NOT SET';
      const server = pageRes.headers['server'] || 'NOT SET';
      console.log(`   ${page}`);
      console.log(`     Server: ${server}`);
      console.log(`     CF-Cache-Status: ${cfCache}`);
      console.log(`     Cache-Control: ${cacheControl}`);
      console.log(`     CF-Ray: ${cfRay}`);
      console.log('');
    }

    // 4. Check the pricing page content
    console.log('4. Checking pricing page for price values...');
    const pricingPage = await fetchFull('https://d-arrow.com/pricing');
    const html = pricingPage.data;
    // Search for price patterns
    const pricePatterns = ['3,500', '5,500', '7,000', '7,500', '9,000', '3500', '5500', '7000', '7500', '9000'];
    console.log('   Looking for price values in HTML:');
    for (const p of pricePatterns) {
      const found = html.includes(p);
      console.log(`     ${p}: ${found ? '✅ FOUND' : '❌ not found'}`);
    }

    // 5. Check a blog post page
    console.log('\n5. Checking a blog post for title class...');
    // First get blog posts list
    const blogRes = await fetchFull('https://d-arrow.com/api/blog/posts');
    try {
      const blogData = JSON.parse(blogRes.data);
      if (blogData.success && blogData.posts?.length > 0) {
        const firstPost = blogData.posts[0];
        console.log(`   First post ID: ${firstPost.id}, title: ${firstPost.titleAr || firstPost.title}`);
        const postPage = await fetchFull(`https://d-arrow.com/blog/${firstPost.id}`);
        // Check for title class in JS chunks referenced
        if (postPage.data.includes('text-2xl') || postPage.data.includes('text-2xl')) {
          console.log('   ✅ NEW small title class found in page');
        } else if (postPage.data.includes('text-3xl') || postPage.data.includes('text-4xl')) {
          console.log('   ❌ OLD large title class found in page');
        } else {
          console.log('   ⚠️ Title class rendered client-side, checking JS chunks...');
          // Extract JS chunk URLs
          const chunkMatches = postPage.data.match(/\/_next\/static\/[^"']+\.js/g) || [];
          console.log(`   Found ${chunkMatches.length} JS chunks`);
          if (chunkMatches.length > 0) {
            let found = false;
            for (const chunk of chunkMatches.slice(0, 10)) {
              const chunkRes = await fetchFull(`https://d-arrow.com${chunk}`);
              if (chunkRes.data.includes('text-2xl') && chunkRes.data.includes('md:text-3xl') && chunkRes.data.includes('leading-relaxed')) {
                console.log(`   ✅ NEW title class found in chunk: ${chunk}`);
                found = true;
                break;
              }
              if (chunkRes.data.includes('text-3xl') && chunkRes.data.includes('md:text-4xl') && chunkRes.data.includes('leading-tight')) {
                console.log(`   ❌ OLD title class found in chunk: ${chunk}`);
                found = true;
                break;
              }
            }
            if (!found) {
              console.log('   ⚠️ Could not find title class in first 10 chunks');
            }
          }
        }
      }
    } catch (e) {
      console.log(`   Blog API error: ${e.message}`);
    }

    console.log('\n=== VERIFICATION COMPLETE ===');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
