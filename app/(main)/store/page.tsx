'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, Search, Package, ShieldCheck, Check, Sparkles, X, Plus, Minus, CreditCard, Eye, Heart, Truck, RotateCcw, Headphones, Zap, MessageCircle, Clock, Lock, ChevronRight, ChevronLeft, CheckCircle2, ThumbsUp } from 'lucide-react';
import { useCart } from '@/components/store/CartContext';
import '@/app/demo/store/demo-store.css';

interface DemoProduct {
  id: string;
  name: string;
  nameAr?: string;
  category: string;
  price: number;
  oldPrice?: number;
  salePrice?: number;
  stock: number;
  image: string;
  description: string;
  descriptionAr?: string;
  badge?: string;
  rating: number;
  reviewsCount: number;
  features?: string[];
  isFlashDeal?: boolean;
  slug?: string;
}

interface BannerSlide {
  id: number;
  saudiBadge: string;
  tag: string;
  title: string;
  subtitle: string;
  code: string;
  bgGradient: string;
  ctaText: string;
  icon: string;
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
    bgGradient: 'linear-gradient(135deg, #1E1B4B 0%, #311B92 50%, #4A148C 100%)',
    ctaText: 'تصفح عروض المملكة',
    icon: '⚡',
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
    bgGradient: 'linear-gradient(135deg, #831843 0%, #9D174D 50%, #500724 100%)',
    ctaText: 'تسوق العود الملكي',
    icon: '🌸',
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
    bgGradient: 'linear-gradient(135deg, #064E3B 0%, #047857 50%, #022C22 100%)',
    ctaText: 'اختر وسيلة الدفع',
    icon: '💳',
    accentColor: '#3B82F6',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=90'
  }
];

