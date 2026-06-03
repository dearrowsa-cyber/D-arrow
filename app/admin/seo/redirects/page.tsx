'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function RedirectsManager() {
  const [redirects, setRedirects] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ sourceUrl: '', destinationUrl: '', type: 301, enabled: true });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  useEffect(() => {
    fetchRedirects();
  }, []);

  const showToast = (msg: string, type: string) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRedirects = async () => {
    const res = await fetch('/api/admin/seo/redirects', {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    });
    const data = await res.json();
    if (data.success) setRedirects(data.data);
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/admin/seo/redirects', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}` 
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        showToast('تم حفظ إعادة التوجيه بنجاح', 'success');
        setShowModal(false);
        setFormData({ sourceUrl: '', destinationUrl: '', type: 301, enabled: true });
        fetchRedirects();
      } else {
        showToast(data.error || 'فشل حفظ إعادة التوجيه', 'error');
      }
    } catch {
      showToast('حدث خطأ أثناء حفظ التوجيه', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/seo/redirects/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setRedirects(prev => prev.filter(r => r.id !== deleteId));
        showToast('تم حذف إعادة التوجيه بنجاح', 'success');
      } else {
        showToast('فشل حذف إعادة التوجيه', 'error');
      }
    } catch {
      showToast('حدث خطأ أثناء حذف التوجيه', 'error');
    }
    setDeleteId(null);
  };

  return (
    <div className="admin-content">
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}

      {deleteId && (
        <div className="admin-overlay" style={{ zIndex: 9999 }}>
          <div className="admin-dialog">
            <h3 style={{ color: '#E6E6EA', margin: '0 0 12px' }}>هل أنت متأكد؟</h3>
            <p style={{ color: '#9CA3AF', margin: '0 0 24px', fontSize: 14 }}>
              سيتم حذف رابط إعادة التوجيه هذا نهائياً.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteId(null)}>إلغاء</button>
              <button className="admin-btn admin-btn-danger" onClick={handleDelete}>تأكيد الحذف</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2>إدارة إعادة التوجيه (Redirects)</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> إضافة توجيه
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Source URL</th>
              <th>Destination URL</th>
              <th>Type</th>
              <th>Status</th>
              <th>Hits</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {redirects.map(r => (
              <tr key={r.id}>
                <td style={{ color: '#EF4444', direction: 'ltr', textAlign: 'right' }}>{r.sourceUrl}</td>
                <td style={{ color: '#22C55E', direction: 'ltr', textAlign: 'right' }}>{r.destinationUrl}</td>
                <td><span className="admin-badge admin-badge-info">{r.type}</span></td>
                <td>
                  <span className={`admin-badge ${r.enabled ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                    {r.enabled ? 'نشط' : 'معطل'}
                  </span>
                </td>
                <td>{r.hitCount}</td>
                <td>
                  <button onClick={() => setDeleteId(r.id)} className="admin-btn admin-btn-danger admin-btn-sm">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {redirects.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>
                  <p style={{ margin: '0 0 8px' }}>لا توجد تحويلات حالياً. اضغط &quot;إضافة توجيه&quot; لإنشاء تحويل جديد.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-overlay" style={{ zIndex: 9999 }}>
          <div className="admin-dialog">
            <h3 style={{ marginBottom: '24px' }}>إضافة تحويل جديد</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="admin-label">الرابط القديم (مثال: /old-page)</label>
                <input type="text" className="admin-input" value={formData.sourceUrl} onChange={e => setFormData({...formData, sourceUrl: e.target.value})} dir="ltr" />
              </div>
              <div>
                <label className="admin-label">الرابط الجديد</label>
                <input type="text" className="admin-input" value={formData.destinationUrl} onChange={e => setFormData({...formData, destinationUrl: e.target.value})} dir="ltr" />
              </div>
              <div>
                <label className="admin-label">نوع التحويل</label>
                <select className="admin-select" value={formData.type} onChange={e => setFormData({...formData, type: parseInt(e.target.value)})}>
                  <option value={301}>301 دائم (Permanent)</option>
                  <option value={302}>302 مؤقت (Temporary)</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button className="admin-btn admin-btn-ghost" onClick={() => setShowModal(false)}>إلغاء</button>
                <button className="admin-btn admin-btn-primary" onClick={handleSave}>حفظ</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
