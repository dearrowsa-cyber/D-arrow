'use client';

import { useLanguage } from '@/components/LanguageProvider';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppWidget() {
  const { lang } = useLanguage();
  const isRTL = lang === 'ar';

  return (
    <div className={`fixed bottom-6 z-40 w-16 h-16 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-90 flex items-center justify-center !bg-transparent text-white ${isRTL ? 'right-6' : 'left-6'}`}>
      <a
        href="https://wa.me/966500466349"
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-16 h-16 rounded-full bg-[#14162E] border border-white/10 flex items-center justify-center animate-glow animate-float-gentle group"
        aria-label="Contact us on WhatsApp"
      >
        {/* Inner glow effect behind the icon */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF4D6D]/20 to-[#FF9A3C]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Icon */}
        <FaWhatsapp size={32} className="text-white drop-shadow-2xl relative z-10" />
      </a>

      {/* Floating Welcome Message */}
      <div className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap bg-gradient-to-r from-[#14162E] to-[#1a1c3e] border border-white/10 text-white px-4 py-2.5 rounded-2xl shadow-[0_0_20px_rgba(255,77,109,0.3)] text-sm flex items-center gap-2.5 ${isRTL ? 'right-[120%] rounded-br-sm' : 'left-[120%] rounded-bl-sm'} animate-float-gentle [animation-delay:0.5s] pointer-events-none transition-all duration-300 before:absolute before:content-[''] before:top-1/2 before:-translate-y-1/2 before:border-8 before:border-transparent ${isRTL ? 'before:border-l-[#1a1c3e] before:-right-[15px]' : 'before:border-r-[#14162E] before:-left-[15px]'}`}>
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
        </span>
        <span className="font-bold tracking-wide">
          {isRTL ? 'تواصل ' : 'Contact '} <span className="bg-gradient-to-r from-[#FF9A3C] to-[#FF4D6D] bg-clip-text text-transparent">{isRTL ? 'معنا' : 'Us'}</span>
        </span>
      </div>
    </div>
  );
}
