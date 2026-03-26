"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';
import LogoMarquee from './LogoMarquee';

const PartnersInSuccess = () => {
  const { t } = useLanguage();

  // Yahan se delay aur stagger ko hata diya hai taaki foran show ho
  
  return (
    <section id="partners-in-success" className="py-4 lg:py-8 border-t border-gray-800/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl -ml-48 -mt-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl -mr-48 -mb-48"></div>

      <motion.div 
        className="w-full px-6 md:px-12 relative z-10 will-change-auto"
       
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }} // Amount kam kiya hai taaki scroll karte hi dikh jaye
      >
        <div className="text-center">
          <motion.h3 
            className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 !text-white"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.2 } }
            }}
          >
            {t('trustedByTitle')}
          </motion.h3>
          
          <motion.p 
            className="text-white max-w-2xl mx-auto text-lg"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.2 } }
            }}
          >
            {t('trustedByDesc')}
          </motion.p>

          <div className="mt-6">
            <LogoMarquee />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default PartnersInSuccess;