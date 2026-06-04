const fs = require('fs');
const files = [
  'app/(main)/contact/layout.tsx',
  'app/(main)/pricing/layout.tsx',
  'app/(main)/process/layout.tsx',
  'app/(main)/provisions/layout.tsx',
  'app/(main)/services/layout.tsx',
  'app/(main)/why-us/layout.tsx',
];

for (let file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let slugMatch = file.match(/app\/\(main\)\/(.*?)\/layout\.tsx/);
  if (slugMatch) {
    let slug = '/' + slugMatch[1];
    content = content.replace(/export const metadata.*?};\n/s, `export async function generateMetadata() {
  const { getSeoMetadata } = await import('@/lib/seo/metadata');
  return getSeoMetadata('${slug}');
}\n`);
    fs.writeFileSync(file, content);
  }
}
console.log('Fixed simple layouts.');
