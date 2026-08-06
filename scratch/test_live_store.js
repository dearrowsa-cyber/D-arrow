const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { agent }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function main() {
  try {
    const res1 = await fetchUrl('https://d-arrow.com/api/store/products');
    console.log('Status https://d-arrow.com/api/store/products:', res1.status);
    console.log('Response body:', res1.body.slice(0, 400));
    console.log('Includes Saudi E-Commerce:', res1.body.includes('Saudi E-Commerce') || res1.body.includes('المتجر الإلكتروني'));
    console.log('Includes Real Estate:', res1.body.includes('Real Estate') || res1.body.includes('العقاري'));
    console.log('Includes لا توجد منتجات:', res1.body.includes('لا توجد منتجات'));
    console.log('Body snippet:', res1.body.slice(0, 500));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
