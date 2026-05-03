'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelectedLayoutSegments } from 'next/navigation';
import { Sun, Moon } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { useTheme } from './ThemeProvider';

export default memo(function Header() {
  const segments = useSelectedLayoutSegments();
  const isAdmin = segments && segments[0] === 'admin';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  if (isAdmin) return null;

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
  };

  const toggleLang = () => setLang(lang === 'en' ? 'ar' : 'en');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-transparent backdrop-blur-[2px] min-h-[64px]">
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-12 py-3">
        <div className="flex justify-between items-center w-full gap-4">
          <Link href="/" className="hover:opacity-90 transition duration-300 flex items-center flex-shrink-0 group">
            <Image
              src="/Darrow-1.png"
              alt="D Arrow Logo"
              width={120}
              height={48}
              priority
              sizes="(max-width: 640px) 64px, (max-width: 768px) 120px, (max-width: 1024px) 96px, 128px"
              className="object-contain rounded-3xl w-16 sm:w-30 md:w-24 lg:w-32 group-hover:drop-shadow-lg transition"
            /><span className="text-lg sm:text-sm md:text-base lg:text-lg font-semibold pl-2 sm:pl-3 pl-4 pr-4 bg-white bg-clip-text text-transparent">{lang === 'ar' ? 'للتسويق' : 'For Marketing '}</span>
          </Link>

          {/* Desktop Navigation - Hidden on tablet and below */}
          <nav className="hidden lg:flex gap-1 items-center flex-1 justify-center px-4">
            <Link href="/" className="nav-link-hover flex items-center justify-center !text-xl font-medium px-4 py-2">
              <span className="nav-text">{t('home')}</span>
            </Link>

            <div className="relative" onMouseEnter={() => { if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current); setServicesOpen(true); }} onMouseLeave={() => { closeTimeoutRef.current = window.setTimeout(() => setServicesOpen(false),200 ); }}>
              <Link
                href="/services"
                className="nav-link-hover flex items-center justify-center gap-2 !text-xl font-medium px-4 py-2"
                style={{ textTransform: 'none' }}
              >
                <span className="nav-text">{t('solutions')}</span>
              </Link>
              {/* Enhanced dropdown - 3 featured columns with brand colors */}
             <div
  onMouseEnter={() => { if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current); }}
  onMouseLeave={() => { closeTimeoutRef.current = window.setTimeout(() => setServicesOpen(false), 200); }}
  className={`
    ${servicesOpen 
      ? 'opacity-100 translate-y-0 visible pointer-events-auto' 
      : 'opacity-0 -translate-y-2 invisible pointer-events-none'}
    transition-all duration-200 ease-out
    absolute ${lang === 'ar' ? 'right-0' : 'left-0'}
    mt-2 w-[380px]
    bg-[#14162E]
    border border-gray-700
    rounded-lg
    shadow-xl
    p-3
    z-[999]
  `}
  dir={lang === 'ar' ? 'rtl' : 'ltr'}
>
  <div className="flex flex-col gap-2">

    {/* Digital Marketing */}
    <Link
      href="/services?category=digital-marketing"
      onClick={() => setServicesOpen(false)}
      className={`
        dropdown-item-hover
        flex ${lang === 'ar' ? 'flex-row-reverse' : ''}
        items-center gap-3
        p-2.5
        rounded-md
        !text-white
        hover:bg-[rgba(255,77,109,0.15)]
        transition
      `}
    >
      <img
        src="/icon/services-icon/digital_marketing_promotion.png"
        alt="Digital Marketing"
        className="w-14 h-10 rounded-md object-cover flex-shrink-0 transition hover:scale-105"
      />
      <div className={lang === 'ar' ? 'text-right' : ''}>
        <h4 className="text-sm font-semibold">
          {t('digitalMarketingHeader')}
        </h4>
        
      </div>
    </Link>

    {/* Innovation & Development */}
    <Link
      href="/services?category=innovation-development"
      onClick={() => setServicesOpen(false)}
      className={`
        dropdown-item-hover
        flex ${lang === 'ar' ? 'flex-row-reverse' : ''}
        items-center gap-3
        p-2.5
        rounded-md
        hover:bg-[rgba(255,77,109,0.15)]
        transition
      `}
    >
      <img
        src="/icon/services-icon/creative_digital_design.png"
        alt="Innovation & Development"
        className="w-14 h-10 rounded-md object-cover flex-shrink-0 transition hover:scale-105"
      />
      <div className={lang === 'ar' ? 'text-right' : ''}>
        <h4 className="text-sm font-semibold">
          {t('innovationHeader')}
        </h4>
       
      </div>
    </Link>

    {/* Real Estate */}
    <Link
      href="/services?category=real-estate"
      onClick={() => setServicesOpen(false)}
      className={`
        dropdown-item-hover
        flex ${lang === 'ar' ? 'flex-row-reverse' : ''}
        items-center gap-3
        p-2.5
        rounded-md
        hover:bg-[rgba(255,77,109,0.15)]
        transition
      `}
    >
      <img
        src="/icon/services-icon/real_estate_marketing.png"
        alt="Real Estate"
        className="w-14 h-10 rounded-md object-cover flex-shrink-0 transition hover:scale-105"
      />
      <div className={lang === 'ar' ? 'text-right' : ''}>
        <h4 className="text-sm font-semibold">
          {t('realEstateHeader')}
        </h4>
        
      </div>
    </Link>

  </div>
