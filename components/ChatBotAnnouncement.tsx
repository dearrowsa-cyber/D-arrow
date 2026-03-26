'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function ChatBotAnnouncement() {
  const [isVisible, setIsVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { lang } = useLanguage();

  const isAr = lang === 'ar';

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio playback not supported');
    }
  };

  // Show browser notification
  const showBrowserNotification = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('D Arrow Chatbot', {
          body: isAr ? 'أهلاً بك! كيف حالك؟ هل يمكننا التحدث؟' : 'Hi there! How are you? Can we talk?',
          icon: '/chatbot.png',
          badge: '/chatbot.png',
          tag: 'chatbot-notification',
          requireInteraction: true,
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('D Arrow Chatbot', {
              body: isAr ? 'أهلاً بك! كيف حالك؟ هل يمكننا التحدث؟' : 'Hi there! How are you? Can we talk?',
              icon: '/chatbot.png',
              badge: '/chatbot.png',
              tag: 'chatbot-notification',
              requireInteraction: true,
            });
          }
        });
      }
    }
  };

  // Track if chat is open
  useEffect(() => {
    const handleChatOpen = () => setIsChatOpen(true);
    const handleChatClose = () => setIsChatOpen(false);
    
    window.addEventListener('chatbot-opened', handleChatOpen);
    window.addEventListener('chatbot-closed', handleChatClose);
    
    return () => {
      window.removeEventListener('chatbot-opened', handleChatOpen);
      window.removeEventListener('chatbot-closed', handleChatClose);
    };
  }, []);

  useEffect(() => {
    // 2 seconds baad show hoga
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Show notifications only if chat is not open
      if (!isChatOpen) {
        playNotificationSound();
        showBrowserNotification();
      }
      
      // 8 seconds baad auto-close
      const timer = setTimeout(() => setIsVisible(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isChatOpen]);

  // Content based on language
  const content = {
    en: {
      hi: "Hi 👋",
      ask: "How are you? Can we talk?",
      help: "I'm here to help! ✨",
      btn: "Let's Talk",
    },
    ar: {
      hi: "أهلاً بك 👋",
      ask: "كيف حالك؟ هل يمكننا التحدث؟",
      help: "أنا هنا لمساعدتك! ✨",
      btn: "لنبدأ الحديث",
    }
  };

  const t = isAr ? content.ar : content.en;

  return (
    <>
      {isVisible && (
        <div
          className={`fixed bottom-30 z-50 ${isAr ? 'left-4' : 'right-4'} transition-opacity duration-300`}
          dir={isAr ? 'rtl' : 'ltr'}
        >
          {/* Notification Popup Style with Speech Bubble */}
          <div className="relative w-[380px] ml-10">
            {/* Speech Bubble Tail */}
            <div className={`absolute bottom-[-12px] ${isAr ? 'left-8' : 'right-8'} w-0 h-0 border-l-8 border-r-8 border-t-[12px] border-l-transparent border-r-transparent border-t-[#14162E]`} />
            
            <div className="relative bg-[#14162E] backdrop-blur-md border border-[#FF9A3C]/30 shadow-[0_10px_40px_rgba(255,109,79,0.3)] rounded-2xl p-4 overflow-hidden">
              
              {/* Background Light Glow */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 blur-2xl rounded-full" />

              {/* Close Button */}
              <button
                onClick={() => setIsVisible(false)}
                className={`absolute top-2 ${isAr ? 'left-2' : 'right-2'} text-white/70 hover:text-white transition-colors`}
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3">
                
                {/* Logo Section - Compact */}
                <div 
                  className="flex-shrink-0"
                >
                  <img 
                    src="/chatbot-icon.jpeg"
                    alt="AI Chatbot"
                    className="w-14 h-14 object-contain drop-shadow-md rounded-xl"
                  />
                </div>

                {/* Text Content - Compact */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold !text-white mb-1">{t.hi}</h3>
                  <p className="text-xs !text-white/90 leading-tight truncate">
                    {t.ask}
                  </p>
                </div>
              </div>

              {/* Action Button - Small */}
              <button
                onClick={() => {
                  setIsVisible(false);
                  const chatBtn = document.querySelector('button[class*="fixed bottom-6"]') as HTMLButtonElement;
                  chatBtn?.click();
                }}
                className="w-full mt-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all border border-white/30"
              >
                {t.btn}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}