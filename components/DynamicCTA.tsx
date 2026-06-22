'use client';

import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BarChart, Smartphone, Globe, Sparkles } from 'lucide-react';

interface DynamicCTAProps {
  type: string; // 'seo', 'smm', 'web', 'default'
}

export default function DynamicCTA({ type }: DynamicCTAProps) {
  const { lang } = useLanguage();

  if (!type || type === 'none') return null;

  const getCTAContent = () => {
    switch (type) {
      case 'seo':
        return {
          title: lang === 'ar' ? 'هل تريد تصدر نتائج بحث جوجل؟' : 'Want to Dominate Google Search Results?',
          desc: lang === 'ar' 
            ? 'احصل على تحليل مجاني لموقعك واكتشف كيف يمكن لفريق السيو لدينا مضاعفة زياراتك العضوية.'
            : 'Get a free SEO audit and discover how our team can double your organic traffic.',
          btn: lang === 'ar' ? 'اطلب استشارة سيو' : 'Request SEO Audit',
          link: '/services/seo',
          icon: <BarChart size={32} className="text-[#FF9A3C]" />,
          gradient: 'from-[#FF9A3C]/20 to-[#FF4D6D]/5',
          border: 'border-[#FF9A3C]/30'
        };
      case 'smm':
        return {
          title: lang === 'ar' ? 'اجعل علامتك التجارية تتصدر منصات التواصل' : 'Make Your Brand Trend on Social Media',
          desc: lang === 'ar'
            ? 'نحن نبني حملات إعلانية واستراتيجيات محتوى تحقق أعلى عائد على الاستثمار (ROI) لشركتك.'
            : 'We build ad campaigns and content strategies that drive the highest ROI for your business.',
          btn: lang === 'ar' ? 'تواصل مع خبراء السوشيال' : 'Talk to Social Experts',
          link: '/services/smm',
          icon: <Smartphone size={32} className="text-[#10B981]" />,
          gradient: 'from-[#10B981]/20 to-[#0a0e27]',
          border: 'border-[#10B981]/30'
        };
      case 'web':
        return {
          title: lang === 'ar' ? 'موقعك الإلكتروني هو واجهتك الرقمية' : 'Your Website is Your Digital Storefront',
          desc: lang === 'ar'
            ? 'هل موقعك بطيء أو لا يجلب عملاء؟ دعنا نصمم لك موقعاً سريعاً ومُحسّناً لتجربة المستخدم يزيد من مبيعاتك.'
            : 'Is your site slow or not converting? Let us design a fast, UX-optimized website that drives sales.',
          btn: lang === 'ar' ? 'اطلب تصميم موقعك' : 'Request Web Design',
          link: '/services/web',
          icon: <Globe size={32} className="text-[#3B82F6]" />,
          gradient: 'from-[#3B82F6]/20 to-[#0a0e27]',
          border: 'border-[#3B82F6]/30'
        };
      case 'default':
      default:
        return {
          title: lang === 'ar' ? 'جاهز للارتقاء بأعمالك للقمة؟' : 'Ready to Take Your Business to the Next Level?',
          desc: lang === 'ar'
            ? 'في دي آرو نملك الأدوات، الخبرة، والشغف لنوصل علامتك التجارية للجمهور الصحيح وتحقيق أرقام خيالية.'
            : 'At D Arrow, we have the tools, expertise, and passion to connect your brand with the right audience and achieve massive growth.',
          btn: lang === 'ar' ? 'احجز استشارتك المجانية' : 'Book Free Consultation',
          link: '/contact',
          icon: <Sparkles size={32} className="text-[#FF4D6D]" />,
          gradient: 'from-[#FF4D6D]/20 to-[#FF9A3C]/10',
          border: 'border-[#FF4D6D]/30'
        };
    }
  };

  const content = getCTAContent();

  return (
    <div className={`mt-16 mb-8 rounded-2xl border ${content.border} bg-gradient-to-br ${content.gradient} p-8 md:p-10 relative overflow-hidden shadow-xl`}>
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="flex-1 text-center md:text-start" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0a0e27]/50 backdrop-blur-sm border border-white/10 shadow-lg">
            {content.icon}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {content.title}
          </h3>
          <p className="text-gray-300 md:text-lg max-w-2xl">
            {content.desc}
          </p>
        </div>
        
        <div className="flex-shrink-0 w-full md:w-auto">
          <Link 
            href={content.link}
            className="group flex items-center justify-center gap-2 w-full md:w-auto bg-white text-[#0a0e27] font-bold py-4 px-8 rounded-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-1 transition-all duration-300"
          >
            {content.btn}
            {lang === 'ar' ? (
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
