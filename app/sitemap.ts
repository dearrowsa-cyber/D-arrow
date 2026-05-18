import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://d-arrow.com';
  const lastModified = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/services`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/why-us`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/process`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/custom-package`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified, changeFrequency: 'daily', priority: 0.9 },
  ];

  // Fetch blog posts from DB
  try {
    const blogPosts = await prisma.blogPost.findMany({
      where: { status: 'published' },
      select: { id: true, slug: true, updatedAt: true },
    });

    blogPosts.forEach((post) => {
      // Use slug if available, otherwise fall back to post id
      const postPath = post.slug
        ? (post.slug.startsWith('/') ? post.slug : `/${post.slug}`)
        : `/blog/${post.id}`;
      // Encode URI to handle Arabic characters and spaces
      const fullUrl = encodeURI(`${baseUrl}${postPath}`);
      // Avoid duplicates
      if (!routes.find(r => r.url === fullUrl)) {
        routes.push({
          url: fullUrl,
          lastModified: post.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    });
  } catch (error) {
    console.error('Error generating blog post routes for sitemap:', error);
  }

  // Merge DB SeoMeta URLs
  try {
    const seoEntries = await prisma.seoMeta.findMany({
      where: { NOT: { robots: { contains: 'noindex' } } }
    });
    
    seoEntries.forEach(entry => {
      // Avoid duplication of the root URL from SeoMeta
      if (entry.slug === '' || entry.slug === '/') return;
      
      const fullUrl = encodeURI(`${baseUrl}${entry.slug.startsWith('/') ? entry.slug : '/' + entry.slug}`);
      const exists = routes.find(r => r.url === fullUrl);
      if (!exists) {
        routes.push({
          url: fullUrl,
          lastModified: entry.updatedAt,
          changeFrequency: 'monthly',
          priority: 0.5,
        });
      }
    });
  } catch (e) {
    console.error('Error fetching DB entries for sitemap');
  }

  return routes;
}
