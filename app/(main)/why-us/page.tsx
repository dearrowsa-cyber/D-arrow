'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../pricing/pricing.module.css';
import { useLanguage } from '@/components/LanguageProvider';

const features = [
  {
    icon: '/icon/mainicons1/datadrive1.png',
    titleKey: 'feature_dataDriven_title',
    descKey: 'feature_dataDriven_desc',
  },
  {
    icon: '/icon/mainicons1/expertteam1.png',
    titleKey: 'feature_expertTeam_title',
    descKey: 'feature_expertTeam_desc',
  },
  {
    icon: '/icon/update/support3.png',
    titleKey: 'feature_support_title',
    descKey: 'feature_support_desc',
  },
  {
    icon: '/icon/update/custom3.png',
    titleKey: 'feature_custom_title',
    descKey: 'feature_custom_desc',
  },
  {
    icon: '/icon/mainicons1/transparent10.png',
    titleKey: 'feature_reporting_title',
    descKey: 'feature_reporting_desc',
  },
  {
    icon: '/icon/update/track3.png',
    titleKey: 'feature_proven_title',
    descKey: 'feature_proven_desc',
  },
];

export default function WhyUsPage() {
  const { t, lang, siteData } = useLanguage();
  const pageData = siteData;

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <section className={`relative py-6 lg:py-6 `}>
        <div className="w-full mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className={styles.heroMeta}>
              <span className={styles.heroBadge}>{pageData?.whyUs?.badge?.[lang] || t('whyChooseUsBadge') || t('whyUs')}</span>
            </div>
            <h1 className="text-4xl  md:text-5xl font-bold  mb-4 text-black dark:text-white">
              {pageData?.whyUs?.title?.[lang] || t('whyChooseUsTitle')}
            </h1>
            <p className="text-lg text-white ">
              {pageData?.whyUs?.description?.[lang] || t('whyChooseUsDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-2 lg:py-4">
        <div className="w-full mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(pageData?.whyUs?.features || features).map((feature: any, index: number) => (
              <div key={index} className={styles.whyCard}>
                <div className={styles.cardTop}>
                  <div className={styles.iconWrap}>
                    <img src={feature.icon} alt={feature.title?.[lang] || t(feature.titleKey)} className={styles.iconImage} />
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{feature.title?.[lang] || t(feature.titleKey)}</h3>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }} className="text-gray-300 dark:text-gray-300">
                    {feature.description?.[lang] || t(feature.descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-4 lg:py-10 border-t  border-gray-800/50">
        <div className="w-full mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 ">
            {[
              { number: '8+', labelKey: 'projectsDelivered' },
              { number: '98%', labelKey: 'clientSatisfaction' },
              { number: '6+', labelKey: 'yearsExperience' },
            ].map((stat, i) => (
              <div key={i} className="p-4 border border-brand-pink/30 rounded-lg text-center hover:border-brand-pink/50 bg-secondary-dark transition">
                <div className="text-4xl font-bold text-brand-orange mb-2">
                  {stat.number}
                </div>
                <p className="text-gray-800 dark:text-gray-400 text-lg">{t(stat.labelKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="relative py-8 lg:py-10 border-t border-gray-800/50">
        <div className="w-full mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className=" text-gray-800 dark:text-white text-3xl md:text-4xl font-bold mb-4">{t('whatMakesDifferent')}</h2>
            <p className="text-white dark:text-gray-400 text-lg">{t('whatMakesDifferentDesc')}</p>
          </div>

          <div className="space-y-6">
            {[
              { titleKey: 'dedicatedAccountManagers', descKey: 'dedicatedAccountManagersDesc' },
              { titleKey: 'transparentReporting', descKey: 'transparentReportingDesc' },
              { titleKey: 'continuousOptimization', descKey: 'continuousOptimizationDesc' },
              { titleKey: 'industryExpertise', descKey: 'industryExpertiseDesc' },
            ].map((item, i) => (
              <details key={i} className="group p-6 border border-gray-800 rounded-lg hover:border-brand-pink/50 transition cursor-pointer">
                <summary className="flex justify-between items-center font-semibold text-lg text-black dark:text-white">
                  <span className='text-white'>{t(item.titleKey)}</span>
                  <span className="!text-amber-500 group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="!text-[ #FF4D6D] dark:text-gray-400 mt-4 leading-relaxed">{t(item.descKey)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-8 lg:py-10 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white">{t('experienceDifference')}</h2>
          <p className="text-xl !text-white dark:text-gray-400 mb-8">
            {t('experienceDifferenceDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] !text-white hover:from-[rgba(255,77,109,0.9)] hover:to-[rgba(255,154,60,0.9)] text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-brand-pink/50 inline-block text-center">
              Get Your Free Consultation
            </Link>
            <Link href="/services" className="border border-brand-pink/50 hover:border-brand-pink text-brand-orange px-8 py-4 rounded-lg font-semibold text-lg transition inline-block text-center">
              View Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
