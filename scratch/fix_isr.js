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
  if (!content.includes('export const revalidate')) {
    content = content.replace("import type { Metadata } from 'next';", "import type { Metadata } from 'next';\n\nexport const revalidate = 60; // Revalidate every minute to sync SEO changes from DB");
    fs.writeFileSync(file, content);
  }
}

console.log('Added ISR revalidation to layouts.');
