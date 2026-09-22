"use client";

import React from "react";
import Link from "@util/link";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useStore } from "./StoreContext";

export default function StoreFooter() {
  const { settings } = useStore();

  const brandGradient = `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})`;
  const footerBg = settings.footerBgColor || "#ECFCCB";
  const cardBg = settings.cardBgColor || "#FFFFFF";

  return (
    <footer
      className="text-[#E2E8F0] border-t border-[#382E0E] pt-14 pb-10 transition-colors duration-300 demo-store-root bg-[#2D250B]"
      dir="rtl"
    >
      <div className="max-w-[1550px] w-full mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
        {/* 1. Value Props Guarantee Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-b border-[#382E0E] pb-10">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-[#382E0E] shadow-sm bg-[#1C1707]">
            <div className="w-12 h-12 rounded-xl border border-[#382E0E] bg-[#1C1707] flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6 text-[#FFE600]" />
            </div>
            <div>
              <h5 className="font-black text-white text-sm">شحن وتوصيل سريع</h5>
              <p className="text-xs text-[#9CA3AF] font-medium">
                توصيل لكافة مدن ومحافظات المملكة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-[#382E0E] shadow-sm bg-[#1C1707]">
            <div className="w-12 h-12 rounded-xl border border-[#382E0E] bg-[#1C1707] flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h5 className="font-black text-white text-sm">
                دفع إلكتروني آمن
              </h5>
              <p className="text-xs text-[#9CA3AF] font-medium">
                مدى، Apple Pay، وتقسيط تمارا وتابي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-[#382E0E] shadow-sm bg-[#1C1707]">
            <div className="w-12 h-12 rounded-xl border border-[#382E0E] bg-[#1C1707] flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-6 h-6 text-[#FFE600]" />
            </div>
            <div>
              <h5 className="font-black text-white text-sm">
                استرجاع مرن 14 يوم
              </h5>
              <p className="text-xs text-[#9CA3AF] font-medium">
                سياسة استبدال واسترجاع مبسطة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-[#382E0E] shadow-sm bg-[#1C1707]">
            <div className="w-12 h-12 rounded-xl border border-[#382E0E] bg-[#1C1707] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#FFE600]" />
            </div>
            <div>
              <h5 className="font-black text-white text-sm">
                منتجات أصلية 100%
              </h5>
              <p className="text-xs text-[#9CA3AF] font-medium">
                ضمان ذهبي معتمد وفواتير ضريبية
              </p>
            </div>
          </div>
        </div>

        {/* 2. Main Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-gradient-to-br from-[#ECFDF5] to-[#ECFCCB] border-2 border-[#FFE600] p-2 flex items-center justify-center shadow-lg shadow-[#FFE600]/20 flex-shrink-0">
                  <img
                    src={settings.logoUrl}
                    alt={settings.storeName}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xl flex-shrink-0 btn-phosphor">
                  {settings.storeName.charAt(0)}
                </div>
              )}
              <span className="font-black text-lg text-white">
                {settings.storeName}
              </span>
            </div>

            <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-sm font-bold">
              {settings.storeSlogan}. متجر سعودي رائد يقدم أفضل المنتجات الحصرية
              بأعلى معايير الجودة والموثوقية وبوابات دفع معتمدة.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-xl bg-[#1C1707] border border-[#FFE600] text-white text-[11px] font-black flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FFE600]" />
                <span>موثق في المركز السعودي للأعمال</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h6 className="font-black text-white text-sm">روابط سريعة</h6>
            <ul className="space-y-2 text-[#9CA3AF] font-bold">
              <li>
                <Link
                  href="/demo/store"
                  className="hover:text-[#FFE600] transition"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="/demo/store#catalog"
                  className="hover:text-[#FFE600] transition"
                >
                  جميع المنتجات
                </Link>
              </li>
              <li>
                <Link
                  href="/demo/store#flash-deals"
                  className="hover:text-[#FFE600] transition"
                >
                  عروض الخصم السريعة
                </Link>
              </li>
              <li>
                <Link
                  href="/demo/store/track"
                  className="text-[#FFE600] hover:underline font-bold transition"
                >
                  تتبع حالة الشحنة
                </Link>
              </li>
              <li>
                <Link
                  href="/demo/store/checkout"
                  className="hover:text-[#FFE600] transition"
                >
                  إتمام الطلب والدفع
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3 text-xs">
            <h6 className="font-extrabold text-white text-sm">خدمة العملاء</h6>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  سياسة الاستبدال والاسترجاع
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  الشحن والتوصيل لكافة المدن
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  خيارات تقسيط تمارا وتابي
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  الأسئلة الشائعة (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Trust */}
          <div className="space-y-3 text-xs">
            <h6 className="font-extrabold text-white text-sm">تواصل معنا</h6>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin
                  className="w-3.5 h-3.5"
                  style={{ color: settings.accentColor }}
                />
                <span>المملكة العربية السعودية، الرياض</span>
              </li>
              <li className="flex items-center gap-2 font-mono">
                <Phone
                  className="w-3.5 h-3.5"
                  style={{ color: settings.primaryColor }}
                />
                <span dir="ltr">+966 50 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail
                  className="w-3.5 h-3.5"
                  style={{ color: settings.accentColor }}
                />
                <span>support@d-arrow.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Payment Badges & Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} {settings.storeName}. كافة الحقوق
            محفوظة.
          </div>

          {/* Saudi Payment Method Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-[#1C1707]/5 border border-white/10 text-slate-300 font-bold text-[10px]">
              مدى Mada
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#1C1707]/5 border border-white/10 text-slate-300 font-bold text-[10px]">
              Apple Pay
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#1C1707]/5 border border-white/10 text-slate-300 font-bold text-[10px]">
              تمارا Tamara
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#1C1707]/5 border border-white/10 text-slate-300 font-bold text-[10px]">
              تابي Tabby
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#1C1707]/5 border border-white/10 text-slate-300 font-bold text-[10px]">
              Visa / MasterCard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
