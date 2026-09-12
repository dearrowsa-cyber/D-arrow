const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function toDate(value) {
  return value ? new Date(value) : null;
}

async function main() {
  let data;
  try {
    data = require('../lib/blog/fallback-posts.json');
  } catch (e) {
    console.error('[seed] Could not load lib/blog/fallback-posts.json:', e.message);
    process.exit(1);
  }

  const posts = data.posts || [];
  console.log(`[seed] Seeding ${posts.length} blog posts...`);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const p of posts) {
    const payload = {
      title: p.title || '',
      titleAr: p.titleAr || null,
      slug: p.slug || null,
      content: p.content || '',
      contentAr: p.contentAr || null,
      excerpt: p.excerpt || null,
      excerptAr: p.excerptAr || null,
      author: p.author || 'D-Arrow',
      category: p.category || 'Digital Marketing',
      categoryAr: p.categoryAr || null,
      date: p.date,
      time: p.time,
      readTime: p.readTime || Math.ceil((p.content || '').split(' ').length / 200),
      imageUrl: p.imageUrl || null,
      tags: Array.isArray(p.tags) ? JSON.stringify(p.tags) : null,
      status: p.status || 'published',
      isGated: Boolean(p.isGated),
      ctaType: p.ctaType || 'default',
      gatedContent: p.gatedContent || null,
      gatedContentAr: p.gatedContentAr || null,
      createdAt: toDate(p.createdAt) || undefined,
    };

    try {
      const existing = await prisma.blogPost.findUnique({ where: { id: p.id } });
      if (existing) {
        await prisma.blogPost.update({ where: { id: p.id }, data: payload });
        updated++;
      } else {
        await prisma.blogPost.create({ data: { id: p.id, ...payload } });
        created++;
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      if (/P2002/.test(message)) {
        skipped++;
        console.warn(`[seed] Skipped ${p.id} — unique constraint (${message.split('\n')[0]})`);
      } else {
        throw e;
      }
    }
  }

  console.log(`[seed] Done: ${created} created, ${updated} updated, ${skipped} skipped.`);
}

main()
  .catch(e => {
    console.error('[seed] Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });