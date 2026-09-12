import prisma from '@/lib/prisma';
import BlogClient from '@/components/BlogClient';
import { Suspense } from 'react';
import { FALLBACK_POSTS } from '@/lib/blog/fallback-posts';

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
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching blog posts for listing, using fallback:', error);
  }

  if (!posts || posts.length === 0) {
    console.log('No DB posts found, using FALLBACK_POSTS');
    posts = FALLBACK_POSTS;
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0e27] pt-32 text-center text-white">Loading blog...</div>}>
      <BlogClient initialPosts={posts} />
    </Suspense>
  );
}
