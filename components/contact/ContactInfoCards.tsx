'use client';

import { Mail, Phone, MapPin, Clock, type LucideIcon } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

type ContactInfoItem = {
  icon: LucideIcon;
  titleKey: string;
  content: string;
  subtextKey: string;
};

const ContactInfoCards = () => {
  const { t, lang, siteData } = useLanguage();
  const contact = siteData?.contact;
  const social = siteData?.social;

  const dynamicEmail = contact?.email || 'info@d-arrow.com';
  const dynamicPhone = contact?.phone || '+966500466349';
  const dynamicAddress =
    contact?.address?.[lang] ||
    (lang === 'ar'
      ? 'المملكة العربية السعودية، الخبر، الأحساء'
      : 'Kingdom of Saudi Arabia Al-Khobar Al-Ahsa');
  const dynamicHours = contact?.workingHours?.[lang] || t('contactHoursValue');

  const contactInfo: ContactInfoItem[] = [
    {
      icon: Mail,
      titleKey: 'contactEmail',
      content: dynamicEmail,
      subtextKey: 'contactEmailSubtext',
    },
    {
      icon: Phone,
      titleKey: 'contactPhone',
      content: dynamicPhone,
      subtextKey: 'contactPhoneSubtext',
    },
    {
      icon: MapPin,
      titleKey: 'contactLocation',
      content: dynamicAddress,
      subtextKey: 'contactLocationSubtext',
    },
    {
      icon: Clock,
      titleKey: 'contactHours',
      content: dynamicHours,
      subtextKey: 'contactHoursSubtext',
    },
  ];

  return (
    <section className="relative py-16 lg:py-2">
      {/* SVG Definition for Gradient Icons */}
      <svg className="absolute w-0 h-0" style={{ width: 0, height: 0 }}>
        <defs>
          <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#FF4D6D" offset="0%" />
            <stop stopColor="#FF9A3C" offset="100%" />
          </linearGradient>
          <linearGradient id="neon-glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop stopColor="#FF4D6D" offset="0%" />
            <stop stopColor="#F15B70" offset="100%" />
          </linearGradient>
        </defs>
      </svg>

      <div className="w-full mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            let clickAction = () => {};
            let cursor = 'cursor-default';

            if (info.titleKey === 'contactEmail') {
              clickAction = () => (window.location.href = `mailto:${dynamicEmail}`);
              cursor = 'cursor-pointer hover:underline';
            } else if (info.titleKey === 'contactPhone') {
              clickAction = () =>
                window.open(
                  social?.whatsapp ||
                    `https://wa.me/${dynamicPhone.replace(/[^0-9]/g, '')}`,
                  '_blank',
                );
              cursor = 'cursor-pointer hover:underline';
            } else if (info.titleKey === 'contactLocation') {
              clickAction = () =>
                window.open('https://maps.google.com/?q=Al+Ahsa+Saudi+Arabia', '_blank');
              cursor = 'cursor-pointer hover:underline';
            }

            return (
              <div
                key={index}
                onClick={clickAction}
                className={`group p-6 border text-white border-brand-pink/30 rounded-xl !bg-[#14162E] hover:bg-gradient-to-br hover:from-[rgba(255,77,109,0.15)] hover:to-[rgba(255,77,109,0.05)] transition-all duration-300 hover:!border-brand-pink hover:shadow-[0_8px_20px_rgba(255,77,109,0.3)] text-center transform hover:scale-105 hover:-translate-y-2 ${cursor}`}
              >
                <div className="inline-flex w-16 h-16 items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
                  <Icon
                    stroke="url(#brand-gradient)"
                    className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-base md:text-xl font-bold text-white mb-1 md:mb-2 group-hover:text-brand-pink transition-colors duration-300">
                  {t(info.titleKey)}
                </h3>
                <p
                  className="text-white font-medium mb-1 group-hover:text-brand-pink transition-colors duration-300"
                  dir={info.titleKey === 'contactPhone' ? 'ltr' : 'auto'}
                >
                  <bdi>{info.content}</bdi>
                </p>
                <p className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">
                  {t(info.subtextKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactInfoCards;