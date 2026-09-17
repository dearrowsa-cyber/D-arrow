'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../pricing/pricing.module.css';
import { useLanguage } from '@/components/LanguageProvider';
import Image from 'next/image';
import ConsultationModal from '@/components/ConsultationModal';

const processSteps = [
  {
    titleKey: 'step_initial_title',
    descKey: 'step_initial_desc',
    icon: '/icon/mainicons1/transparent101.png',
    number: 1
  },
  {
    titleKey: 'step_strategy_title',
    descKey: 'step_strategy_desc',
    icon: '/icon/mainicons1/stragies&planning1.png',
    number: 2
  },
  {
    titleKey: 'step_execution_title',
    descKey: 'step_execution_desc',
    icon: '/icon/mainicons1/execution10.png',
    number: 3
  },
  {
    titleKey: 'step_analysis_title',
    descKey: 'step_analysis_desc',
    icon: '/icon/update/reporting3.png',
    number: 4
  },
];

export default function ProcessPage() {
  const { t, lang, siteData } = useLanguage();
  const pageData = siteData;
  const [isModalOpen, setIsModalOpen] = useState(false);


  return (
    <main className="min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative py-6 lg:py-8">
        <div className="w-full mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className={styles.heroMeta}>
              <span className={styles.heroBadge}>{pageData?.process?.badge?.[lang] || t('processHeroBadge') || 'OUR PROCESS'}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3  dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-brand-pink dark:to-brand-orange">
              {pageData?.process?.title?.[lang] || t('ourProvenProcess')}
            </h1>
            <p className="text-lg text-black dark:text-gray-800">
              {pageData?.process?.description?.[lang] || t('processHeroDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps Grid */}
      <section className="relative lg:py-6">
        <div className="w-full mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => {
              const stepNum = index + 1;
              const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
              const displayNum = lang === 'ar' ? arabicNumerals[stepNum] || String(stepNum) : String(stepNum);

              return (
                <div
                  key={stepNum}
                  className="relative group flex flex-col justify-between p-7 rounded-2xl transition-all duration-300 hover:-translate-y-2 border border-white/10 hover:border-[#FF4D6D]/40"
                  style={{
                    background: 'linear-gradient(145deg, rgba(20, 22, 46, 0.95) 0%, rgba(15, 17, 38, 0.85) 50%, rgba(11, 13, 31, 0.98) 100%)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)'
                  }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] rounded-2xl blur-md opacity-0 group-hover:opacity-20 transition duration-500 pointer-events-none" />

                  <div className="relative z-10 flex items-center justify-between w-full mb-6">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(255, 77, 109, 0.2) 0%, rgba(255, 154, 60, 0.08) 70%, transparent 100%)',
                        border: '1px solid rgba(255, 77, 109, 0.3)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
                      }}
                    >
                      <Image
                        src={step.icon}
                        alt={t(step.titleKey)}
                        width={48}
                        height={48}
                        className="w-10 h-10 object-contain mx-auto"
                        loading="lazy"
                      />
                    </div>
                    <div 
                      className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-md flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #FF4D6D 0%, #FF9A3C 100%)',
                        boxShadow: '0 4px 15px rgba(255, 77, 109, 0.35)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        fontFamily: lang === 'ar' ? "'29LT-Bukra', 'Cairo', sans-serif" : "'TT Hoves Pro', system-ui"
                      }}
                    >
                      <span>{t('stepLabel')} {displayNum}</span>
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 
                        className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug"
                        style={{ fontFamily: lang === 'ar' ? "'29LT-Bukra', 'Cairo', sans-serif" : "'Gilroy', system-ui" }}
                      >
                        {t(step.titleKey)}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-6">
                        {t(step.descKey)}
                      </p>
                    </div>

                    <div>
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

                      <div className="text-xs sm:text-sm text-gray-400">
                        <span style={{ color: '#FF6F4F', fontWeight: 600 }}>
                          {t('phase')} {displayNum}
                        </span>{' '}
                        {t('ofTheProcess')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Flow Section */}
      <section className="relative py-16 lg:py-20 border-t border-gray-800/50">
        <div className="w-full mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('processOverviewTitle')}</h2>
            <p className="text-gray-800 dark:text-gray-400 text-lg">{t('processOverviewDesc')}</p>
          </div>

          <div className="space-y-6">
            {[
              {
                phaseKey: 'discoveryConsultation',
                detailsKey: 'discoveryDetails'
              },
              {
                phaseKey: 'strategyDevelopment',
                detailsKey: 'strategyDetails'
              },
              {
                phaseKey: 'implementationExecution',
                detailsKey: 'implementationDetails'
              },
              {
                phaseKey: 'analysisOptimization',
                detailsKey: 'analysisDetails'
              },
            ].map((section, i) => (
              <details key={i} className="group p-6 border border-gray-800 rounded-lg hover:border-brand-pink/50 transition cursor-pointer">
                <summary className="flex justify-between items-center font-semibold text-lg">
                  <span>{t(section.phaseKey)}</span>
                  <span className="text-brand-orange group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="text-gray-800 dark:text-gray-400 mt-4 leading-relaxed">{t(section.detailsKey)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Process */}
      <section className="relative py-16 lg:py-20 border-t border-gray-800/50">
        <div className="w-full mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('whyThisProcess')}</h2>
            <p className="text-gray-800 dark:text-gray-400 text-lg">{t('whyThisProcessDesc')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '/icon/mainicons1/stragies&planning1.png', titleKey: 'strategicFoundation', descKey: 'strategicFoundationDesc' },
              { icon: '/icon/mainicons1/datadrive1.png', titleKey: 'continuousMonitoring', descKey: 'continuousMonitoringDesc' },
              { icon: '/icon/mainicons1/transparent10.png', titleKey: 'measurableResults', descKey: 'measurableResultsDesc' },
              { icon: '/icon/mainicons1/transparent101.png', titleKey: 'transparentCommunication', descKey: 'transparentCommunicationDesc' },
            ].map((feature, i) => (
              <div key={i} className="p-6 border border-gray-800 rounded-lg text-center hover:border-brand-pink/50 transition">
                <div className="mb-3 flex items-center justify-center h-14"><img src={feature.icon} alt={t(feature.titleKey)} className="w-12 h-12 max-w-[48px] max-h-[48px] object-contain mx-auto" /></div>
                <h3 className="font-semibold mb-2">{t(feature.titleKey)}</h3>
                <p className="text-gray-800 dark:text-gray-400 text-sm">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 lg:py-20 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white">{t('readyToGetStartedTitle')}</h2>
          <p className="text-xl text-gray-800 dark:text-gray-400 mb-8">
            {t('readyToGetStartedDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-brand-pink to-brand-orange hover:from-[rgba(255,77,109,0.9)] hover:to-[rgba(255,154,60,0.9)] text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-brand-pink/50 inline-block text-center cursor-pointer">
              {t('scheduleConsultation')}
            </button>
            <Link href="/services" className="border border-brand-pink/50 hover:border-brand-pink text-brand-orange px-8 py-4 rounded-lg font-semibold text-lg transition inline-block text-center">
              {t('viewOurServices')}
            </Link>
          </div>
        </div>
      </section>

      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}
