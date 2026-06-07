async function check() {
  const res = await fetch('https://d-arrow.com/pricing');
  const text = await res.text();
  console.log('Title:', text.match(/<title>(.*?)<\/title>/)?.[1]);
  console.log('Desc:', text.match(/<meta name="description" content="(.*?)"/)?.[1]);
  console.log('OG Title:', text.match(/<meta property="og:title" content="(.*?)"/)?.[1]);
  console.log('OG Desc:', text.match(/<meta property="og:description" content="(.*?)"/)?.[1]);
}
check();
