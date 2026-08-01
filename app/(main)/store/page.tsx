'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Package, ShieldCheck, Check, Sparkles, X, Plus, Minus, CreditCard, Eye, Star, Heart, Truck, RotateCcw, Headphones, Zap, MessageCircle, Clock, Shield, Lock, ThumbsUp, CheckCircle2 } from 'lucide-react';
import '@/app/demo/store/demo-store.css';

interface DemoProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  stock: number;
  image: string;
  description: string;
  badge?: string;
  rating: number;
  reviewsCount: number;
  features?: string[];
  isFlashDeal?: boolean;
}

interface BannerSlide {
  id: number;
  tag: string;
  saudiBadge: string;
  title: string;
  subtitle: string;
  code: string;
  ctaText: string;
  accentColor: string;
  imageUrl: string;
}

const HERO_SLIDES: BannerSlide[] = [
  {
    id: 1,
    saudiBadge: '🇸🇦 عروض المملكة الحصرية',
    tag: 'موسم العروض الكبرى 🎉',
    title: 'عروض الخصم الحصرية - وفر حتى 50%',
    subtitle: 'احصل على أفضل الأجهزة الذكية والعطور الفاخرة بأقل الأسعار في المملكة مع شحن سريع وتطبيقات الخصم الفوري.',
    code: 'KSA50',
    ctaText: 'تصفح عروض المملكة',
    accentColor: '#10B981',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=90'
  },
  {
    id: 2,
    saudiBadge: '👑 الجودة الملكية السعودية',
    tag: 'تشكيلة العطور والأناقة 🌸',
    title: 'عطور شرقية وفاخرة بنفحات العود الأصلي',
    subtitle: 'استمتع بثبات يدوم طويلاً مع تركيبة عطرية حصرية من أندر أنواع العود والصندل الملكي.',
    code: 'OUD15',
    ctaText: 'تسوق العود الملكي',
    accentColor: '#EC4899',
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=90'
  },
  {
    id: 3,
    saudiBadge: '💳 دفع سعودي آمن 100%',
    tag: 'دفع مرن وسهل 💳',
    title: 'قسّط مشترياتك بدون فوائد مع تابي وتمارا',
    subtitle: 'تسوق كل ما تحتاجه اليوم في السعودية وقسّم فاتورتك على 4 دفعات مريحة مع مدى وأبل باي بدون فوائد.',
    code: 'TABBYFREE',
    ctaText: 'اختر وسيلة الدفع',
    accentColor: '#3B82F6',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=90'
  }
];

