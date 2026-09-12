import fallbackData from './fallback-posts.json';

export interface FallbackPost {
  id: string;
  title: string;
  titleAr?: string;
  slug?: string;
  content: string;
  contentAr?: string;
  excerpt?: string;
  excerptAr?: string;
  author: string;
  category: string;
  categoryAr?: string;
  date: string;
  time: string;
  readTime: number;
  imageUrl?: string;
  tags: string[];
  status: string;
  createdAt?: string;
  updatedAt?: string;
  isGated: boolean;
  ctaType?: string;
  gatedContent?: string;
  gatedContentAr?: string;
}

export const FALLBACK_POSTS: FallbackPost[] = fallbackData.posts as FallbackPost[];

export const FALLBACK_POSTS_BY_ID: Record<string, FallbackPost> = Object.fromEntries(
  FALLBACK_POSTS.map(post => [post.id, post]),
);