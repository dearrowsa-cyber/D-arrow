'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingBag, 
  ExternalLink, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Smartphone, 
  BarChart3, 
  ArrowRight, 
  MessageCircle, 
  Lock, 
  CheckCircle2, 
  Layers, 
  Layout, 
  Settings, 
  Globe, 
  Star,
  Clock,
  ChevronLeft,
  Bot,
  Users,
  Building2,
  Home,
  MapPin
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function StoreServicePage() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'all' | 'ecommerce' | 'realestate' | 'saas'>('all');
  const [previewModal, setPreviewModal] = useState<'none' | 'store' | 'real-estate'>('none');

  return (
    <div className="min-h-screen bg-[#0A0C1E] text-white pt-28 pb-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#FF4D6D]/20 to-[#FF9A3C]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#FF4D6D]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">

        {/* Hero Section */}
        <section className="text-center space-y-6 pt-2 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF4D6D]/15 to-[#FF9A3C]/15 border border-[#FF4D6D]/30 text-sm font-semibold text-[#FF4D6D] backdrop-blur-md shadow-inner">
            <Sparkles className="w-4 h-4 text-[#FF9A3C] animate-pulse" />
            <span>{isAr ? '🇸🇦 متجر تطبيقات وحلول دي آرو الرقمية (D-Arrow SaaS App Store)' : '🇸🇦 D-Arrow SaaS Applications & Digital Store'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight text-white">
            {isAr ? (
              <>
                متجر <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C]">التطبيقات والأنظمة السحابية</span> المتقدمة
              </>
            ) : (
              <>
                D-Arrow <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C]">Digital Applications & SaaS Store</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            {isAr ? (
              'تصفح باقتنا الحصرية من الأنظمة والتطبيقات السحابية المجهزة للتثبيت والتشغيل الفوري لخدمة وتطوير تجارتك وأعمالك بالسوق السعودي والخارجي.'
            ) : (
              'Explore our suite of ready-to-deploy cloud applications, store templates, and digital systems built for Saudi & global business growth.'
            )}
          </p>
        </section>

        {/* Featured Main Application Item: E-Commerce Store System */}
        <section className="bg-gradient-to-br from-[#14162E] via-[#161836] to-[#0A0C1E] border border-[#FF4D6D]/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF4D6D]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF9A3C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-2xl text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF4D6D]/15 border border-[#FF4D6D]/40 text-[#FF4D6D] text-xs font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D6D] animate-ping" />
                <span>{isAr ? '🔥 التطبيق الأكثر طلباً | نسخة تجريبية حية جاهزة للاختبار' : '🔥 Flagship App | Live Interactive Demo Ready'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {isAr ? 'نظام وقالب المتجر الإلكتروني السعودي (Saudi E-Commerce App)' : 'Saudi E-Commerce Store System & Template'}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {isAr ? (
                  'حل تقني سحابي متكامل لبناء متجر إلكتروني سعودي فائق السرعة، مجهز بأحدث معايير UI/UX، مدمج بجميع بوابات الدفع المحلية (مدى، أبل باي، تمارا، تابي)، مع سلة تسويقية ولوحة تحكم حية للتاجر.'
                ) : (
                  'Complete SaaS e-commerce solution with ultra-fast sub-second loading, built-in Mada, Apple Pay, Tamara, Tabby gateways, interactive cart, and live merchant control panel.'
                )}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#FF9A3C]" /> {isAr ? 'دفع مدى وأبل باي' : 'Mada & Apple Pay'}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#FF4D6D]" /> {isAr ? 'تقسيط تابي وتمارا' : 'Tabby & Tamara'}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#FF9A3C]" /> {isAr ? 'لوحة تحكم كاملة' : 'Admin Panel'}
                </span>
              </div>
            </div>

            {/* Action Buttons for Featured Application */}
            <div className="flex flex-col gap-3.5 w-full lg:w-auto flex-shrink-0">
              <button
                onClick={() => setPreviewModal('store')}
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white font-black text-center flex items-center justify-center gap-3 shadow-lg shadow-[#FF4D6D]/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
                <span className="text-white">{isAr ? 'معاينة المتجر التفاعلي الفورية 🌐' : 'Live Interactive Demo Store'}</span>
                <Sparkles className="w-4 h-4 text-white opacity-90 animate-pulse" />
              </button>
              
              <Link
                href="/demo/store/checkout"
                className="px-6 py-3.5 rounded-xl bg-[#14162E] hover:bg-[#FF4D6D]/15 text-white font-bold text-center flex items-center justify-center gap-2.5 border border-[#FF4D6D]/40 hover:border-[#FF4D6D] transition-all duration-300"
              >
                <CreditCard className="w-4 h-4 text-[#FF4D6D]" />
                <span className="text-white">{isAr ? 'تجربة صفحة الدفع 💳' : 'Test Checkout Gateway'}</span>
              </Link>

              <Link
                href="/demo/store/admin"
                className="px-6 py-3.5 rounded-xl bg-[#14162E] hover:bg-[#FF9A3C]/15 text-white font-bold text-center flex items-center justify-center gap-2.5 border border-[#FF9A3C]/40 hover:border-[#FF9A3C] transition-all duration-300"
              >
                <Layout className="w-4 h-4 text-[#FF9A3C]" />
                <span className="text-white">{isAr ? 'لوحة تحكم التاجر 📊' : 'Merchant Control Panel'}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Real Estate Template Section */}
        <section className="bg-gradient-to-br from-[#14162E] via-[#161836] to-[#0A0C1E] border border-[#FF9A3C]/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF9A3C]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-2xl text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] text-xs font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                <span>{isAr ? '🆕 إصدار جديد حديثاً | قالب العقار السعودي' : '🆕 New Release | Saudi Real Estate Template'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {isAr ? 'نظام وقالب الموقع العقاري السعودي (Saudi Real Estate App)' : 'Saudi Real Estate Website System & Template'}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {isAr ? (
                  'قالب موقع عقاري متكامل مخصص للسوق السعودي، مع عرض العقارات للبيع والإيجار، البحث المتقدم حسب الحي والمدينة والمنطقة، معرض صور تفاعلي، خريطة مدمجة، استعلامات العملاء، وحجز مواعيد المعاينة.'
                ) : (
                  'Complete real estate website template tailored for Saudi market. Features property listings for sale/rent, advanced search by district/city/region, interactive gallery, embedded maps, client inquiry forms, and viewing appointment booking.'
                )}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <Home className="w-4 h-4 text-[#10B981]" /> {isAr ? 'شقق - فلل - أراضي' : 'Apartments - Villas - Land'}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <MapPin className="w-4 h-4 text-[#FF9A3C]" /> {isAr ? 'خريطة جوجل مدمجة' : 'Google Maps Integration'}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#FF4D6D]" /> {isAr ? 'نموذج طلبات وحجوزات' : 'Inquiry & Booking Forms'}
                </span>
              </div>
            </div>

            {/* Action Buttons for Real Estate Template */}
            <div className="flex flex-col gap-3.5 w-full lg:w-auto flex-shrink-0">
              <button
                onClick={() => setPreviewModal('real-estate')}
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-[#10B981] to-[#FF9A3C] text-white font-black text-center flex items-center justify-center gap-3 shadow-lg shadow-[#10B981]/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
              >
                <Building2 className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
                <span className="text-white">{isAr ? 'معاينة الموقع العقاري التفاعلية 🏢' : 'Live Interactive Real Estate Demo'}</span>
                <Sparkles className="w-4 h-4 text-white opacity-90 animate-pulse" />
              </button>
              
              <Link
                href="/contact"
                className="px-6 py-3.5 rounded-xl bg-[#14162E] hover:bg-[#10B981]/15 text-white font-bold text-center flex items-center justify-center gap-2.5 border border-[#10B981]/40 hover:border-[#10B981] transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4 text-[#10B981]" />
                <span className="text-white">{isAr ? 'طلب شراء القالب العقاري' : 'Request Real Estate Template Purchase'}</span>
              </Link>

              <Link
                href="/projects"
                className="px-6 py-3.5 rounded-xl bg-[#14162E] hover:bg-[#FF9A3C]/15 text-white font-bold text-center flex items-center justify-center gap-2.5 border border-[#FF9A3C]/40 hover:border-[#FF9A3C] transition-all duration-300"
              >
                <Layout className="w-4 h-4 text-[#FF9A3C]" />
                <span className="text-white">{isAr ? 'مشاهدة مشاريعنا العقارية السابقة' : 'View Past Real Estate Projects'}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* D-Arrow Applications & Templates Catalog Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              {isAr ? 'كتالوج التطبيقات والقوالب السحابية' : 'Applications & Templates Catalog'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              {isAr ? 'اختر التصفية المناسبة لاستعراض قوالب المتاجر، الحلول العقارية، والأنظمة السحابية' : 'Select a filter category to explore store templates, real estate solutions, and SaaS applications'}
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white shadow-lg shadow-[#FF4D6D]/30 scale-105'
                    : 'bg-[#14162E] text-slate-300 border border-white/10 hover:border-white/30'
                }`}
              >
                {isAr ? '✨ الكل' : '✨ All Solutions'}
              </button>
              <button
                onClick={() => setActiveTab('ecommerce')}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'ecommerce'
                    ? 'bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white shadow-lg shadow-[#FF4D6D]/30 scale-105'
                    : 'bg-[#14162E] text-slate-300 border border-white/10 hover:border-white/30'
                }`}
              >
                {isAr ? '🛒 قوالب المتاجر الإلكترونية' : '🛒 E-Commerce Templates'}
              </button>
              <button
                onClick={() => setActiveTab('realestate')}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'realestate'
                    ? 'bg-gradient-to-r from-[#10B981] to-[#FF9A3C] text-white shadow-lg shadow-[#10B981]/30 scale-105'
                    : 'bg-[#14162E] text-slate-300 border border-white/10 hover:border-white/30'
                }`}
              >
                {isAr ? '🏢 قوالب التطوير العقاري' : '🏢 Real Estate Templates'}
              </button>
              <button
                onClick={() => setActiveTab('saas')}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'saas'
                    ? 'bg-gradient-to-r from-[#FF9A3C] to-[#FF4D6D] text-white shadow-lg shadow-[#FF9A3C]/30 scale-105'
                    : 'bg-[#14162E] text-slate-300 border border-white/10 hover:border-white/30'
                }`}
              >
                {isAr ? '⚙️ الأنظمة والتطبيقات السحابية' : '⚙️ SaaS Applications'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* App Item 1: Store System */}
            {(activeTab === 'all' || activeTab === 'ecommerce') && (
              <div className="p-6 rounded-2xl bg-[#14162E]/80 border border-[#FF4D6D]/40 hover:border-[#FF4D6D] transition-all duration-300 space-y-4 group flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FF4D6D]/20 border border-[#FF4D6D]/40 text-[#FF4D6D] text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] animate-ping" /> {isAr ? 'المتجر الإلكتروني' : 'E-Commerce'}
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF4D6D]/20 to-[#FF9A3C]/20 border border-[#FF4D6D]/30 flex items-center justify-center text-[#FF4D6D] group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-6 h-6 text-[#FF4D6D]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{isAr ? 'نظام وقالب المتجر الإلكتروني السعودي 🛒' : 'Saudi E-Commerce Store Template 🛒'}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {isAr ? 'متجر إلكتروني شامل مجهز بالدفع الرقمي المحلي (مدى، أبل باي، تمارا، تابي)، السلة التسويقية، وثيم سعودي عصري.' : 'Complete e-commerce store with built-in payments (Mada, Apple Pay, Tamara, Tabby), cart, and modern Saudi design.'}
                  </p>
                </div>

                <div className="space-y-2.5 mt-4">
                  <button
                    onClick={() => setPreviewModal('store')}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white font-bold text-center text-sm flex items-center justify-center gap-2 hover:opacity-95 transition cursor-pointer"
                  >
                    <span>{isAr ? 'معاينة متجر العرض التفاعلي 🌐' : 'Preview Live Store Demo'}</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                  <Link
                    href="/demo/store/admin"
                    className="w-full py-2.5 rounded-xl bg-[#14162E] border border-[#FF9A3C]/40 hover:border-[#FF9A3C] text-slate-300 hover:text-white font-semibold text-center text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Layout className="w-3.5 h-3.5 text-[#FF9A3C]" />
                    <span>{isAr ? 'لوحة تحكم التاجر' : 'Merchant Control Panel'}</span>
                  </Link>
                </div>
              </div>
            )}

            {/* App Item 2: Real Estate Template */}
            {(activeTab === 'all' || activeTab === 'realestate') && (
              <div className="p-6 rounded-2xl bg-[#14162E]/80 border border-[#10B981]/40 hover:border-[#10B981] transition-all duration-300 space-y-4 group flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> {isAr ? 'العقار والتطوير' : 'Real Estate'}
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981]/20 to-[#FF9A3C]/20 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{isAr ? 'نظام وقالب الموقع العقاري السعودي 🏢' : 'Saudi Real Estate Website Template 🏢'}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {isAr ? 'قالب موقع عقاري متكامل لعرض العقارات، فلترة حسب الأحياء والمدن، خرائط تفاعلية، وحجوزات المعاينة المباشرة.' : 'Full real estate template with property listings, district filter, Google Maps, and viewing appointment bookings.'}
                  </p>
                </div>

                <div className="space-y-2.5 mt-4">
                  <button
                    onClick={() => setPreviewModal('real-estate')}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#10B981] to-[#FF9A3C] text-white font-bold text-center text-sm flex items-center justify-center gap-2 hover:opacity-95 transition cursor-pointer"
                  >
                    <span>{isAr ? 'معاينة موقع العقار التفاعلي 🌐' : 'Preview Real Estate Demo'}</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                  <Link
                    href="/projects"
                    className="w-full py-2.5 rounded-xl bg-[#14162E] border border-[#10B981]/40 hover:border-[#10B981] text-slate-300 hover:text-white font-semibold text-center text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>{isAr ? 'نماذج مشاريع عقارية' : 'Real Estate Portfolio'}</span>
                  </Link>
                </div>
              </div>
            )}

            {/* App Item 3: Influencer Platform System */}
            {(activeTab === 'all' || activeTab === 'saas') && (
              <div className="p-6 rounded-2xl bg-[#14162E]/80 border border-slate-800 hover:border-[#FF4D6D]/60 transition-all duration-300 space-y-4 group flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF9A3C]/20 to-[#FF4D6D]/20 border border-[#FF9A3C]/30 flex items-center justify-center text-[#FF9A3C] group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-[#FF9A3C]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{isAr ? 'نظام إدارة حملات المؤثرين 🌟' : 'Influencers Campaign Platform 🌟'}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {isAr ? 'منصة سحابية متكاملة لربط العلامات التجارية بالمؤثرين وإدارة التعاقدات والنتائج تلقائياً.' : 'Cloud platform connecting brands with influencers to manage contracts and analytics.'}
                  </p>
                </div>

                <Link
                  href="/influencer"
                  className="mt-4 w-full py-3 rounded-xl bg-[#14162E] hover:bg-[#FF9A3C]/15 border border-[#FF9A3C]/40 text-white font-bold text-center text-sm flex items-center justify-center gap-2 transition"
                >
                  <span>{isAr ? 'استكشف نظام المؤثرين' : 'Explore Platform'}</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            )}

            {/* App Item 4: Payment Gateway System */}
            {(activeTab === 'all' || activeTab === 'saas') && (
              <div className="p-6 rounded-2xl bg-[#14162E]/80 border border-slate-800 hover:border-[#FF4D6D]/60 transition-all duration-300 space-y-4 group flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF4D6D]/20 to-[#FF9A3C]/20 border border-[#FF4D6D]/30 flex items-center justify-center text-[#FF4D6D] group-hover:scale-110 transition-transform">
                    <CreditCard className="w-6 h-6 text-[#FF4D6D]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{isAr ? 'تطبيق بوابة الدفع والربط المالي 💳' : 'Payment Gateways Integration App 💳'}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {isAr ? 'تطبيق ربط مالي مباشر مع مدى، أبل باي، تمارا وتوبي لتأمين التحصيل المالي للمتاجر والشركات.' : 'Direct financial gateway plugin connecting Mada, Apple Pay, Tamara, and Tabby.'}
                  </p>
                </div>

                <Link
                  href="/demo/store/checkout"
                  className="mt-4 w-full py-3 rounded-xl bg-[#14162E] hover:bg-[#FF4D6D]/15 border border-[#FF4D6D]/40 text-white font-bold text-center text-sm flex items-center justify-center gap-2 transition"
                >
                  <span>{isAr ? 'تجربة تجريبية للبوابة' : 'Test Payment Gateway'}</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            )}

            {/* App Item 5: AI Customer Support Bot */}
            {(activeTab === 'all' || activeTab === 'saas') && (
              <div className="p-6 rounded-2xl bg-[#14162E]/80 border border-slate-800 hover:border-[#FF4D6D]/60 transition-all duration-300 space-y-4 group flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF9A3C]/20 to-[#FF4D6D]/20 border border-[#FF9A3C]/30 flex items-center justify-center text-[#FF9A3C] group-hover:scale-110 transition-transform">
                    <Bot className="w-6 h-6 text-[#FF9A3C]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{isAr ? 'مساعد الذكاء الاصطناعي الذكي 🤖' : 'AI Smart Assistant Bot 🤖'}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {isAr ? 'بوت دردشة ذكي مخصص للتفاعل الفوري مع عملاء متجرك أو شركتك والإجابة على الاستفسارات 24/7.' : 'Smart AI conversational bot for instant 24/7 customer support and lead conversion.'}
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="mt-4 w-full py-3 rounded-xl bg-[#14162E] hover:bg-[#FF9A3C]/15 border border-[#FF9A3C]/40 text-white font-bold text-center text-sm flex items-center justify-center gap-2 transition"
                >
                  <span>{isAr ? 'طلب تجربة البوت' : 'Request Bot Demo'}</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            )}

            {/* App Item 6: High Speed Infrastructure */}
            {(activeTab === 'all' || activeTab === 'saas') && (
              <div className="p-6 rounded-2xl bg-[#14162E]/80 border border-slate-800 hover:border-[#FF4D6D]/60 transition-all duration-300 space-y-4 group flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF4D6D]/20 to-[#FF9A3C]/20 border border-[#FF4D6D]/30 flex items-center justify-center text-[#FF4D6D] group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-[#FF4D6D]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{isAr ? 'استضافة واستخلاص السرعة الفائقة ⚡' : 'High Speed Infrastructure ⚡'}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {isAr ? 'بنية تحتية سحابية مخصصة تضمن سرعة تصفح فائقة ومعدل جاهزية 99.9% للمتاجر الكبرى.' : 'High-speed cloud infrastructure guaranteeing 99.9% uptime and sub-second speeds.'}
                  </p>
                </div>

                <Link
                  href="/services"
                  className="mt-4 w-full py-3 rounded-xl bg-[#14162E] hover:bg-[#FF4D6D]/15 border border-[#FF4D6D]/40 text-white font-bold text-center text-sm flex items-center justify-center gap-2 transition"
                >
                  <span>{isAr ? 'تفاصيل الاستضافة' : 'Hosting Details'}</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            )}

            {/* App Item 7: SEO & Analytics Integration */}
            {(activeTab === 'all' || activeTab === 'saas') && (
              <div className="p-6 rounded-2xl bg-[#14162E]/80 border border-slate-800 hover:border-[#FF4D6D]/60 transition-all duration-300 space-y-4 group flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF9A3C]/20 to-[#FF4D6D]/20 border border-[#FF9A3C]/30 flex items-center justify-center text-[#FF9A3C] group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6 text-[#FF9A3C]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{isAr ? 'تطبيق تحليلات وربط البكسلات 📊' : 'Analytics & Pixels App 📊'}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {isAr ? 'ربط تلقائي مع سناب شات، تيك توك، ميتا، وجوجل لتتبع تحويلات المبيعات بدقة فائقة.' : 'Pre-integrated analytics tracking Snap, TikTok, Meta, and Google conversion pixels.'}
                  </p>
                </div>

                <Link
                  href="/services"
                  className="mt-4 w-full py-3 rounded-xl bg-[#14162E] hover:bg-[#FF9A3C]/15 border border-[#FF9A3C]/40 text-white font-bold text-center text-sm flex items-center justify-center gap-2 transition"
                >
                  <span>{isAr ? 'استكشف التتبع' : 'Explore Tracking'}</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            )}

          </div>
        </section>

        {/* Order CTA Section with D-Arrow Brand Colors */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#14162E] via-[#1A1D3B] to-[#14162E] border border-[#FF4D6D]/40 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4D6D]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF9A3C]/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white relative z-10">
            {isAr ? 'ترغب في اقتناء أحد تطبيقات أو قوالب دي آرو؟' : 'Looking to Acquire D-Arrow Applications or Templates?'}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-light relative z-10 leading-relaxed">
            {isAr ? (
              'تواصل مباشرة مع فريق الاستشارات والحلول التقنية بوكالة دي آرو للحصول على العرض والترخيص المخصص لنشاطك التجاري.'
            ) : (
              'Contact D-Arrow solution specialists now to acquire licenses or customized builds for your business.'
            )}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 relative z-10">
            <a
              href="https://wa.me/966500000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%88%D9%83%D8%A7%D9%84%D8%A9%20%D8%AF%D9%8A%20%D8%A2%D8%B1%D9%88%E2%80%8E%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D9%88%D8%B7%D9%84%D8%A8%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20%D9%88%D9%85%D8%AA%D8%AC%D8%B1%20%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white font-black text-lg flex items-center gap-3 shadow-lg shadow-[#FF4D6D]/30 hover:scale-105 active:scale-95 transition-all"
            >
              <MessageCircle className="w-6 h-6 text-white fill-current" />
              <span className="text-white">{isAr ? 'تواصل عبر الواتساب مباشرة' : 'Contact on WhatsApp Directly'}</span>
            </a>

            <Link
              href="/demo/store"
              className="px-8 py-4 rounded-xl bg-[#14162E] hover:bg-[#FF4D6D]/15 text-white font-bold text-lg border border-[#FF4D6D]/40 hover:border-[#FF4D6D] flex items-center gap-3 transition-all"
            >
              <span className="text-white">{isAr ? 'معاينة المتجر التفاعلي' : 'View Demo Store'}</span>
              <ExternalLink className="w-5 h-5 text-white" />
            </Link>
          </div>
        </section>

      </div>

      {/* Live Interactive Preview Modal */}
      {previewModal !== 'none' && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col justify-between overflow-hidden animate-fadeIn">
          {/* Modal Header Bar */}
          <div className="bg-[#14162E] border-b border-white/10 px-6 py-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-4">
              <span className="text-xl">
                {previewModal === 'store' ? '🛒' : '🏢'}
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-white">
                  {previewModal === 'store'
                    ? (isAr ? 'معاينة قالب المتجر الإلكتروني السعودي التفاعلي' : 'Saudi E-Commerce Store Interactive Demo')
                    : (isAr ? 'معاينة قالب المنصة والموقع العقاري السعودي' : 'Saudi Real Estate Platform Interactive Demo')}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr ? 'معاينة حية ومباشرة بكامل الميزات والأجهزة' : 'Live Interactive Demo Preview'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={previewModal === 'store' ? '/demo/store' : '/demo/real-estate'}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
              >
                <span>{isAr ? 'فتح في نافذة مستقلة ↗️' : 'Open in New Window ↗️'}</span>
              </a>

              <button
                onClick={() => setPreviewModal('none')}
                className="px-4 py-2 rounded-xl bg-[#FF4D6D] hover:bg-[#FF4D6D]/80 text-white font-black text-sm flex items-center gap-2 transition-all shadow-lg shadow-[#FF4D6D]/30"
              >
                <span>{isAr ? 'إغلاق المعاينة ✕' : 'Close Preview ✕'}</span>
              </button>
            </div>
          </div>

          {/* Modal Frame Body */}
          <div className="flex-1 w-full bg-[#0A0C1E] relative overflow-auto">
            <iframe
              src={previewModal === 'store' ? '/demo/store' : '/demo/real-estate'}
              className="w-full h-full border-0 min-h-[85vh]"
              title={previewModal === 'store' ? 'Store Demo' : 'Real Estate Demo'}
            />
          </div>
        </div>
      )}
    </div>
  );
}
