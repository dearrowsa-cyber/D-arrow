'use client';

import { useLanguage } from './LanguageProvider';
import styles from '@/app/(main)/pricing/pricing.module.css';
import Image from 'next/image';

const processSteps = [
  {
    titleKey: 'step_initial_title',
    descKey: 'step_initial_desc',
    icon: '/icon/mainicons1/app10.png',
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
    icon: '/icon/mainicons1/analysis.png',
    number: 4
  },
];

const Process = () => {
  const { t, lang } = useLanguage();

  // Convert numbers to Arabic numerals
  const convertToArabicNumbers = (num: number): string => {
    if (lang === 'ar') {
      const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      return String(num).split('').map(digit => arabicNumerals[parseInt(digit)]).join('');
    }
    return String(num);
  };

  return (
    <section id="process" className="py-10 lg:py-14 border-t border-gray-800/50">
      <div className="w-full mx-auto px-6 md:px-12">
        <div suppressHydrationWarning className={`${lang === 'ar' ? 'text-right' : 'text-center'} max-w-3xl mx-auto mb-16`}>
          <div className={styles.heroMeta}>
            <span suppressHydrationWarning className={styles.heroBadge}>{t('processHeroBadge')}</span>
            <span suppressHydrationWarning className={styles.heroPill}>{t('processHeroPill')}</span>
          </div>
          <h2 suppressHydrationWarning className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-text-dark dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-brand-pink dark:to-brand-orange">
            {t('ourProvenProcess')}
          </h2>
          <p suppressHydrationWarning className="text-lg text-text-light dark:text-soft-white">
            {t('processHeroDesc')}
          </p>
        </div>

        <div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {processSteps.map((step, i) => (
            <div
              key={step.number}
              className={styles.processCard}
              role="article"
              aria-label={t(step.titleKey)}
            >
              <div className={styles.cardTop}>
                <div className={styles.iconWrap}>
                  <Image
                    src={step.icon}
                    alt={t(step.titleKey)}
                    width={90}
                    height={90}
                    className={styles.iconImage}
                    loading="lazy"
                  />
                </div>
                <div className={`${styles.badge}`}>
                  {t('stepLabel')} {convertToArabicNumbers(step.number)}
                </div>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitleprocess1}>{t(step.titleKey)}</h3>
                <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {t(step.descKey)}
                </p>
                <div className={styles.divider} />

                <div style={{ fontSize: '0.9rem', color: 'var(--text-dark)', paddingTop: '0.5rem' }}>
                  <span style={{ color: '#FF6F4F', fontWeight: 600 }}>{t('phase')} {convertToArabicNumbers(step.number)}</span> {t('ofTheProcess')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
