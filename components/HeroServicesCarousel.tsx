'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';

interface Service {
  titleKey: string;
  descKey: string;
  icon: string;
}

interface HeroServicesCarouselProps {
  services: Service[];
}

export default function HeroServicesCarousel({ services }: HeroServicesCarouselProps) {
  const { t, lang } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 2500); // Show each service for 2.5 seconds

    return () => clearInterval(interval);
  }, [services.length]);

  return (
    <div className="w-full" style={{ minHeight: '130px', display: 'flex', alignItems: 'center', justifyContent: 'inherit', marginBottom: '32px', position: 'relative', zIndex: 20 }}>
      <div 
        className="w-full font-bold transition-opacity duration-300 leading-tight"
        style={{
          fontSize: 'clamp(1.4rem, 3.2vw, 2.2rem)',
          fontFamily: lang === 'ar' ? "'29LT-Bukra', system-ui" : "'Gilroy', system-ui",
          backgroundImage: 'linear-gradient(to right, #FF4D6D, #FF9A3C)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'block',
          minHeight: '110px'
        }}
      >
        {t(services[currentIndex].titleKey)}
      </div>
    </div>
  );
}
