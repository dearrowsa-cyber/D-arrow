'use client';

import React, { useState } from 'react';
import { Smartphone, Download, X, CheckCircle2, Share } from 'lucide-react';
import { useStore } from './StoreContext';

export default function PWAInstallBanner() {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [installed, setInstalled] = useState(false);

  const brandGradient = `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})`;

  return (
    <>
      {/* Floating PWA Trigger (Bottom Right) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-3.5 py-2.5 rounded-2xl bg-[#1C1707] hover:bg-[#2D250B] border border-[#382E0E] text-white font-bold text-xs flex items-center gap-2 shadow-2xl backdrop-blur-md transition hover:scale-105 active:scale-95 cursor-pointer demo-store-root"
      >
        <div 
          className="w-6 h-6 rounded-lg flex items-center justify-center text-white shadow-md flex-shrink-0"
          style={{ background: brandGradient }}
        >
          <Smartphone className="w-3.5 h-3.5" />
        </div>
        <span className="hidden sm:inline">تثبيت التطبيق</span>
        <span className="sm:hidden">تثبيت</span>
      </button>

      {/* PWA Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in demo-store-root" dir="rtl">
          <div className="w-full max-w-md rounded-3xl bg-[#1C1707] border-2 border-[#FFE600] p-6 space-y-6 shadow-2xl relative text-white">
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-[#120E04] hover:bg-[#2D250B] text-[#9CA3AF] hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-[#2D250B] border border-[#382E0E] mx-auto flex items-center justify-center text-[#FFE600] shadow-lg">
                <Smartphone className="w-8 h-8" />
              </div>

              {installed ? (
                <div className="space-y-2 py-4 animate-in zoom-in-95">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">تمت إضافة التطبيق بنجاح</h4>
                  <p className="text-xs text-slate-300 font-medium">
                    يمكنك الآن فتح متجر {settings.storeName} مباشرة من شاشة هاتفك الرئيسية.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="font-bold text-base text-white">تثبيت المتجر كتطبيق جوال (PWA)</h3>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed font-medium">
                    ثبّت متجر <strong className="text-white">{settings.storeName}</strong> على جهازك للوصول السريع وتلقي تنبيهات العروض الخاصة.
                  </p>
                </div>
              )}
            </div>

            {!installed && (
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#120E04] border border-[#382E0E] space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#2D250B] text-[#FFE600] font-bold flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5">1</span>
                    <p className="text-slate-300">
                      <strong>على أجهزة الآيفون (iOS):</strong> اضغط على زر المشاركة <Share className="w-3.5 h-3.5 inline mx-1 text-sky-400" /> في متصفح Safari، ثم اختر <strong>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#2D250B] text-[#FFE600] font-bold flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5">2</span>
                    <p className="text-slate-300">
                      <strong>على أجهزة الأندرويد (Android):</strong> اضغط على الزر أدناه لتثبيت التطبيق مباشرة.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setInstalled(true);
                    setTimeout(() => setIsOpen(false), 2500);
                  }}
                  className="btn-phosphor w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Download className="w-4 h-4 text-black" />
                  <span>تثبيت التطبيق على الشاشة الرئيسية</span>
                </button>

                <p className="text-[10px] text-center text-[#9CA3AF]">
                  يعمل دون استهلاك مساحة الذاكرة مع إشعارات فورية بالعروض والخصومات
                </p>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
