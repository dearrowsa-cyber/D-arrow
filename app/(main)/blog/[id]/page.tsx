import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import BlogPostClient from '@/components/BlogPostClient';
import { notFound } from 'next/navigation';
import { FALLBACK_POSTS_BY_ID } from '@/lib/blog/fallback-posts';

export const dynamic = 'force-dynamic';

// Generate dynamic SEO metadata for each blog post
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  let post: any = null;

  try {
    post = await prisma.blogPost.findFirst({
      where: { OR: [{ id }, { slug: id }, { slug: decodedId }, { id: decodedId }] }
    });
  } catch {
    post = null;
  }

  if (!post && (FALLBACK_POSTS_BY_ID[id] || FALLBACK_POSTS_BY_ID[decodedId])) {
    post = FALLBACK_POSTS_BY_ID[id] || FALLBACK_POSTS_BY_ID[decodedId];
  }

  if (!post) return { title: 'مقال غير موجود | D Arrow' };

  const title = post.titleAr || post.title;
  const description = post.excerptAr || post.excerpt || (post.contentAr || post.content || '').substring(0, 160);
  const tags: string[] = typeof post.tags === 'string' && post.tags ? JSON.parse(post.tags) : (post.tags || []);
  const keywords = [
    post.category,
    ...(post.categoryAr ? [post.categoryAr] : []),
    ...tags,
    'دي آرو',
    'D Arrow',
    'تسويق رقمي',
    'digital marketing',
  ].join(', ');

  return {
    title: `${title} | D Arrow`,
    description,
    keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title,
      description,
      url: `https://d-arrow.com/blog/${post.slug || post.id}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags,
      images: post.imageUrl
        ? [{ url: post.imageUrl, width: 1200, height: 630, alt: title }]
        : [{ url: 'https://d-arrow.com/og-image.jpg', width: 1200, height: 630, alt: 'D Arrow Blog' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
    alternates: {
      canonical: `https://d-arrow.com/blog/${post.slug || post.id}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  let post: any = null;

  try {
    const rawPost = await prisma.blogPost.findFirst({
      where: { OR: [{ id }, { slug: id }, { slug: decodedId }, { id: decodedId }] }
    });
    if (rawPost) {
      post = {
        ...rawPost,
        tags: rawPost.tags ? JSON.parse(rawPost.tags) : [],
        createdAt: rawPost.createdAt.toISOString(),
        updatedAt: rawPost.updatedAt.toISOString(),
      };
    }
  } catch (error) {
    console.error('Error fetching single blog post, trying fallback:', error);
  }

  if (!post && (FALLBACK_POSTS_BY_ID[id] || FALLBACK_POSTS_BY_ID[decodedId])) {
    post = FALLBACK_POSTS_BY_ID[id] || FALLBACK_POSTS_BY_ID[decodedId];
  }

  if (!post) return notFound();

  const tags: string[] = Array.isArray(post.tags) ? post.tags : [];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titleAr || post.title,
    description: post.excerptAr || post.excerpt || '',
    image: post.imageUrl || 'https://d-arrow.com/og-image.jpg',
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://d-arrow.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'D Arrow',
      url: 'https://d-arrow.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://d-arrow.com/logo-darrow.png',
      },
    },
    datePublished: post.date,
    dateModified: post.updatedAt || post.createdAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://d-arrow.com/blog/${post.id}`,
    },
    keywords: tags.join(', '),
    articleSection: post.category,
    inLanguage: ['ar', 'en'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient post={post} />
    </>
  );
}
