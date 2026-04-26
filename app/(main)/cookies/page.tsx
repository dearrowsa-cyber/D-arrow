'use client';

import { useLanguage } from '@/components/LanguageProvider';

export default function CookiePolicyPage() {
  const { t, lang } = useLanguage();

  const handleManageCookies = () => {
    localStorage.removeItem('darrow_cookie_consent');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0A0C16] text-gray-300 py-32 px-6 lg:px-12 relative overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#FF4D6D] opacity-10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#FF9A3C] opacity-10 blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          {t('cookiePolicyTitle')}
        </h1>

        <div className="space-y-8 prose prose-invert max-w-none">
          <p className="text-lg leading-relaxed">{t('cookiePolicyIntro')}</p>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('whatAreCookiesTitle')}</h2>
            <p className="leading-relaxed">{t('whatAreCookiesDesc')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('cookieTypesTitle')}</h2>
            <div className="bg-[#14162E] p-6 rounded-lg border border-gray-800 space-y-4">
              <div>
                <h3 className="text-xl font-medium text-[#FF4D6D] mb-2">{t('cookieEssentialTitle')}</h3>
                <p className="text-gray-400">{t('cookieEssentialDesc')}</p>
              </div>
              <div className="pt-4 border-t border-gray-800">
                <h3 className="text-xl font-medium text-[#FF9A3C] mb-2">{t('cookieAnalyticsTitle')}</h3>
                <p className="text-gray-400">{t('cookieAnalyticsDesc')}</p>
              </div>
            </div>
          </section>

          <section className="pt-8">
            <button
              onClick={handleManageCookies}
              className="bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
            >
              {t('manageCookies')}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
