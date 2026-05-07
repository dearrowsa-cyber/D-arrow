'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CreditCard, Building, Check, ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/store/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState({ customerName: '', customerEmail: '', customerPhone: '', notes: '' });
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);

  const total = Math.max(0, subtotal - discount);

  const applyCoupon = async () => {
    setCouponError('');
    if (!couponCode.trim()) return;
    try {
      const r = await fetch('/api/store/coupons/validate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: couponCode, orderTotal: subtotal }) });
      const d = await r.json();
      if (d.success) { setDiscount(d.coupon.discount); setCouponApplied(true); }
      else { setCouponError(d.error || 'كوبون غير صالح'); setDiscount(0); setCouponApplied(false); }
    } catch { setCouponError('خطأ في التحقق'); }
  };

  const handleSubmit = async () => {
    if (!form.customerName || !form.customerEmail) return;
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const r = await fetch('/api/store/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
          couponCode: couponApplied ? couponCode : null,
          paymentMethod,
        }),
      });
      const d = await r.json();
      if (d.success) { setOrderComplete(d.order); clearCart(); }
    } catch {} finally { setSubmitting(false); }
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: '120px 24px' }}>
        <ShoppingCart size={80} style={{ color: '#374151' }} />
        <h2 style={{ color: '#9CA3AF' }}>السلة فارغة</h2>
        <Link href="/store" style={{ padding: '14px 32px', borderRadius: 12, background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', textDecoration: 'none', fontWeight: 600 }}>تصفح المتجر</Link>
      </section>
    );
  }

  // Order Complete
  if (orderComplete) {
    return (
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px' }}>
        <div style={{ maxWidth: 600, textAlign: 'center', width: '100%' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Check size={40} style={{ color: '#22C55E' }} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#E6E6EA', marginBottom: 8 }}>تم استلام طلبك بنجاح!</h1>
          <p style={{ color: '#9CA3AF', fontSize: 16, marginBottom: 24 }}>رقم الطلب: <span style={{ color: '#FF4D6D', fontWeight: 700 }}>{orderComplete.orderNumber}</span></p>
          
          <div style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,77,109,0.1)', borderRadius: 20, padding: 32, textAlign: 'right', marginBottom: 32 }}>
            {paymentMethod === 'bank_transfer' ? (
              <>
                <h3 style={{ color: '#FF4D6D', marginBottom: 16, fontSize: 18 }}>تعليمات التحويل البنكي:</h3>
                <p style={{ color: '#D1D5DB', fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
                  يرجى تحويل مبلغ <strong>{orderComplete.total.toLocaleString()} ر.س</strong> إلى أحد الحسابات التالية، ثم إرسال صورة التحويل عبر الواتساب مع ذكر رقم الطلب.
                </p>
                <div style={{ background: 'rgba(11,13,31,0.4)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 13, color: '#9CA3AF' }}>بنك الراجحي:</div>
                    <div style={{ fontSize: 16, color: '#E6E6EA', fontWeight: 600 }}>SA84 8000 0000 0000 0000 0000</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: '#9CA3AF' }}>اسم المستفيد:</div>
                    <div style={{ fontSize: 16, color: '#E6E6EA', fontWeight: 600 }}>شركة دي آرو للتسويق</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ color: '#FF4D6D', marginBottom: 16, fontSize: 18 }}>الدفع عبر البطاقة (Stripe):</h3>
                <p style={{ color: '#D1D5DB', fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
                  يمكنك الآن إتمام عملية الدفع بأمان عبر بوابة Stripe.
                </p>
                <button 
                  onClick={() => window.location.href = `/api/store/checkout/stripe?orderId=${orderComplete.id}`}
                  style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#635bff', color: 'white', border: 'none', fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                >
                  <CreditCard size={20} /> دفع الآن عبر Stripe
                </button>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/store" style={{ padding: '14px 32px', borderRadius: 12, background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', textDecoration: 'none', fontWeight: 600 }}>متابعة التسوق</Link>
            <Link href="/" style={{ padding: '14px 32px', borderRadius: 12, border: '1px solid rgba(255,77,109,0.3)', color: '#FF4D6D', textDecoration: 'none', fontWeight: 600 }}>الرئيسية</Link>
          </div>
        </div>
      </section>
    );
  }

  const paymentMethods = [
    { id: 'bank_transfer', label: 'تحويل بنكي', icon: Building },
    { id: 'stripe', label: 'بطاقة ائتمان', icon: CreditCard },
  ];

  return (
    <section style={{ minHeight: '100vh', padding: '120px 24px 80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 14, color: '#6B7280' }}>
          <Link href="/store" style={{ color: '#FF4D6D', textDecoration: 'none' }}>المتجر</Link>
          <ArrowRight size={14} />
          <Link href="/store/cart" style={{ color: '#FF4D6D', textDecoration: 'none' }}>السلة</Link>
          <ArrowRight size={14} />
          <span style={{ color: '#9CA3AF' }}>الدفع</span>
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#E6E6EA', marginBottom: 32 }}>إتمام الشراء</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Customer Info */}
            <div style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,77,109,0.1)', borderRadius: 20, padding: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#E6E6EA', marginBottom: 20 }}>بيانات العميل</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#9CA3AF', marginBottom: 6 }}>الاسم الكامل *</label>
                  <input required value={form.customerName} onChange={e => setForm(p => ({ ...p, customerName: e.target.value }))} dir="rtl" style={{ width: '100%', padding: 14, background: 'rgba(11,13,31,0.6)', border: '1px solid rgba(255,77,109,0.15)', borderRadius: 12, color: '#E6E6EA', fontSize: 15, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#9CA3AF', marginBottom: 6 }}>البريد الإلكتروني *</label>
                  <input required type="email" value={form.customerEmail} onChange={e => setForm(p => ({ ...p, customerEmail: e.target.value }))} dir="ltr" style={{ width: '100%', padding: 14, background: 'rgba(11,13,31,0.6)', border: '1px solid rgba(255,77,109,0.15)', borderRadius: 12, color: '#E6E6EA', fontSize: 15, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#9CA3AF', marginBottom: 6 }}>رقم الهاتف</label>
                  <input value={form.customerPhone} onChange={e => setForm(p => ({ ...p, customerPhone: e.target.value }))} dir="ltr" style={{ width: '100%', padding: 14, background: 'rgba(11,13,31,0.6)', border: '1px solid rgba(255,77,109,0.15)', borderRadius: 12, color: '#E6E6EA', fontSize: 15, outline: 'none' }} />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,77,109,0.1)', borderRadius: 20, padding: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#E6E6EA', marginBottom: 20 }}>طريقة الدفع</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {paymentMethods.map(pm => (
                  <label key={pm.id} onClick={() => setPaymentMethod(pm.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 14, border: `2px solid ${paymentMethod === pm.id ? '#FF4D6D' : 'rgba(255,77,109,0.1)'}`, background: paymentMethod === pm.id ? 'rgba(255,77,109,0.05)' : 'transparent', cursor: 'pointer', transition: '0.2s' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${paymentMethod === pm.id ? '#FF4D6D' : '#6B7280'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {paymentMethod === pm.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF4D6D' }} />}
                    </div>
                    <pm.icon size={20} style={{ color: paymentMethod === pm.id ? '#FF4D6D' : '#6B7280' }} />
                    <span style={{ color: '#E6E6EA', fontWeight: 500 }}>{pm.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,77,109,0.1)', borderRadius: 20, padding: 24, position: 'sticky', top: 100 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#E6E6EA', marginBottom: 20 }}>ملخص الطلب</h3>

            {items.map(item => (
              <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                <span style={{ color: '#D1D5DB' }}>{item.nameAr || item.name} × {item.quantity}</span>
                <span style={{ color: '#E6E6EA', fontWeight: 600 }}>{((item.salePrice || item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '16px 0' }} />

            {/* Coupon */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 6, display: 'block' }}>كوبون خصم</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input placeholder="أدخل الكود" value={couponCode} onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); setCouponApplied(false); setDiscount(0); }} dir="ltr" style={{ flex: 1, padding: 10, background: 'rgba(11,13,31,0.6)', border: '1px solid rgba(255,77,109,0.15)', borderRadius: 8, color: '#E6E6EA', fontSize: 13, outline: 'none' }} />
                <button onClick={applyCoupon} disabled={couponApplied} style={{ padding: '10px 16px', borderRadius: 8, background: couponApplied ? '#22C55E' : 'rgba(255,77,109,0.15)', color: couponApplied ? 'white' : '#FF4D6D', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  {couponApplied ? '✓' : 'تطبيق'}
                </button>
              </div>
              {couponError && <p style={{ color: '#EF4444', fontSize: 12, margin: '4px 0 0' }}>{couponError}</p>}
              {couponApplied && <p style={{ color: '#22C55E', fontSize: 12, margin: '4px 0 0' }}>تم تطبيق الخصم!</p>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
              <span style={{ color: '#9CA3AF' }}>المجموع الفرعي</span>
              <span style={{ color: '#E6E6EA' }}>{subtotal.toFixed(2)} ر.س</span>
            </div>
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                <span style={{ color: '#22C55E' }}>الخصم</span>
                <span style={{ color: '#22C55E' }}>-{discount.toFixed(2)} ر.س</span>
              </div>
            )}

            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '16px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, fontSize: 20 }}>
              <span style={{ color: '#E6E6EA', fontWeight: 700 }}>الإجمالي</span>
              <span style={{ fontWeight: 800, background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{total.toFixed(2)} ر.س</span>
            </div>

            <button onClick={handleSubmit} disabled={submitting || !form.customerName || !form.customerEmail} style={{ width: '100%', padding: 16, borderRadius: 14, background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 17, fontWeight: 700, boxShadow: '0 8px 30px rgba(255,77,109,0.3)', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'جاري إنشاء الطلب...' : 'تأكيد الطلب'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
