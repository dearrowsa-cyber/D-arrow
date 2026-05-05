'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Analytics from '@/components/Analytics';
import CookieConsent from '@/components/CookieConsent';

// Lazy load ChatBot (contains heavy Three.js 3D engine)
const ChatBot = dynamic(() => import('@/components/ChatBot'), {
  ssr: false,
  loading: () => null,
});

import { useLanguage } from '@/components/LanguageProvider';

// Lazy load heavy components
const NetworkBackground = dynamic(() => import('@/components/NetworkBackground'), {
  ssr: false,
  loading: () => null,
});

import LoadingScreen from '@/components/LoadingScreen';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [showChatBot, setShowChatBot] = useState(false);
  const { lang } = useLanguage();

  // Hide loading screen after minimum delay (reduced for much faster FCP)
  useEffect(() => {
    const timer = setTimeout(() => setShowLoadingScreen(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Delay Chatbot rendering to drastically improve TBT
  useEffect(() => {
    const chatTimer = setTimeout(() => setShowChatBot(true), 4000);
    return () => clearTimeout(chatTimer);
  }, []);

  const pathname = usePathname();

  useEffect(() => {
    // Send a highly fire-and-forget payload for analytics tracking
    if (pathname) {
      fetch('/api/admin/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathname, referrer: document.referrer }),
        keepalive: true,
      }).catch(() => {}); // silent fail, do not block main thread
    }
  }, [pathname]);

  // Update HTML attributes for RTL/LTR support
  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.lang = lang;
    htmlElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Convert Arabic-Indic digits (٠١٢٣٤٥٦٧٨٩) to Western digits (0123456789) in all inputs
  useEffect(() => {
    const arabicToEnglish = (str: string) =>
      str.replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x0660 + 48))
         .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x06F0 + 48));

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        const converted = arabicToEnglish(target.value);
        if (converted !== target.value) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            target.tagName === 'INPUT' ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype,
            'value'
          )?.set;
          nativeInputValueSetter?.call(target, converted);
          target.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    };

    document.addEventListener('input', handleInput, true);
    return () => document.removeEventListener('input', handleInput, true);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showLoadingScreen && <LoadingScreen />}
      </AnimatePresence>

      <NetworkBackground />
      <div className="grid-background w-full overflow-x-hidden relative z-10">
        <Header />
        <main className="pt-24">
          {children}
        </main>
        <Footer />
      </div>

      {showChatBot && <ChatBot />}
      
      <CookieConsent />
      <Analytics />
    </>
  );
}

