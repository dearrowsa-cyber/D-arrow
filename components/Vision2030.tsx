"use client";

import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

export default function Vision2030() {
  const { t, lang } = useLanguage();

  return (
    <section className="relative py-12 lg:py-16 overflow-hidden bg-gray-900 border-b border-gray-800/50">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-brand-pink/5 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-brand-orange/5 blur-[120px]"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${lang === 'ar' ? 'lg:flex-row' : ''}`}>
          
          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className={`w-full lg:w-1/2 flex flex-col ${lang === 'ar' ? 'text-right items-end' : 'text-left items-start'}`}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <span className="text-green-400 font-semibold text-sm tracking-wide uppercase">
                {t('visionBadge')}
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              {t('visionTitle')}
            </h2>
            
            <p className="text-base md:text-lg text-gray-300 dark:text-gray-400 mb-6 leading-relaxed">
              {t('visionDescription')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-10">
              <div className="flex flex-col gap-3">
                <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400/20 to-emerald-600/20 flex items-center justify-center border border-green-500/20 flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold text-base">{t('visionFeature1Title')}</h4>
                </div>
                <p className="text-sm text-gray-400 pl-15">{t('visionFeature1Desc')}</p>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange/20 to-brand-pink/20 flex items-center justify-center border border-brand-orange/20 flex-shrink-0">
                    <svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold text-base">{t('visionFeature2Title')}</h4>
                </div>
                <p className="text-sm text-gray-400 pl-15">{t('visionFeature2Desc')}</p>
              </div>
            </div>

            <a 
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] group text-sm"
            >
              {t('visionCTA')}
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

          {/* Video Side */}
          <motion.div 
            initial={{ opacity: 0, x: lang === 'ar' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="w-full lg:w-5/12 relative mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-green-500/20 aspect-video group">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent mix-blend-overlay z-10 pointer-events-none"></div>
              <video 
                src="/media/vision-2030.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                aria-label="Saudi Vision 2030 AI Video"
              />
            </div>
            
            {/* Decorative elements for video */}
            <div className={`absolute -bottom-6 ${lang === 'ar' ? '-left-6' : '-right-6'} w-32 h-32 bg-green-500/20 rounded-full blur-3xl -z-10`}></div>
            <div className={`absolute -top-6 ${lang === 'ar' ? '-right-6' : '-left-6'} w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl -z-10`}></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
