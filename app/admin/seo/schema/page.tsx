'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import SchemaBuilder from '@/components/seo/SchemaBuilder';

export default function SchemaManager() {
  const [schemas, setSchemas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [currentSchema, setCurrentSchema] = useState<any>({ type: 'Article', jsonData: '', slug: '/' });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [showSlugModal, setShowSlugModal] = useState(false);
  const [tempSaveData, setTempSaveData] = useState<{ type: string; jsonData: string } | null>(null);
  const [slugInput, setSlugInput] = useState('/');

  useEffect(() => {
    fetchSchemas();
  }, []);

  const showToast = (msg: string, type: string) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSchemas = () => {
    fetch('/api/admin/seo/schema', {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setSchemas(data.data);
        setLoading(false);
      });
  };

  const handleSaveTrigger = (type: string, jsonData: string) => {
    setTempSaveData({ type, jsonData });
    setSlugInput(currentSchema.slug || '/');
    setShowSlugModal(true);
  };

  const handleFinalSave = async () => {
    if (!tempSaveData || !slugInput) return;

    try {
      const res = await fetch('/api/admin/seo/schema', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}` 
        },
        body: JSON.stringify({ slug: slugInput, type: tempSaveData.type, jsonData: tempSaveData.jsonData })
      });
      const data = await res.json();
      if (data.success) {
        showToast('تم حفظ مخطط البيانات بنجاح', 'success');
        setShowBuilder(false);
        setShowSlugModal(false);
        setTempSaveData(null);
        fetchSchemas();
      } else {
        showToast(data.error || 'فشل حفظ مخطط البيانات', 'error');
      }
    } catch {
      showToast('حدث خطأ أثناء حفظ مخطط البيانات', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/seo/schema/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setSchemas(prev => prev.filter(s => s.id !== deleteId));
        showToast('تم حذف مخطط البيانات بنجاح', 'success');
      } else {
        showToast('فشل حذف مخطط البيانات', 'error');
      }
    } catch {
      showToast('حدث خطأ أثناء الحذف', 'error');
    }
    setDeleteId(null);
  };

  if (loading) return <div className="admin-content">Loading...</div>;

  return (
    <div className="admin-content">
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}

      {deleteId && (
        <div className="admin-overlay" style={{ zIndex: 9999 }}>
          <div className="admin-dialog">
            <h3 style={{ color: '#E6E6EA', margin: '0 0 12px' }}>هل أنت متأكد؟</h3>
            <p style={{ color: '#9CA3AF', margin: '0 0 24px', fontSize: 14 }}>
              سيتم حذف مخطط البيانات (Schema) الخاص بهذه الصفحة نهائياً.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteId(null)}>إلغاء</button>
              <button className="admin-btn admin-btn-danger" onClick={handleDelete}>تأكيد الحذف</button>
            </div>
          </div>
        </div>
      )}

      {showSlugModal && (
        <div className="admin-overlay" style={{ zIndex: 9999 }}>
          <div className="admin-dialog">
            <h3 style={{ color: '#E6E6EA', margin: '0 0 16px' }}>حفظ مخطط البيانات (Schema)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="admin-label">رابط الصفحة المستهدفة (e.g. /about or /blog/post-1)</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={slugInput} 
                  onChange={e => setSlugInput(e.target.value)} 
                  placeholder="/"
                />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
                <button className="admin-btn admin-btn-ghost" onClick={() => { setShowSlugModal(false); setTempSaveData(null); }}>إلغاء</button>
                <button className="admin-btn admin-btn-primary" onClick={handleFinalSave}>حفظ مخطط البيانات</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2>Schema Markup (JSON-LD)</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => { setCurrentSchema({ type: 'Article', jsonData: '', slug: '/' }); setShowBuilder(true); }}>
          <Plus size={18} /> إضافة Schema
        </button>
      </div>

      {showBuilder ? (
        <div>
          <button className="admin-btn admin-btn-ghost" style={{ marginBottom: '16px' }} onClick={() => setShowBuilder(false)}>
            &larr; Back to List
          </button>
          <SchemaBuilder initialType={currentSchema.type} initialData={currentSchema.jsonData} onSave={handleSaveTrigger} />
        </div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Page Slug</th>
                <th>Schema Type</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schemas.map(s => (
                <tr key={s.id}>
                  <td style={{ color: '#3B82F6' }}>{s.slug}</td>
                  <td><span className="admin-badge admin-badge-info">{s.type}</span></td>
                  <td>{new Date(s.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => { setCurrentSchema(s); setShowBuilder(true); }} className="admin-btn admin-btn-secondary admin-btn-sm">Edit</button>
                      <button onClick={() => setDeleteId(s.id)} className="admin-btn admin-btn-danger admin-btn-sm">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {schemas.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: '#9CA3AF' }}>No schema entries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
