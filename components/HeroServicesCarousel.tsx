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
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 2500); // Show each service for 2.5 seconds

    return () => clearInterval(interval);
  }, [services.length]);

  return (
    <div className="w-full" style={{ minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'inherit', marginBottom: '32px', position: 'relative', zIndex: 20 }}>
      <div 
        className="w-full font-bold transition-opacity duration-300 leading-tight"
        style={{
          fontSize: 'clamp(1.7rem, 4.2vw, 2.8rem)',
          backgroundImage: 'linear-gradient(to right, #FF4D6D, #FF9A3C)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'block',
          minHeight: '80px'
        }}
      >
        {t(services[currentIndex].titleKey)}
      </div>
    </div>
  );
}