</div>
            </div>

            <Link href="/pricing" className="nav-link-hover flex items-center justify-center !text-xl font-medium px-4 py-2">
              <span className="nav-text">{t('packages')}</span>
            </Link>
            
            <Link href="/why-us" className="nav-link-hover flex items-center justify-center !text-xl font-medium px-4 py-2">
              <span className="nav-text">{t('ourCommitment')}</span>
            </Link>
            
            <Link href="/provisions" className="nav-link-hover flex items-center justify-center !text-xl font-medium px-4 py-2">
              <span className="nav-text">{t('portfolio')}</span>
            </Link>
            
            <Link href="/blog" className="nav-link-hover flex items-center justify-center !text-xl font-medium px-4 py-2">
              <span className="nav-text">{t('blog')}</span>
            </Link>
            
            <Link href="/contact" className="nav-link-hover flex items-center justify-center !text-xl font-medium px-4 py-2">
              <span className="nav-text">{t('contact')}</span>
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-2 flex-shrink-0">
            <Link
              href="/contact"
              className="bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] 
!text-white 
px-4 py-2 min-h-[44px] flex items-center justify-center
hover:!bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C]
text-xs sm:text-sm lg:text-lg 
font-semibold 
rounded-md 
transition-all duration-300 
hover:shadow-md hover:scale-105 active:scale-95"
            >
              {t('getStarted')}
            </Link>
            
            {/* Theme Toggle Button */}
           

            <button onClick={toggleLang} className=" bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] 
