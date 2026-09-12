import { headers } from 'next/headers';
import BlogClient from '@/components/BlogClient';
import { Suspense } from 'react';
import { FALLBACK_POSTS } from '@/lib/blog/fallback-posts';

export const dynamic = 'force-dynamic';

async function getPosts(): Promise<any[]> {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = headersList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    
    const apiUrl = `${protocol}://${host}/api/blog/posts`;
    const res = await fetch(apiUrl, { cache: 'no-store' });
    
    if (res.ok) {
      const data = await res.json();
      if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
        return data.posts;
      }
    }
  } catch (error) {
    console.error('Error fetching blog posts from /api/blog/posts:', error);
  }

  return FALLBACK_POSTS;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0e27] pt-32 text-center text-white">Loading blog...</div>}>
      <BlogClient initialPosts={posts} />
    </Suspense>
  );
}

