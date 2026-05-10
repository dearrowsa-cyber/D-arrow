const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });
  console.log(JSON.stringify(posts, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
