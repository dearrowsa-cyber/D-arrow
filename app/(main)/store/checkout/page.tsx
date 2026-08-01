'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ShieldCheck, Lock, CreditCard, Check, X,
  Truck, MapPin, Phone, User, Mail, Building2, FileText,
  Wallet, Landmark, Clock, AlertCircle, Copy,
  CheckCircle2, Package, Sparkles, ArrowRight, Eye, EyeOff, Shield
} from 'lucide-react';
import '@/app/demo/store/demo-store.css';

type CheckoutStep = 'shipping' | 'payment' | 'review' | 'processing' | 'confirmed';
type PaymentMethod = 'mada' | 'visa' | 'applepay' | 'tabby' | 'tamara' | 'bank';

interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  street: string;
  postalCode: string;
  notes: string;
}

interface CardInfo {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

const SAUDI_CITIES = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الظهران',
  'تبوك', 'بريدة', 'حائل', 'أبها', 'الطائف', 'نجران', 'جازان', 'ينبع',
  'خميس مشيط', 'القطيف', 'الجبيل', 'الأحساء', 'عرعر', 'سكاكا'
];

const DEMO_CART = [
  {
    id: 'p1',
    name: 'ساعة ذكية متميزة (Ultra Smart)',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80',
    price: 349,
    oldPrice: 499,
    quantity: 1
  },
  {
    id: 'p3',
    name: 'عطر الفخامة الملكي بالعود والورد',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=200&q=80',
    price: 199,
    oldPrice: 260,
    quantity: 2
  }
];

const PAYMENT_METHODS: { id: PaymentMethod; name: string; nameEn: string; icon: string; desc: string; badge?: string; color: string; hasCardForm: boolean }[] = [
  { id: 'mada', name: 'بطاقة مدى', nameEn: 'Mada', icon: '🇸🇦', desc: 'الدفع الفوري عبر البطاقات البنكية السعودية', badge: 'الأكثر استخداماً', color: '#10B981', hasCardForm: true },
  { id: 'visa', name: 'فيزا / ماستركارد', nameEn: 'Visa / Mastercard', icon: '💳', desc: 'بطاقات ائتمانية دولية ومحلية مع تشفير 256-bit', color: '#3B82F6', hasCardForm: true },
  { id: 'applepay', name: 'أبل باي', nameEn: 'Apple Pay', icon: '', desc: 'دفع بنقرة واحدة آمنة من جهاز آيفون أو آيباد', badge: 'الأسرع', color: '#FFFFFF', hasCardForm: false },
  { id: 'tabby', name: 'تابي - قسّط على 4', nameEn: 'Tabby', icon: '💚', desc: 'قسّم المبلغ على 4 دفعات بدون فوائد أو رسوم إضافية', badge: 'بدون فوائد', color: '#34D399', hasCardForm: false },
  { id: 'tamara', name: 'تمارا - ادفع لاحقاً', nameEn: 'Tamara', icon: '🧡', desc: 'ادفع بعد 30 يوم أو قسّط على 3 دفعات مريحة', color: '#FB923C', hasCardForm: false },
  { id: 'bank', name: 'تحويل بنكي محلي', nameEn: 'Bank Transfer', icon: '🏦', desc: 'تحويل مباشر إلى الراجحي، الأهلي، أو الإنماء', color: '#A855F7', hasCardForm: false },
];

