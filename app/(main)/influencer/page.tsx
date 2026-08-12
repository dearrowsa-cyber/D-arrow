'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { Star, Globe, TrendingUp, Users, ArrowRight, ShieldCheck, Sparkles, Layout } from 'lucide-react';
import Image from 'next/image';

export default function JoinInfluencerPage() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen text-white pb-20">
      <svg className="absolute w-0 h-0" style={{ position: 'absolute', width: 0, height: 0 }}>
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop stopColor="#FF4D6D" offset="0%" />
          <stop stopColor="#FF9A3C" offset="100%" />
        </linearGradient>
      </svg>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        {/* Ambient Creative Background Lighting */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-tr from-[#FF4D6D]/20 via-[#FF6F4F]/15 to-[#FF9A3C]/20 blur-[140px] opacity-70 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#FF4D6D]/15 blur-[140px]"></div>
          <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#FF9A3C]/15 blur-[120px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0b0d1f_85%)]"></div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${isAr ? 'lg:flex-row-reverse' : ''}`}>
            {/* Text Content */}
            <div className={`flex-1 text-center ${isAr ? 'lg:text-right' : 'lg:text-left'}`}>
              <div className="inline-flex flex-wrap items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF4D6D]/15 to-[#FF9A3C]/15 border border-[#FF4D6D]/30 mb-6 backdrop-blur-md shadow-lg shadow-[#FF4D6D]/5">
                <Star className="w-4 h-4 text-[#FF4D6D] fill-[#FF4D6D] animate-pulse" />
                <span className="text-xs md:text-sm font-bold tracking-wide text-[#FF4D6D]">
                  {isAr ? 'وسيط إعلاني مرخص — هيئة الإعلام المرئي والمسموع (L-MR-2026-000614)' : 'Licensed Ad Broker — GMedia (L-MR-2026-000614)'}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-[1.2]">
                {isAr ? (
                  <>
                    التسويق عبر المؤثرين وإدارة الأعمال <span className="bg-gradient-to-r from-[#FF4D6D] via-[#FF6F4F] to-[#FF9A3C] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,77,109,0.3)]">باحترافية</span>
                  </>
                ) : (
                  <>
                    Influencer Marketing & Business Management <span className="bg-gradient-to-r from-[#FF4D6D] via-[#FF6F4F] to-[#FF9A3C] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,77,109,0.3)]">Professionally</span>
                  </>
                )}
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                {isAr 
                  ? 'نربط أصحاب العلامات التجارية بأبرز المؤثرين وصنّاع المحتوى السعوديين، ونوفر لهم صفحات تعريفية وحملات تسويقية متكاملة تحت إشراف ترخيص نظامي موثوق.'
                  : 'We connect brands with top Saudi influencers and content creators, providing tailored portfolio pages and full campaign management under licensed credibility.'}
              </p>

              <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isAr ? 'lg:justify-start lg:flex-row-reverse' : 'lg:justify-start'} items-center mb-10`}>
                <Link 
                  href="https://in.d-arrow.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF4D6D] via-[#FF6F4F] to-[#FF9A3C] !text-white px-8 py-4 rounded-2xl font-extrabold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(255,77,109,0.5)] overflow-hidden w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isAr ? 'منصة المؤثرين (in.d-arrow.com)' : 'Influencers Platform (in.d-arrow.com)'}
                    <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  </span>
                </Link>

                <Link 
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white px-7 py-4 rounded-2xl font-bold text-base transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                >
                  {isAr ? 'تواصل معنا للحملات' : 'Contact for Campaigns'}
                </Link>
              </div>

              {/* Stat Counters */}
              <div className={`grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg mx-auto ${isAr ? 'lg:mr-0' : 'lg:ml-0'}`}>
                <div className="text-center lg:text-right">
                  <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] bg-clip-text text-transparent">+150</div>
                  <div className="text-xs text-slate-400 font-medium mt-1">{isAr ? 'مؤثر سعودي' : 'Saudi Influencers'}</div>
                </div>
                <div className="text-center lg:text-right">
                  <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] bg-clip-text text-transparent">98%</div>
                  <div className="text-xs text-slate-400 font-medium mt-1">{isAr ? 'نسبة النجاح' : 'Success Rate'}</div>
                </div>
                <div className="text-center lg:text-right">
                  <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] bg-clip-text text-transparent">+50M</div>
                  <div className="text-xs text-slate-400 font-medium mt-1">{isAr ? 'إجمالي المشاهدات' : 'Total Reach'}</div>
                </div>
              </div>
            </div>

            {/* Saudi Influencers Creative Visual Hero Card */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FF4D6D] via-[#FF6F4F] to-[#FF9A3C] rounded-3xl blur-[70px] opacity-30 animate-pulse"></div>
              
              <div className="relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,77,109,0.25)] border border-white/15 bg-[#14162E]/80 backdrop-blur-xl group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D1F] via-transparent to-transparent z-10 opacity-70"></div>
                
                <Image 
                  src="/influencer-hero-saudi-bg.png" 
                  alt="Saudi Influencer Marketing Platform - D-Arrow"
                  width={700}
                  height={850}
                  priority
                  className="w-full h-[420px] sm:h-[500px] object-cover rounded-3xl transition-transform duration-700 group-hover:scale-105"
                />

                {/* Floating Glassmorphism Overlay Cards */}
                <div className="absolute top-6 right-6 z-20 bg-black/40 backdrop-blur-xl border border-white/20 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-xl">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] flex items-center justify-center text-white font-black text-sm">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-white">{isAr ? 'ترخيص إعلامي موثق' : 'Verified Ad License'}</div>
                    <div className="text-[10px] text-slate-300">{isAr ? 'هيئة الإعلام المرئي والمسموع' : 'GMedia Certified'}</div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2 overflow-hidden">
                      <div className="w-8 h-8 rounded-full border-2 border-[#14162E] bg-gradient-to-tr from-[#FF4D6D] to-[#FF9A3C] flex items-center justify-center font-bold text-xs text-white">ح</div>
                      <div className="w-8 h-8 rounded-full border-2 border-[#14162E] bg-gradient-to-tr from-[#FF9A3C] to-[#FF4D6D] flex items-center justify-center font-bold text-xs text-white">س</div>
                      <div className="w-8 h-8 rounded-full border-2 border-[#14162E] bg-gradient-to-tr from-[#FF4D6D] to-[#FF9A3C] flex items-center justify-center font-bold text-xs text-white">ن</div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{isAr ? 'نخبة صناع المحتوى والمؤثرين' : 'Elite Content Creators'}</p>
                      <p className="text-[10px] text-slate-300">{isAr ? 'حملات احترافية قابلة للقياس' : 'Measurable Impact Campaigns'}</p>
                    </div>
                  </div>

                  <Link 
                    href="https://in.d-arrow.com/"
                    target="_blank"
                    className="text-xs font-bold px-3.5 py-2 rounded-xl bg-white text-[#0b0d1f] hover:bg-gradient-to-r hover:from-[#FF4D6D] hover:to-[#FF9A3C] hover:text-white transition-all duration-300 whitespace-nowrap"
                  >
                    {isAr ? 'تصفح المنصة ←' : 'Browse Platform ←'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 relative">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {isAr ? 'لماذا تنضم إلينا؟' : 'Why Join Us?'}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {isAr 
                ? 'نقدم لك كل ما تحتاجه للنجاح والتميز في عالم التسويق الرقمي والتأثير'
                : 'We provide everything you need to succeed and stand out in the digital marketing world'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Layout className="w-8 h-8" stroke="url(#brandGradient)" />,
                title: isAr ? 'صفحة احترافية خاصة' : 'Personal Professional Page',
                desc: isAr ? 'نصمم لك مدونة أو صفحة احترافية تعكس هويتك وتبرز محتواك بأفضل شكل' : 'We design a professional blog or page that reflects your identity and showcases your content.'
              },
              {
                icon: <Globe className="w-8 h-8" stroke="url(#brandGradient)" />,
                title: isAr ? 'وصول عالمي' : 'Global Reach',
                desc: isAr ? 'نساعدك في الوصول لجمهور أوسع وبناء قاعدة جماهيرية قوية' : 'We help you reach a wider audience and build a strong fan base.'
              },
              {
                icon: <Sparkles className="w-8 h-8" stroke="url(#brandGradient)" />,
                title: isAr ? 'دعم فني وتسويقي' : 'Technical & Marketing Support',
                desc: isAr ? 'فريق كامل من الخبراء جاهز لدعمك تقنياً وتسويقياً على مدار الساعة' : 'A full team of experts ready to support you technically and in marketing 24/7.'
              },
              {
                icon: <TrendingUp className="w-8 h-8" stroke="url(#brandGradient)" />,
                title: isAr ? 'زيادة الأرباح' : 'Increase Revenue',
                desc: isAr ? 'فرص للتعاون مع علامات تجارية رائدة وزيادة مصادر دخلك' : 'Opportunities to collaborate with leading brands and increase your income sources.'
              },
              {
                icon: <ShieldCheck className="w-8 h-8" stroke="url(#brandGradient)" />,
                title: isAr ? 'موثوقية واحترافية' : 'Credibility & Professionalism',
                desc: isAr ? 'العمل تحت مظلة كيان احترافي يزيد من ثقة الجمهور والعلامات التجارية بك' : 'Working under a professional entity increases the trust of the audience and brands in you.'
              },
              {
                icon: <Users className="w-8 h-8" stroke="url(#brandGradient)" />,
                title: isAr ? 'مجتمع مؤثرين' : 'Influencers Community',
                desc: isAr ? 'انضم لشبكة واسعة من المؤثرين وشارك الخبرات والنجاحات' : 'Join a wide network of influencers and share experiences and successes.'
              }
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action Bottom */}
      <section className="py-16 mt-8">
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12">
          <div className="bg-gradient-to-r from-[#1A1A2E] to-[#16213E] rounded-3xl p-8 md:p-16 border border-white/10 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4D6D]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF9A3C]/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {isAr ? 'جاهز لبدء رحلتك معنا؟' : 'Ready to start your journey with us?'}
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                {isAr 
                  ? 'خطوة واحدة تفصلك عن بناء هويتك الرقمية الاحترافية والوصول إلى ملايين المتابعين.'
                  : 'One step away from building your professional digital identity and reaching millions of followers.'}
              </p>
              <Link 
                href="https://in.d-arrow.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center gap-2 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] !text-white hover:from-[rgba(255,77,109,0.9)] hover:to-[rgba(255,154,60,0.9)] px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(255,77,109,0.3)] hover:scale-105"
              >
                {isAr ? 'ابدأ الآن' : 'Start Now'}
                <Star className="w-5 h-5 text-white fill-white" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
