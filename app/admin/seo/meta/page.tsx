'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, RefreshCw, Save, ChevronUp, X } from 'lucide-react';

interface SeoMeta {
  id: string;
  slug: string;
  title?: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  focusKeyword?: string;
  robots?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  auditLogs?: { score: number }[];
}

export default function SeoMetaList() {
  const [items, setItems] = useState<SeoMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<SeoMeta>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchItems = () => {
    fetch('/api/admin/seo/meta', {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then(res => res.json())
      .then(res => {
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

  useEffect(() => {
    fetchItems();
  }, []);

  const showToast = (msg: string, type: string) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
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
        showToast(`تم مزامنة ${data.syncedCount} صفحة بنجاح!`, 'success');
        fetchItems();
      } else {
        showToast('فشلت عملية المزامنة.', 'error');
      }
    } catch {
      showToast('خطأ أثناء المزامنة.', 'error');
    }
    setSyncing(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/seo/meta/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => prev.filter(item => item.id !== deleteId));
        showToast('تم حذف السجل بنجاح', 'success');
      } else {
        showToast('فشل في حذف السجل', 'error');
      }
    } catch {
      showToast('حدث خطأ أثناء الحذف', 'error');
    }
    setDeleteId(null);
  };

  const toggleExpand = (item: SeoMeta) => {
    if (expandedId === item.id) {
      setExpandedId(null);
      setEditData({});
    } else {
      setExpandedId(item.id);
      setEditData({
        slug: item.slug || '',
        title: item.title || '',
        titleEn: item.titleEn || '',
        description: item.description || '',
        descriptionEn: item.descriptionEn || '',
        focusKeyword: item.focusKeyword || '',
        robots: item.robots || 'index, follow',
        canonicalUrl: item.canonicalUrl || '',
        ogTitle: item.ogTitle || '',
        ogDescription: item.ogDescription || '',
        ogImage: item.ogImage || '',
      });
    }
  };

  const handleInlineSave = async (id: string) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/seo/meta/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(editData)
      });
      const result = await res.json();
      if (result.success) {
        showToast('تم حفظ التعديلات بنجاح!', 'success');
        // Update local state
        setItems(prev => prev.map(item =>
          item.id === id ? { ...item, ...editData } : item
        ));
        setExpandedId(null);
        setEditData({});
      } else {
        showToast('خطأ: ' + result.error, 'error');
      }
    } catch {
      showToast('حدث خطأ أثناء الحفظ', 'error');
    }
    setSavingId(null);
  };

  if (loading) return <div className="admin-content">Loading...</div>;

  const getPageName = (slug: string) => {
    if (slug === '/') return 'الصفحة الرئيسية';
    if (slug === '/services') return 'الخدمات (رئيسية)';
    if (slug === '/pricing') return 'الأسعار';
    if (slug === '/process') return 'آلية العمل';
    if (slug === '/contact') return 'اتصل بنا';
    if (slug === '/why-us') return 'لماذا نحن';
    if (slug === '/custom-package') return 'باقة مخصصة';
    if (slug === '/blog') return 'المدونة (رئيسية)';
    if (slug === '/store') return 'المتجر (رئيسي)';
    
    if (slug.startsWith('/services/')) {
      const s = slug.replace('/services/', '');
      const serviceMap: Record<string, string> = {
        dm_smm: 'إدارة السوشيال ميديا', dm_marketing: 'التسويق الرقمي', dm_visual: 'الإنتاج البصري', 
        dm_influencer: 'التسويق عبر المؤثرين', dm_content: 'صناعة المحتوى', dm_exhibitions: 'تنظيم المعارض',
        dm_advertising: 'الحملات الإعلانية', dm_consultation: 'الاستشارات التسويقية', dm_seo: 'تحسين محركات البحث SEO',
        id_apps: 'تطبيقات الهواتف', id_website: 'برمجة المواقع', id_branding: 'الهوية البصرية',
        id_software: 'البرمجيات الخاصة', id_cloud: 'الخدمات السحابية',
        re_appraisal: 'التقييم العقاري', re_marketing: 'التسويق العقاري', re_management: 'إدارة الأملاك',
        re_photography: 'التصوير العقاري', re_campaign: 'الحملات العقارية', re_project_images: 'تصوير المشاريع',
        re_current_eval: 'تقييم الوضع الحالي', re_project_naming: 'تسمية المشاريع'
      };
      return `خدمة: ${serviceMap[s] || s}`;
    }
    
    if (slug.startsWith('/blog/')) return `مقال: ${slug.replace('/blog/', '')}`;
    if (slug.startsWith('/store/')) return `منتج: ${slug.replace('/store/', '')}`;

    return slug;
  };

  return (
    <div className="admin-content">
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}

      {deleteId && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <h3 className="admin-text-primary" style={{ margin: '0 0 12px' }}>هل أنت متأكد؟</h3>
            <p className="admin-text-secondary" style={{ margin: '0 0 24px', fontSize: 14 }}>
              سيتم حذف سجل بيانات السيو هذا نهائياً. لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteId(null)}>إلغاء</button>
              <button className="admin-btn admin-btn-danger" onClick={handleDelete}>تأكيد الحذف</button>
            </div>
          </div>
        </div>
      )}

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
              <th>الرابط (URL Slug)</th>
              <th>اسم الصفحة</th>
              <th>عنوان السيو</th>
              <th>الوصف</th>
              <th>النتيجة</th>
              <th>الكلمة المفتاحية</th>
              <th>الفهرسة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const latestLog = item.auditLogs?.[0];
              const score = latestLog ? latestLog.score : null;
              const isExpanded = expandedId === item.id;
              
              return (
                <React.Fragment key={item.id}>
                  <tr style={{ cursor: 'pointer' }} onClick={() => toggleExpand(item)}>
                    <td className="admin-text-secondary" style={{ fontSize: '13px', direction: 'ltr', textAlign: 'right' }}>{item.slug}</td>
                    <td className="admin-text-info" style={{ fontWeight: 500 }}>{getPageName(item.slug)}</td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title || <span className="admin-text-danger">— فارغ</span>}</td>
                    <td className="admin-text-secondary" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description || <span className="admin-text-danger">— فارغ</span>}</td>
                    <td>
                      {score !== null ? (
                        <span className={`admin-badge ${score >= 80 ? 'admin-badge-success' : score >= 50 ? 'admin-badge-warning' : 'admin-badge-danger'}`}>
                          {score}/100
                        </span>
                      ) : (
                        <span className="admin-badge admin-badge-info">غير مفحوص</span>
                      )}
                    </td>
                    <td>{item.focusKeyword || <span className="admin-text-danger">— فارغ</span>}</td>
                    <td><span className="admin-badge admin-badge-info">{item.robots}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleExpand(item); }}
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          title="تعديل مباشر"
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <Edit2 size={14} />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }} className="admin-btn admin-btn-danger admin-btn-sm">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Inline Edit Panel */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={8} style={{ padding: 0, background: 'rgba(255, 77, 109, 0.03)' }}>
                        <div style={{ padding: '24px', borderTop: '2px solid rgba(255, 77, 109, 0.2)', borderBottom: '2px solid rgba(255, 77, 109, 0.2)' }}>
                          {/* Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h4 className="admin-text-brand" style={{ margin: 0 }}>تعديل SEO لـ: {item.slug}</h4>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => { setExpandedId(null); setEditData({}); }}>
                                <X size={14} /> إلغاء
                              </button>
                              <button
                                className="admin-btn admin-btn-primary admin-btn-sm"
                                onClick={() => handleInlineSave(item.id)}
                                disabled={savingId === item.id}
                              >
                                <Save size={14} /> {savingId === item.id ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                              </button>
                            </div>
                          </div>

                          {/* General SEO Fields */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                            <div>
                              <label className="admin-label">عنوان السيو بالعربي (Title AR) ({editData.title?.length || 0}/60)</label>
                              <input
                                className="admin-input"
                                value={editData.title || ''}
                                onChange={e => setEditData({ ...editData, title: e.target.value })}
                                placeholder="عنوان الصفحة لمحركات البحث"
                              />
                              <div style={{ height: '3px', width: '100%', background: '#374151', marginTop: '4px', borderRadius: '2px' }}>
                                <div style={{ height: '100%', width: `${Math.min(100, ((editData.title?.length || 0) / 60) * 100)}%`, background: (editData.title?.length || 0) > 60 ? '#EF4444' : (editData.title?.length || 0) > 40 ? '#22C55E' : '#F59E0B', borderRadius: '2px', transition: 'all 0.3s' }} />
                              </div>
                            </div>
                            <div>
                              <label className="admin-label">عنوان السيو بالإنجليزي (Title EN) ({editData.titleEn?.length || 0}/60)</label>
                              <input
                                className="admin-input"
                                value={editData.titleEn || ''}
                                onChange={e => setEditData({ ...editData, titleEn: e.target.value })}
                                placeholder="SEO Title in English"
                                dir="ltr"
                              />
                              <div style={{ height: '3px', width: '100%', background: '#374151', marginTop: '4px', borderRadius: '2px' }}>
                                <div style={{ height: '100%', width: `${Math.min(100, ((editData.titleEn?.length || 0) / 60) * 100)}%`, background: (editData.titleEn?.length || 0) > 60 ? '#EF4444' : (editData.titleEn?.length || 0) > 40 ? '#22C55E' : '#F59E0B', borderRadius: '2px', transition: 'all 0.3s' }} />
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                            <div>
                              <label className="admin-label">الوصف بالعربي (Description AR) ({editData.description?.length || 0}/160)</label>
                              <textarea
                                className="admin-textarea"
                                value={editData.description || ''}
                                onChange={e => setEditData({ ...editData, description: e.target.value })}
                                rows={3}
                                placeholder="وصف مختصر وجذاب يظهر في نتائج البحث"
                              />
                              <div style={{ height: '3px', width: '100%', background: '#374151', marginTop: '4px', borderRadius: '2px' }}>
                                <div style={{ height: '100%', width: `${Math.min(100, ((editData.description?.length || 0) / 160) * 100)}%`, background: (editData.description?.length || 0) > 160 ? '#EF4444' : (editData.description?.length || 0) > 120 ? '#22C55E' : '#F59E0B', borderRadius: '2px', transition: 'all 0.3s' }} />
                              </div>
                            </div>
                            <div>
                              <label className="admin-label">الوصف بالإنجليزي (Description EN) ({editData.descriptionEn?.length || 0}/160)</label>
                              <textarea
                                className="admin-textarea"
                                value={editData.descriptionEn || ''}
                                onChange={e => setEditData({ ...editData, descriptionEn: e.target.value })}
                                rows={3}
                                placeholder="Meta Description in English"
                                dir="ltr"
                              />
                              <div style={{ height: '3px', width: '100%', background: '#374151', marginTop: '4px', borderRadius: '2px' }}>
                                <div style={{ height: '100%', width: `${Math.min(100, ((editData.descriptionEn?.length || 0) / 160) * 100)}%`, background: (editData.descriptionEn?.length || 0) > 160 ? '#EF4444' : (editData.descriptionEn?.length || 0) > 120 ? '#22C55E' : '#F59E0B', borderRadius: '2px', transition: 'all 0.3s' }} />
                              </div>
                            </div>
                          </div>

                          {/* Advanced Fields */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                            <div>
                              <label className="admin-label">الفهرسة (Robots)</label>
                              <input
                                className="admin-input"
                                value={editData.robots || ''}
                                onChange={e => setEditData({ ...editData, robots: e.target.value })}
                                placeholder="index, follow"
                              />
                            </div>
                            <div>
                              <label className="admin-label">Canonical URL</label>
                              <input
                                className="admin-input"
                                value={editData.canonicalUrl || ''}
                                onChange={e => setEditData({ ...editData, canonicalUrl: e.target.value })}
                                placeholder="اتركه فارغاً للتوليد تلقائياً"
                                dir="ltr"
                              />
                            </div>
                            <div>
                              <label className="admin-label">OG Image URL</label>
                              <input
                                className="admin-input"
                                value={editData.ogImage || ''}
                                onChange={e => setEditData({ ...editData, ogImage: e.target.value })}
                                placeholder="رابط صورة المشاركة"
                                dir="ltr"
                              />
                            </div>
                          </div>

                          {/* Social Media Fields */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                              <label className="admin-label">عنوان المشاركة (OG Title)</label>
                              <input
                                className="admin-input"
                                value={editData.ogTitle || ''}
                                onChange={e => setEditData({ ...editData, ogTitle: e.target.value })}
                                placeholder="اتركه فارغاً لاستخدام عنوان السيو"
                              />
                            </div>
                            <div>
                              <label className="admin-label">وصف المشاركة (OG Description)</label>
                              <input
                                className="admin-input"
                                value={editData.ogDescription || ''}
                                onChange={e => setEditData({ ...editData, ogDescription: e.target.value })}
                                placeholder="اتركه فارغاً لاستخدام الوصف الرئيسي"
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>
                  <p style={{ margin: '0 0 8px' }}>لا توجد سجلات SEO. اضغط &quot;مزامنة الصفحات&quot; لتحميل بيانات السيو لجميع صفحات الموقع.</p>
                </td>
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
