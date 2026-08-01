'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Package, ShoppingBag, TrendingUp, Users, Plus, Edit, Trash2, Check, RefreshCw, Sparkles, ExternalLink, AlertTriangle, ArrowRight, Tag } from 'lucide-react';

interface StockProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  status: 'published' | 'draft';
}

interface DemoOrder {
  id: string;
  customerName: string;
  phone: string;
  total: number;
  itemsCount: number;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

const INITIAL_PRODUCTS: StockProduct[] = [
  { id: 'p1', name: 'ساعة ذكية متميزة الذكاء (Ultra Smart)', category: 'إلكترونيات', price: 349, stock: 8, sales: 42, status: 'published' },
  { id: 'p2', name: 'سماعات لاسلكية إلغاء الضوضاء (Pro ANC)', category: 'إلكترونيات', price: 279, stock: 2, sales: 29, status: 'published' },
  { id: 'p3', name: 'عطر الفخامة الملكي (50ml)', category: 'عطور', price: 199, stock: 15, sales: 54, status: 'published' },
  { id: 'p4', name: 'محفظة جلد طبيعي فاخرة', category: 'كماليات', price: 89, stock: 0, sales: 18, status: 'published' },
  { id: 'p5', name: 'نظارة شمسية كلاسيكية قطبية (Polarized)', category: 'كماليات', price: 149, stock: 12, sales: 31, status: 'published' },
  { id: 'p6', name: 'حقيبة ظهر للأعمال واللاب توب مقاومة للماء', category: 'أزياء', price: 229, stock: 5, sales: 22, status: 'published' },
];

const INITIAL_ORDERS: DemoOrder[] = [
  { id: 'ORD-84920', customerName: 'عبدالرحمن العتيبي', phone: '0501234567', total: 628, itemsCount: 2, paymentMethod: 'مدى', status: 'pending', date: 'منذ 10 دقائق' },
  { id: 'ORD-84919', customerName: 'سارة الشمري', phone: '0559876543', total: 199, itemsCount: 1, paymentMethod: 'فيزا', status: 'processing', date: 'منذ ساعتين' },
  { id: 'ORD-84918', customerName: 'خالد المطيري', phone: '0541122334', total: 349, itemsCount: 1, paymentMethod: 'تحويل بنكي', status: 'completed', date: 'اليوم 09:30 ص' },
  { id: 'ORD-84917', customerName: 'فاطمة الشهري', phone: '0564455667', total: 478, itemsCount: 2, paymentMethod: 'مدى', status: 'completed', date: 'أمس 04:15 م' },
];

export default function AdminDemoPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons'>('overview');
  const [products, setProducts] = useState<StockProduct[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<DemoOrder[]>(INITIAL_ORDERS);
  const [coupons, setCoupons] = useState([
    { code: 'DEMO20', discount: '20%', uses: 45, maxUses: 100, active: true },
    { code: 'WELCOME10', discount: '10%', uses: 89, maxUses: 200, active: true },
  ]);

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const updateStock = (id: string, newStock: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, stock: Math.max(0, newStock) } : p))
    );
    showToast('تم تحديث المخزون بنجاح');
  };

  const updateOrderStatus = (id: string, status: DemoOrder['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status } : o))
    );
    showToast('تم تغيير حالة الطلب بنجاح');
  };

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0) + 42000;
  const lowStockCount = products.filter(p => p.stock <= 3).length;

  return (
    <div dir="rtl" style={{ background: '#0B0D1F', color: '#E6E6EA', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Toast Alert */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#10B981', color: 'white', padding: '12px 24px', borderRadius: 12, fontWeight: 700, zIndex: 100, boxShadow: '0 8px 20px rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Check size={18} /> {toast}
        </div>
      )}

      {/* Top Banner Notice */}
      <div style={{ background: 'linear-gradient(90deg, #3B82F6, #1D4ED8)', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, fontSize: 14, fontWeight: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={18} />
          <span>لوحة تحكم المتجر الإلكتروني التفاعلية (نسخة العرض الحية)</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/demo/store" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '6px 14px', borderRadius: 8, textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ExternalLink size={16} /> معاينة المتجر من وجهة نظر العميل
          </Link>
          <Link href="/store/ecommerce-store-admin-template" style={{ background: 'white', color: '#1E40AF', padding: '6px 14px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
            شراء القالب الآن
          </Link>
        </div>
      </div>

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(20,22,46,0.8)', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/Darrow-1.png" alt="D-Arrow Logo" style={{ width: 90, height: 36, objectFit: 'contain' }} />
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 12 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}><ShieldCheck size={18} style={{ color: '#10B981' }} /> لوحة التحكم</h2>
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>إدارة المنتجات، المخزون، الطلبات</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setActiveTab('overview')} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: activeTab === 'overview' ? '#3B82F6' : 'rgba(255,255,255,0.05)', color: activeTab === 'overview' ? 'white' : '#9CA3AF', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              نظرة عامة
            </button>
            <button onClick={() => setActiveTab('products')} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: activeTab === 'products' ? '#3B82F6' : 'rgba(255,255,255,0.05)', color: activeTab === 'products' ? 'white' : '#9CA3AF', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              المخزون والمنتجات ({products.length})
            </button>
            <button onClick={() => setActiveTab('orders')} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: activeTab === 'orders' ? '#3B82F6' : 'rgba(255,255,255,0.05)', color: activeTab === 'orders' ? 'white' : '#9CA3AF', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              الطلبات ({orders.length})
            </button>
            <button onClick={() => setActiveTab('coupons')} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: activeTab === 'coupons' ? '#3B82F6' : 'rgba(255,255,255,0.05)', color: activeTab === 'coupons' ? 'white' : '#9CA3AF', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              الكوبونات
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1200, margin: '32px auto 80px', padding: '0 24px' }}>
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
              <div style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ color: '#9CA3AF', fontSize: 14 }}>إجمالي المبيعات</span>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(34,197,94,0.15)', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={20} />
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'white' }}>{totalRevenue.toLocaleString()} ر.س</div>
                <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 600, marginTop: 4, display: 'block' }}>+18.4% عن الشهر الماضي</span>
              </div>

              <div style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ color: '#9CA3AF', fontSize: 14 }}>إجمالي الطلبات</span>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59,130,246,0.15)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBag size={20} />
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'white' }}>142 طلب</div>
                <span style={{ fontSize: 12, color: '#3B82F6', fontWeight: 600, marginTop: 4, display: 'block' }}>4 طلبات قيد الانتظار</span>
              </div>

              <div style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ color: '#9CA3AF', fontSize: 14 }}>تنبيهات المخزون</span>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(245,158,11,0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertTriangle size={20} />
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: lowStockCount > 0 ? '#F59E0B' : 'white' }}>{lowStockCount} منتجات</div>
                <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 600, marginTop: 4, display: 'block' }}>كميات تحتاج إعادة تزويد</span>
              </div>

              <div style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ color: '#9CA3AF', fontSize: 14 }}>العملاء المسجلين</span>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(168,85,247,0.15)', color: '#A855F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={20} />
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'white' }}>96 عميل</div>
                <span style={{ fontSize: 12, color: '#A855F7', fontWeight: 600, marginTop: 4, display: 'block' }}>+12 عميل هذا الأسبوع</span>
              </div>
            </div>

            {/* Quick Actions & Recent Orders */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
              <div style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px', color: 'white' }}>أحدث الطلبات الواردة</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#9CA3AF' }}>
                      <th style={{ padding: 12 }}>رقم الطلب</th>
                      <th style={{ padding: 12 }}>العميل</th>
                      <th style={{ padding: 12 }}>المبلغ</th>
                      <th style={{ padding: 12 }}>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 4).map(o => (
                      <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: 12, fontWeight: 700, color: '#FF4D6D' }}>{o.id}</td>
                        <td style={{ padding: 12 }}>{o.customerName}</td>
                        <td style={{ padding: 12, fontWeight: 700, color: '#22C55E' }}>{o.total} ر.س</td>
                        <td style={{ padding: 12 }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                            background: o.status === 'completed' ? 'rgba(34,197,94,0.15)' : o.status === 'processing' ? 'rgba(59,130,246,0.15)' : 'rgba(245,158,11,0.15)',
                            color: o.status === 'completed' ? '#22C55E' : o.status === 'processing' ? '#3B82F6' : '#F59E0B'
                          }}>
                            {o.status === 'completed' ? 'مكتمل' : o.status === 'processing' ? 'قيد التجهيز' : 'قيد الانتظار'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 12px', color: 'white' }}>تجربة التعديل المباشر</h3>
                  <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6, margin: 0 }}>
                    يمكنك الانتقال لتبويب <strong>المخزون والمنتجات</strong> لتعديل كميات المخزون مباشرة وملاحظة تحديثها الفوري في المتجر!
                  </p>
                </div>
                <button onClick={() => setActiveTab('products')} style={{ width: '100%', padding: 12, borderRadius: 12, background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16 }}>
                  الانتقال لإدارة المخزون <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products & Inventory Tab */}
        {activeTab === 'products' && (
          <div style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'white' }}>إدارة مخزون وسعر المنتجات</h3>
                <p style={{ color: '#9CA3AF', fontSize: 13, margin: '4px 0 0' }}>قم بتعديل الكمية المتاحة بالمخزون ومتابعة نفاذ الكميات</p>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF' }}>
                  <th style={{ padding: 14 }}>المنتج</th>
                  <th style={{ padding: 14 }}>الفئة</th>
                  <th style={{ padding: 14 }}>السعر</th>
                  <th style={{ padding: 14 }}>المبيعات</th>
                  <th style={{ padding: 14 }}>كمية المخزون (تعديل تفاعلي)</th>
                  <th style={{ padding: 14 }}>حالة المخزون</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const isOutOfStock = p.stock <= 0;
                  const isLowStock = p.stock > 0 && p.stock <= 3;

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: 14, fontWeight: 700, color: 'white' }}>{p.name}</td>
                      <td style={{ padding: 14, color: '#FF4D6D' }}>{p.category}</td>
                      <td style={{ padding: 14, fontWeight: 700, color: '#22C55E' }}>{p.price} ر.س</td>
                      <td style={{ padding: 14, color: '#9CA3AF' }}>{p.sales} قطعة</td>
                      <td style={{ padding: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button
                            onClick={() => updateStock(p.id, p.stock - 1)}
                            style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #EF4444', color: '#EF4444', width: 28, height: 28, borderRadius: 6, cursor: 'pointer', fontWeight: 800 }}
                          >-</button>
                          <input
                            type="number"
                            value={p.stock}
                            onChange={e => updateStock(p.id, parseInt(e.target.value) || 0)}
                            style={{ width: 60, padding: 6, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'white', textAlign: 'center', fontWeight: 700, outline: 'none' }}
                          />
                          <button
                            onClick={() => updateStock(p.id, p.stock + 1)}
                            style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid #22C55E', color: '#22C55E', width: 28, height: 28, borderRadius: 6, cursor: 'pointer', fontWeight: 800 }}
                          >+</button>
                        </div>
                      </td>
                      <td style={{ padding: 14 }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                          background: isOutOfStock ? 'rgba(239,68,68,0.15)' : isLowStock ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)',
                          color: isOutOfStock ? '#EF4444' : isLowStock ? '#F59E0B' : '#22C55E'
                        }}>
                          {isOutOfStock ? 'نفذت الكمية' : isLowStock ? 'مخزون منخفض' : 'متوفر بالمخزون'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Management Tab */}
        {activeTab === 'orders' && (
          <div style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 20px', color: 'white' }}>إدارة طلبات المتجر وتغيير الحالات</h3>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF' }}>
                  <th style={{ padding: 14 }}>رقم الطلب</th>
                  <th style={{ padding: 14 }}>بيانات العميل</th>
                  <th style={{ padding: 14 }}>طريقة الدفع</th>
                  <th style={{ padding: 14 }}>الإجمالي</th>
                  <th style={{ padding: 14 }}>التاريخ</th>
                  <th style={{ padding: 14 }}>تغيير حالة الطلب</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: 14, fontWeight: 700, color: '#FF4D6D' }}>{o.id}</td>
                    <td style={{ padding: 14 }}>
                      <div style={{ fontWeight: 700, color: 'white' }}>{o.customerName}</div>
                      <div style={{ fontSize: 12, color: '#9CA3AF' }}>{o.phone}</div>
                    </td>
                    <td style={{ padding: 14 }}>{o.paymentMethod}</td>
                    <td style={{ padding: 14, fontWeight: 700, color: '#22C55E' }}>{o.total} ر.س</td>
                    <td style={{ padding: 14, color: '#9CA3AF', fontSize: 13 }}>{o.date}</td>
                    <td style={{ padding: 14 }}>
                      <select
                        value={o.status}
                        onChange={e => updateOrderStatus(o.id, e.target.value as any)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 8,
                          background: 'rgba(0,0,0,0.4)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: 'white',
                          fontSize: 13,
                          fontWeight: 700,
                          outline: 'none'
                        }}
                      >
                        <option value="pending">⏳ قيد الانتظار</option>
                        <option value="processing">⚙️ قيد التجهيز</option>
                        <option value="completed">✅ مكتمل ومسلم</option>
                        <option value="cancelled">❌ ملغي</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Coupons Tab */}
        {activeTab === 'coupons' && (
          <div style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 20px', color: 'white' }}>كوبونات وقسائم الخصم النشطة</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {coupons.map((c, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.3)', border: '1px dashed rgba(255,77,109,0.3)', borderRadius: 16, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#FF4D6D', letterSpacing: 1 }}>{c.code}</span>
                    <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                      خصم {c.discount}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: '#9CA3AF' }}>استخدامات الكوبون: {c.uses} من {c.maxUses}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
