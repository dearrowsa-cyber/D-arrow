'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const GA_MEASUREMENT_ID = 'G-3ZXDC8BYV4';

export default function Analytics() {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    // Check initial consent status
    const checkConsent = () => {
      const consent = localStorage.getItem('darrow_cookie_consent');
      setConsentGranted(consent === 'granted');
    };

    checkConsent();

    // Listen for changes from CookieConsent banner
    window.addEventListener('cookieConsentChange', checkConsent);

    return () => {
      window.removeEventListener('cookieConsentChange', checkConsent);
    };
  }, []);

  if (!consentGranted) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            cookie_flags: 'SameSite=None;Secure'
          });
        `}
      </Script>
    </>
  );
}
