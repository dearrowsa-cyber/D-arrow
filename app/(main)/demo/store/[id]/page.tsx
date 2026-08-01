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

const PRODUCTS: Record<string, DemoProduct> = {
  'p1': {
    id: 'p1',
    name: 'ساعة ذكية متميزة (Ultra Smart)',
    category: 'إلكترونيات',
    price: 349,
    oldPrice: 499,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=90',
    description: 'ساعة متوافقة مع جميع الهواتف الذكية مع شاشة AMOLED وقياس المؤشرات الحيوية وشحن سريع.',
    badge: 'الأكثر مبيعاً بالمملكة 🔥',
    rating: 4.8,
    reviewsCount: 124,
    features: ['شاشة AMOLED بدقة عالية 454x454', 'مقاومة للماء والمعايير البحرية IP68', 'بطارية تدوم 7 أيام متواصلة', 'قياس نبض القلب ونسبة الأكسجين ومعدل النوم']
  },
  'p2': {
    id: 'p2',
    name: 'سماعات لاسلكية إلغاء الضوضاء (Pro ANC)',
    category: 'إلكترونيات',
    price: 279,
    oldPrice: 399,
    stock: 2,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=90',
    description: 'سماعات احترافية صوت محيطي عالي الدقة مع عزل ضوضاء نشط وبطارية تدوم 30 ساعة.',
    badge: 'باقي 2 قطع فقط!',
    rating: 4.6,
    reviewsCount: 89,
    features: ['عزل ضوضاء نشط ANC', 'بطارية 30 ساعة', 'مايكروفون مزدوج HD', 'بلوتوث 5.3']
  },
  'p3': {
    id: 'p3',
    name: 'عطر الفخامة الملكي بالعود والورد (50ml)',
    category: 'عطور',
    price: 199,
    oldPrice: 260,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=90',
    description: 'عطر شرقي فاخر بنفحات العود الكمبودي والصندل والمسك الأبيض لمناسباتك الخاصة.',
    badge: 'إصدار خاص 🇸🇦',
    rating: 4.9,
    reviewsCount: 203,
    features: ['عود كمبودي طبيعي 100%', 'ثبات يدوم +12 ساعة', 'عبوة فاخرة هدايا', 'تركيبة حصرية']
  },
  'p4': {
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
  'p5': {
    id: 'p5',
    name: 'نظارة شمسية قطبية كلاسيكية (Polarized)',
    category: 'كماليات',
    price: 149,
    oldPrice: 210,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=90',
    description: 'حماية كاملة من الأشعة فوق البنفسجية UV400 مع هيكل خفيف الوزن من التيتانيوم.',
    rating: 4.5,
    reviewsCount: 77,
    features: ['عدسات بولاريزد', 'حماية UV400', 'هيكل تيتانيوم', 'علبة فاخرة مع قماشة تنظيف']
  },
  'p6': {
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
    features: ['مقاومة للماء IPX4', 'منفذ USB خارجي', 'تتسع لـ 15.6 بوصة', 'جيوب مخفية مضادة للسرقة']
  }
};

export default function DemoProductDetailPage() {
  const params = useParams();
  const id = (params.id as string) || 'p1';
  const product = PRODUCTS[id] || PRODUCTS['p1'];

  const discPct = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <div dir="rtl" style={{ background: '#0B0D1F', color: '#E6E6EA', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', paddingBottom: 80 }}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(20,22,46,0.85)', backdropFilter: 'blur(14px)', position: 'sticky', top: 0, zIndex: 40, padding: '14px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/demo/store" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#E6E6EA', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
            ← العودة للمتجر
          </Link>
          <span style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>تفاصيل المنتج</span>
          <Link href="/demo/store/checkout" style={{ background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', padding: '8px 16px', borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShoppingCart size={15} /> إتمام الشراء
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '40px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 14, color: '#6B7280' }}>
          <Link href="/demo/store" style={{ color: '#FF4D6D', textDecoration: 'none' }}>المتجر</Link>
          <ArrowRight size={14} />
          <span style={{ color: '#9CA3AF' }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'start' }}>
          <div>
            <div style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,77,109,0.15)', aspectRatio: '1', background: '#14162E', position: 'relative' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {discPct > 0 && (
                <span style={{ position: 'absolute', top: 16, right: 16, background: '#EF4444', color: 'white', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 800 }}>
                  خصم {discPct}%
                </span>
              )}
            </div>
          </div>

          <div>
            <span style={{ fontSize: 13, color: '#FF4D6D', fontWeight: 600 }}>{product.category}</span>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: 'white', margin: '6px 0 14px', lineHeight: 1.3 }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} style={{ color: '#EAB308', fill: '#EAB308' }} />)}
              </div>
              <span style={{ color: '#EAB308', fontWeight: 700, fontSize: 15 }}>{product.rating}</span>
              <span style={{ color: '#6B7280', fontSize: 13 }}>({product.reviewsCount} تقييم)</span>
            </div>

            <div style={{ background: 'rgba(20,22,46,0.7)', border: '1px solid rgba(255,77,109,0.12)', borderRadius: 18, padding: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 34, fontWeight: 800, color: '#22C55E' }}>{product.price} ر.س</span>
                {product.oldPrice && <span style={{ fontSize: 18, color: '#6B7280', textDecoration: 'line-through' }}>{product.oldPrice} ر.س</span>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
              <Link href="/demo/store/checkout" style={{ flex: 1, padding: '16px 24px', borderRadius: 14, background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', textDecoration: 'none', fontWeight: 800, fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 30px rgba(255,77,109,0.3)' }}>
                <CreditCard size={20} /> شراء الآن عبر بوابة الدفع 💳
              </Link>
            </div>

            <p style={{ fontSize: 15, color: '#D1D5DB', lineHeight: 1.8, margin: '0 0 24px' }}>{product.description}</p>

            {product.features && product.features.length > 0 && (
              <div style={{ background: 'rgba(20,22,46,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: 20 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: '0 0 12px' }}>مواصفات المنتج:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {product.features.map((f, i) => (
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
