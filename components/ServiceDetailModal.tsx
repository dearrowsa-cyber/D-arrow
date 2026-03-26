'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import styles from '@/app/pricing/pricing.module.css';

interface ServiceDetail {
  titleKey: string;
  descKey: string;
  icon: string;
  featuresKey: string;
  featured?: boolean;
  price?: string;
  priceCurrency?: string;
}

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceDetail | null;
}

export default function ServiceDetailModal({ isOpen, onClose, service }: ServiceDetailModalProps) {
  const { t } = useLanguage();

  if (!service) return null;

  const featureList = Array.isArray(t(service.featuresKey)) ? t(service.featuresKey) : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          >
            <div className="bg-gradient-to-br from-secondary-dark via-dark-navy to-secondary-dark rounded-2xl border border-brand-pink/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-secondary-dark/80 to-brand-pink/20 border-b border-brand-pink/30 p-6 md:p-8 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-brand-pink/20 to-brand-orange/20 border border-brand-pink/30 flex items-center justify-center">
                      <img
                        src={service.icon}
                        alt={t(service.titleKey)}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
                      {t(service.titleKey)}
                    </h2>
                  </div>
                  {service.featured && (
                    <span className="inline-block bg-brand-pink/20 text-brand-orange px-3 py-1 rounded-full text-xs font-semibold border border-brand-pink/30">
                      <img src="/icon/update/experence.png" alt="User Icon" className="w-7 h-10 pt-2" /> {t('featured') || 'Featured'}
                    </span>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-700/50 hover:bg-gray-600 flex items-center justify-center text-gray-300 hover:text-white transition"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8">
                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8"
                >
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                    {t('overview') || 'Overview'}
                  </h3>
                  <p className="text-black dark:text-white leading-relaxed text-base">
                    {t(service.descKey)}
                  </p>
                </motion.div>

                {/* Pricing Section */}
                {service.price && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-8 p-8 rounded-xl bg-gradient-to-br from-secondary-dark/80 via-dark-navy/60 to-secondary-dark/80 border border-brand-pink/30 backdrop-blur-sm"
                  >
                    <div className="flex flex-col gap-4">
                      <p className="text-slate-400 text-xs font-medium tracking-wider uppercase">{t('pricing') || 'Pricing'}</p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-bold bg-gradient-to-r from-brand-pink via-[#FF6F4F] to-brand-orange bg-clip-text text-transparent">
                          {service.price}
                        </span>
                        <span className="text-slate-300 text-base font-medium">{service.priceCurrency}</span>
                      </div>
                      {service.priceCurrency && service.priceCurrency.toLowerCase().includes('custom') && (
                        <p className="text-slate-400 text-sm mt-2">Get a tailored quote based on your specific requirements</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Features/Deliverables in Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                    {t('whatYouGet') || 'What You Get'}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {Array.isArray(featureList) && featureList.length > 0
                      ? featureList.map((feature, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.05 }}
                            className="p-4 rounded-lg bg-gradient-to-br from-secondary-dark/40 to-brand-pink/40 border border-brand-pink/30 hover:border-brand-pink/60 hover:bg-secondary-dark/50 transition shadow-lg"
                          >
                            <div className="flex items-start gap-3">
                              <motion.div
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                transition={{ duration: 0.3 }}
                                className="flex-shrink-0 mt-1"
                              >
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-pink to-brand-orange flex items-center justify-center">
                                  <Check size={14} className="text-white" strokeWidth={3} />
                                </div>
                              </motion.div>
                              <span className="text-white text-sm leading-relaxed flex-1 font-medium">
                                {feature}
                              </span>
                            </div>
                          </motion.div>
                        ))
                      : (
                          <div className="col-span-full text-gray-400 text-center py-8">
                            {t('noFeaturesAvailable') || 'No features available'}
                          </div>
                        )}
                  </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-6 border-t border-gray-700/50"
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="flex-1 bg-gradient-to-r from-brand-pink to-brand-orange hover:from-[rgba(255,77,109,0.9)] hover:to-[rgba(255,154,60,0.9)] text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-brand-pink/50"
                    >
                      {t('getStarted') || 'Get Started'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="flex-1 border border-gray-600 hover:border-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                      {t('close') || 'Close'}
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
