'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../pricing/pricing.module.css';
import { useLanguage } from '@/components/LanguageProvider';
import Image from 'next/image';

const processSteps = [
  {
    titleKey: 'step_initial_title',
    descKey: 'step_initial_desc',
    icon: '/icon/analysis-icon.png',
    number: 1
  },
  {
    titleKey: 'step_strategy_title',
    descKey: 'step_strategy_desc',
    icon: '/icon/result-icon.png',
    number: 2
  },
  {
    titleKey: 'step_execution_title',
    descKey: 'step_execution_desc',
    icon: '/icon/data-drive-icon.png',
    number: 3
  },
  {
    titleKey: 'step_analysis_title',
    descKey: 'step_analysis_desc',
    icon: '/icon/transparent-icon.png',
    number: 4
  },
];

export default function ProcessPage() {
  const { t, lang, siteData } = useLanguage();
  const pageData = siteData;


  return (
    <main className="min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative py-6 lg:py-8">
        <div className="w-full mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className={styles.heroMeta}>
              <span className={styles.heroBadge}>{pageData?.process?.badge?.[lang] || t('processHeroBadge') || 'OUR PROCESS'}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 !text-black dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-brand-pink dark:to-brand-orange">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 ">
            {(pageData?.process?.steps || processSteps).map((step: any, index: number) => {
               const stepNum = index + 1;
               return (
              <div key={stepNum} className={styles.processCard}>
                <div className={styles.cardTop}>
                  <div className={styles.iconWrap}>
                    <img src={step.icon} alt={step.title?.[lang] || t(step.titleKey)} className={styles.iconImage} />
                  </div>
                  <div className= {`${styles.badge}`} style={{ background: 'linear-gradient(90deg, #f7df04, #f7e204)'}}>
                    <span className='!text-black'>Step {stepNum}</span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitleprocess} style={{ color: 'var(--text-dark) !important', fontWeight: 'bold' }}>{step.title?.[lang] || t(step.titleKey)}</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {step.description?.[lang] || t(step.descKey)}
                  </p>
                  <div className={styles.divider} />

                  <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', paddingTop: '0.5rem' }}>
                    <span style={{ color: 'var(--brand-orange)', fontWeight: 600 }}>Phase {stepNum}</span> {t('ofTheProcess') || 'of the process'}
                  </div>
                </div>
              </div>
            )})}
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
              { icon: '/icon/result-icon.png', titleKey: 'strategicFoundation', descKey: 'strategicFoundationDesc' },
              { icon: '/icon/data-drive-icon.png', titleKey: 'continuousMonitoring', descKey: 'continuousMonitoringDesc' },
              { icon: '/icon/proven2-icon.png', titleKey: 'measurableResults', descKey: 'measurableResultsDesc' },
              { icon: '/icon/transparent-icon.png', titleKey: 'transparentCommunication', descKey: 'transparentCommunicationDesc' },
            ].map((feature, i) => (
              <div key={i} className="p-6 border border-gray-800 rounded-lg text-center hover:border-brand-pink/50 transition">
                <div className="mb-3"><img src={feature.icon} alt={t(feature.titleKey)} className={styles.iconImage} /></div>
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
            <Link href="/contact" className="bg-gradient-to-r from-brand-pink to-brand-orange hover:from-[rgba(255,77,109,0.9)] hover:to-[rgba(255,154,60,0.9)] text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-brand-pink/50 inline-block text-center">
              {t('scheduleConsultation')}
            </Link>
            <Link href="/services" className="border border-brand-pink/50 hover:border-brand-pink text-brand-orange px-8 py-4 rounded-lg font-semibold text-lg transition inline-block text-center">
              {t('viewOurServices')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
