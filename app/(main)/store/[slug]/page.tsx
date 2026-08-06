'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Star, Check, ArrowRight, Package, ShieldCheck, Layout, Sparkles, CreditCard, Heart, Truck, Lock, ExternalLink } from 'lucide-react';
import '@/app/(main)/demo/store/demo-store.css';

const FALLBACK_PRODUCTS: Record<string, any> = {
  'p1': {
    id: 'p1',
    slug: 'p1',
    name: 'ساعة ذكية متميزة (Ultra Smart)',
    nameAr: 'ساعة ذكية متميزة (Ultra Smart)',
    category: 'إلكترونيات',
    categoryAr: 'إلكترونيات',
    price: 499,
    salePrice: 349,
    stock: 8,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=90',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=90'
    ]),
    description: 'ساعة متوافقة مع جميع الهواتف الذكية مع شاشة AMOLED وقياس المؤشرات الحيوية وشحن سريع.',
    descriptionAr: 'ساعة متوافقة مع جميع الهواتف الذكية مع شاشة AMOLED وقياس المؤشرات الحيوية وشحن سريع وبطارية يدوم شحنها لـ 7 أيام.',
    featuresAr: JSON.stringify(['شاشة AMOLED بدقة عالية 454x454', 'مقاومة للماء والمعايير البحرية IP68', 'بطارية تدوم 7 أيام متواصلة', 'قياس نبض القلب ونسبة الأكسجين ومعدل النوم', 'شحن لاسلكي مغناطيسي سريع']),
    rating: 4.8,
    reviewsCount: 124
  },
  'p2': {
    id: 'p2',
    slug: 'p2',
    name: 'سماعات لاسلكية إلغاء الضوضاء (Pro ANC)',
    nameAr: 'سماعات لاسلكية إلغاء الضوضاء (Pro ANC)',
    category: 'إلكترونيات',
    categoryAr: 'إلكترونيات',
    price: 399,
    salePrice: 279,
    stock: 2,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=90',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=90'
    ]),
    description: 'سماعات احترافية صوت محيطي عالي الدقة مع عزل ضوضاء نشط وبطارية تدوم 30 ساعة.',
    descriptionAr: 'سماعات احترافية صوت محيطي عالي الدقة مع عزل ضوضاء نشط وبطارية تدوم 30 ساعة متواصلة.',
    featuresAr: JSON.stringify(['عزل ضوضاء نشط ANC حتى -35dB', 'بطارية تدوم 30 ساعة مع علبة الشحن', 'مايكروفون مزدوج للتحكم في المكالمات', 'اتصال سريع بلوتوث 5.3']),
    rating: 4.6,
    reviewsCount: 89
  },
  'p3': {
    id: 'p3',
    slug: 'p3',
    name: 'عطر الفخامة الملكي بالعود والورد (50ml)',
    nameAr: 'عطر الفخامة الملكي بالعود والورد (50ml)',
    category: 'عطور',
    categoryAr: 'عطور',
    price: 260,
    salePrice: 199,
    stock: 15,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=90',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=90'
    ]),
    description: 'عطر شرقي فاخر بنفحات العود الكمبودي والصندل والمسك الأبيض لمناسباتك الخاصة.',
    descriptionAr: 'عطر شرقي فاخر بنفحات العود الكمبودي والصندل والمسك الأبيض لمناسباتك الخاصة.',
    featuresAr: JSON.stringify(['عود كمبودي طبيعي 100%', 'ثبات يدوم أكثر من 12 ساعة', 'عبوة هدايا فاخرة', 'تركيبة ملكية حصرية']),
    rating: 4.9,
    reviewsCount: 203
  },
  'p4': {
    id: 'p4',
    slug: 'p4',
    name: 'محفظة جلد طبيعي فاخرة حماية RFID',
    nameAr: 'محفظة جلد طبيعي فاخرة حماية RFID',
    category: 'كماليات',
    categoryAr: 'كماليات',
    price: 120,
    salePrice: 89,
    stock: 0,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=90'
    ]),
    description: 'مصنوعة من أجوَد أنواع الجلد الطبيعي بتصميم أنيق وحماية RFID للبطاقات البنكية.',
    descriptionAr: 'مصنوعة من أجوَد أنواع الجلد الطبيعي بتصميم أنيق وحماية RFID للبطاقات البنكية.',
    featuresAr: JSON.stringify(['جلد طبيعي 100%', 'حماية RFID ضد السرقة الإلكترونية', 'يتسع لـ 8 بطاقات بنكية', 'حجم نحيف ومريح']),
    rating: 4.3,
    reviewsCount: 56
  },
  'p5': {
    id: 'p5',
    slug: 'p5',
    name: 'نظارة شمسية قطبية كلاسيكية (Polarized)',
    nameAr: 'نظارة شمسية قطبية كلاسيكية (Polarized)',
    category: 'كماليات',
    categoryAr: 'كماليات',
    price: 210,
    salePrice: 149,
    stock: 12,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=90'
    ]),
    description: 'حماية كاملة من الأشعة فوق البنفسجية UV400 مع هيكل خفيف الوزن من التيتانيوم.',
    descriptionAr: 'حماية كاملة من الأشعة فوق البنفسجية UV400 مع هيكل خفيف الوزن من التيتانيوم.',
    featuresAr: JSON.stringify(['عدسات بولاريزد عالية النقاء', 'حماية UV400 كاملة', 'إطار تيتانيوم مقاوم للصدمات', 'علبة حافظة فاخرة']),
    rating: 4.5,
    reviewsCount: 77
  },
  'p6': {
    id: 'p6',
    slug: 'p6',
    name: 'حقيبة ظهر للأعمال مقاومة للماء',
    nameAr: 'حقيبة ظهر للأعمال مقاومة للماء',
    category: 'أزياء',
    categoryAr: 'أزياء',
    price: 320,
    salePrice: 229,
    stock: 5,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=90'
    ]),
    description: 'مساحة تتسع لجهاز 15.6 بوصة منفذ شحن USB خارجي وجيوب متعددة مخفية للأمان.',
    descriptionAr: 'مساحة تتسع لجهاز 15.6 بوصة منفذ شحن USB خارجي وجيوب متعددة مخفية للأمان.',
    featuresAr: JSON.stringify(['قماش هيدروفوبيك مقاوم للماء', 'جيب محمول مبطن 15.6 بوصة', 'منفذ شحن USB خارجي', 'جيوب سريّة ضد السرقة']),
    rating: 4.7,
    reviewsCount: 112
  },
  'ecommerce-store-admin-template': {
    id: 'tmpl-1',
    slug: 'ecommerce-store-admin-template',
    name: 'سكريبت المتجر الإلكتروني السعودي الكامل مع لوحة التحكم',
    nameAr: 'سكريبت المتجر الإلكتروني السعودي الكامل مع لوحة التحكم',
    category: 'قوالب ومتارج',
    categoryAr: 'قوالب ومتارج',
    price: 1999,
    salePrice: 1299,
    stock: 99,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1556742049-0a6754407767?auto=format&fit=crop&w=800&q=90',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=90'
    ]),
    description: 'قالب سكريبت متجر إلكتروني سعودي حديث متكامل جاهز للربط مع مدى وأبل باي ولوحة تحكم كاملة.',
    descriptionAr: 'قالب سكريبت متجر إلكتروني سعودي حديث متكامل جاهز للربط مع مدى وأبل باي ولوحة تحكم كاملة لإدارة المبيعات والمنتجات والكوبونات.',
    featuresAr: JSON.stringify(['بوابة دفع تفاعلية مدمجة (مدى، أبل باي، فيزا، تابي، تمارا)', 'لوحة تحكم إدارية شاملة للمبيعات والمنتجات والكوبونات', 'تصميم متوافق 100% مع الجوال واللغة العربية', 'شحن وسلة تسوق تفاعلية وفواتير إلكترونية']),
    rating: 5.0,
    reviewsCount: 48,
    type: 'template',
    demoUrl: '/demo/store'
  }
};

