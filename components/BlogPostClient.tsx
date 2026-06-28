'use client';

import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Clock, User, Tag } from 'lucide-react';

import ContentGate from '@/components/ContentGate';
import DynamicCTA from '@/components/DynamicCTA';

interface BlogPostClientProps {
  post: any;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const { lang, t } = useLanguage();

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', options);
  };

  const getDisplayText = (enText: string, arText: string) => {
    return lang === 'ar' ? (arText || enText) : (enText || arText);
  };

  const title = getDisplayText(post.title, post.titleAr);
  const content = getDisplayText(post.content, post.contentAr);
  const gatedContent = getDisplayText(post.gatedContent, post.gatedContentAr);
  const category = getDisplayText(post.category, post.categoryAr);
  const tags: string[] = Array.isArray(post.tags) ? post.tags : [];

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

        {/* Featured Image */}
        {post.imageUrl && (
          <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12 shadow-2xl shadow-[#FF4D6D]/10">
            <img src={post.imageUrl} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Post Content - Rich Text Rendering */}
        <div 
          className="blog-post-content prose prose-invert max-w-none break-words prose-headings:text-white prose-p:text-base prose-a:text-[#FF4D6D] hover:prose-a:text-[#FF9A3C] prose-img:rounded-xl prose-img:max-w-full w-full"
          style={{ overflowWrap: 'break-word', wordWrap: 'break-word', hyphens: 'auto' }}
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
