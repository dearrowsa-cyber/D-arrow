const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const targetId = 'cmopkouj80000fb6p9gq3tjxu';
  
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: targetId }
    });
    
    if (post) {
      await prisma.blogPost.delete({
        where: { id: targetId }
      });
      console.log(`Successfully deleted post: ${targetId}`);
    } else {
      console.log(`Post ${targetId} not found. Deleting all auto-generated posts...`);
      const deleted = await prisma.blogPost.deleteMany({
        where: {
          OR: [
            { titleAr: { contains: 'لم يعد السوق السعودي' } },
            { title: { contains: 'لم يعد السوق السعودي' } },
            { author: 'D-Arrow AI' }
          ]
        }
      });
      console.log(`Deleted ${deleted.count} posts.`);
    }
  } catch (error) {
    console.error('Error deleting post:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
