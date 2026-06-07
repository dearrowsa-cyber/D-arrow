const https = require('https');

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function run() {
  console.log('1. Authenticating with live server...');
  const authRes = await fetchUrl('https://d-arrow.com/api/admin/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'DArrow@2026!' })
  });
  
  const token = JSON.parse(authRes.data).token;
  if (!token) throw new Error('Auth failed');
  console.log('✅ Authenticated successfully');

  console.log('\n2. Fetching SEO entries to find the ID for /process...');
  const entriesRes = await fetchUrl('https://d-arrow.com/api/admin/seo/meta', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  let entries = JSON.parse(entriesRes.data);
  if (entries.data) entries = entries.data; // Handle wrapper if any
  
  const processEntry = entries.find(e => e.slug === '/process');
  if (!processEntry) throw new Error('Entry not found');
  console.log(`✅ Found entry for /process (ID: ${processEntry.id})`);

  // We append a random number to the description to verify it changes
  const randomMarker = Math.floor(Math.random() * 10000);
  const newDescription = `اكتشف كيف يمكن لـ D-Arrow تسريع عملية التسويق الرقمي لك. ابدأ اليوم! (Test ${randomMarker})`;
  
  processEntry.description = newDescription;

  console.log(`\n3. Updating description via API to: "${newDescription}"...`);
  const updateRes = await fetchUrl(`https://d-arrow.com/api/admin/seo/meta/${processEntry.id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(processEntry)
  });
  
  if (updateRes.status !== 200) {
    console.error('Update failed:', updateRes.data);
    return;
  }
  console.log('✅ Updated successfully');

  console.log('\n4. Waiting 2 seconds for Next.js cache to clear...');
  await new Promise(r => setTimeout(r, 2000));

  console.log('\n5. Fetching live HTML of https://d-arrow.com/process...');
  const htmlRes = await fetchUrl('https://d-arrow.com/process');
  const html = htmlRes.data;
  
  const ogDescMatch = html.match(/<meta property="og:description" content="(.*?)"/);
  const metaDescMatch = html.match(/<meta name="description" content="(.*?)"/);
  
  console.log('\n=== LIVE HTML RESULTS ===');
  console.log('Meta Description:', metaDescMatch ? metaDescMatch[1] : 'Not found');
  console.log('OG Description:', ogDescMatch ? ogDescMatch[1] : 'Not found');
  
  if (metaDescMatch && metaDescMatch[1] === newDescription) {
    console.log('\n✅ SUCCESS! The live HTML exactly matches the newly saved description.');
  } else {
    console.log('\n❌ FAILURE! The live HTML did not update.');
  }
}

run().catch(console.error);
