const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const seo = await prisma.seoMeta.findUnique({ where: { slug: '/' } });
  console.log(seo);
}
main().finally(() => prisma.$disconnect());
