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
  Users
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function StoreServicePage() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

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
              <Link
                href="/demo/store"
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white font-black text-center flex items-center justify-center gap-3 shadow-lg shadow-[#FF4D6D]/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group"
              >
                <ShoppingBag className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
                <span className="text-white">{isAr ? 'معاينة المتجر التفاعلي (/demo/store)' : 'View Interactive Demo Store'}</span>
                <ExternalLink className="w-4 h-4 text-white opacity-90" />
              </Link>
              
              <Link
                href="/demo/store/checkout"
                className="px-6 py-3.5 rounded-xl bg-[#14162E] hover:bg-[#FF4D6D]/15 text-white font-bold text-center flex items-center justify-center gap-2.5 border border-[#FF4D6D]/40 hover:border-[#FF4D6D] transition-all duration-300"
              >
                <CreditCard className="w-4 h-4 text-[#FF4D6D]" />
                <span className="text-white">{isAr ? 'تجربة صفحة الدفع (/demo/store/checkout)' : 'Test Checkout Gateway'}</span>
              </Link>

              <Link
                href="/demo/store/admin"
                className="px-6 py-3.5 rounded-xl bg-[#14162E] hover:bg-[#FF9A3C]/15 text-white font-bold text-center flex items-center justify-center gap-2.5 border border-[#FF9A3C]/40 hover:border-[#FF9A3C] transition-all duration-300"
              >
                <Layout className="w-4 h-4 text-[#FF9A3C]" />
                <span className="text-white">{isAr ? 'لوحة تحكم التاجر (/demo/store/admin)' : 'Merchant Control Panel'}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* D-Arrow Applications Catalog Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              {isAr ? 'كتالوج تطبيقات وأنظمة دي آرو السحابية' : 'D-Arrow Cloud Applications Catalog'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              {isAr ? 'اختر التطبيق أو الحل الرقمي المناسب لنمو وتطوير نشاطك التجاري' : 'Select the application tailored for your business acceleration'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* App Item 1: Store System */}
            <div className="p-6 rounded-2xl bg-[#14162E]/80 border border-slate-800 hover:border-[#FF4D6D]/60 transition-all duration-300 space-y-4 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF4D6D]/20 to-[#FF9A3C]/20 border border-[#FF4D6D]/30 flex items-center justify-center text-[#FF4D6D] group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6 text-[#FF4D6D]" />
                </div>
                <h3 className="text-xl font-bold text-white">{isAr ? 'نظام المتجر الإلكتروني السعودي 🛒' : 'Saudi E-Commerce Store System 🛒'}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {isAr ? 'متجر إلكتروني شامل مجهز بالدفع الرقمي، السلة، والتصميم السعودي الحديث جاهز للاقتناء والتشغيل.' : 'Complete e-commerce store with built-in payments, cart, and modern Saudi design.'}
                </p>
              </div>

              <Link
                href="/demo/store"
                className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white font-bold text-center text-sm flex items-center justify-center gap-2 hover:opacity-95 transition"
              >
                <span>{isAr ? 'معاينة القالب التفاعلي' : 'Preview Live Demo'}</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </Link>
            </div>

            {/* App Item 2: Influencer Platform System */}
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

            {/* App Item 3: Payment Gateway System */}
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

            {/* App Item 4: AI Customer Support Bot */}
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

            {/* App Item 5: High Speed Infrastructure */}
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

            {/* App Item 6: SEO & Analytics Integration */}
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
    </div>
  );
}
