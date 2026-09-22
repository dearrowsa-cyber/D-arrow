"use client";

import React, { useState } from "react";
import Link from "@util/link";
import { StoreProvider, useStore } from "@/components/demo/store/StoreContext";
import StoreHeader from "@/components/demo/store/StoreHeader";
import StoreFooter from "@/components/demo/store/StoreFooter";
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  MessageSquare,
  Package,
  Search,
  ShieldCheck,
  ArrowRight,
  Navigation,
  Sparkles,
  Building2,
  Home,
  UserCheck,
} from "lucide-react";
import "@/app/(main)/demo/store/demo-store.css";

function TrackingContent() {
  const { settings, orders } = useStore();
  const [searchQuery, setSearchQuery] = useState("SAR-8921");
  const [activeStep, setActiveStep] = useState(3); // 3 = out for delivery

  const brandGradient = `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})`;

  const TRACKING_STEPS = [
    {
      title: "تم استلام وتأكيد الطلب",
      subtitle: "تم التحقق من الدفع وإصدار الفاتورة الضريبية",
      time: "اليوم، 10:15 ص",
      location: "مركز معالجة الطلبات - الرياض",
      icon: CheckCircle2,
      done: true,
    },
    {
      title: "قيد التجهيز والتغليف الفاخر",
      subtitle: "تم فحص جودة المنتجات وتغليفها مع كرت الضمان",
      time: "اليوم، 11:30 ص",
      location: "مستودعات دي آرو المركزية - السلي",
      icon: Package,
      done: true,
    },
    {
      title: "تم التسليم لشركة الشحن السريع (أرامكس)",
      subtitle: "الشحنة غادرت مركز الفرز الرئيسي باتجاه وجهتك",
      time: "اليوم، 01:20 م",
      location: "مركز الفرز واللوجستيات - طريق المطار",
      icon: Truck,
      done: true,
    },
    {
      title: "في الطريق إلى باب منزلك (Out for Delivery)",
      subtitle: "المندوب في الحي الخاص بك للتسليم المباشر",
      time: "اليوم، 02:45 م (الآن)",
      location: "حي النرجس، شمال الرياض",
      icon: Navigation,
      done: true,
      current: true,
    },
    {
      title: "تم استلام الشحنة بنجاح",
      subtitle: "توقيع العميل وتأكيد الاستلام",
      time: "متوقع خلال 35 دقيقة",
      location: "عنوان العميل",
      icon: Home,
      done: false,
    },
  ];

  return (
    <div
      className="min-h-screen text-white flex flex-col font-sans demo-store-root transition-colors duration-300"
      style={{ backgroundColor: settings.pageBgColor || "#070914" }}
      dir="rtl"
    >
      <StoreHeader />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Page Title & Search Bar */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-lg">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>نظام التتبع الحي المباشر للشحنات 🇸🇦</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white">
            تتبع حالة شحنتك لحظة بلحظة
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            أدخل رقم الطلب أو الشحنة لمتابعة مسار المندوب وموعد الوصول الدقيق
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto pt-2 flex items-center gap-2 bg-[#121535] p-1.5 rounded-2xl border border-white/15 shadow-xl">
            <Search className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="مثال: SAR-8921"
              className="flex-1 !bg-transparent !text-white text-xs sm:text-sm font-mono font-bold focus:outline-none border-0"
            />
            <button
              style={{ background: brandGradient }}
              className="px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md hover:opacity-90 transition cursor-pointer"
            >
              تتبع الشحنة
            </button>
          </div>
        </div>

        {/* Live Interactive Map Simulation Card */}
        <div
          className="rounded-3xl border border-white/15 overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8"
          style={{ backgroundColor: settings.cardBgColor || "#10132E" }}
        >
          {/* Header Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs text-slate-400 font-bold block">
                رقم الشحنة الوطنية:
              </span>
              <span className="text-lg sm:text-xl font-mono font-black text-white flex items-center gap-2 mt-0.5">
                <span>{searchQuery}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  شحن سريع أرامكس Express ⚡
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 block font-bold">
                  موعد الوصول المتوقع:
                </span>
                <span
                  className="text-base sm:text-lg font-black font-mono"
                  style={{ color: settings.accentColor }}
                >
                  اليوم بين 03:30 م - 04:15 م
                </span>
              </div>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0"
                style={{ background: brandGradient }}
              >
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Interactive Simulated Map Visual */}
          <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-[#0A0D24] border border-white/15 p-4 flex flex-col justify-between shadow-inner">
            {/* Grid Pattern overlay */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Map Roads & Route Lines (SVG) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 60 210 Q 180 120, 320 150 T 650 80"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="4"
                strokeDasharray="8 8"
              />
              <path
                d="M 60 210 Q 180 120, 320 150"
                fill="none"
                stroke={settings.primaryColor}
                strokeWidth="4"
                className="animate-pulse"
              />
            </svg>

            {/* Map Node: Warehouse */}
            <div className="absolute bottom-6 right-8 z-10 flex items-center gap-2 bg-[#12163A]/90 p-2.5 rounded-2xl border border-white/20 backdrop-blur-md shadow-xl">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold">
                  نقطة الانطلاق
                </span>
                <span className="text-xs font-bold text-white">
                  مستودع الرياض
                </span>
              </div>
            </div>

            {/* Map Node: Delivery Van Live Marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center animate-bounce">
              <div
                className="px-3 py-1 rounded-full text-white font-black text-[10px] shadow-2xl flex items-center gap-1.5 whitespace-nowrap mb-1"
                style={{ background: brandGradient }}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>المندوب في طريق التوصيل (حي النرجس)</span>
              </div>
              <div className="w-4 h-4 rounded-full bg-[#1C1707] ring-4 ring-emerald-500 shadow-lg" />
            </div>

            {/* Map Node: Destination */}
            <div className="absolute top-6 left-8 z-10 flex items-center gap-2 bg-[#12163A]/90 p-2.5 rounded-2xl border border-white/20 backdrop-blur-md shadow-xl">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Home className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold">
                  وجهة التسليم
                </span>
                <span className="text-xs font-bold text-white">
                  منزل العميل
                </span>
              </div>
            </div>

            {/* Live GPS Badge */}
            <div className="relative z-10 self-start px-3 py-1.5 rounded-xl bg-black/60 border border-white/15 backdrop-blur-md text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE GPS &bull; تتبع مباشر نشط</span>
            </div>
          </div>

          {/* Courier Driver & Support Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 items-center">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#181C3D] border border-white/15 flex-shrink-0 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                  alt="مندوب التوصيل"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">
                  مندوب التوصيل المعتمد:
                </span>
                <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <span>تركي العتيبي</span>
                  <span className="text-amber-400 text-xs">★ 4.9</span>
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  سيارة توصيل مبردة &bull; لوحة أ د ح 8921
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 justify-end">
              <a
                href="tel:0501234567"
                className="px-4 py-2.5 rounded-xl bg-[#1C1707]/10 hover:bg-[#1C1707]/15 border border-white/15 text-white font-bold text-xs flex items-center gap-2 transition"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>اتصال بالمندوب</span>
              </a>

              <a
                href="https://wa.me/966501234567"
                target="_blank"
                style={{ background: brandGradient }}
                className="px-4 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-2 shadow-lg hover:opacity-90 transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>محادثة واتساب</span>
              </a>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h4 className="font-black text-base text-white">
              سجل وتفاصيل مسار الشحنة:
            </h4>

            <div className="space-y-6 relative before:absolute before:right-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#1C1707]/10 pr-2">
              {TRACKING_STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className="relative flex items-start gap-4 pr-3 group"
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                        step.current
                          ? "text-white shadow-xl scale-110 ring-4 ring-white/20"
                          : step.done
                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                            : "bg-[#1C1707]/5 border border-white/10 text-slate-500"
                      }`}
                      style={step.current ? { background: brandGradient } : {}}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 bg-black/20 p-4 rounded-2xl border border-white/5 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h5 className="font-extrabold text-sm text-white">
                          {step.title}
                        </h5>
                        <span className="text-[11px] font-mono text-slate-400 font-bold">
                          {step.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">
                        {step.subtitle}
                      </p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-bold">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{step.location}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}

export default function TrackingPage() {
  return (
    <StoreProvider>
      <TrackingContent />
    </StoreProvider>
  );
}
