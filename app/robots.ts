import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/admin/'], // Hide admin panels and endpoints from search engines
    },
    sitemap: 'https://d-arrow.com/sitemap.xml',
  };
}
