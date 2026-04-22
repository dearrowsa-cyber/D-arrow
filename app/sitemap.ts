import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://d-arrow.com';
  const lastModified = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/services`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/why-us`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/process`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/custom-package`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified, changeFrequency: 'daily', priority: 0.9 },
  ];

  try {
    const dataDir = path.join(process.cwd(), 'public', 'data');
    const blogPath = path.join(dataDir, 'blog-posts.json');
    if (fs.existsSync(blogPath)) {
      const blogData = JSON.parse(fs.readFileSync(blogPath, 'utf-8'));
      if (blogData.posts && Array.isArray(blogData.posts)) {
        const publishedPosts = blogData.posts.filter((post: any) => post.status === 'published');
        publishedPosts.forEach((post: any) => {
          routes.push({
            url: `${baseUrl}/blog/${post.id}`,
            lastModified: new Date(post.date || new Date()),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        });
      }
    }
  } catch (error) {
    console.error('Error generating dynamic blog routes for sitemap:', error);
  }

  // Merge DB SeoMeta URLs
  try {
    const seoEntries = await prisma.seoMeta.findMany({
      where: { NOT: { robots: { contains: 'noindex' } } }
    });
    
    seoEntries.forEach(entry => {
      const fullUrl = `${baseUrl}${entry.slug.startsWith('/') ? entry.slug : '/' + entry.slug}`;
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
