'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  titleAr?: string;
  content: string;
  contentAr?: string;
  excerpt: string;
  excerptAr?: string;
  author: string;
  date: string;
  time: string;
  category: string;
  categoryAr?: string;
  imageUrl?: string;
  readTime: number;
}

export default function BlogPage() {
  const { lang, t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchBlogPosts();
    // Refresh blog posts every 5 minutes
    const interval = setInterval(fetchBlogPosts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      const data = await response.json();
      // Sort posts by date and time (newest first)
      // Filter out draft posts - only show published ones on public blog
      const publishedPosts = (data.posts || []).filter((p: any) => p.status !== 'draft');
      const sortedPosts = publishedPosts.sort((a: BlogPost, b: BlogPost) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateB.getTime() - dateA.getTime();
      });
      setPosts(sortedPosts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog posts');
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(posts.map(post => post.category))];
  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateStr).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', options);
  };

  const getDisplayText = (enText: string, arText: string | undefined) => {
    return lang === 'ar' ? (arText || enText) : enText;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#14162E] pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        
        {/* Header Section */}
        <div className="mb-12 text-center" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {t('blogTitle')}
          </h1>
          <p className="text-xl text-gray-400">
            {t('blogSubtitle')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap gap-2 justify-center" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category === 'all' 
                ? t('allBlogPosts')
                : category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4D6D]"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Blog Posts Grid */}
        {!loading && !error && (
          <div>
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map(post => (
                  <article
                    key={post.id}
                    className="group bg-gradient-to-br from-[#1a1f3a] to-[#14162E] border border-gray-700 rounded-lg overflow-hidden hover:border-[#FF4D6D] transition-all duration-300 hover:shadow-xl hover:shadow-[#FF4D6D]/20 hover:-translate-y-1"
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {/* Image */}
                    {post.imageUrl && (
                      <div className="w-full h-48 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] relative overflow-hidden">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      {/* Category & Meta */}
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="px-3 py-1 bg-[#FF4D6D]/20 text-[#FF4D6D] text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                        <span className="text-sm text-gray-400">
                          {formatDate(post.date)} • {post.time}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[#FF4D6D] transition-colors duration-300 line-clamp-2">
                        {getDisplayText(post.title, post.titleAr)}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {getDisplayText(post.excerpt, post.excerptAr) || getDisplayText(post.content, post.contentAr).substring(0, 150) + '...'}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] flex items-center justify-center text-white text-xs font-bold">
                            {post.author.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm text-gray-400">{post.author}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {post.readTime} {t('blogReadTime')}
                        </span>
                      </div>

                      {/* Read More Button */}
                      <Link 
                        href={`/blog/${post.id}`}
                        className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#FF4D6D]/50 transition-all duration-300 active:scale-95 block text-center"
                      >
                        {t('blogReadMore')}
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-gray-400">
                  {t('blogNoPosts')}
                </p>
                <p className="text-gray-500 mt-2">
                  {t('blogCheckBack')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Auto-posting Info */}
        <div className="mt-16 bg-gradient-to-r from-[#FF4D6D]/10 to-[#FF9A3C]/10 border border-[#FF4D6D]/30 rounded-lg p-8 text-center">
          <p className="text-gray-300">
            {t('blogAutoPosting')}
          </p>
        </div>
      </div>
    </div>
  );
}
