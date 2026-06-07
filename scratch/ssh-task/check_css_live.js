const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

function fetch(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    https.get({
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + u.search,
      agent,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
    }).on('error', reject);
  });
}

async function run() {
  try {
    const res = await fetch('https://d-arrow.com/admin/login');
    
    // Extract ALL asset references
    const allRefs = res.data.match(/\/_next\/static\/[^"'\s)]+/g) || [];
    console.log(`Total asset references: ${allRefs.length}`);
    
    // Check all CSS files
    const cssRefs = allRefs.filter(r => r.endsWith('.css'));
    console.log(`CSS files: ${cssRefs.length}`);
    
    // Get the build ID
    const buildMatch = res.data.match(/"buildId":"([^"]+)"/);
    console.log(`Build ID: ${buildMatch ? buildMatch[1] : 'not found'}`);
    
    // Check for light-mode in ALL chunks (CSS and JS)
    let foundLightMode = false;
    for (const ref of allRefs) {
      const assetRes = await fetch(`https://d-arrow.com${ref}`);
      if (assetRes.data.includes('.admin-layout.light-mode')) {
        console.log(`\n✅ Found light-mode styles in: ${ref}`);
        foundLightMode = true;
        
        // Check specific fixes
        const checks = [
          ['admin-topbar-title', 'topbar title fix'],
          ['admin-stat-label', 'stat label fix'],
          ['admin-nav-section', 'nav section fix'],
          ['btn-secondary:active', 'secondary button active state'],
        ];
        for (const [pattern, name] of checks) {
          console.log(`  ${assetRes.data.includes(pattern) ? '✅' : '❌'} ${name} (${pattern})`);
        }
        break;
      }
    }
    
    if (!foundLightMode) {
      console.log('\n❌ light-mode styles NOT found in any chunk!');
      console.log('Checking if admin layout chunk contains the CSS...');
      
      // Look for admin-related chunks
      for (const ref of allRefs) {
        const assetRes = await fetch(`https://d-arrow.com${ref}`);
        if (assetRes.data.includes('admin-layout') || assetRes.data.includes('admin_theme')) {
          console.log(`  Admin chunk found: ${ref}`);
          // Search for any light mode reference
          if (assetRes.data.includes('light')) {
            const idx = assetRes.data.indexOf('light');
            console.log(`  Contains "light" at index ${idx}: ...${assetRes.data.substring(Math.max(0,idx-30), idx+50)}...`);
          }
        }
      }
    }
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
