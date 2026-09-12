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
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#FF4D6D]/10 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#FF9A3C]/10 blur-[120px]"></div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className={`flex flex-col lg:flex-row items-center gap-12 ${isAr ? 'lg:flex-row-reverse' : ''}`}>
            {/* Text Content */}
            <div className={`flex-1 text-center ${isAr ? 'lg:text-right' : 'lg:text-left'}`}>
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg shadow-[#FF4D6D]/10">
                  <Image
                    src="/influencer-logo.png"
                    alt="D-Arrow Influencer Logo"
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 backdrop-blur-sm">
                  <Star className="w-4 h-4 text-[#FF4D6D] fill-[#FF4D6D] animate-pulse" />
                  <span className="text-xs sm:text-sm font-bold tracking-wide text-[#FF4D6D]">
                    {isAr ? 'منصة وشبكة مؤثري دي آرو' : 'D-Arrow Influencer Network'}
                  </span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {isAr ? (
                  <>
                    أطلق العنان لإمكانياتك مع <span className="bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] bg-clip-text text-transparent">D-arrow</span>
                  </>
                ) : (
                  <>
                    Unleash Your Potential with <span className="bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] bg-clip-text text-transparent">D-arrow</span>
                  </>
                )}
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {isAr 
                  ? 'انضم كمؤثر واحصل على مدونة أو صفحة احترافية خاصة بك. شارك إبداعاتك، وسّع نطاق وصولك، ودعنا نساعدك في إيصال صوتك للعالم.'
                  : 'Join as an influencer and get your own professional blog or page. Share your creations, expand your reach, and let us help you amplify your voice to the world.'}
              </p>

              <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isAr ? 'lg:justify-start lg:flex-row-reverse' : 'lg:justify-start'} items-center`}>
                <Link 
                  href="https://in.d-arrow.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] !text-white hover:from-[rgba(255,77,109,0.9)] hover:to-[rgba(255,154,60,0.9)] px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,77,109,0.4)] overflow-hidden w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isAr ? 'انضم إلينا الآن' : 'Join Us Now'}
                    <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  </span>
                </Link>
              </div>
            </div>

            {/* Hero Video Content */}
            <div className="flex-1 w-full max-w-lg lg:max-w-xl relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FF4D6D] to-[#FF9A3C] rounded-3xl blur-[50px] opacity-25 animate-pulse"></div>
              <div className="relative w-full max-w-[480px] aspect-square rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(255,77,109,0.2)] border border-white/10 group flex items-center justify-center bg-[#0B0D1F]">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  src="/influencer-video.mp4"
                  className="w-full h-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured VIP Influencer Spotlight */}
      <section className="py-12 relative z-10">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#171a38] via-[#10142b] to-[#0d0f22] border border-white/15 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4D6D]/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF9A3C]/15 rounded-full blur-[100px] pointer-events-none" />

            <div className={`flex flex-col lg:flex-row items-center gap-10 ${isAr ? 'lg:flex-row-reverse' : ''}`}>
              {/* Photo Thumbnail */}
              <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border-2 border-[#FF4D6D]/40 bg-[#0d0f22] shadow-xl shadow-[#FF4D6D]/20 shrink-0 group">
                <Image
                  src="/influencers/mahmoud-sorour/sorour-hero-cutout.png"
                  alt="الفنان محمود سرور"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-bold text-amber-300">عازف الكمان الأول بالوطن العربي</span>
                </div>
              </div>

              {/* Spotlight Content */}
              <div className={`flex-1 text-center ${isAr ? 'lg:text-right' : 'lg:text-left'} space-y-4`}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 text-[#FF4D6D] text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-[#FF4D6D]" />
                  {isAr ? 'نجم ومؤثر مميز في شبكة دي آرو' : 'Featured VIP Influencer'}
                </div>

                <h3 className="text-2xl sm:text-4xl font-black text-white">
                  {isAr ? 'الفنان عازف الكمان محمود سرور' : 'Violin Virtuoso Mahmoud Sorour'}
                </h3>

                <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  {isAr 
                    ? 'عازف الكمان الأول بالوطن العربي والحائز على جائزة دار الأوبرا المصرية، مؤسس معهد سرور بالرياض، وعازف صولوهات أكثر من 90% من الأغاني الوطنية السعودية وأكثر من 1500 عمل سينمائي ودرامي.'
                    : 'The Arab world’s leading violin virtuoso, Cairo Opera House award winner, founder of Sorour Music Institute in Riyadh, and soloist on 90%+ of Saudi national anthems and 1500+ cinema & TV drama scores.'}
                </p>

                <div className={`flex flex-wrap items-center gap-4 justify-center ${isAr ? 'lg:justify-start lg:flex-row-reverse' : 'lg:justify-start'} pt-2`}>
                  <a
                    href="https://in.d-arrow.com/mahmoud-sorour"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white font-bold text-sm shadow-lg shadow-[#FF4D6D]/30 hover:scale-105 transition flex items-center gap-2"
                  >
                    {isAr ? 'الصفحة الرسمية على منصة المؤثرين' : 'Official Page on Influencers Platform'}
                    <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                  </a>

                  <Link
                    href="/influencer/mahmoud-sorour"
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm transition flex items-center gap-2"
                  >
                    {isAr ? 'السيرة الفنية التفصيلية' : 'Detailed Portfolio'}
                  </Link>

                  <a
                    href="https://www.youtube.com/user/abokoza"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-bold text-gray-200 transition"
                  >
                    YouTube Official
                  </a>

                  <a
                    href="https://www.instagram.com/mhmoudsorour/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-bold text-gray-200 transition"
                  >
                    Instagram
                  </a>
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
