const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const p = await prisma.product.findUnique({
    where: { slug: 'ecommerce-store-admin-template' }
  });
  console.log('Product in DB:', JSON.stringify(p, null, 2));
}

check().finally(() => prisma.$disconnect());
