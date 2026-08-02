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
  ChevronLeft
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function StoreServicePage() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen bg-[#0A0C1E] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#FF4D6D]/20 to-[#FF9A3C]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">

        {/* Hero Section */}
        <section className="text-center space-y-6 pt-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF4D6D]/15 to-[#FF9A3C]/15 border border-[#FF4D6D]/30 text-sm font-semibold text-[#FF4D6D] backdrop-blur-md shadow-inner">
            <Sparkles className="w-4 h-4 text-[#FF9A3C] animate-pulse" />
            <span>{isAr ? '🇸🇦 خدمة تطوير المتاجر الإلكترونية السعودية الحصرية' : '🇸🇦 Saudi E-Commerce Store Development Service'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
            {isAr ? (
              <>
                صمم <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C]">متجرك الإلكتروني الاحترافي</span> واكسب ثقة عملائك
              </>
            ) : (
              <>
                Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C]">Professional E-Commerce Store</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            {isAr ? (
              'نوفر لك حلاً تقنياً وتسويقياً شاملاً لتأسيس متجر إلكتروني فائق السرعة، مجهز بأحدث معايير تجربة المستخدم UI/UX، مدمج بروابط بوابات الدفع الرقمية (مدى، أبل باي، تمارا، تاباتي) وجاهز تماماً لربط شركات الشحن والمخزون.'
            ) : (
              'We deliver a comprehensive technical & marketing solution to launch a lightning-fast e-commerce store with modern UI/UX, built-in Saudi payment gateways (Mada, Apple Pay, Tamara, Tabby), and order management.'
            )}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/demo/store"
              className="px-6 py-4 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white font-bold text-base sm:text-lg flex items-center gap-3 shadow-lg shadow-[#FF4D6D]/25 hover:shadow-xl hover:scale-105 transition-all duration-300 group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>{isAr ? 'معاينة المتجر التفاعلي حياً (Interactive Demo)' : 'Explore Live Interactive Demo Store'}</span>
              <ExternalLink className="w-4 h-4 opacity-80" />
            </Link>

            <a
              href="https://wa.me/966500000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%88%D9%83%D8%A7%D9%84%D8%A9%20%D8%AF%D9%8A%20%D8%A2%D8%B1%D9%88%D9%8E%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%B7%D9%84%D8%A8%20%D8%AE%D8%AF%D9%85%D8%A9%20%D8%AA%D8%B0%D9%88%D9%8A%D8%B1%20%D9%85%D8%AA%D8%AC%D8%B1%20%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-white font-semibold text-base sm:text-lg border border-slate-700 hover:border-slate-500 flex items-center gap-3 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <span>{isAr ? 'طلب الخدمة عبر الواتساب' : 'Order via WhatsApp'}</span>
            </a>
          </div>
        </section>

        {/* Featured Live Demo Box */}
        <section className="bg-gradient-to-br from-[#14162E] to-[#1A1D3B] border border-slate-700/70 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4D6D]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{isAr ? 'نسخة تجريبية حية ومباشرة جاهزة للاختبار' : 'Live Interactive Demo Ready to Test'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {isAr ? 'جرب تجربة الشراء الحية بنفسك الآن' : 'Test the Live Purchase Experience Now'}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {isAr ? (
                  'لقد قمنا ببناء نموذج متكامل لمتجر إلكتروني سعودي حديث، يتضمن واجهة العرض، سلة الشراء التفاعلية، صفحة إنهاء الطلب بوابات الدفع، ولوحة تحكم حية لإدارة المنتجات والطلبات والكوبونات.'
                ) : (
                  'We built a full sample Saudi e-commerce store with product display, interactive cart, checkout payment flow, and live merchant dashboard.'
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0">
              <Link
                href="/demo/store"
                className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white font-bold text-center flex items-center justify-center gap-2 hover:scale-105 transition duration-300 shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isAr ? 'معاينة واجهة المتجر (/demo/store)' : 'View Storefront (/demo/store)'}</span>
              </Link>
              
              <Link
                href="/demo/store/checkout"
                className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-center flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'تجربة صفحة الدفع (/demo/store/checkout)' : 'Test Checkout (/demo/store/checkout)'}</span>
              </Link>

              <Link
                href="/demo/store/admin"
                className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-center flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                <Layout className="w-4 h-4 text-blue-400" />
                <span>{isAr ? 'لوحة تحكم التاجر (/demo/store/admin)' : 'Merchant Admin (/demo/store/admin)'}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Key Store Features Grid */}
        <section className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              {isAr ? 'ما الذي ستحصل عليه في باقة المتجر الإلكتروني؟' : 'What is Included in the E-Commerce Package?'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              {isAr ? 'مواصفات وتقنيات عالمية مخصصة للنجاح في السوق السعودي والدولي' : 'World-class features tailored for success in the Saudi & regional market'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="p-6 rounded-2xl bg-[#14162E]/60 border border-slate-800 hover:border-[#FF4D6D]/50 transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF4D6D]/20 to-[#FF9A3C]/20 border border-[#FF4D6D]/30 flex items-center justify-center text-[#FF4D6D] group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{isAr ? 'أداء وسرعة فائقة ⚡' : 'Ultra-Fast Performance ⚡'}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {isAr ? 'متجر مبني بأحدث فريمورك 2026 يضمن تحميل الصفحة في أقل من ثانية واحدة لتجربة تصفح فورية لا تضيع أي زبون.' : 'Built with 2026 tech stack for sub-second page loads ensuring seamless buying experience.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#14162E]/60 border border-slate-800 hover:border-[#FF4D6D]/50 transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{isAr ? 'ربط بوابات الدفع المحلية 💳' : 'Saudi Payment Gateways 💳'}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {isAr ? 'دعم كامل لبوابات الدفع الأكثر شعبية بالمملكة: مدى (Mada)، Apple Pay، تمارا، تابي، الفيزا والماستركارد.' : 'Full support for Mada, Apple Pay, Tamara, Tabby, Visa, and Mastercard.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#14162E]/60 border border-slate-800 hover:border-[#FF4D6D]/50 transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{isAr ? 'تصميم متجاوب للجوال 📱' : 'Mobile First Responsive 📱'}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {isAr ? 'واجهات متناسقة 100% مع كافة الشاشات الذكية (iPhone, Android, Tablets) لضمان سهولة الطلب بلمسات بسيطة.' : '100% responsive interfaces tailored for effortless mobile purchasing.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#14162E]/60 border border-slate-800 hover:border-[#FF4D6D]/50 transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF9A3C]/20 to-amber-500/20 border border-[#FF9A3C]/30 flex items-center justify-center text-[#FF9A3C] group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{isAr ? 'لوحة تحكم وإدارة المخزون 📊' : 'Merchant Dashboard 📊'}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {isAr ? 'إدارة شاملة وسهلة لإضافة المنتجات، تعديل الأسعار، متابعة الطلبات، توليد كوبونات الخصم والتقارير.' : 'Complete dashboard for managing products, tracking orders, creating coupons, and viewing analytics.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#14162E]/60 border border-slate-800 hover:border-[#FF4D6D]/50 transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{isAr ? 'تهيأة محركات البحث SEO 🔍' : 'SEO & Analytics Ready 🔍'}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {isAr ? 'أرشفة فورية بصفحات جوجل، كود مهيأ لمحركات البحث مع ربط بكسل سناب شات وتيك توك وجوجل أناليتكس.' : 'Pre-configured for Google SEO indexing and pre-integrated with Meta, Snap, TikTok pixels.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#14162E]/60 border border-slate-800 hover:border-[#FF4D6D]/50 transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF4D6D]/20 to-red-500/20 border border-[#FF4D6D]/30 flex items-center justify-center text-[#FF4D6D] group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{isAr ? 'أمان ودعم فني مستمر 🛡️' : 'Security & Ongoing Support 🛡️'}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {isAr ? 'تشفير SSL عالي الأمان لبيانات العملاء والعمليات المالية مع دعم فني متواصل وتدريب كامل لفريقك.' : 'High-grade SSL encryption for transactions with continuous technical support.'}
              </p>
            </div>

          </div>
        </section>

        {/* Order CTA Section */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#FF4D6D]/20 via-[#FF9A3C]/20 to-blue-600/20 border border-[#FF4D6D]/30 text-center space-y-6 relative overflow-hidden">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {isAr ? 'جاهز لإطلاق متجرك الإلكتروني واكتساح السوق؟' : 'Ready to Launch Your Store & Elevate Your Brand?'}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-light">
            {isAr ? (
              'تواصل مع فريق وكالة دي آرو للتسويق والحلول الرقمية الآن واحصل على استشارة مجانية وعرض سعر مخصص لمتجرك.'
            ) : (
              'Contact D-Arrow Agency team now for a free consultation and customized quotation for your store.'
            )}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://wa.me/966500000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%88%D9%83%D8%A7%D9%84%D8%A9%20%D8%AF%D9%8A%20%D8%A2%D8%B1%D9%88%D9%8E%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D9%88%D8%B7%D9%84%D8%A8%20%D9%85%D8%AA%D8%AC%D8%B1%20%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-lg flex items-center gap-3 shadow-lg shadow-emerald-600/30 hover:scale-105 transition"
            >
              <MessageCircle className="w-6 h-6 fill-current" />
              <span>{isAr ? 'تواصل عبر الواتساب مباشرة' : 'Contact on WhatsApp Directly'}</span>
            </a>

            <Link
              href="/demo/store"
              className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-lg border border-white/20 flex items-center gap-3 transition"
            >
              <span>{isAr ? 'معاينة المتجر التفاعلي' : 'View Demo Store'}</span>
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
