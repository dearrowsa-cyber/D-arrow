const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const data = JSON.parse(fs.readFileSync('public/data/blog-posts.json', 'utf8'));
    if(data.posts && data.posts.length > 0) {
      console.log('Found ' + data.posts.length + ' posts. Migrating...');
      for(const post of data.posts) {
        const exists = await prisma.blogPost.findUnique({ where: { id: post.id }});
        if(!exists) {
          await prisma.blogPost.create({
            data: {
              id: post.id,
              title: post.title||'',
              titleAr: post.titleAr||'',
              content: post.content||'',
              contentAr: post.contentAr||'',
              excerpt: post.excerpt||'',
              excerptAr: post.excerptAr||'',
              author: post.author||'D-Arrow',
              category: post.category||'Digital Marketing',
              categoryAr: post.categoryAr||'',
              date: post.date,
              time: post.time,
              readTime: post.readTime||1,
              imageUrl: post.imageUrl,
              status: post.status||'published'
            }
          });
          console.log('Migrated: ' + post.id);
        }
      }
    }
  } catch(e) {
    console.error('Migration skipped or failed: ' + e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
