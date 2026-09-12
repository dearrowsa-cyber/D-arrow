import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Sparkles, 
  ShoppingBag, 
  Mail, 
  Phone, 
  Instagram, 
  CheckCircle2, 
  Star, 
  ArrowLeft,
  Heart,
  Crown,
  Share2,
  Clock
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'سارة | Sara — المتجر الرسمي والبورتفوليو',
  description: 'الموقع الرسمي لـ سارة — أزياء وتصاميم فاخرة، تعاونات تجارية، وخدمات إبداعية.',
};

export default function SaraPage() {
  const products = [
    {
      id: '1',
      name: 'عباية الحرير الملكي الأسود المطرز',
      price: '850 ر.س',
      tag: 'الأكثر طلباً',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      description: 'حرير كوري فاخر مع تطريز يدوي بخيوط الحرير الياباني وشيلة منتقاة.',
    },
    {
      id: '2',
      name: 'كولكشن صيف 2026 الكتان الطبيعي',
      price: '620 ر.س',
      tag: 'حصري',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      description: 'قصة بليزر عصرية بأقمشة طبيعية خفيفة ومريحة للاستخدام اليومي الراقي.',
    },
    {
      id: '3',
      name: 'قفطان المناسبات التراثي الفاخر',
      price: '1,200 ر.س',
      tag: 'إصدار محدود',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      description: 'مستوحى من التراث السعودي الأصيل مع لمسات عصرية وشك يدوي راقٍ.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070913] text-white font-sans selection:bg-rose-500 selection:text-white" dir="rtl">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#070913]/85 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-[2px] shadow-lg shadow-rose-500/25">
              <div className="w-full h-full bg-[#0d1024] rounded-2xl flex items-center justify-center font-bold text-lg text-rose-400">
                S
              </div>
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-white via-rose-100 to-rose-400 bg-clip-text text-transparent">
                SARA | سارة
              </h1>
              <p className="text-xs text-rose-300/70 font-medium">Official Brand & Portfolio</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="mailto:info@sara.d-arrow.com"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition"
            >
              <Mail className="w-4 h-4 text-rose-400" />
              info@sara.d-arrow.com
            </a>
            <a
              href="https://wa.me/966551234567"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-sm shadow-lg shadow-rose-500/30 transition transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-4 h-4" />
              تواصل واطلب الآن
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 px-6">
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-40 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
            الموقع الرسمي لـ سارة (sara.d-arrow.com)
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
            الأناقة العصرية <br />
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              بلمسات سعودية راقية
            </span>
          </h2>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            مرحباً بكم في المنصة الرسمية لـ <strong>سارة</strong> — تصاميم أزياء حصرية، استشارات إبداعية، وتنسيقات تناسب ذوق المرأة الخليجية العصرية.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#products"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold shadow-xl shadow-rose-500/30 transition transform hover:-translate-y-1"
            >
              استعراض التشكيلة
            </a>
            <a
              href="mailto:info@sara.d-arrow.com"
              className="px-8 py-4 rounded-2xl bg-[#14172e] hover:bg-[#1a1e3a] border border-white/10 font-bold transition flex items-center gap-2"
            >
              <Mail className="w-5 h-5 text-rose-400" />
              مراسلة عبر البريد
            </a>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <Crown className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-extrabold text-white">100%</div>
              <div className="text-xs text-slate-400 mt-1">تصاميم أصلية حصرية</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <Star className="w-6 h-6 text-rose-400 mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-extrabold text-white">4.9 / 5</div>
              <div className="text-xs text-slate-400 mt-1">تقييم العملاء المميز</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <Clock className="w-6 h-6 text-pink-400 mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-extrabold text-white">توصيل سريع</div>
              <div className="text-xs text-slate-400 mt-1">لجميع مناطق المملكة</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-extrabold text-white">معتمد</div>
              <div className="text-xs text-slate-400 mt-1">خدمة عملاء على مدار الساعة</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold">
            <ShoppingBag className="w-3.5 h-3.5" />
            التشكيلة المختارة
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold">أحدث الإبداعات والتصاميم</h3>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            قطع تم انتقاؤها وصياغتها بدقة وعناية فائقة لتبرز تميزك في كل مناسبة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p) => (
            <div
              key={p.id}
              className="group rounded-3xl bg-[#0e1124] border border-white/10 overflow-hidden hover:border-rose-500/40 transition duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-rose-600/90 backdrop-blur-md text-white text-xs font-bold shadow-lg">
                  {p.tag}
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-lg text-white group-hover:text-rose-300 transition">
                    {p.name}
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed mt-2">
                    {p.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">السعر</span>
                    <span className="text-xl font-black text-rose-400">{p.price}</span>
                  </div>
                  <a
                    href={`https://wa.me/966551234567?text=${encodeURIComponent(`مرحباً سارة، أود الاستفسار والطلب لـ: ${p.name}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-rose-500 hover:text-white font-semibold text-xs transition"
                  >
                    طلب فوري 💬
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Official Contact Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-rose-950/20 to-transparent">
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#0f1329] border border-rose-500/20 p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8" />
          </div>

          <h3 className="text-2xl md:text-4xl font-extrabold text-white">
            تواصل رسمي مع سارة
          </h3>
          <p className="text-slate-300 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            للتعاونات التجارية، الاستشارات الخاصة، والطلبات الكبرى، يرجى التواصل عبر البريد الرسمي المعتمد:
          </p>

          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-black/40 border border-white/10 text-rose-300 font-mono text-base md:text-lg">
            <Mail className="w-5 h-5 text-rose-400" />
            info@sara.d-arrow.com
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <a
              href="mailto:info@sara.d-arrow.com"
              className="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm transition shadow-lg shadow-rose-500/25"
            >
              إرسال رسالة الآن
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 text-center text-xs text-slate-500">
        <p>© 2026 سارة (Sara) — جميع الحقوق محفوظة · مدعوم ومستضاف لدى D-Arrow</p>
      </footer>
    </div>
  );
}