const STATIC_PRODUCTS: DemoProduct[] = [
  {
    id: 'p1',
    name: 'ساعة ذكية متميزة (Ultra Smart)',
    nameAr: 'ساعة ذكية متميزة (Ultra Smart)',
    category: 'إلكترونيات',
    price: 349,
    oldPrice: 499,
    salePrice: 349,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=90',
    description: 'ساعة متوافقة مع جميع الهواتف الذكية مع شاشة AMOLED وقياس المؤشرات الحيوية وشحن سريع.',
    descriptionAr: 'ساعة متوافقة مع جميع الهواتف الذكية مع شاشة AMOLED وقياس المؤشرات الحيوية وشحن سريع.',
    badge: 'الأكثر مبيعاً بالمملكة 🔥',
    rating: 4.8,
    reviewsCount: 124,
    features: ['شاشة AMOLED بدقة عالية', 'مقاومة للماء IP68', 'بطارية تدوم 7 أيام'],
    isFlashDeal: true,
    slug: 'ultra-smart-watch'
  },
  {
    id: 'p2',
    name: 'سماعات لاسلكية إلغاء الضوضاء (Pro ANC)',
    nameAr: 'سماعات لاسلكية إلغاء الضوضاء (Pro ANC)',
    category: 'إلكترونيات',
    price: 279,
    oldPrice: 399,
    salePrice: 279,
    stock: 2,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=90',
    description: 'سماعات احترافية صوت محيطي عالي الدقة مع عزل ضوضاء نشط وبطارية تدوم 30 ساعة.',
    descriptionAr: 'سماعات احترافية صوت محيطي عالي الدقة مع عزل ضوضاء نشط وبطارية تدوم 30 ساعة.',
    badge: 'باقي 2 فقط!',
    rating: 4.6,
    reviewsCount: 89,
    features: ['عزل ضوضاء نشط ANC', 'بطارية 30 ساعة'],
    isFlashDeal: true,
    slug: 'pro-anc-headphones'
  },
  {
    id: 'p3',
    name: 'عطر الفخامة الملكي بالعود والورد (50ml)',
    nameAr: 'عطر الفخامة الملكي بالعود والورد (50ml)',
    category: 'عطور',
    price: 199,
    oldPrice: 260,
    salePrice: 199,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=90',
    description: 'عطر شرقي فاخر بنفحات العود الكمبودي والصندل والمسك الأبيض لمناسباتك الخاصة.',
    descriptionAr: 'عطر شرقي فاخر بنفحات العود الكمبودي والصندل والمسك الأبيض لمناسباتك الخاصة.',
    badge: 'إصدار خاص 🇸🇦',
    rating: 4.9,
    reviewsCount: 203,
    features: ['عود كمبودي طبيعي 100%', 'ثبات يدوم +12 ساعة'],
    slug: 'royal-luxury-perfume'
  },
  {
    id: 'p4',
    name: 'محفظة جلد طبيعي فاخرة',
    nameAr: 'محفظة جلد طبيعي فاخرة',
    category: 'كماليات',
    price: 89,
    oldPrice: 120,
    salePrice: 89,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=90',
    description: 'مصنوعة من أجوَد أنواع الجلد الطبيعي بتصميم أنيق وحماية RFID للبطاقات.',
    descriptionAr: 'مصنوعة من أجوَد أنواع الجلد الطبيعي بتصميم أنيق وحماية RFID للبطاقات.',
    badge: 'نفذت الكمية',
    rating: 4.3,
    reviewsCount: 56,
    slug: 'luxury-leather-wallet'
  },
  {
    id: 'p5',
    name: 'نظارة شمسية قطبية كلاسيكية (Polarized)',
    nameAr: 'نظارة شمسية قطبية كلاسيكية (Polarized)',
    category: 'كماليات',
    price: 149,
    oldPrice: 210,
    salePrice: 149,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=90',
    description: 'حماية كاملة من الأشعة فوق البنفسجية UV400 مع هيكل خفيف الوزن من التيتانيوم.',
    descriptionAr: 'حماية كاملة من الأشعة فوق البنفسجية UV400 مع هيكل خفيف الوزن من التيتانيوم.',
    rating: 4.5,
    reviewsCount: 77,
    slug: 'polarized-sunglasses'
  },
  {
    id: 'p6',
    name: 'حقيبة ظهر للأعمال مقاومة للماء',
    nameAr: 'حقيبة ظهر للأعمال مقاومة للماء',
    category: 'أزياء',
    price: 229,
    oldPrice: 320,
    salePrice: 229,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=90',
    description: 'مساحة تتسع لجهاز 15.6 بوصة منفذ شحن USB خارجي وجيوب متعددة مخفية للأمان.',
    descriptionAr: 'مساحة تتسع لجهاز 15.6 بوصة منفذ شحن USB خارجي وجيوب متعددة مخفية للأمان.',
    rating: 4.7,
    reviewsCount: 112,
    isFlashDeal: true,
    slug: 'waterproof-backpack'
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
    comment: 'السماعات عزل الضوضاء فيها جبار وقسّطت المبلغ عبر تابي على 4 دفعات بدون أي فوائد أو تعقيدات. تجربة شراءممتازة.',
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

const PAYMENT_GATEWAYS = [
  {
    id: 'mada',
    name: 'مدى Mada 🇸🇦',
    tag: 'الدفع الفوري البنكي',
    desc: 'البطاقات السعودية المباشرة',
    bg: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.05))',
    borderColor: '#10B981',
    iconColor: '#10B981',
    badgeText: 'معتمد رسمياً بالمملكة'
  },
  {
    id: 'applepay',
    name: 'أبل باي Apple Pay ',
    tag: 'نقرة واحدة آمنة',
    desc: 'دفع سريع لمستخدمي آيفون',
    bg: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))',
    borderColor: 'rgba(255,255,255,0.2)',
    iconColor: '#FFFFFF',
    badgeText: 'أسرع طريقة خروج'
  },
  {
    id: 'tabby',
    name: 'تابي Tabby 💚',
    tag: 'قسّمها على 4 دفعات',
    desc: 'بدون أي فوائد أو رسوم',
    bg: 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(16,185,129,0.05))',
    borderColor: '#34D399',
    iconColor: '#34D399',
    badgeText: 'بدون فوائد 0%'
  },
  {
    id: 'tamara',
    name: 'تمارا Tamara <ctrl42>',
    tag: 'ادفع بعدين أو قسّط',
    desc: 'مرونة كاملة بالدفع',
    bg: 'linear-gradient(135deg, rgba(251,146,60,0.15), rgba(245,158,11,0.05))',
    borderColor: '#FB923C',
    iconColor: '#FB923C',
    badgeText: 'قسط أو ادفع بعدين'
  },
  {
    id: 'cards',
    name: 'فيزا وماستركارد 💳',
    tag: 'بطاقات ائتمانية تشفير 256',
    desc: 'دفع آمن عالمي ومحلي',
    bg: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.05))',
    borderColor: '#3B82F6',
    iconColor: '#3B82F6',
    badgeText: 'حماية SSL كاملة'
  },
  {
    id: 'bank',
    name: 'تحويل بنكي محلي 🏦',
    tag: 'الراجحي، الأهلي، الإنماء',
    desc: 'تحويل مباشر مع تأكيد',
    bg: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(147,51,234,0.05))',
    borderColor: '#A855F7',
    iconColor: '#A855F7',
    badgeText: 'بنوك المملكة'
  }
];

