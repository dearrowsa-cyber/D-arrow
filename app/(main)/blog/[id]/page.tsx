'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from 'lucide-react';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog/posts');
      const data = await response.json();
      
      const foundPost = data.posts?.find((p: any) => p.id === params.id);
      if (foundPost) {
        setPost(foundPost);
      } else {
        setError('Post not found');
      }
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', options);
  };

  const getDisplayText = (enText: string, arText: string) => {
    return lang === 'ar' ? (arText || enText) : (enText || arText);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#14162E] pt-32 pb-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4D6D]"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#14162E] pt-32 pb-20 text-center">
        <h1 className="text-3xl text-white mb-4">404 - {t('blogError') || 'Post Not Found'}</h1>
        <button onClick={() => router.push('/blog')} className="text-[#FF4D6D] hover:underline">
          {lang === 'ar' ? 'العودة إلى المدونة' : 'Back to Blog'}
        </button>
      </div>
    );
  }

  const title = getDisplayText(post.title, post.titleAr);
  const content = getDisplayText(post.content, post.contentAr);
  const category = getDisplayText(post.category, post.categoryAr);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#14162E] pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-12 max-w-4xl" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        
        {/* Back Button */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          {lang === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          <span>{lang === 'ar' ? 'العودة إلى المدونة' : 'Back to Blog'}</span>
        </Link>

        {/* Post Header */}
        <div className="mb-10">
          <span className="px-3 py-1 bg-[#FF4D6D]/20 text-[#FF4D6D] text-sm font-semibold rounded-full mb-4 inline-block">
            {category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
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
          className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-[#FF4D6D] hover:prose-a:text-[#FF9A3C] prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: content }}
        />

      </div>
    </div>
  );
}
