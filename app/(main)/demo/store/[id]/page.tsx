'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  StoreProvider, 
  useStore, 
  StoreProduct 
} from '@/components/demo/store/StoreContext';
import StoreHeader from '@/components/demo/store/StoreHeader';
import StoreFooter from '@/components/demo/store/StoreFooter';
import CartDrawer from '@/components/demo/store/CartDrawer';
import LiveThemeDrawer from '@/components/demo/store/LiveThemeDrawer';
import SocialProofPopup from '@/components/demo/store/SocialProofPopup';
import PriceAlertModal from '@/components/demo/store/PriceAlertModal';
import PWAInstallBanner from '@/components/demo/store/PWAInstallBanner';
import { STORE_NICHES } from '@/components/demo/store/niches';
import { 
  ShoppingCart, 
  Star, 
  Heart, 
  Share2, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  ChevronLeft, 
  Sparkles, 
  Tag, 
  Check, 
  CreditCard, 
  Plus, 
  Minus, 
  ArrowRight,
  Flame,
  Clock,
  CheckCircle2,
  Lock,
  Box,
  Eye,
  Bell
} from 'lucide-react';
import '../demo-store.css';

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { 
    products, 
    settings, 
    addToCart, 
    cart, 
    wishlist, 
    toggleWishlist,
    setIsCartOpen 
  } = useStore();

  const [qty, setQty] = useState(1);
  const [copied, setCopied] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [priceAlertOpen, setPriceAlertOpen] = useState(false);

  // Find product from active products state, or fallback across all niche catalogs
  const product = products.find(p => p.id === productId) || 
    Object.values(STORE_NICHES).flatMap(n => n.products).find(p => p.id === productId);

  const inCart = product ? cart.some(c => c.product.id === product.id) : false;
  const inWishlist = product ? wishlist.includes(product.id) : false;

  const savings = product && product.oldPrice ? product.oldPrice - product.price : 0;
  const discountPercent = product && product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  // Related products from same category or fallback
  const relatedProducts = products
    .filter(p => p.id !== productId && (!product || p.category === product.category))
    .slice(0, 4);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, qty);
      router.push('/demo/store/checkout');
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col font-sans demo-store-root phosphor-bg-mesh" dir="rtl">
        <StoreHeader />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#1C1707] border border-[#382E0E] flex items-center justify-center text-[#FFE600]">
            <Box className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">المنتج غير متوفر أو تم نقله</h2>
          <p className="text-sm text-[#9CA3AF]">عذراً، لم نتمكن من العثور على هذا المنتج في الكتالوج الحالي.</p>
          <Link 
            href="/demo/store"
            className="btn-phosphor inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-black shadow-xl"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لكتالوج المنتجات</span>
          </Link>
        </main>
        <StoreFooter />
      </div>
    );
  }

  // Gallery images (simulate multiple angles using product image)
  const galleryImages = [
    product.image,
    product.image,
    product.image
  ];

  return (
    <div className="min-h-screen text-white flex flex-col font-sans demo-store-root phosphor-bg-mesh" dir="rtl">
      <StoreHeader />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-[#382E0E] bg-[#161205]/95 backdrop-blur-md py-3 px-4 sm:px-8">
        <div className="max-w-[1550px] mx-auto flex items-center gap-2 text-xs font-bold text-[#9CA3AF] overflow-x-auto no-scrollbar">
          <Link href="/demo/store" className="hover:text-[#FFE600] transition flex items-center gap-1">
            <span>الرئيسية</span>
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-[#382E0E] flex-shrink-0" />
          <Link href="/demo/store#catalog" className="hover:text-[#FFE600] transition whitespace-nowrap">
            <span>{product.category}</span>
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-[#382E0E] flex-shrink-0" />
          <span className="text-[#FFE600] truncate max-w-[200px] sm:max-w-md font-black">{product.name}</span>
        </div>
      </div>

      {/* Main Product Container */}
      <main className="flex-1 w-full max-w-[1550px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 space-y-12">
        
        {/* Product Hero Grid (Image Gallery + Buy Box) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Right Column: Visual Gallery (5 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[#1C1707] border-2 border-[#382E0E] shadow-2xl group">
              <img 
                src={galleryImages[selectedImageIndex]} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                {product.badge && (
                  <span className="btn-phosphor px-3 py-1.5 rounded-xl text-xs font-black shadow-lg">
                    {product.badge}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-lg">
                    خصم {discountPercent}%
                  </span>
                )}
              </div>

              {/* Action Floating Buttons */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-2xl backdrop-blur-md transition shadow-lg ${
                    inWishlist 
                      ? 'bg-red-500 text-white' 
                      : 'bg-[#1C1707]/90 text-white hover:text-[#FFE600] border border-[#382E0E]'
                  }`}
                  title={inWishlist ? 'محذوف من المفضلة' : 'إضافة للمفضلة'}
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>

                <button
                  onClick={handleShare}
                  className="p-3 rounded-2xl bg-[#1C1707]/90 text-white hover:text-[#FFE600] border border-[#382E0E] backdrop-blur-md transition shadow-lg"
                  title="مشاركة المنتج"
                >
                  {copied ? <Check className="w-5 h-5 text-[#FFE600]" /> : <Share2 className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setPriceAlertOpen(true)}
                  className="p-3 rounded-2xl bg-[#1C1707]/90 text-white hover:text-[#FFE600] border border-[#382E0E] backdrop-blur-md transition shadow-lg"
                  title="تنبيه عند انخفاض السعر"
                >
                  <Bell className="w-5 h-5" />
                </button>
              </div>

              {/* Flash Deals Ribbon */}
              {product.isFlashDeal && (
                <div className="absolute bottom-4 inset-x-4 p-3 rounded-2xl bg-[#161205]/95 border border-[#FFE600]/40 backdrop-blur-md flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-2 text-[#FFE600] font-black text-xs">
                    <Flame className="w-4 h-4 animate-pulse" />
                    <span>عرض سريع مؤقت</span>
                  </div>
                  <span className="text-[11px] text-[#FEF9C3] font-bold">كمية محدودة في المخزون</span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex items-center gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition cursor-pointer ${
                    selectedImageIndex === idx 
                      ? 'border-[#FFE600] shadow-lg shadow-[#FFE600]/20 scale-105' 
                      : 'border-[#382E0E] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </div>

          {/* Left Column: Product Info & Purchase Form (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header: Category & Ratings */}
            <div className="space-y-3 border-b border-[#382E0E] pb-5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-[#2D250B] text-[#FFE600] border border-[#382E0E] text-xs font-black">
                  {product.category}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <div className="flex items-center text-[#FFE600]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-white font-black">{product.rating}</span>
                  <span className="text-[#9CA3AF]">({product.reviewsCount} تقييم سعودي معتمد)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                {product.name}
              </h1>

              <p className="text-sm sm:text-base text-[#D1D5DB] leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#1C1707] border-2 border-[#382E0E] space-y-3 shadow-xl">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-[#FFE600]">
                    {product.price}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-[#9CA3AF]">{settings.currency}</span>

                  {product.oldPrice && (
                    <span className="text-base text-[#6B7280] line-through mr-3 font-mono">
                      {product.oldPrice} {settings.currency}
                    </span>
                  )}
                </div>

                {savings > 0 && (
                  <span className="px-3 py-1.5 rounded-xl bg-[#2D250B] border border-[#FFE600]/40 text-[#FFE600] text-xs font-black">
                    وفر {savings} {settings.currency}
                  </span>
                )}
              </div>

              {/* Stock Indicator */}
              <div className="pt-2 flex items-center gap-2 text-xs">
                {product.stock > 0 ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                    <span className="text-emerald-400 font-bold">
                      متوفر في المخزون السعودي (متبقي {product.stock} قطع فقط!)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
                    <span className="text-red-400 font-bold">نفدت الكمية مؤقتاً</span>
                  </>
                )}
              </div>
            </div>

            {/* Key Features Checkmarks */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-2.5 p-5 rounded-3xl bg-[#161205] border border-[#382E0E]">
                <span className="text-xs font-black text-[#FFE600] block mb-2">مميزات ومواصفات المنتج:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-[#E2E8F0]">
                      <div className="w-4 h-4 rounded-full bg-[#FFE600]/20 text-[#FFE600] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-[#1C1707] border border-[#382E0E] p-2 rounded-2xl">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                    className="p-2 rounded-xl bg-[#2D250B] hover:bg-[#382E0E] text-white disabled:opacity-40 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-mono font-black text-lg text-white">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    disabled={qty >= product.stock}
                    className="p-2 rounded-xl bg-[#2D250B] hover:bg-[#382E0E] text-white disabled:opacity-40 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => {
                    addToCart(product, qty);
                    setIsCartOpen(true);
                  }}
                  className="btn-phosphor flex-1 py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2.5 shadow-xl hover:scale-[1.02] transition cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5 text-black" />
                  <span>{inCart ? 'أضف المزيد للسلة' : 'إضافة إلى السلة'}</span>
                </button>

              </div>

              {/* Direct Buy Now Button */}
              <button
                onClick={handleBuyNow}
                className="w-full py-4 rounded-2xl text-sm font-black bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] transition cursor-pointer"
              >
                <CreditCard className="w-5 h-5" />
                <span>شراء فوري وإتمام الطلب ⚡</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-3 rounded-2xl bg-[#1C1707] border border-[#382E0E] text-center space-y-1">
                <Truck className="w-5 h-5 text-[#FFE600] mx-auto" />
                <span className="text-[10px] font-bold text-white block">شحن سريع</span>
                <span className="text-[9px] text-[#9CA3AF] block">كافة مدن المملكة</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#1C1707] border border-[#382E0E] text-center space-y-1">
                <ShieldCheck className="w-5 h-5 text-[#FFE600] mx-auto" />
                <span className="text-[10px] font-bold text-white block">ضمان سنتين</span>
                <span className="text-[9px] text-[#9CA3AF] block">ضمان سعودي معتمد</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#1C1707] border border-[#382E0E] text-center space-y-1">
                <RotateCcw className="w-5 h-5 text-[#FFE600] mx-auto" />
                <span className="text-[10px] font-bold text-white block">استرجاع 14 يوم</span>
                <span className="text-[9px] text-[#9CA3AF] block">استرجاع مجاني</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#1C1707] border border-[#382E0E] text-center space-y-1">
                <Lock className="w-5 h-5 text-[#FFE600] mx-auto" />
                <span className="text-[10px] font-bold text-white block">دفع آمن 100%</span>
                <span className="text-[9px] text-[#9CA3AF] block">مدى، أبل باي، تابي</span>
              </div>
            </div>

          </div>

        </div>

        {/* Customer Reviews Section */}
        <section className="space-y-6 pt-8 border-t border-[#382E0E]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>آراء وتقييمات العملاء</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#2D250B] text-[#FFE600] text-xs font-mono font-bold">
                  {product.rating} / 5
                </span>
              </h3>
              <p className="text-xs text-[#9CA3AF] font-bold mt-1">تجارب حقيقية من مشترين معتمدين بالمملكة العربية السعودية</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                name: 'سلطان القحطاني',
                city: 'الرياض',
                rating: 5,
                date: 'منذ يومين',
                comment: 'منتج ممتاز وجودة فاخرة جداً، والتوصيل وصلني في أقل من 48 ساعة بالرياض. أنصح به بشدة!',
              },
              {
                name: 'نورة العتيبي',
                city: 'جدة',
                rating: 5,
                date: 'منذ 5 أيام',
                comment: 'التغليف راقي وفخم والخامات ممتازة وأصلية 100%. تجربة تسوق سلسة وخدمة عملاء محترمة.',
              },
              {
                name: 'عبدالله الدوسري',
                city: 'الدمام',
                rating: 5,
                date: 'منذ أسبوع',
                comment: 'مطابق للوصف تماماً وسعره مع كود الخصم يعتبر فرصة لا تفوت. بإذن الله سأكرر الشراء.',
              },
            ].map((rev, i) => (
              <div key={i} className="p-5 rounded-3xl bg-[#1C1707] border border-[#382E0E] space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-black text-sm text-white block">{rev.name}</span>
                    <span className="text-[10px] text-[#9CA3AF]">{rev.city} • {rev.date}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    مشتري معتمد ✓
                  </span>
                </div>

                <div className="flex items-center text-[#FFE600]">
                  {Array.from({ length: rev.rating }).map((_, r) => (
                    <Star key={r} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-[#D1D5DB] leading-relaxed font-medium">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <section className="space-y-6 pt-8 border-t border-[#382E0E]">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">منتجات قد تعجبك أيضاً</h3>
              <p className="text-xs text-[#9CA3AF] font-bold mt-1">تشكيلة مختارة تتناسب مع اختيارك</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <div 
                  key={rel.id}
                  className="p-4 rounded-3xl demo-card shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <Link href={`/demo/store/${rel.id}`} className="block relative aspect-square rounded-2xl overflow-hidden bg-[#1C1707] border border-[#382E0E] group">
                      <img src={rel.image} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {rel.badge && (
                        <span className="btn-phosphor absolute top-2 right-2 px-2 py-1 rounded-xl text-[10px] font-black">
                          {rel.badge}
                        </span>
                      )}
                    </Link>

                    <div>
                      <span className="text-[10px] text-[#FFE600] font-black">{rel.category}</span>
                      <Link href={`/demo/store/${rel.id}`} className="block font-black text-sm text-white line-clamp-1 hover:text-[#FFE600] transition">
                        {rel.name}
                      </Link>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#382E0E] mt-3 flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black font-mono text-[#FFE600]">{rel.price}</span>
                      <span className="text-xs text-[#9CA3AF]">{settings.currency}</span>
                    </div>

                    <Link
                      href={`/demo/store/${rel.id}`}
                      className="btn-phosphor px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1"
                    >
                      <span>عرض</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Mobile Sticky Add to Cart Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-[#161205]/95 border-t border-[#382E0E] backdrop-blur-xl flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#9CA3AF]">السعر الإجمالي:</span>
          <span className="text-lg font-black font-mono text-[#FFE600]">
            {product.price * qty} {settings.currency}
          </span>
        </div>

        <button
          onClick={() => {
            addToCart(product, qty);
            setIsCartOpen(true);
          }}
          className="btn-phosphor flex-1 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-xl"
        >
          <ShoppingCart className="w-4 h-4 text-black" />
          <span>إضافة للسلة</span>
        </button>
      </div>

      {/* Global Drawers and Modals */}
      <CartDrawer />
      <LiveThemeDrawer />
      <SocialProofPopup />
      <PWAInstallBanner />
      <PriceAlertModal 
        product={priceAlertOpen ? product : null} 
        onClose={() => setPriceAlertOpen(false)} 
      />

      <StoreFooter />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <StoreProvider>
      <ProductDetailContent />
    </StoreProvider>
  );
}