export default function StorePage() {
  const [products, setProducts] = useState<any[]>(STATIC_PRODUCTS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>(['إلكترونيات', 'عطور', 'كماليات', 'أزياء', 'قوالب ومتاجر']);
  const { addItem, itemCount } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 22 });

  useEffect(() => {
    fetch('/api/store/products?status=published')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.products && d.products.length > 0) {
          const dbProds = d.products.map((p: any) => {
            const imgs = p.images ? (typeof p.images === 'string' ? JSON.parse(p.images) : p.images) : [];
            return {
              id: p.id,
              name: p.nameAr || p.name,
              nameAr: p.nameAr || p.name,
              category: p.categoryAr || p.category || 'قوالب ومتاجر',
              price: p.price,
              oldPrice: p.price + 200,
              salePrice: p.salePrice || p.price,
              stock: 10,
              image: imgs[0] || '/projects-showcase/store-preview.png',
              description: p.descriptionAr || p.description,
              descriptionAr: p.descriptionAr || p.description,
              badge: p.featured ? 'مميز 🔥' : undefined,
              rating: 5.0,
              reviewsCount: 18,
              slug: p.slug
            };
          });
          setProducts([...dbProds, ...STATIC_PRODUCTS]);
        }
      })
      .catch(err => console.error(err));
  }, []);

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

  const handleAdd = (product: any) => {
    addItem({
      productId: product.id,
      name: product.name,
      nameAr: product.nameAr || product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.image || '',
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const toggleWishlist = (id: string) => setWishlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.nameAr?.includes(search) || p.description?.includes(search);
    const matchCat = category === 'all' || p.category === category;
    return matchSearch && matchCat;
  });

  const flashDeals = products.filter(p => p.isFlashDeal || p.badge === 'الأكثر مبيعاً بالمملكة 🔥' || p.badge === 'باقي 2 فقط!');

  const renderStars = (rating: number) => (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(s => <Star key={s} size={15} style={{ color: s <= Math.round(rating) ? '#EAB308' : '#374151', fill: s <= Math.round(rating) ? '#EAB308' : 'none' }} />)}
    </div>
  );

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section dir="rtl" style={{ minHeight: '100vh', padding: '60px 24px 80px', background: '#0B0D1F', color: '#E6E6EA', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 800, marginBottom: 12 }}>
            <span style={{ background: 'linear-gradient(135deg, #FF4D6D, #FF9A3C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>المتجر السعودي</span> الرقمي 🇸🇦
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: 17, maxWidth: 600, margin: '0 auto' }}>
            أدوات، منتجات وقوالب متكاملة مع سكريبتات الإدارة والتسويق الاحترافي بالمملكة
          </p>
        </div>

        {/* Hero Offer Poster Slider */}
        <div style={{ borderRadius: 24, background: slide.bgGradient, border: '1px solid rgba(255,77,109,0.25)', padding: '40px 36px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, alignItems: 'center', position: 'relative', overflow: 'hidden', minHeight: 290, marginBottom: 36 }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ background: `${slide.accentColor}20`, border: `1px solid ${slide.accentColor}40`, color: slide.accentColor, padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                {slide.saudiBadge}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.06)', color: '#D1D5DB', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                {slide.tag}
              </span>
            </div>
            
            <h2 style={{ fontSize: 'clamp(22px,3.5vw,34px)', fontWeight: 800, margin: '0 0 10px', color: '#FFFFFF', lineHeight: 1.3 }}>
              {slide.title}
            </h2>
            <p style={{ color: '#D1D5DB', fontSize: 14, margin: '0 0 20px', lineHeight: 1.6 }}>{slide.subtitle}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <button onClick={() => { setCategory('all'); setSearch(''); }} style={{ background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: 14, boxShadow: '0 8px 25px rgba(255,77,109,0.3)' }}>
                {slide.ctaText}
              </button>
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px dashed rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#FF9A3C' }}>
                كود الخصم: <span style={{ fontFamily: 'monospace', color: '#22C55E' }}>{slide.code}</span>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 2, height: 230, borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', background: '#14162E', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 30px rgba(0,0,0,0.3)' }}>
            <img src={slide.imageUrl} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Slider Dots */}
          <div style={{ position: 'absolute', bottom: 16, right: 36, display: 'flex', gap: 8, zIndex: 3 }}>
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: currentSlide === idx ? 32 : 10,
                  height: 10,
                  borderRadius: 5,
                  background: currentSlide === idx ? '#FF4D6D' : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Trust & Features Icon Badges Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 36 }}>
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

        {/* Flash Deals Section with Live Countdown Timer */}
        <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(245,158,11,0.12))', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 24, padding: 24, marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ background: '#EF4444', color: 'white', padding: 8, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'white' }}>تخفيضات خاطفة بالمملكة ⚡ (Flash Sale)</h3>
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>عروض حصرية محدودة بالكمية والوقت!</span>
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
            {flashDeals.slice(0, 3).map(p => (
              <div key={p.id} style={{ background: 'rgba(20,22,46,0.7)', borderRadius: 16, padding: 14, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 14, alignItems: 'center' }}>
                <img src={p.image} alt="" style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 700 }}>خصم خاص</span>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: '2px 0 6px', color: 'white' }}>{p.nameAr || p.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#22C55E', fontWeight: 800, fontSize: 16 }}>{p.salePrice || p.price} ر.س</span>
                    {p.oldPrice && <span style={{ color: '#6B7280', textDecoration: 'line-through', fontSize: 12 }}>{p.oldPrice} ر.س</span>}
                  </div>
                  <button onClick={() => handleAdd(p)} style={{ marginTop: 8, width: '100%', padding: '6px', background: 'linear-gradient(135deg,#EF4444,#F59E0B)', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    اطلب الآن قبل النفاد
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters Bar */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flex: 1 }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
              <Search size={18} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
              <input
                placeholder="ابحث عن منتج، قالب، أو خدمة..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '12px 44px 12px 16px', background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,77,109,0.15)', borderRadius: 12, color: '#E6E6EA', fontSize: 14, outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => setCategory('all')}
                style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid', borderColor: category === 'all' ? '#FF4D6D' : 'rgba(255,77,109,0.15)', background: category === 'all' ? 'rgba(255,77,109,0.15)' : 'transparent', color: category === 'all' ? '#FF4D6D' : '#9CA3AF', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
              >الكل</button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid', borderColor: category === cat ? '#FF4D6D' : 'rgba(255,77,109,0.15)', background: category === cat ? 'rgba(255,77,109,0.15)' : 'transparent', color: category === cat ? '#FF4D6D' : '#9CA3AF', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
                >{cat}</button>
              ))}
            </div>
          </div>
          <Link href="/store/cart" style={{ position: 'relative', padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14 }}>
            <ShoppingCart size={18} />
            السلة
            {itemCount > 0 && (
              <span style={{ position: 'absolute', top: -8, left: -8, width: 22, height: 22, borderRadius: '50%', background: '#EF4444', color: 'white', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{itemCount}</span>
            )}
          </Link>
        </div>

        {/* Products Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24, marginBottom: 48 }}>
          {filtered.map(product => {
            const nameText = product.nameAr || product.name;
            const linkHref = product.slug ? `/store/${product.slug}` : `/demo/store/${product.id}`;

            return (
              <div
                key={product.id}
                className="demo-card"
                style={{
                  background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20,
                  overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative'
                }}
              >
                <Link href={linkHref} style={{ height: 230, position: 'relative', overflow: 'hidden', background: '#14162E', display: 'block' }}>
                  <img className="demo-card-img" src={product.image} alt={nameText} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                  {product.badge && (
                    <span style={{ position: 'absolute', top: 12, right: 12, background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                      {product.badge}
                    </span>
                  )}
                  <button onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }} style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: wishlist.has(product.id) ? '#EF4444' : '#9CA3AF' }}>
                    <Heart size={15} fill={wishlist.has(product.id) ? '#EF4444' : 'none'} />
                  </button>
                </Link>

                <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#FF4D6D', fontWeight: 600 }}>{product.category || 'عام'}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={13} style={{ color: '#EAB308', fill: '#EAB308' }} />
                        <span style={{ fontSize: 12, color: '#EAB308', fontWeight: 700 }}>{product.rating || 4.9}</span>
                      </div>
                    </div>
                    <Link href={linkHref} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', margin: '0 0 8px', lineHeight: 1.4 }}>{nameText}</h3>
                    </Link>
                    <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 14px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.descriptionAr || product.description || 'منتج عالي الجودة مع دعم ومميزات متكاملة.'}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <span style={{ fontSize: 21, fontWeight: 800, color: '#22C55E' }}>{product.salePrice || product.price} ر.س</span>
                      {product.oldPrice && <span style={{ fontSize: 14, color: '#6B7280', textDecoration: 'line-through' }}>{product.price} ر.س</span>}
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="demo-btn-add"
                        onClick={() => handleAdd(product)}
                        style={{
                          flex: 1, padding: '11px 12px', borderRadius: 12,
                          background: addedId === product.id ? '#22C55E' : 'linear-gradient(135deg,#FF4D6D,#FF9A3C)',
                          color: 'white', border: 'none', cursor: 'pointer',
                          fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: '0.3s'
                        }}
                      >
                        {addedId === product.id ? <><Check size={15} /> تمت الإضافة</> : <><ShoppingCart size={15} /> أضف للسلة</>}
                      </button>
                      <Link href={linkHref} style={{ padding: '11px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                        <Eye size={15} /> التفاصيل
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Saudi Customer Reviews Section */}
        <div style={{ marginTop: 48, marginBottom: 48 }}>
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
                        <CheckCircle2 size={14} style={{ color: '#10B981' }} title="مشتري موثق" />
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
        </div>

        {/* Interactive Saudi Payment Gateways Showcase Section */}
        <div style={{ background: 'linear-gradient(135deg, rgba(20,22,46,0.9), rgba(11,13,31,0.95))', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 28, padding: '36px 32px', marginBottom: 48, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
              <Lock size={14} /> بوابات الدفع الإلكتروني المعتمدة بالسعودية 🇸🇦
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'white', margin: '4px 0 8px' }}>دفع إلكتروني آمن ومشفر 100%</h2>
            <p style={{ color: '#9CA3AF', fontSize: 14, margin: 0, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
              ندعم كافة خيارات الدفع المحلية في المملكة العربية السعودية مع معالجة فورية وتأكيد تلقائي بالفاتورة
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
            {PAYMENT_GATEWAYS.map(gw => (
              <div
                key={gw.id}
                style={{
                  background: gw.bg,
                  border: `1px solid ${gw.borderColor}35`,
                  borderRadius: 18,
                  padding: '20px 16px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <span style={{ background: `${gw.borderColor}20`, border: `1px solid ${gw.borderColor}40`, color: gw.iconColor, padding: '3px 10px', borderRadius: 12, fontSize: 10, fontWeight: 700, display: 'inline-block', marginBottom: 10 }}>
                  {gw.badgeText}
                </span>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: 'white', margin: '0 0 4px' }}>{gw.name}</h4>
                <p style={{ fontSize: 12, color: gw.iconColor, fontWeight: 700, margin: '0 0 2px' }}>{gw.tag}</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{gw.desc}</p>
              </div>
            ))}
          </div>

          {/* Security Banner Footer */}
          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ShieldCheck size={28} style={{ color: '#10B981' }} />
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'white', margin: 0 }}>تشفير بيانات آمن 256-bit SSL</h4>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>جميع معاملاتك المالية محمية ومعتمدة وفق أعلى معايير الأمان البنكي (PCI-DSS Compliant)</p>
              </div>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={15} /> دفع موثق ومضمون
            </div>
          </div>
        </div>

      </div>

      {/* Floating Support Button */}
      <a href="https://wa.me/966000000000" target="_blank" rel="noopener noreferrer" className="floating-support-btn" title="تواصل معنا عبر الواتساب">
        <MessageCircle size={28} />
      </a>
    </section>
  );
}