const PRODUCTS: DemoProduct[] = [
  {
    id: 'p1',
    name: 'ساعة ذكية متميزة (Ultra Smart)',
    category: 'إلكترونيات',
    price: 349,
    oldPrice: 499,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=90',
    description: 'ساعة متوافقة مع جميع الهواتف الذكية مع شاشة AMOLED وقياس المؤشرات الحيوية وشحن سريع.',
    badge: 'الأكثر مبيعاً بالمملكة 🔥',
    rating: 4.8,
    reviewsCount: 124,
    features: ['شاشة AMOLED بدقة عالية', 'مقاومة للماء IP68', 'بطارية تدوم 7 أيام', 'قياس نبض القلب والأكسجين'],
    isFlashDeal: true
  },
  {
    id: 'p2',
    name: 'سماعات لاسلكية إلغاء الضوضاء (Pro ANC)',
    category: 'إلكترونيات',
    price: 279,
    oldPrice: 399,
    stock: 2,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=90',
    description: 'سماعات احترافية صوت محيطي عالي الدقة مع عزل ضوضاء نشط وبطارية تدوم 30 ساعة.',
    badge: 'باقي 2 قطع فقط!',
    rating: 4.6,
    reviewsCount: 89,
    features: ['عزل ضوضاء نشط ANC', 'بطارية 30 ساعة', 'مايكروفون مزدوج HD', 'بلوتوث 5.3'],
    isFlashDeal: true
  },
  {
    id: 'p3',
    name: 'عطر الفخامة الملكي بالعود والورد (50ml)',
    category: 'عطور',
    price: 199,
    oldPrice: 260,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=90',
    description: 'عطر شرقي فاخر بنفحات العود الكمبودي والصندل والمسك الأبيض لمناسباتك الخاصة.',
    badge: 'إصدار خاص 🇸🇦',
    rating: 4.9,
    reviewsCount: 203,
    features: ['عود كمبودي طبيعي 100%', 'ثبات يدوم +12 ساعة', 'عبوة فاخرة هدايا', 'تركيبة حصرية']
  },
  {
    id: 'p4',
    name: 'محفظة جلد طبيعي فاخرة حماية RFID',
    category: 'كماليات',
    price: 89,
    oldPrice: 120,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=90',
    description: 'مصنوعة من أجوَد أنواع الجلد الطبيعي بتصميم أنيق وحماية RFID للبطاقات البنكية.',
    badge: 'نفذت الكمية',
    rating: 4.3,
    reviewsCount: 56,
    features: ['جلد طبيعي إيطالي', 'حماية RFID', '8 فتحات للبطاقات', 'جيب عملات معدنية']
  },
  {
    id: 'p5',
    name: 'نظارة شمسية قطبية كلاسيكية (Polarized)',
    category: 'كماليات',
    price: 149,
    oldPrice: 210,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=90',
    description: 'حماية كاملة من الأشعة فوق البنفسجية UV400 مع هيكل خفيف الوزن من التيتانيوم.',
    rating: 4.5,
    reviewsCount: 77,
    features: ['عدسات بولاريزد', 'حماية UV400', 'هيكل تيتانيوم', 'علبة فاخرة مع قماشة تنظيف']
  },
  {
    id: 'p6',
    name: 'حقيبة ظهر للأعمال مقاومة للماء',
    category: 'أزياء',
    price: 229,
    oldPrice: 320,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=90',
    description: 'مساحة تتسع لجهاز 15.6 بوصة منفذ شحن USB خارجي وجيوب متعددة مخفية للأمان.',
    rating: 4.7,
    reviewsCount: 112,
    features: ['مقاومة للماء IPX4', 'منفذ USB خارجي', 'تتسع لـ 15.6 بوصة', 'جيوب مخفية مضادة للسرقة'],
    isFlashDeal: true
  }
];

const REVIEWS = [
  {
    id: 1,
    name: 'فهد السبيعي',
    location: 'الرياض',
    comment: 'ماشاء الله التوصيل كان خلال 24 ساعة للرياض وساعة Ultra Smart خرافية وجت بتغليف فاخر، جربت الدفع بمدى وكان سريع وفوري جداً! أنصح بالتعامل.',
    rating: 5,
    date: 'منذ يومين',
    purchasedProduct: 'ساعة ذكية متميزة (Ultra Smart)',
    verified: true,
    recommend: '100% يوصي بهذا المنتج'
  },
  {
    id: 2,
    name: 'منى الخالدي',
    location: 'جدة',
    comment: 'العطر ثباته فوق الـ 12 ساعة ونفحات العود كمبودي أصيل 100%! وشكراً لخدمة العملاء السعودية على التجاوب السريع والاحترافي بالواتساب.',
    rating: 5,
    date: 'منذ 3 أيام',
    purchasedProduct: 'عطر الفخامة الملكي بالعود',
    verified: true,
    recommend: '100% يوصي بهذا المنتج'
  },
  {
    id: 3,
    name: 'سعود الشمري',
    location: 'الدمام',
    comment: 'السماعات عزل الضوضاء فيها جبار وقسّطت المبلغ عبر تابي على 4 دفعات بدون أي فوائد أو تعقيدات. تجربة شراء ممتازة.',
    rating: 5,
    date: 'منذ أسبوع',
    purchasedProduct: 'سماعات لاسلكية (Pro ANC)',
    verified: true,
    recommend: '100% يوصي بهذا المنتج'
  },
  {
    id: 4,
    name: 'الجوهرة العتيبي',
    location: 'الخبر',
    comment: 'حقيبة الأعمال متينة جداً ومقاومة للماء وتتسع للمحمول وملحقاته مع منفذ الشحن. خيار رائع وجودة تصنيع عالية جداً.',
    rating: 5,
    date: 'منذ 5 أيام',
    purchasedProduct: 'حقيبة ظهر للأعمال مقاومة للماء',
    verified: true,
    recommend: '100% يوصي بهذا المنتج'
  }
];

const CATEGORY_ICONS: Record<string, string> = { 'الكل': '🏪', 'إلكترونيات': '📱', 'عطور': '🌸', 'كماليات': '💎', 'أزياء': '👜' };

