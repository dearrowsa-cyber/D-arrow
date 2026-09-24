"use client";

import { useState } from "react";
import Link from "@util/link";
import Image from "next/image";
import {
  ShoppingCart,
  Star,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  CreditCard,
  ExternalLink,
  Bot,
  Building2,
  Server,
  ShoppingBag,
  Clock,
  Code2,
  Layers,
  HelpCircle,
  MessageCircle,
  Flame,
  CheckCircle2,
  Minus,
  Plus,
  Share2,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useCart } from "@/components/store/CartContext";
import type { StoreProductDetail } from "@/features/store/data";

export default function StoreProductClient({
  product,
}: {
  product: StoreProductDetail;
}) {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const { addItem, items } = useCart();

  const [quantity, setQuantity] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  const inCart = items.some((i) => i.productId === product.id);
  const savings = product.originalPrice - product.price;
  const discountPct = Math.round((savings / product.originalPrice) * 100);
  const installmentAmount = (product.price / 4).toFixed(2);
  const BadgeIcon = Flame;
  const CategoryIcon =
    product.category === "realestate"
      ? Building2
      : product.category === "payments"
        ? CreditCard
        : product.category === "ai"
          ? Bot
          : product.category === "hosting"
            ? Server
            : ShoppingBag;

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        name: product.name,
        nameAr: product.nameAr,
        price: product.originalPrice,
        salePrice: product.price,
        image: product.image,
      },
      quantity,
    );

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3500);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#070913] text-white pt-24 pb-20 relative overflow-hidden"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-[#FF4D6D]/15 via-[#FF9A3C]/10 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-[#FF4D6D]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] bg-[#FF9A3C]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10 pt-4">
        {/* Top Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <Link
              href="/store"
              className="hover:text-[#FF9A3C] transition flex items-center gap-1.5 font-semibold"
            >
              {isAr ? (
                <ArrowRight className="w-4 h-4" />
              ) : (
                <ArrowLeft className="w-4 h-4" />
              )}
              <span>{isAr ? "العودة لمتجر الأنظمة" : "Back to Store"}</span>
            </Link>
            <span>/</span>
            <span className="text-[#FF4D6D] font-medium">
              {isAr ? product.categoryNameAr : product.categoryNameEn}
            </span>
            <span>/</span>
            <span className="text-white font-bold truncate max-w-[200px] sm:max-w-none">
              {isAr ? product.nameAr : product.name}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#FF9A3C]" />
            <span>
              {copiedLink
                ? isAr
                  ? "تم نسخ الرابط ✓"
                  : "Link Copied ✓"
                : isAr
                  ? "مشاركة الرابط"
                  : "Share Link"}
            </span>
          </button>
        </div>

        {/* Main Product Showcase: 2-Column High-End Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Visual Mockup & Live Demo Trigger */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#0B0D1F] border border-[#FF4D6D]/30 shadow-2xl shadow-[#FF4D6D]/15 group">
              <Image
                src={product.image}
                alt={isAr ? product.nameAr : product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                unoptimized
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070913]/90 via-transparent to-black/30" />

              {/* Badges on Visual */}
              {product.badge && (
                <div
                  className={`absolute top-4 ${isAr ? "right-4" : "left-4"} px-3.5 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] shadow-xl border border-white/20 flex items-center gap-1.5 backdrop-blur-md`}
                >
                  <BadgeIcon className="w-3.5 h-3.5 text-white" />
                  <span>{product.badge}</span>
                </div>
              )}

              <div
                className={`absolute top-4 ${isAr ? "left-4" : "right-4"} px-3 py-1 rounded-xl text-xs font-black bg-[#FF4D6D] text-white shadow-md border border-white/20 font-mono`}
              >
                {isAr
                  ? `وفر ${savings} ر.س (${discountPct}% خصم)`
                  : `Save ${savings} SAR (${discountPct}% OFF)`}
              </div>

              {/* Direct Live Demo Overlay Bar */}
              {product.demoUrl && (
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <a
                    href={product.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-2xl bg-black/85 hover:bg-black text-white text-sm font-extrabold backdrop-blur-xl border border-white/25 hover:border-[#FF4D6D] shadow-2xl flex items-center justify-center gap-2 transition-all group/btn cursor-pointer hover:scale-[1.02]"
                  >
                    <ExternalLink className="w-4 h-4 text-[#FF9A3C] group-hover/btn:rotate-12 transition-transform" />
                    <span>
                      {isAr
                        ? "معاينة القالب الحية التفاعلية (Live Demo ↗)"
                        : "Live Interactive Demo Preview ↗"}
                    </span>
                  </a>
                </div>
              )}
            </div>

            {/* Quick Guarantees Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-[#12142B]/80 border border-white/10 rounded-2xl p-3.5 text-center space-y-1">
                <Clock className="w-5 h-5 text-[#FF9A3C] mx-auto" />
                <h5 className="font-bold text-xs text-white">
                  {isAr ? "تسليم فوري" : "Instant Setup"}
                </h5>
                <p className="text-[11px] text-slate-400">
                  {isAr ? "أكواد المصدر خلال 24h" : "Code ready in 24h"}
                </p>
              </div>

              <div className="bg-[#12142B]/80 border border-white/10 rounded-2xl p-3.5 text-center space-y-1">
                <ShieldCheck className="w-5 h-5 text-[#FF4D6D] mx-auto" />
                <h5 className="font-bold text-xs text-white">
                  {isAr ? "ضمان وتشغيل" : "SLA Guarantee"}
                </h5>
                <p className="text-[11px] text-slate-400">
                  {isAr ? "دعم فني مباشر معتمد" : "Direct tech support"}
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-[#12142B]/80 border border-white/10 rounded-2xl p-3.5 text-center space-y-1">
                <CreditCard className="w-5 h-5 text-[#FF9A3C] mx-auto" />
                <h5 className="font-bold text-xs text-white">
                  {isAr ? "دفع آمن 100%" : "Secure Checkout"}
                </h5>
                <p className="text-[11px] text-slate-400">
                  {isAr ? "مدى وApple Pay وتابي" : "Mada & Tabby"}
                </p>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="bg-[#12142B]/60 border border-white/10 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#FF4D6D]" />
                <span>
                  {isAr
                    ? "التقنيات والمحركات المستخدمة:"
                    : "Technology Stack & Architecture:"}
                </span>
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {product.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono font-medium text-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing, Actions, Key Specs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs font-bold">
                  <CategoryIcon className="w-3.5 h-3.5 text-[#FF9A3C]" />
                  <span>
                    {isAr ? product.categoryNameAr : product.categoryNameEn}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-sm">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-white font-bold">{product.rating}</span>
                  <span className="text-slate-400 text-xs font-normal">
                    ({product.reviewsCount} {isAr ? "تقييم معتمد" : "reviews"})
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                {isAr ? product.nameAr : product.name}
              </h1>

              {/* Short Summary */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                {isAr ? product.summaryAr : product.summaryEn}
              </p>
            </div>

            {/* Price Card & Installments Box */}
            <div className="bg-[#12142B]/95 border border-[#FF4D6D]/30 rounded-3xl p-6 space-y-4 shadow-xl backdrop-blur-xl">
              <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">
                    {isAr ? "السعر النهائي للترخيص:" : "License Price:"}
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] font-mono">
                      {product.price} {isAr ? "ر.س" : "SAR"}
                    </span>
                    <span className="text-base text-slate-500 line-through font-mono">
                      {product.originalPrice} {isAr ? "ر.س" : "SAR"}
                    </span>
                  </div>
                </div>

                <div className="text-right sm:text-left">
                  <span className="inline-block px-3 py-1 rounded-xl bg-[#FF4D6D]/20 text-[#FF4D6D] text-xs font-extrabold border border-[#FF4D6D]/40 font-mono">
                    {isAr ? `خصم حصري لفترة محدودة` : `Limited Time Discount`}
                  </span>
                </div>
              </div>

              {/* Installment Widget (Tabby / Tamara) */}
              <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-2xl p-3.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#FF9A3C] flex-shrink-0" />
                  <span>
                    {isAr
                      ? `أو قسّمها على 4 دفعات شهرية بقيمة ${installmentAmount} ر.س بدون أي فوائد عبر تابي أو تمارا`
                      : `Or split in 4 interest-free payments of ${installmentAmount} SAR/mo via Tabby & Tamara`}
                  </span>
                </div>
              </div>

              {/* Quantity Selector & Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity Control */}
                  <div className="flex items-center bg-black/50 rounded-2xl p-1 border border-white/15 h-12">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-full rounded-xl hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-white font-mono text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-full rounded-xl hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 h-12 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                      inCart
                        ? "bg-[#FF4D6D]/25 border border-[#FF4D6D] text-[#FF9A3C] hover:bg-[#FF4D6D]/35"
                        : "bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white hover:opacity-95 active:scale-[0.98] shadow-[#FF4D6D]/30"
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>
                      {inCart
                        ? isAr
                          ? "مضاف بالسلة ✓ (إضافة المزيد +)"
                          : "In Cart ✓ (Add More +)"
                        : isAr
                          ? "إضافة إلى السلة"
                          : "Add to Cart"}
                    </span>
                  </button>
                </div>

                {/* Direct Buy Now Button */}
                <Link
                  href="/store/checkout"
                  onClick={() => {
                    if (!inCart) handleAddToCart();
                  }}
                  className="w-full h-12 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm flex items-center justify-center gap-2 border border-white/20 transition cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-[#FF9A3C]" />
                  <span>
                    {isAr
                      ? "شراء مباشر عبر الدفع السريع (مدى / Apple Pay)"
                      : "Direct Quick Checkout (Mada / Apple Pay)"}
                  </span>
                </Link>

                {/* Highly Prominent Live Interactive Demo Action */}
                {product.demoUrl && (
                  <a
                    href={product.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] hover:brightness-110 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/50 border border-emerald-400/50 transition-all cursor-pointer hover:scale-[1.02] group/demobtn"
                  >
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
                    </span>
                    <ExternalLink className="w-4 h-4 text-white group-hover/demobtn:rotate-12 transition-transform" />
                    <span>
                      {isAr
                        ? "⚡ تجربة النظام ومعاينته حياً الآن (Live Demo ↗)"
                        : "⚡ Experience Live Interactive Demo Now (Live Demo ↗)"}
                    </span>
                  </a>
                )}
              </div>
            </div>

            {/* Key Benefits Grid */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF9A3C]" />
                <span>
                  {isAr
                    ? "أبرز مميزات هذا النظام البرمجي:"
                    : "Key System Advantages:"}
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(isAr ? product.keyBenefitsAr : product.keyBenefitsEn).map(
                  (benefit, i) => (
                    <div
                      key={i}
                      className="bg-[#12142B]/70 border border-white/10 rounded-2xl p-3.5 space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] flex-shrink-0" />
                        <h5 className="font-bold text-xs text-white">
                          {benefit.title}
                        </h5>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Live Demo Spotlight Section */}
        {product.demoUrl && (
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#08151D] via-[#0E232F] to-[#08151D] border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl shadow-emerald-950/40">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 text-center md:text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                  </span>
                  <span>
                    {isAr
                      ? "البيئة التفاعلية الحية جاهزة للتجربة الفورية"
                      : "Live Interactive Demo Environment Ready"}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {isAr
                    ? "جرّب المتجر والنظام بنفسك قبل الشراء واستكشف كافة الوظائف"
                    : "Experience the Store Live Before Purchasing"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                  {isAr
                    ? "يمكنك تصفح واجهة المتجر الحية، إضافة المنتجات للسلة، وتجربة تدفق الدفع وسرعة التحميل وتصفح تجربة المستخدم الكاملة على الجوال والكمبيوتر."
                    : "Browse the live store, test the smart cart and checkout flow, and explore full responsive mobile & desktop UX."}
                </p>
              </div>

              <a
                href={product.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-base flex items-center gap-3 shadow-2xl shadow-emerald-900/50 border border-emerald-300/50 hover:scale-105 transition-all cursor-pointer group/cta"
              >
                <span>
                  {isAr
                    ? "فتح المعاينة التفاعلية الحية الآن (Live Demo) ↗"
                    : "Launch Live Interactive Demo ↗"}
                </span>
                <ExternalLink className="w-5 h-5 text-white group-hover/cta:rotate-12 transition-transform" />
              </a>
            </div>
          </section>
        )}

        {/* Detailed Description & Features Section */}
        <section className="bg-[#101229]/90 border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 backdrop-blur-xl">
          <div className="space-y-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs font-bold">
              <Layers className="w-3.5 h-3.5 text-[#FF9A3C]" />
              <span>
                {isAr
                  ? "الوصف الشامل والمواصفات الفنية"
                  : "Full Architecture & System Specifications"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isAr
                ? "عن هذا النظام وكيف يخدم مشروعك التجاري"
                : "System Overview & Commercial Capabilities"}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              {isAr ? product.descriptionAr : product.descriptionEn}
            </p>
          </div>

          {/* Included Features Checklist */}
          <div className="space-y-4 border-t border-white/10 pt-6">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Check className="w-5 h-5 text-[#FF4D6D]" />
              <span>
                {isAr
                  ? "قائمة الميزات والخصائص المضمنة مع الترخيص:"
                  : "Included Features & Technical Modules:"}
              </span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(isAr ? product.featuresAr : product.featuresEn).map(
                (feat, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-[#151736] border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-slate-200"
                  >
                    <div className="w-5 h-5 rounded-lg bg-[#FF4D6D]/20 text-[#FF4D6D] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="leading-snug">{feat}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="bg-[#12142B]/80 border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF9A3C]">
              <HelpCircle className="w-4 h-4" />
              <span>
                {isAr
                  ? "الأسئلة الشائعة حول هذا النظام"
                  : "Frequently Asked Questions"}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isAr
                ? "إجابات على أهم استفسارات العملاء"
                : "Common Questions & Answers"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(isAr ? product.faqsAr : product.faqsEn).map((faq, i) => (
              <div
                key={i}
                className="bg-[#0D0F22] border border-white/10 rounded-2xl p-5 space-y-2"
              >
                <h5 className="font-bold text-white text-sm flex items-center gap-2">
                  <span className="text-[#FF4D6D] font-mono">Q.</span>
                  <span>{faq.q}</span>
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed font-light pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* WhatsApp Custom Builds CTA */}
        <section className="bg-gradient-to-r from-[#141630] via-[#1A1D3D] to-[#141630] border border-[#FF4D6D]/30 rounded-3xl p-8 sm:p-10 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-xl sm:text-3xl font-extrabold text-white">
              {isAr
                ? "هل تحتاج إلى تخصيص معين أو ربط برمجي خاص؟"
                : "Need Tailored Customization or Integration Support?"}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
              {isAr
                ? "تواصل مباشرة مع المهندس المختص في دي آرو عبر الواتساب لتخصيص الواجهات والربط بالسيرفرات والأنظمة المحاسبية."
                : "Chat directly with our lead engineer on WhatsApp for custom modules, ERP integrations, and onboarding."}
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/966500000000?text=${encodeURIComponent(`مرحباً وكالة دي آرو، أود الاستفسار عن تفاصيل وتخصيص: ${product.nameAr}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white font-black text-sm shadow-xl shadow-[#FF4D6D]/30 hover:scale-105 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>
                  {isAr
                    ? "محادثة المهندس عبر الواتساب"
                    : "Chat with Specialist on WhatsApp"}
                </span>
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Added Toast Notification */}
      {addedToast && (
        <div
          className={`fixed top-24 ${isAr ? "left-6" : "right-6"} z-50 animate-bounce`}
        >
          <div className="bg-[#12142B] border border-[#FF4D6D]/50 rounded-2xl p-4 shadow-2xl flex items-center gap-3 text-white max-w-sm backdrop-blur-xl">
            <div className="w-10 h-10 rounded-xl bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/40 flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-xs truncate">
                {isAr ? product.nameAr : product.name}
              </h5>
              <p className="text-[11px] text-[#FF9A3C] font-semibold">
                {isAr
                  ? "تمت الإضافة إلى السلة بنجاح!"
                  : "Added to cart successfully!"}
              </p>
            </div>
            <Link
              href="/store/cart"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white text-[11px] font-extrabold whitespace-nowrap shadow-md"
            >
              {isAr ? "عرض السلة" : "View Cart"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
