const https = require('https');
https.get('https://d-arrow.com', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const m = data.match(/og:image[^>]*content="([^"]+)"/);
    console.log('og:image =', m ? m[1] : 'NOT FOUND');
  });
});
