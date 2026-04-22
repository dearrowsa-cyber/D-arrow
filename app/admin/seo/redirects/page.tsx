'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function RedirectsManager() {
  const [redirects, setRedirects] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ sourceUrl: '', destinationUrl: '', type: 301, enabled: true });

  useEffect(() => {
    fetchRedirects();
  }, []);

  const fetchRedirects = async () => {
    const res = await fetch('/api/admin/seo/redirects', {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    });
    const data = await res.json();
    if (data.success) setRedirects(data.data);
  };

  const handleSave = async () => {
    await fetch('/api/admin/seo/redirects', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('admin_token')}` 
      },
      body: JSON.stringify(formData)
    });
    setShowModal(false);
    fetchRedirects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete redirect?')) return;
    await fetch(`/api/admin/seo/redirects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    });
    fetchRedirects();
  };

  return (
    <div className="admin-content">
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
                <td style={{ color: '#EF4444' }}>{r.sourceUrl}</td>
                <td style={{ color: '#22C55E' }}>{r.destinationUrl}</td>
                <td><span className="admin-badge admin-badge-info">{r.type}</span></td>
                <td>
                  <span className={`admin-badge ${r.enabled ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                    {r.enabled ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td>{r.hitCount}</td>
                <td>
                  <button onClick={() => handleDelete(r.id)} className="admin-btn admin-btn-danger admin-btn-sm">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-overlay" style={{ zIndex: 9999 }}>
          <div className="admin-dialog">
            <h3 style={{ marginBottom: '24px' }}>Add Redirect</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="admin-label">Source URL (e.g. /old-page)</label>
                <input type="text" className="admin-input" value={formData.sourceUrl} onChange={e => setFormData({...formData, sourceUrl: e.target.value})} />
              </div>
              <div>
                <label className="admin-label">Destination URL</label>
                <input type="text" className="admin-input" value={formData.destinationUrl} onChange={e => setFormData({...formData, destinationUrl: e.target.value})} />
              </div>
              <div>
                <label className="admin-label">Type</label>
                <select className="admin-select" value={formData.type} onChange={e => setFormData({...formData, type: parseInt(e.target.value)})}>
                  <option value={301}>301 Permanent</option>
                  <option value={302}>302 Temporary</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button className="admin-btn admin-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="admin-btn admin-btn-primary" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
