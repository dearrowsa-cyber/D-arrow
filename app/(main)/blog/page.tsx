import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import BlogClient from '@/components/BlogClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'المدونة | D Arrow',
  description: 'اكتشف أحدث المقالات والنصائح في عالم التسويق الرقمي، تحسين محركات البحث SEO، وإدارة السوشيال ميديا من فريق دي آرو.',
  keywords: 'مدونة تسويق رقمي, سيو, تحسين محركات البحث, سوشيال ميديا, دي آرو, D Arrow, blog, digital marketing, seo',
  openGraph: {
    title: 'المدونة | D Arrow',
    description: 'مقالات تعليمية ونصائح احترافية في التسويق الرقمي.',
    url: 'https://d-arrow.com/blog',
    images: [{ url: 'https://d-arrow.com/og-image.jpg', width: 1200, height: 630, alt: 'D Arrow Blog' }],
  },
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  let posts: any[] = [];
  
  try {
    const rawPosts = await prisma.blogPost.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
    });

    posts = rawPosts.map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
      // Ensure dates are stringified for client
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching blog posts for listing:', error);
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0e27] pt-32 text-center text-white">Loading blog...</div>}>
      <BlogClient initialPosts={posts} />
    </Suspense>
  );
}