export default function CheckoutPage() {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: '', phone: '', email: '', city: 'الرياض',
    district: '', street: '', postalCode: '', notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mada');
  const [card, setCard] = useState<CardInfo>({ number: '', name: '', expiry: '', cvv: '' });
  const [showCvv, setShowCvv] = useState(false);
  const [cart] = useState(DEMO_CART);
  const [coupon, setCoupon] = useState('');
  const [discountPct, setDiscountPct] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [orderId, setOrderId] = useState('');
  const [shippingErrors, setShippingErrors] = useState<Partial<ShippingInfo>>({});
  const [saveCard, setSaveCard] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingCost = subtotal >= 300 ? 0 : 25;
  const vat = Math.round(subtotal * 0.15);
  const discountAmount = Math.round((subtotal * discountPct) / 100);
  const total = subtotal + shippingCost + vat - discountAmount;
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const tabbyInstallment = Math.ceil(total / 4);

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (['KSA50', 'DEMO20', 'STORE20'].includes(code)) {
      setDiscountPct(20);
      setCouponMsg('تم تطبيق خصم 20% بنجاح! ✅');
    } else if (code === 'OUD15') {
      setDiscountPct(15);
      setCouponMsg('تم تطبيق خصم 15%! ✅');
    } else {
      setDiscountPct(0);
      setCouponMsg('كود غير صحيح — جرّب KSA50');
    }
  };

  const validateShipping = (): boolean => {
    const errs: Partial<ShippingInfo> = {};
    if (!shipping.fullName.trim()) errs.fullName = 'مطلوب';
    if (!shipping.phone.trim() || !/^05\d{8}$/.test(shipping.phone.replace(/\s/g, ''))) errs.phone = 'رقم جوال سعودي صحيح (05XXXXXXXX)';
    if (!shipping.city) errs.city = 'اختر مدينة';
    if (!shipping.district.trim()) errs.district = 'مطلوب';
    if (!shipping.street.trim()) errs.street = 'مطلوب';
    setShippingErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePaymentSubmit = () => {
    if (!agreedToTerms) return;
    setStep('processing');
    setProcessingProgress(0);

    const progressSteps = [
      { pct: 15, delay: 400 },
      { pct: 35, delay: 800 },
      { pct: 55, delay: 1200 },
      { pct: 75, delay: 1800 },
      { pct: 90, delay: 2400 },
      { pct: 100, delay: 3000 },
    ];

    progressSteps.forEach(({ pct, delay }) => {
      setTimeout(() => setProcessingProgress(pct), delay);
    });

    setTimeout(() => {
      setOrderId(`SA-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setStep('confirmed');
    }, 3600);
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const steps = [
    { key: 'shipping', label: 'الشحن والعنوان', icon: <Truck size={16} /> },
    { key: 'payment', label: 'بوابة الدفع', icon: <CreditCard size={16} /> },
    { key: 'review', label: 'مراجعة الطلب', icon: <FileText size={16} /> },
  ];

  const currentStepIdx = steps.findIndex(s => s.key === step);
  const selectedPayment = PAYMENT_METHODS.find(p => p.id === paymentMethod)!;

  return (
    <div dir="rtl" style={{ background: '#0B0D1F', color: '#E6E6EA', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: 'linear-gradient(90deg, #064E3B, #047857)', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600 }}>
        <Lock size={14} />
        <span>🔒 اتصال مشفر 256-bit SSL — جميع بياناتك محمية ومعتمدة (PCI-DSS Compliant) 🇸🇦</span>
        <ShieldCheck size={14} />
      </div>

      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(20,22,46,0.9)', backdropFilter: 'blur(14px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/store" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#E6E6EA', fontWeight: 600, fontSize: 14 }}>
            <ChevronLeft size={18} /> العودة للمتجر
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lock size={14} style={{ color: '#10B981' }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>بوابة الدفع الآمنة</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9CA3AF' }}>
            <Shield size={14} style={{ color: '#10B981' }} />
            <span>تشفير SSL</span>
          </div>
        </div>
      </header>

      {step !== 'processing' && step !== 'confirmed' && (
        <div style={{ maxWidth: 700, margin: '24px auto 0', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
            {steps.map((s, idx) => {
              const isActive = idx === currentStepIdx;
              const isDone = idx < currentStepIdx;
              return (
                <div key={s.key} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: isDone ? '#10B981' : isActive ? 'linear-gradient(135deg,#FF4D6D,#FF9A3C)' : 'rgba(255,255,255,0.06)',
                      border: `2px solid ${isDone ? '#10B981' : isActive ? '#FF4D6D' : 'rgba(255,255,255,0.1)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isDone || isActive ? 'white' : '#6B7280',
                      transition: 'all 0.3s ease'
                    }}>
                      {isDone ? <Check size={18} /> : s.icon}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, color: isActive ? '#FF4D6D' : isDone ? '#10B981' : '#6B7280', whiteSpace: 'nowrap' }}>
                      {s.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div style={{ width: 60, height: 2, background: idx < currentStepIdx ? '#10B981' : 'rgba(255,255,255,0.08)', margin: '0 8px', marginBottom: 22, transition: 'background 0.3s' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: '28px auto 60px', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: step === 'processing' || step === 'confirmed' ? '1fr' : '1fr 380px', gap: 32, alignItems: 'start' }}>

          <div>
            {step === 'shipping' && (
              <div style={{ background: 'rgba(20,22,46,0.7)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,77,109,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={20} style={{ color: '#FF4D6D' }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'white' }}>عنوان الشحن بالمملكة 🇸🇦</h2>
                    <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>أدخل بيانات الشحن لتوصيل طلبك</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 13, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}><User size={13} /> الاسم الكامل *</label>
                    <input
                      required value={shipping.fullName}
                      onChange={e => setShipping(p => ({ ...p, fullName: e.target.value }))}
                      placeholder="محمد عبدالله الأحمد"
                      style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${shippingErrors.fullName ? '#EF4444' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, color: 'white', outline: 'none', fontSize: 14 }}
                    />
                    {shippingErrors.fullName && <span style={{ fontSize: 11, color: '#EF4444', marginTop: 4, display: 'block' }}>{shippingErrors.fullName}</span>}
                  </div>

                  <div>
                    <label style={{ fontSize: 13, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}><Phone size={13} /> رقم الجوال *</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#6B7280', fontWeight: 600 }}>+966</span>
                      <input
                        value={shipping.phone}
                        onChange={e => setShipping(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                        placeholder="05XXXXXXXX"
                        style={{ width: '100%', padding: '12px 14px 12px 14px', paddingRight: 60, background: 'rgba(0,0,0,0.3)', border: `1px solid ${shippingErrors.phone ? '#EF4444' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, color: 'white', outline: 'none', fontSize: 14, direction: 'ltr', textAlign: 'right' }}
                      />
                    </div>
                    {shippingErrors.phone && <span style={{ fontSize: 11, color: '#EF4444', marginTop: 4, display: 'block' }}>{shippingErrors.phone}</span>}
                  </div>

                  <div>
                    <label style={{ fontSize: 13, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}><Mail size={13} /> البريد الإلكتروني (اختياري)</label>
                    <input
                      type="email" value={shipping.email}
                      onChange={e => setShipping(p => ({ ...p, email: e.target.value }))}
                      placeholder="email@example.com"
                      style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'white', outline: 'none', fontSize: 14, direction: 'ltr', textAlign: 'right' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 13, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}><Building2 size={13} /> المدينة *</label>
                    <select
                      value={shipping.city}
                      onChange={e => setShipping(p => ({ ...p, city: e.target.value }))}
                      style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${shippingErrors.city ? '#EF4444' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, color: 'white', outline: 'none', fontSize: 14 }}
                    >
                      {SAUDI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 13, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}><MapPin size={13} /> الحي *</label>
                    <input
                      value={shipping.district}
                      onChange={e => setShipping(p => ({ ...p, district: e.target.value }))}
                      placeholder="حي النرجس"
                      style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${shippingErrors.district ? '#EF4444' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, color: 'white', outline: 'none', fontSize: 14 }}
                    />
                    {shippingErrors.district && <span style={{ fontSize: 11, color: '#EF4444', marginTop: 4, display: 'block' }}>{shippingErrors.district}</span>}
                  </div>

                  <div>
                    <label style={{ fontSize: 13, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>الشارع ورقم المبنى *</label>
                    <input
                      value={shipping.street}
                      onChange={e => setShipping(p => ({ ...p, street: e.target.value }))}
                      placeholder="شارع الملك فهد، مبنى رقم 42"
                      style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${shippingErrors.street ? '#EF4444' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, color: 'white', outline: 'none', fontSize: 14 }}
                    />
                    {shippingErrors.street && <span style={{ fontSize: 11, color: '#EF4444', marginTop: 4, display: 'block' }}>{shippingErrors.street}</span>}
                  </div>

                  <div>
                    <label style={{ fontSize: 13, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>الرمز البريدي (اختياري)</label>
                    <input
                      value={shipping.postalCode}
                      onChange={e => setShipping(p => ({ ...p, postalCode: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                      placeholder="12345"
                      style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'white', outline: 'none', fontSize: 14, direction: 'ltr', textAlign: 'right' }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 13, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>ملاحظات التوصيل (اختياري)</label>
                    <textarea
                      value={shipping.notes}
                      onChange={e => setShipping(p => ({ ...p, notes: e.target.value }))}
                      placeholder="مثال: الشقة 5 الدور الثالث — أفضل التوصيل بعد الظهر"
                      rows={3}
                      style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'white', outline: 'none', fontSize: 14, resize: 'vertical' }}
                    />
                  </div>
                </div>

                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14, padding: 16, marginTop: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Truck size={22} style={{ color: '#10B981', flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#10B981' }}>
                      {shippingCost === 0 ? '🎉 شحن مجاني! طلبك أعلى من 300 ر.س' : `رسوم الشحن: ${shippingCost} ر.س (مجاني للطلبات فوق 300 ر.س)`}
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9CA3AF' }}>التوصيل المتوقع: 1-3 أيام عمل داخل {shipping.city || 'المملكة'}</p>
                  </div>
                </div>

                <button
                  onClick={() => { if (validateShipping()) setStep('payment'); }}
                  style={{ width: '100%', marginTop: 24, padding: 16, borderRadius: 14, background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', border: 'none', fontWeight: 800, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 30px rgba(255,77,109,0.3)' }}
                >
                  متابعة إلى بوابة الدفع <ArrowRight size={18} />
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div>
                <div style={{ background: 'rgba(20,22,46,0.7)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: 32, marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Wallet size={20} style={{ color: '#10B981' }} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'white' }}>اختر طريقة الدفع</h2>
                      <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>جميع الطرق مؤمنة ومشفرة بتقنية SSL 256-bit</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                    {PAYMENT_METHODS.map(pm => {
                      const isSelected = paymentMethod === pm.id;
                      return (
                        <button
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id)}
                          style={{
                            padding: '16px 18px', borderRadius: 16, textAlign: 'right', cursor: 'pointer',
                            background: isSelected ? `${pm.color}12` : 'rgba(0,0,0,0.2)',
                            border: `2px solid ${isSelected ? pm.color : 'rgba(255,255,255,0.06)'}`,
                            display: 'flex', alignItems: 'center', gap: 14,
                            position: 'relative', overflow: 'hidden'
                          }}
                        >
                          <div style={{
                            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                            background: isSelected ? `${pm.color}20` : 'rgba(255,255,255,0.04)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 20, border: `1px solid ${isSelected ? `${pm.color}40` : 'transparent'}`
                          }}>
                            {pm.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: isSelected ? 'white' : '#D1D5DB' }}>{pm.name}</span>
                              <span style={{ fontSize: 10, color: '#6B7280' }}>{pm.nameEn}</span>
                            </div>
                            <span style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.4 }}>{pm.desc}</span>
                          </div>
                          {pm.badge && (
                            <span style={{ position: 'absolute', top: 8, left: 8, background: `${pm.color}20`, color: pm.color, padding: '2px 8px', borderRadius: 8, fontSize: 9, fontWeight: 700 }}>
                              {pm.badge}
                            </span>
                          )}
                          <div style={{
                            width: 20, height: 20, borderRadius: '50%', border: `2px solid ${isSelected ? pm.color : '#374151'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                          }}>
                            {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: pm.color }} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedPayment.hasCardForm && (
                  <div style={{ background: 'rgba(20,22,46,0.7)', border: `1px solid ${selectedPayment.color}30`, borderRadius: 24, padding: 32, marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                      <CreditCard size={20} style={{ color: selectedPayment.color }} />
                      <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: 'white' }}>بيانات بطاقة {selectedPayment.name}</h3>
                    </div>

                    <div style={{
                      background: `linear-gradient(135deg, ${selectedPayment.color}30, rgba(20,22,46,0.9))`,
                      border: `1px solid ${selectedPayment.color}40`,
                      borderRadius: 20, padding: '24px 28px', marginBottom: 24,
                      minHeight: 190, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                      direction: 'ltr'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 20 }}>{selectedPayment.icon}</span>
                        <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 600 }}>{selectedPayment.nameEn}</span>
                      </div>

                      <div style={{ fontSize: 22, fontWeight: 700, color: 'white', letterSpacing: 3, fontFamily: 'monospace', textAlign: 'center', margin: '20px 0' }}>
                        {card.number || '•••• •••• •••• ••••'}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                          <span style={{ fontSize: 9, color: '#6B7280', display: 'block', textTransform: 'uppercase' }}>Card Holder</span>
                          <span style={{ fontSize: 14, color: '#D1D5DB', fontWeight: 600 }}>{card.name || 'YOUR NAME'}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 9, color: '#6B7280', display: 'block', textTransform: 'uppercase' }}>Expires</span>
                          <span style={{ fontSize: 14, color: '#D1D5DB', fontWeight: 600 }}>{card.expiry || 'MM/YY'}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
                      <div>
                        <label style={{ fontSize: 13, color: '#9CA3AF', display: 'block', marginBottom: 6 }}>رقم البطاقة</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            value={card.number}
                            onChange={e => setCard(p => ({ ...p, number: formatCardNumber(e.target.value) }))}
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                            style={{ width: '100%', padding: '14px 50px 14px 14px', background: 'rgba(0,0,0,0.35)', border: `1px solid ${selectedPayment.color}25`, borderRadius: 12, color: 'white', outline: 'none', fontSize: 17, fontFamily: 'monospace', letterSpacing: 2, direction: 'ltr', textAlign: 'left' }}
                          />
                          <CreditCard size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: selectedPayment.color }} />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: 13, color: '#9CA3AF', display: 'block', marginBottom: 6 }}>اسم حامل البطاقة</label>
                        <input
                          value={card.name}
                          onChange={e => setCard(p => ({ ...p, name: e.target.value }))}
                          placeholder="MOHAMMED AL AHMED"
                          style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.35)', border: `1px solid ${selectedPayment.color}25`, borderRadius: 12, color: 'white', outline: 'none', fontSize: 14, direction: 'ltr', textAlign: 'left', textTransform: 'uppercase' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <div>
                          <label style={{ fontSize: 13, color: '#9CA3AF', display: 'block', marginBottom: 6 }}>تاريخ الانتهاء</label>
                          <input
                            value={card.expiry}
                            onChange={e => setCard(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                            placeholder="MM/YY"
                            maxLength={5}
                            style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.35)', border: `1px solid ${selectedPayment.color}25`, borderRadius: 12, color: 'white', outline: 'none', fontSize: 16, fontFamily: 'monospace', direction: 'ltr', textAlign: 'center' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 13, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>CVV <Lock size={11} /></label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type={showCvv ? 'text' : 'password'}
                              value={card.cvv}
                              onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                              placeholder="•••"
                              maxLength={4}
                              style={{ width: '100%', padding: '14px', paddingLeft: 40, background: 'rgba(0,0,0,0.35)', border: `1px solid ${selectedPayment.color}25`, borderRadius: 12, color: 'white', outline: 'none', fontSize: 16, fontFamily: 'monospace', direction: 'ltr', textAlign: 'center' }}
                            />
                            <button onClick={() => setShowCvv(!showCvv)} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', padding: 2 }}>
                              {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 4 }}>
                        <input type="checkbox" checked={saveCard} onChange={e => setSaveCard(e.target.checked)} style={{ accentColor: selectedPayment.color }} />
                        <span style={{ fontSize: 13, color: '#9CA3AF' }}>حفظ بيانات البطاقة للمشتريات القادمة (مشفرة)</span>
                      </label>
                    </div>
                  </div>
                )}

                {paymentMethod === 'applepay' && (
                  <div style={{ background: 'rgba(20,22,46,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24, padding: 32, marginBottom: 24, textAlign: 'center' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', margin: '0 0 8px' }}>الدفع عبر Apple Pay </h3>
                    <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 20px' }}>سيتم فتح نافذة Apple Pay على جهازك — أكّد بـ Face ID أو Touch ID</p>
                    <div style={{ background: 'black', color: 'white', padding: '14px 32px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700 }}>
                      Pay | {total} ر.س
                    </div>
                  </div>
                )}

                {paymentMethod === 'tabby' && (
                  <div style={{ background: 'rgba(20,22,46,0.7)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 24, padding: 32, marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                      <span style={{ fontSize: 28 }}>💚</span>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', margin: 0 }}>تقسيط تابي — 4 دفعات بدون فوائد</h3>
                        <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Tabby | Buy now, pay later</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ background: i === 1 ? 'rgba(52,211,153,0.15)' : 'rgba(0,0,0,0.2)', border: `1px solid ${i === 1 ? '#34D399' : 'rgba(255,255,255,0.06)'}`, borderRadius: 14, padding: '14px 10px', textAlign: 'center' }}>
                          <span style={{ fontSize: 10, color: i === 1 ? '#34D399' : '#6B7280', fontWeight: 700, display: 'block', marginBottom: 4 }}>
                            {i === 1 ? 'اليوم' : `بعد ${i - 1} شهر`}
                          </span>
                          <span style={{ fontSize: 18, fontWeight: 800, color: i === 1 ? '#34D399' : 'white' }}>{tabbyInstallment}</span>
                          <span style={{ fontSize: 11, color: '#9CA3AF', display: 'block' }}>ر.س</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {paymentMethod === 'tamara' && (
                  <div style={{ background: 'rgba(20,22,46,0.7)', border: '1px solid rgba(251,146,60,0.25)', borderRadius: 24, padding: 32, marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                      <span style={{ fontSize: 28 }}>🧡</span>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', margin: 0 }}>تمارا — ادفع لاحقاً أو قسّط</h3>
                        <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Tamara | Pay later, split in 3</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.25)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
                        <Clock size={24} style={{ color: '#FB923C', marginBottom: 8 }} />
                        <h4 style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: '0 0 4px' }}>ادفع بعد 30 يوم</h4>
                        <p style={{ fontSize: 20, fontWeight: 800, color: '#FB923C', margin: '8px 0 0' }}>{total} ر.س</p>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
                        <Wallet size={24} style={{ color: '#FB923C', marginBottom: 8 }} />
                        <h4 style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: '0 0 4px' }}>قسّط على 3 دفعات</h4>
                        <p style={{ fontSize: 20, fontWeight: 800, color: '#FB923C', margin: '8px 0 0' }}>{Math.ceil(total / 3)} ر.س/شهر</p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div style={{ background: 'rgba(20,22,46,0.7)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: 24, padding: 32, marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                      <Landmark size={24} style={{ color: '#A855F7' }} />
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', margin: 0 }}>التحويل البنكي المحلي 🇸🇦</h3>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[
                        { bank: 'مصرف الراجحي', iban: 'SA80 0000 0000 0000 0000 0000', color: '#10B981' },
                        { bank: 'البنك الأهلي السعودي', iban: 'SA29 1000 0000 0000 0000 0000', color: '#3B82F6' },
                      ].map((b, i) => (
                        <div key={i} style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{b.bank}</span>
                            <span style={{ fontSize: 12, color: '#9CA3AF', display: 'block', fontFamily: 'monospace', marginTop: 2 }}>{b.iban}</span>
                          </div>
                          <button
                            onClick={() => navigator.clipboard.writeText(b.iban.replace(/\s/g, ''))}
                            style={{ background: `${b.color}15`, border: `1px solid ${b.color}30`, color: b.color, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <Copy size={12} /> نسخ IBAN
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setStep('shipping')} style={{ flex: 0.4, padding: 14, borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <ChevronLeft size={16} /> الرجوع
                  </button>
                  <button
                    onClick={() => setStep('review')}
                    style={{ flex: 1, padding: 14, borderRadius: 14, background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', border: 'none', fontWeight: 800, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    مراجعة الطلب النهائية <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 'review' && (
              <div>
                <div style={{ background: 'rgba(20,22,46,0.7)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: 32, marginBottom: 24 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 24px', color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileText size={20} style={{ color: '#FF4D6D' }} /> مراجعة الطلب النهائية
                  </h2>

                  <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Truck size={16} style={{ color: '#10B981' }} /> بيانات الشحن
                      </h3>
                      <button onClick={() => setStep('shipping')} style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.2)', color: '#FF4D6D', padding: '4px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
                        تعديل
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13, color: '#D1D5DB' }}>
                      <div><span style={{ color: '#6B7280' }}>الاسم:</span> {shipping.fullName}</div>
                      <div><span style={{ color: '#6B7280' }}>الجوال:</span> {shipping.phone}</div>
                      <div><span style={{ color: '#6B7280' }}>المدينة والحي:</span> {shipping.city} — {shipping.district}</div>
                      <div><span style={{ color: '#6B7280' }}>الشارع:</span> {shipping.street}</div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 16, padding: 20, marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CreditCard size={16} style={{ color: selectedPayment.color }} /> طريقة الدفع المختارة
                      </h3>
                      <button onClick={() => setStep('payment')} style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.2)', color: '#FF4D6D', padding: '4px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
                        تعديل
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: 24 }}>{selectedPayment.icon}</div>
                      <div>
                        <span style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{selectedPayment.name}</span>
                        <span style={{ fontSize: 12, color: '#9CA3AF', display: 'block' }}>{selectedPayment.desc}</span>
                      </div>
                    </div>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', background: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} style={{ marginTop: 3, accentColor: '#10B981' }} />
                    <span style={{ fontSize: 13, color: '#D1D5DB', lineHeight: 1.5 }}>
                      أوافق على الشروط والأحكام و سياسة الاسترجاع والشحن بالمملكة العربية السعودية 🇸🇦
                    </span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setStep('payment')} style={{ flex: 0.4, padding: 14, borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <ChevronLeft size={16} /> الرجوع
                  </button>
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={!agreedToTerms}
                    style={{
                      flex: 1, padding: 16, borderRadius: 14,
                      background: !agreedToTerms ? '#374151' : 'linear-gradient(135deg, #10B981, #059669)',
                      color: 'white', border: 'none', fontWeight: 800, fontSize: 17,
                      cursor: !agreedToTerms ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
                    }}
                  >
                    <Lock size={18} /> تأكيد الدفع وإتمام الطلب ({total} ر.س)
                  </button>
                </div>
              </div>
            )}

            {step === 'processing' && (
              <div style={{ background: 'rgba(20,22,46,0.85)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 28, padding: '60px 32px', textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <Lock size={36} style={{ color: '#10B981' }} />
                </div>

                <h2 style={{ fontSize: 24, fontWeight: 800, color: 'white', margin: '0 0 10px' }}>جاري معالجة الدفع الآمن...</h2>
                <p style={{ fontSize: 14, color: '#9CA3AF', margin: '0 0 32px' }}>يرجى عدم إغلاق الصفحة — الاتصال بالبنك السعودي مباشر 🇸🇦</p>

                <div style={{ maxWidth: 400, margin: '0 auto 24px', background: 'rgba(0,0,0,0.4)', borderRadius: 20, padding: 6, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ height: 12, borderRadius: 10, background: 'linear-gradient(90deg, #10B981, #059669)', width: `${processingProgress}%`, transition: 'width 0.4s ease' }} />
                </div>

                <span style={{ fontSize: 18, fontWeight: 800, color: '#10B981' }}>{processingProgress}%</span>
              </div>
            )}

            {step === 'confirmed' && (
              <div style={{ background: 'rgba(20,22,46,0.85)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 28, padding: '48px 32px', textAlign: 'center' }}>
                <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 12px 40px rgba(16,185,129,0.4)' }}>
                  <CheckCircle2 size={48} style={{ color: 'white' }} />
                </div>

                <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>تم الدفع وتأكيد الطلب بنجاح! 🎉</span>

                <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: '14px 0 8px' }}>شكراً لتسوقك معنا! 🇸🇦</h1>
                <p style={{ fontSize: 14, color: '#9CA3AF', margin: '0 0 28px' }}>تم إرسال تفاصيل الفاتورة الإلكترونية إلى جوالك وصندوق البريد الإلكتروني.</p>

                <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px dashed rgba(16,185,129,0.4)', borderRadius: 16, padding: 20, maxWidth: 440, margin: '0 auto 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 11, color: '#9CA3AF', display: 'block' }}>رقم الطلب والفاتورة</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#10B981', fontFamily: 'monospace' }}>{orderId}</span>
                  </div>
                  <button onClick={copyOrderId} style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', padding: '8px 14px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {copiedOrderId ? <Check size={14} /> : <Copy size={14} />} {copiedOrderId ? 'تم النسخ' : 'نسخ الرقم'}
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <Link href="/store" style={{ background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', padding: '14px 28px', borderRadius: 14, textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>
                    العودة للتسوق
                  </Link>
                  <Link href="/demo/store/admin" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '14px 28px', borderRadius: 14, textDecoration: 'none', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={16} /> لوحة التحكم (الطلبات)
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* ════════ RIGHT: ORDER SUMMARY SIDEBAR ════════ */}
          {step !== 'processing' && step !== 'confirmed' && (
            <div style={{ background: 'rgba(20,22,46,0.7)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: 24, position: 'sticky', top: 90 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Package size={18} style={{ color: '#FF4D6D' }} /> ملخص الفاتورة ({totalItems})
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20, maxHeight: 220, overflowY: 'auto', paddingRight: 4 }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: 'white', lineHeight: 1.3 }}>{item.name}</h4>
                      <span style={{ fontSize: 12, color: '#9CA3AF' }}>الكمية: {item.quantity}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#22C55E' }}>{item.price * item.quantity} ر.س</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input
                  placeholder="كود الخصم (KSA50)"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  style={{ flex: 1, padding: '10px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: 'white', fontSize: 13, outline: 'none' }}
                />
                <button onClick={applyCoupon} style={{ background: 'rgba(255,77,109,0.15)', border: '1px solid rgba(255,77,109,0.3)', color: '#FF4D6D', padding: '0 14px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  تطبيق
                </button>
              </div>
              {couponMsg && <p style={{ fontSize: 12, color: discountPct > 0 ? '#22C55E' : '#EF4444', margin: '0 0 16px' }}>{couponMsg}</p>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, color: '#9CA3AF', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>المجموع الفرعي:</span>
                  <span style={{ color: 'white', fontWeight: 600 }}>{subtotal} ر.س</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>الشحن والتوصيل:</span>
                  <span style={{ color: shippingCost === 0 ? '#10B981' : 'white', fontWeight: 600 }}>{shippingCost === 0 ? 'مجاني' : `${shippingCost} ر.س`}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>ضريبة القيمة المضافة (15%):</span>
                  <span style={{ color: 'white', fontWeight: 600 }}>{vat} ر.س</span>
                </div>

                {discountPct > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22C55E' }}>
                    <span>خصم الكوبون ({discountPct}%):</span>
                    <span>-{discountAmount} ر.س</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, color: 'white', paddingTop: 12, borderTop: '1px dashed rgba(255,255,255,0.1)', marginTop: 4 }}>
                  <span>الإجمالي النهائي:</span>
                  <span style={{ color: '#22C55E' }}>{total} ر.س</span>
                </div>
              </div>

              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14, padding: 12, marginTop: 20, textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, fontSize: 11, color: '#10B981', fontWeight: 700 }}>
                  <ShieldCheck size={14} /> دفع آمن ومحمي 100% 🇸🇦
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
