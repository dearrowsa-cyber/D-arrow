'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

interface ContentGateProps {
  postSlug: string;
  gatedContentHtml: string;
}

export default function ContentGate({ postSlug, gatedContentHtml }: ContentGateProps) {
  const { lang, t } = useLanguage();
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, source: `blog_gated_${postSlug}` }),
      });
      
      const data = await res.json();
      if (data.success) {
        setUnlocked(true);
      } else {
        setError(data.error || (lang === 'ar' ? 'حدث خطأ، يرجى المحاولة لاحقاً' : 'An error occurred, please try again'));
      }
    } catch {
      setError(lang === 'ar' ? 'حدث خطأ في الاتصال' : 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  if (unlocked) {
    return (
      <div className="mt-8 pt-8 border-t border-[#FF4D6D]/30 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0e27] px-4 text-[#10B981] flex items-center gap-2 font-bold text-sm">
          <span>{lang === 'ar' ? 'المحتوى المتميز مفتوح' : 'Premium Content Unlocked'}</span>
        </div>
        <div 
          className="blog-post-content prose prose-invert max-w-none break-words prose-headings:text-white prose-p:text-base prose-a:text-[#FF4D6D] hover:prose-a:text-[#FF9A3C] prose-img:rounded-xl prose-img:max-w-full w-full overflow-hidden"
          dangerouslySetInnerHTML={{ __html: gatedContentHtml }}
        />
      </div>
    );
  }

  return (
    <div className="mt-12 relative overflow-hidden rounded-2xl border border-[#FF4D6D]/20 bg-gradient-to-br from-[#14162E] to-[#0a0e27] p-8 md:p-12 text-center shadow-2xl">
      {/* Blurred preview effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 select-none overflow-hidden" style={{ filter: 'blur(8px)' }}>
        <p className="text-left text-gray-500 m-8">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem...</p>
        <p className="text-left text-gray-500 m-8">Velit harum reiciendis quo illum error laboriosam tempora dolores veniam, architecto minima placeat impedit accusamus facilis est! Eaque rerum! Provident similique accusantium nemo autem...</p>
      </div>

      <div className="relative z-10 max-w-lg mx-auto">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#FF4D6D] to-[#FF9A3C] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,77,109,0.3)]">
          <Lock size={28} className="text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-3">
          {lang === 'ar' ? 'هذا المحتوى حصري للمشتركين' : 'This content is exclusive to subscribers'}
        </h3>
        <p className="text-gray-400 mb-8">
          {lang === 'ar' 
            ? 'أدخل بريدك الإلكتروني أدناه لفتح باقي المقال والحصول على أحدث استراتيجيات التسويق الرقمي مباشرة في صندوق الوارد الخاص بك.'
            : 'Enter your email below to unlock the rest of the article and get the latest digital marketing strategies straight to your inbox.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <UserIcon className="absolute top-1/2 transform -translate-y-1/2 text-gray-500" style={{ [lang === 'ar' ? 'right' : 'left']: '16px' }} />
            <input 
              type="text" 
              placeholder={lang === 'ar' ? 'الاسم (اختياري)' : 'Name (Optional)'}
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#0a0e27] border border-gray-700 rounded-xl py-3 px-12 text-white outline-none focus:border-[#FF4D6D] transition-colors"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>
          <div className="relative">
            <Mail className="absolute top-1/2 transform -translate-y-1/2 text-gray-500" style={{ [lang === 'ar' ? 'right' : 'left']: '16px' }} />
            <input 
              type="email" 
              placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#0a0e27] border border-gray-700 rounded-xl py-3 px-12 text-white outline-none focus:border-[#FF4D6D] transition-colors"
              dir="ltr"
            />
          </div>
          
          {error && <p className="text-red-400 text-sm">{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,77,109,0.4)] transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {lang === 'ar' ? 'افتح المحتوى الآن' : 'Unlock Content Now'}
                {lang === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </>
            )}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-4">
          {lang === 'ar' ? 'لن نقوم بإرسال رسائل مزعجة (Spam) أبداً.' : 'We will never send you spam.'}
        </p>
      </div>
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
