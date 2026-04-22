import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { analyzeContent } from '@/lib/seo/analyzer';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const baseUrl = 'http://127.0.0.1:3000';
    
    // Core static routes
    const routes = [
      '/',
      '/services',
      '/pricing',
      '/process',
      '/contact',
      '/why-us',
      '/custom-package',
      '/blog'
    ];

    // Attempt to parse blog posts
    try {
      const blogPath = path.join(process.cwd(), 'public', 'data', 'blog-posts.json');
      if (fs.existsSync(blogPath)) {
        const blogData = JSON.parse(fs.readFileSync(blogPath, 'utf8'));
        if (blogData && Array.isArray(blogData.posts)) {
          blogData.posts.forEach((post: any) => {
            if (post.id) {
              routes.push(`/blog/${post.id}`);
            }
          });
        }
      }
    } catch (e) {
      console.error('Failed to parse blog posts for SEO sync', e);
    }

    let syncedCount = 0;

    for (const slug of routes) {
      // Create or update the route in SeoMeta
      let meta = await prisma.seoMeta.findUnique({ where: { slug } });
      
      const defaultTitle = `D Arrow | ${slug === '/' ? 'Home' : slug.replace('/', '').replace('-', ' ').toUpperCase()}`;
      
      if (!meta) {
        meta = await prisma.seoMeta.create({
          data: {
            slug,
            title: defaultTitle,
            description: 'D Arrow Digital Marketing Agency',
            focusKeyword: slug === '/' ? 'digital marketing' : slug.replace('/', '').replace('-', ' '),
            robots: 'index, follow',
          }
        });
      }

      // Try fetching the live content to evaluate
      try {
        const res = await fetch(`${baseUrl}${slug}`, { 
          // Use a short timeout to prevent hanging the dev server
          signal: AbortSignal.timeout(5000) 
        });
        
        if (res.ok) {
          const html = await res.text();
          // Extract body text roughly
          const bodyTextMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
          const bodyText = bodyTextMatch ? bodyTextMatch[1] : html;
          
          const analysis = analyzeContent(
            bodyText,
            meta.title || '',
            meta.description || '',
            meta.focusKeyword || '',
            slug
          );

          // Save Audit Log
          await prisma.seoAuditLog.create({
            data: {
              seoMetaId: meta.id,
              score: analysis.score,
              issuesCount: analysis.suggestions.length,
              suggestions: JSON.stringify(analysis.suggestions)
            }
          });
          syncedCount++;
        }
      } catch (err) {
        console.warn(`Failed to fetch ${slug} for SEO analysis during sync`, err);
        // Even if fetch fails, we created the SeoMeta entry
      }
    }

    return NextResponse.json({ success: true, count: routes.length, syncedCount });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ success: false, error: 'Failed to sync pages' }, { status: 500 });
  }
}
