import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

// Remove force-static to allow dynamic generation based on posts
// export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://d-arrow.com';
  const lastModified = new Date();

  // Core static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/why-us`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/process`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/custom-package`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`, // Adding main blog listing page
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Dynamically inject all blog posts
  try {
    const dataDir = path.join(process.cwd(), 'public', 'data');
    const blogPath = path.join(dataDir, 'blog-posts.json');
    if (fs.existsSync(blogPath)) {
      const blogData = JSON.parse(fs.readFileSync(blogPath, 'utf-8'));
      if (blogData.posts && Array.isArray(blogData.posts)) {
        // Find published posts
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

  return routes;
}
