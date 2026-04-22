'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Star, Upload, RefreshCw, Trash2, Activity, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import KeywordImportModal from '@/components/seo/KeywordImportModal';

export default function KeywordRankTracker() {
  const [data, setData] = useState<any>({ keywords: [], groups: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showImport, setShowImport] = useState(false);
  
  const [filterGroup, setFilterGroup] = useState('');
  const [filterStarred, setFilterStarred] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchKeywords = () => {
    const params = new URLSearchParams();
    if (filterGroup) params.append('group', filterGroup);
    if (filterStarred) params.append('starred', 'true');
    if (searchQuery) params.append('search', searchQuery);

    fetch(`/api/admin/seo/keywords?${params.toString()}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchKeywords();
  }, [filterGroup, filterStarred, searchQuery]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/admin/seo/keywords/sync', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const result = await res.json();
      if (result.success) {
        alert(`تم مزامنة ${result.synced} كلمة بنجاح!`);
        fetchKeywords();
      } else {
        alert(result.error || 'فشلت المزامنة');
      }
    } catch (e) {
      alert('خطأ أثناء المزامنة');
    }
    setSyncing(false);
  };

  const handleToggleStar = async (id: string, currentStatus: boolean) => {
    await fetch(`/api/admin/seo/keywords/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('admin_token')}` 
      },
      body: JSON.stringify({ starred: !currentStatus })
    });
    fetchKeywords();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الكلمة؟')) return;
    await fetch(`/api/admin/seo/keywords/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    });
    fetchKeywords();
  };

  if (loading) return <div className="admin-content">جاري تحميل المتتبع...</div>;

  return (
    <div className="admin-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ margin: '0 0 8px' }}>متتبع الكلمات المفتاحية (Rank Tracker)</h2>
          <p style={{ color: '#9CA3AF', margin: 0 }}>تتبع ترتيب موقعك في جوجل للكلمات المستهدفة</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleSync} 
            disabled={syncing} 
            className="admin-btn admin-btn-secondary"
          >
            <RefreshCw size={18} className={syncing ? 'spin' : ''} />
            {syncing ? 'جاري التحديث...' : 'تحديث الترتيب (GSC)'}
          </button>
          <button 
            onClick={() => setShowImport(true)} 
            className="admin-btn admin-btn-primary"
          >
            <Upload size={18} /> إضافة كلمات
          </button>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '24px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#1F2937', padding: '8px 16px', borderRadius: '8px', flex: 1, minWidth: '200px' }}>
          <Search size={18} color="#9CA3AF" style={{ marginRight: '8px' }} />
          <input 
            type="text" 
            placeholder="ابحث عن كلمة..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ background: 'none', border: 'none', color: '#FFF', width: '100%', outline: 'none' }}
          />
        </div>
        
        <select 
          className="admin-input" 
          style={{ width: 'auto' }}
          value={filterGroup}
          onChange={e => setFilterGroup(e.target.value)}
        >
          <option value="">جميع المجموعات</option>
          {data.groups.map((g: string) => <option key={g} value={g}>{g}</option>)}
        </select>

        <button 
          className="admin-btn admin-btn-secondary"
          style={{ color: filterStarred ? '#F59E0B' : '#9CA3AF', borderColor: filterStarred ? '#F59E0B' : '' }}
          onClick={() => setFilterStarred(!filterStarred)}
        >
          <Star size={18} fill={filterStarred ? '#F59E0B' : 'none'} />
          المميزة بنجمة
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th>الكلمة المفتاحية</th>
              <th>الترتيب (Position)</th>
              <th>التغيير</th>
              <th>النقرات (Clicks)</th>
              <th>الظهور (Imp.)</th>
              <th>المجموعة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {data.keywords.map((kw: any) => (
              <tr key={kw.id}>
                <td>
                  <button 
                    onClick={() => handleToggleStar(kw.id, kw.starred)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    <Star size={18} color={kw.starred ? '#F59E0B' : '#6B7280'} fill={kw.starred ? '#F59E0B' : 'none'} />
                  </button>
                </td>
                <td style={{ fontWeight: 500, color: '#FFF' }}>
                  <Link href={`/admin/seo/keywords/${kw.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {kw.keyword}
                  </Link>
                </td>
                <td>
                  {kw.latestPosition ? (
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>{kw.latestPosition}</span>
                  ) : (
                    <span style={{ color: '#6B7280' }}>--</span>
                  )}
                </td>
                <td>
                  {kw.positionChange > 0 ? (
                    <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ArrowUpRight size={16} /> +{kw.positionChange}
                    </span>
                  ) : kw.positionChange < 0 ? (
                    <span style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ArrowDownRight size={16} /> {kw.positionChange}
                    </span>
                  ) : (
                    <span style={{ color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Minus size={16} /> 0
                    </span>
                  )}
                </td>
                <td>{kw.latestClicks.toLocaleString()}</td>
                <td>{kw.latestImpressions.toLocaleString()}</td>
                <td>
                  {kw.group ? (
                    <span className="admin-badge admin-badge-info">{kw.group}</span>
                  ) : (
                    <span style={{ color: '#6B7280' }}>-</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link href={`/admin/seo/keywords/${kw.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                      <Activity size={14} /> تفاصيل
                    </Link>
                    <button onClick={() => handleDelete(kw.id)} className="admin-btn admin-btn-danger admin-btn-sm">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.keywords.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>
                  <Activity size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                  <p>لا توجد كلمات مفتاحية للتتبع.</p>
                  <button onClick={() => setShowImport(true)} className="admin-btn admin-btn-primary" style={{ marginTop: '16px' }}>
                    إضافة كلمات الآن
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showImport && (
        <KeywordImportModal 
          onClose={() => setShowImport(false)} 
          onSuccess={fetchKeywords} 
        />
      )}

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
