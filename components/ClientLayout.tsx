'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatBotAnnouncement from '@/components/ChatBotAnnouncement';

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

// LoadingScreen - import normally but render only on first paint
import LoadingScreen from '@/components/LoadingScreen';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    // Delay Chatbot rendering to drastically improve TBT and save ~1.5MB from the initial PageSpeed score
    const chatTimer = setTimeout(() => setShowChatBot(true), 4000);
    return () => clearTimeout(chatTimer);
  }, []);

  useEffect(() => {
    // Mark as initialized immediately - don't block with loading screen
    if (!isInitialized) {
      setIsInitialized(true);
    }

    // Only show loading for a brief moment (1.2s to satisfy client requirement but save LCP)
    const timer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isInitialized]);

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

      {/* Main Content - No blocking, renders immediately behind the preloader */}
      <NetworkBackground />
      <div className="grid-background w-full overflow-x-hidden relative z-10">
        <Header />
        <main className="pt-24">
          {children}
        </main>
        <Footer />
      </div>

      {/* Floating ChatBot - Delayed to prevent massive JS execution during page load */}
      {showChatBot && <ChatBot />}
      
      {/* ChatBot Announcement - Disabled as requested */}
      {/* <ChatBotAnnouncement /> */}
    </>
  );
}
