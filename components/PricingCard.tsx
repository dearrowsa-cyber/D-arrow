"use client";

import styles from '@/app/(main)/pricing/pricing.module.css';
import Image from 'next/image';
import { useLanguage } from './LanguageProvider';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface PricingCardProps {
  title?: string;
  titleKey?: string;
  price: string;
  oldPrice?: string;
  features: string[];
  cta: string;
  featured?: boolean;
  icon?: string;
  isCustom?: boolean;
}

export default function PricingCard({ title, titleKey, price, oldPrice, features, cta, featured = false, icon, isCustom = false }: PricingCardProps) {
  const { t, lang } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const resolvedTitle = titleKey ? t(titleKey) : title || '';
  const Icon = () => {
    if (!icon) return null;
    // support emoji or simple svg fallback
    if (icon.length <= 2) return <span className="text-2xl">{icon}</span>;
    return <img src={icon} alt="" className="w-8 h-8" />;
  };

  return (
    <div className={`${styles.pricingCard} ${featured ? styles.featured : ''}`}>
      {!isCustom && (
        <div className={styles.limitedBadge}>
          {lang === 'ar' ? 'عرض خاص لفترة محدودة' : 'Limited Time Offer'}
        </div>
      )}
      <div className={styles.cardTop}>
        <div className={styles.iconWrap} aria-hidden>
          <Icon />
        </div>
        {featured && <div className={styles.badge}>{t('mostPopular')}</div>}
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{resolvedTitle}</h3>
        <div className="flex flex-col gap-1 mb-4">
          {oldPrice && (
            <span className="text-gray-400 line-through text-[1.1rem] font-bold opacity-60">
              {(() => {
                const parts = oldPrice.split(/(SAR)/g);
                return parts.map((part, i) => (
                  part === 'SAR' ? (
                    <span key={`old-${i}`} className="inline-block align-middle" style={{ lineHeight: 0 }}>
                      <Image
                        src="/riyal.png"
                        alt="SAR"
                        width={24}
                        height={16}
                        style={{ display: 'inline-block', verticalAlign: 'text-top', transform: 'translateY(-2px)' }}
                      />
                    </span>
                  ) : (
                    <span key={`old-${i}`}>{part}</span>
                  )
                ));
              })()}
            </span>
          )}
          <p className={`${styles.cardPrice} !mb-0`}>
            {isCustom ? (
              <span>{price}</span>
            ) : (
              (() => {
                const parts = price.split(/(SAR)/g);
                return parts.map((part, i) => (
                  part === 'SAR' ? (
                    <span key={i} className="inline-block align-middle" style={{ lineHeight: 0 }}>
                      <Image
                        src="/riyal.png"
                        alt="SAR"
                        width={40}
                        height={26}
                        style={{ display: 'inline-block', verticalAlign: 'text-top', transform: 'translateY(-6px)' }}
                      />
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                ));
              })()
            )}
          </p>
        </div>

        <div className={styles.divider} />

        <ul className={styles.featureList}>
          {(isExpanded ? features : features.slice(0, 5)).map((feature, index) => (
            <li key={index} className={styles.featureItem}>
              <span className={styles.check} aria-hidden>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        {features.length > 5 && (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            style={{ backgroundColor: '#FFFFFF', backgroundImage: 'none' }}
            className="w-full flex items-center justify-center gap-2 mt-4 mb-2 py-2 text-sm font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
          >
            <span className="brand-gradient-text">
              {isExpanded 
                ? (lang === 'ar' ? 'عرض أقل' : 'Show Less') 
                : (lang === 'ar' ? 'قراءة المزيد' : 'Read More')}
            </span>
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" strokeWidth={2.5}
              style={{ stroke: '#FF4D6D' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        <motion.button 
          className={styles.ctaButton}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 8px 20px rgba(251, 191, 36, 0.3)'
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {cta}
        </motion.button>
      </div>
    </div>
  );
}
