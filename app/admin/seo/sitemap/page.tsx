'use client';

export default function SitemapManager() {
  return (
    <div className="admin-content">
      <div style={{ marginBottom: '32px' }}>
        <h2>خريطة الموقع (Sitemap.xml)</h2>
        <p style={{ color: '#9CA3AF' }}>يتم إنشاء خريطة الموقع ديناميكياً لتحديث محركات البحث باستمرار.</p>
      </div>

      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h3 style={{ margin: '0 0 8px 0' }}>Sitemap Status</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="admin-badge admin-badge-success">Active</span>
              <span style={{ fontSize: '13px', color: '#6B7280' }}>Auto-generates on build and via dynamic routes</span>
            </div>
          </div>
          <a href="/sitemap.xml" target="_blank" className="admin-btn admin-btn-secondary">
            View sitemap.xml
          </a>
        </div>

        <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <h4 style={{ color: '#3B82F6', margin: '0 0 8px 0' }}>كيف تعمل الخريطة؟</h4>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#E6E6EA' }}>
            تتضمن خريطة الموقع جميع الصفحات الرئيسية (الرئيسية، خدماتنا، باقات الأسعار، من نحن، اتصل بنا) بالإضافة إلى جميع المقالات المنشورة في المدونة بشكل تلقائي. يتم دمج بيانات السيو (SEO Meta) الخاصة بك لتحديد أولويات الأرشفة وتواريخ آخر تحديث.
          </p>
        </div>
      </div>
    </div>
  );
}
