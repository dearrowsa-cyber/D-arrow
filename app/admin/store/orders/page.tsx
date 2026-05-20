'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, ChevronDown } from 'lucide-react';

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  pending: { label: 'قيد الانتظار', class: 'admin-badge-warning' },
  processing: { label: 'قيد التنفيذ', class: 'admin-badge-info' },
  completed: { label: 'مكتمل', class: 'admin-badge-success' },
  cancelled: { label: 'ملغي', class: 'admin-badge-danger' },
};

const PAYMENT_MAP: Record<string, { label: string; class: string }> = {
  pending: { label: 'غير مدفوع', class: 'admin-badge-warning' },
  paid: { label: 'مدفوع', class: 'admin-badge-success' },
  failed: { label: 'فشل', class: 'admin-badge-danger' },
  refunded: { label: 'مسترد', class: 'admin-badge-info' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/store/orders');
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
    } catch { } finally { setLoading(false); }
  };

  const updateStatus = async (id: string, field: string, value: string) => {
    try {
      const res = await fetch('/api/store/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [field]: value }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
        showToast('تم تحديث الطلب', 'success');
      }
    } catch { showToast('فشل التحديث', 'error'); }
  };

  const showToast = (msg: string, type: string) => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0);

  return (
    <div className="admin-content">
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#E6E6EA', margin: 0 }}>الطلبات</h2>
          <p style={{ color: '#6B7280', fontSize: 14, margin: '4px 0 0' }}>{orders.length} طلب — إجمالي الإيرادات: {totalRevenue.toFixed(2)} ر.س</p>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'إجمالي الطلبات', value: orders.length, color: 'pink' },
          { label: 'قيد الانتظار', value: orders.filter(o => o.status === 'pending').length, color: 'orange' },
          { label: 'مكتملة', value: orders.filter(o => o.status === 'completed').length, color: 'green' },
          { label: 'الإيرادات', value: `${totalRevenue.toFixed(0)} ر.س`, color: 'blue' },
        ].map((stat, i) => (
          <div key={i} className="admin-stat-card">
            <div className={`admin-stat-icon ${stat.color}`}><ShoppingBag size={24} /></div>
            <div className="admin-stat-value" style={{ fontSize: 24 }}>{stat.value}</div>
            <div className="admin-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 64, textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, border: '3px solid rgba(255,77,109,0.2)', borderTopColor: '#FF4D6D', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          </div>
        ) : orders.length === 0 ? (
          <div className="admin-empty">
            <ShoppingBag size={64} />
            <h3 style={{ color: '#9CA3AF', margin: '16px 0 8px' }}>لا توجد طلبات</h3>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>العميل</th>
                <th>المبلغ</th>
                <th>طريقة الدفع</th>
                <th>حالة الدفع</th>
                <th>حالة الطلب</th>
                <th>التاريخ</th>
                <th>تفاصيل</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <React.Fragment key={order.id}>
                  <tr>
                    <td style={{ fontWeight: 700, color: '#FF4D6D' }}>{order.orderNumber}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#E6E6EA' }}>{order.customerName}</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>{order.customerEmail}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#E6E6EA' }}>{order.total.toFixed(2)} ر.س</span>
                      {order.discount > 0 && <div style={{ fontSize: 11, color: '#22C55E' }}>خصم: {order.discount.toFixed(2)}</div>}
                    </td>
                    <td style={{ fontSize: 13 }}>{order.paymentMethod === 'stripe' ? 'Stripe' : order.paymentMethod === 'bank_transfer' ? 'تحويل بنكي' : order.paymentMethod}</td>
                    <td>
                      <select
                        className="admin-select"
                        value={order.paymentStatus}
                        onChange={e => updateStatus(order.id, 'paymentStatus', e.target.value)}
                        style={{ padding: '4px 8px', fontSize: 12, minWidth: 100 }}
                      >
                        {Object.entries(PAYMENT_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </td>
                    <td>
                      <select
                        className="admin-select"
                        value={order.status}
                        onChange={e => updateStatus(order.id, 'status', e.target.value)}
                        style={{ padding: '4px 8px', fontSize: 12, minWidth: 100 }}
                      >
                        {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </td>
                    <td style={{ fontSize: 13, color: '#9CA3AF' }}>{new Date(order.createdAt).toLocaleDateString('ar-SA')}</td>
                    <td>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                        <ChevronDown size={14} style={{ transform: expandedId === order.id ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                      </button>
                    </td>
                  </tr>
                  {expandedId === order.id && (
                    <tr>
                      <td colSpan={8} style={{ background: 'rgba(11,13,31,0.4)', padding: 20 }}>
                        <h4 style={{ color: '#E6E6EA', margin: '0 0 12px', fontSize: 14 }}>تفاصيل الطلب</h4>
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <span style={{ color: '#D1D5DB' }}>{item.productName} × {item.quantity}</span>
                            <span style={{ color: '#E6E6EA', fontWeight: 600 }}>{item.total.toFixed(2)} ر.س</span>
                          </div>
                        ))}
                        {order.couponCode && <div style={{ marginTop: 8, fontSize: 13, color: '#22C55E' }}>كوبون: {order.couponCode}</div>}
                        {order.customerPhone && <div style={{ marginTop: 4, fontSize: 13, color: '#9CA3AF' }}>هاتف: {order.customerPhone}</div>}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
