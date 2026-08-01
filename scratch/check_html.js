const http = require('http');

function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`=== URL: ${url} ===`);
        console.log('HTML Length:', data.length);
        console.log('Contains Flash Sale:', data.includes('تخفيضات خاطفة'));
        console.log('Contains Slider:', data.includes('موسم العروض الكبرى'));
        console.log('Contains Saudi Trust Badge:', data.includes('شحن سريع بالمملكة'));
        console.log('Contains Saudi Riyal & Mada Badges:', data.includes('ر.س') && data.includes('مدى'));
        console.log('Contains WhatsApp button:', data.includes('floating-support-btn'));
        resolve();
      });
    }).on('error', (err) => {
      console.error(err);
      resolve();
    });
  });
}

async function main() {
  await checkUrl('http://localhost:3000/demo/store');
  await checkUrl('http://localhost:3000/store');
}

main();
