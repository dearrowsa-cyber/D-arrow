"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const { lang } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'seo',
    date: '',
    time: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { openWhatsApp, buildConsultationMessage, sendAutoNotification } = await import('@/utils/whatsapp');
    
    // Auto-notify company via WhatsApp API (no client action needed)
    sendAutoNotification('consultation', {
      name: formData.name,
      phone: formData.phone,
      service: formData.service,
      date: formData.date,
      time: formData.time,
    });
    
    // Also open WhatsApp for the client
    const message = buildConsultationMessage({
      name: formData.name,
      phone: formData.phone,
      service: formData.service,
      date: formData.date,
      time: formData.time,
      lang,
    });
    openWhatsApp(message);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-gradient-to-br from-[#14162E] to-[#0B0D1F] border border-[rgba(255,77,109,0.3)] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[rgba(255,77,109,0.1)] to-[rgba(255,154,60,0.1)] p-6 border-b border-[rgba(255,77,109,0.2)] flex justify-between items-center">
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {lang === 'ar' ? 'حجز استشارة مجانية' : 'Schedule Free Consultation'}
              </h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {lang === 'ar' ? 'الاسم' : 'Name'}
                </label>
                <input 
                  required
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#0B0D1F] border border-[rgba(255,77,109,0.2)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition-colors"
                  placeholder={lang === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {lang === 'ar' ? 'رقم الجوال' : 'Phone Number'}
                </label>
                <input 
                  required
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#0B0D1F] border border-[rgba(255,77,109,0.2)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition-colors"
                  placeholder={lang === 'ar' ? 'أدخل رقم الجوال' : 'Enter your phone number'}
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {lang === 'ar' ? 'الخدمة المهتم بها' : 'Interested Service'}
                </label>
                <select 
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full bg-[#0B0D1F] border border-[rgba(255,77,109,0.2)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition-colors appearance-none"
                >
                  <option className="bg-[#0B0D1F] text-white" value={lang === 'ar' ? 'تحسين محركات البحث (SEO)' : 'SEO'}>{lang === 'ar' ? 'تحسين محركات البحث (SEO)' : 'SEO'}</option>
                  <option className="bg-[#0B0D1F] text-white" value={lang === 'ar' ? 'تطوير المواقع' : 'Web Development'}>{lang === 'ar' ? 'تطوير المواقع' : 'Web Development'}</option>
                  <option className="bg-[#0B0D1F] text-white" value={lang === 'ar' ? 'إدارة السوشيال ميديا' : 'Social Media Management'}>{lang === 'ar' ? 'إدارة السوشيال ميديا' : 'Social Media Management'}</option>
                  <option className="bg-[#0B0D1F] text-white" value={lang === 'ar' ? 'هوية العلامة التجارية' : 'Branding Identity'}>{lang === 'ar' ? 'هوية العلامة التجارية' : 'Branding Identity'}</option>
                  <option className="bg-[#0B0D1F] text-white" value={lang === 'ar' ? 'الإعلانات الممولة (PPC)' : 'PPC Advertising'}>{lang === 'ar' ? 'الإعلانات الممولة (PPC)' : 'PPC Advertising'}</option>
                  <option className="bg-[#0B0D1F] text-white" value={lang === 'ar' ? 'أخرى' : 'Other'}>{lang === 'ar' ? 'أخرى' : 'Other'}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {lang === 'ar' ? 'التاريخ المفضل' : 'Preferred Date'}
                  </label>
                  <input 
                    required
                    type="date" 
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-[#0B0D1F] border border-[rgba(255,77,109,0.2)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition-colors [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {lang === 'ar' ? 'الوقت المفضل' : 'Preferred Time'}
                  </label>
                  <input 
                    required
                    type="time" 
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full bg-[#0B0D1F] border border-[rgba(255,77,109,0.2)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-brand-pink to-brand-orange text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-[0_8px_25px_rgba(255,77,109,0.4)] transform transition-all duration-300 hover:-translate-y-1"
              >
                {lang === 'ar' ? 'تأكيد وحجز عبر الواتساب' : 'Confirm & Book via WhatsApp'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
