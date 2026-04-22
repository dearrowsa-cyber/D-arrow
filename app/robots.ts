import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function robots(): Promise<MetadataRoute.Robots> {
  let dbRules: any[] = [];
  try {
    dbRules = await prisma.robotsRule.findMany();
  } catch (e) {
    console.error('Failed to load robots rules from DB');
  }

  if (dbRules.length === 0) {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/admin/'],
      },
      sitemap: 'https://d-arrow.com/sitemap.xml',
    };
  }

  const rulesMap: Record<string, any> = {};
  dbRules.forEach(rule => {
    if (!rulesMap[rule.userAgent]) {
      rulesMap[rule.userAgent] = { userAgent: rule.userAgent, allow: [], disallow: [] };
    }
    if (rule.directive === 'Allow') rulesMap[rule.userAgent].allow.push(rule.path);
    if (rule.directive === 'Disallow') rulesMap[rule.userAgent].disallow.push(rule.path);
  });

  return {
    rules: Object.values(rulesMap),
    sitemap: 'https://d-arrow.com/sitemap.xml',
  };
}
