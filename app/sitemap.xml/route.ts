import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://d-arrow.com';

  // Static routes
  const staticRoutes = [
    { url: `${baseUrl}/`, changefreq: 'daily', priority: '1.0' },
    { url: `${baseUrl}/services`, changefreq: 'weekly', priority: '0.9' },
    { url: `${baseUrl}/pricing`, changefreq: 'weekly', priority: '0.8' },
    { url: `${baseUrl}/why-us`, changefreq: 'monthly', priority: '0.8' },
    { url: `${baseUrl}/process`, changefreq: 'monthly', priority: '0.7' },
    { url: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.9' },
    { url: `${baseUrl}/custom-package`, changefreq: 'monthly', priority: '0.7' },
    { url: `${baseUrl}/blog`, changefreq: 'daily', priority: '0.9' },
  ];

  const dynamicRoutes: typeof staticRoutes & { lastmod?: string }[] = [];

  // Fetch blog posts
  try {
    const blogPosts = await prisma.blogPost.findMany({
      where: { status: 'published' },
      select: { id: true, slug: true, updatedAt: true },
    });

    blogPosts.forEach((post) => {
      const postPath = post.slug
        ? (post.slug.startsWith('/') ? post.slug : `/${post.slug}`)
        : `/blog/${post.id}`;
      const fullUrl = encodeURI(`${baseUrl}${postPath}`);

      // Avoid duplicates with static routes
      if (!staticRoutes.find(r => r.url === fullUrl)) {
        dynamicRoutes.push({
          url: fullUrl,
          changefreq: 'weekly',
          priority: '0.8',
          lastmod: post.updatedAt.toISOString(),
        });
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Fetch SEO meta entries
  try {
    const seoEntries = await prisma.seoMeta.findMany({
      where: { NOT: { robots: { contains: 'noindex' } } },
    });

    seoEntries.forEach((entry) => {
      if (entry.slug === '' || entry.slug === '/') return;

      const fullUrl = encodeURI(`${baseUrl}${entry.slug.startsWith('/') ? entry.slug : '/' + entry.slug}`);
      const alreadyExists =
        staticRoutes.find(r => r.url === fullUrl) ||
        dynamicRoutes.find(r => r.url === fullUrl);

      if (!alreadyExists) {
        dynamicRoutes.push({
          url: fullUrl,
          changefreq: 'monthly',
          priority: '0.5',
          lastmod: entry.updatedAt.toISOString(),
        });
      }
    });
  } catch (error) {
    console.error('Error fetching SEO entries for sitemap:', error);
  }

  // Build XML
  const now = new Date().toISOString();
  const allRoutes = [
    ...staticRoutes.map(r => ({ ...r, lastmod: now })),
    ...dynamicRoutes,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${escapeXml(route.url)}</loc>
    <lastmod>${route.lastmod || now}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
