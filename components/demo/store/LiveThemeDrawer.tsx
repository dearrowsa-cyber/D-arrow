"use client";

import React, { useRef, useState } from "react";
import Link from "@util/link";
import {
  X,
  Sliders,
  Sparkles,
  Check,
  RotateCcw,
  LayoutDashboard,
  Palette,
  Megaphone,
  Moon,
  Crown,
  Flame,
  Coffee,
  Compass,
  Upload,
  Zap,
  Image as ImageIcon,
} from "lucide-react";
import { useStore, ThemePreset } from "./StoreContext";

interface PresetConfig {
  id: ThemePreset;
  nameAr: string;
  nameEn: string;
  primary: string;
  accent: string;
  headerBg: string;
  pageBg: string;
  cardBg: string;
  footerBg: string;
  icon: any;
}

export default function LiveThemeDrawer() {
  const {
    settings,
    updateSettings,
    resetSettings,
    isCustomizerOpen,
    setIsCustomizerOpen,
  } = useStore();

  const logoDrawerInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadToast, setUploadToast] = useState("");

  if (!isCustomizerOpen) return null;

  const showToast = (msg: string) => {
    setUploadToast(msg);
    setTimeout(() => setUploadToast(""), 3000);
  };

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        updateSettings({ logoUrl: base64 });
        showToast("تم رفع صورة اللوجو من جهازك وتطبيقها حياً ✓");
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
      showToast("حدث خطأ أثناء قراءة ملف الصورة");
    };
    reader.readAsDataURL(file);
  };

  const PRESET_PALETTES: PresetConfig[] = [
    {
      id: "neon-phosphor",
      nameAr: "الذهبي الفسفوري الملكي (الافتراضي)",
      nameEn: "Imperial Phosphor Gold (Default)",
      primary: "#FFE600",
      accent: "#FFD700",
      headerBg: "#161205",
      pageBg: "#120E04",
      cardBg: "#1C1707",
      footerBg: "#0C0903",
      icon: Sparkles,
    },
    {
      id: "emerald-royal",
      nameAr: "الزمردي النيون الملكي",
      nameEn: "Royal Emerald Neon",
      primary: "#00E575",
      accent: "#00F2FE",
      headerBg: "#08170F",
      pageBg: "#05120B",
      cardBg: "#0B1E13",
      footerBg: "#030C07",
      icon: Crown,
    },
    {
      id: "cyber-cyan",
      nameAr: "السيان الكهربائي الحديث",
      nameEn: "Cyber Cyan Neon",
      primary: "#00F2FE",
      accent: "#00A3FF",
      headerBg: "#06151E",
      pageBg: "#041017",
      cardBg: "#081B26",
      footerBg: "#020A0F",
      icon: Compass,
    },
    {
      id: "modern-purple",
      nameAr: "البنفسجي النيون المشع",
      nameEn: "Cyber Violet Neon",
      primary: "#A855F7",
      accent: "#EC4899",
      headerBg: "#150A22",
      pageBg: "#0F0619",
      cardBg: "#1B0E2B",
      footerBg: "#0A0410",
      icon: Flame,
    },
    {
      id: "luxury-rose",
      nameAr: "الوردي والياقوتي الفاخر",
      nameEn: "Luxury Ruby Rose",
      primary: "#FF2E93",
      accent: "#FF0055",
      headerBg: "#1D0715",
      pageBg: "#16040F",
      cardBg: "#260A1B",
      footerBg: "#0F020A",
      icon: Moon,
    },
    {
      id: "titanium-silver",
      nameAr: "التيتانيوم الفضي الملكي",
      nameEn: "Imperial Silver Titanium",
      primary: "#E2E8F0",
      accent: "#94A3B8",
      headerBg: "#0F1218",
      pageBg: "#0B0D11",
      cardBg: "#141820",
      footerBg: "#07090C",
      icon: Zap,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none flex justify-end"
      dir="rtl"
    >
      {/* Transparent Click-to-Close Area without any black overlay so the live store is 100% visible */}
      <div
        onClick={() => setIsCustomizerOpen(false)}
        className="fixed inset-0 pointer-events-auto cursor-pointer"
        title="انقر هنا لإغلاق الاستوديو والعودة للمتجر"
      />

      <div className="relative w-full max-w-lg h-full pointer-events-auto z-10 shadow-2xl">
        <div className="w-full h-full bg-[#161205]/95 backdrop-blur-2xl border-r sm:border-r-0 sm:border-l-2 border-[#382E0E] text-white flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#382E0E] flex items-center justify-between bg-[#120E04]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2D250B] border border-[#382E0E] text-[#FFE600] flex items-center justify-center shadow-md">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm sm:text-base text-white block">
                  استوديو تخصيص الهوية والثيم
                </span>
                <span className="text-[11px] text-[#9CA3AF] font-medium block">
                  معاينة حية وفورية لكافة ألوان المتجر
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCustomizerOpen(false)}
              className="p-2 rounded-xl bg-[#1C1707] hover:bg-[#2D250B] text-[#D1D5DB] hover:text-[#FFE600] border border-[#382E0E] transition cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Toast Notification */}
          {uploadToast && (
            <div className="p-3 bg-[#2D250B] border-b border-[#FFE600]/40 text-[#FFE600] font-bold text-xs text-center animate-in fade-in">
              {uploadToast}
            </div>
          )}

          {/* Body Settings */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* 1. Theme Preset Selector */}
            <div className="space-y-3">
              <span className="font-bold text-xs sm:text-sm text-white flex items-center gap-2 block">
                <Palette className="w-4 h-4 text-[#FFE600]" />
                <span>أنظمة الألوان المتكاملة:</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESET_PALETTES.map((preset) => {
                  const isSelected = settings.themePreset === preset.id;
                  const Icon = preset.icon;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        updateSettings({
                          themePreset: preset.id,
                          primaryColor: preset.primary,
                          accentColor: preset.accent,
                          headerBgColor: preset.headerBg,
                          pageBgColor: preset.pageBg,
                          cardBgColor: preset.cardBg,
                          footerBgColor: preset.footerBg,
                        });
                      }}
                      className={`p-3.5 rounded-2xl border text-right transition flex items-center justify-between cursor-pointer bg-[#1C1707] hover:bg-[#241D09] ${
                        isSelected
                          ? "!border-[#FFE600] shadow-xl ring-2 ring-[#FFE600]/30"
                          : "border-[#382E0E]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-black font-black shadow-md flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${preset.primary}, ${preset.accent})`,
                          }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-black text-xs text-white truncate">
                            {preset.nameAr}
                          </p>
                          <p className="text-[10px] text-[#9CA3AF] font-mono mt-0.5">
                            {preset.nameEn}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-white/20"
                              style={{ backgroundColor: preset.headerBg }}
                              title="الهيدر"
                            />
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-white/20"
                              style={{ backgroundColor: preset.pageBg }}
                              title="الخلفية"
                            />
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-white/20"
                              style={{ backgroundColor: preset.primary }}
                              title="اللون الأساسي"
                            />
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#FFE600] text-black flex items-center justify-center flex-shrink-0 font-black">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Direct Computer Logo Upload Section */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#1C1707] border border-[#382E0E]">
              <span className="font-bold text-xs text-white flex items-center gap-2 block">
                <Upload className="w-4 h-4 text-[#FFE600]" />
                <span>رفع شعار المتجر من الجهاز:</span>
              </span>

              <div className="p-3 rounded-2xl bg-[#120E04] border border-[#382E0E] flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-[#1C1707] border border-[#382E0E] p-1.5 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {settings.logoUrl ? (
                    <img
                      src={settings.logoUrl}
                      alt="Store Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-[#9CA3AF]" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    ref={logoDrawerInputRef}
                    onChange={handleLogoFile}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => logoDrawerInputRef.current?.click()}
                    disabled={isUploading}
                    className="btn-phosphor w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-black" />
                    <span>
                      {isUploading ? "جاري الرفع..." : "رفع صورة الشعار"}
                    </span>
                  </button>

                  {settings.logoUrl && (
                    <button
                      type="button"
                      onClick={() => updateSettings({ logoUrl: "" })}
                      className="text-[11px] text-red-400 hover:text-red-300 font-bold block"
                    >
                      إزالة الشعار
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div>
                  <label className="text-[11px] text-[#9CA3AF] font-bold block mb-1">
                    اسم المتجر
                  </label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) =>
                      updateSettings({ storeName: e.target.value })
                    }
                    className="w-full !bg-[#120E04] !text-white border !border-[#382E0E] focus:!border-[#FFE600] rounded-xl px-3.5 py-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#9CA3AF] font-bold block mb-1">
                    الشعار اللفظي (Slogan)
                  </label>
                  <input
                    type="text"
                    value={settings.storeSlogan}
                    onChange={(e) =>
                      updateSettings({ storeSlogan: e.target.value })
                    }
                    className="w-full !bg-[#120E04] !text-white border !border-[#382E0E] focus:!border-[#FFE600] rounded-xl px-3.5 py-2 text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 3. Granular Color Customizer */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#1C1707] border border-[#382E0E]">
              <span className="font-bold text-xs text-white block">
                تخصيص درجات الألوان بدقة:
              </span>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Header Background */}
                <div>
                  <label className="text-[11px] text-[#9CA3AF] font-bold block mb-1">
                    لون الهيدر (Header)
                  </label>
                  <div className="flex items-center gap-2 bg-[#120E04] p-2 rounded-xl border border-[#382E0E]">
                    <input
                      type="color"
                      value={settings.headerBgColor || "#161205"}
                      onChange={(e) =>
                        updateSettings({ headerBgColor: e.target.value })
                      }
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs font-mono font-bold text-white">
                      {settings.headerBgColor || "#161205"}
                    </span>
                  </div>
                </div>

                {/* Page Background */}
                <div>
                  <label className="text-[11px] text-[#9CA3AF] font-bold block mb-1">
                    خلفية الصفحة (Page BG)
                  </label>
                  <div className="flex items-center gap-2 bg-[#120E04] p-2 rounded-xl border border-[#382E0E]">
                    <input
                      type="color"
                      value={settings.pageBgColor || "#120E04"}
                      onChange={(e) =>
                        updateSettings({ pageBgColor: e.target.value })
                      }
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs font-mono font-bold text-white">
                      {settings.pageBgColor || "#120E04"}
                    </span>
                  </div>
                </div>

                {/* Card Background */}
                <div>
                  <label className="text-[11px] text-[#9CA3AF] font-bold block mb-1">
                    خلفية الكروت (Cards)
                  </label>
                  <div className="flex items-center gap-2 bg-[#120E04] p-2 rounded-xl border border-[#382E0E]">
                    <input
                      type="color"
                      value={settings.cardBgColor || "#1C1707"}
                      onChange={(e) =>
                        updateSettings({ cardBgColor: e.target.value })
                      }
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs font-mono font-bold text-white">
                      {settings.cardBgColor || "#1C1707"}
                    </span>
                  </div>
                </div>

                {/* Footer Background */}
                <div>
                  <label className="text-[11px] text-[#9CA3AF] font-bold block mb-1">
                    خلفية الفوتر (Footer)
                  </label>
                  <div className="flex items-center gap-2 bg-[#120E04] p-2 rounded-xl border border-[#382E0E]">
                    <input
                      type="color"
                      value={settings.footerBgColor || "#0C0903"}
                      onChange={(e) =>
                        updateSettings({ footerBgColor: e.target.value })
                      }
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs font-mono font-bold text-white">
                      {settings.footerBgColor || "#0C0903"}
                    </span>
                  </div>
                </div>

                {/* Primary Brand Color */}
                <div>
                  <label className="text-[11px] text-[#9CA3AF] font-bold block mb-1">
                    اللون الأساسي (Primary)
                  </label>
                  <div className="flex items-center gap-2 bg-[#120E04] p-2 rounded-xl border border-[#382E0E]">
                    <input
                      type="color"
                      value={settings.primaryColor || "#FFE600"}
                      onChange={(e) =>
                        updateSettings({ primaryColor: e.target.value })
                      }
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs font-mono font-bold text-white">
                      {settings.primaryColor || "#FFE600"}
                    </span>
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <label className="text-[11px] text-[#9CA3AF] font-bold block mb-1">
                    اللون الثانوي (Accent)
                  </label>
                  <div className="flex items-center gap-2 bg-[#120E04] p-2 rounded-xl border border-[#382E0E]">
                    <input
                      type="color"
                      value={settings.accentColor || "#FFD700"}
                      onChange={(e) =>
                        updateSettings({ accentColor: e.target.value })
                      }
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs font-mono font-bold text-white">
                      {settings.accentColor || "#FFD700"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Announcement Bar Editor */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#1C1707] border border-[#382E0E]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-[#FFE600]" />
                  <span>شريط الإعلانات الترويجي:</span>
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.announcementEnabled}
                    onChange={(e) =>
                      updateSettings({ announcementEnabled: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#120E04] border border-[#382E0E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#FFE600] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2D250B]"></div>
                </label>
              </div>

              {settings.announcementEnabled && (
                <textarea
                  value={settings.announcementText}
                  onChange={(e) =>
                    updateSettings({ announcementText: e.target.value })
                  }
                  rows={2}
                  className="w-full !bg-[#120E04] !text-white border !border-[#382E0E] focus:!border-[#FFE600] rounded-xl p-3 text-xs leading-relaxed font-medium"
                />
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-5 bg-[#120E04] border-t border-[#382E0E] space-y-3">
            <div className="flex gap-2">
              <button
                onClick={resetSettings}
                className="px-4 py-2.5 rounded-xl bg-[#1C1707] hover:bg-[#2D250B] border border-[#382E0E] text-xs font-bold text-[#D1D5DB] flex items-center gap-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط</span>
              </button>

              <button
                onClick={() => setIsCustomizerOpen(false)}
                className="btn-phosphor flex-1 py-2.5 rounded-xl font-bold text-xs shadow-md cursor-pointer"
              >
                تطبيق التغييرات
              </button>
            </div>

            <Link
              href="/demo/store/admin"
              onClick={() => setIsCustomizerOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#1C1707] hover:bg-[#2D250B] text-[#D1D5DB] hover:text-[#FFE600] border border-[#382E0E] text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#FFE600]" />
              <span>لوحة التحكم الكاملة للتاجر (Admin Dashboard) ↗</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
