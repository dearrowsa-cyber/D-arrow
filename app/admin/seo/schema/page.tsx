'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import SchemaBuilder from '@/components/seo/SchemaBuilder';

export default function SchemaManager() {
  const [schemas, setSchemas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [currentSchema, setCurrentSchema] = useState<any>({ type: 'Article', jsonData: '', slug: '/' });

  useEffect(() => {
    fetchSchemas();
  }, []);

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

  const handleSave = async (type: string, jsonData: string) => {
    const slug = prompt('Enter the URL slug for this schema (e.g., /about)', currentSchema.slug);
    if (!slug) return;

    await fetch('/api/admin/seo/schema', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('admin_token')}` 
      },
      body: JSON.stringify({ slug, type, jsonData })
    });
    
    setShowBuilder(false);
    fetchSchemas();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete schema?')) return;
    await fetch(`/api/admin/seo/schema/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    });
    fetchSchemas();
  };

  if (loading) return <div className="admin-content">Loading...</div>;

  return (
    <div className="admin-content">
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
          <SchemaBuilder initialType={currentSchema.type} initialData={currentSchema.jsonData} onSave={handleSave} />
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
                      <button onClick={() => handleDelete(s.id)} className="admin-btn admin-btn-danger admin-btn-sm">
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
