"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import ConsultationModal from './ConsultationModal';

const CTA = () => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="contact" className="py-10 lg:py-12 border-t border-[rgba(255,77,109,0.1)]">
      <div className="w-full mx-auto px-6 md:px-12 lg:px-16">
        <div className="bg-gradient-to-br from-[#14162E] via-[rgba(42, 42, 49, 0.8)] to-[rgba(11,13,31,0.9)] border border-[rgba(255,77,109,0.2)] rounded-3xl p-12 md:p-20 lg:p-24 text-center relative overflow-hidden backdrop-blur-md group hover:border-[rgba(255,77,109,0.4)] transition-all duration-300">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-brand-pink/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-brand-orange/10 rounded-full filter blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold !text-white mb-6 leading-tight">{t('readyToGrowTitle')}</h2>
            <p className="text-lg md:text-xl !text-white max-w-3xl mx-auto mb-10 leading-relaxed opacity-90">{t('readyToGrowDesc')}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-block bg-gradient-to-r from-[#FF4D6D] via-[#FF6F4F] to-[#FF9A3C] hover:shadow-2xl hover:shadow-[rgba(255,77,109,0.6)] !text-white px-10 py-4 rounded-lg font-bold text-base md:text-lg transition-all duration-300 shadow-lg transform hover:scale-105 active:scale-95"
              >
                {t('scheduleConsultation')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default CTA;
