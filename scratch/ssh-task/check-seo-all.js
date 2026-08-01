const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const seos = await prisma.seoMeta.findMany({ where: { ogImage: { not: null } } });
  console.log(seos.map(s => ({ slug: s.slug, ogImage: s.ogImage })));
}
main().finally(() => prisma.$disconnect());
