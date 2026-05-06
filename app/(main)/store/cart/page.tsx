'use client';

import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Package } from 'lucide-react';
import { useCart } from '@/components/store/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: '120px 24px' }}>
        <ShoppingCart size={80} style={{ color: '#374151' }} />
        <h2 style={{ color: '#9CA3AF', fontSize: 24 }}>السلة فارغة</h2>
        <p style={{ color: '#6B7280' }}>لم تقم بإضافة أي منتجات بعد</p>
        <Link href="/store" style={{ padding: '14px 32px', borderRadius: 12, background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: 16, marginTop: 8 }}>تصفح المتجر</Link>
      </section>
    );
  }

  return (
    <section style={{ minHeight: '100vh', padding: '120px 24px 80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 14, color: '#6B7280' }}>
          <Link href="/store" style={{ color: '#FF4D6D', textDecoration: 'none' }}>المتجر</Link>
          <ArrowRight size={14} />
          <span style={{ color: '#9CA3AF' }}>السلة</span>
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#E6E6EA', marginBottom: 32 }}>سلة المشتريات ({items.length})</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {items.map(item => {
              const unitPrice = item.salePrice || item.price;
              return (
                <div key={item.productId} style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,77,109,0.1)', borderRadius: 16, padding: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
                  {/* Image */}
                  {item.image ? (
                    <img src={item.image} alt="" style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 80, height: 80, borderRadius: 12, background: 'rgba(255,77,109,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Package size={24} style={{ color: '#FF4D6D' }} />
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 16, fontWeight: 600, color: '#E6E6EA', margin: '0 0 4px' }}>{item.nameAr || item.name}</h4>
                    <p style={{ fontSize: 14, color: '#FF4D6D', fontWeight: 600, margin: 0 }}>{unitPrice} ر.س</p>
                  </div>

                  {/* Quantity */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(11,13,31,0.6)', borderRadius: 10, padding: '4px 8px' }}>
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'rgba(255,77,109,0.1)', color: '#FF4D6D', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={14} /></button>
                    <span style={{ color: '#E6E6EA', fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'rgba(255,77,109,0.1)', color: '#FF4D6D', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={14} /></button>
                  </div>

                  {/* Total */}
                  <span style={{ fontWeight: 700, color: '#E6E6EA', minWidth: 80, textAlign: 'center' }}>{(unitPrice * item.quantity).toFixed(2)} ر.س</span>

                  {/* Remove */}
                  <button onClick={() => removeItem(item.productId)} style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.1)', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={16} /></button>
                </div>
              );
            })}

            <button onClick={clearCart} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#EF4444', cursor: 'pointer', fontSize: 14, fontWeight: 500, alignSelf: 'flex-start' }}>
              <Trash2 size={14} style={{ display: 'inline', marginLeft: 6 }} /> إفراغ السلة
            </button>
          </div>

          {/* Summary */}
          <div style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,77,109,0.1)', borderRadius: 20, padding: 24, position: 'sticky', top: 100 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#E6E6EA', marginBottom: 20 }}>ملخص الطلب</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 15 }}>
              <span style={{ color: '#9CA3AF' }}>المجموع الفرعي</span>
              <span style={{ color: '#E6E6EA', fontWeight: 600 }}>{subtotal.toFixed(2)} ر.س</span>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '16px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, fontSize: 18 }}>
              <span style={{ color: '#E6E6EA', fontWeight: 700 }}>الإجمالي</span>
              <span style={{ fontWeight: 800, background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{subtotal.toFixed(2)} ر.س</span>
            </div>

            <Link href="/store/checkout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '16px', borderRadius: 14, background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 16, boxShadow: '0 8px 30px rgba(255,77,109,0.3)' }}>
              إتمام الشراء
            </Link>

            <Link href="/store" style={{ display: 'block', textAlign: 'center', marginTop: 12, color: '#9CA3AF', textDecoration: 'none', fontSize: 14 }}>متابعة التسوق</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
