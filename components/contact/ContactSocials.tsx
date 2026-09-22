'use client';

import Image from 'next/image';
import { useLanguage } from '@/components/LanguageProvider';

const ContactSocials = () => {
  const { t, siteData } = useLanguage();
  const social = siteData?.social;

  return (
    <section className="relative py-12 lg:py-16 border-t border-gray-800/50 ">
      <div className="w-full mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-black dark:text-white">
            {t('followUsTitle')}
          </h2>
          <p className="text-white dark:text-gray-400">{t('followUsDesc')}</p>
        </div>
        <div className="flex justify-center gap-6 flex-wrap">
          {/* Instagram */}
          <a
            href={social?.instagram || 'https://www.instagram.com/darrow.co/'}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center w-[160px] h-[160px] border border-brand-pink/30 rounded-2xl bg-gradient-to-br from-secondary-dark via-dark-navy to-secondary-dark hover:from-brand-pink/10 hover:to-brand-pink/5 transition-all duration-300 hover:border-brand-pink/60 hover:shadow-2xl hover:shadow-brand-pink/30 hover:-translate-y-2"
          >
            <Image
              src="/icon-instagram-v2.png"
              alt="Instagram"
              width={96}
              height={96}
              className="drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(255,154,60,0.4)] transition-all duration-300 object-contain"
            />
            <p className="mt-3 font-semibold !text-white group-hover:!text-[#FF9A3C] transition-colors">
              {t('socialInstagram')}
            </p>
          </a>

          {/* Snapchat */}
          <a
            href={
              social?.snapchat ||
              'https://www.snapchat.com/@darrow.co?share_id=bINbFcr6nOc&locale=en-EG'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center w-[160px] h-[160px] border border-brand-pink/30 rounded-2xl bg-gradient-to-br from-secondary-dark via-dark-navy to-secondary-dark hover:from-brand-pink/10 hover:to-brand-pink/5 transition-all duration-300 hover:border-brand-pink/60 hover:shadow-2xl hover:shadow-brand-pink/30 hover:-translate-y-2"
          >
            <Image
              src="/icon-snapchat-v2.png"
              alt="Snapchat"
              width={96}
              height={96}
              className="drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(255,154,60,0.4)] transition-all duration-300 object-contain"
            />
            <p className="mt-3 font-semibold !text-white group-hover:!text-[#FF9A3C] transition-colors">
              {t('socialSnapchat')}
            </p>
          </a>

          {/* LinkedIn */}
          <a
            href={
              social?.linkedin ||
              'https://www.linkedin.com/in/%D8%B4%D8%B1%D9%83%D8%A9-%D8%AF%D9%8A-%D8%A2%D8%B1%D9%88-5024643b5/'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center w-[160px] h-[160px] border border-brand-pink/30 rounded-2xl bg-gradient-to-br from-secondary-dark via-dark-navy to-secondary-dark hover:from-brand-pink/10 hover:to-brand-orange/5 transition-all duration-300 hover:border-brand-pink/60 hover:shadow-2xl hover:shadow-brand-pink/30 hover:-translate-y-2"
          >
            <Image
              src="/icon-linkedin-v2.png"
              alt="LinkedIn"
              width={96}
              height={96}
              className="drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(255,154,60,0.4)] transition-all duration-300 object-contain"
            />
            <p className="mt-3 font-semibold !text-white group-hover:!text-[#FF9A3C] transition-colors">
              {t('socialLinkedin')}
            </p>
          </a>

          {/* TikTok */}
          <a
            href={
              social?.tiktok ||
              'https://www.tiktok.com/@d.arrow.sa?_r=1&_t=ZS-95OXOuGs34j'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center w-[160px] h-[160px] border border-brand-pink/30 rounded-2xl bg-gradient-to-br from-secondary-dark via-dark-navy to-secondary-dark hover:from-brand-pink/10 hover:to-brand-orange/5 transition-all duration-300 hover:border-brand-pink/60 hover:shadow-2xl hover:shadow-brand-pink/30 hover:-translate-y-2"
          >
            <Image
              src="/icon-tiktok-v2.png"
              alt="TikTok"
              width={96}
              height={96}
              className="drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(255,77,109,0.5)] transition-all duration-300 object-contain"
            />
            <p className="mt-3 font-semibold !text-white group-hover:!text-[#FF9A3C] transition-colors">
              {t('socialTiktok')}
            </p>
          </a>

          {/* WhatsApp */}
          <a
            href={social?.whatsapp || 'https://wa.me/966500466349'}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center w-[160px] h-[160px] border border-brand-pink/30 rounded-2xl bg-gradient-to-br from-secondary-dark via-dark-navy to-secondary-dark hover:from-brand-pink/10 hover:to-brand-orange/5 transition-all duration-300 hover:border-brand-pink/60 hover:shadow-2xl hover:shadow-brand-pink/30 hover:-translate-y-2"
          >
            <Image
              src="/icon-whatsapp-v2.png"
              alt="WhatsApp"
              width={96}
              height={96}
              className="drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(255,77,109,0.5)] transition-all duration-300 object-contain"
            />
            <p className="mt-3 font-semibold !text-white group-hover:!text-[#FF9A3C] transition-colors">
              {t('socialWhatsapp')}
            </p>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSocials;