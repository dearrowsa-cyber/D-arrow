'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import styles from '@/app/(main)/pricing/pricing.module.css';

interface ServiceCardProps {
  service: {
    titleKey: string;
    descKey: string;
    icon: string;
    featuresKey: string;
    featured?: boolean;
    price?: string;
    priceCurrency?: string;
    backgroundImage?: string;
  };
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const { t } = useLanguage();
  const featureList = Array.isArray(t(service.featuresKey)) ? t(service.featuresKey) : [];

  const resolveBackgroundImage = () => {
    if (service.backgroundImage) return service.backgroundImage;
    if (service.icon && (service.icon.startsWith('/services/') || service.icon.startsWith('services/'))) return service.icon;
    if (service.icon) {
      const parts = service.icon.split('/');
      const file = parts[parts.length - 1] || service.icon;
      const name = file.replace(/\.[^.]+$/, '');
      return `/services/${name}.jpg`;
    }
    const fallbackName = service.titleKey ? service.titleKey.replace(/[^a-z0-9]+/gi, '-') : 'service-image';
    return `/services/${fallbackName}.jpg`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: index * 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const iconVariants: any = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3,
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        delay: 0.3 + i * 0.1,
      },
    }),
    hover: {
      x: 5,
      transition: {
        duration: 0.2,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.5,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover="hover"
      className={`${styles.serviceCard} ${service.featured ? styles.featured : ''} group relative overflow-hidden !p-0 bg-[#0A0D1E]`}
      style={{
        // Remove general background image to separate image from text
      }}
    >
      {/* --- TOP: 100% VISIBLE IMAGE AREA --- */}
      <div className="relative w-full h-[280px] shrink-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${resolveBackgroundImage().replace(/ /g, '%20')}')` }}
        />
        
        {/* Soft bottom blend to seamlessly connect to the dark text area */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0A0D1E] via-[#0A0D1E]/60 to-transparent" />
      </div>

      {/* Overlapping Icon securely placed on the seam - Moved OUTSIDE the overflow-hidden div! */}
      <div className="absolute top-[252px] left-6 z-20">
        <motion.div
          className="w-16 h-16 rounded-2xl bg-[#14162e] backdrop-blur-md border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex items-center justify-center"
          variants={iconVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover="hover"
        >
          <img src={service.icon} alt={(service as any).title || t(service.titleKey)} className="w-9 h-9 object-contain" />
        </motion.div>
      </div>

      {/* --- BOTTOM: TEXT CONTENT AREA --- */}
      <div className={`${styles.cardBody} flex flex-col flex-grow p-6 pt-12 relative z-10 bg-[#0A0D1E]`}>
        <motion.h3 variants={itemVariants} className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">
          {(service as any).title || t(service.titleKey)}
        </motion.h3>

        <motion.p variants={itemVariants} className="text-gray-300 text-sm leading-relaxed mb-4">
          {(service as any).description || t(service.descKey)}
        </motion.p>


        <motion.div variants={itemVariants} className={styles.divider} />

        <motion.ul
          className={styles.featureList}
          style={{ marginBottom: '1.5rem' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {Array.isArray(featureList) && featureList.length > 0
            ? featureList.map((feature, i) => (
                <motion.li
                  key={i}
                  className={styles.featureItem}
                  variants={featureVariants}
                  custom={i}
                  whileHover="hover"
                >
                  <motion.span
                    className={styles.check}
                    aria-hidden
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Check size={16} strokeWidth={3} className="text-white" />
                  </motion.span>
                  <span className="text-white group-hover:text-white transition-colors duration-200">
                    {feature}
                  </span>
                </motion.li>
              ))
            : null}
        </motion.ul>

        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Link
            href={`/custom-package?service=${service.titleKey}`}
            className={styles.ctaButton}
          >
            {(service as any).title || t(service.titleKey)}
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
