"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "@util/link";
import Image from "next/image";
import {
  ShoppingBag,
  ShoppingCart,
  ArrowUpRight,
  Sparkles,
  Check,
  ShieldCheck,
  Zap,
  CreditCard,
  MessageCircle,
  Lock,
  CheckCircle2,
  Star,
  Bot,
  Building2,
  Search,
  SlidersHorizontal,
  X,
  Plus,
  Minus,
  Trash2,
  Award,
  Eye,
  Flame,
  Server,
  PackageX,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useCart } from "@/components/store/CartContext";

export interface StoreProduct {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  category: "templates" | "realestate" | "payments" | "ai" | "hosting";
  categoryNameAr: string;
  categoryNameEn: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  ordersCount: number;
  badge?: string;
  badgeIcon?: any;
  badgeColor?: string;
  image: string;
  descriptionAr: string;
  descriptionEn: string;
  keyHighlightAr: string;
  keyHighlightEn: string;
  featuresAr: string[];
  featuresEn: string[];
  demoUrl?: string;
  deliveryTimeAr: string;
  deliveryTimeEn: string;
  isPopular?: boolean;
}

const parseProductArray = (value: unknown): string[] => {
  if (Array.isArray(value))
    return value.filter((item): item is string => typeof item === "string");
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
};

const SLUG_IMAGE_MAP: Record<string, string> = {
  "saudi-ecommerce-store-system": "/store/ecommerce.jpg",
  "saudi-ecommerce-store-template": "/store/ecommerce.jpg",
  "saudi-real-estate-platform": "/store/realestate.jpg",
  "saudi-real-estate-template": "/store/realestate.jpg",
  "influencer-marketing-platform": "/store/influencer.jpg",
  "digital-marketing-seo-course": "/store/seo.jpg",
};

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  templates: "/store/ecommerce.jpg",
  realestate: "/store/realestate.jpg",
  influencer: "/store/influencer.jpg",
  ai: "/store/ai-chatbot.jpg",
  payments: "/store/payments.jpg",
  hosting: "/store/hosting.png",
  seo: "/store/seo.jpg",
};

const normalizeApiProduct = (product: any): StoreProduct => {
  const featuresAr = parseProductArray(product.featuresAr);
  const featuresEn = parseProductArray(product.features);
  const categoryValue =
    `${product.category || ""} ${product.categoryAr || ""}`.toLowerCase();
  const category =
    categoryValue.includes("real") || categoryValue.includes("عقار")
      ? "realestate"
      : categoryValue.includes("pay") || categoryValue.includes("دفع")
        ? "payments"
        : categoryValue.includes("ai") || categoryValue.includes("ذك")
          ? "ai"
          : categoryValue.includes("host") || categoryValue.includes("استضاف")
            ? "hosting"
            : "templates";

  const rawImage = parseProductArray(product.images)[0];
  const image =
    SLUG_IMAGE_MAP[product.slug] ||
    (rawImage && !rawImage.includes("unsplash.com") ? rawImage : null) ||
    CATEGORY_IMAGE_MAP[category] ||
    "/store/ecommerce.jpg";

  return {
    id: product.id,
    slug:
      product.slug === "saudi-real-estate-template"
        ? "saudi-real-estate-platform"
        : product.slug,
    name: product.name,
    nameAr: product.nameAr || product.name,
    category,
    categoryNameAr: product.categoryAr || product.category || "الأنظمة الرقمية",
    categoryNameEn: product.category || "Digital Systems",
    price: Number(product.salePrice ?? product.price),
    originalPrice: Number(product.price),
    rating: Number(product.rating || 5),
    reviewsCount: Number(product._count?.reviews || 0),
    ordersCount: Number(product._count?.orderItems || 0),
    badge: product.featured ? "الأكثر طلباً" : undefined,
    badgeIcon: product.featured ? Flame : undefined,
    badgeColor: "from-[#FF4D6D] to-[#FF9A3C]",
    image,
    descriptionAr: product.descriptionAr || product.description || "",
    descriptionEn: product.description || product.descriptionAr || "",
    keyHighlightAr: featuresAr[0] || "حل رقمي متكامل لنشاطك التجاري",
    keyHighlightEn:
      featuresEn[0] || "Complete digital solution for your business",
    featuresAr,
    featuresEn,
    demoUrl: product.demoUrl || undefined,
    deliveryTimeAr: "تسليم وتشغيل فوري",
    deliveryTimeEn: "Instant setup and delivery",
    isPopular: Boolean(product.featured),
  };
};

