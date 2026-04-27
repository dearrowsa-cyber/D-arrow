"use client";

import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

export default function AboutCompany() {
  const { t, lang } = useLanguage();

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden border-b border-gray-800/50">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${lang === 'ar' ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: lang === 'ar' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-brand-pink/20">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-pink/20 to-transparent mix-blend-overlay z-10"></div>
              <video 
                src="/media/about-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Decorative element */}
            <div className={`absolute -bottom-6 ${lang === 'ar' ? '-right-6' : '-left-6'} w-24 h-24 bg-brand-orange/20 rounded-full blur-2xl -z-10`}></div>
            <div className={`absolute -top-6 ${lang === 'ar' ? '-left-6' : '-right-6'} w-32 h-32 bg-brand-pink/20 rounded-full blur-2xl -z-10`}></div>
          </motion.div>

          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className={`w-full lg:w-1/2 flex flex-col ${lang === 'ar' ? 'text-right items-end' : 'text-left items-start'}`}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-pink/10 border border-brand-pink/20 mb-6">
              <span className="text-brand-pink font-semibold text-sm tracking-wide uppercase">
                {t('aboutBadge')}
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {t('aboutTitle')}
            </h2>
            
            <p className="text-lg text-gray-300 dark:text-gray-400 mb-8 leading-relaxed">
              {t('aboutDescription')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-10">
              <div className="flex flex-col gap-2">
                <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 flex-shrink-0">
                    <svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold">{t('aboutFeature1Title')}</h4>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 pl-13">{t('aboutFeature1Desc')}</p>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-lg bg-brand-pink/10 flex items-center justify-center border border-brand-pink/20 flex-shrink-0">
                    <svg className="w-5 h-5 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold">{t('aboutFeature2Title')}</h4>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 pl-13">{t('aboutFeature2Desc')}</p>
              </div>
            </div>

            <a 
              href="/why-us"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-brand-pink to-brand-orange text-white rounded-lg font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,77,109,0.4)] group"
            >
              {t('aboutCTA')}
              <svg 
                className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${lang === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
