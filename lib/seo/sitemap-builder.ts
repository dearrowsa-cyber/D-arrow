import prisma from '../prisma';

export async function generateSitemapUrls(baseUrl: string) {
  const routes = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'daily' as any },
    { url: `${baseUrl}/services`, priority: 0.9, changeFrequency: 'weekly' as any },
    { url: `${baseUrl}/pricing`, priority: 0.8, changeFrequency: 'weekly' as any },
    { url: `${baseUrl}/why-us`, priority: 0.8, changeFrequency: 'monthly' as any },
    { url: `${baseUrl}/process`, priority: 0.7, changeFrequency: 'monthly' as any },
    { url: `${baseUrl}/contact`, priority: 0.9, changeFrequency: 'monthly' as any },
    { url: `${baseUrl}/custom-package`, priority: 0.7, changeFrequency: 'monthly' as any },
    { url: `${baseUrl}/blog`, priority: 0.9, changeFrequency: 'daily' as any },
  ];

  try {
    // Fetch custom SEO meta entries that might have canonical URLs or specific rules
    const seoEntries = await prisma.seoMeta.findMany({
      where: {
        NOT: {
          robots: { contains: 'noindex' }
        }
      }
    });

    // We can merge these with our known routes or blog posts
    // For now, let's just return the base routes plus we will dynamically add blog posts in sitemap.ts
    // If we wanted to, we could store ALL pages in SeoMeta and construct the sitemap entirely from DB.

    return routes;
  } catch (error) {
    console.error('Error generating sitemap urls from DB:', error);
    return routes;
  }
}
