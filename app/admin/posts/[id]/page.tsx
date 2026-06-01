'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowRight, Upload, X, Save, Tag } from 'lucide-react';
import Link from 'next/link';
import RichTextEditor from '@/components/admin/RichTextEditor';

const CATEGORIES = [
  'Digital Marketing', 'AI & Technology', 'Innovation',
  'Business', 'Strategy', 'Tips & Tricks', 'SEO', 'Web Development',
];

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'ar' | 'en'>('ar');
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    id: '',
    title: '',
    titleAr: '',
    slug: '',
    content: '',
    contentAr: '',
    excerpt: '',
    excerptAr: '',
    category: 'Digital Marketing',
    categoryAr: '',
    author: 'D-Arrow',
    imageUrl: '',
    tags: [] as string[],
    status: 'published',
    date: '',
    time: '',
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const res = await fetch('/api/blog/posts');
      const data = await res.json();
      const post = (data.posts || []).find((p: any) => p.id === postId);
      if (post) {
        setForm({
          id: post.id,
          title: post.title || '',
          titleAr: post.titleAr || '',
          slug: post.slug || '',
          content: post.content || '',
          contentAr: post.contentAr || '',
          excerpt: post.excerpt || '',
          excerptAr: post.excerptAr || '',
          category: post.category || 'Digital Marketing',
          categoryAr: post.categoryAr || '',
          author: post.author || 'D-Arrow',
          imageUrl: post.imageUrl || '',
          tags: Array.isArray(post.tags) ? post.tags : (post.tags ? JSON.parse(post.tags) : []),
          status: post.status || 'published',
          date: post.date || '',
          time: post.time ? post.time.slice(0, 5) : '',
        });
      } else {
        showToast('المقال غير موجود', 'error');
        setTimeout(() => router.push('/admin/posts'), 1500);
      }
    } catch {
      showToast('فشل في تحميل المقال', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const [generatingSeo, setGeneratingSeo] = useState(false);

  const optimizeSEO = async (lang: 'ar' | 'en') => {
    const content = lang === 'ar' ? form.contentAr : form.content;
    if (!content || content.length < 50) {
      showToast('يرجى كتابة محتوى كافي للمقال أولاً', 'warning');
      return;
    }
    
    setGeneratingSeo(true);
    showToast('جاري توليد الـ SEO بالذكاء الاصطناعي...', 'info');

    try {
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type: 'post', language: lang })
      });
      const data = await res.json();

      if (data.success && data.seo) {
        updateField(lang === 'ar' ? 'titleAr' : 'title', data.seo.title);
        updateField(lang === 'ar' ? 'excerptAr' : 'excerpt', data.seo.description);
        showToast('تم تحسين الـ SEO بنجاح!', 'success');
      } else {
        showToast(data.error || 'فشل في تحسين الـ SEO', 'error');
      }
    } catch (e) {
      showToast('حدث خطأ أثناء الاتصال بالذكاء الاصطناعي', 'error');
    } finally {
      setGeneratingSeo(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        updateField('imageUrl', data.url);
        showToast('تم رفع الصورة', 'success');
      } else {
        showToast(data.error || data.debug || 'فشل في رفع الصورة', 'error');
      }
    } catch (e: any) {
      showToast(`خطأ في رفع الصورة: ${e.message}`, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (statusOverride?: 'published' | 'draft') => {
    if (!form.title && !form.titleAr) {
      showToast('يرجى إدخال عنوان المقال', 'error');
      return;
    }

    // Auto-generate slug if empty
    let finalSlug = form.slug;
    if (!finalSlug) {
      const base = form.title || form.titleAr || 'post';
      finalSlug = base.toLowerCase().replace(/[^\w\u0621-\u064A\s]/gi, '').replace(/\s+/g, '-');
    }

    setSaving(true);
    const finalStatus = statusOverride || form.status;
    try {
      const res = await fetch('/api/blog/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          slug: finalSlug,
          status: finalStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(finalStatus === 'published' ? 'تم نشر المقال بنجاح' : 'تم حفظ التعديلات بنجاح', 'success');
        setTimeout(() => router.push('/admin/posts'), 1000);
      } else {
        showToast(data.error || 'فشل في تحديث المقال', 'error');
      }
    } catch {
      showToast('حدث خطأ', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg: string, type: string) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="admin-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(255,77,109,0.2)', borderTopColor: '#FF4D6D', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="admin-content">
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/admin/posts" className="admin-btn admin-btn-ghost admin-btn-sm"><ArrowRight size={18} /></Link>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#E6E6EA', margin: 0 }}>تعديل المقال</h2>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {form.status === 'draft' ? (
            <>
              <button className="admin-btn admin-btn-secondary" onClick={() => handleSubmit('draft')} disabled={saving}>
                حفظ كمسودة
              </button>
              <button className="admin-btn admin-btn-primary" onClick={() => handleSubmit('published')} disabled={saving} style={{ background: 'linear-gradient(90deg, #10B981, #059669)', border: 'none' }}>
                {saving ? 'جاري النشر...' : 'نشر المقال الآن'}
              </button>
            </>
          ) : (
            <>
              <button className="admin-btn admin-btn-ghost" onClick={() => handleSubmit('draft')} disabled={saving} style={{ color: '#9CA3AF' }}>
                تحويل لمسودة
              </button>
              <button className="admin-btn admin-btn-primary" onClick={() => handleSubmit('published')} disabled={saving}>
                {saving ? 'جاري الحفظ...' : <><Save size={16} /> حفظ التعديلات</>}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="admin-grid-2" style={{ gridTemplateColumns: '1fr 360px', alignItems: 'start' }}>
        {/* Editor */}
        <div>
          <div className="admin-tabs" style={{ marginBottom: 20 }}>
            <button className={`admin-tab ${activeTab === 'ar' ? 'active' : ''}`} onClick={() => setActiveTab('ar')}>العربية</button>
            <button className={`admin-tab ${activeTab === 'en' ? 'active' : ''}`} onClick={() => setActiveTab('en')}>English</button>
          </div>

          <div className="admin-card">
            {activeTab === 'ar' ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <label className="admin-label" style={{ margin: 0 }}>العنوان والملخص</label>
                  <button 
                    className="admin-btn admin-btn-sm" 
                    style={{ background: 'linear-gradient(90deg, #ff4d6d, #ff9a3c)', color: 'white', border: 'none', padding: '6px 12px', fontSize: 13, gap: 6 }} 
                    onClick={() => optimizeSEO('ar')}
                    disabled={generatingSeo}
                  >
                    🪄 {generatingSeo ? 'جاري التحسين...' : 'تحسين الـ SEO بالذكاء الاصطناعي'}
                  </button>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <input className="admin-input" placeholder="العنوان بالعربية" value={form.titleAr} onChange={e => updateField('titleAr', e.target.value)} dir="rtl" />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <textarea className="admin-textarea" placeholder="وصف ميتا (Meta Description)" value={form.excerptAr} onChange={e => updateField('excerptAr', e.target.value)} style={{ minHeight: 80 }} dir="rtl" />
                </div>
                <div>
                  <label className="admin-label">المحتوى بالعربية</label>
                  <RichTextEditor value={form.contentAr} onChange={(val) => updateField('contentAr', val)} dir="rtl" />
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <label className="admin-label" style={{ margin: 0 }}>Title & Excerpt</label>
                  <button 
                    className="admin-btn admin-btn-sm" 
                    style={{ background: 'linear-gradient(90deg, #ff4d6d, #ff9a3c)', color: 'white', border: 'none', padding: '6px 12px', fontSize: 13, gap: 6 }} 
                    onClick={() => optimizeSEO('en')}
                    disabled={generatingSeo}
                  >
                    🪄 {generatingSeo ? 'Generating SEO...' : 'Optimize SEO Details with AI'}
                  </button>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <input className="admin-input" placeholder="Title (English)" value={form.title} onChange={e => updateField('title', e.target.value)} dir="ltr" />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <textarea className="admin-textarea" placeholder="Meta Description" value={form.excerpt} onChange={e => updateField('excerpt', e.target.value)} style={{ minHeight: 80 }} dir="ltr" />
                </div>
                <div>
                  <label className="admin-label">Content</label>
                  <RichTextEditor value={form.content} onChange={(val) => updateField('content', val)} dir="ltr" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Image */}
          <div className="admin-card">
            <h4 style={{ color: '#E6E6EA', fontSize: 15, margin: '0 0 16px' }}>صورة المقال</h4>
            {form.imageUrl ? (
              <div className="admin-upload-preview" style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,77,109,0.15)' }}>
                <img src={form.imageUrl} alt="Preview" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                <button onClick={() => updateField('imageUrl', '')} style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: '50%', background: 'rgba(239,68,68,0.9)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="admin-upload-zone" onClick={() => fileInputRef.current?.click()}>
                {uploading ? (
                  <div style={{ width: 36, height: 36, border: '3px solid rgba(255,77,109,0.2)', borderTopColor: '#FF4D6D', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                ) : (
                  <Upload size={32} style={{ color: '#6B7280', margin: '0 auto 12px', display: 'block' }} />
                )}
                <p style={{ color: '#9CA3AF', fontSize: 14, margin: '0 0 4px' }}>{uploading ? 'جاري الرفع...' : 'اضغط لرفع صورة'}</p>
                <p style={{ color: '#6B7280', fontSize: 12, margin: 0 }}>JPG, PNG, WebP — Max 5MB</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            <div style={{ marginTop: 12 }}>
              <label className="admin-label">أو أدخل رابط الصورة</label>
              <input className="admin-input" placeholder="https://..." value={form.imageUrl} onChange={e => updateField('imageUrl', e.target.value)} dir="ltr" />
            </div>
          </div>

          {/* Settings */}
          <div className="admin-card">
            <h4 style={{ color: '#E6E6EA', fontSize: 15, margin: '0 0 16px' }}>الإعدادات</h4>
            <div style={{ marginBottom: 16 }}>
              <label className="admin-label">رابط المقالة (Slug)</label>
              <input className="admin-input" placeholder="مثال: /blog/my-article-title" value={form.slug} onChange={e => updateField('slug', e.target.value)} dir="ltr" />
              <p style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>يُستخدم في الـ Sitemap — اتركه فارغاً لاستخدام الرابط التلقائي</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="admin-label">الفئة</label>
              <select className="admin-select" value={form.category} onChange={e => updateField('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="admin-label">الفئة بالعربية</label>
              <input className="admin-input" value={form.categoryAr} onChange={e => updateField('categoryAr', e.target.value)} dir="rtl" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="admin-label">الكاتب</label>
              <input className="admin-input" value={form.author} onChange={e => updateField('author', e.target.value)} />
            </div>
            
            <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label className="admin-label">تاريخ النشر</label>
                <input
                  type="date"
                  className="admin-input"
                  value={form.date}
                  onChange={e => updateField('date', e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="admin-label">وقت النشر</label>
                <input
                  type="time"
                  className="admin-input"
                  value={form.time}
                  onChange={e => updateField('time', e.target.value)}
                />
              </div>
            </div>
            {/* Tags */}
            <div style={{ marginBottom: 16 }}>
              <label className="admin-label"><Tag size={14} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6 }} />الوسوم (Tags)</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  className="admin-input"
                  placeholder="أضف وسم..."
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const tag = tagInput.trim();
                      if (tag && !form.tags.includes(tag)) {
                        setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                      }
                      setTagInput('');
                    }
                  }}
                  dir="auto"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="admin-btn admin-btn-sm"
                  style={{ background: 'rgba(255,77,109,0.15)', color: '#FF4D6D', border: '1px solid rgba(255,77,109,0.3)', padding: '6px 12px', flexShrink: 0 }}
                  onClick={() => {
                    const tag = tagInput.trim();
                    if (tag && !form.tags.includes(tag)) {
                      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                    }
                    setTagInput('');
                  }}
                >
                  +
                </button>
              </div>
              {form.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {form.tags.map((tag, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      background: 'linear-gradient(135deg, rgba(255,77,109,0.15), rgba(255,154,60,0.1))',
                      border: '1px solid rgba(255,77,109,0.25)',
                      color: '#FF9A3C', padding: '4px 10px', borderRadius: 20,
                      fontSize: 13, fontWeight: 500,
                    }}>
                      {tag}
                      <button
                        onClick={() => setForm(prev => ({ ...prev, tags: prev.tags.filter((_, idx) => idx !== i) }))}
                        style={{ background: 'none', border: 'none', color: '#FF4D6D', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: 16 }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="admin-label">الحالة</label>
              <select className="admin-select" value={form.status} onChange={e => updateField('status', e.target.value)}>
                <option value="published">منشور</option>
                <option value="draft">مسودة</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
