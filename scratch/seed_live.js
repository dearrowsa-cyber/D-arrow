const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

function postJson(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      port: 443,
      path: u.pathname,
      method: 'POST',
      agent,
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  try {
    const res = await postJson('https://d-arrow.com/api/admin/store/seed-template');
    console.log('Seed response:', res.status, res.data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
