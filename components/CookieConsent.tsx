'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';
import Link from 'next/link';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const { t, lang } = useLanguage();

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem('darrow_cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('darrow_cookie_consent', 'granted');
    setShowBanner(false);
    // Dispatch event so Analytics component can catch it and load GA
    window.dispatchEvent(new Event('cookieConsentChange'));
  };

  const handleReject = () => {
    localStorage.setItem('darrow_cookie_consent', 'denied');
    setShowBanner(false);
    window.dispatchEvent(new Event('cookieConsentChange'));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#14162E] border-t border-[#FF4D6D]/30 shadow-2xl p-4 sm:p-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-white text-sm sm:text-base flex-1">
          <p>
            {t('cookieConsentBannerText')}{' '}
            <Link href="/cookies" className="text-[#FF4D6D] hover:underline whitespace-nowrap">
              {t('cookiePolicyTitle')}
            </Link>
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={handleReject}
            className="flex-1 sm:flex-none px-4 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            {t('cookieRejectAll')}
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white rounded hover:shadow-lg transition-all font-medium text-sm"
          >
            {t('cookieAcceptAll')}
          </button>
        </div>
      </div>
    </div>
  );
}