export default function ProductPage() {
  const params = useParams();
  const slug = (params.slug as string) || 'p1';
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch('/api/store/products?status=published')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const found = (d.products || []).find((p: any) => p.slug === slug || p.id === slug);
          if (found) {
            setProduct(found);
            setLoading(false);
            return;
          }
        }
        // Fallback
        const fallback = FALLBACK_PRODUCTS[slug] || FALLBACK_PRODUCTS['p1'];
        setProduct(fallback);
      })
      .catch(() => {
        const fallback = FALLBACK_PRODUCTS[slug] || FALLBACK_PRODUCTS['p1'];
        setProduct(fallback);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0B0D1F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 48, height: 48, border: '3px solid rgba(255,77,109,0.2)', borderTopColor: '#FF4D6D', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const images = product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : [];
  const features = product.featuresAr ? (typeof product.featuresAr === 'string' ? JSON.parse(product.featuresAr) : product.featuresAr) : [];
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
  const isOutOfStock = product.stock <= 0;

  return (
    <div dir="rtl" style={{ background: '#0B0D1F', color: '#E6E6EA', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', paddingBottom: 80 }}>
      {/* Top Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(20,22,46,0.85)', backdropFilter: 'blur(14px)', position: 'sticky', top: 0, zIndex: 40, padding: '14px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/store" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#E6E6EA', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
            ← العودة للمتجر
          </Link>
          <span style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>تفاصيل المنتج</span>
          <Link href="/store/checkout" style={{ background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', padding: '8px 16px', borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShoppingCart size={15} /> إتمام الشراء
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '40px auto 0', padding: '0 24px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 14, color: '#6B7280' }}>
          <Link href="/store" style={{ color: '#FF4D6D', textDecoration: 'none' }}>المتجر</Link>
          <ArrowRight size={14} />
          <span style={{ color: '#9CA3AF' }}>{product.nameAr || product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'start' }}>
          {/* Images */}
          <div>
            <div style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,77,109,0.15)', aspectRatio: '1', background: '#14162E', position: 'relative' }}>
              {images[selectedImg] ? (
                <img src={images[selectedImg]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={80} style={{ color: '#374151' }} />
                </div>
              )}
              {hasDiscount && (
                <span style={{ position: 'absolute', top: 16, right: 16, background: '#EF4444', color: 'white', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 800 }}>
                  خصم {discountPct}%
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                {images.map((img: string, i: number) => (
                  <div key={i} onClick={() => setSelectedImg(i)} style={{ width: 72, height: 72, borderRadius: 14, overflow: 'hidden', border: `2px solid ${selectedImg === i ? '#FF4D6D' : 'rgba(255,255,255,0.08)'}`, cursor: 'pointer' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <span style={{ fontSize: 13, color: '#FF4D6D', fontWeight: 600 }}>{product.categoryAr || product.category}</span>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: 'white', margin: '6px 0 14px', lineHeight: 1.3 }}>{product.nameAr || product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} style={{ color: '#EAB308', fill: '#EAB308' }} />)}
              </div>
              <span style={{ color: '#EAB308', fontWeight: 700, fontSize: 15 }}>{product.rating || 4.8}</span>
              <span style={{ color: '#6B7280', fontSize: 13 }}>({product.reviewsCount || 120} تقييم)</span>
            </div>

            <div style={{ background: 'rgba(20,22,46,0.7)', border: '1px solid rgba(255,77,109,0.12)', borderRadius: 18, padding: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 34, fontWeight: 800, color: '#22C55E' }}>{product.salePrice || product.price} ر.س</span>
                {hasDiscount && <span style={{ fontSize: 18, color: '#6B7280', textDecoration: 'line-through' }}>{product.price} ر.س</span>}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {product.demoUrl && (
                <a
                  href={product.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: '16px 24px', borderRadius: 14, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', color: '#10B981', textDecoration: 'none', fontWeight: 800, fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.25s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(16,185,129,0.2)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(16,185,129,0.12)'; }}
                >
                  <ExternalLink size={20} /> معاينة القالب الحية — جرّبه الآن ↗️
                </a>
              )}
              <Link href="/store/checkout" style={{ padding: '16px 24px', borderRadius: 14, background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', textDecoration: 'none', fontWeight: 800, fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 30px rgba(255,77,109,0.3)' }}>
                <CreditCard size={20} /> شراء الآن عبر بوابة الدفع 💳
              </Link>
            </div>

            <p style={{ fontSize: 15, color: '#D1D5DB', lineHeight: 1.8, margin: '0 0 24px' }}>{product.descriptionAr || product.description}</p>

            {features.length > 0 && (
              <div style={{ background: 'rgba(20,22,46,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: 20 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: '0 0 12px' }}>مواصفات المنتج:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {features.map((f: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#D1D5DB' }}>
                      <Check size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
