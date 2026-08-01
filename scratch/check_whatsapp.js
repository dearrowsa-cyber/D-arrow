const https = require('https');

// Simulate WhatsApp's bot user-agent to see exactly what WhatsApp sees
const options = {
  hostname: 'd-arrow.com',
  path: '/',
  method: 'GET',
  headers: {
    'User-Agent': 'WhatsApp/2.23.20.0',
  },
};

console.log('Fetching d-arrow.com as WhatsApp bot...');
const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    // Find all og: meta tags
    const ogTags = data.match(/<meta\s+property="og:[^"]*"\s+content="[^"]*"\s*\/?>/gi);
    if (ogTags) {
      console.log('\n=== OG Tags WhatsApp sees ===');
      ogTags.forEach(tag => console.log(tag));
    }
    
    // Find twitter tags
    const twTags = data.match(/<meta\s+name="twitter:[^"]*"\s+content="[^"]*"\s*\/?>/gi);
    if (twTags) {
      console.log('\n=== Twitter Tags ===');
      twTags.forEach(tag => console.log(tag));
    }
    
    if (!ogTags && !twTags) {
      console.log('NO OG/Twitter tags found in response!');
      // Check if it's a redirect or JS-rendered page
      console.log('Status:', res.statusCode);
      console.log('Headers:', JSON.stringify(res.headers, null, 2));
      console.log('First 500 chars:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.end();
