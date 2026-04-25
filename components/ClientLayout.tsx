'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
    </>
  );
}

