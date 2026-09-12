'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Search, 
  Heart, 
  Sliders, 
  Menu, 
  X, 
  Sparkles, 
  ExternalLink,
  ChevronDown,
  LayoutDashboard,
  Check,
  Flame,
  Truck,
  RotateCcw,
  Headphones,
  ShoppingBag,
  Store,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useStore } from './StoreContext';

export default function StoreHeader() {
  const { 
    settings, 
    cartCount, 
    cartSubtotal,
    setIsCartOpen, 
    wishlist, 
    setIsCustomizerOpen, 
    searchQuery, 
    setSearchQuery,
    updateSettings 
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdown, setCurrencyDropdown] = useState(false);

  const CURRENCIES = [
    { code: 'SAR', label: 'ريال سعودي (SAR)', rate: 1 },
    { code: 'AED', label: 'درهم إماراتي (AED)', rate: 0.98 },
    { code: 'KWD', label: 'دينار كويتي (KWD)', rate: 0.082 },
    { code: 'USD', label: 'دولار أمريكي (USD)', rate: 0.27 },
  ];

  const brandGradient = `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})`;

  return (
    <header className="w-full z-40 relative demo-store-root font-sans text-white" dir="rtl">
      
      {/* 1. Top Control & Quick Switcher Bar */}
      <div 
        className="backdrop-blur-md border-b border-[#382E0E] py-2 px-3 sm:px-8 transition-colors duration-300 bg-[#120E04]/90"
      >
        <div className="max-w-[1550px] w-full mx-auto flex items-center justify-between gap-2">
          
          {/* Live indicator */}
          <div className="hidden xs:flex sm:flex items-center gap-2">
            <span className="flex h-2 w-2 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFE600] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFE600]"></span>
            </span>
            <span className="text-[#FFE600] font-bold text-[11px] hidden sm:block">
              معاينة حية للمتجر
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap overflow-x-auto no-scrollbar">
            {/* Live Theme Customizer Button */}
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="btn-phosphor px-3 sm:px-4 py-1.5 rounded-xl text-[11px] flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <Sliders className="w-3.5 h-3.5 flex-shrink-0" />
              <span>تخصيص الثيم والألوان</span>
            </button>

            {/* Track Shipment Link */}
            <Link
              href="/demo/store/track"
              className="px-3 sm:px-4 py-1.5 rounded-xl bg-[#1C1707] hover:bg-[#2D250B] border border-[#382E0E] text-[#D1D5DB] hover:text-[#FFE600] font-bold text-[11px] flex items-center gap-1.5 transition shadow-sm whitespace-nowrap flex-shrink-0"
            >
              <Truck className="w-3.5 h-3.5 text-[#FFE600] flex-shrink-0" />
              <span className="hidden sm:inline">تتبع الشحنة</span>
            </Link>

            {/* Admin Dashboard Link */}
            <Link
              href="/demo/store/admin"
              className="px-3 sm:px-4 py-1.5 rounded-xl bg-[#1C1707] hover:bg-[#2D250B] border border-[#382E0E] text-white font-bold text-[11px] flex items-center gap-1.5 transition shadow-sm whitespace-nowrap flex-shrink-0"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#FFE600] flex-shrink-0" />
              <span className="hidden sm:inline">لوحة التحكم (Admin)</span>
            </Link>

            {/* Back to D-Arrow */}
            <Link
              href="/store"
              className="hidden sm:flex px-3 py-1.5 rounded-xl bg-[#1C1707] hover:bg-[#2D250B] border border-[#382E0E] text-[#D1D5DB] text-[11px] font-medium transition items-center gap-1.5 whitespace-nowrap flex-shrink-0 shadow-sm"
            >
              <span>الرئيسية</span>
              <ExternalLink className="w-3 h-3 text-[#9CA3AF]" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Announcement Bar */}
      {settings.announcementEnabled && (
        <div 
          className="text-xs sm:text-sm font-black text-center py-2.5 px-4 shadow-sm transition-all duration-300 relative overflow-hidden text-black"
          style={{ background: 'linear-gradient(135deg, #FFE600 0%, #FFD700 100%)' }}
        >
          <div className="max-w-[1550px] w-full mx-auto flex items-center justify-center gap-2 text-black font-black">
            <Sparkles className="w-4 h-4 animate-pulse flex-shrink-0 text-black" />
            <span className="truncate tracking-normal drop-shadow-sm">{settings.announcementText}</span>
          </div>
        </div>
      )}

      {/* 3. Main Luxury Store Header */}
      <div 
        className="backdrop-blur-xl border-b border-[#382E0E] sticky top-0 z-40 transition-colors duration-300 shadow-sm bg-[#161205]/95"
      >
        <div className="max-w-[1550px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24 gap-3 sm:gap-6">
            
            {/* Right: Mobile Menu Toggle & Large Clear Brand Logo */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-2xl bg-[#1C1707] hover:bg-[#2D250B] text-white border border-[#382E0E] transition"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link href="/demo/store" className="flex items-center gap-2 sm:gap-3.5 group">
                {settings.logoUrl ? (
                  <div 
                    className="relative h-11 w-11 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-xl sm:rounded-2xl overflow-hidden bg-[#1C1707] border-2 border-[#FFE600] p-1.5 sm:p-2 flex items-center justify-center shadow-lg shadow-[#FFE600]/20 group-hover:scale-105 transition-transform flex-shrink-0"
                  >
                    <img 
                      src={settings.logoUrl} 
                      alt={settings.storeName}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div 
                    className="h-11 w-11 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-lg sm:text-2xl text-black shadow-xl flex-shrink-0 group-hover:scale-105 transition-transform btn-phosphor"
                  >
                    {settings.storeName.charAt(0)}
                  </div>
                )}

                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm sm:text-xl lg:text-2xl text-white tracking-tight leading-tight group-hover:text-[#FFE600] transition-colors block">
                      {settings.storeName}
                    </span>
                    <span 
                      className="hidden sm:inline-block px-2 py-0.5 rounded-lg text-[10px] font-black text-black shadow-sm uppercase bg-gradient-to-r from-[#FFE600] to-[#FFD700]"
                    >
                      Store
                    </span>
                  </div>
                  <span className="hidden sm:block text-xs sm:text-sm text-[#9CA3AF] truncate max-w-[140px] sm:max-w-[320px] mt-0.5 font-medium">
                    {settings.storeSlogan}
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md lg:max-w-xl mx-4 relative">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="ابحث عن منتج، عطر، سماعات، ساعات، قهوة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full !bg-[#1C1707] !text-white border-2 !border-[#382E0E] focus:!border-[#FFE600] rounded-2xl py-3 pr-12 pl-4 text-xs sm:text-sm placeholder-[#6B7280] focus:outline-none transition-all shadow-inner font-medium"
                />
                <Search className="w-5 h-5 text-[#FFE600] absolute right-4 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Left: Actions (Currency, Wishlist, Luxury Cart) */}
            <div className="flex items-center gap-3 sm:gap-3.5 flex-shrink-0">
              
              {/* Currency Selector */}
              <div className="relative">
                <button
                  onClick={() => setCurrencyDropdown(!currencyDropdown)}
                  className="px-3.5 py-2.5 rounded-2xl bg-[#1C1707] hover:bg-[#2D250B] border border-[#382E0E] text-xs sm:text-sm font-black text-white flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                >
                  <span>{settings.currency}</span>
                  <ChevronDown className="w-4 h-4 text-[#FFE600]" />
                </button>

                {currencyDropdown && (
                  <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-[#1C1707] border border-[#382E0E] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    {CURRENCIES.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => {
                          updateSettings({ currency: curr.code as any, currencyRate: curr.rate });
                          setCurrencyDropdown(false);
                        }}
                        className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition cursor-pointer ${
                          settings.currency === curr.code
                            ? 'bg-[#382E0E] text-[#FFE600] font-black'
                            : 'text-[#E2E8F0] hover:bg-[#2D250B]'
                        }`}
                      >
                        <span>{curr.label}</span>
                        {settings.currency === curr.code && <Check className="w-4 h-4 text-[#FFE600]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => {}}
                className="relative p-3 rounded-2xl bg-[#1C1707] hover:bg-[#2D250B] border border-[#382E0E] text-white hover:text-[#FFE600] transition cursor-pointer shadow-sm"
                title="المفضلة"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span 
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-black font-black text-[10px] flex items-center justify-center shadow-md bg-[#FFE600]"
                  >
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Luxury Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="btn-phosphor relative px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2.5 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                <span className="hidden sm:inline">السلة</span>
                <span className="px-2 py-0.5 rounded-full bg-black text-[#FFE600] font-mono text-xs font-black">
                  {cartCount}
                </span>
                {cartSubtotal > 0 && (
                  <span className="hidden xl:inline font-mono border-r border-black/20 pr-2 mr-1 text-black font-black">
                    {cartSubtotal} {settings.currency}
                  </span>
                )}
              </button>

            </div>

          </div>

          {/* Category Navigation Bar */}
          <nav className="hidden lg:flex items-center justify-between border-t border-[#382E0E] py-3.5 text-xs sm:text-sm font-bold text-[#D1D5DB]">
            <div className="flex items-center gap-8">
              <Link href="/demo/store" className="hover:text-[#FFE600] transition flex items-center gap-1.5 font-black text-white">
                <span>جميع المنتجات والعروض</span>
              </Link>
              <Link href="/demo/store#flash-deals" className="hover:text-[#FFE600] transition">عروض الخصم السريعة</Link>
              <Link href="/demo/store#catalog" className="hover:text-[#FFE600] transition">الكتالوج الكامل</Link>
              <Link href="/demo/store/track" className="hover:text-[#FFE600] text-[#FFE600] font-black transition flex items-center gap-1">
                <span>تتبع الشحنات المباشر</span>
              </Link>
            </div>

            <div className="flex items-center gap-6 text-xs text-[#9CA3AF] font-bold">
              <span className="flex items-center gap-1.5">توصيل سريع لكافة المدن</span>
              <span className="flex items-center gap-1.5">استرجاع مجاني 14 يوم</span>
              <span className="flex items-center gap-1.5">خدمة عملاء 24/7</span>
            </div>
          </nav>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden border-b border-[#382E0E] p-5 space-y-4 animate-in slide-in-from-top-4 bg-[#161205]"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full !bg-[#1C1707] !text-white border !border-[#382E0E] rounded-xl py-3 pr-10 pl-4 text-xs placeholder-[#6B7280]"
            />
            <Search className="w-4 h-4 text-[#FFE600] absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="space-y-2 text-xs sm:text-sm font-bold text-[#D1D5DB]">
            <Link 
              href="/demo/store" 
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-xl hover:bg-[#1C1707] hover:text-[#FFE600] transition"
            >
              الرئيسية
            </Link>
            <Link 
              href="/demo/store#flash-deals" 
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-xl hover:bg-[#1C1707] hover:text-[#FFE600] transition"
            >
              عروض الخصم السريعة
            </Link>
            <Link 
              href="/demo/store#catalog" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl hover:bg-[#F0FDF8]"
            >
              الكتالوج الكامل
            </Link>
            <Link 
              href="/demo/store/track" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-[#059669] font-black bg-[#ECFDF5]"
            >
              تتبع حالة شحنتك
            </Link>
            <Link 
              href="/demo/store/checkout" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-[#064E3B] hover:bg-[#F0FDF8]"
            >
              إتمام الطلب والدفع المباشر
            </Link>
            <Link 
              href="/demo/store/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-[#042F2E] font-black hover:bg-[#F0FDF8]"
            >
              لوحة تحكم التاجر
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}
