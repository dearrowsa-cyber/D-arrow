'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Globe, DollarSign, Plus, TrendingUp, Clock, BarChart3, Activity } from 'lucide-react';

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  lastUpdated: string | null;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0, publishedPosts: 0, draftPosts: 0, lastUpdated: null,
  });
  const [analytics, setAnalytics] = useState<any>({ totalVisitors: 0, todayViews: 0, topPages: [] });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [resPosts, resAnalytics] = await Promise.all([
        fetch('/api/blog/posts'),
        fetch('/api/admin/analytics')
      ]);
      const dataPosts = await resPosts.json();
      const analyticsData = await resAnalytics.json();

      const posts = dataPosts.posts || [];
      const published = posts.filter((p: any) => p.status !== 'draft');
      const drafts = posts.filter((p: any) => p.status === 'draft');

      setStats({
        totalPosts: posts.length,
        publishedPosts: published.length,
        draftPosts: drafts.length,
        lastUpdated: posts.length > 0 ? posts[posts.length - 1]?.date : null,
      });

      if (analyticsData.success) {
        setAnalytics(analyticsData.data);
      }

      // Get last 5 posts
      const sorted = [...posts].sort((a: any, b: any) =>
        new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime()
      );
      setRecentPosts(sorted.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <div style={{
          width: 40, height: 40, border: '3px solid rgba(255,77,109,0.2)',
          borderTopColor: '#FF4D6D', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div className="admin-content">
      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#E6E6EA', margin: '0 0 8px' }}>
          مرحباً بك في لوحة التحكم 👋
        </h2>
        <p style={{ color: '#6B7280', fontSize: 15, margin: 0 }}>
          إليك نظرة عامة على محتوى موقعك
        </p>
      </div>

      {/* Stats Cards */}
      <div className="admin-grid-4" style={{ marginBottom: 32 }}>
        <div className="admin-stat-card">
          <div className="admin-stat-icon pink">
            <FileText size={24} />
          </div>
          <div className="admin-stat-value">{stats.totalPosts}</div>
          <div className="admin-stat-label">إجمالي المقالات</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon green">
            <TrendingUp size={24} />
          </div>
          <div className="admin-stat-value">{stats.publishedPosts}</div>
          <div className="admin-stat-label">مقالات منشورة</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon orange">
            <Clock size={24} />
          </div>
          <div className="admin-stat-value">{stats.draftPosts}</div>
          <div className="admin-stat-label">مسودات</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon blue">
            <Activity size={24} />
          </div>
          <div className="admin-stat-value" style={{ fontSize: 18 }}>
            {stats.lastUpdated || '—'}
          </div>
          <div className="admin-stat-label">آخر تحديث</div>
        </div>
      </div>

      {/* Analytics Cards */}
      <h3 style={{ fontSize: 18, fontWeight: 600, color: '#E6E6EA', margin: '0 0 16px' }}>إحصائيات الزوار</h3>
      <div className="admin-grid-3" style={{ marginBottom: 32 }}>
        <div className="admin-stat-card" style={{ background: 'rgba(59,130,246,0.05)' }}>
          <div className="admin-stat-value" style={{ color: '#E6E6EA', fontSize: 32 }}>{analytics.totalVisitors}</div>
          <div className="admin-stat-label">إجمالي الزيارات</div>
        </div>
        <div className="admin-stat-card" style={{ background: 'rgba(34,197,94,0.05)' }}>
          <div className="admin-stat-value" style={{ color: '#E6E6EA', fontSize: 32 }}>{analytics.todayViews}</div>
          <div className="admin-stat-label">زيارات اليوم</div>
        </div>
        <div className="admin-card" style={{ padding: '16px 24px', background: 'rgba(255,154,60,0.05)' }}>
          <h4 style={{ color: '#FF9A3C', fontSize: 14, margin: '0 0 8px' }}>الصفحات الأكثر زيارة</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(analytics?.topPages || []).slice(0, 3).map((page: any, i: number) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#E6E6EA', fontSize: 13 }}>
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 120 }}>{page.path}</span>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 12 }}>{page.hits}</span>
              </li>
            ))}
            {(!analytics?.topPages || analytics.topPages.length === 0) && <li style={{ color: '#6B7280', fontSize: 13 }}>لا توجد بيانات</li>}
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-grid-3" style={{ marginBottom: 32 }}>
        <Link href="/admin/posts/new" style={{ textDecoration: 'none' }}>
          <div className="admin-card" style={{ cursor: 'pointer', textAlign: 'center', padding: 32 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(255,77,109,0.15), rgba(255,154,60,0.1))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', color: '#FF4D6D',
            }}>
              <Plus size={28} />
            </div>
            <h4 style={{ color: '#E6E6EA', fontSize: 16, margin: '0 0 4px' }}>إنشاء مقال جديد</h4>
            <p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>اكتب مقال جديد للمدونة</p>
          </div>
        </Link>

        <Link href="/admin/pages" style={{ textDecoration: 'none' }}>
          <div className="admin-card" style={{ cursor: 'pointer', textAlign: 'center', padding: 32 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'rgba(59,130,246,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', color: '#3B82F6',
            }}>
              <Globe size={28} />
            </div>
            <h4 style={{ color: '#E6E6EA', fontSize: 16, margin: '0 0 4px' }}>إدارة الصفحات</h4>
            <p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>تعديل محتوى صفحات الموقع</p>
          </div>
        </Link>

        <Link href="/admin/pricing" style={{ textDecoration: 'none' }}>
          <div className="admin-card" style={{ cursor: 'pointer', textAlign: 'center', padding: 32 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'rgba(34,197,94,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', color: '#22C55E',
            }}>
              <DollarSign size={28} />
            </div>
            <h4 style={{ color: '#E6E6EA', fontSize: 16, margin: '0 0 4px' }}>إدارة الأسعار</h4>
            <p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>تعديل باقات الأسعار</p>
          </div>
        </Link>
      </div>

      {/* NEW: CMS and AI Tools Quick Navigation Blocks */}
      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#E6E6EA', margin: '32px 0 20px' }}>الأدوات والتطويرات الجديدة</h3>
      <div className="admin-grid-2" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', marginBottom: 40, gap: 24 }}>
        
        {/* Shortcut to Pages CMS */}
        <div className="admin-card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16, border: '1px solid rgba(59, 130, 246, 0.3)', background: 'linear-gradient(180deg, rgba(59,130,246,0.05) 0%, transparent 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
              <Globe size={32} />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#E6E6EA', margin: 0 }}>نظام إدارة المحتوى (CMS)</h3>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            تحكم كامل في نصوص وصور الواجهة الرئيسية، خدماتنا، من نحن، الهيرو، وأي جزء من أجزاء الموقع بشكل مباشر وبدون كود.
          </p>
          <Link href="/admin/pages" className="admin-btn admin-btn-primary" style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '12px 28px', background: 'linear-gradient(135deg, #3B82F6 0%, #2DD4BF 100%)', border: 'none' }}>
            الدخول وتعديل الموقع &larr;
          </Link>
        </div>

        {/* Shortcut to Blog & AI SEO */}
        <div className="admin-card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16, border: '1px solid rgba(255, 77, 109, 0.3)', background: 'linear-gradient(180deg, rgba(255,77,109,0.05) 0%, transparent 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255, 77, 109, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF4D6D' }}>
              <FileText size={32} />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#E6E6EA', margin: 0 }}>المدونة ومولد الـ AI (الذكاء الاصطناعي)</h3>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            الاستعانة بالذكاء الاصطناعي (AI) لكتابة وتحسين عناوين ووصف SEO للمقالات، مع إدارة شاملة لمدونة الموقع لدعم محركات البحث.
          </p>
          <Link href="/admin/posts" className="admin-btn admin-btn-primary" style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '12px 28px', background: 'linear-gradient(135deg, #FF9A3C 0%, #FF4D6D 100%)', border: 'none' }}>
            الدخول لتوليد الـ SEO والمقالات &larr;
          </Link>
        </div>
        
      </div>
    </div>
  );
}
