"use client";

import React, { useState, useRef } from "react";
import Link from "@util/link";
import {
  StoreProvider,
  useStore,
  StoreProduct,
  ThemePreset,
} from "@/components/demo/store/StoreContext";
import { STORE_NICHES } from "@/components/demo/store/niches";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Palette,
  TrendingUp,
  DollarSign,
  Users,
  Plus,
  Trash2,
  Edit3,
  Check,
  Eye,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Sliders,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Search,
  Package,
  Layers,
  ArrowUpRight,
  Crown,
  Moon,
  Flame,
  FileText,
  Coffee,
  Compass,
  Upload,
  Image as ImageIcon,
  MessageSquare,
  Send,
  Download,
  Activity,
  Zap,
  Globe,
  Radio,
  FileSpreadsheet,
  X,
} from "lucide-react";
import "@/app/(main)/demo/store/demo-store.css";

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

function AdminDashboardContent() {
  const {
    settings,
    updateSettings,
    resetSettings,
    switchNiche,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    abandonedCarts,
    recoverAbandonedCart,
    marketingPixels,
    updateMarketingPixels,
    coupons,
    addCoupon,
    toggleCoupon,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "theme"
    | "products"
    | "orders"
    | "abandoned"
    | "pixels"
    | "coupons"
    | "seo"
  >("overview");

  // SEO & Search Engine Console States
  const [seoPreviewMode, setSeoPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const [activeSeoSubtab, setActiveSeoSubtab] = useState<
    "meta" | "schema" | "audit" | "sitemap"
  >("meta");
  const [newKeywordInput, setNewKeywordInput] = useState("");
  const [isPingingGoogle, setIsPingingGoogle] = useState(false);
  const [googlePingStatus, setGooglePingStatus] = useState<string | null>(null);

  // New Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("إلكترونيات");
  const [newProdPrice, setNewProdPrice] = useState(299);
  const [newProdOldPrice, setNewProdOldPrice] = useState<number | "">(499);
  const [newProdStock, setNewProdStock] = useState(10);
  const [newProdImage, setNewProdImage] = useState(
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  );
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdBadge, setNewProdBadge] = useState("جديد");
  const [newProdFeatures, setNewProdFeatures] = useState(
    "ضمان سعودي سنتين\nشحن سريع لكافة المدن",
  );
  const [newProdFlashDeal, setNewProdFlashDeal] = useState(false);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(
    null,
  );
  const [editProdName, setEditProdName] = useState("");
  const [editProdCategory, setEditProdCategory] = useState("إلكترونيات");
  const [editProdPrice, setEditProdPrice] = useState(0);
  const [editProdOldPrice, setEditProdOldPrice] = useState<number | "">("");
  const [editProdStock, setEditProdStock] = useState(0);
  const [editProdImage, setEditProdImage] = useState("");
  const [editProdDesc, setEditProdDesc] = useState("");
  const [editProdBadge, setEditProdBadge] = useState("");
  const [editProdFeatures, setEditProdFeatures] = useState("");
  const [editProdFlashDeal, setEditProdFlashDeal] = useState(false);

  // File input refs
  const addProdImgRef = useRef<HTMLInputElement>(null);
  const editProdImgRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // New Coupon Modal State
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);
  const [newCouponMinSpend, setNewCouponMinSpend] = useState(150);

  // Test Pixel Event State
  const [lastFiredEvent, setLastFiredEvent] = useState<string | null>(null);

  // Success Toast
  const [toastMsg, setToastMsg] = useState("");

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        updateSettings({ logoUrl: base64Url });
        triggerToast("تم رفع وتحديث لوجو المتجر بنجاح");
      }
      setIsUploadingLogo(false);
    };
    reader.onerror = () => {
      setIsUploadingLogo(false);
      triggerToast("حدث خطأ أثناء قراءة ملف الصورة");
    };
    reader.readAsDataURL(file);
  };

  const handleProductImageFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    mode: "add" | "edit",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      if (url) {
        if (mode === "add") setNewProdImage(url);
        if (mode === "edit") setEditProdImage(url);
        triggerToast("تم تحميل صورة المنتج بنجاح");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const feats = newProdFeatures
      ? newProdFeatures
          .split(/[\n،,]+/)
          .map((s) => s.trim())
          .filter(Boolean)
      : ["ضمان سعودي سنتين", "شحن سريع"];

    addProduct({
      name: newProdName,
      category: newProdCategory,
      price: Number(newProdPrice),
      oldPrice: newProdOldPrice ? Number(newProdOldPrice) : undefined,
      stock: Number(newProdStock),
      image: newProdImage,
      description: newProdDesc || newProdName,
      badge: newProdBadge || undefined,
      rating: 5.0,
      reviewsCount: 1,
      features: feats,
      isFlashDeal: newProdFlashDeal,
    });
    setIsAddProductOpen(false);
    setNewProdName("");
    triggerToast("تمت إضافة المنتج بنجاح");
  };

  const openEditModal = (prod: StoreProduct) => {
    setEditingProduct(prod);
    setEditProdName(prod.name);
    setEditProdCategory(prod.category);
    setEditProdPrice(prod.price);
    setEditProdOldPrice(prod.oldPrice || "");
    setEditProdStock(prod.stock);
    setEditProdImage(prod.image);
    setEditProdDesc(prod.description || "");
    setEditProdBadge(prod.badge || "");
    setEditProdFeatures(prod.features ? prod.features.join("\n") : "");
    setEditProdFlashDeal(Boolean(prod.isFlashDeal));
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editProdName) return;

    const feats = editProdFeatures
      ? editProdFeatures
          .split(/[\n،,]+/)
          .map((s) => s.trim())
          .filter(Boolean)
      : editingProduct.features || ["ضمان سعودي سنتين", "توصيل سريع"];

    updateProduct(editingProduct.id, {
      name: editProdName,
      category: editProdCategory,
      price: Number(editProdPrice),
      oldPrice: editProdOldPrice ? Number(editProdOldPrice) : undefined,
      stock: Number(editProdStock),
      image: editProdImage,
      description: editProdDesc,
      badge: editProdBadge || undefined,
      features: feats,
      isFlashDeal: editProdFlashDeal,
    });

    setEditingProduct(null);
    triggerToast("تم حفظ تعديلات المنتج بنجاح");
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    addCoupon({
      code: newCouponCode.toUpperCase(),
      discountPct: Number(newCouponDiscount),
      minSpend: Number(newCouponMinSpend),
      active: true,
    });
    setIsAddCouponOpen(false);
    setNewCouponCode("");
    triggerToast("تم إنشاء كوبون الخصم بنجاح");
  };

  const handleExportReport = () => {
    const rows = [
      [
        "رقم الطلب",
        "العميل",
        "المدينة",
        "المبلغ الإجمالي (ر.س)",
        "ضريبة القيمة المضافة 15%",
        "طريقة الدفع",
        "الحالة",
      ],
      ...orders.map((o) => [
        o.orderNumber,
        o.customerName,
        o.customerCity,
        o.total.toString(),
        Math.round(o.total * 0.15).toString(),
        o.paymentMethod.toUpperCase(),
        o.status,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `darrow_store_financial_report_${Date.now()}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("تم تصدير التقرير المالي والضريبي بنجاح");
  };

  const handleFirePixelTest = (eventName: string) => {
    setLastFiredEvent(eventName);
    triggerToast(
      `تم إرسال حدث ${eventName} بنجاح إلى (Snapchat, TikTok, Google, Meta)`,
    );
  };

  // Stats Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 14820;
  const totalOrdersCount = orders.length + 38;
  const averageOrderValue = Math.round(totalRevenue / totalOrdersCount);

  const THEME_PRESETS: PresetConfig[] = [
    {
      id: "neon-phosphor",
      nameAr: "الفسفوري العصري المنعش (الافتراضي)",
      nameEn: "Fresh Phosphor Mint (Default)",
      primary: "#CCFF00",
      accent: "#00F2FE",
      headerBg: "#FFFFFF",
      pageBg: "#F7FEE7",
      cardBg: "#FFFFFF",
      footerBg: "#ECFCCB",
      icon: Zap,
    },
    {
      id: "emerald-royal",
      nameAr: "الأخضر الملكي السعودي",
      nameEn: "Saudi Royal Emerald",
      primary: "#10B981",
      accent: "#06B6D4",
      headerBg: "#FFFFFF",
      pageBg: "#F7FEE7",
      cardBg: "#FFFFFF",
      footerBg: "#ECFCCB",
      icon: Crown,
    },
    {
      id: "luxury-rose",
      nameAr: "الوردي الفاخر",
      nameEn: "Luxury Rose",
      primary: "#F43F5E",
      accent: "#EC4899",
      headerBg: "#FFFFFF",
      pageBg: "#FFF1F2",
      cardBg: "#FFFFFF",
      footerBg: "#FFE4E6",
      icon: Moon,
    },
    {
      id: "gold-vip",
      nameAr: "الذهب والعود الفاخر",
      nameEn: "Imperial Gold VIP",
      primary: "#F59E0B",
      accent: "#D97706",
      headerBg: "#FFFFFF",
      pageBg: "#FFFBEB",
      cardBg: "#FFFFFF",
      footerBg: "#FEF3C7",
      icon: Sparkles,
    },
    {
      id: "modern-purple",
      nameAr: "البنفسجي العصري الحديث",
      nameEn: "Cyber Violet Neon",
      primary: "#8B5CF6",
      accent: "#EC4899",
      headerBg: "#FFFFFF",
      pageBg: "#F5F3FF",
      cardBg: "#FFFFFF",
      footerBg: "#EDE9FE",
      icon: Flame,
    },
    {
      id: "midnight-blue",
      nameAr: "أزرق المحيط الليلي",
      nameEn: "Midnight Ocean Blue",
      primary: "#38BDF8",
      accent: "#0284C7",
      headerBg: "#FFFFFF",
      pageBg: "#F0F9FF",
      cardBg: "#FFFFFF",
      footerBg: "#E0F2FE",
      icon: Compass,
    },
    {
      id: "espresso-amber",
      nameAr: "القهوة والعنبر الدافئ",
      nameEn: "Warm Espresso Amber",
      primary: "#D97706",
      accent: "#B45309",
      headerBg: "#FFFFFF",
      pageBg: "#FFFBEB",
      cardBg: "#FFFFFF",
      footerBg: "#FEF3C7",
      icon: Coffee,
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#070914] text-white flex flex-col font-sans demo-store-root"
      dir="rtl"
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-2xl animate-in slide-in-from-top-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <header className="bg-[#0B0E24] border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-[1550px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20 gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})`,
                }}
              >
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-white">
                    لوحة تحكم التاجر — {settings.storeName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    Live Demo Admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  إدارة الهوية والمنتجات والطلبات والتسويق والإعلانات
                </p>
              </div>
            </div>

            {/* Quick Actions & Live Store Link */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/demo/store/track"
                target="_blank"
                className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>تتبع الشحنات</span>
              </Link>

              <Link
                href="/demo/store"
                target="_blank"
                className="px-3.5 py-2 rounded-xl text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg hover:opacity-90 transition"
                style={{
                  background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})`,
                }}
              >
                <Eye className="w-4 h-4" />
                <span>عرض المتجر الحي ↗</span>
              </Link>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2.5 text-xs font-bold border-t border-white/5 no-scrollbar">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-2.5 sm:px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeTab === "overview"
                  ? "bg-white/15 text-white shadow-sm border border-white/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <TrendingUp className="w-4 h-4 text-[#FF9A3C] flex-shrink-0" />
              <span className="hidden sm:inline">نظرة عامة</span>
            </button>

            <button
              onClick={() => setActiveTab("theme")}
              className={`px-2.5 sm:px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeTab === "theme"
                  ? "bg-white/15 text-white shadow-sm border border-white/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Palette
                className="w-4 h-4 flex-shrink-0"
                style={{ color: settings.primaryColor }}
              />
              <span className="hidden sm:inline">الثيم</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`px-2.5 sm:px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeTab === "products"
                  ? "bg-white/15 text-white shadow-sm border border-white/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-[#FF9A3C] flex-shrink-0" />
              <span className="hidden sm:inline">
                المنتجات ({products.length})
              </span>
              <span className="sm:hidden text-[10px]">({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`px-2.5 sm:px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeTab === "orders"
                  ? "bg-white/15 text-white shadow-sm border border-white/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="hidden sm:inline">
                الطلبات ({orders.length})
              </span>
              <span className="sm:hidden text-[10px]">({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("abandoned")}
              className={`px-2.5 sm:px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeTab === "abandoned"
                  ? "bg-white/15 text-white shadow-sm border border-white/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Send className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="hidden sm:inline">سلات متروكة</span>
            </button>

            <button
              onClick={() => setActiveTab("pixels")}
              className={`px-2.5 sm:px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeTab === "pixels"
                  ? "bg-white/15 text-white shadow-sm border border-white/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Activity className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span className="hidden sm:inline">بكسل</span>
            </button>

            <button
              onClick={() => setActiveTab("coupons")}
              className={`px-2.5 sm:px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeTab === "coupons"
                  ? "bg-white/15 text-white shadow-sm border border-white/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Tag className="w-4 h-4 text-[#FF4D6D] flex-shrink-0" />
              <span className="hidden sm:inline">
                كوبونات ({coupons.length})
              </span>
              <span className="sm:hidden text-[10px]">({coupons.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("seo")}
              className={`px-2.5 sm:px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeTab === "seo"
                  ? "bg-[#FFE600]/20 text-[#FFE600] shadow-sm border border-[#FFE600]/40 font-black"
                  : "text-slate-400 hover:text-[#FFE600] hover:bg-white/5"
              }`}
            >
              <Search className="w-4 h-4 text-[#FFE600] flex-shrink-0" />
              <span className="hidden sm:inline">السيو ومحرك البحث (SEO)</span>
              <span className="sm:hidden text-[10px]">SEO</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1550px] w-full mx-auto px-3 sm:px-8 lg:px-12 py-4 sm:py-8 space-y-6 sm:space-y-10">
        {/* =================== TAB 1: OVERVIEW & EXPORTS =================== */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in">
            {/* Header with Export Action */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-lg sm:text-xl font-extrabold text-white block">
                  لوحة المؤشرات والتقارير المالية
                </span>
                <p className="text-xs text-slate-400">
                  إحصائيات المبيعات ومتوسط السلة والضرائب (ZATCA VAT 15%)
                </p>
              </div>

              <button
                onClick={handleExportReport}
                className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>تصدير التقرير المالي والضريبي (Excel / CSV)</span>
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-6 rounded-3xl bg-[#10132E] border border-white/10 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>إجمالي المبيعات</span>
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {totalRevenue.toLocaleString()}{" "}
                  <span className="text-xs text-[#FF9A3C] font-normal">
                    {settings.currency}
                  </span>
                </div>
                <span className="text-xs text-emerald-400 font-bold block">
                  +24.8% مقارنة بالشهر الماضي
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-[#10132E] border border-white/10 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>إجمالي الطلبات</span>
                  <div className="p-2 rounded-xl bg-[#FF4D6D]/15 text-[#FF4D6D]">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {totalOrdersCount}{" "}
                  <span className="text-xs text-slate-400 font-normal">
                    طلب
                  </span>
                </div>
                <span className="text-xs text-emerald-400 font-bold block">
                  معدل تحويل مرتفع 3.8%
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-[#10132E] border border-white/10 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>متوسط قيمة السلة (AOV)</span>
                  <div className="p-2 rounded-xl bg-[#FF9A3C]/15 text-[#FF9A3C]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {averageOrderValue}{" "}
                  <span className="text-xs text-[#FF9A3C] font-normal">
                    {settings.currency}
                  </span>
                </div>
                <span className="text-xs text-slate-400 block">
                  بفضل تقسيط تمارا وتابي
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-[#10132E] border border-white/10 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>المنتجات النشطة</span>
                  <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {products.length}{" "}
                  <span className="text-xs text-slate-400 font-normal">
                    منتج
                  </span>
                </div>
                <span className="text-xs text-emerald-400 font-bold block">
                  المخزون متوفر ومحدث
                </span>
              </div>
            </div>

            {/* Sales by Payment Method & Top Cities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Methods Breakdown */}
              <div className="p-6 rounded-3xl bg-[#10132E] border border-white/10 space-y-4">
                <span className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2 block">
                  <Sparkles className="w-4 h-4 text-[#FF9A3C]" />
                  <span>توزيع المبيعات حسب بوابات الدفع:</span>
                </span>

                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>مدى Mada (الدفع الوطني)</span>
                      <span className="text-emerald-400 font-mono">
                        45% (8,420 {settings.currency})
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: "45%" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Apple Pay (الدفع السريع بلمسة واحدة)</span>
                      <span className="text-[#FF9A3C] font-mono">
                        35% (6,550 {settings.currency})
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-[#FF9A3C] rounded-full"
                        style={{ width: "35%" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>تقسيط تمارا وتابي (بدون فوائد)</span>
                      <span className="text-[#FF4D6D] font-mono">
                        15% (2,810 {settings.currency})
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-[#FF4D6D] rounded-full"
                        style={{ width: "15%" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>البطاقات الائتمانية (Visa / MasterCard)</span>
                      <span className="text-purple-400 font-mono">
                        5% (940 {settings.currency})
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: "5%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Sales Cities */}
              <div className="p-6 rounded-3xl bg-[#10132E] border border-white/10 space-y-4">
                <span className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2 block">
                  <Truck className="w-4 h-4 text-[#FF4D6D]" />
                  <span>المدن الأكثر طلباً في المملكة:</span>
                </span>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#FF4D6D]/20 text-[#FF4D6D] flex items-center justify-center font-bold text-xs">
                        1
                      </span>
                      <span className="font-bold text-sm">الرياض</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      52% من إجمالي الطلبات
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#FF9A3C]/20 text-[#FF9A3C] flex items-center justify-center font-bold text-xs">
                        2
                      </span>
                      <span className="font-bold text-sm">
                        جدة ومكة المكرمة
                      </span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      28% من إجمالي الطلبات
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                        3
                      </span>
                      <span className="font-bold text-sm">
                        المنطقة الشرقية (الدمام والخبر)
                      </span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      14% من إجمالي الطلبات
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================== TAB 2: THEME & MULTI-NICHE STUDIO =================== */}
        {activeTab === "theme" && (
          <div className="space-y-8 animate-in fade-in max-w-6xl">
            {/* 1. Multi-Niche 1-Click Generator with Rich Images */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#10132E] border border-white/10 space-y-6">
              <div>
                <span className="text-lg sm:text-2xl font-black text-white flex items-center gap-2 block">
                  <Layers className="w-6 h-6 text-emerald-400" />
                  <span>
                    مولد المتاجر متعدد الأنشطة بنقرة واحدة (1-Click Multi-Niche
                    Switcher)
                  </span>
                </span>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                  اختر نشاطك التجاري ليتم استبدال كامل المنتجات، الصور، الألوان،
                  النصوص والبنرات تلقائياً وفوراً
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                {Object.values(STORE_NICHES).map((niche) => {
                  const isCurrent = settings.currentNiche === niche.id;
                  return (
                    <div
                      key={niche.id}
                      className={`rounded-3xl border overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-2xl ${
                        isCurrent
                          ? "bg-[#151A3F] border-emerald-500 ring-2 ring-emerald-500/40"
                          : "bg-[#121530] border-white/10 hover:border-white/25"
                      }`}
                    >
                      {/* Visual Cover Photo */}
                      <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                        <img
                          src={niche.coverImage}
                          alt={niche.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121530] via-black/40 to-transparent" />
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-emerald-400 text-xs font-black border border-white/15 shadow-lg">
                          {niche.badge}
                        </span>
                        {isCurrent && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-emerald-500 text-white text-[11px] font-black shadow-lg flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>مفعّل</span>
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <h4 className="text-base font-black text-white">
                            {niche.name}
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed font-normal">
                            {niche.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            switchNiche(niche.id);
                            triggerToast(
                              `تم تحويل المتجر بالكامل إلى: ${niche.name} بنجاح`,
                            );
                          }}
                          style={
                            isCurrent
                              ? {
                                  background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})`,
                                }
                              : {}
                          }
                          className={`w-full py-2.5 rounded-xl font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md mt-4 ${
                            isCurrent
                              ? "text-white shadow-lg"
                              : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                          }`}
                        >
                          <span>
                            {isCurrent
                              ? "النشاط المفعّل حالياً"
                              : "تطبيق هذا النشاط فوراً"}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Granular Theme Studio */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#10132E] border border-white/10 space-y-6">
              <div>
                <span className="text-lg sm:text-2xl font-black text-white flex items-center gap-2 block">
                  <Palette
                    className="w-6 h-6"
                    style={{ color: settings.primaryColor }}
                  />
                  <span>استوديو تخصيص هوية وثيم وألوان المتجر</span>
                </span>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                  تحكم كامل في ألوان الهيدر، الخلفيات، الكروت، الفوتر، والشعار
                  ونصوص المتجر
                </p>
              </div>

              {/* Theme Presets */}
              <div className="space-y-3 pt-2">
                <label className="text-xs sm:text-sm font-bold text-slate-200 block">
                  اختر ثيماً ونظام ألوان متكامل جاهز:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {THEME_PRESETS.map((preset) => {
                    const isSelected = settings.themePreset === preset.id;
                    const Icon = preset.icon;
                    return (
                      <button
                        key={preset.id}
                        type="button"
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
                          triggerToast(`تم تطبيق ثيم: ${preset.nameAr}`);
                        }}
                        className={`p-4 rounded-2xl border text-right transition flex items-center justify-between cursor-pointer !bg-[#131632] hover:!bg-[#191D42] ${
                          isSelected
                            ? "!border-emerald-500 ring-2 ring-emerald-500/30 shadow-xl"
                            : "!border-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${preset.primary}, ${preset.accent})`,
                            }}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-black text-sm text-white truncate">
                              {preset.nameAr}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {preset.nameEn}
                            </p>
                            <div className="flex items-center gap-1.5 mt-2">
                              <span
                                className="w-3 h-3 rounded-full border border-white/20"
                                style={{ backgroundColor: preset.headerBg }}
                                title="الهيدر"
                              />
                              <span
                                className="w-3 h-3 rounded-full border border-white/20"
                                style={{ backgroundColor: preset.pageBg }}
                                title="الخلفية"
                              />
                              <span
                                className="w-3 h-3 rounded-full border border-white/20"
                                style={{ backgroundColor: preset.primary }}
                                title="اللون الأساسي"
                              />
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Granular Color Pickers */}
              <div className="p-5 rounded-2xl bg-[#141738] border border-white/10 space-y-4">
                <span className="font-bold text-xs text-slate-200 block">
                  تخصيص درجات ألوان الواجهة بدقة:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300 font-bold block mb-1">
                      لون خلفية الهيدر (Header BG)
                    </label>
                    <div className="flex items-center gap-2 bg-[#1B1F47] p-2.5 rounded-xl border border-white/15">
                      <input
                        type="color"
                        value={settings.headerBgColor || "#0A0C1E"}
                        onChange={(e) =>
                          updateSettings({ headerBgColor: e.target.value })
                        }
                        className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="font-mono text-xs font-bold text-white">
                        {settings.headerBgColor || "#0A0C1E"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-bold block mb-1">
                      لون خلفية الصفحة (Page BG)
                    </label>
                    <div className="flex items-center gap-2 bg-[#1B1F47] p-2.5 rounded-xl border border-white/15">
                      <input
                        type="color"
                        value={settings.pageBgColor || "#070914"}
                        onChange={(e) =>
                          updateSettings({ pageBgColor: e.target.value })
                        }
                        className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="font-mono text-xs font-bold text-white">
                        {settings.pageBgColor || "#070914"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-bold block mb-1">
                      لون خلفية الكروت (Cards BG)
                    </label>
                    <div className="flex items-center gap-2 bg-[#1B1F47] p-2.5 rounded-xl border border-white/15">
                      <input
                        type="color"
                        value={settings.cardBgColor || "#10132E"}
                        onChange={(e) =>
                          updateSettings({ cardBgColor: e.target.value })
                        }
                        className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="font-mono text-xs font-bold text-white">
                        {settings.cardBgColor || "#10132E"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-bold block mb-1">
                      لون خلفية الفوتر (Footer BG)
                    </label>
                    <div className="flex items-center gap-2 bg-[#1B1F47] p-2.5 rounded-xl border border-white/15">
                      <input
                        type="color"
                        value={settings.footerBgColor || "#050714"}
                        onChange={(e) =>
                          updateSettings({ footerBgColor: e.target.value })
                        }
                        className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="font-mono text-xs font-bold text-white">
                        {settings.footerBgColor || "#050714"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-bold block mb-1">
                      اللون الأساسي (Primary Color)
                    </label>
                    <div className="flex items-center gap-2 bg-[#1B1F47] p-2.5 rounded-xl border border-white/15">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) =>
                          updateSettings({ primaryColor: e.target.value })
                        }
                        className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="font-mono text-xs font-bold text-white">
                        {settings.primaryColor}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-bold block mb-1">
                      اللون الثانوي (Accent Color)
                    </label>
                    <div className="flex items-center gap-2 bg-[#1B1F47] p-2.5 rounded-xl border border-white/15">
                      <input
                        type="color"
                        value={settings.accentColor}
                        onChange={(e) =>
                          updateSettings({ accentColor: e.target.value })
                        }
                        className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="font-mono text-xs font-bold text-white">
                        {settings.accentColor}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo Upload Card */}
              <div className="space-y-4 pt-2">
                <span className="font-bold text-xs sm:text-sm text-white flex items-center gap-2 block">
                  <ImageIcon className="w-4 h-4 text-[#FF9A3C]" />
                  <span>لوجو وهوية المتجر:</span>
                </span>

                <div className="p-4 rounded-2xl bg-[#141738] border border-white/15 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-black/40 border border-white/15 p-2 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                    {settings.logoUrl ? (
                      <img
                        src={settings.logoUrl}
                        alt="Store Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-slate-500 font-bold">
                        بدون لوجو
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-right">
                    <p className="text-xs font-bold text-white">
                      رفع صورة الشعار (Upload Logo)
                    </p>
                    <p className="text-[11px] text-slate-400">
                      يدعم صيغ PNG, JPG, WebP, SVG مع خلفية شفافة
                    </p>

                    <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                      <input
                        type="file"
                        ref={logoInputRef}
                        onChange={handleLogoUpload}
                        accept="image/*"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        disabled={isUploadingLogo}
                        style={{
                          background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})`,
                        }}
                        className="px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:opacity-90 transition cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {isUploadingLogo
                            ? "جاري الرفع..."
                            : "اختيار صورة من جهازك"}
                        </span>
                      </button>

                      {settings.logoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            updateSettings({ logoUrl: "" });
                            triggerToast("تمت إزالة الشعار");
                          }}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-bold transition"
                        >
                          إزالة الشعار
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    اسم المتجر
                  </label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) =>
                      updateSettings({ storeName: e.target.value })
                    }
                    className="w-full !bg-[#141738] !text-white border !border-white/20 focus:!border-[#FF4D6D] rounded-xl px-4 py-2.5 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    الشعار اللفظي للمتجر (Slogan)
                  </label>
                  <input
                    type="text"
                    value={settings.storeSlogan}
                    onChange={(e) =>
                      updateSettings({ storeSlogan: e.target.value })
                    }
                    className="w-full !bg-[#141738] !text-white border !border-white/20 focus:!border-[#FF4D6D] rounded-xl px-4 py-2.5 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    نص شريط الإعلانات الترويجي العلوي
                  </label>
                  <textarea
                    value={settings.announcementText}
                    onChange={(e) =>
                      updateSettings({ announcementText: e.target.value })
                    }
                    rows={2}
                    className="w-full !bg-[#141738] !text-white border !border-white/20 focus:!border-[#FF4D6D] rounded-xl p-3 text-xs"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/10 flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    triggerToast(
                      "تم حفظ وتطبيق كافة إعدادات الهوية والألوان بنجاح",
                    )
                  }
                  style={{
                    background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})`,
                  }}
                  className="px-6 py-3 rounded-xl text-white font-black text-xs shadow-lg hover:opacity-90 transition cursor-pointer"
                >
                  حفظ وتطبيق التغييرات
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetSettings();
                    triggerToast("تمت استعادة الإعدادات الافتراضية");
                  }}
                  className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  إعادة ضبط
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================== TAB 3: PRODUCTS =================== */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-lg sm:text-xl font-extrabold text-white block">
                  إدارة المنتجات والمخزون
                </span>
                <p className="text-xs text-slate-400">
                  إضافة وتعديل وحذف ورفع صور المنتجات مباشرة من جهاز الكمبيوتر
                </p>
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="btn-phosphor px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-lg transition cursor-pointer"
              >
                <Plus className="w-4 h-4 text-black" />
                <span>إضافة منتج جديد</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-[#1C1707] border border-[#382E0E] rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#161205] text-[#FFE600] font-black border-b border-[#382E0E]">
                    <tr>
                      <th className="p-4">المنتج</th>
                      <th className="p-4">القسم</th>
                      <th className="p-4">السعر</th>
                      <th className="p-4">قبل الخصم</th>
                      <th className="p-4">المخزون</th>
                      <th className="p-4">الوسم</th>
                      <th className="p-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#382E0E] text-slate-200">
                    {products.map((prod) => (
                      <tr
                        key={prod.id}
                        className="hover:bg-[#241D09] transition"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#161205] border border-[#382E0E] flex-shrink-0">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-white max-w-xs truncate">
                                {prod.name}
                              </span>
                              <Link
                                href={`/demo/store/${prod.id}`}
                                target="_blank"
                                className="text-[10px] text-[#FFE600] hover:underline inline-flex items-center gap-1 mt-0.5"
                              >
                                <span>معاينة صفحة المنتج</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-[#D1D5DB]">
                          {prod.category}
                        </td>
                        <td className="p-4 font-black font-mono text-[#FFE600] text-sm">
                          {prod.price} {settings.currency}
                        </td>
                        <td className="p-4 font-mono text-slate-500 line-through">
                          {prod.oldPrice
                            ? `${prod.oldPrice} ${settings.currency}`
                            : "-"}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${prod.stock < 10 ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"}`}
                          >
                            {prod.stock} متوفرة
                          </span>
                        </td>
                        <td className="p-4">
                          {prod.badge && (
                            <span className="px-2 py-0.5 rounded-lg bg-[#FFE600]/20 text-[#FFE600] border border-[#FFE600]/40 font-bold text-[10px]">
                              {prod.badge}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(prod)}
                              className="px-3 py-1.5 rounded-lg bg-[#FFE600]/15 hover:bg-[#FFE600]/30 text-[#FFE600] border border-[#FFE600]/30 transition font-bold text-xs flex items-center gap-1 cursor-pointer"
                              title="تعديل بيانات وصفحة المنتج"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>تعديل</span>
                            </button>

                            <Link
                              href={`/demo/store/${prod.id}`}
                              target="_blank"
                              className="p-1.5 rounded-lg bg-[#161205] hover:bg-[#2D250B] text-white border border-[#382E0E] transition"
                              title="فتح صفحة المنتج الحية"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#FFE600]" />
                            </Link>

                            <button
                              onClick={() => {
                                deleteProduct(prod.id);
                                triggerToast("تم حذف المنتج");
                              }}
                              className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 border border-red-500/20 transition cursor-pointer"
                              title="حذف"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= EDIT PRODUCT MODAL ================= */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#1C1707] border-2 border-[#FFE600] p-6 sm:p-8 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#382E0E] pb-4">
                <div>
                  <span className="font-black text-lg text-white block">
                    تعديل بيانات وصفحة المنتج
                  </span>
                  <span className="text-xs text-[#FFE600] font-mono font-bold">
                    معرف المنتج: {editingProduct.id}
                  </span>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-2 rounded-xl bg-[#2D250B] text-white hover:text-[#FFE600]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={handleUpdateProduct}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-white font-bold mb-1.5">
                    اسم المنتج *
                  </label>
                  <input
                    type="text"
                    required
                    value={editProdName}
                    onChange={(e) => setEditProdName(e.target.value)}
                    className="w-full !bg-[#120E04] !text-white border-2 !border-[#382E0E] focus:!border-[#FFE600] rounded-xl px-3.5 py-2.5 text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-white font-bold mb-1.5">
                      القسم / التصنيف
                    </label>
                    <input
                      type="text"
                      required
                      value={editProdCategory}
                      onChange={(e) => setEditProdCategory(e.target.value)}
                      className="w-full !bg-[#120E04] !text-white border-2 !border-[#382E0E] focus:!border-[#FFE600] rounded-xl px-3.5 py-2.5 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-1.5">
                      الوسم الترويجي (Badge)
                    </label>
                    <input
                      type="text"
                      value={editProdBadge}
                      onChange={(e) => setEditProdBadge(e.target.value)}
                      placeholder="مثال: الأكثر طلباً أو عرض خاص"
                      className="w-full !bg-[#120E04] !text-white border-2 !border-[#382E0E] focus:!border-[#FFE600] rounded-xl px-3.5 py-2.5 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-white font-bold mb-1.5">
                      السعر الحالي ({settings.currency}) *
                    </label>
                    <input
                      type="number"
                      required
                      value={editProdPrice}
                      onChange={(e) => setEditProdPrice(Number(e.target.value))}
                      className="w-full !bg-[#120E04] !text-white border-2 !border-[#382E0E] focus:!border-[#FFE600] rounded-xl px-3.5 py-2.5 text-xs font-mono font-black"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-1.5">
                      السعر قبل الخصم
                    </label>
                    <input
                      type="number"
                      value={editProdOldPrice}
                      onChange={(e) =>
                        setEditProdOldPrice(
                          e.target.value ? Number(e.target.value) : "",
                        )
                      }
                      placeholder="اختياري"
                      className="w-full !bg-[#120E04] !text-white border-2 !border-[#382E0E] focus:!border-[#FFE600] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-1.5">
                      المخزون المتوفر (الكمية)
                    </label>
                    <input
                      type="number"
                      value={editProdStock}
                      onChange={(e) => setEditProdStock(Number(e.target.value))}
                      className="w-full !bg-[#120E04] !text-white border-2 !border-[#382E0E] focus:!border-[#FFE600] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Direct Image Upload from Computer Section */}
                <div className="p-4 rounded-2xl bg-[#120E04] border border-[#382E0E] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-white font-bold block">
                      صورة المنتج
                    </label>
                    <span className="text-[10px] text-[#FFE600] font-bold">
                      يمكنك الرفع المباشر من جهازك أو وضع رابط
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#1C1707] border border-[#382E0E] flex-shrink-0">
                      {editProdImage && (
                        <img
                          src={editProdImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        ref={editProdImgRef}
                        onChange={(e) => handleProductImageFile(e, "edit")}
                        accept="image/*"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => editProdImgRef.current?.click()}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#2D250B] hover:bg-[#382E0E] border border-[#FFE600]/40 text-[#FFE600] font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>رفع صورة جديدة من الجهاز</span>
                      </button>

                      <input
                        type="text"
                        value={editProdImage}
                        onChange={(e) => setEditProdImage(e.target.value)}
                        placeholder="أو ضع رابط الصورة المباشر هنا..."
                        className="w-full !bg-[#1C1707] !text-white border !border-[#382E0E] rounded-xl px-3 py-1.5 text-[11px] font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-bold mb-1.5">
                    وصف المنتج
                  </label>
                  <textarea
                    rows={3}
                    value={editProdDesc}
                    onChange={(e) => setEditProdDesc(e.target.value)}
                    placeholder="وصف تفصيلي جذاب للمنتج..."
                    className="w-full !bg-[#120E04] !text-white border-2 !border-[#382E0E] focus:!border-[#FFE600] rounded-xl p-3 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-white font-bold mb-1.5">
                    المميزات والمواصفات (ميزة في كل سطر)
                  </label>
                  <textarea
                    rows={3}
                    value={editProdFeatures}
                    onChange={(e) => setEditProdFeatures(e.target.value)}
                    placeholder="ضمان سنتين معتمد&#10;شحن سريع لكافة المدن&#10;خامات ممتازة أصلية 100%"
                    className="w-full !bg-[#120E04] !text-white border-2 !border-[#382E0E] focus:!border-[#FFE600] rounded-xl p-3 text-xs font-medium"
                  />
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#120E04] border border-[#382E0E]">
                  <input
                    type="checkbox"
                    id="editFlashDeal"
                    checked={editProdFlashDeal}
                    onChange={(e) => setEditProdFlashDeal(e.target.checked)}
                    className="w-4 h-4 accent-[#FFE600] cursor-pointer"
                  />
                  <label
                    htmlFor="editFlashDeal"
                    className="text-white font-bold cursor-pointer"
                  >
                    تضمين في قسم عروض الخصم السريعة (Flash Deals)
                  </label>
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="submit"
                    className="btn-phosphor flex-1 py-3 rounded-xl font-black text-xs shadow-xl cursor-pointer"
                  >
                    حفظ ونشر التعديلات
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-5 py-3 rounded-xl bg-[#2D250B] text-[#D1D5DB] font-bold text-xs hover:bg-[#382E0E] transition cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= ADD PRODUCT MODAL ================= */}
        {isAddProductOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#1C1707] border-2 border-[#FFE600] p-6 sm:p-8 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#382E0E] pb-4">
                <span className="font-black text-lg text-white block">
                  إضافة منتج جديد إلى المتجر
                </span>
                <button
                  onClick={() => setIsAddProductOpen(false)}
                  className="p-2 rounded-xl bg-[#2D250B] text-white hover:text-[#FFE600]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={handleCreateProduct}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-white font-bold mb-1.5">
                    اسم المنتج *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="مثال: عطر العود الملكي الخاص"
                    className="w-full !bg-[#120E04] !text-white border-2 !border-[#382E0E] focus:!border-[#FFE600] rounded-xl px-3.5 py-2.5 text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-white font-bold mb-1.5">
                      القسم
                    </label>
                    <input
                      type="text"
                      required
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      placeholder="إلكترونيات، عطور، عبايات، قهوة..."
                      className="w-full !bg-[#120E04] !text-white border-2 !border-[#382E0E] focus:!border-[#FFE600] rounded-xl px-3.5 py-2.5 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-1.5">
                      الوسم الترويجي
                    </label>
                    <input
                      type="text"
                      value={newProdBadge}
                      onChange={(e) => setNewProdBadge(e.target.value)}
                      placeholder="جديد، الأكثر طلباً، عرض خاص"
                      className="w-full !bg-[#120E04] !text-white border-2 !border-[#382E0E] focus:!border-[#FFE600] rounded-xl px-3.5 py-2.5 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-white font-bold mb-1.5">
                      السعر ({settings.currency}) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="w-full !bg-[#120E04] !text-white border-2 !border-[#382E0E] focus:!border-[#FFE600] rounded-xl px-3.5 py-2.5 text-xs font-mono font-black"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-1.5">
                      السعر قبل الخصم
                    </label>
                    <input
                      type="number"
                      value={newProdOldPrice}
                      onChange={(e) =>
                        setNewProdOldPrice(
                          e.target.value ? Number(e.target.value) : "",
                        )
                      }
                      placeholder="اختياري"
                      className="w-full !bg-[#120E04] !text-white border-2 !border-[#382E0E] focus:!border-[#FFE600] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-1.5">
                      المخزون
                    </label>
                    <input
                      type="number"
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(Number(e.target.value))}
                      className="w-full !bg-[#120E04] !text-white border-2 !border-[#382E0E] focus:!border-[#FFE600] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Direct Image Upload from Computer Section */}
                <div className="p-4 rounded-2xl bg-[#120E04] border border-[#382E0E] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-white font-bold block">
                      صورة المنتج
                    </label>
                    <span className="text-[10px] text-[#FFE600] font-bold">
                      يمكنك الرفع المباشر من جهازك أو وضع رابط
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#1C1707] border border-[#382E0E] flex-shrink-0">
                      {newProdImage && (
                        <img
                          src={newProdImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        ref={addProdImgRef}
                        onChange={(e) => handleProductImageFile(e, "add")}
                        accept="image/*"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => addProdImgRef.current?.click()}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#2D250B] hover:bg-[#382E0E] border border-[#FFE600]/40 text-[#FFE600] font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>رفع صورة من الجهاز</span>
                      </button>

                      <input
                        type="text"
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        placeholder="أو ضع رابط الصورة هنا..."
                        className="w-full !bg-[#1C1707] !text-white border !border-[#382E0E] rounded-xl px-3 py-1.5 text-[11px] font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-bold mb-1.5">
                    وصف المنتج
                  </label>
                  <textarea
                    rows={3}
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="وصف مختصر وجذاب للمنتج..."
                    className="w-full !bg-[#120E04] !text-white border-2 !border-[#382E0E] focus:!border-[#FFE600] rounded-xl p-3 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-white font-bold mb-1.5">
                    المميزات (ميزة في كل سطر)
                  </label>
                  <textarea
                    rows={3}
                    value={newProdFeatures}
                    onChange={(e) => setNewProdFeatures(e.target.value)}
                    placeholder="ضمان سعودي سنتين&#10;شحن سريع لكافة المدن"
                    className="w-full !bg-[#120E04] !text-white border-2 !border-[#382E0E] focus:!border-[#FFE600] rounded-xl p-3 text-xs font-medium"
                  />
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#120E04] border border-[#382E0E]">
                  <input
                    type="checkbox"
                    id="addFlashDeal"
                    checked={newProdFlashDeal}
                    onChange={(e) => setNewProdFlashDeal(e.target.checked)}
                    className="w-4 h-4 accent-[#FFE600] cursor-pointer"
                  />
                  <label
                    htmlFor="addFlashDeal"
                    className="text-white font-bold cursor-pointer"
                  >
                    تضمين في عروض الخصم السريعة (Flash Deals)
                  </label>
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="submit"
                    className="btn-phosphor flex-1 py-3 rounded-xl font-black text-xs shadow-xl cursor-pointer"
                  >
                    حفظ ونشر المنتج
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="px-5 py-3 rounded-xl bg-[#2D250B] text-[#D1D5DB] font-bold text-xs hover:bg-[#382E0E] transition cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =================== TAB 4: ORDERS =================== */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-white block">
                إدارة الطلبات والمبيعات
              </span>
              <p className="text-xs text-slate-400">
                متابعة طلبات العملاء وتحديث حالات الشحن والتوصيل
              </p>
            </div>

            <div className="bg-[#10132E] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#141738] text-slate-300 font-bold border-b border-white/10">
                    <tr>
                      <th className="p-4">رقم الطلب</th>
                      <th className="p-4">العميل</th>
                      <th className="p-4">المدينة</th>
                      <th className="p-4">المبلغ الإجمالي</th>
                      <th className="p-4">طريقة الدفع</th>
                      <th className="p-4">حالة الطلب</th>
                      <th className="p-4 text-center">تحديث الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/5 transition">
                        <td className="p-4 font-mono font-bold text-white">
                          {ord.orderNumber}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white">
                            {ord.customerName}
                          </div>
                          <span
                            className="text-[10px] text-slate-400 font-mono"
                            dir="ltr"
                          >
                            {ord.customerPhone}
                          </span>
                        </td>
                        <td className="p-4 text-slate-300">
                          {ord.customerCity}
                        </td>
                        <td className="p-4 font-black font-mono text-[#FF9A3C] text-sm">
                          {ord.total} {settings.currency}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-lg bg-white/10 text-white font-bold text-[10px]">
                            {ord.paymentMethod.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                              ord.status === "delivered"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : ord.status === "processing"
                                  ? "bg-[#FF9A3C]/20 text-[#FF9A3C] border border-[#FF9A3C]/30"
                                  : ord.status === "shipped"
                                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            }`}
                          >
                            {ord.status === "delivered"
                              ? "تم التوصيل ✓"
                              : ord.status === "shipped"
                                ? "تم الشحن 🚚"
                                : ord.status === "processing"
                                  ? "قيد التجهيز 📦"
                                  : "طلب جديد ⚡"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <select
                            value={ord.status}
                            onChange={(e) => {
                              updateOrderStatus(ord.id, e.target.value as any);
                              triggerToast("تم تحديث حالة الطلب");
                            }}
                            className="!bg-[#181C3D] !text-white border !border-white/20 rounded-lg px-2 py-1 text-xs"
                          >
                            <option value="pending">طلب جديد</option>
                            <option value="processing">قيد التجهيز</option>
                            <option value="shipped">تم الشحن</option>
                            <option value="delivered">تم التوصيل</option>
                            <option value="cancelled">ملغي</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================== TAB 5: ABANDONED CART RECOVERY =================== */}
        {activeTab === "abandoned" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-lg sm:text-xl font-extrabold text-white block">
                  استرجاع السلات المتروكة (Abandoned Cart Recovery) 🛒
                </span>
                <p className="text-xs text-slate-400">
                  إرسال تذكيرات واتساب تلقائية بخصم 10% لزيادة نسبة إتمام الشراء
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                  معدل استرجاع السلات المتوقع: +32%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {abandonedCarts.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-[#10132E] border border-white/10 space-y-4 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-white">
                          {item.customerName}
                        </h4>
                        <span
                          className="text-[11px] text-slate-400 font-mono"
                          dir="ltr"
                        >
                          {item.customerPhone}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-1 rounded-lg">
                        {item.abandonedAgo}
                      </span>
                    </div>

                    <div className="space-y-1.5 p-3 rounded-2xl bg-black/30 border border-white/5 text-xs">
                      {item.items.map((prod, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-slate-300"
                        >
                          <span className="truncate max-w-[180px]">
                            {prod.productName}
                          </span>
                          <span className="font-mono font-bold text-white">
                            {prod.price} {settings.currency}
                          </span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-xs text-white">
                        <span>إجمالي السلة:</span>
                        <span className="text-[#FF9A3C] font-mono">
                          {item.total} {settings.currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {item.recovered ? (
                      <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تم إرسال رسالة الاسترجاع بنجاح</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          recoverAbandonedCart(item.id);
                          triggerToast(
                            `تم إرسال تذكير واتساب إلى ${item.customerName} مع كود RECOVER10`,
                          );
                        }}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>إرسال واتساب مع كود خصم 10%</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================== TAB 6: MARKETING PIXELS & AD TRACKING =================== */}
        {activeTab === "pixels" && (
          <div className="space-y-8 animate-in fade-in max-w-4xl">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#10132E] border border-white/10 space-y-6">
              <div>
                <span className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 block">
                  <Activity className="w-5 h-5 text-sky-400" />
                  <span>
                    مركز الربط والتكامل الإعلاني المباشر (Multi-Channel Pixels &
                    CAPI)
                  </span>
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  تتبع التحويلات والمبيعات بدقة 100% عبر السيرفر والمتصفح لمنصات
                  سناب شات، تيك توك، جوجل وميتا
                </p>
              </div>

              {/* Pixel Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Snapchat Pixel */}
                <div className="p-4 rounded-2xl bg-[#141738] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-yellow-400/20 text-yellow-300 flex items-center justify-center font-black text-xs">
                        👻
                      </span>
                      <span className="font-bold text-xs text-white">
                        Snapchat Pixel & CAPI
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketingPixels.snapchatActive}
                        onChange={(e) =>
                          updateMarketingPixels({
                            snapchatActive: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={marketingPixels.snapchatPixel}
                    onChange={(e) =>
                      updateMarketingPixels({ snapchatPixel: e.target.value })
                    }
                    placeholder="Pixel ID..."
                    className="w-full !bg-[#1B1F47] !text-white border !border-white/15 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                {/* TikTok Pixel */}
                <div className="p-4 rounded-2xl bg-[#141738] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center font-black text-xs">
                        🎵
                      </span>
                      <span className="font-bold text-xs text-white">
                        TikTok Pixel & Events API
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketingPixels.tiktokActive}
                        onChange={(e) =>
                          updateMarketingPixels({
                            tiktokActive: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={marketingPixels.tiktokPixel}
                    onChange={(e) =>
                      updateMarketingPixels({ tiktokPixel: e.target.value })
                    }
                    placeholder="TikTok Pixel ID..."
                    className="w-full !bg-[#1B1F47] !text-white border !border-white/15 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                {/* Google Ads & GA4 */}
                <div className="p-4 rounded-2xl bg-[#141738] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-black text-xs">
                        🔍
                      </span>
                      <span className="font-bold text-xs text-white">
                        Google Ads & GA4 Tracking
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketingPixels.googleAdsActive}
                        onChange={(e) =>
                          updateMarketingPixels({
                            googleAdsActive: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={marketingPixels.googleAdsId}
                    onChange={(e) =>
                      updateMarketingPixels({ googleAdsId: e.target.value })
                    }
                    placeholder="AW-XXXXXXXXX"
                    className="w-full !bg-[#1B1F47] !text-white border !border-white/15 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                {/* Meta (Facebook/Instagram) */}
                <div className="p-4 rounded-2xl bg-[#141738] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-black text-xs">
                        🌐
                      </span>
                      <span className="font-bold text-xs text-white">
                        Meta (FB & IG) Pixel
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketingPixels.metaActive}
                        onChange={(e) =>
                          updateMarketingPixels({
                            metaActive: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={marketingPixels.metaPixel}
                    onChange={(e) =>
                      updateMarketingPixels({ metaPixel: e.target.value })
                    }
                    placeholder="Meta Pixel ID..."
                    className="w-full !bg-[#1B1F47] !text-white border !border-white/15 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Live Event Test Simulator */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>
                      محاكي اختبار إرسال الأحداث اللحظي (Test Live Events):
                    </span>
                  </span>
                  {lastFiredEvent && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md">
                      آخر حدث مرسل: {lastFiredEvent}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={() =>
                      handleFirePixelTest("PageView (زيارة الصفحة)")
                    }
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition cursor-pointer"
                  >
                    إرسال PageView
                  </button>
                  <button
                    onClick={() =>
                      handleFirePixelTest("ViewContent (مشاهدة المنتج)")
                    }
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition cursor-pointer"
                  >
                    👁️ إرسال ViewContent
                  </button>
                  <button
                    onClick={() =>
                      handleFirePixelTest("AddToCart (إضافة للسلة)")
                    }
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition cursor-pointer"
                  >
                    🛒 إرسال AddToCart
                  </button>
                  <button
                    onClick={() => handleFirePixelTest("Purchase (شراء مكتمل)")}
                    className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold transition cursor-pointer"
                  >
                    🎉 إرسال Purchase (SAR 480)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================== TAB 7: COUPONS =================== */}
        {activeTab === "coupons" && (
          <div className="space-y-6 animate-in fade-in max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg sm:text-xl font-extrabold text-white block">
                  كوبونات وقسائم الخصم الترويجية
                </span>
                <p className="text-xs text-slate-400">
                  إنشاء وتفعيل أكواد الخصم للعملاء وحملات التسويق
                </p>
              </div>

              <button
                onClick={() => setIsAddCouponOpen(true)}
                style={{
                  background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})`,
                }}
                className="px-4 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-lg hover:opacity-90 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إنشاء كود خصم</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className="p-5 rounded-3xl bg-[#10132E] border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#FF4D6D]/20 to-[#FF9A3C]/20 border border-[#FF4D6D]/30 font-mono font-black text-sm text-[#FF9A3C]">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => {
                        toggleCoupon(coupon.code);
                        triggerToast(
                          coupon.active
                            ? "تم إيقاف الكوبون"
                            : "تم تفعيل الكوبون",
                        );
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                        coupon.active
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {coupon.active ? "مفعّل" : "معطّل"}
                    </button>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <p>
                      نسبة الخصم:{" "}
                      <strong className="text-emerald-400 font-mono">
                        {coupon.discountPct}%
                      </strong>
                    </p>
                    <p>
                      الحد الأدنى للطلب:{" "}
                      <strong className="font-mono">
                        {coupon.minSpend} {settings.currency}
                      </strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================== TAB 8: SEO & SEARCH ENGINE CONSOLE =================== */}
        {activeTab === "seo" && (
          <div className="space-y-8 animate-in fade-in max-w-5xl">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-2xl font-black text-white block">
                    مركز تحسين محركات البحث والسيو الذكي (SEO)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#FFE600]/15 border border-[#FFE600]/40 text-[#FFE600] font-black text-[11px]">
                    Google Optimized
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  إدارة وسوم الميتا، معاينة بطاقة بحث جوجل الحية، خريطة الموقع
                  Sitemap، وبيانات Schema.org المنظمة
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsPingingGoogle(true);
                    setGooglePingStatus(
                      "جاري إرسال إشعار الأرشفة الفورية لعناكب Googlebot...",
                    );
                    setTimeout(() => {
                      setIsPingingGoogle(false);
                      setGooglePingStatus(
                        "تم استلام إشعار الأرشفة بنجاح من Google Search Index API (HTTP 200)",
                      );
                      triggerToast(
                        "تم إرسال إشعار الأرشفة إلى محرك بحث جوجل بنجاح",
                      );
                    }, 1500);
                  }}
                  disabled={isPingingGoogle}
                  className="btn-phosphor px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-black" />
                  <span>
                    {isPingingGoogle
                      ? "جاري الأرشفة..."
                      : "طلب أرشفة فورية لجوجل"}
                  </span>
                </button>

                <button
                  onClick={() =>
                    triggerToast("تم حفظ ونشر إعدادات السيو والوسوم عالمياً")
                  }
                  className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 font-black text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ إعدادات السيو</span>
                </button>
              </div>
            </div>

            {/* Notification if pinged */}
            {googlePingStatus && (
              <div className="p-3.5 rounded-2xl bg-[#FFE600]/10 border border-[#FFE600]/30 text-[#FFE600] text-xs font-bold flex items-center justify-between">
                <span>{googlePingStatus}</span>
                <button
                  onClick={() => setGooglePingStatus(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Subtabs Selector */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveSeoSubtab("meta")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                  activeSeoSubtab === "meta"
                    ? "btn-phosphor text-black shadow-md"
                    : "bg-[#121530] text-slate-300 hover:text-white border border-white/10"
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>بطاقة جوجل والوسوم الرئيسية (SERP & Meta)</span>
              </button>

              <button
                onClick={() => setActiveSeoSubtab("schema")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                  activeSeoSubtab === "schema"
                    ? "btn-phosphor text-black shadow-md"
                    : "bg-[#121530] text-slate-300 hover:text-white border border-white/10"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>البيانات المنظمة (Schema.org / JSON-LD)</span>
              </button>

              <button
                onClick={() => setActiveSeoSubtab("audit")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                  activeSeoSubtab === "audit"
                    ? "btn-phosphor text-black shadow-md"
                    : "bg-[#121530] text-slate-300 hover:text-white border border-white/10"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>فاحص وتوافق السيو الذكي (SEO Health 98%)</span>
              </button>

              <button
                onClick={() => setActiveSeoSubtab("sitemap")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                  activeSeoSubtab === "sitemap"
                    ? "btn-phosphor text-black shadow-md"
                    : "bg-[#121530] text-slate-300 hover:text-white border border-white/10"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>خريطة الموقع وروابط الأرشفة (Sitemap & Robots)</span>
              </button>
            </div>

            {/* ================= SUBTAB 1: META & GOOGLE SERP ================= */}
            {activeSeoSubtab === "meta" && (
              <div className="space-y-6 animate-in fade-in">
                {/* 1. Google SERP Live Simulation Card */}
                <div className="p-6 rounded-3xl bg-[#0B0E14] border-2 border-white/15 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold text-xs text-blue-600 shadow">
                        G
                      </div>
                      <span className="font-bold text-xs text-slate-300">
                        معاينة مباشرة لشكل متجرك في نتائج بحث Google (Live SERP
                        Preview)
                      </span>
                    </div>

                    <div className="flex items-center bg-[#151928] p-1 rounded-xl border border-white/10 text-xs">
                      <button
                        onClick={() => setSeoPreviewMode("desktop")}
                        className={`px-3 py-1 rounded-lg transition font-bold ${
                          seoPreviewMode === "desktop"
                            ? "bg-[#FFE600] text-black font-black"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        كمبيوتر (Desktop)
                      </button>
                      <button
                        onClick={() => setSeoPreviewMode("mobile")}
                        className={`px-3 py-1 rounded-lg transition font-bold ${
                          seoPreviewMode === "mobile"
                            ? "bg-[#FFE600] text-black font-black"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        جوال (Mobile)
                      </button>
                    </div>
                  </div>

                  {/* The Simulated Google Card */}
                  <div
                    className={`p-4 rounded-2xl bg-[#171A21] border border-white/10 space-y-2 ${seoPreviewMode === "mobile" ? "max-w-md" : "w-full"}`}
                    dir="rtl"
                  >
                    {/* URL Breadcrumbs */}
                    <div className="flex items-center gap-1.5 text-[11px] text-[#BDC1C6]">
                      <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[9px] text-white">
                        🌐
                      </div>
                      <span className="text-[#BDC1C6] font-mono">
                        https://d-arrow.com
                      </span>
                      <span className="text-slate-500">›</span>
                      <span className="text-[#BDC1C6] font-mono">store</span>
                      <span className="text-slate-500">›</span>
                      <span className="text-[#BDC1C6]">
                        {settings.storeName}
                      </span>
                    </div>

                    {/* Meta Title (Clickable Google Blue) */}
                    <h3 className="text-base sm:text-lg font-bold text-[#8AB4F8] hover:underline cursor-pointer leading-snug">
                      {settings.seoMetaTitle ||
                        `${settings.storeName} | المتجر الإلكتروني السعودي الفاخر`}
                    </h3>

                    {/* Rich Snippets / Stars Row */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#9AA0A6] font-mono">
                      <div className="flex items-center text-amber-400">
                        <span>★★★★★</span>
                        <span className="text-slate-300 font-bold mr-1">
                          4.9
                        </span>
                      </div>
                      <span>·</span>
                      <span className="text-emerald-400 font-bold">
                        متوفر في المخزون (In Stock)
                      </span>
                      <span>·</span>
                      <span className="text-slate-300">
                        الضمان: سنتين معتمد
                      </span>
                      <span>·</span>
                      <span className="text-slate-300">
                        الشحن: فوري لجميع المدن 🇸🇦
                      </span>
                    </div>

                    {/* Meta Description */}
                    <p className="text-xs text-[#BDC1C6] leading-relaxed">
                      {settings.seoMetaDescription ||
                        settings.storeSlogan ||
                        "تسوق الآن من متجرنا المعتمد مع أفضل العروض الحصرية وضمان شامل وشحن سريع لجميع مدن المملكة."}
                    </p>
                  </div>

                  {/* Character Counters and Optimization Gauge */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-[#121530] border border-white/10 flex items-center justify-between">
                      <span className="text-slate-300 font-bold">
                        طول عنوان السيو (Title):
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-[#FFE600]">
                          {(settings.seoMetaTitle || "").length} / 60 حرف
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                          مثالي 100%
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#121530] border border-white/10 flex items-center justify-between">
                      <span className="text-slate-300 font-bold">
                        طول الوصف التعريفي (Description):
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-[#FFE600]">
                          {(settings.seoMetaDescription || "").length} / 160 حرف
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                          مثالي 100%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Metadata Inputs Form */}
                <div className="p-6 rounded-3xl bg-[#10132E] border border-white/10 space-y-5">
                  <span className="font-black text-sm text-white block">
                    ⚙️ تخصيص وسوم الميتا ومحركات البحث للمتجر:
                  </span>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">
                        عنوان الميتا الرئيسي لمحركات البحث (Meta Title) *
                      </label>
                      <input
                        type="text"
                        value={settings.seoMetaTitle || ""}
                        onChange={(e) =>
                          updateSettings({ seoMetaTitle: e.target.value })
                        }
                        placeholder="مثال: متجر الرائد للتقنية | متجر إلكتروني سعودي معتمد للأجهزة الذكية"
                        className="w-full !bg-[#15193B] !text-white border !border-white/20 focus:!border-[#FFE600] rounded-xl px-4 py-2.5 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-bold block mb-1">
                        الوصف التعريفي لمحركات البحث (Meta Description) *
                      </label>
                      <textarea
                        rows={3}
                        value={settings.seoMetaDescription || ""}
                        onChange={(e) =>
                          updateSettings({ seoMetaDescription: e.target.value })
                        }
                        placeholder="اكتب وصفاً جذاباً يشمل الكلمات المفتاحية ومميزات الشحن والضمان في المملكة..."
                        className="w-full !bg-[#15193B] !text-white border !border-white/20 focus:!border-[#FFE600] rounded-xl p-3 text-xs leading-relaxed font-medium"
                      />
                    </div>

                    {/* Keywords Section */}
                    <div>
                      <label className="text-slate-300 font-bold block mb-1.5">
                        الكلمات المفتاحية المستهدفة (Focus Keywords & Tags)
                      </label>
                      <div className="p-3 rounded-2xl bg-[#15193B] border border-white/20 space-y-2.5">
                        <div className="flex flex-wrap gap-2">
                          {(
                            settings.seoKeywords ||
                            "متجر إلكتروني سعودي, أجهزة ذكية, سماعات لاسلكية, عروض السعودية"
                          )
                            .split(",")
                            .map((kw, idx) => {
                              const trimmed = kw.trim();
                              if (!trimmed) return null;
                              return (
                                <span
                                  key={idx}
                                  className="px-3 py-1 rounded-xl bg-[#2D250B] border border-[#FFE600]/40 text-[#FFE600] font-bold text-xs flex items-center gap-1.5"
                                >
                                  <span>{trimmed}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentList = (
                                        settings.seoKeywords || ""
                                      )
                                        .split(",")
                                        .map((k) => k.trim())
                                        .filter(Boolean);
                                      const nextList = currentList.filter(
                                        (k) => k !== trimmed,
                                      );
                                      updateSettings({
                                        seoKeywords: nextList.join(", "),
                                      });
                                    }}
                                    className="text-slate-400 hover:text-red-400 text-xs"
                                  >
                                    ×
                                  </button>
                                </span>
                              );
                            })}
                        </div>

                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            value={newKeywordInput}
                            onChange={(e) => setNewKeywordInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && newKeywordInput.trim()) {
                                e.preventDefault();
                                const current = settings.seoKeywords
                                  ? settings.seoKeywords + ", "
                                  : "";
                                updateSettings({
                                  seoKeywords: current + newKeywordInput.trim(),
                                });
                                setNewKeywordInput("");
                              }
                            }}
                            placeholder="اكتب كلمة مفتاحية واضغط إضافة..."
                            className="flex-1 !bg-[#0E122A] !text-white border !border-white/20 rounded-xl px-3 py-2 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!newKeywordInput.trim()) return;
                              const current = settings.seoKeywords
                                ? settings.seoKeywords + ", "
                                : "";
                              updateSettings({
                                seoKeywords: current + newKeywordInput.trim(),
                              });
                              setNewKeywordInput("");
                            }}
                            className="px-4 py-2 rounded-xl bg-[#2D250B] text-[#FFE600] font-black text-xs border border-[#FFE600]/40 hover:bg-[#382E0E] cursor-pointer"
                          >
                            + إضافة كلمة
                          </button>
                        </div>

                        {/* Quick Add Suggestions */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                          <span className="text-slate-400 font-bold">
                            اقتراحات سريعة:
                          </span>
                          {[
                            "شحن مجاني السعودية",
                            "ضمان سنتين",
                            "دفع عند الاستلام",
                            "أبل باي ومدى",
                            "عروض اليوم الوطني",
                          ].map((sug) => (
                            <button
                              key={sug}
                              type="button"
                              onClick={() => {
                                const current = settings.seoKeywords
                                  ? settings.seoKeywords + ", "
                                  : "";
                                if (!current.includes(sug)) {
                                  updateSettings({
                                    seoKeywords: current + sug,
                                  });
                                }
                              }}
                              className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 cursor-pointer"
                            >
                              + {sug}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          الرابط المعتمد (Canonical URL)
                        </label>
                        <input
                          type="text"
                          value={
                            settings.seoCanonicalUrl ||
                            "https://d-arrow.com/demo/store"
                          }
                          onChange={(e) =>
                            updateSettings({ seoCanonicalUrl: e.target.value })
                          }
                          className="w-full !bg-[#15193B] !text-white border !border-white/20 rounded-xl px-3 py-2 text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          توجيه الفهرسة (Robots Meta)
                        </label>
                        <select
                          value={settings.seoRobotsIndex ? "index" : "noindex"}
                          onChange={(e) =>
                            updateSettings({
                              seoRobotsIndex: e.target.value === "index",
                            })
                          }
                          className="w-full !bg-[#15193B] !text-white border !border-white/20 rounded-xl px-3 py-2 text-xs font-bold"
                        >
                          <option value="index">
                            index, follow (السماح لجميع محركات البحث بالأرشفة
                            الفورية - مستحسن)
                          </option>
                          <option value="noindex">
                            noindex, nofollow (إيقاف الأرشفة مؤقتاً)
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SUBTAB 2: SCHEMA.ORG JSON-LD ================= */}
            {activeSeoSubtab === "schema" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="p-6 rounded-3xl bg-[#10132E] border border-white/10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="font-black text-sm sm:text-base text-white block">
                        مولد البيانات المنظمة التلقائي (Schema.org / JSON-LD)
                      </span>
                      <p className="text-xs text-slate-400">
                        بيانات مهيكلة تفهمها خوارزميات جوجل والذكاء الاصطناعي
                        لعرض النجوم والأسعار وحالة المخزون
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const schemaJSON = JSON.stringify(
                            {
                              "@context": "https://schema.org",
                              "@type": "Store",
                              name: settings.storeName,
                              description:
                                settings.seoMetaDescription ||
                                settings.storeSlogan,
                              url: "https://d-arrow.com/demo/store",
                              logo: "https://d-arrow.com/store-default-logo.svg",
                              currenciesAccepted: settings.currency,
                              paymentAccepted:
                                "Mada, Apple Pay, Visa, MasterCard, Cash on Delivery",
                              priceRange: "$$",
                              address: {
                                "@type": "PostalAddress",
                                addressCountry: "SA",
                                addressLocality: "Riyadh",
                              },
                              aggregateRating: {
                                "@type": "AggregateRating",
                                ratingValue: "4.9",
                                reviewCount: "240",
                              },
                            },
                            null,
                            2,
                          );
                          navigator.clipboard.writeText(schemaJSON);
                          triggerToast(
                            "تم نسخ كود Schema.org JSON-LD إلى الحافظة بنجاح",
                          );
                        }}
                        className="btn-phosphor px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>نسخ كود JSON-LD 📋</span>
                      </button>

                      <a
                        href="https://search.google.com/test/rich-results"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 border border-white/15"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>فحص في Google Rich Results Test ↗</span>
                      </a>
                    </div>
                  </div>

                  {/* Schema Code Block */}
                  <div
                    className="p-4 rounded-2xl bg-[#090C19] border border-white/15 font-mono text-[11px] text-emerald-400 overflow-x-auto"
                    dir="ltr"
                  >
                    <pre>
                      {`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  "name": "${settings.storeName}",
  "description": "${settings.seoMetaDescription || settings.storeSlogan}",
  "url": "https://d-arrow.com/demo/store",
  "logo": "https://d-arrow.com/store-default-logo.svg",
  "currenciesAccepted": "${settings.currency}",
  "paymentAccepted": "Mada, Apple Pay, Visa, MasterCard, COD",
  "priceRange": "SAR 50 - SAR 990",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "SA",
    "addressRegion": "Riyadh"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "${products.reduce((sum, p) => sum + (p.reviewsCount || 0), 0) + 120}"
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "${settings.currency}",
    "lowPrice": "${Math.min(...products.map((p) => p.price))}",
    "highPrice": "${Math.max(...products.map((p) => p.price))}",
    "offerCount": "${products.length}"
  }
}
</script>`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SUBTAB 3: AI SEO HEALTH AUDIT ================= */}
            {activeSeoSubtab === "audit" && (
              <div className="space-y-6 animate-in fade-in">
                {/* Score Banner */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1C1707] to-[#120E04] border-2 border-[#FFE600]/50 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-18 h-18 rounded-2xl bg-[#FFE600] text-black font-black flex flex-col items-center justify-center shadow-2xl">
                      <span className="text-2xl leading-none">98</span>
                      <span className="text-[10px] font-bold">/ 100</span>
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-black text-white">
                        درجة توافق السيو لمحركات البحث: ممتازة جداً
                      </h4>
                      <p className="text-xs text-[#FFE600]">
                        المتجر مهيأ بالكامل ومطابق لجميع معايير تجربة المستخدم
                        وأرشفة جوجل الفورية
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-right font-bold text-slate-300">
                    <p>
                      سرعة التحميل:{" "}
                      <span className="text-emerald-400 font-mono font-black">
                        0.4s (A+)
                      </span>
                    </p>
                    <p>
                      توافق الشاشات:{" "}
                      <span className="text-emerald-400 font-mono font-black">
                        100% Mobile Ready
                      </span>
                    </p>
                  </div>
                </div>

                {/* Audit Checklist */}
                <div className="p-6 rounded-3xl bg-[#10132E] border border-white/10 space-y-4">
                  <span className="font-black text-sm text-white block">
                    📋 تقرير الفحص الشامل للسيو والتهيئة التقنية:
                  </span>

                  <div className="space-y-2.5 text-xs font-bold">
                    <div className="p-3 rounded-2xl bg-[#15193B] border border-emerald-500/30 flex items-center justify-between text-slate-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>
                          وسم العنوان (Meta Title): محدد ومثالي الطول (54 حرفاً)
                          ويحتوي على الكلمات المستهدفة.
                        </span>
                      </div>
                      <span className="text-emerald-400 font-mono font-black">
                        ناجح ✓
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#15193B] border border-emerald-500/30 flex items-center justify-between text-slate-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>
                          الوصف التعريفي (Meta Description): جذاب وشامل ويشمل
                          ميزة الشحن والضمان في السعودية.
                        </span>
                      </div>
                      <span className="text-emerald-400 font-mono font-black">
                        ناجح ✓
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#15193B] border border-emerald-500/30 flex items-center justify-between text-slate-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>
                          البيانات المنظمة (Schema JSON-LD): مفعلة وتدعم بطاقات
                          النجوم والأسعار بالريال السعودي.
                        </span>
                      </div>
                      <span className="text-emerald-400 font-mono font-black">
                        ناجح ✓
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#15193B] border border-emerald-500/30 flex items-center justify-between text-slate-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>
                          خريطة الموقع التلقائية (Sitemap.xml): متصلة ومحدثة
                          ديناميكياً بجميع روابط المنتجات.
                        </span>
                      </div>
                      <span className="text-emerald-400 font-mono font-black">
                        ناجح ✓
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#15193B] border border-emerald-500/30 flex items-center justify-between text-slate-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>
                          ملف توجيه الروبوتات (Robots.txt): مهيأ للسماح لعناكب
                          Googlebot و Bingbot.
                        </span>
                      </div>
                      <span className="text-emerald-400 font-mono font-black">
                        ناجح ✓
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#15193B] border border-emerald-500/30 flex items-center justify-between text-slate-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>
                          وسوم OpenGraph و Twitter Cards: مفعلة وتظهر صورة
                          وعنوان المتجر عند مشاركة الرابط على الواتساب.
                        </span>
                      </div>
                      <span className="text-emerald-400 font-mono font-black">
                        ناجح ✓
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SUBTAB 4: SITEMAP & ROBOTS ================= */}
            {activeSeoSubtab === "sitemap" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sitemap.xml Viewer */}
                  <div className="p-6 rounded-3xl bg-[#10132E] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <span className="font-bold text-xs sm:text-sm text-white">
                        خريطة الموقع (Sitemap.xml)
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">
                        200 OK ✓
                      </span>
                    </div>
                    <div
                      className="p-3.5 rounded-2xl bg-[#090C19] border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-60"
                      dir="ltr"
                    >
                      <pre>
                        {`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://d-arrow.com/demo/store</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${products
  .map(
    (p) => `  <url>
    <loc>https://d-arrow.com/demo/store/${p.id}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`}
                      </pre>
                    </div>
                  </div>

                  {/* Robots.txt Viewer */}
                  <div className="p-6 rounded-3xl bg-[#10132E] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <span className="font-bold text-xs sm:text-sm text-white">
                        ملف توجيه العناكب (Robots.txt)
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">
                        200 OK ✓
                      </span>
                    </div>
                    <div
                      className="p-3.5 rounded-2xl bg-[#090C19] border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-60"
                      dir="ltr"
                    >
                      <pre>
                        {`User-agent: *
Allow: /
Allow: /demo/store
Allow: /demo/store/*
Disallow: /demo/store/admin
Disallow: /api/*

Sitemap: https://d-arrow.com/sitemap.xml
Host: https://d-arrow.com`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Coupon Modal */}
        {isAddCouponOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md rounded-3xl bg-[#0F122B] border border-white/15 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-black text-base text-white block">
                  إنشاء كوبون خصم جديد
                </span>
                <button
                  onClick={() => setIsAddCouponOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    كود الخصم (Promo Code) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) =>
                      setNewCouponCode(e.target.value.toUpperCase())
                    }
                    placeholder="مثال: SUMMER2026"
                    className="w-full !bg-[#15193B] !text-white border !border-white/20 rounded-xl px-3 py-2 text-xs font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    نسبة الخصم المئوية (%) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={99}
                    value={newCouponDiscount}
                    onChange={(e) =>
                      setNewCouponDiscount(Number(e.target.value))
                    }
                    className="w-full !bg-[#15193B] !text-white border !border-white/20 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    الحد الأدنى لقيمة السلة (ر.س)
                  </label>
                  <input
                    type="number"
                    value={newCouponMinSpend}
                    onChange={(e) =>
                      setNewCouponMinSpend(Number(e.target.value))
                    }
                    className="w-full !bg-[#15193B] !text-white border !border-white/20 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="submit"
                    style={{
                      background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})`,
                    }}
                    className="flex-1 py-2.5 rounded-xl text-white font-black text-xs shadow-md hover:opacity-90 transition cursor-pointer"
                  >
                    تفعيل ونشر الكوبون ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddCouponOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function StoreAdminPage() {
  return (
    <StoreProvider>
      <AdminDashboardContent />
    </StoreProvider>
  );
}
