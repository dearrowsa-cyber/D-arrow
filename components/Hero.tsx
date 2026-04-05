"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import HeroServicesCarousel from './HeroServicesCarousel';

const Hero = () => {
  const { t, lang, siteData } = useLanguage();
  const hero = siteData?.hero;

  const featuredServices = [
    {
      titleKey: 'service_seoNew_title',
      descKey: 'service_seoNew_desc',
      icon: '/icon/seo-icon.png',
    },
    {
      titleKey: 'service_smmNew_title',
      descKey: 'service_smmNew_desc',
      icon: '/icon/social-media-icon.png',
    },
    {
      titleKey: 'service_websiteDev_title',
      descKey: 'service_websiteDev_desc',
      icon: '/icon/webd-icon.png',
    },
    {
      titleKey: 'service_appDev_title',
      descKey: 'service_appDev_desc',
      icon: '/icon/webd-icon.png',
    },
    {
      titleKey: 'service_brandNew_title',
      descKey: 'service_brandNew_desc',
      icon: '/icon/brand-icon.png',
    },
    {
      titleKey: 'service_ppcNew_title',
      descKey: 'service_ppcNew_desc',
      icon: '/icon/per-click-icon.png',
    },
  ];

  return (
    <section className="relative overflow-hidden m-0 p-0 min-h-[420px] md:min-h-[600px] py-10 md:py-0 flex items-center">
      {/* Background Video - Restored on all devices as requested by client */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 block"
      >
        <source src="/main-video.mp4" type="video/mp4" />
      </video>
      
      {/* Blur Overlay on Video (only visible if video plays) */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[1] block"></div>
      
      {/* Fallback Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0D1F] via-[#1a1d3f] to-[#0B0D1F]" style={{zIndex: -50}}></div>
      
      {/* Animated background circles */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-brand-pink opacity-5 rounded-full blur-3xl" style={{zIndex: -50}}></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-orange opacity-5 rounded-full blur-3xl" style={{zIndex: -50}}></div>
     
      {/* Content */}
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto w-full px-4">
          {/* Text Content Div */}
          <div suppressHydrationWarning className={`flex-[1] py-18 md:px-6 w-full ${lang === 'ar' ? 'text-right md:text-right' : 'text-center md:text-left'}`} style={{zIndex: 10}}>
            <div className="inline-block bg-gradient-to-r from-[rgba(255,77,109,0.15)] to-[rgba(255,154,60,0.15)] border border-[rgba(255,77,109,0.3)] rounded-full px-2 py-2 mb-8 h-8">
              <span suppressHydrationWarning className="text-white text-sm font-semibold bg-gradient-to-r from-brand-pink to-brand-orange bg-clip-text text-transparent" style={{ fontFamily: lang === 'ar' ? "'29LT-Bukra', system-ui" : "'TT Hoves Pro', system-ui" }}>{hero?.badge?.[lang] || t('heroBadge')}</span>
            </div>

            <h1 className="font-bold leading-tight mb-4 bg-gradient-to-r from-brand-pink to-brand-orange bg-clip-text text-transparent" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', fontFamily: lang === 'ar' ? "'29LT-Bukra', system-ui" : "'Gilroy', system-ui" }}>
              {hero?.heading?.[lang] || t('heroHeading')}
            </h1>

            <div style={{zIndex: 20, position: 'relative'}}>
              <HeroServicesCarousel services={featuredServices} />
            </div>

            <div suppressHydrationWarning className={`flex flex-col sm:flex-row flex-wrap md:flex-nowrap justify-center ${lang === 'ar' ? 'md:justify-end' : 'md:justify-start'} gap-4 mt-8 md:mt-12`}>
              <Link href="/contact" className="w-full sm:w-auto text-center bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] !text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-sm md:text-base transition-transform duration-300 hover:shadow-lg hover:scale-105 active:scale-95" style={{ fontFamily: lang === 'ar' ? "'29LT-Bukra', system-ui" : "'TT Hoves Pro', system-ui" }}>
                {t('getYourFreeConsultation')}
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto text-center border-2 border-[rgba(255,77,109,0.4)] hover:border-[rgba(255,77,109,0.8)] !text-white hover:text-brand-pink hover:bg-[rgba(255,77,109,0.1)] px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-sm md:text-base transition-colors duration-300" style={{ fontFamily: lang === 'ar' ? "'29LT-Bukra', system-ui" : "'TT Hoves Pro', system-ui" }}>
                {t('viewPricing')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
