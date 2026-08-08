'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Clock, User, Tag, Search, Share2, ShoppingCart, Palette, Cpu, Video, Megaphone, Camera, TrendingUp, FileText } from 'lucide-react';

import ContentGate from '@/components/ContentGate';
import DynamicCTA from '@/components/DynamicCTA';

interface BlogPostClientProps {
  post: any;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const { lang, t } = useLanguage();
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('T')[0].split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return dateStr;
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', calendar: 'gregory' };
    try {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', options);
    } catch {
      return dateStr;
    }
  };

  const getDisplayText = (enText: string, arText: string) => {
    return lang === 'ar' ? (arText || enText) : (enText || arText);
  };

  const title = getDisplayText(post.title, post.titleAr);
  
  // Sanitize the raw HTML from Quill to forcefully remove bad inline styles that break Arabic text
  let rawContent = getDisplayText(post.content, post.contentAr) || '';
  if (lang === 'ar') {
    rawContent = rawContent
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces with normal spaces
      .replace(/\u00A0/g, ' ') // Replace unicode non-breaking spaces
      .replace(/text-align:\s*justify;?/gi, 'text-align: right;')
      .replace(/white-space:\s*nowrap;?/gi, 'white-space: normal;')
      .replace(/word-break:\s*[^"';]+;?/gi, '')
      .replace(/ql-align-justify/g, 'ql-align-right');
  }
  const content = rawContent;

  const gatedContent = getDisplayText(post.gatedContent, post.gatedContentAr);
  const category = getDisplayText(post.category, post.categoryAr);
  const tags: string[] = Array.isArray(post.tags) ? post.tags : [];

  const getCategoryIcon = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('seo')) return <Search size={56} />;
    if (c.includes('social')) return <Share2 size={56} />;
    if (c.includes('commerce') || c.includes('e-com')) return <ShoppingCart size={56} />;
    if (c.includes('brand')) return <Palette size={56} />;
    if (c.includes('ai') || c.includes('tech')) return <Cpu size={56} />;
    if (c.includes('video')) return <Video size={56} />;
    if (c.includes('paid') || c.includes('ads')) return <Megaphone size={56} />;
    if (c.includes('photo')) return <Camera size={56} />;
    if (c.includes('market') || c.includes('digital')) return <TrendingUp size={56} />;
    return <FileText size={56} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#14162E] pt-32 pb-20 blog-post-container">
      <div className="container mx-auto px-4 md:px-6 lg:px-12 max-w-5xl" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        
        {/* Back Button */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          {lang === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          <span>{lang === 'ar' ? 'العودة إلى المدونة' : 'Back to Blog'}</span>
        </Link>

        {/* Post Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-[#FF4D6D]/20 text-[#FF4D6D] text-sm font-semibold rounded-full">
              {category}
            </span>
            {tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-[#FF9A3C]/10 text-[#FF9A3C] text-xs font-medium rounded-full border border-[#FF9A3C]/20">
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="main-title font-bold text-white mb-6">
            {title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm border-b border-gray-800 pb-8">
            <div className="flex items-center gap-2">
              <User size={16} className="text-[#FF4D6D]" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#FF4D6D]" />
              <span>{formatDate(post.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#FF4D6D]" />
              <span>{post.readTime} {t('blogReadTime') || 'min read'}</span>
            </div>
          </div>
        </div>

        {/* Featured Image / Branded Cover */}
        {post.imageUrl && !imageError && post.imageUrl !== 'https://d-arrow.com/_headers' ? (
          <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12 shadow-2xl shadow-[#FF4D6D]/10">
            <img 
              src={post.imageUrl} 
              alt={title} 
              onError={() => setImageError(true)}
              className="w-full h-full object-cover" 
            />
          </div>
        ) : (
          <div className="w-full h-[300px] md:h-[380px] rounded-2xl overflow-hidden mb-12 shadow-2xl shadow-[#FF4D6D]/10 bg-gradient-to-br from-[#FF4D6D] via-[#FF6B6B] to-[#FF9A3C] relative flex items-center justify-center">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0, transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3) 0, transparent 40%)' }} />
            <div className="relative text-white/90">
              {getCategoryIcon(post.category)}
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-xs font-bold tracking-[0.3em] uppercase">
              D-Arrow · Blog
            </div>
          </div>
        )}

        {/* Post Content - Rich Text Rendering */}
        <style dangerouslySetInnerHTML={{ __html: `
          .blog-post-content, .blog-post-content p, .blog-post-content div, .blog-post-content span, .blog-post-content li {
            text-align: right !important;
            text-justify: none !important;
            word-break: normal !important;
            overflow-wrap: normal !important;
            white-space: normal !important;
          }
        `}} />
        <div 
          className="blog-post-content prose prose-invert max-w-none prose-headings:text-white prose-p:text-base prose-a:text-[#FF4D6D] hover:prose-a:text-[#FF9A3C] prose-img:rounded-xl prose-img:max-w-full w-full text-right"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Content Gate */}
        {post.isGated && gatedContent && (
          <ContentGate postSlug={post.slug} gatedContentHtml={gatedContent} />
        )}

        {/* Dynamic CTA */}
        {post.ctaType && post.ctaType !== 'none' && (
          <DynamicCTA type={post.ctaType} />
        )}

        {/* Tags Footer */}
        {tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={18} className="text-[#FF4D6D]" />
              <span className="text-gray-400 font-semibold">{lang === 'ar' ? 'الوسوم' : 'Tags'}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <Link 
                  key={i} 
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-4 py-2 bg-[#FF4D6D]/10 text-[#FF9A3C] text-sm font-medium rounded-full border border-[#FF4D6D]/20 hover:bg-[#FF4D6D]/20 hover:border-[#FF4D6D]/40 transition-all duration-300"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
