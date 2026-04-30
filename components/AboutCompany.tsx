"use client";

import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

export default function AboutCompany() {
  const { t, lang } = useLanguage();

  return (
    <section className="relative py-12 lg:py-16 overflow-hidden border-b border-gray-800/50">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        <div className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${lang === 'ar' ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: lang === 'ar' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 relative flex justify-center"
          >
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-xl border border-gray-700 aspect-square group">
              <video 
                src="/media/about-video.mp4?v=2"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
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
            <div className="inline-flex items-center px-4 py-1 rounded-full border border-gray-600 mb-6">
              <span className="text-gray-300 text-sm tracking-wide">
                {t('aboutBadge')}
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {t('aboutTitle')}
            </h2>
            
            <p className="text-base md:text-lg text-gray-300 dark:text-gray-400 mb-6 leading-relaxed">
              {t('aboutDescription')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full mb-10">
              <div className="flex flex-col gap-3">
                <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded border border-gray-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold text-base md:text-lg">{t('aboutFeature1Title')}</h4>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{t('aboutFeature1Desc')}</p>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded border border-gray-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold text-base md:text-lg">{t('aboutFeature2Title')}</h4>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{t('aboutFeature2Desc')}</p>
              </div>
            </div>

            <a 
              href="/why-us"
              className={`inline-flex items-center text-brand-pink hover:text-brand-orange transition-colors font-medium text-lg group ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
            >
              <svg 
                className={`w-5 h-5 transition-transform ${lang === 'ar' ? 'mr-2 group-hover:-translate-x-1 rotate-180' : 'ml-2 group-hover:translate-x-1'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              {t('aboutCTA')}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
