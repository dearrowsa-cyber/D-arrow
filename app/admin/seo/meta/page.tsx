'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Search, Trash2, RefreshCw } from 'lucide-react';

export default function SeoMetaList() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    fetch('/api/admin/seo/meta', {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then(res => res.json())
      .then(res => {
        // Handle both standard array response and `{success: true, data: []}` structure
        if (Array.isArray(res)) {
          setItems(res);
        } else if (res.success) {
          setItems(res.data);
        } else {
          setItems([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setItems([]);
        setLoading(false);
      });
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/admin/seo/sync', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        alert(`تم مزامنة ${data.syncedCount} صفحة بنجاح!`);
        fetchItems();
      } else {
        alert('فشلت عملية المزامنة.');
      }
    } catch (e) {
      alert('خطأ أثناء المزامنة.');
    }
    setSyncing(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/admin/seo/meta/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    });
    fetchItems();
  };

  if (loading) return <div className="admin-content">Loading...</div>;

  return (
    <div className="admin-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2>بيانات السيو (SEO Meta)</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleSync} disabled={syncing} className="admin-btn admin-btn-secondary">
            <RefreshCw size={18} className={syncing ? 'spin' : ''} />
            {syncing ? 'جاري المزامنة...' : 'مزامنة الصفحات'}
          </button>
          <Link href="/admin/seo/meta/new" className="admin-btn admin-btn-primary">
            <Plus size={18} /> إضافة صفحة جديدة
          </Link>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>URL Slug</th>
              <th>SEO Title</th>
              <th>Score</th>
              <th>Focus Keyword</th>
              <th>Robots</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const latestLog = item.auditLogs?.[0];
              const score = latestLog ? latestLog.score : null;
              
              return (
                <tr key={item.id}>
                  <td style={{ color: '#3B82F6', fontWeight: 500, direction: 'ltr', textAlign: 'right' }}>{item.slug}</td>
                  <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title || '-'}</td>
                  <td>
                    {score !== null ? (
                      <span className={`admin-badge ${score >= 80 ? 'admin-badge-success' : score >= 50 ? 'admin-badge-warning' : 'admin-badge-danger'}`}>
                        {score}/100
                      </span>
                    ) : (
                      <span className="admin-badge admin-badge-info">Unanalyzed</span>
                    )}
                  </td>
                  <td>{item.focusKeyword || '-'}</td>
                  <td><span className="admin-badge admin-badge-info">{item.robots}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/admin/seo/meta/${item.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                        <Edit2 size={14} />
                      </Link>
                      <button onClick={() => handleDelete(item.id)} className="admin-btn admin-btn-danger admin-btn-sm">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#9CA3AF' }}>No SEO records found. Click "Sync Pages" to populate.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
