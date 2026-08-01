const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

function testURL(url) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const req = https.get(url, { agent }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ url, status: res.statusCode, dataLength: data.length, snippet: data.substring(0, 150) }));
    });
    req.on('error', (err) => resolve({ url, error: err.message }));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ url, error: 'TIMEOUT (5s)' });
    });
  });
}

async function main() {
  const urls = [
    'https://d-arrow.com/',
    'https://www.d-arrow.com/',
    'https://d-arrow.com/api/chat',
    'https://apps.d-arrow.com/'
  ];

  console.log('Testing public website URLs...');
  for (const url of urls) {
    const result = await testURL(url);
    console.log(result);
  }
}

main();
