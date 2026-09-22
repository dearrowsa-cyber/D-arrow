"use client";

import React, { useState, useEffect } from "react";
import Link from "@util/link";
import {
  StoreProvider,
  useStore,
  StoreProduct,
} from "@/components/demo/store/StoreContext";
import StoreHeader from "@/components/demo/store/StoreHeader";
import StoreFooter from "@/components/demo/store/StoreFooter";
import CartDrawer from "@/components/demo/store/CartDrawer";
import LiveThemeDrawer from "@/components/demo/store/LiveThemeDrawer";
import SocialProofPopup from "@/components/demo/store/SocialProofPopup";
import PriceAlertModal from "@/components/demo/store/PriceAlertModal";
import PWAInstallBanner from "@/components/demo/store/PWAInstallBanner";
import { STORE_NICHES } from "@/components/demo/store/niches";
import {
  ShoppingCart,
  Search,
  Star,
  Heart,
  Eye,
  Zap,
  Flame,
  Clock,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Tag,
  Sparkles,
  Sliders,
  Plus,
  Minus,
  X,
  Share2,
  Check,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
  Crown,
  Bell,
  Layers,
  Smartphone,
} from "lucide-react";
import "@/app/(main)/demo/store/demo-store.css";

function StoreMainContent() {
  const {
    products,
    addToCart,
    cart,
    wishlist,
    toggleWishlist,
    settings,
    searchQuery,
    setIsCustomizerOpen,
    priceAlertProduct,
    setPriceAlertProduct,
    switchNiche,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [quickViewProduct, setQuickViewProduct] = useState<StoreProduct | null>(
    null,
  );
  const [quickViewQty, setQuickViewQty] = useState<number>(1);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [flashTimeLeft, setFlashTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    hours: 14,
    minutes: 35,
    seconds: 42,
  });

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setFlashTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const HERO_SLIDES = [
    {
      badge: "عروض المملكة الحصرية",
      title: "عروض الخصم الكبرى — وفر حتى 50%",
      subtitle: settings.storeSlogan,
      coupon: "KSA50",
      ctaText: "تصفح العروض",
      image:
        products[0]?.image ||
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85",
      primaryBtn: "تسوق الآن",
    },
    {
      badge: "تشكيلة الفخامة المختارة",
      title: "أفضل الخيارات والمنتجات الأصلية 100% مع ضمان رسمي",
      subtitle: "جودة استثنائية مع توصيل سريع لكافة مدن ومحافظات المملكة.",
      coupon: "VIP15",
      ctaText: "استكشف التشكيلة",
      image:
        products[1]?.image ||
        "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=85",
      primaryBtn: "تصفح الكتالوج",
    },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const flashDeals = products.filter((p) => p.isFlashDeal);
  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const brandGradient = `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})`;
  const pageBg = settings.pageBgColor || "#F7FEE7";
  const cardBg = settings.cardBgColor || "#FFFFFF";

  return (
    <div
      className="min-h-screen text-white flex flex-col font-sans demo-store-root phosphor-bg-mesh transition-colors duration-300"
      style={{ backgroundColor: pageBg }}
      dir="rtl"
    >
      {/* 1. Dedicated Store Header */}
      <StoreHeader />

      {/* 2. Quick Niche Switcher Bar */}
      <div className="border-b border-[#382E0E] py-2 sm:py-3 px-3 sm:px-8 transition-colors duration-300 bg-[#161205]/95 backdrop-blur-md">
        <div className="max-w-[1550px] w-full mx-auto flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
          <span className="font-bold text-white text-[11px] whitespace-nowrap flex-shrink-0 hidden sm:block">
            نشاط المتجر:
          </span>
          {Object.values(STORE_NICHES).map((niche) => {
            const isActive = settings.currentNiche === niche.id;
            return (
              <button
                key={niche.id}
                onClick={() => switchNiche(niche.id)}
                className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl text-[11px] whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 shadow-sm flex-shrink-0 ${
                  isActive ? "btn-phosphor ring-2 ring-[#FFE600]" : "font-bold"
                }`}
                style={
                  isActive
                    ? {}
                    : {
                        backgroundColor: "#1C1707",
                        color: "#E2E8F0",
                        border: "1px solid #382E0E",
                      }
                }
              >
                <span>{niche.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Body Container */}
      <main className="flex-1 w-full max-w-[1550px] mx-auto px-3 sm:px-8 lg:px-12 py-4 sm:py-8 space-y-6 sm:space-y-12 lg:space-y-14">
        {/* ================= HERO SLIDER ================= */}
        <section
          className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#FFE600]/40"
          style={{
            background:
              "linear-gradient(135deg, #0D1117 0%, #161B22 50%, #0D1117 100%)",
          }}
        >
          <div className="relative min-h-[280px] sm:min-h-[400px] lg:min-h-[460px] flex items-center p-6 sm:p-12 lg:p-16">
            {/* Background Visual */}
            <div className="absolute inset-0 z-0">
              <img
                src={HERO_SLIDES[activeSlide % HERO_SLIDES.length].image}
                alt="Banner"
                className="w-full h-full object-cover opacity-25 scale-105 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0D1117]/95 via-[#0D1117]/85 to-transparent" />
            </div>

            {/* Slide Content */}
            <div className="relative z-10 max-w-2xl space-y-4 text-right">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black backdrop-blur-md shadow-lg bg-[#FFE600]/20 border-[#FFE600] text-[#FFE600]">
                <Sparkles className="w-4 h-4 animate-pulse text-[#FFE600]" />
                <span>
                  {HERO_SLIDES[activeSlide % HERO_SLIDES.length].badge}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                {HERO_SLIDES[activeSlide % HERO_SLIDES.length].title}
              </h2>

              <p className="text-xs sm:text-base text-[#FEF9C3] leading-relaxed max-w-xl font-bold">
                {HERO_SLIDES[activeSlide % HERO_SLIDES.length].subtitle}
              </p>

              {/* Promo Code & Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <a
                  href="#catalog"
                  className="btn-phosphor px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg hover:scale-105 transition cursor-pointer"
                >
                  {HERO_SLIDES[activeSlide % HERO_SLIDES.length].primaryBtn}
                </a>

                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/40 border border-[#FFE600]/40 backdrop-blur-md text-xs">
                  <Tag className="w-4 h-4 text-[#FFE600]" />
                  <span className="text-[#FEF9C3] font-bold">كود الخصم:</span>
                  <span className="font-mono font-black text-[#FFE600] text-sm tracking-wider px-2 py-0.5 bg-[#FFE600]/20 border border-[#FFE600]/50 rounded-lg">
                    {HERO_SLIDES[activeSlide % HERO_SLIDES.length].coupon}
                  </span>
                </div>
              </div>
            </div>

            {/* Slider Dots */}
            <div className="absolute bottom-4 left-6 z-10 flex items-center gap-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    activeSlide === idx
                      ? "w-8 bg-[#FFE600]"
                      : "w-2.5 bg-[#1C1707]/30 hover:bg-[#1C1707]/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================= FLASH DEALS COUNTDOWN ================= */}
        {flashDeals.length > 0 && (
          <section
            id="flash-deals"
            className="p-6 sm:p-8 rounded-3xl border-2 border-[#FFE600] shadow-2xl shadow-[#FFE600]/15 relative overflow-hidden space-y-6 bg-[#1C1707]"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#382E0E] pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-[#2D250B] border border-[#382E0E] text-[#FFE600]">
                  <Flame className="w-6 h-6 animate-pulse text-[#FFE600]" />
                </div>
                <div>
                  <h3 className="font-black text-lg sm:text-xl text-white flex items-center gap-2">
                    <span>عروض الخصم السريعة (Flash Deals)</span>
                    <span className="px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold btn-phosphor">
                      خصومات حتى 50%
                    </span>
                  </h3>
                  <p className="text-xs text-[#9CA3AF] font-bold">
                    كميات محدودة بأسعار خاصة جداً تنتهي قريباً
                  </p>
                </div>
              </div>

              {/* Countdown Clocks */}
              <div className="flex items-center gap-2 text-xs font-mono font-bold">
                <span className="text-[#E2E8F0] font-sans ml-1 font-black">
                  ينتهي العرض خلال:
                </span>
                <div className="px-3 py-2 rounded-xl bg-[#1C1707] border border-[#382E0E] text-center min-w-[45px]">
                  <span className="text-base text-white font-black block">
                    {String(flashTimeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] text-[#9CA3AF] font-sans">
                    ساعة
                  </span>
                </div>
                <span className="text-[#FFE600] text-lg font-black">:</span>
                <div className="px-3 py-2 rounded-xl bg-[#1C1707] border border-[#382E0E] text-center min-w-[45px]">
                  <span className="text-base text-white font-black block">
                    {String(flashTimeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] text-[#9CA3AF] font-sans">
                    دقيقة
                  </span>
                </div>
                <span className="text-[#FFE600] text-lg font-black">:</span>
                <div className="px-3 py-2 rounded-xl border-2 border-[#FFE600] text-center min-w-[45px] bg-[#2D250B] text-white shadow-sm shadow-[#FFE600]/20">
                  <span className="text-base font-black block text-[#FFE600]">
                    {String(flashTimeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] text-[#9CA3AF] font-sans font-bold">
                    ثانية
                  </span>
                </div>
              </div>
            </div>

            {/* Flash Deals Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {flashDeals.map((prod) => {
                const savings = (prod.oldPrice || prod.price) - prod.price;
                const inCart = cart.some((c) => c.product.id === prod.id);
                return (
                  <div
                    key={prod.id}
                    className="p-4 rounded-3xl demo-card shadow-md flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Product Visual */}
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#1C1707] border border-[#382E0E]">
                        <Link
                          href={`/demo/store/${prod.id}`}
                          className="block w-full h-full"
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                        {prod.badge && (
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-xl text-white text-[11px] font-black shadow-md btn-phosphor pointer-events-none">
                            {prod.badge}
                          </span>
                        )}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                          <button
                            onClick={() => toggleWishlist(prod.id)}
                            className={`p-2 rounded-xl backdrop-blur-md transition shadow-sm ${
                              wishlist.includes(prod.id)
                                ? "bg-red-500 text-white"
                                : "bg-[#1C1707]/90 text-[#E2E8F0] hover:text-[#FFE600]"
                            }`}
                          >
                            <Heart className="w-4 h-4" />
                          </button>

                          {/* Price Alert Button */}
                          <button
                            onClick={() => setPriceAlertProduct(prod)}
                            className="p-2 rounded-xl bg-[#1C1707]/90 text-[#E2E8F0] hover:text-[#FFE600] backdrop-blur-md transition shadow-sm"
                            title="تنبيه انخفاض السعر"
                          >
                            <Bell className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Info */}
                      <div>
                        <span className="text-[11px] text-[#FFE600] font-black">
                          {prod.category}
                        </span>
                        <Link href={`/demo/store/${prod.id}`} className="block">
                          <h4 className="font-black text-sm text-white line-clamp-1 hover:text-[#FFE600] transition-colors mt-0.5">
                            {prod.name}
                          </h4>
                        </Link>
                        <p className="text-xs text-[#9CA3AF] line-clamp-2 mt-1 leading-relaxed font-medium">
                          {prod.description}
                        </p>
                      </div>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="pt-4 border-t border-[#382E0E] mt-4 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-black font-mono text-[#FFE600]">
                            {prod.price}
                          </span>
                          <span className="text-xs text-[#9CA3AF] font-bold">
                            {settings.currency}
                          </span>
                        </div>
                        {prod.oldPrice && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 line-through">
                            <span>
                              {prod.oldPrice} {settings.currency}
                            </span>
                            <span className="text-[#FFE600] font-black not-line-through">
                              وفر {savings} {settings.currency}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/demo/store/${prod.id}`}
                          className="px-3 py-2.5 rounded-xl text-xs font-bold bg-[#1C1707] hover:bg-[#2D250B] text-white border border-[#382E0E] transition"
                          title="تفاصيل المنتج"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => addToCart(prod)}
                          className={`px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer ${
                            inCart
                              ? "bg-[#FFE600] text-black font-black"
                              : "btn-phosphor"
                          }`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>{inCart ? "تمت الإضافة" : "إضافة"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ================= CATALOG SECTION ================= */}
        <section id="catalog" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#382E0E] pb-4">
            <div>
              <h3 className="font-black text-xl sm:text-2xl text-white">
                كتالوج المنتجات الحصرية
              </h3>
              <p className="text-xs text-[#9CA3AF] font-bold mt-1">
                تصفح كافة منتجات المتجر مع خيارات التصفية السريعة
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {categories.map((cat) => {
                const isCatActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-2xl text-xs transition whitespace-nowrap cursor-pointer shadow-sm ${
                      isCatActive
                        ? "btn-phosphor ring-2 ring-[#FFE600]"
                        : "font-bold"
                    }`}
                    style={
                      isCatActive
                        ? {}
                        : {
                            backgroundColor: "#1C1707",
                            color: "#E2E8F0",
                            border: "1px solid #382E0E",
                          }
                    }
                  >
                    {cat === "all" ? "جميع المنتجات" : cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-[#382E0E] space-y-3 bg-[#1C1707] shadow-sm">
              <Search className="w-10 h-10 text-[#FFE600] mx-auto" />
              <p className="font-black text-base text-white">
                لم يتم العثور على منتجات مطابقة للبحث
              </p>
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-xs font-black text-[#FFE600] hover:underline cursor-pointer"
              >
                إعادة ضبط التصفية وعرض كل المنتجات
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((prod) => {
                const inCart = cart.some((c) => c.product.id === prod.id);
                return (
                  <div
                    key={prod.id}
                    className="p-4 rounded-3xl demo-card shadow-md flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Product Visual */}
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#1C1707] border border-[#382E0E]">
                        <Link
                          href={`/demo/store/${prod.id}`}
                          className="block w-full h-full"
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                        {prod.badge && (
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-xl text-white text-[10px] font-black shadow-md btn-phosphor pointer-events-none">
                            {prod.badge}
                          </span>
                        )}

                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                          <button
                            onClick={() => toggleWishlist(prod.id)}
                            className={`p-2 rounded-xl backdrop-blur-md transition shadow-sm ${
                              wishlist.includes(prod.id)
                                ? "bg-red-500 text-white"
                                : "bg-[#1C1707]/90 text-[#E2E8F0] hover:text-[#FFE600]"
                            }`}
                          >
                            <Heart className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setQuickViewProduct(prod);
                              setQuickViewQty(1);
                            }}
                            className="p-2 rounded-xl bg-[#1C1707]/90 text-[#E2E8F0] hover:text-[#FFE600] backdrop-blur-md transition shadow-sm"
                            title="معاينة سريعة"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setPriceAlertProduct(prod)}
                            className="p-2 rounded-xl bg-[#1C1707]/90 text-[#E2E8F0] hover:text-[#FFE600] backdrop-blur-md transition shadow-sm"
                            title="تنبيه انخفاض السعر"
                          >
                            <Bell className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Product Data */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] font-bold">
                          <span className="text-[#FFE600] font-black">
                            {prod.category}
                          </span>
                          <span className="flex items-center gap-1 text-[#FFE600] font-bold">
                            <Star className="w-3 h-3 fill-current text-[#FFE600]" />
                            {prod.rating} ({prod.reviewsCount})
                          </span>
                        </div>

                        <Link href={`/demo/store/${prod.id}`} className="block">
                          <h4 className="font-black text-sm text-white line-clamp-1 mt-1 hover:text-[#FFE600] transition-colors">
                            {prod.name}
                          </h4>
                        </Link>

                        <p className="text-xs text-[#9CA3AF] line-clamp-2 mt-1 leading-relaxed font-medium">
                          {prod.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer / Price & Add */}
                    <div className="pt-4 border-t border-[#382E0E] mt-4 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-black font-mono text-[#FFE600]">
                            {prod.price}
                          </span>
                          <span className="text-xs text-[#9CA3AF] font-bold">
                            {settings.currency}
                          </span>
                        </div>
                        {prod.oldPrice && (
                          <span className="text-[10px] text-slate-400 line-through block">
                            {prod.oldPrice} {settings.currency}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/demo/store/${prod.id}`}
                          className="px-3 py-2.5 rounded-xl text-xs font-bold bg-[#1C1707] hover:bg-[#2D250B] text-white border border-[#382E0E] transition"
                          title="تفاصيل المنتج"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => addToCart(prod)}
                          className={`px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer ${
                            inCart
                              ? "bg-[#FFE600] text-black font-black"
                              : "btn-phosphor"
                          }`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>{inCart ? "في السلة" : "إضافة"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl border-2 border-[#FFE600] p-6 sm:p-8 space-y-6 shadow-2xl relative bg-[#1C1707] text-white">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-[#1C1707] hover:bg-[#2D250B] text-[#E2E8F0]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="aspect-square rounded-2xl overflow-hidden bg-[#1C1707] border border-[#382E0E]">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <span className="text-xs text-[#FFE600] font-black">
                  {quickViewProduct.category}
                </span>
                <h3 className="font-black text-lg sm:text-xl text-white leading-snug">
                  {quickViewProduct.name}
                </h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed font-medium">
                  {quickViewProduct.description}
                </p>

                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-2xl font-black font-mono text-[#FFE600]">
                    {quickViewProduct.price}
                  </span>
                  <span className="text-sm text-[#9CA3AF] font-bold">
                    {settings.currency}
                  </span>
                  {quickViewProduct.oldPrice && (
                    <span className="text-xs text-slate-400 line-through mr-2">
                      {quickViewProduct.oldPrice} {settings.currency}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <div className="flex items-center gap-2 bg-[#1C1707] p-1.5 rounded-xl border border-[#382E0E]">
                    <button
                      onClick={() =>
                        setQuickViewQty(Math.max(1, quickViewQty - 1))
                      }
                      className="p-1 rounded-lg hover:bg-[#2D250B] text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-sm text-white">
                      {quickViewQty}
                    </span>
                    <button
                      onClick={() => setQuickViewQty(quickViewQty + 1)}
                      className="p-1 rounded-lg hover:bg-[#2D250B] text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, quickViewQty);
                      setQuickViewProduct(null);
                    }}
                    className="btn-phosphor flex-1 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>إضافة للسلة</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Theme Customizer Button */}
      <button
        onClick={() => setIsCustomizerOpen(true)}
        className="btn-phosphor fixed bottom-6 left-6 z-40 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl cursor-pointer"
      >
        <Sliders className="w-4 h-4 text-black" />
        <span>تخصيص الثيم</span>
      </button>

      {/* Drawers, Modals & Popups */}
      <CartDrawer />
      <LiveThemeDrawer />
      <SocialProofPopup />
      <PWAInstallBanner />
      <PriceAlertModal
        product={priceAlertProduct}
        onClose={() => setPriceAlertProduct(null)}
      />

      {/* 3. Dedicated Store Footer */}
      <StoreFooter />
    </div>
  );
}

export default function DemoStorePage() {
  return (
    <StoreProvider>
      <StoreMainContent />
    </StoreProvider>
  );
}
