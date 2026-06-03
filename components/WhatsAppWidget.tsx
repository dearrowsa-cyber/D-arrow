'use client';

import { useLanguage } from '@/components/LanguageProvider';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppWidget() {
  const { lang } = useLanguage();
  const isRTL = lang === 'ar';

  return (
    <div className={`fixed bottom-6 z-40 ${isRTL ? 'right-6' : 'left-6'} flex flex-col items-center gap-2 group`}>
      <a
        href="https://wa.me/966500466349"
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-[60px] h-[60px] sm:w-16 sm:h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 bg-gradient-to-r from-brand-orange to-brand-pink text-white"
        aria-label="Contact us on WhatsApp"
      >
        {/* Pulsing ring effect */}
        <span className="absolute inset-0 rounded-full bg-brand-pink opacity-50 animate-ping" style={{ animationDuration: '2.5s' }}></span>
        
        {/* Icon */}
        <FaWhatsapp size={32} className="relative z-10" />
      </a>
    </div>
  );
}
