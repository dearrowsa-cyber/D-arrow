'use client';

import { useLanguage } from '@/components/LanguageProvider';

export default function PrivacyPolicyPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0A0C16] text-gray-300 py-32 px-6 lg:px-12 relative overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#FF4D6D] opacity-10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#FF9A3C] opacity-10 blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          {t('privacyTitle')}
        </h1>
        <p className="text-sm text-gray-500 mb-12">{t('privacyLastUpdated')}</p>

        <div className="space-y-8 prose prose-invert max-w-none">
          <p className="text-lg leading-relaxed">{t('privacyIntro')}</p>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('dataCollectionTitle')}</h2>
            <p className="leading-relaxed">{t('dataCollectionDesc')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('dataUseTitle')}</h2>
            <p className="leading-relaxed">{t('dataUseDesc')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('dataSecurityTitle')}</h2>
            <p className="leading-relaxed">{t('dataSecurityDesc')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('userRightsTitle')}</h2>
            <p className="leading-relaxed">{t('userRightsDesc')}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
