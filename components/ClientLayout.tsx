'use client';

import { useEffect, useState } from 'react';
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
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    // Mark as initialized immediately - don't block with loading screen
    if (!isInitialized) {
      setIsInitialized(true);
    }

    // Only show loading for a very brief moment if needed (200ms)
    const timer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 200);

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
      {/* N8N Chatbot */}
      

      {/* Main Content - No blocking, renders immediately */}
      <NetworkBackground />
      <div className="grid-background w-full overflow-x-hidden relative z-10">
        <Header />
        <main className="pt-24">
          {children}
        </main>
        <Footer />
      </div>

      {/* Floating ChatBot */}
      <ChatBot />
      
      {/* ChatBot Announcement - Disabled for performance */}
      {/* <ChatBotAnnouncement /> */}
    </>
  );
}