export default function StorePage() {
  const [selectedCat, setSelectedCat] = useState('الكل');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<{ product: DemoProduct; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discountPct, setDiscountPct] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [detailProduct, setDetailProduct] = useState<DemoProduct | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);

  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 22 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, []);

  const categories = ['الكل', 'إلكترونيات', 'عطور', 'كماليات', 'أزياء'];

  const filteredProducts = PRODUCTS.filter(p => {
    const matchCat = selectedCat === 'الكل' || p.category === selectedCat;
    const matchSearch = !search || p.name.includes(search) || p.description.includes(search);
    return matchCat && matchSearch;
  });

  const flashDeals = PRODUCTS.filter(p => p.isFlashDeal);

  const addToCart = (product: DemoProduct) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item);
      return [...prev, { product, quantity: 1 }];
    });
    setAddedIds(prev => new Set(prev).add(product.id));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(product.id); return n; }), 1500);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) { const nq = item.quantity + delta; return nq > 0 ? { ...item, quantity: Math.min(nq, item.product.stock) } : null; }
      return item;
    }).filter(Boolean) as typeof cart);
  };

  const toggleWishlist = (id: string) => setWishlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === 'KSA50' || code === 'DEMO20' || code === 'STORE20') { setDiscountPct(20); setCouponMsg('تم تطبيق خصم 20% بنجاح! ✅'); }
    else if (code === 'OUD15') { setDiscountPct(15); setCouponMsg('تم تطبيق خصم 15% على العطور! ✅'); }
    else { setDiscountPct(0); setCouponMsg('كود غير صحيح — جرّب KSA50'); }
  };

  const cartSubtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const discountAmount = Math.round((cartSubtotal * discountPct) / 100);
  const cartTotal = cartSubtotal - discountAmount;
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  const renderStars = (rating: number) => (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(s => <Star key={s} size={15} style={{ color: s <= Math.round(rating) ? '#EAB308' : '#374151', fill: s <= Math.round(rating) ? '#EAB308' : 'none' }} />)}
    </div>
  );

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div dir="rtl" style={{ background: '#0B0D1F', color: '#E6E6EA', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Top Bar */}
      <div style={{ background: 'linear-gradient(90deg, #059669, #10B981)', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, fontSize: 14, fontWeight: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🇸🇦</span>
          <span>المتجر الإلكتروني السعودي الحديث — عروض حصرية وشحن مجاني لكافة مدن المملكة</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/demo/store/admin" style={{ background: 'rgba(0,0,0,0.25)', color: 'white', padding: '5px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}><ShieldCheck size={14} /> لوحة التحكم</Link>
          <Link href="/store/checkout" style={{ background: 'white', color: '#047857', padding: '5px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 700 }}>بوابة الدفع التفاعلية 💳</Link>
        </div>
      </div>

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(20,22,46,0.85)', backdropFilter: 'blur(14px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <Link href="/store" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/Darrow-1.png" alt="D-Arrow Logo" style={{ width: 100, height: 40, objectFit: 'contain' }} />
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: 'white', display: 'block', lineHeight: 1.2 }}>المتجر السعودي</span>
              <span style={{ fontSize: 10, color: '#9CA3AF' }}>Saudi E-Commerce</span>
            </div>
          </Link>

          <div style={{ flex: 1, maxWidth: 420, position: 'relative' }}>
            <Search size={17} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
            <input
              placeholder="ابحث عن منتج، عطر سعودي، ساعة..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 42px 10px 16px', background: 'rgba(11,13,31,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'white', outline: 'none', fontSize: 14 }}
            />
          </div>

          <button onClick={() => setIsCartOpen(true)} style={{ position: 'relative', background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', border: 'none', color: 'white', padding: '10px 18px', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14 }}>
            <ShoppingCart size={18} /> السلة
            {totalItems > 0 && (
              <span style={{ background: '#EF4444', width: 22, height: 22, borderRadius: '50%', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: -6, left: -6, border: '2px solid #0B0D1F', fontWeight: 800 }}>{totalItems}</span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Banner Slider */}
      <section style={{ maxWidth: 1200, margin: '24px auto 0', padding: '0 24px' }}>
        <div style={{ borderRadius: 24, background: 'linear-gradient(135deg, #10122B 0%, #1A1C3B 100%)', border: `1px solid ${slide.accentColor}40`, padding: '40px 36px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, alignItems: 'center', position: 'relative', overflow: 'hidden', minHeight: 300, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ background: `${slide.accentColor}20`, border: `1px solid ${slide.accentColor}40`, color: slide.accentColor, padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                {slide.saudiBadge}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.06)', color: '#D1D5DB', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                {slide.tag}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(24px,3.8vw,36px)', fontWeight: 800, margin: '0 0 12px', color: '#FFFFFF', lineHeight: 1.3 }}>
              {slide.title}
            </h1>
            <p style={{ color: '#D1D5DB', fontSize: 14, margin: '0 0 24px', lineHeight: 1.6 }}>{slide.subtitle}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <button onClick={() => { setSelectedCat('الكل'); setSearch(''); }} style={{ background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', border: 'none', padding: '13px 26px', borderRadius: 12, fontWeight: 800, cursor: 'pointer', fontSize: 14, boxShadow: '0 8px 25px rgba(255,77,109,0.35)' }}>
                {slide.ctaText}
              </button>
              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px dashed rgba(255,255,255,0.2)', padding: '9px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#FF9A3C' }}>
                كود الخصم: <span style={{ fontFamily: 'monospace', fontSize: 15, color: '#22C55E' }}>{slide.code}</span>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 2, height: 230, borderRadius: 22, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', background: '#14162E', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
            <img src={slide.imageUrl} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{ maxWidth: 1200, margin: '28px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {[
            { icon: <Truck size={24} style={{ color: '#10B981' }} />, title: 'شحن سريع بالمملكة 🇸🇦', sub: 'توصيل خلال 24-48 ساعة' },
            { icon: <ShieldCheck size={24} style={{ color: '#3B82F6' }} />, title: 'ضمان أصلي 100%', sub: 'منتجات عالية الجودة' },
            { icon: <Lock size={24} style={{ color: '#F59E0B' }} />, title: 'دفع آمن ومشفر', sub: 'مدى، أبل باي، فيزا' },
            { icon: <RotateCcw size={24} style={{ color: '#EC4899' }} />, title: 'استرجاع مجاني 14 يوم', sub: 'بدون أي تعقيدات' },
            { icon: <Headphones size={24} style={{ color: '#8B5CF6' }} />, title: 'دعم سعودي 24/7', sub: 'خدمة عملاء فورية' },
          ].map((item, idx) => (
            <div key={idx} className="trust-badge-item">
              <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px', color: 'white' }}>{item.title}</h4>
              <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Flash Sale */}
      <section style={{ maxWidth: 1200, margin: '36px auto 0', padding: '0 24px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(245,158,11,0.12))', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 24, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ background: '#EF4444', color: 'white', padding: 8, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'white' }}>تخفيضات خاطفة بالمملكة ⚡ (Flash Sale)</h2>
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>عروض محدودة بالكمية والوقت!</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={16} /> ينتهي العرض خلال:
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                <div className="countdown-box"><span style={{ color: '#FF4D6D', fontWeight: 800, fontSize: 16 }}>{String(timeLeft.hours).padStart(2, '0')}</span><span style={{ fontSize: 9, color: '#9CA3AF', display: 'block' }}>ساعة</span></div>
                <div className="countdown-box"><span style={{ color: '#FF9A3C', fontWeight: 800, fontSize: 16 }}>{String(timeLeft.minutes).padStart(2, '0')}</span><span style={{ fontSize: 9, color: '#9CA3AF', display: 'block' }}>دقيقة</span></div>
                <div className="countdown-box"><span style={{ color: '#10B981', fontWeight: 800, fontSize: 16 }}>{String(timeLeft.seconds).padStart(2, '0')}</span><span style={{ fontSize: 9, color: '#9CA3AF', display: 'block' }}>ثانية</span></div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {flashDeals.map(p => (
              <div key={p.id} style={{ background: 'rgba(20,22,46,0.7)', borderRadius: 16, padding: 14, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 14, alignItems: 'center' }}>
                <img src={p.image} alt="" style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 700 }}>خصم خاص</span>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: '2px 0 6px', color: 'white' }}>{p.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#22C55E', fontWeight: 800, fontSize: 16 }}>{p.price} ر.س</span>
                    {p.oldPrice && <span style={{ color: '#6B7280', textDecoration: 'line-through', fontSize: 12 }}>{p.oldPrice} ر.س</span>}
                  </div>
                  <button onClick={() => addToCart(p)} style={{ marginTop: 8, width: '100%', padding: '6px', background: 'linear-gradient(135deg,#EF4444,#F59E0B)', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    اطلب الآن قبل النفاد
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ maxWidth: 1200, margin: '36px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              style={{
                padding: '10px 20px', borderRadius: 12, border: '1px solid',
                borderColor: selectedCat === cat ? '#FF4D6D' : 'rgba(255,255,255,0.08)',
                background: selectedCat === cat ? 'rgba(255,77,109,0.15)' : 'rgba(20,22,46,0.5)',
                color: selectedCat === cat ? '#FF4D6D' : '#9CA3AF',
                cursor: 'pointer', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', transition: '0.2s',
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <span>{CATEGORY_ICONS[cat]}</span> {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section style={{ maxWidth: 1200, margin: '28px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'white' }}>جميع المنتجات بالمملكة <span style={{ color: '#6B7280', fontWeight: 500, fontSize: 14 }}>({filteredProducts.length})</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {filteredProducts.map((product) => {
            const isOutOfStock = product.stock <= 0;
            const isLowStock = product.stock > 0 && product.stock <= 3;
            const discPct = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

            return (
              <div
                key={product.id}
                className="demo-card"
                style={{
                  background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20,
                  overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.35s ease',
                  position: 'relative'
                }}
              >
                <div onClick={() => setDetailProduct(product)} style={{ height: 230, position: 'relative', overflow: 'hidden', background: '#14162E', cursor: 'pointer' }}>
                  <img className="demo-card-img" src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                  {discPct > 0 && (
                    <span style={{ position: 'absolute', top: 12, left: 12, background: '#EF4444', color: 'white', padding: '4px 10px', borderRadius: 10, fontSize: 12, fontWeight: 800 }}>-{discPct}%</span>
                  )}
                  {product.badge && (
                    <span style={{ position: 'absolute', top: 12, right: 12, background: isOutOfStock ? 'rgba(239,68,68,0.9)' : isLowStock ? 'rgba(245,158,11,0.9)' : 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', padding: '4px 12px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>
                      {product.badge}
                    </span>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }} style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: wishlist.has(product.id) ? '#EF4444' : '#9CA3AF' }}>
                    <Heart size={15} fill={wishlist.has(product.id) ? '#EF4444' : 'none'} />
                  </button>
                </div>

                <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#FF4D6D', fontWeight: 600 }}>{product.category}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={13} style={{ color: '#EAB308', fill: '#EAB308' }} />
                        <span style={{ fontSize: 12, color: '#EAB308', fontWeight: 700 }}>{product.rating}</span>
                        <span style={{ fontSize: 11, color: '#6B7280' }}>({product.reviewsCount})</span>
                      </div>
                    </div>
                    <h3 onClick={() => setDetailProduct(product)} style={{ fontSize: 16, fontWeight: 700, color: 'white', margin: '0 0 8px', lineHeight: 1.4, cursor: 'pointer' }}>{product.name}</h3>
                    <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 14px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.description}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <span style={{ fontSize: 21, fontWeight: 800, color: '#22C55E' }}>{product.price} ر.س</span>
                      {product.oldPrice && <span style={{ fontSize: 14, color: '#6B7280', textDecoration: 'line-through' }}>{product.oldPrice} ر.س</span>}
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="demo-btn-add"
                        onClick={() => addToCart(product)}
                        disabled={isOutOfStock}
                        style={{
                          flex: 1, padding: '11px 12px', borderRadius: 12,
                          background: isOutOfStock ? '#374151' : addedIds.has(product.id) ? '#22C55E' : 'linear-gradient(135deg,#FF4D6D,#FF9A3C)',
                          color: 'white', border: 'none', cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                          fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: '0.3s'
                        }}
                      >
                        {isOutOfStock ? <><Package size={15} /> غير متوفر</> : addedIds.has(product.id) ? <><Check size={15} /> تمت الإضافة</> : <><ShoppingCart size={15} /> أضف للسلة</>}
                      </button>
                      <Link href="/store/checkout" style={{ padding: '11px 14px', borderRadius: 12, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                        <CreditCard size={15} /> الشراء
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Customer Reviews */}
      <section style={{ maxWidth: 1200, margin: '48px auto 0', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ background: 'rgba(255,77,109,0.15)', color: '#FF4D6D', border: '1px solid rgba(255,77,109,0.25)', padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>ثقة عملائنا في السعودية 💕</span>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: 'white', margin: '10px 0 6px' }}>ماذا يقول عملاؤنا بالمملكة؟</h2>
          <p style={{ color: '#9CA3AF', fontSize: 14, margin: 0 }}>تقييمات حقيقية من مشترين موثقين عبر مختلف مدن المملكة 🇸🇦</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 24 }}>
          {REVIEWS.map((rev) => (
            <div key={rev.id} style={{ background: 'rgba(20,22,46,0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  {renderStars(rev.rating)}
                  <span style={{ fontSize: 11, color: '#6B7280' }}>{rev.date}</span>
                </div>
                
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: 8, fontSize: 11, color: '#FF9A3C', fontWeight: 600, display: 'inline-block', marginBottom: 12 }}>
                  قام بشراء: {rev.purchasedProduct}
                </div>

                <p style={{ fontSize: 13, color: '#E6E6EA', lineHeight: 1.7, margin: '0 0 16px' }}>"{rev.comment}"</p>
              </div>

              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, color: 'white', flexShrink: 0 }}>
                    {rev.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: 'white', margin: 0 }}>{rev.name}</h4>
                      <CheckCircle2 size={14} style={{ color: '#10B981' }} />
                    </div>
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>مشتري موثق 🇸🇦 — {rev.location}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 11, color: '#10B981', fontWeight: 600 }}>
                  <ThumbsUp size={12} /> {rev.recommend}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Payment Gateway CTA Section */}
      <section style={{ maxWidth: 1200, margin: '56px auto 0', padding: '0 24px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(20,22,46,0.9), rgba(11,13,31,0.95))', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 28, padding: '48px 36px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
              <Lock size={14} /> بوابة دفع إلكترونية تفاعلية 🇸🇦
            </div>

            <h2 style={{ fontSize: 'clamp(22px,3.5vw,30px)', fontWeight: 800, color: 'white', margin: '0 0 12px' }}>جرّب بوابة الدفع الإلكتروني الآمنة</h2>
            <p style={{ color: '#9CA3AF', fontSize: 15, margin: '0 auto 28px', maxWidth: 600, lineHeight: 1.7 }}>
              بوابة دفع متكاملة تدعم مدى، أبل باي، فيزا، تابي، تمارا، والتحويل البنكي — مع نموذج إدخال بطاقة تفاعلي ومعالجة دفع مباشرة وفاتورة إلكترونية
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
              {[
                { name: 'مدى 🇸🇦', color: '#10B981' },
                { name: 'أبل باي Apple Pay', color: '#FFFFFF' },
                { name: 'فيزا Visa / MC 💳', color: '#3B82F6' },
                { name: 'تابي Tabby 💚', color: '#34D399' },
                { name: 'تمارا Tamara 🧡', color: '#FB923C' },
                { name: 'تحويل بنكي 🏦', color: '#A855F7' },
              ].map((pm, i) => (
                <div key={i} style={{ background: `${pm.color}10`, border: `1px solid ${pm.color}30`, borderRadius: 12, padding: '8px 14px', fontSize: 12, fontWeight: 700, color: pm.color }}>
                  {pm.name}
                </div>
              ))}
            </div>

            <Link href="/store/checkout" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'linear-gradient(135deg, #10B981, #059669)',
              color: 'white', padding: '16px 36px', borderRadius: 16,
              textDecoration: 'none', fontWeight: 800, fontSize: 17,
              boxShadow: '0 10px 40px rgba(16,185,129,0.3)'
            }}>
              <CreditCard size={22} /> الدخول إلى بوابة الدفع التفاعلية الآن
            </Link>

            <p style={{ fontSize: 12, color: '#6B7280', marginTop: 14 }}>
              تجريبية بالكامل — تجربة دفع آمنة ومشفرة 100%
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 2, marginTop: 32, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '14px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#10B981', fontWeight: 600 }}>
              <ShieldCheck size={16} /> تشفير 256-bit SSL
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#3B82F6', fontWeight: 600 }}>
              <Shield size={16} /> PCI-DSS Compliant
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#F59E0B', fontWeight: 600 }}>
              <CheckCircle2 size={16} /> دفع موثق ومضمون
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: 80, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
          <div>
            <img src="/Darrow-1.png" alt="D-Arrow Logo" style={{ width: 100, height: 40, objectFit: 'contain', marginBottom: 12 }} />
            <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>هذا المتجر نسخة استعراضية من سكريبت المتجر الإلكتروني السعودي المتكامل مع لوحة التحكم. تم تطويره بواسطة فريق D-Arrow.</p>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 12, fontSize: 14 }}>وسائل الدفع المدعومة بالمملكة</h4>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['مدى Mada 🇸🇦', 'Apple Pay', 'Visa', 'Mastercard', 'Tabby تابي', 'Tamara تمارا'].map(m => (
                <span key={m} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: 8, fontSize: 12, color: '#D1D5DB', fontWeight: 600 }}>{m}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '24px auto 0', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', fontSize: 12, color: '#6B7280' }}>
          قالب استعراضي — تم تطويره بواسطة <span style={{ color: '#FF4D6D', fontWeight: 700 }}>D-Arrow</span> للتسويق الرقمي بالسعودية | جميع الحقوق محفوظة © 2026 🇸🇦
        </div>
      </footer>

      {/* Floating WhatsApp Support Button */}
      <a href="https://wa.me/966000000000" target="_blank" rel="noopener noreferrer" className="floating-support-btn" title="تواصل معنا عبر الواتساب">
        <MessageCircle size={28} />
      </a>

      {renderCartDrawer()}
    </div>
  );

  function renderCartDrawer() {
    if (!isCartOpen) return null;
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', zIndex: 50, display: 'flex', justifyContent: 'flex-start' }} onClick={() => setIsCartOpen(false)}>
        <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 440, background: '#10122B', borderLeft: '1px solid rgba(255,77,109,0.15)', height: '100%', display: 'flex', flexDirection: 'column', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShoppingCart size={20} style={{ color: '#FF4D6D' }} />
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>سلة التسوق ({totalItems})</h3>
            </div>
            <button onClick={() => setIsCartOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#9CA3AF', cursor: 'pointer', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#6B7280' }}>
                <ShoppingCart size={44} style={{ opacity: 0.2, margin: '0 auto 12px' }} />
                <p style={{ margin: 0, fontSize: 14 }}>سلة التسوق فارغة</p>
              </div>
            ) : cart.map(item => (
              <div key={item.product.id} style={{ display: 'flex', gap: 12, background: 'rgba(20,22,46,0.5)', padding: 12, borderRadius: 14, border: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
                <img src={item.product.image} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px', color: 'white', lineHeight: 1.3 }}>{item.product.name}</h4>
                  <span style={{ fontSize: 13, color: '#22C55E', fontWeight: 700 }}>{item.product.price * item.quantity} ر.س</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 3 }}>
                  <button onClick={() => updateQuantity(item.product.id, -1)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 2 }}><Minus size={13} /></button>
                  <span style={{ fontSize: 13, fontWeight: 700, padding: '0 5px', minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, 1)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 2 }}><Plus size={13} /></button>
                </div>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, marginTop: 16 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <input placeholder="كود الخصم (KSA50)" value={coupon} onChange={e => setCoupon(e.target.value)} style={{ flex: 1, padding: 9, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: 'white', fontSize: 13, outline: 'none' }} />
                <button onClick={applyCoupon} style={{ background: 'rgba(255,77,109,0.15)', border: '1px solid rgba(255,77,109,0.3)', color: '#FF4D6D', padding: '0 14px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>تطبيق</button>
              </div>
              {couponMsg && <p style={{ fontSize: 12, color: discountPct > 0 ? '#22C55E' : '#EF4444', margin: '0 0 10px' }}>{couponMsg}</p>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: '#9CA3AF', marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>المجموع الفرعي:</span><span>{cartSubtotal} ر.س</span></div>
                {discountPct > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22C55E' }}><span>خصم {discountPct}%:</span><span>-{discountAmount} ر.س</span></div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 800, color: 'white', paddingTop: 8, borderTop: '1px dashed rgba(255,255,255,0.08)' }}>
                  <span>الإجمالي:</span><span style={{ color: '#22C55E' }}>{cartTotal} ر.س</span>
                </div>
              </div>

              <Link href="/store/checkout" onClick={() => setIsCartOpen(false)} style={{ width: '100%', padding: 13, borderRadius: 12, background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', border: 'none', fontWeight: 800, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}>
                <CreditCard size={18} /> إتمام الشراء — بوابة الدفع التفاعلية
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }
}