export default function StorePage() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const { items, addItem, removeItem, updateQuantity, itemCount, subtotal } =
    useCart();
  const [products, setProducts] = useState<StoreProduct[]>([]);

  // State filters
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "popular" | "price-asc" | "price-desc" | "rating"
  >("popular");
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<StoreProduct | null>(
    null,
  );
  const [lastAddedProduct, setLastAddedProduct] = useState<StoreProduct | null>(
    null,
  );
  const [showAddedToast, setShowAddedToast] = useState<boolean>(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const res = await fetch("/api/store/products?status=published");
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        if (!active) return;
        if (
          data.success &&
          Array.isArray(data.products) &&
          data.products.length > 0
        ) {
          setProducts(data.products.map(normalizeApiProduct));
        } else {
          setProducts([]);
        }
      } catch {
        if (active) setProducts([]);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  // Categories list
  const categories = [
    {
      id: "all",
      nameAr: "جميع الأنظمة والحلول",
      nameEn: "All Systems",
      icon: Sparkles,
    },
    {
      id: "templates",
      nameAr: "قوالب المتاجر",
      nameEn: "Store Templates",
      icon: ShoppingBag,
    },
    {
      id: "realestate",
      nameAr: "الأنظمة العقارية",
      nameEn: "Real Estate",
      icon: Building2,
    },
    {
      id: "payments",
      nameAr: "بوابات الدفع",
      nameEn: "Payment Gateways",
      icon: CreditCard,
    },
    {
      id: "ai",
      nameAr: "الذكاء الاصطناعي",
      nameEn: "AI & Chatbots",
      icon: Bot,
    },
    {
      id: "hosting",
      nameAr: "الاستضافة والسيرفرات",
      nameEn: "Cloud Hosting",
      icon: Server,
    },
  ];

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (
          selectedCategory !== "all" &&
          product.category !== selectedCategory
        ) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName =
            product.nameAr.toLowerCase().includes(q) ||
            product.name.toLowerCase().includes(q);
          const matchesDesc =
            product.descriptionAr.toLowerCase().includes(q) ||
            product.descriptionEn.toLowerCase().includes(q);
          const matchesCategory =
            product.categoryNameAr.toLowerCase().includes(q) ||
            product.categoryNameEn.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesCategory) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "popular")
          return (b.ordersCount || 0) - (a.ordersCount || 0);
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Handle Add to Cart
  const handleAddToCart = (product: StoreProduct, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addItem(
      {
        productId: product.id,
        name: product.name,
        nameAr: product.nameAr,
        price: product.originalPrice,
        salePrice: product.price,
        image: product.image,
      },
      1,
    );

    setLastAddedProduct(product);
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 3500);
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"}>
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-[#FF4D6D]/15 via-[#FF9A3C]/10 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-[#FF4D6D]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] bg-[#FF9A3C]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top E-Commerce Promo Banner */}
      <div className="bg-gradient-to-r from-[#FF4D6D] via-[#FF6F4F] to-[#FF9A3C] text-white py-2.5 px-4 text-xs sm:text-sm font-bold shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-black/20 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold backdrop-blur-sm border border-white/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>عروض دي آرو الحصرية</span>
            </span>
            <span>
              {isAr
                ? "خصومات تصل إلى 50% على القوالب والأنظمة السحابية مع تشغيل فوري وبوابات دفع معتمدة"
                : "Up to 50% OFF on Turnkey Cloud Solutions & Templates + Instant Setup"}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-white" />{" "}
              {isAr ? "دفع آمن 100%" : "100% Secure Checkout"}
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-white" />{" "}
              {isAr ? "تسليم فوري للأكواد" : "Instant Delivery"}
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-white" />{" "}
              {isAr ? "تقسيط تابي وتمارا" : "Tabby & Tamara Ready"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10 pt-8">
        {/* E-Commerce Store Hero & Header */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-br from-[#12142B]/95 via-[#171A38]/90 to-[#0A0C1E]/95 border border-[#FF4D6D]/25 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF4D6D]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF9A3C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-2xl text-center lg:text-right relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FF4D6D]/15 to-[#FF9A3C]/15 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs sm:text-sm font-bold shadow-inner">
              <ShoppingBag className="w-4 h-4 text-[#FF9A3C]" />
              <span>
                {isAr
                  ? "متجر دي آرو للأنظمة الرقمية"
                  : "D-Arrow Software & Store Systems"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              {isAr ? (
                <>
                  اختر نظامك البرمجي،{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] via-[#FF6F4F] to-[#FF9A3C]">
                    أضفه للسلة
                  </span>{" "}
                  وانطلق فوراً
                </>
              ) : (
                <>
                  Select Your Software System,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] via-[#FF6F4F] to-[#FF9A3C]">
                    Add to Cart
                  </span>{" "}
                  & Launch
                </>
              )}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              {isAr
                ? "تسوّق قوالب المتاجر الإلكترونية الجاهزة، المنصات العقارية، أنظمة الربط المالي، بوتات الذكاء الاصطناعي والاستضافة السحابية فائقة السرعة."
                : "Shop ready-to-deploy e-commerce store templates, real estate portals, payment gateways, AI chatbots, and cloud infrastructure with instant delivery."}
            </p>

            {/* Quick Benefits Tags */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2 text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 shadow-sm">
                <CreditCard className="w-4 h-4 text-[#FF9A3C]" />{" "}
                {isAr ? "دفع مدى وأبل باي وفيزا" : "Mada & Apple Pay"}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#FF4D6D]" />{" "}
                {isAr
                  ? "تقسيط تابي وتمارا بدون فوائد"
                  : "Tabby & Tamara 0% Interest"}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 shadow-sm">
                <Zap className="w-4 h-4 text-[#FF9A3C]" />{" "}
                {isAr ? "تسليم فوري وضمان تشغيل" : "Instant Setup & SLA"}
              </span>
            </div>
          </div>

          {/* Top Hero Quick Cart Summary Widget */}
          <div className="w-full lg:w-80 bg-[#0B0D21]/95 border border-[#FF4D6D]/30 rounded-2xl p-5 space-y-4 shadow-xl relative z-10 flex-shrink-0 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#FF4D6D]" />
                <span className="font-bold text-sm text-white">
                  {isAr ? "سلة مشترياتك الحالية" : "Your Shopping Cart"}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF4D6D]/20 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs font-bold font-mono">
                {itemCount} {isAr ? "عناصر" : "Items"}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>{isAr ? "إجمالي المشتريات:" : "Subtotal:"}</span>
                <span className="font-bold text-white font-mono">
                  {subtotal.toFixed(2)} {isAr ? "ر.س" : "SAR"}
                </span>
              </div>
              <div className="flex justify-between text-xs text-[#FF9A3C]">
                <span>{isAr ? "التسليم والتفعيل:" : "Setup & Delivery:"}</span>
                <span className="font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3" />{" "}
                  {isAr ? "فوري ومجاني" : "Instant & Free"}
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D6D]/20 hover:opacity-95 active:scale-[0.98] transition cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>
                  {isAr ? "عرض السلة وإتمام الدفع" : "View Cart & Checkout"}
                </span>
              </button>

              <Link
                href="/store/checkout"
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/10 transition"
              >
                <CreditCard className="w-3.5 h-3.5 text-[#FF9A3C]" />
                <span>
                  {isAr ? "الدفع السريع المباشر" : "Direct Quick Checkout"}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </section>

        {/* Search & Categories Filter Bar */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#12142B]/90 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search
                className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none z-10 ${
                  isAr ? "right-3" : "left-3"
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isAr
                    ? "ابحث عن نظام، قالب، استضافة..."
                    : "Search system, template, hosting..."
                }
                style={{
                  backgroundColor: "#090B1B",
                  color: "#ffffff",
                  caretColor: "#FF9A3C",
                }}
                className={`w-full !bg-[#090B1B] !text-white border border-white/15 focus:border-[#FF4D6D] rounded-xl py-2.5 text-sm placeholder:!text-slate-500 focus:outline-none transition ${
                  isAr ? "!pr-10 !pl-10" : "!pl-10 !pr-10"
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-white z-10 ${
                    isAr ? "left-4" : "right-4"
                  } cursor-pointer`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results count & Sort */}
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              <span className="text-xs sm:text-sm text-slate-400">
                {isAr
                  ? `عرض ${filteredProducts.length} نظام برمجي`
                  : `Showing ${filteredProducts.length} systems`}
              </span>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#FF9A3C]" />
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  style={{
                    backgroundColor: "#090B1B",
                    color: "#e2e8f0",
                  }}
                  className={`!bg-[#090B1B] !text-slate-200 border border-white/15 text-xs sm:text-sm rounded-xl py-2 focus:outline-none focus:border-[#FF4D6D] cursor-pointer ${
                    isAr ? "pl-9 pr-3" : "pr-9 pl-3"
                  }`}
                >
                  <option
                    value="popular"
                    style={{ backgroundColor: "#090B1B", color: "#e2e8f0" }}
                  >
                    {isAr ? "الأكثر طلباً ومبيعاً" : "Most Popular"}
                  </option>
                  <option
                    value="rating"
                    style={{ backgroundColor: "#090B1B", color: "#e2e8f0" }}
                  >
                    {isAr ? "الأعلى تقييماً" : "Highest Rated"}
                  </option>
                  <option
                    value="price-asc"
                    style={{ backgroundColor: "#090B1B", color: "#e2e8f0" }}
                  >
                    {isAr ? "السعر: من الأقل للأعلى" : "Price: Low to High"}
                  </option>
                  <option
                    value="price-desc"
                    style={{ backgroundColor: "#090B1B", color: "#e2e8f0" }}
                  >
                    {isAr ? "السعر: من الأعلى للأقل" : "Price: High to Low"}
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white shadow-lg shadow-[#FF4D6D]/25 border border-transparent scale-102"
                      : "bg-[#12142B] text-slate-300 border border-white/10 hover:border-[#FF4D6D]/40 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#FF9A3C]" />
                  <span>{isAr ? cat.nameAr : cat.nameEn}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* E-Commerce Products Grid */}
        <section className="space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#12142B]/50 border border-white/10 rounded-3xl space-y-4">
              {products.length === 0 ? (
                <>
                  <PackageX className="w-16 h-16 text-slate-500 mx-auto" />
                  <h3 className="text-xl font-bold text-white">
                    {isAr
                      ? "لا توجد منتجات متاحة حالياً"
                      : "No products available"}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {isAr
                      ? "لم تتم إضافة أي منتجات بعد، يرجى العودة لاحقاً"
                      : "No products have been added yet, please check back later"}
                  </p>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-16 h-16 text-slate-500 mx-auto" />
                  <h3 className="text-xl font-bold text-white">
                    {isAr ? "لا توجد أنظمة مطابقة لبحثك" : "No systems found"}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {isAr
                      ? "جرب البحث بكلمات أخرى أو اختر قسماً مختلفاً"
                      : "Try searching with different keywords or choose another category"}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchQuery("");
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white text-sm font-bold cursor-pointer"
                  >
                    {isAr ? "عرض جميع الأنظمة" : "View All Systems"}
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 items-stretch">
              {filteredProducts.map((product) => {
                const savings = product.originalPrice - product.price;
                const installmentAmount = (product.price / 4).toFixed(2);
                const inCart = items.some((i) => i.productId === product.id);
                const BadgeIcon = product.badgeIcon || Flame;

                return (
                  <div
                    key={product.id}
                    className="bg-[#0D0F22] hover:bg-[#121530] border border-white/12 hover:border-[#FF4D6D]/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#FF4D6D]/20 transition-all duration-300 flex flex-col justify-between group relative backdrop-blur-md"
                  >
                    {/* Media Container */}
                    <Link
                      href={`/store/${product.slug}`}
                      className="relative aspect-[16/11] w-full overflow-hidden bg-slate-950 border-b border-white/10 block"
                    >
                      <Image
                        src={product.image}
                        alt=""
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (
                            target &&
                            target.src &&
                            !target.src.includes("/store/ecommerce.jpg")
                          ) {
                            target.src = "/store/ecommerce.jpg";
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F22] via-transparent to-black/40" />

                      {product.badge && (
                        <div
                          className={`absolute top-2.5 ${isAr ? "right-2.5" : "left-2.5"} px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${product.badgeColor || "from-[#FF4D6D] to-[#FF9A3C]"} shadow-md border border-white/20 flex items-center gap-1 backdrop-blur-md`}
                        >
                          <BadgeIcon className="w-3 h-3 text-white" />
                          <span>{product.badge}</span>
                        </div>
                      )}

                      <div
                        className={`absolute top-2.5 ${isAr ? "left-2.5" : "right-2.5"} px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-[#FF4D6D] text-white shadow-sm border border-white/20 font-mono`}
                      >
                        {isAr ? `وفر ${savings} ر.س` : `Save ${savings} SAR`}
                      </div>

                      {product.demoUrl && (
                        <div className="absolute bottom-2 left-2 right-2 py-1 px-2 rounded-lg bg-black/85 text-white text-[11px] font-semibold backdrop-blur-md border border-white/20 flex items-center justify-center gap-1">
                          <Eye className="w-3 h-3 text-[#FF9A3C]" />
                          <span>
                            {isAr
                              ? "معاينة حية وتفاصيل النظام ↗"
                              : "Live Demo & Specs ↗"}
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* Card Body */}
                    <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#FF9A3C]">
                            {isAr
                              ? product.categoryNameAr
                              : product.categoryNameEn}
                          </span>
                          <div className="flex items-center gap-1 text-amber-400 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{product.rating}</span>
                          </div>
                        </div>

                        <Link href={`/store/${product.slug}`} className="block">
                          <h3 className="font-extrabold text-white text-sm sm:text-base leading-snug group-hover:text-[#FF9A3C] transition-colors min-h-[2.8rem] flex items-center">
                            {isAr ? product.nameAr : product.name}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-[#FF4D6D] flex-shrink-0" />
                          <span className="truncate">
                            {isAr
                              ? product.keyHighlightAr
                              : product.keyHighlightEn}
                          </span>
                        </div>
                      </div>

                      {/* Pricing & Action Row */}
                      <div className="pt-3 border-t border-white/10 space-y-2.5">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] font-mono">
                              {product.price} {isAr ? "ر.س" : "SAR"}
                            </span>
                            <span className="text-xs text-slate-500 line-through font-mono">
                              {product.originalPrice}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 font-mono">
                            {isAr
                              ? `أقساط: ${installmentAmount} ر.س`
                              : `${installmentAmount}/mo`}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                              inCart
                                ? "bg-[#FF4D6D]/20 border border-[#FF4D6D] text-[#FF9A3C] hover:bg-[#FF4D6D]/30"
                                : "bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white hover:opacity-95 active:scale-[0.98] shadow-[#FF4D6D]/20"
                            }`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>
                              {inCart
                                ? isAr
                                  ? "بالسلة ✓"
                                  : "In Cart ✓"
                                : isAr
                                  ? "أضف للسلة"
                                  : "Add to Cart"}
                            </span>
                          </button>

                          <Link
                            href={`/store/${product.slug}`}
                            className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 font-bold text-xs flex items-center gap-1 transition"
                            title={
                              isAr ? "صفحة وتفاصيل المنتج" : "Product Details"
                            }
                          >
                            <span>{isAr ? "التفاصيل" : "Details"}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#FF9A3C]" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Trust & E-Commerce Guarantees Banner */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="bg-[#12142B]/80 border border-[#FF4D6D]/20 rounded-2xl p-5 space-y-2 backdrop-blur-md shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#FF4D6D]/20 border border-[#FF4D6D]/30 flex items-center justify-center text-[#FF4D6D]">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">
              {isAr ? "بوابات دفع سعودية معتمدة" : "Verified Saudi Payments"}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? "دعم كامل لمدى، أبل باي، فيزا، ماستركارد، وتقسيط تابي وتمارا بدون فوائد."
                : "Full support for Mada, Apple Pay, Tamara, Tabby with zero interest."}
            </p>
          </div>

          <div className="bg-[#12142B]/80 border border-[#FF9A3C]/20 rounded-2xl p-5 space-y-2 backdrop-blur-md shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#FF9A3C]/20 border border-[#FF9A3C]/30 flex items-center justify-center text-[#FF9A3C]">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">
              {isAr ? "تسليم وتشغيل فوري" : "Instant Setup & Delivery"}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? "استلام ملفات المصدر، تراخيص التشغيل، ودليل التثبيت والمساعدة الفنية المباشرة."
                : "Direct access to source files, licenses, deployment docs & support."}
            </p>
          </div>

          <div className="bg-[#12142B]/80 border border-[#FF4D6D]/20 rounded-2xl p-5 space-y-2 backdrop-blur-md shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#FF4D6D]/20 border border-[#FF4D6D]/30 flex items-center justify-center text-[#FF4D6D]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">
              {isAr
                ? "ضمان الجودة والدعم الفني"
                : "Quality SLA & Direct Support"}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? "فريق هندسي متخصص لمساعدتك في التخصيص والربط والتشغيل على سيرفراتك."
                : "Dedicated technical team to assist with custom setup and hosting."}
            </p>
          </div>

          <div className="bg-[#12142B]/80 border border-[#FF9A3C]/20 rounded-2xl p-5 space-y-2 backdrop-blur-md shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#FF9A3C]/20 border border-[#FF9A3C]/30 flex items-center justify-center text-[#FF9A3C]">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">
              {isAr ? "أمان وتشفير 256-bit" : "256-Bit Financial Encryption"}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? "معاملات مالية وبيانات محمية بأعلى معايير الأمن السيبراني المعتمدة."
                : "Bank-grade cybersecurity standards protecting all customer data."}
            </p>
          </div>
        </section>

        {/* Custom Solution & WhatsApp Inquiries */}
        <section className="bg-gradient-to-r from-[#141630] via-[#1A1D3D] to-[#141630] border border-[#FF4D6D]/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF4D6D]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF9A3C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF4D6D]/20 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs font-bold shadow-inner">
              <MessageCircle className="w-4 h-4 text-[#FF9A3C]" />
              <span>
                {isAr
                  ? "خدمة الاستشارات والتخصيص المباشرة"
                  : "Custom Builds & Enterprise Support"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              {isAr
                ? "هل تحتاج إلى نظام برمجي مخصص أو تعديل خاص لنشاطك التجاري؟"
                : "Need a Custom System or Tailored Software for Your Brand?"}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
              {isAr
                ? "مهندسونا ومستشارو دي آرو جاهزون لتخصيص القوالب، ربط الأنظمة المحاسبية والـ ERP، أو بناء متجر سحابي مخصص بالكامل لعلامتك التجارية."
                : "Our engineers are ready to customize templates, integrate ERP systems, or build tailored digital solutions for your business."}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href="https://wa.me/966500000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%88%D9%83%D8%A7%D9%84%D8%A9%20%D8%AF%D9%8A%20%D8%A2%D8%B1%D9%88%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%B7%D9%84%D8%A8%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D9%88%D8%AA%D8%AE%D8%B5%D9%8A%D8%B5%20%D9%86%D8%B8%D8%A7%D9%85%20%D9%85%D9%86%20%D8%A7%D9%84%D9%85%D8%AA%D8%AC%D8%B1"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white font-black text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-[#FF4D6D]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>
                  {isAr
                    ? "محادثة المستشار عبر الواتساب"
                    : "Chat with Specialist on WhatsApp"}
                </span>
              </a>

              <Link
                href="/contact"
                className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-bold text-sm sm:text-base border border-white/15 transition-all"
              >
                {isAr ? "طلب عرض سعر مفصل" : "Request Custom Quote"}
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Sticky Cart Button */}
      <div className={`fixed bottom-6 ${isAr ? "left-6" : "right-6"} z-40`}>
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white font-bold shadow-2xl shadow-[#FF4D6D]/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border border-white/20 cursor-pointer"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-white text-[#FF4D6D] font-extrabold text-[11px] flex items-center justify-center shadow font-mono">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-xs sm:text-sm font-extrabold">
            {isAr ? "السلة" : "Cart"}
          </span>
          {subtotal > 0 && (
            <span className="bg-black/25 px-2 py-0.5 rounded-lg text-xs font-mono font-bold">
              {subtotal.toFixed(0)} {isAr ? "ر.س" : "SAR"}
            </span>
          )}
        </button>
      </div>

      {/* Slide-out Side Cart Drawer */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setIsCartDrawerOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          <div
            className={`relative w-full max-w-md bg-[#0D0F24] border-l border-white/15 h-full flex flex-col justify-between shadow-2xl z-10 p-6 overflow-y-auto ${isAr ? "text-right" : "text-left"}`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className="w-5 h-5 text-[#FF4D6D]" />
                  <h3 className="text-lg font-bold text-white">
                    {isAr ? "سلة المشتريات" : "Shopping Cart"}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/30 text-xs font-bold font-mono">
                    {itemCount} {isAr ? "عناصر" : "Items"}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List */}
              {items.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto" />
                  <h4 className="text-base font-bold text-slate-300">
                    {isAr ? "سلة المشتريات فارغة" : "Your cart is empty"}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isAr
                      ? "تصفح باقة القوالب والأنظمة وأضف ما يناسب مشروعك"
                      : "Explore templates & systems to add items to your cart"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                  {items.map((item) => {
                    const unitPrice = item.salePrice || item.price;
                    return (
                      <div
                        key={item.productId}
                        className="bg-[#141630] border border-white/10 rounded-xl p-3.5 flex items-center gap-3.5"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt=""
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-[#FF4D6D]/10 flex items-center justify-center text-[#FF4D6D] flex-shrink-0">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-white text-xs sm:text-sm truncate">
                            {item.nameAr || item.name}
                          </h5>
                          <span className="text-xs font-black text-[#FF9A3C] font-mono">
                            {unitPrice} {isAr ? "ر.س" : "SAR"}
                          </span>

                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center bg-black/40 rounded-lg px-2 py-0.5 border border-white/10">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity - 1,
                                  )
                                }
                                className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-white px-2 font-mono">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity + 1,
                                  )
                                }
                                className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="text-red-400 hover:text-red-300 p-1 text-xs cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Drawer Footer & Checkout */}
            {items.length > 0 && (
              <div className="border-t border-white/10 pt-4 space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>{isAr ? "المجموع الفرعي:" : "Subtotal:"}</span>
                    <span className="font-bold text-white font-mono">
                      {subtotal.toFixed(2)} {isAr ? "ر.س" : "SAR"}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#FF9A3C]">
                    <span>{isAr ? "التسليم والتفعيل:" : "Deployment:"}</span>
                    <span className="font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3" />{" "}
                      {isAr ? "مجاني وسريع" : "Instant & Free"}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/10">
                    <span>{isAr ? "الإجمالي النهائي:" : "Total:"}</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] font-mono">
                      {subtotal.toFixed(2)} {isAr ? "ر.س" : "SAR"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/store/checkout"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D6D]/30 hover:opacity-95 active:scale-[0.98] transition cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>
                      {isAr
                        ? "متابعة الدفع الآمن (مدى / أبل باي)"
                        : "Proceed to Checkout (Mada / Apple Pay)"}
                    </span>
                  </Link>

                  <Link
                    href="/store/cart"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1 border border-white/10 transition"
                  >
                    <span>
                      {isAr ? "عرض صفحة السلة الكاملة" : "View Full Cart Page"}
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick View Product Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setQuickViewProduct(null)}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          <div
            className={`relative w-full max-w-2xl bg-[#0F1128] border border-[#FF4D6D]/30 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto ${isAr ? "text-right" : "text-left"}`}
          >
            <button
              onClick={() => setQuickViewProduct(null)}
              className={`absolute top-4 ${isAr ? "left-4" : "right-4"} p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
                <Image
                  src={quickViewProduct.image}
                  alt={isAr ? quickViewProduct.nameAr : quickViewProduct.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {quickViewProduct.badge && (
                  <span
                    className={`absolute top-3 ${isAr ? "right-3" : "left-3"} px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${quickViewProduct.badgeColor || "from-[#FF4D6D] to-[#FF9A3C]"} shadow-lg border border-white/20 flex items-center gap-1.5`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{quickViewProduct.badge}</span>
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#FF9A3C]">
                    {isAr
                      ? quickViewProduct.categoryNameAr
                      : quickViewProduct.categoryNameEn}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{quickViewProduct.rating}</span>
                    <span className="text-slate-400">
                      ({quickViewProduct.reviewsCount}{" "}
                      {isAr ? "تقييم" : "reviews"})
                    </span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {isAr ? quickViewProduct.nameAr : quickViewProduct.name}
                </h2>

                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] font-mono">
                    {quickViewProduct.price} {isAr ? "ر.س" : "SAR"}
                  </span>
                  <span className="text-sm text-slate-500 line-through font-mono">
                    {quickViewProduct.originalPrice} {isAr ? "ر.س" : "SAR"}
                  </span>
                  <span className="text-xs bg-[#FF4D6D]/20 text-[#FF4D6D] font-bold px-2.5 py-0.5 rounded-lg border border-[#FF4D6D]/30">
                    {isAr
                      ? `خصم ${(100 - (quickViewProduct.price / quickViewProduct.originalPrice) * 100).toFixed(0)}%`
                      : "Special Discount"}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-light">
                {isAr
                  ? quickViewProduct.descriptionAr
                  : quickViewProduct.descriptionEn}
              </p>

              <div className="space-y-2 bg-[#141630] border border-white/10 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#FF9A3C]" />
                  <span>
                    {isAr
                      ? "المميزات والخصائص المرفقة مع هذا النظام:"
                      : "Included Features & Capabilities:"}
                  </span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {(isAr
                    ? quickViewProduct.featuresAr
                    : quickViewProduct.featuresEn
                  ).map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4D6D] flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    handleAddToCart(quickViewProduct);
                    setQuickViewProduct(null);
                    setIsCartDrawerOpen(true);
                  }}
                  className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D6D]/30 hover:opacity-95 active:scale-[0.98] transition cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    {isAr
                      ? "إضافة للسلة وإتمام الشراء"
                      : "Add to Cart & Checkout"}
                  </span>
                </button>

                {quickViewProduct.demoUrl && (
                  <a
                    href={quickViewProduct.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 border border-white/15 transition cursor-pointer"
                  >
                    <span>{isAr ? "المعاينة المباشرة" : "Live Demo"}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Added to Cart Floating Toast */}
      {showAddedToast && lastAddedProduct && (
        <div
          className={`fixed top-24 ${isAr ? "left-6" : "right-6"} z-50 animate-bounce`}
        >
          <div className="bg-[#12142B] border border-[#FF4D6D]/50 rounded-2xl p-4 shadow-2xl flex items-center gap-3 text-white max-w-sm backdrop-blur-xl">
            <div className="w-10 h-10 rounded-xl bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/40 flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-xs truncate">
                {isAr ? lastAddedProduct.nameAr : lastAddedProduct.name}
              </h5>
              <p className="text-[11px] text-[#FF9A3C] font-semibold">
                {isAr
                  ? "تمت الإضافة إلى السلة بنجاح!"
                  : "Added to cart successfully!"}
              </p>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white text-[11px] font-extrabold whitespace-nowrap shadow-md cursor-pointer"
            >
              {isAr ? "عرض السلة" : "View Cart"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
