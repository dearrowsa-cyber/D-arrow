'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from '@/components/ThemeProvider';
import Image from 'next/image';
import Link from 'next/link';

export default function SocialMediaLanding() {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();

  const isRTL = lang === 'ar';

  const results = [
    {
      image: '/media/lp/results1.png',
      title: t('smmLP_caseStudy1'),
      tag: 'Engagement'
    },
    {
      image: '/media/lp/results2.png',
      title: t('smmLP_caseStudy2'),
      tag: 'ROI'
    },
    {
      image: '/media/lp/strategy.png',
      title: t('smmLP_caseStudy3'),
      tag: 'Branding'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white overflow-hidden">
      
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-pink/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-orange/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={`w-full lg:w-3/5 ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-sm font-bold mb-6">
              #1 Social Media Agency
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
              {t('smmLP_heroTitle')}
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
              {t('smmLP_heroSub')}
            </p>
            <div className={`flex flex-wrap gap-4 ${isRTL ? 'justify-start' : 'justify-start'}`}>
              <Link 
                href="/contact"
                className="px-10 py-5 bg-gradient-to-r from-brand-pink to-brand-orange text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,77,109,0.3)] active:scale-95"
              >
                {t('smmLP_cta')}
              </Link>
              <button className="px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold text-lg transition-all active:scale-95">
                {isRTL ? 'شاهد أعمالنا' : 'View Portfolio'}
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full lg:w-2/5 relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image 
                src="/media/lp/strategy.png" 
                alt="Social Media Strategy" 
                width={800} 
                height={600} 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-transparent to-transparent"></div>
            </div>
            {/* Floating metrics mockup */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute -top-10 ${isRTL ? '-left-10' : '-right-10'} bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl hidden md:block`}
            >
              <div className="text-brand-orange text-3xl font-bold">+320%</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest">Engagement rate</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Results Showcase Section */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('smmLP_resultsTitle')}</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t('smmLP_resultsSub')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((result, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] border border-white/10"
              >
                <Image 
                  src={result.image} 
                  alt={result.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform">
                  <span className="text-brand-pink text-xs font-bold uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {result.tag}
                  </span>
                  <h3 className="text-2xl font-bold text-white group-hover:text-brand-orange transition-colors">
                    {result.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-12 ${isRTL ? 'dir-rtl' : ''}`}>
            {[
              {
                title: t('smmLP_feature1Title'),
                desc: t('smmLP_feature1Desc'),
                icon: (
                  <svg className="w-8 h-8 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              },
              {
                title: t('smmLP_feature2Title'),
                desc: t('smmLP_feature2Desc'),
                icon: (
                  <svg className="w-8 h-8 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: t('smmLP_feature3Title'),
                desc: t('smmLP_feature3Desc'),
                icon: (
                  <svg className="w-8 h-8 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )
              }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className={`p-10 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <div className={`mb-6 flex ${isRTL ? 'justify-end' : 'justify-start'}`}>
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-12 relative">
        <div className="max-w-5xl mx-auto rounded-[40px] bg-gradient-to-br from-brand-pink to-brand-orange p-1 px-1">
          <div className="bg-[#0a0e27] rounded-[39px] py-20 px-8 md:px-16 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">{isRTL ? 'جاهز لتحقيق نتائج حقيقية؟' : 'Ready to Get Real Results?'}</h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              {isRTL ? 'انضم إلى قائمة عملائنا المميزين وابدأ رحلة النمو اليوم مع أقوى استراتيجيات التسويق.' : 'Join our elite client list and start your growth journey today with the most powerful marketing strategies.'}
            </p>
            <Link 
              href="/contact"
              className="px-12 py-6 bg-white text-[#0a0e27] rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.2)] inline-block"
            >
              {t('smmLP_cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Meta */}
      <footer className="py-12 text-center text-gray-600 text-sm border-t border-white/5">
        &copy; 2026 D-Arrow Digital Agency. All results are verified client outcomes.
      </footer>

    </div>
  );
}
