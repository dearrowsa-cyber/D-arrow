'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !email) {
      setError('يرجى إدخال رقم الطلب والبريد الإلكتروني');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/store/orders/track?orderNumber=${orderNumber}&email=${email}`);
      const data = await res.json();
      
      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.error || 'لم يتم العثور على الطلب. تأكد من البيانات المدخلة.');
        setOrder(null);
      }
    } catch (err) {
      setError('حدث خطأ أثناء البحث عن الطلب');
    } finally {
      setLoading(false);
    }
  };

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'completed': return { text: 'مكتمل', color: '#22C55E', icon: <CheckCircle size={20} /> };
      case 'processing': return { text: 'جاري التنفيذ', color: '#3B82F6', icon: <Clock size={20} /> };
      case 'cancelled': return { text: 'ملغي', color: '#EF4444', icon: <AlertCircle size={20} /> };
      default: return { text: 'قيد المراجعة', color: '#F59E0B', icon: <Clock size={20} /> };
    }
  };

  return (
    <section style={{ minHeight: '100vh', padding: '120px 24px 80px', direction: 'rtl' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, marginBottom: 16, color: '#E6E6EA' }}>
            تتبع طلبك
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: 18 }}>
            أدخل رقم الطلب والبريد الإلكتروني لمتابعة حالة طلبك والحصول على بيانات الخدمة.
          </p>
        </div>

        <div style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,77,109,0.1)', borderRadius: 20, padding: 32, backdropFilter: 'blur(16px)', marginBottom: 32 }}>
          <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', color: '#E6E6EA', marginBottom: 8, fontWeight: 500 }}>رقم الطلب</label>
              <input
                type="text"
                placeholder="مثال: ORD-123456"
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#E6E6EA', marginBottom: 8, fontWeight: 500 }}>البريد الإلكتروني</label>
              <input
                type="email"
                placeholder="البريد المستخدم أثناء الطلب"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', outline: 'none' }}
              />
            </div>
            
            {error && <div style={{ color: '#EF4444', fontSize: 14, background: 'rgba(239,68,68,0.1)', padding: '10px 16px', borderRadius: 8 }}>{error}</div>}
            
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: 16, borderRadius: 12, background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', fontWeight: 700, fontSize: 16, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 8 }}
            >
              {loading ? 'جاري البحث...' : 'تتبع الطلب'}
            </button>
          </form>
        </div>

        {order && (
          <div style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,77,109,0.3)', borderRadius: 20, padding: 32, animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 24, marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: '#E6E6EA', margin: '0 0 8px' }}>طلب #{order.orderNumber}</h3>
                <p style={{ color: '#9CA3AF', margin: 0 }}>تاريخ الطلب: {new Date(order.createdAt).toLocaleDateString('ar-SA')}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 20, color: getStatusDetails(order.status).color, fontWeight: 600 }}>
                {getStatusDetails(order.status).icon}
                {getStatusDetails(order.status).text}
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <h4 style={{ fontSize: 18, fontWeight: 600, color: '#E6E6EA', marginBottom: 16 }}>الخدمات المطلوبة</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {order.items.map((item: any) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Package style={{ color: '#FF4D6D' }} size={24} />
                      <div>
                        <div style={{ color: '#E6E6EA', fontWeight: 600 }}>{item.productName}</div>
                        <div style={{ color: '#6B7280', fontSize: 14 }}>الكمية: {item.quantity}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#22C55E' }}>{item.total} ر.س</div>
                  </div>
                ))}
              </div>
            </div>

            {order.notes && order.status === 'completed' && (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: 24 }}>
                <h4 style={{ color: '#22C55E', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle size={20} /> بيانات الاستلام (تم التسليم)
                </h4>
                <div style={{ color: '#E6E6EA', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: 15 }}>
                  {order.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
