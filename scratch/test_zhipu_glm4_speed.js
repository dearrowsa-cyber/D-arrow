const https = require('https');

async function testZhipu() {
  const apiKey = '52a514d02636eb4dfd7efce2828b1220.B8L262XvL0WixjYp';
  const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

  const body = JSON.stringify({
    model: 'glm-4-flash',
    messages: [
      { role: 'system', content: 'أنت مستشار تسويق رقمي لوكالة دي آرو.' },
      { role: 'user', content: 'مرحبا، كيف تقدر تخدمني؟' }
    ],
    temperature: 0.7,
    max_tokens: 200
  });

  const u = new URL(url);
  const opts = {
    hostname: u.hostname,
    port: 443,
    path: u.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Length': Buffer.byteLength(body)
    }
  };

  console.log('Testing Zhipu GLM-4-Flash Cloud API...');
  const start = Date.now();

  const req = https.request(opts, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      const elapsed = Date.now() - start;
      console.log(`⏱️ Response time: ${elapsed}ms (Status ${res.statusCode})`);
      try {
        const parsed = JSON.parse(data);
        console.log('Reply:', parsed.choices[0].message.content);
      } catch (e) {
        console.log('Raw data:', data);
      }
    });
  });

  req.on('error', err => console.error('Error:', err));
  req.write(body);
  req.end();
}

testZhipu();
