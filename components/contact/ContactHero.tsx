'use client';

import { useLanguage } from '@/components/LanguageProvider';

const ContactHero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative py-16 lg:py-24 border-t border-gray-800/50">
      <div className="w-full mx-auto px-6 md:px-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black dark:text-white">
          {t('getInTouchTitle')}
        </h1>
        <p className="text-xl text-white dark:text-gray-400 max-w-2xl mx-auto">
          {t('getInTouchDesc')}
        </p>
      </div>
    </section>
  );
};

export default ContactHero;