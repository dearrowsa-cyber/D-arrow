const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const entries = await prisma.seoMeta.findMany({
    orderBy: { slug: 'asc' },
    select: { slug: true, title: true, description: true, ogTitle: true, ogDescription: true }
  });

  for (const e of entries) {
    console.log(`\n=== ${e.slug} ===`);
    console.log(`  title: ${e.title || '(فارغ)'}`);
    console.log(`  description: ${(e.description || '(فارغ)').substring(0, 80)}...`);
    console.log(`  ogTitle: ${e.ogTitle || '(فارغ)'}`);
    console.log(`  ogDescription: ${(e.ogDescription || '(فارغ)').substring(0, 80)}...`);
  }

  await prisma.$disconnect();
}

main();
