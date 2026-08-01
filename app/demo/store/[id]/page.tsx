'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Star, Check, ArrowRight, Package, ShieldCheck, Heart, Truck, RotateCcw, Headphones, ChevronLeft, Sparkles, CreditCard, X, Plus, Minus } from 'lucide-react';
import '../demo-store.css';

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
}

const PRODUCTS: DemoProduct[] = [
  {
    id: 'p1',
    name: 'ساعة ذكية متميزة (Ultra Smart)',
    category: 'إلكترونيات',
    price: 349,
    oldPrice: 499,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
    description: 'ساعة متوافقة مع جميع الهواتف الذكية مع شاشة AMOLED وقياس المؤشرات الحيوية وشحن سريع.',
    badge: 'الأكثر مبيعاً',
    rating: 4.8,
    reviewsCount: 124,
    features: ['شاشة AMOLED بدقة عالية', 'مقاومة للماء IP68', 'بطارية تدوم 7 أيام', 'قياس نبض القلب والأكسجين']
  },
  {
    id: 'p2',
    name: 'سماعات لاسلكية إلغاء الضوضاء (Pro ANC)',
    category: 'إلكترونيات',
    price: 279,
    oldPrice: 399,
    stock: 2,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    description: 'سماعات احترافية صوت محيطي عالي الدقة مع عزل ضوضاء نشط وبطارية تدوم 30 ساعة.',
    badge: 'باقي 2 فقط!',
    rating: 4.6,
    reviewsCount: 89,
    features: ['عزل ضوضاء نشط ANC', 'بطارية 30 ساعة', 'مايكروفون مزدوج HD', 'بلوتوث 5.3']
  },
  {
    id: 'p3',
    name: 'عطر الفخامة الملكي (50ml)',
    category: 'عطور',
    price: 199,
    oldPrice: 260,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
    description: 'عطر شرقي فاخر بنفحات العود والصندل والمسك الأبيض لمناسبة خاصة تدوم طويلاً.',
    badge: 'جديد',
    rating: 4.9,
    reviewsCount: 203,
    features: ['عود كمبودي طبيعي 100%', 'ثبات يدوم +12 ساعة', 'عبوة فاخرة هدايا', 'تركيبة حصرية']
  },
  {
    id: 'p4',
    name: 'محفظة جلد طبيعي فاخرة',
    category: 'كماليات',
    price: 89,
    oldPrice: 120,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    description: 'مصنوعة من أجوَد أنواع الجلد الطبيعي بتصميم أنيق وحماية RFID للبطاقات.',
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
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    description: 'مساحة تتسع لجهاز 15.6 بوصة منفذ شحن USB خارجي وجيوب متعددة مخفية للأمان.',
    rating: 4.7,
    reviewsCount: 112,
    features: ['مقاومة للماء IPX4', 'منفذ USB خارجي', 'تتسع لـ 15.6 بوصة', 'جيوب مخفية مضادة للسرقة']
  }
];

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const isOutOfStock = product.stock <= 0;
  const discPct = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setAdded(true);
    setCartCount(prev => prev + 1);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div dir="rtl" style={{ background: '#0B0D1F', color: '#E6E6EA', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Top Demo Banner */}
      <div style={{ background: 'linear-gradient(90deg, #10B981, #059669)', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, fontSize: 14, fontWeight: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} />
          <span>وضع المعاينة المباشرة — صفحة تفاصيل المنتج</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/demo/store/admin" style={{ background: 'rgba(0,0,0,0.25)', color: 'white', padding: '5px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
            <ShieldCheck size={14} /> لوحة التحكم
          </Link>
          <Link href="/demo/store" style={{ background: 'white', color: '#047857', padding: '5px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 700 }}>
            العودة للمتجر
          </Link>
        </div>
      </div>

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(20,22,46,0.85)', backdropFilter: 'blur(14px)', position: 'sticky', top: 0, zIndex: 40, padding: '14px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <Link href="/demo/store" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <Image src="/Darrow-1.png" alt="D-Arrow Logo" width={100} height={40} style={{ objectFit: 'contain' }} />
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: 'white', display: 'block', lineHeight: 1.2 }}>المتجر</span>
              <span style={{ fontSize: 10, color: '#9CA3AF' }}>تفاصيل المنتج</span>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/demo/store" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ChevronLeft size={16} /> تصفح كل المنتجات
            </Link>
            <button onClick={() => setIsCartOpen(true)} style={{ position: 'relative', background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', border: 'none', color: 'white', padding: '10px 18px', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14 }}>
              <ShoppingCart size={18} /> السلة
              {cartCount > 0 && (
                <span style={{ background: '#EF4444', width: 22, height: 22, borderRadius: '50%', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: -6, left: -6, border: '2px solid #0B0D1F', fontWeight: 800 }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1100, margin: '40px auto 80px', padding: '0 24px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 13, color: '#6B7280' }}>
          <Link href="/demo/store" style={{ color: '#FF4D6D', textDecoration: 'none', fontWeight: 600 }}>المتجر</Link>
          <ChevronLeft size={14} />
          <span style={{ color: '#9CA3AF' }}>{product.category}</span>
          <ChevronLeft size={14} />
          <span style={{ color: '#D1D5DB' }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'start' }}>
          {/* Image */}
          <div>
            <div style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,77,109,0.2)', aspectRatio: '1', background: '#14162E', position: 'relative' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {product.badge && !isOutOfStock && (
                <span style={{ position: 'absolute', top: 16, right: 16, background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <span style={{ fontSize: 13, color: '#FF4D6D', fontWeight: 600 }}>{product.category}</span>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: 'white', margin: '8px 0 14px', lineHeight: 1.3 }}>{product.name}</h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={16} style={{ color: s <= Math.round(product.rating) ? '#EAB308' : '#374151', fill: s <= Math.round(product.rating) ? '#EAB308' : 'none' }} />
                ))}
              </div>
              <span style={{ color: '#EAB308', fontWeight: 700, fontSize: 15 }}>{product.rating}</span>
              <span style={{ color: '#6B7280', fontSize: 13 }}>({product.reviewsCount} تقييم المشتريين)</span>
            </div>

            {/* Price Box */}
            <div style={{ background: 'rgba(20,22,46,0.7)', border: '1px solid rgba(255,77,109,0.15)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: product.oldPrice ? '#22C55E' : '#E6E6EA' }}>{product.price} ر.س</span>
                {product.oldPrice && <span style={{ fontSize: 18, color: '#6B7280', textDecoration: 'line-through' }}>{product.oldPrice} ر.س</span>}
                {discPct > 0 && <span style={{ background: '#EF4444', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>خصم {discPct}%</span>}
              </div>
              {!isOutOfStock && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 13, color: product.stock <= 3 ? '#F59E0B' : '#10B981', fontWeight: 600 }}>
                  <Package size={15} />
                  {product.stock <= 3 ? `متوفر ${product.stock} قطع فقط بالمخزون!` : `متوفر بالمخزون (${product.stock} قطعة)`}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                style={{
                  flex: 1, padding: '16px 24px', borderRadius: 14,
                  background: isOutOfStock ? '#374151' : added ? '#22C55E' : 'linear-gradient(135deg,#FF4D6D,#FF9A3C)',
                  color: 'white', border: 'none', cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  fontSize: 17, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: isOutOfStock ? 'none' : '0 8px 30px rgba(255,77,109,0.35)', transition: '0.3s'
                }}
              >
                {isOutOfStock ? <><Package size={20} /> غير متوفر حالياً</> : added ? <><Check size={20} /> تمت الإضافة للسلة!</> : <><ShoppingCart size={20} /> أضف إلى السلة</>}
              </button>
              <button onClick={() => setWishlist(p => !p)} style={{ width: 56, borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: wishlist ? '#EF4444' : '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={22} fill={wishlist ? '#EF4444' : 'none'} />
              </button>
            </div>

            {/* Description */}
            <p style={{ fontSize: 15, color: '#D1D5DB', lineHeight: 1.8, margin: '0 0 24px' }}>{product.description}</p>

            {/* Features */}
            {product.features && (
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'white', marginBottom: 12 }}>المواصفات والمميزات</h3>
                {product.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <Check size={16} style={{ color: '#22C55E' }} />
                    <span style={{ color: '#D1D5DB', fontSize: 14 }}>{f}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { icon: <Truck size={20} />, label: 'شحن مجاني', sub: 'لطلبات +200 ر.س' },
                { icon: <RotateCcw size={20} />, label: 'استرجاع مجاني', sub: 'خلال 14 يوم' },
                { icon: <Headphones size={20} />, label: 'دعم فني 24/7', sub: 'واتساب + شات' },
              ].map((t, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 14, textAlign: 'center' }}>
                  <div style={{ color: '#FF4D6D', marginBottom: 6, display: 'flex', justifyContent: 'center' }}>{t.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>{t.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', textAlign: 'center', color: '#6B7280', fontSize: 13 }}>
        <Image src="/Darrow-1.png" alt="D-Arrow Logo" width={90} height={36} style={{ objectFit: 'contain', marginBottom: 12 }} />
        <div>قالب متجر استعراضي — تم تطويره بواسطة <span style={{ color: '#FF4D6D', fontWeight: 700 }}>D-Arrow</span> | جميع الحقوق محفوظة © 2026</div>
      </footer>
    </div>
  );
}
