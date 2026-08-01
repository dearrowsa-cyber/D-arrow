const https = require('https');

// Facebook's Sharing Debugger "scrape" endpoint forces them to re-fetch OG tags
// WhatsApp uses the same cache as Facebook
const url = 'https://d-arrow.com';
const postData = `id=${encodeURIComponent(url)}&scrape=true`;

const options = {
  hostname: 'graph.facebook.com',
  port: 443,
  path: '/v19.0/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData),
  },
};

console.log('Scraping Facebook/WhatsApp cache for:', url);
const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const parsed = JSON.parse(data);
      console.log('Title:', parsed.title);
      console.log('Description:', parsed.description);
      console.log('Image:', JSON.stringify(parsed.image, null, 2));
      console.log('Updated time:', parsed.updated_time);
    } catch (e) {
      console.log('Response:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(postData);
req.end();
