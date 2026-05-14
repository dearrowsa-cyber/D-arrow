'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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
  tags?: string[];
}

interface BlogClientProps {
  initialPosts: BlogPost[];
}

export default function BlogClient({ initialPosts }: BlogClientProps) {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const tagFromUrl = searchParams.get('tag');
  
  const [posts] = useState<BlogPost[]>(initialPosts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(tagFromUrl);

  useEffect(() => {
    setSelectedTag(tagFromUrl);
  }, [tagFromUrl]);

  const categories = ['all', ...new Set(posts.map(post => post.category))];
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags || [])));

  const filteredPosts = posts.filter(post => {
    const matchCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));
    return matchCategory && matchTag;
  });

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateStr).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', options);
  };

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
  };

  const getDisplayText = (enText: string, arText: string | undefined) => {
    return lang === 'ar' ? (arText || enText) : enText;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#14162E] pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        
        {/* Header Section */}
        <div className="mb-12 text-center" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {t('blogTitle')}
          </h1>
          <p className="text-xl text-gray-400">
            {t('blogSubtitle')}
          </p>
        </div>

        {/* Active Filters */}
        {selectedTag && (
          <div className="mb-8 flex justify-center items-center gap-4">
            <span className="text-gray-400">{lang === 'ar' ? 'تصفية حسب الوسم:' : 'Filtering by tag:'}</span>
            <span className="px-4 py-1.5 bg-[#FF4D6D]/20 text-[#FF4D6D] font-bold rounded-full border border-[#FF4D6D]/40 flex items-center gap-2">
              #{selectedTag}
              <button onClick={() => setSelectedTag(null)} className="hover:text-white">×</button>
            </span>
          </div>
        )}

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

        {/* Blog Posts Grid */}
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
                    {/* Category & Tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-[#FF4D6D]/20 text-[#FF4D6D] text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                      {(post.tags || []).slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[10px] text-gray-500 font-medium">#{tag}</span>
                      ))}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[#FF4D6D] transition-colors duration-300 line-clamp-2">
                      <Link href={`/blog/${post.id}`}>
                        {getDisplayText(post.title, post.titleAr)}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {getDisplayText(post.excerpt, post.excerptAr) || stripHtml(getDisplayText(post.content, post.contentAr)).substring(0, 150) + '...'}
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
                      className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] !text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#FF4D6D]/50 transition-all duration-300 active:scale-95 block text-center"
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
              <button onClick={() => { setSelectedCategory('all'); setSelectedTag(null); }} className="text-[#FF4D6D] mt-4 hover:underline">
                {lang === 'ar' ? 'عرض كل المقالات' : 'View all posts'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
