const https = require('https');

async function testPublicChat() {
  const body = JSON.stringify({ message: "كم أسعار باقات التسويق لديكم؟", language: "ar" });
  const u = new URL("https://d-arrow.com/api/chat");
  const opts = {
    hostname: u.hostname,
    port: 443,
    path: u.pathname,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body)
    }
  };

  console.log("Testing live Chat API on https://d-arrow.com/api/chat...");
  const start = Date.now();
  const req = https.request(opts, (res) => {
    let data = "";
    res.on("data", c => data += c);
    res.on("end", () => {
      console.log(`STATUS: ${res.statusCode} in ${Date.now() - start}ms`);
      console.log("RESPONSE:", data);
    });
  });
  req.on("error", (err) => console.log("ERROR:", err.message));
  req.write(body);
  req.end();
}

testPublicChat();
