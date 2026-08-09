'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Share2, ShoppingCart, Palette, Cpu, Video, Megaphone, Camera, TrendingUp, FileText, ArrowLeft, ArrowRight } from 'lucide-react';

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
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setSelectedTag(tagFromUrl);
  }, [tagFromUrl]);

  const handleImageError = (postId: string) => {
    setFailedImages(prev => ({ ...prev, [postId]: true }));
  };

  const categories = ['all', ...new Set(posts.map(post => post.category))];
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags || [])));

  const filteredPosts = posts.filter(post => {
    const matchCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));
    return matchCategory && matchTag;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('T')[0].split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return dateStr;
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      calendar: 'gregory',
    };
    try {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', options);
    } catch {
      return dateStr;
    }
  };

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
  };

  const getDisplayText = (enText: string | undefined, arText: string | undefined) => {
    return lang === 'ar' ? (arText || enText || '') : (enText || arText || '');
  };

  const getCategoryIcon = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('seo')) return <Search size={40} />;
    if (c.includes('social')) return <Share2 size={40} />;
    if (c.includes('commerce') || c.includes('e-com')) return <ShoppingCart size={40} />;
    if (c.includes('brand')) return <Palette size={40} />;
    if (c.includes('ai') || c.includes('tech')) return <Cpu size={40} />;
    if (c.includes('video')) return <Video size={40} />;
    if (c.includes('paid') || c.includes('ads')) return <Megaphone size={40} />;
    if (c.includes('photo')) return <Camera size={40} />;
    if (c.includes('market') || c.includes('digital')) return <TrendingUp size={40} />;
    return <FileText size={40} />;
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

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white shadow-lg shadow-[#FF4D6D]/30 scale-105'
                  : 'bg-[#14162E] text-slate-300 border border-white/10 hover:border-white/30'
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
              {filteredPosts.map(post => {
                let targetSlug = (post as any).slug || post.id;
                if (typeof targetSlug === 'string' && (targetSlug.startsWith('http://') || targetSlug.startsWith('https://'))) {
                  targetSlug = targetSlug.split('/blog/').pop() || targetSlug.split('/').pop() || post.id;
                }
                return (
                  <article
                    key={post.id}
                    className="group bg-[#0D0F25] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-[#FF4D6D]/60 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FF4D6D]/15 hover:-translate-y-1 flex flex-col justify-between h-full"
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <div>
                      {/* Image / Branded Cover */}
                      {post.imageUrl && !failedImages[post.id] && post.imageUrl !== 'https://d-arrow.com/_headers' ? (
                        <div className="w-full h-52 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] relative overflow-hidden">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            onError={() => handleImageError(post.id)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0D0F25] to-transparent pointer-events-none" />
                        </div>
                      ) : (
                        <div className="w-full h-52 bg-gradient-to-br from-[#FF4D6D] via-[#FF6B6B] to-[#FF9A3C] relative overflow-hidden flex items-center justify-center">
                          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0, transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3) 0, transparent 40%)' }} />
                          <div className="relative text-white/90 group-hover:scale-110 transition-transform duration-300">
                            {getCategoryIcon(post.category)}
                          </div>
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/80 text-[10px] font-bold tracking-widest uppercase">
                            D-Arrow · Blog
                          </div>
                          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0D0F25] to-transparent pointer-events-none" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6">
                        {/* Category & Tags */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-gradient-to-r from-[#FF4D6D]/15 to-[#FF9A3C]/15 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs font-bold rounded-full">
                            {post.category}
                          </span>
                          {(post.tags || []).slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-xs text-slate-400 font-medium">#{tag}</span>
                          ))}
                        </div>

                        {/* Title */}
                        <h2 className="text-lg md:text-xl font-extrabold mb-3 line-clamp-2 leading-snug">
                          <Link href={`/blog/${targetSlug}`} className="text-white hover:text-white/90 transition-colors duration-300 no-underline">
                            {getDisplayText(post.title, post.titleAr)}
                          </Link>
                        </h2>

                        {/* Excerpt */}
                        <p className="text-slate-300 text-sm mb-4 line-clamp-3 leading-relaxed font-light">
                          {getDisplayText(post.excerpt, post.excerptAr) || stripHtml(getDisplayText(post.content, post.contentAr)).substring(0, 150) + '...'}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Area */}
                    <div className="px-6 pb-6 pt-0 space-y-4">
                      {/* Footer Info */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF4D6D] to-[#FF9A3C] flex items-center justify-center text-white text-[11px] font-black shadow-sm">
                            {post.author ? post.author.charAt(0).toUpperCase() : 'D'}
                          </div>
                          <span className="text-slate-200 font-medium text-xs">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <span>{formatDate(post.date)}</span>
                          <span>•</span>
                          <span>{post.readTime || 5} {lang === 'ar' ? 'دقيقة قراءة' : 'min read'}</span>
                        </div>
                      </div>

                      {/* Read More Interactive Button */}
                      <Link 
                        href={`/blog/${targetSlug}`}
                        className="w-full py-3 px-4 bg-[#14162E] hover:bg-gradient-to-r hover:from-[#FF4D6D] hover:to-[#FF9A3C] border border-[#FF4D6D]/40 hover:border-transparent text-white font-bold text-sm rounded-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group/btn cursor-pointer shadow-md"
                      >
                        <span className="text-white font-bold">{lang === 'ar' ? 'اقرأ المقال كاملاً' : 'Read Full Article'}</span>
                        {lang === 'ar' ? (
                          <ArrowLeft className="w-4 h-4 text-[#FF4D6D] group-hover/btn:text-white group-hover/btn:-translate-x-1.5 transition-all duration-300" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-[#FF4D6D] group-hover/btn:text-white group-hover/btn:translate-x-1.5 transition-all duration-300" />
                        )}
                      </Link>
                    </div>
                  </article>
                );
              })}
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
