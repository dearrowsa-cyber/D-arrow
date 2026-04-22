'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, TrendingUp, MousePointerClick, Eye, Percent, Globe } from 'lucide-react';
import KeywordPositionChart from '@/components/seo/KeywordPositionChart';

export default function KeywordDetail() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/seo/keywords/${params.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        router.push('/admin/seo/keywords');
      });
  }, [params.id, router]);

  if (loading) return <div className="admin-content">جاري تحميل بيانات الكلمة...</div>;

  const latest = data.rankings?.[0] || { position: 0, clicks: 0, impressions: 0, ctr: 0 };
  
  // Format data for chart (reverse so chronological order)
  const chartData = [...(data.rankings || [])].reverse().map((r: any) => ({
    date: r.date,
    position: r.position
  }));

  // Group pageKeywords by pageUrl to show current ranking pages
  const latestPageRankings = new Map();
  data.pageKeywords?.forEach((pk: any) => {
    if (!latestPageRankings.has(pk.pageUrl)) {
      latestPageRankings.set(pk.pageUrl, pk); // Keep the first (latest) occurrence
    }
  });

  return (
    <div className="admin-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href="/admin/seo/keywords" className="admin-btn admin-btn-secondary" style={{ padding: '8px' }}>
          <ArrowLeft size={20} />
        </Link>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '28px' }}>{data.keyword}</h2>
            {data.starred && <Star size={24} fill="#F59E0B" color="#F59E0B" />}
            {data.group && <span className="admin-badge admin-badge-info">{data.group}</span>}
          </div>
          <p style={{ color: '#9CA3AF', margin: '4px 0 0' }}>تحليل أداء الكلمة المفتاحية عبر محرك بحث جوجل</p>
        </div>
      </div>

      <div className="admin-grid-4" style={{ marginBottom: '24px' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-icon blue"><TrendingUp size={24} /></div>
          <div className="admin-stat-value">{latest.position || '--'}</div>
          <div className="admin-stat-label">متوسط الترتيب (Position)</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon orange"><MousePointerClick size={24} /></div>
          <div className="admin-stat-value">{latest.clicks.toLocaleString()}</div>
          <div className="admin-stat-label">إجمالي النقرات (Clicks)</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon pink"><Eye size={24} /></div>
          <div className="admin-stat-value">{latest.impressions.toLocaleString()}</div>
          <div className="admin-stat-label">مرات الظهور (Impressions)</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon green"><Percent size={24} /></div>
          <div className="admin-stat-value">{latest.ctr}%</div>
          <div className="admin-stat-label">نسبة النقر (CTR)</div>
        </div>
      </div>

      <div className="admin-grid-2" style={{ marginBottom: '24px' }}>
        <div className="admin-card">
          <h3 style={{ marginTop: 0, marginBottom: '24px' }}>تاريخ الترتيب (Position History)</h3>
          {chartData.length > 0 ? (
            <KeywordPositionChart data={chartData} height={300} />
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
              لا توجد بيانات تاريخية كافية. قم بعمل مزامنة (Sync).
            </div>
          )}
        </div>

        <div className="admin-card">
          <h3 style={{ marginTop: 0, marginBottom: '24px' }}>الصفحات المتصدرة بهذه الكلمة</h3>
          {latestPageRankings.size > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>رابط الصفحة (URL)</th>
                  <th>الترتيب</th>
                  <th>النقرات</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(latestPageRankings.values()).map((pk: any) => (
                  <tr key={pk.id}>
                    <td style={{ color: '#3B82F6', direction: 'ltr', textAlign: 'left' }}>
                      <a href={pk.pageUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Globe size={14} /> {pk.pageUrl}
                      </a>
                    </td>
                    <td style={{ fontWeight: 'bold' }}>{pk.position}</td>
                    <td>{pk.clicks.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
              لم يتم العثور على صفحات تتصدر بهذه الكلمة حتى الآن.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
