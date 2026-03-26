'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';

interface Service {
  titleKey: string;
  descKey: string;
  icon: string;
}

interface AnimatedServicesShowcaseProps {
  services: Service[];
}

export default function AnimatedServicesShowcase({ services }: AnimatedServicesShowcaseProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    // Show all services together for 1 second
    const allTimer = setTimeout(() => {
      setShowAll(false);
    }, 1000);

    return () => clearTimeout(allTimer);
  }, []);

  useEffect(() => {
    if (!showAll) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % services.length);
      }, 2500); // Show each service for 2.5 seconds

      return () => clearInterval(interval);
    }
  }, [showAll, services.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const singleItemVariants = {
    enter: { opacity: 0, scale: 0.8, y: 20 },
    center: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section className="relative py-16 lg:py-20 border-b border-gray-800/50">
      <div className="w-full mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-brand-orange font-bold mb-4">{t('selectServicesHeader')}</h2>
        </div>

        <div className="min-h-64 flex items-center justify-center">
          {showAll ? (
            // Show all services at once
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full"
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-gradient-to-br from-[rgba(255,77,109,0.1)] to-[rgba(255,154,60,0.1)] border border-brand-pink/30 rounded-lg p-6 text-center hover:border-brand-pink/60 transition"
                >
                  <div className="flex justify-center mb-4">
                    <img src={service.icon} alt="" className="w-12 h-12 opacity-80" />
                  </div>
                  <h3 className="text-brand-orange font-semibold mb-2">{t(service.titleKey)}</h3>
                  <p className="text-gray-800 dark:text-gray-300 text-sm">{t(service.descKey)}</p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // Show single service
            <motion.div
              key={currentIndex}
              variants={singleItemVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-sm"
            >
              <div className="bg-gradient-to-br from-brand-pink/20 to-brand-orange/10 border border-brand-pink/50 rounded-xl p-12 text-center backdrop-blur-sm">
                <div className="flex justify-center mb-6">
                  <img src={services[currentIndex].icon} alt="" className="w-16 h-16 opacity-90" />
                </div>
                <h3 className="text-2xl font-bold text-brand-pink mb-4">
                  {t(services[currentIndex].titleKey)}
                </h3>
                <p className="text-gray-200 text-lg mb-6">
                  {t(services[currentIndex].descKey)}
                </p>
                <div className="flex justify-center gap-2">
                  {services.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        idx === currentIndex ? 'w-8 bg-brand-pink' : 'w-2 bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