!text-white 
px-3 py-2 min-h-[44px] flex items-center justify-center
text-xs sm:text-sm lg:text-lg 
font-semibold 
rounded-md 
transition-all duration-300 
hover:shadow-md hover:scale-105 active:scale-95">
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>

            {/* Hamburger Menu Button - Visible on tablet and below */}
            <button 
              className="lg:hidden p-1 text-soft-white rounded flex-shrink-0 hover:text-brand-pink transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-4 h-4 sm:w-2 sm:h-5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Sidebar Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 space-y-2 pb-4 max-h-96 overflow-y-auto">
            <Link href="/" onClick={() => handleNavClick('/')} className="flex items-center gap-2 px-4 py-3 min-h-[44px] font-medium !text-white hover:text-brand-pink hover:bg-[rgba(255,77,109,0.1)] transition !text-md rounded-lg text-soft-white">{t('home')}</Link>
            <div className="relative" onMouseEnter={() => { if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current); setServicesOpen(true); }} onMouseLeave={() => { closeTimeoutRef.current = window.setTimeout(() => setServicesOpen(false), 100); }}>
          <div className="flex w-full items-center justify-between">
            <Link
              href="/services"
              onClick={() => handleNavClick('/services')}
              className="flex-1 flex items-center gap-2 
                         bg-transparent hover:bg-transparent 
                         text-white text-lg
                         transition text-md font-medium 
                         px-4 py-3 min-h-[44px]
                         border-none outline-none"
              style={{ textTransform: 'none' }}
            >
              {t('solutions')}
            </Link>
            <button
              onClick={() => setServicesOpen(v => !v)}
              className="p-3 text-white focus:outline-none"
            >
              <svg className={`w-5 h-5 transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
    {/* Enhanced dropdown - 3 featured columns with brand colors */}
              <div 
                className={`${servicesOpen ? 'max-h-[500px] opacity-100 mt-2 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'} overflow-hidden transition-all duration-300 ease-in-out relative w-full bg-[#14162E]/40 border-l-2 border-brand-pink rounded-r-lg z-50`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <div className="flex flex-col gap-2 p-2">
                  <Link href="/services?category=digital-marketing" onClick={() => setServicesOpen(false)} className={`dropdown-item-hover flex ${lang === 'ar' ? 'flex-row-reverse' : ''} gap-4 items-center p-3 sm:p-4 min-h-[54px] rounded-lg hover:bg-[rgba(255,77,109,0.15)] transition w-full mb-1`}>
                    <img src="/icon/services-icon/digital_marketing_promotion.png" alt="Digital Marketing" className="w-10 h-10 rounded-md object-cover shadow-sm flex-shrink-0 hover:scale-105 transition" loading="lazy" decoding="async" />
                    <div className={`${lang === 'ar' ? 'text-right' : 'text-left'} flex-1`}>
                      <h4 className="text-[15px] font-bold">{t('digitalMarketingHeader')}</h4>
                    </div>
                  </Link>

                  <Link href="/services?category=innovation-development" onClick={() => setServicesOpen(false)} className={`dropdown-item-hover flex ${lang === 'ar' ? 'flex-row-reverse' : ''} gap-4 items-center p-3 sm:p-4 min-h-[54px] rounded-lg hover:bg-[rgba(255,77,109,0.15)] transition w-full mb-1`}>
                    <img src="/icon/services-icon/creative_digital_design.png" alt="Innovation & Development" className="w-10 h-10 rounded-md object-cover shadow-sm flex-shrink-0 hover:scale-105 transition" loading="lazy" decoding="async" />
                    <div className={`${lang === 'ar' ? 'text-right' : 'text-left'} flex-1`}>
                      <h4 className="text-[15px] font-bold">{t('innovationHeader')}</h4>
                    </div>
                  </Link>

                  <Link href="/services?category=real-estate" onClick={() => setServicesOpen(false)} className={`dropdown-item-hover flex ${lang === 'ar' ? 'flex-row-reverse' : ''} gap-4 items-center p-3 sm:p-4 min-h-[54px] rounded-lg hover:bg-[rgba(255,77,109,0.15)] transition w-full`}>
                    <img src="/icon/services-icon/real_estate_marketing.png" alt="Real Estate" className="w-10 h-10 rounded-md object-cover shadow-sm flex-shrink-0 hover:scale-105 transition" loading="lazy" decoding="async" />
                    <div className={`${lang === 'ar' ? 'text-right' : 'text-left'} flex-1`}>
                      <h4 className="text-[15px] font-bold">{t('realEstateHeader')}</h4>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/pricing" onClick={() => handleNavClick('/pricing')} className="flex items-center gap-2 px-4 py-3 min-h-[44px] font-medium text-soft-white !text-white hover:text-brand-pink hover:bg-[rgba(255,77,109,0.1)] transition text-2xl rounded-lg">{t('packages')}</Link>
            <Link href="/why-us" onClick={() => handleNavClick('/why-us')} className="flex items-center gap-2 px-4 py-3 min-h-[44px] text-soft-white font-medium  !text-white hover:text-brand-pink hover:bg-[rgba(255,77,109,0.1)] transition text-2xl rounded-lg">{t('ourCommitment')}</Link>
            
            <Link href="/provisions" onClick={() => handleNavClick('/provisions')} className="flex items-center gap-2 px-4 py-3 min-h-[44px] font-medium text-soft-white !text-white hover:text-brand-pink hover:bg-[rgba(255,77,109,0.1)] transition text-2xl rounded-lg">{t('portfolio')}</Link>
            <Link href="/blog" onClick={() => handleNavClick('/blog')} className="flex items-center gap-2 px-4 py-3 min-h-[44px] font-medium text-soft-white !text-white hover:text-brand-pink hover:bg-[rgba(255,77,109,0.1)] transition text-2xl rounded-lg">{t('blog')}</Link>
            
            <Link href="/contact" onClick={() => handleNavClick('/contact')} className="flex items-center gap-2 px-4 py-3 min-h-[44px] text-soft-white font-medium  !text-white hover:text-brand-pink hover:bg-[rgba(255,77,109,0.1)] transition text-2xl rounded-lg">{t('contact')}</Link>
          </nav>
        )}
      </div>
    </header>
  );
});
