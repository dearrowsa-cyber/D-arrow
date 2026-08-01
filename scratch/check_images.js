const https = require('https');

function checkImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let size = 0;
      res.on('data', (chunk) => { size += chunk.length; });
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          contentType: res.headers['content-type'],
          contentLength: res.headers['content-length'],
          actualSize: size,
          cacheControl: res.headers['cache-control'],
        });
      });
    }).on('error', reject);
  });
}

async function main() {
  // Check the padded image
  console.log('=== Checking og-image-padded.png ===');
  const r1 = await checkImage('https://d-arrow.com/og-image-padded.png');
  console.log(JSON.stringify(r1, null, 2));

  // Check the old image too
  console.log('\n=== Checking og-image.jpg ===');
  const r2 = await checkImage('https://d-arrow.com/og-image.jpg');
  console.log(JSON.stringify(r2, null, 2));

  // Check v3
  console.log('\n=== Checking og-image-v3.png ===');
  const r3 = await checkImage('https://d-arrow.com/og-image-v3.png');
  console.log(JSON.stringify(r3, null, 2));
}

main().catch(console.error);
