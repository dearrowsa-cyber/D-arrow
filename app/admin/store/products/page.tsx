'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Star, Package } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/store/products');
      const data = await res.json();
      if (data.success) setProducts(data.products || []);
    } catch { } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/store/products/${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== deleteId));
        showToast('تم حذف المنتج', 'success');
      } else {
        showToast(data.error || 'فشل الحذف', 'error');
      }
    } catch { showToast('حدث خطأ', 'error'); }
    setDeleteId(null);
  };

  const showToast = (msg: string, type: string) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatPrice = (price: number, salePrice?: number) => {
    if (salePrice) {
      return (
        <span>
          <span style={{ textDecoration: 'line-through', color: '#6B7280', marginLeft: 8 }}>{price} ر.س</span>
          <span style={{ color: '#22C55E', fontWeight: 700 }}>{salePrice} ر.س</span>
        </span>
      );
    }
    return <span style={{ fontWeight: 700 }}>{price} ر.س</span>;
  };

  return (
    <div className="admin-content">
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="admin-overlay">
          <div className="admin-dialog" style={{ textAlign: 'center' }}>
            <Trash2 size={40} style={{ color: '#EF4444', marginBottom: 16 }} />
            <h3 style={{ color: '#E6E6EA', margin: '0 0 8px' }}>حذف المنتج</h3>
            <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 24 }}>هل أنت متأكد؟ لا يمكن التراجع.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteId(null)}>إلغاء</button>
              <button className="admin-btn admin-btn-danger" onClick={handleDelete}>حذف</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#E6E6EA', margin: 0 }}>المنتجات</h2>
          <p style={{ color: '#6B7280', fontSize: 14, margin: '4px 0 0' }}>{products.length} منتج</p>
        </div>
        <Link href="/admin/store/products/new" className="admin-btn admin-btn-primary">
          <Plus size={16} /> إضافة منتج
        </Link>
      </div>

      {/* Products Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 64, textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, border: '3px solid rgba(255,77,109,0.2)', borderTopColor: '#FF4D6D', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          </div>
        ) : products.length === 0 ? (
          <div className="admin-empty">
            <Package size={64} />
            <h3 style={{ color: '#9CA3AF', margin: '16px 0 8px' }}>لا توجد منتجات</h3>
            <p style={{ color: '#6B7280', fontSize: 14 }}>ابدأ بإضافة أول منتج للمتجر</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>المنتج</th>
                <th>الفئة</th>
                <th>السعر</th>
                <th>النوع</th>
                <th>الحالة</th>
                <th>التقييمات</th>
                <th>المبيعات</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const images = product.images ? JSON.parse(product.images) : [];
                const avgRating = product.reviews?.length
                  ? (product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length).toFixed(1)
                  : '—';

                return (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {images[0] ? (
                          <img src={images[0]} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: 48, height: 48, borderRadius: 8, background: 'rgba(255,77,109,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={20} style={{ color: '#FF4D6D' }} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: '#E6E6EA' }}>{product.nameAr || product.name}</div>
                          <div style={{ fontSize: 12, color: '#6B7280' }}>{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>{product.categoryAr || product.category}</td>
                    <td>{formatPrice(product.price, product.salePrice)}</td>
                    <td>
                      <span className="admin-badge admin-badge-info">
                        {product.type === 'digital' ? 'رقمي' : product.type === 'course' ? 'كورس' : product.type === 'template' ? 'قالب' : 'خدمة'}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${product.status === 'published' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                        {product.status === 'published' ? 'منشور' : 'مسودة'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={14} style={{ color: '#EAB308', fill: '#EAB308' }} />
                        <span>{avgRating}</span>
                        <span style={{ color: '#6B7280', fontSize: 12 }}>({product._count?.reviews || 0})</span>
                      </div>
                    </td>
                    <td>{product._count?.orderItems || 0}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link href={`/admin/store/products/${product.id}`} className="admin-btn admin-btn-ghost admin-btn-sm">
                          <Edit size={14} />
                        </Link>
                        <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setDeleteId(product.id)} style={{ color: '#EF4444' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
