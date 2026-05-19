import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const baseUrl = 'https://d-arrow.com';
  const now = new Date().toISOString();

  // Static routes
  const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [
    { loc: `${baseUrl}/`, lastmod: now, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/services`, lastmod: now, changefreq: 'weekly', priority: '0.9' },
    { loc: `${baseUrl}/pricing`, lastmod: now, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/why-us`, lastmod: now, changefreq: 'monthly', priority: '0.8' },
    { loc: `${baseUrl}/process`, lastmod: now, changefreq: 'monthly', priority: '0.7' },
    { loc: `${baseUrl}/contact`, lastmod: now, changefreq: 'monthly', priority: '0.9' },
    { loc: `${baseUrl}/custom-package`, lastmod: now, changefreq: 'monthly', priority: '0.7' },
    { loc: `${baseUrl}/blog`, lastmod: now, changefreq: 'daily', priority: '0.9' },
  ];

  // Fetch blog posts
  try {
    const blogPosts = await prisma.blogPost.findMany({
      where: { status: 'published' },
      select: { id: true, slug: true, updatedAt: true },
    });

    for (const post of blogPosts) {
      const postPath = post.slug
        ? (post.slug.startsWith('/') ? post.slug : `/${post.slug}`)
        : `/blog/${post.id}`;
      const fullUrl = encodeURI(`${baseUrl}${postPath}`);
      if (!urls.find(u => u.loc === fullUrl)) {
        urls.push({
          loc: fullUrl,
          lastmod: post.updatedAt.toISOString(),
          changefreq: 'weekly',
          priority: '0.8',
        });
      }
    }
  } catch (e) {
    console.error('Sitemap: Error fetching blog posts:', e);
  }

  // Fetch SEO meta entries
  try {
    const seoEntries = await prisma.seoMeta.findMany({
      where: { NOT: { robots: { contains: 'noindex' } } },
    });

    for (const entry of seoEntries) {
      if (entry.slug === '' || entry.slug === '/') continue;
      const fullUrl = encodeURI(`${baseUrl}${entry.slug.startsWith('/') ? entry.slug : '/' + entry.slug}`);
      if (!urls.find(u => u.loc === fullUrl)) {
        urls.push({
          loc: fullUrl,
          lastmod: entry.updatedAt.toISOString(),
          changefreq: 'monthly',
          priority: '0.5',
        });
      }
    }
  } catch (e) {
    console.error('Sitemap: Error fetching SEO entries:', e);
  }

  // Build XML string
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(u => [
      '  <url>',
      `    <loc>${escapeXml(u.loc)}</loc>`,
      `    <lastmod>${u.lastmod}</lastmod>`,
      `    <changefreq>${u.changefreq}</changefreq>`,
      `    <priority>${u.priority}</priority>`,
      '  </url>',
    ].join('\n')),
    '</urlset>',
  ].join('\n');

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      'X-Content-Type-Options': 'nosniff',
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
