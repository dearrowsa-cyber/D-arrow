"use client";

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

const WhyChooseUs = () => {
  const { t } = useLanguage();
  const features = [
    { titleKey: 'feature_dataDriven_title', descKey: 'feature_dataDriven_desc' },
    { titleKey: 'feature_expertTeam_title', descKey: 'feature_expertTeam_desc' },
    { titleKey: 'feature_support_title', descKey: 'feature_support_desc' },
    { titleKey: 'feature_custom_title', descKey: 'feature_custom_desc' },
    { titleKey: 'feature_reporting_title', descKey: 'feature_reporting_desc' },
    { titleKey: 'feature_proven_title', descKey: 'feature_proven_desc' },
  ];

  return (
    <section id="why-us" className="relative py-16 lg:py-14 border-t border-gray-800/50">
      <div className="w-full mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white">
            {t('whyChooseUsTitle').split(' ').length > 1 ? (
              <>{t('whyChooseUsTitle').split(' ')[0]} <span className="text-brand-orange">{t('whyChooseUsTitle').split(' ').slice(1).join(' ')}</span></>
            ) : (
              t('whyChooseUsTitle')
            )}
          </h2>
          <p className="text-lg text-gray-800 dark:text-gray-400 max-w-2xl mx-auto">
            {t('whyChooseUsDesc')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 border border-brand-pink/30 rounded-xl bg-gradient-to-br from-secondary-dark/40 to-secondary-dark/20 hover:from-secondary-dark/60 hover:to-secondary-dark/40 transition-all duration-300 hover:border-brand-pink/60 hover:shadow-lg hover:shadow-brand-pink/20"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="w-8 h-8 text-brand-orange group-hover:text-brand-pink transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white group-hover:text-brand-orange transition-colors">
                  {t(feature.titleKey)}
                </h3>
              </div>
              <p className="text-gray-800 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
