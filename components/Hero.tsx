"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import HeroServicesCarousel from './HeroServicesCarousel';

const Hero = () => {
  const { t, lang } = useLanguage();


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
    <section className="relative overflow-hidden m-0 p-0 h-[500px] flex items-center">
      {/* Background Video - Loaded immediately for visibility */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/main-video.mp4" type="video/mp4" />
      </video>
      
      {/* Blur Overlay on Video */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[1]"></div>
      
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
              <span suppressHydrationWarning className="text-white text-sm font-semibold bg-gradient-to-r from-brand-pink to-brand-orange bg-clip-text text-transparent">{t('heroBadge')}</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 bg-gradient-to-r from-brand-pink to-brand-orange bg-clip-text text-transparent min-h-[4rem] md:min-h-[6rem]">
              {t('heroHeading')}
            </h1>

            <div style={{zIndex: 20, position: 'relative'}}>
              <HeroServicesCarousel services={featuredServices} />
            </div>

            <div suppressHydrationWarning className={`flex flex-wrap md:flex-nowrap justify-center ${lang === 'ar' ? 'md:justify-end' : 'md:justify-start'} gap-4 mt-12`}>
              <Link href="/contact" className="bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] !text-white px-8 py-4 rounded-lg font-semibold text-base transition-transform duration-300 hover:shadow-lg hover:scale-105 active:scale-95">
                {t('getYourFreeConsultation')}
              </Link>
              <Link href="/pricing" className="border-2 border-[rgba(255,77,109,0.4)] hover:border-[rgba(255,77,109,0.8)] !text-white hover:text-brand-pink hover:bg-[rgba(255,77,109,0.1)] px-8 py-4 rounded-lg font-semibold text-base transition-colors duration-300">
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
