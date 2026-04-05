'use client';

import { useState, useEffect } from 'react';
import { Save, Globe, Phone, MapPin, Clock, Instagram, MessageCircle, Linkedin } from 'lucide-react';

export default function PagesManagementPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/pages');
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        showToast('تم حفظ التعديلات بنجاح', 'success');
      } else {
        showToast('فشل في الحفظ', 'error');
      }
    } catch {
      showToast('حدث خطأ', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateNestedField = (section: string, key: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  const updateBilingualField = (section: string, key: string, lang: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: { ...prev[section][key], [lang]: value },
      },
    }));
  };

  const updateArrayItem = (section: string, arrayKey: string, index: number, field: string, lang: string | null, value: string) => {
    setData((prev: any) => {
      const newArray = [...(prev[section]?.[arrayKey] || [])];
      if (lang) {
        newArray[index] = { ...newArray[index], [field]: { ...newArray[index][field], [lang]: value } };
      } else {
        newArray[index] = { ...newArray[index], [field]: value };
      }
      return { ...prev, [section]: { ...prev[section], [arrayKey]: newArray } };
    });
  };

  const removeArrayItem = (section: string, arrayKey: string, index: number) => {
    setData((prev: any) => {
      const newArray = prev[section][arrayKey].filter((_: any, i: number) => i !== index);
      return { ...prev, [section]: { ...prev[section], [arrayKey]: newArray } };
    });
  };

  const addArrayItem = (section: string, arrayKey: string, template: any) => {
    setData((prev: any) => {
      const newArray = [...(prev[section]?.[arrayKey] || []), template];
      return { ...prev, [section]: { ...prev[section], [arrayKey]: newArray } };
    });
  };

  const showToast = (msg: string, type: string) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const sections = [
    { id: 'hero', label: 'القسم الرئيسي (Hero)', icon: Globe },
    { id: 'whyUs', label: 'لماذا نحن (Why Us)', icon: Globe },
    { id: 'services', label: 'الخدمات (Services)', icon: Globe },
    { id: 'process', label: 'آلية العمل (Process)', icon: Globe },
    { id: 'stats', label: 'الإحصائيات', icon: Globe },
    { id: 'contact', label: 'معلومات الاتصال', icon: Phone },
    { id: 'footer', label: 'الفوتر', icon: Globe },
    { id: 'social', label: 'السوشيال ميديا', icon: Instagram },
  ];

  const [generatingSeo, setGeneratingSeo] = useState<{ [key: string]: boolean }>({});

  const optimizePageSEO = async (section: string, lang: 'ar' | 'en') => {
    let content = data[section]?.description?.[lang] || data[section]?.title?.[lang];
    if (!content) {
      showToast('يرجى ملء الوصف أولاً كمسودة قبل تحسين الـ SEO', 'warning');
      return;
    }
    setGeneratingSeo(prev => ({ ...prev, [`${section}_${lang}`]: true }));
    showToast(`جاري تحسين الـ SEO لصفحة ${section} (${lang})...`, 'info');

    try {
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type: 'page', language: lang })
      });
      const resData = await res.json();

      if (resData.success && resData.seo) {
        updateBilingualField(section, 'title', lang, resData.seo.title);
        updateBilingualField(section, 'description', lang, resData.seo.description);
        showToast('تم تحسين الـ SEO بنجاح!', 'success');
      } else {
        showToast('فشل التحسين', 'error');
      }
    } catch {
      showToast('خطأ في الاتصال', 'error');
    } finally {
      setGeneratingSeo(prev => ({ ...prev, [`${section}_${lang}`]: false }));
    }
  };

  if (loading || !data) {
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#E6E6EA', margin: '0 0 4px' }}>إدارة الصفحات</h2>
          <p style={{ color: '#6B7280', fontSize: 14, margin: 0 }}>تعديل محتوى صفحات الموقع</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'جاري الحفظ...' : <><Save size={16} /> حفظ التعديلات</>}
        </button>
      </div>

      <div className="admin-grid-2" style={{ gridTemplateColumns: '220px 1fr', alignItems: 'start' }}>
        {/* Section Nav */}
        <div className="admin-card" style={{ padding: 8, position: 'sticky', top: 80 }}>
          {sections.map(sec => (
            <button
              key={sec.id}
              className={`admin-section-tab ${activeSection === sec.id ? 'active' : ''}`}
              onClick={() => setActiveSection(sec.id)}
            >
              <sec.icon size={16} className="tab-icon" />
              <span>{sec.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {/* AI SEO Global Toolbar */}
          {['hero', 'whyUs', 'services', 'process'].includes(activeSection) && (
            <div className="admin-card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 77, 109, 0.05)', border: '1px solid rgba(255, 77, 109, 0.2)' }}>
              <div>
                <h4 style={{ color: '#FF4D6D', fontSize: 14, margin: '0 0 4px' }}>✨ التوليد الذكي لـ SEO</h4>
                <p style={{ color: '#6B7280', fontSize: 12, margin: 0 }}>توليد عناوين ووصف ميتا جذابة للمساعدة في تصدر نتائج البحث.</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  className="admin-btn admin-btn-sm" 
                  style={{ background: 'linear-gradient(90deg, #ff4d6d, #ff9a3c)', color: 'white', border: 'none' }} 
                  onClick={() => optimizePageSEO(activeSection, 'ar')}
                  disabled={generatingSeo[`${activeSection}_ar`]}
                >🪄 تحسين (عربي)</button>
                <button 
                  className="admin-btn admin-btn-sm" 
                  style={{ background: 'linear-gradient(90deg, #3b82f6, #2dd4bf)', color: 'white', border: 'none' }} 
                  onClick={() => optimizePageSEO(activeSection, 'en')}
                  disabled={generatingSeo[`${activeSection}_en`]}
                >🪄 Optimize (EN)</button>
              </div>
            </div>
          )}


          {/* Hero Section */}
          {activeSection === 'hero' && (
            <div className="admin-card">
              <h3 style={{ color: '#E6E6EA', fontSize: 18, margin: '0 0 24px' }}>القسم الرئيسي (Hero)</h3>

              {['badge', 'heading', 'subheading'].map(field => (
                <div key={field} style={{ marginBottom: 24 }}>
                  <h4 style={{ color: '#FF4D6D', fontSize: 14, margin: '0 0 12px', textTransform: 'capitalize' }}>
                    {field === 'badge' ? 'الشارة' : field === 'heading' ? 'العنوان الرئيسي' : 'العنوان الفرعي'}
                  </h4>
                  <div className="admin-grid-2">
                    <div>
                      <label className="admin-label">العربية</label>
                      <input
                        className="admin-input"
                        value={data.hero?.[field]?.ar || ''}
                        onChange={e => updateBilingualField('hero', field, 'ar', e.target.value)}
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label className="admin-label">English</label>
                      <input
                        className="admin-input"
                        value={data.hero?.[field]?.en || ''}
                        onChange={e => updateBilingualField('hero', field, 'en', e.target.value)}
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Why Us */}
          {activeSection === 'whyUs' && (
            <div className="admin-card">
              <h3 style={{ color: '#E6E6EA', fontSize: 18, margin: '0 0 24px' }}>صفحة لماذا نحن (Why Us)</h3>
              {['badge', 'title', 'description'].map(field => (
                <div key={field} style={{ marginBottom: 24 }}>
                  <h4 style={{ color: '#FF4D6D', fontSize: 14, margin: '0 0 12px', textTransform: 'capitalize' }}>
                    {field === 'badge' ? 'الشارة (Badge)' : field === 'title' ? 'العنوان' : 'الوصف'}
                  </h4>
                  <div className="admin-grid-2">
                    <div>
                      <label className="admin-label">العربية</label>
                      {field === 'description' ? (
                        <textarea className="admin-textarea" value={data.whyUs?.[field]?.ar || ''} onChange={e => updateBilingualField('whyUs', field, 'ar', e.target.value)} dir="rtl" />
                      ) : (
                        <input className="admin-input" value={data.whyUs?.[field]?.ar || ''} onChange={e => updateBilingualField('whyUs', field, 'ar', e.target.value)} dir="rtl" />
                      )}
                    </div>
                    <div>
                      <label className="admin-label">English</label>
                      {field === 'description' ? (
                        <textarea className="admin-textarea" value={data.whyUs?.[field]?.en || ''} onChange={e => updateBilingualField('whyUs', field, 'en', e.target.value)} dir="ltr" />
                      ) : (
                        <input className="admin-input" value={data.whyUs?.[field]?.en || ''} onChange={e => updateBilingualField('whyUs', field, 'en', e.target.value)} dir="ltr" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Dynamic Features List */}
              <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h4 style={{ color: '#FF4D6D', fontSize: 16, margin: 0 }}>المميزات (Features)</h4>
                  <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => addArrayItem('whyUs', 'features', { icon: '/icon/placeholder.png', title: { en: '', ar: '' }, description: { en: '', ar: '' } })}>
                    + إضافة ميزة
                  </button>
                </div>

                {data.whyUs?.features?.map((feature: any, index: number) => (
                  <div key={index} style={{ padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 12, marginBottom: 16, position: 'relative' }}>
                    <button 
                      onClick={() => removeArrayItem('whyUs', 'features', index)}
                      style={{ position: 'absolute', top: 16, left: 16, background: 'red', color: 'white', borderRadius: '50%', width: 24, height: 24, border: 'none', cursor: 'pointer' }}
                    >X</button>
                    
                    <div style={{ marginBottom: 12 }}>
                      <label className="admin-label">مسار الأيقونة (Icon Path)</label>
                      <input className="admin-input" value={feature.icon || ''} onChange={e => updateArrayItem('whyUs', 'features', index, 'icon', null, e.target.value)} dir="ltr" />
                    </div>
                    <div className="admin-grid-2">
                       <div>
                         <label className="admin-label">العنوان (عربي)</label>
                         <input className="admin-input" value={feature.title?.ar || ''} onChange={e => updateArrayItem('whyUs', 'features', index, 'title', 'ar', e.target.value)} dir="rtl" />
                       </div>
                       <div>
                         <label className="admin-label">العنوان (English)</label>
                         <input className="admin-input" value={feature.title?.en || ''} onChange={e => updateArrayItem('whyUs', 'features', index, 'title', 'en', e.target.value)} dir="ltr" />
                       </div>
                       <div>
                         <label className="admin-label">الوصف (عربي)</label>
                         <textarea className="admin-textarea" value={feature.description?.ar || ''} onChange={e => updateArrayItem('whyUs', 'features', index, 'description', 'ar', e.target.value)} dir="rtl" />
                       </div>
                       <div>
                         <label className="admin-label">الوصف (English)</label>
                         <textarea className="admin-textarea" value={feature.description?.en || ''} onChange={e => updateArrayItem('whyUs', 'features', index, 'description', 'en', e.target.value)} dir="ltr" />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {activeSection === 'services' && (
            <div className="admin-card">
              <h3 style={{ color: '#E6E6EA', fontSize: 18, margin: '0 0 24px' }}>صفحة الخدمات (Services)</h3>
              {['badge', 'title', 'description'].map(field => (
                <div key={field} style={{ marginBottom: 24 }}>
                  <h4 style={{ color: '#FF4D6D', fontSize: 14, margin: '0 0 12px', textTransform: 'capitalize' }}>
                    {field === 'badge' ? 'الشارة (Badge)' : field === 'title' ? 'العنوان' : 'الوصف'}
                  </h4>
                  <div className="admin-grid-2">
                    <div>
                      <label className="admin-label">العربية</label>
                      {field === 'description' ? (
                        <textarea className="admin-textarea" value={data.services?.[field]?.ar || ''} onChange={e => updateBilingualField('services', field, 'ar', e.target.value)} dir="rtl" />
                      ) : (
                        <input className="admin-input" value={data.services?.[field]?.ar || ''} onChange={e => updateBilingualField('services', field, 'ar', e.target.value)} dir="rtl" />
                      )}
                    </div>
                    <div>
                      <label className="admin-label">English</label>
                      {field === 'description' ? (
                        <textarea className="admin-textarea" value={data.services?.[field]?.en || ''} onChange={e => updateBilingualField('services', field, 'en', e.target.value)} dir="ltr" />
                      ) : (
                        <input className="admin-input" value={data.services?.[field]?.en || ''} onChange={e => updateBilingualField('services', field, 'en', e.target.value)} dir="ltr" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Dynamic Services List (Digital Marketing Category) */}
              {data.services?.categories && (
                <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h4 style={{ color: '#FF4D6D', fontSize: 16, margin: 0 }}>خدمات التسويق الرقمي (Digital Marketing)</h4>
                  </div>

                  {data.services?.categories?.['digital-marketing']?.map((service: any, index: number) => (
                    <div key={index} style={{ padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 12, marginBottom: 16, position: 'relative' }}>
                      <div style={{ marginBottom: 12 }}>
                        <label className="admin-label">مسار الأيقونة (Icon Path)</label>
                        <input className="admin-input" value={service.icon || ''} onChange={e => {
                          const newCats = {...data.services.categories};
                          newCats['digital-marketing'][index].icon = e.target.value;
                          updateNestedField('services', 'categories', newCats);
                        }} dir="ltr" />
                      </div>
                      <div className="admin-grid-2">
                         <div>
                           <label className="admin-label">عنوان الخدمة (عربي)</label>
                           <input className="admin-input" value={service.title?.ar || ''} onChange={e => {
                             const newCats = {...data.services.categories};
                             newCats['digital-marketing'][index].title.ar = e.target.value;
                             updateNestedField('services', 'categories', newCats);
                           }} dir="rtl" />
                         </div>
                         <div>
                           <label className="admin-label">عنوان الخدمة (English)</label>
                           <input className="admin-input" value={service.title?.en || ''} onChange={e => {
                              const newCats = {...data.services.categories};
                              newCats['digital-marketing'][index].title.en = e.target.value;
                              updateNestedField('services', 'categories', newCats);
                           }} dir="ltr" />
                         </div>
                         <div>
                           <label className="admin-label">الوصف (عربي)</label>
                           <textarea className="admin-textarea" value={service.description?.ar || ''} onChange={e => {
                              const newCats = {...data.services.categories};
                              newCats['digital-marketing'][index].description.ar = e.target.value;
                              updateNestedField('services', 'categories', newCats);
                           }} dir="rtl" />
                         </div>
                         <div>
                           <label className="admin-label">الوصف (English)</label>
                           <textarea className="admin-textarea" value={service.description?.en || ''} onChange={e => {
                              const newCats = {...data.services.categories};
                              newCats['digital-marketing'][index].description.en = e.target.value;
                              updateNestedField('services', 'categories', newCats);
                           }} dir="ltr" />
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Process */}
          {activeSection === 'process' && (
            <div className="admin-card">
              <h3 style={{ color: '#E6E6EA', fontSize: 18, margin: '0 0 24px' }}>صفحة آلية العمل (Process)</h3>
              {['badge', 'title', 'description'].map(field => (
                <div key={field} style={{ marginBottom: 24 }}>
                  <h4 style={{ color: '#FF4D6D', fontSize: 14, margin: '0 0 12px', textTransform: 'capitalize' }}>
                     {field === 'badge' ? 'الشارة (Badge)' : field === 'title' ? 'العنوان' : 'الوصف'}
                  </h4>
                  <div className="admin-grid-2">
                    <div>
                      <label className="admin-label">العربية</label>
                      {field === 'description' ? (
                        <textarea className="admin-textarea" value={data.process?.[field]?.ar || ''} onChange={e => updateBilingualField('process', field, 'ar', e.target.value)} dir="rtl" />
                      ) : (
                        <input className="admin-input" value={data.process?.[field]?.ar || ''} onChange={e => updateBilingualField('process', field, 'ar', e.target.value)} dir="rtl" />
                      )}
                    </div>
                    <div>
                      <label className="admin-label">English</label>
                      {field === 'description' ? (
                        <textarea className="admin-textarea" value={data.process?.[field]?.en || ''} onChange={e => updateBilingualField('process', field, 'en', e.target.value)} dir="ltr" />
                      ) : (
                        <input className="admin-input" value={data.process?.[field]?.en || ''} onChange={e => updateBilingualField('process', field, 'en', e.target.value)} dir="ltr" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Dynamic Process Steps */}
              <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h4 style={{ color: '#FF4D6D', fontSize: 16, margin: 0 }}>خطوات العمل (Process Steps)</h4>
                  <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => addArrayItem('process', 'steps', { icon: '/icon/placeholder.png', title: { en: '', ar: '' }, description: { en: '', ar: '' } })}>
                    + إضافة خطوة
                  </button>
                </div>

                {data.process?.steps?.map((step: any, index: number) => (
                  <div key={index} style={{ padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 12, marginBottom: 16, position: 'relative' }}>
                    <button 
                      onClick={() => removeArrayItem('process', 'steps', index)}
                      style={{ position: 'absolute', top: 16, left: 16, background: 'red', color: 'white', borderRadius: '50%', width: 24, height: 24, border: 'none', cursor: 'pointer' }}
                    >X</button>
                    
                    <div style={{ marginBottom: 12 }}>
                      <label className="admin-label">مسار الأيقونة (Icon Path)</label>
                      <input className="admin-input" value={step.icon || ''} onChange={e => updateArrayItem('process', 'steps', index, 'icon', null, e.target.value)} dir="ltr" />
                    </div>
                    <div className="admin-grid-2">
                       <div>
                         <label className="admin-label">عنوان الخطوة (عربي)</label>
                         <input className="admin-input" value={step.title?.ar || ''} onChange={e => updateArrayItem('process', 'steps', index, 'title', 'ar', e.target.value)} dir="rtl" />
                       </div>
                       <div>
                         <label className="admin-label">عنوان الخطوة (English)</label>
                         <input className="admin-input" value={step.title?.en || ''} onChange={e => updateArrayItem('process', 'steps', index, 'title', 'en', e.target.value)} dir="ltr" />
                       </div>
                       <div>
                         <label className="admin-label">تفاصيل الخطوة (عربي)</label>
                         <textarea className="admin-textarea" value={step.description?.ar || ''} onChange={e => updateArrayItem('process', 'steps', index, 'description', 'ar', e.target.value)} dir="rtl" />
                       </div>
                       <div>
                         <label className="admin-label">تفاصيل الخطوة (English)</label>
                         <textarea className="admin-textarea" value={step.description?.en || ''} onChange={e => updateArrayItem('process', 'steps', index, 'description', 'en', e.target.value)} dir="ltr" />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          {activeSection === 'stats' && (
            <div className="admin-card">
              <h3 style={{ color: '#E6E6EA', fontSize: 18, margin: '0 0 24px' }}>الإحصائيات</h3>
              <div className="admin-grid-2">
                {[
                  { key: 'yearsExperience', label: 'سنوات الخبرة' },
                  { key: 'teamMembers', label: 'أعضاء الفريق' },
                  { key: 'projectsCompleted', label: 'المشاريع المكتملة' },
                  { key: 'satisfiedCustomers', label: 'عملاء راضون' },
                ].map(item => (
                  <div key={item.key}>
                    <label className="admin-label">{item.label}</label>
                    <input
                      className="admin-input"
                      value={data.stats?.[item.key] || ''}
                      onChange={e => updateNestedField('stats', item.key, e.target.value)}
                      dir="ltr"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          {activeSection === 'contact' && (
            <div className="admin-card">
              <h3 style={{ color: '#E6E6EA', fontSize: 18, margin: '0 0 24px' }}>معلومات الاتصال</h3>

              <div style={{ marginBottom: 20 }}>
                <label className="admin-label">البريد الإلكتروني</label>
                <input className="admin-input" value={data.contact?.email || ''} onChange={e => updateNestedField('contact', 'email', e.target.value)} dir="ltr" />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="admin-label">رقم الهاتف</label>
                <input className="admin-input" value={data.contact?.phone || ''} onChange={e => updateNestedField('contact', 'phone', e.target.value)} dir="ltr" />
              </div>

              <div style={{ marginBottom: 20 }}>
                <h4 style={{ color: '#FF4D6D', fontSize: 14, margin: '0 0 12px' }}>العنوان</h4>
                <div className="admin-grid-2">
                  <div>
                    <label className="admin-label">العربية</label>
                    <input className="admin-input" value={data.contact?.address?.ar || ''} onChange={e => updateBilingualField('contact', 'address', 'ar', e.target.value)} dir="rtl" />
                  </div>
                  <div>
                    <label className="admin-label">English</label>
                    <input className="admin-input" value={data.contact?.address?.en || ''} onChange={e => updateBilingualField('contact', 'address', 'en', e.target.value)} dir="ltr" />
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#FF4D6D', fontSize: 14, margin: '0 0 12px' }}>ساعات العمل</h4>
                <div className="admin-grid-2">
                  <div>
                    <label className="admin-label">العربية</label>
                    <input className="admin-input" value={data.contact?.workingHours?.ar || ''} onChange={e => updateBilingualField('contact', 'workingHours', 'ar', e.target.value)} dir="rtl" />
                  </div>
                  <div>
                    <label className="admin-label">English</label>
                    <input className="admin-input" value={data.contact?.workingHours?.en || ''} onChange={e => updateBilingualField('contact', 'workingHours', 'en', e.target.value)} dir="ltr" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          {activeSection === 'footer' && (
            <div className="admin-card">
              <h3 style={{ color: '#E6E6EA', fontSize: 18, margin: '0 0 24px' }}>الفوتر</h3>

              {['tagline', 'copyright'].map(field => (
                <div key={field} style={{ marginBottom: 24 }}>
                  <h4 style={{ color: '#FF4D6D', fontSize: 14, margin: '0 0 12px' }}>
                    {field === 'tagline' ? 'الشعار' : 'حقوق النشر'}
                  </h4>
                  <div className="admin-grid-2">
                    <div>
                      <label className="admin-label">العربية</label>
                      <input className="admin-input" value={data.footer?.[field]?.ar || ''} onChange={e => updateBilingualField('footer', field, 'ar', e.target.value)} dir="rtl" />
                    </div>
                    <div>
                      <label className="admin-label">English</label>
                      <input className="admin-input" value={data.footer?.[field]?.en || ''} onChange={e => updateBilingualField('footer', field, 'en', e.target.value)} dir="ltr" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Social */}
          {activeSection === 'social' && (
            <div className="admin-card">
              <h3 style={{ color: '#E6E6EA', fontSize: 18, margin: '0 0 24px' }}>روابط السوشيال ميديا</h3>
              {[
                { key: 'instagram', label: 'Instagram', icon: '📷' },
                { key: 'snapchat', label: 'Snapchat', icon: '👻' },
                { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
                { key: 'tiktok', label: 'TikTok', icon: '🎵' },
                { key: 'whatsapp', label: 'WhatsApp', icon: '💬' },
              ].map(item => (
                <div key={item.key} style={{ marginBottom: 16 }}>
                  <label className="admin-label">{item.icon} {item.label}</label>
                  <input
                    className="admin-input"
                    value={data.social?.[item.key] || ''}
                    onChange={e => updateNestedField('social', item.key, e.target.value)}
                    placeholder={`https://...`}
                    dir="ltr"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
