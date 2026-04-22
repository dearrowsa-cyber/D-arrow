'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, AlertTriangle, FileText, Settings, Navigation, Search, Database, Bot, TrendingUp, Sparkles } from 'lucide-react';
import SeoScoreGauge from '@/components/seo/SeoScoreGauge';

export default function SeoDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetch('/api/admin/seo/dashboard', {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
        setLoading(false);
      });
  }, []);

  const handleAiAnalysis = async () => {
    if (!data?.allErrors?.length) return;
    setAnalyzing(true);
    setAiAnalysis(null);

    try {
      const res = await fetch('/api/admin/seo/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ errors: data.allErrors })
      });
      const result = await res.json();
      setAiAnalysis(result.analysis || 'حدث خطأ أثناء التحليل.');
    } catch (error) {
      setAiAnalysis('حدث خطأ أثناء الاتصال بالخادم.');
    }
    setAnalyzing(false);
  };

  if (loading) return <div className="admin-content">Loading SEO Dashboard...</div>;

  return (
    <div className="admin-content">
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', margin: '0 0 8px' }}>لوحة تحكم السيو (SEO Dashboard)</h2>
        <p style={{ color: '#9CA3AF' }}>نظرة شاملة على أداء محركات البحث الخاص بموقعك</p>
      </div>

      <div className="admin-grid-4" style={{ marginBottom: '32px' }}>
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="admin-stat-value">{data?.avgScore || 0}/100</div>
              <div className="admin-stat-label">متوسط درجة السيو</div>
            </div>
            <SeoScoreGauge score={data?.avgScore || 0} size={64} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon orange"><AlertTriangle size={24} /></div>
          <div className="admin-stat-value">{data?.totalIssues || 0}</div>
          <div className="admin-stat-label">مشاكل السيو (Issues)</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon pink"><FileText size={24} /></div>
          <div className="admin-stat-value">{data?.totalPages || 0}</div>
          <div className="admin-stat-label">صفحات مفهرسة (Indexed)</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon blue"><Navigation size={24} /></div>
          <div className="admin-stat-value">{data?.redirectsCount || 0}</div>
          <div className="admin-stat-label">تحويلات الروابط (Redirects)</div>
        </div>
      </div>

      <div className="admin-grid-2" style={{ marginBottom: '32px' }}>
        {/* Brand Rankings */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <StarIcon color="#F59E0B" />
            <h3 style={{ margin: 0 }}>ترتيب العلامة التجارية (Brand Rank)</h3>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '16px' }}>ترتيب موقعك عند البحث عن اسم الشركة (D-Arrow).</p>
          <table className="admin-table">
            <thead>
              <tr>
                <th>الكلمة</th>
                <th>الترتيب</th>
                <th>النقرات</th>
              </tr>
            </thead>
            <tbody>
              {data?.brandKeywords?.length > 0 ? (
                data.brandKeywords.map((kw: any, i: number) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{kw.keyword}</td>
                    <td style={{ color: kw.position <= 3 ? '#10B981' : '#FFF' }}>
                      {kw.position ? `#${kw.position}` : '--'}
                    </td>
                    <td>{kw.clicks}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={3} style={{ textAlign: 'center', color: '#6B7280' }}>لا توجد بيانات متاحة</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* General Rankings */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <TrendingUp color="#3B82F6" />
            <h3 style={{ margin: 0 }}>ترتيب الكلمات العامة (General Rank)</h3>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '16px' }}>الكلمات المستهدفة الأخرى في محركات البحث.</p>
          <table className="admin-table">
            <thead>
              <tr>
                <th>الكلمة</th>
                <th>الترتيب</th>
                <th>النقرات</th>
              </tr>
            </thead>
            <tbody>
              {data?.generalKeywords?.length > 0 ? (
                data.generalKeywords.map((kw: any, i: number) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{kw.keyword}</td>
                    <td style={{ color: kw.position <= 10 ? '#10B981' : '#FFF' }}>
                      {kw.position ? `#${kw.position}` : '--'}
                    </td>
                    <td>{kw.clicks}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={3} style={{ textAlign: 'center', color: '#6B7280' }}>لا توجد بيانات متاحة</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="admin-card" style={{ marginBottom: '32px', border: '1px solid #374151' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Bot color="#8B5CF6" size={28} />
              <h3 style={{ margin: 0 }}>محلل السيو الذكي (AI Auditor)</h3>
            </div>
            <p style={{ color: '#9CA3AF', margin: 0 }}>احصل على خطة عمل مقترحة من الذكاء الاصطناعي لحل المشاكل الحالية.</p>
          </div>
          <button 
            className="admin-btn"
            style={{ backgroundColor: '#8B5CF6', color: '#FFF', border: 'none' }}
            onClick={handleAiAnalysis}
            disabled={analyzing || !data?.allErrors?.length}
          >
            {analyzing ? (
              <><span className="spin" style={{ display: 'inline-block', marginRight: '8px' }}>↻</span> جاري التحليل...</>
            ) : (
              <><Sparkles size={18} /> تحليل المشاكل الذكي</>
            )}
          </button>
        </div>

        {aiAnalysis && (
          <div style={{ background: '#111827', padding: '24px', borderRadius: '8px', marginBottom: '24px', borderLeft: '4px solid #8B5CF6' }}>
            <div className="ai-markdown" dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </div>
        )}

        {data?.recentErrors?.length > 0 ? (
          <div>
            <h4 style={{ marginBottom: '16px', color: '#E5E7EB' }}>أبرز الأخطاء الحالية:</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '8px' }}>
              {data.recentErrors.map((err: any, i: number) => (
                <li key={i} style={{ background: '#1F2937', padding: '12px 16px', borderRadius: '6px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <AlertTriangle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
                  <span style={{ color: '#9CA3AF', fontSize: '14px', flexShrink: 0 }}>[{err.page}]</span>
                  <span style={{ fontSize: '14px' }}>{err.error}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>لا توجد أخطاء حالياً. عمل رائع!</div>
        )}
      </div>

      <h3 style={{ marginBottom: '24px' }}>أدوات السيو المتقدمة</h3>
      <div className="admin-grid-3">
        <Link href="/admin/seo/meta" style={{ textDecoration: 'none' }}>
          <div className="admin-card" style={{ padding: '32px', textAlign: 'center' }}>
            <Search size={32} color="#3B82F6" style={{ margin: '0 auto 16px' }} />
            <h4>إدارة بيانات SEO</h4>
            <p style={{ fontSize: '13px', margin: 0 }}>تعديل العناوين، الأوصاف، والكلمات المفتاحية</p>
          </div>
        </Link>
        <Link href="/admin/seo/keywords" style={{ textDecoration: 'none' }}>
          <div className="admin-card" style={{ padding: '32px', textAlign: 'center' }}>
            <Activity size={32} color="#8B5CF6" style={{ margin: '0 auto 16px' }} />
            <h4>متتبع الكلمات المفتاحية</h4>
            <p style={{ fontSize: '13px', margin: 0 }}>تتبع ترتيبك في جوجل، النقرات، والظهور</p>
          </div>
        </Link>
        <Link href="/admin/seo/redirects" style={{ textDecoration: 'none' }}>
          <div className="admin-card" style={{ padding: '32px', textAlign: 'center' }}>
            <Navigation size={32} color="#F59E0B" style={{ margin: '0 auto 16px' }} />
            <h4>إعادة التوجيه (Redirects)</h4>
            <p style={{ fontSize: '13px', margin: 0 }}>إدارة تحويلات 301 و 302 للحفاظ على الزيارات</p>
          </div>
        </Link>
        <Link href="/admin/seo/schema" style={{ textDecoration: 'none' }}>
          <div className="admin-card" style={{ padding: '32px', textAlign: 'center' }}>
            <Database size={32} color="#22C55E" style={{ margin: '0 auto 16px' }} />
            <h4>مخطط البيانات (Schema)</h4>
            <p style={{ fontSize: '13px', margin: 0 }}>إضافة Rich Snippets لجوجل (مقالات، منتجات)</p>
          </div>
        </Link>
        <Link href="/admin/seo/robots" style={{ textDecoration: 'none' }}>
          <div className="admin-card" style={{ padding: '32px', textAlign: 'center' }}>
            <Settings size={32} color="#EF4444" style={{ margin: '0 auto 16px' }} />
            <h4>ملف Robots.txt</h4>
            <p style={{ fontSize: '13px', margin: 0 }}>التحكم في زواحف محركات البحث</p>
          </div>
        </Link>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .ai-markdown strong { color: #A78BFA; }
      `}</style>
    </div>
  );
}

function StarIcon(props: any) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={props.color || "currentColor"} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}
