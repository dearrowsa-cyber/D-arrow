'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  LayoutDashboard,
  Table2,
  Inbox,
  Settings,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Star,
  X,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { useRealEstate, type REDemoProperty } from './RealEstateContext';
import {
  formatPrice,
  PROPERTY_TYPE_LABELS,
  RE_THEME_LABELS,
  STATUS_LABELS,
  type PropertyType,
  type ReThemePreset,
} from '@/lib/real-estate/data';

type Tab = 'overview' | 'listings' | 'inquiries' | 'settings';

const EMPTY_FORM = {
  slug: '',
  title: '',
  description: '',
  type: 'villa' as PropertyType,
  listingType: 'sale' as 'sale' | 'rent',
  price: 1000000,
  city: 'الرياض',
  district: '',
  bedrooms: 4,
  bathrooms: 3,
  areaSqm: 300,
  imagesText: '',
  featuresText: '',
  featured: false,
};

const THEME_SWATCH_COLORS: Record<ReThemePreset, [string, string]> = {
  'emerald-gold': ['#d4af37', '#34d399'],
  'sapphire-silver': ['#4cc3ff', '#8f9bff'],
  'noir-platinum': ['#e7c989', '#b8bcc4'],
};

export default function RealEstateAdmin() {
  const {
    properties,
    inquiries,
    settings,
    themeClass,
    addProperty,
    updateProperty,
    deleteProperty,
    cycleStatus,
    setInquiryStatus,
    deleteInquiry,
    updateSettings,
    resetDemo,
  } = useRealEstate();

  const themePreset = settings.themePreset || 'emerald-gold';

  const [tab, setTab] = useState<Tab>('overview');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const stats = useMemo(() => {
    const byStatus = (s: REDemoProperty['status']) => properties.filter((p) => p.status === s).length;
    const portfolio = properties
      .filter((p) => p.listingType === 'sale')
      .reduce((sum, p) => sum + p.price, 0);
    return [
      { label: 'إجمالي العقارات', value: `${properties.length}`, icon: Building2 },
      { label: 'متاحة للبيع/الإيجار', value: `${byStatus('available')}`, icon: CheckCircle2 },
      { label: 'تم بيعها', value: `${byStatus('sold')}`, icon: Star },
      { label: 'طلبات معاينة جديدة', value: `${inquiries.filter((q) => q.status === 'new').length}`, icon: Inbox },
      { label: 'قيمة المحفظة', value: formatPrice(portfolio, 'sale'), icon: LayoutDashboard },
    ];
  }, [properties, inquiries]);

  const openAdd = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setEditorOpen(true);
  };

  const openEdit = (p: REDemoProperty) => {
    setForm({
      slug: p.slug,
      title: p.title,
      description: p.description,
      type: p.type,
      listingType: p.listingType,
      price: p.price,
      city: p.city,
      district: p.district,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      areaSqm: p.areaSqm,
      imagesText: p.images.join('\n'),
      featuresText: p.features.join('، '),
      featured: p.featured,
    });
    setEditingId(p.id);
    setEditorOpen(true);
  };

  const saveProperty = () => {
    if (!form.title.trim()) return;
    const slug =
      form.slug.trim() ||
      `prop-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const payload = {
      slug,
      title: form.title.trim(),
      description: form.description.trim(),
      type: form.type,
      listingType: form.listingType,
      price: Number(form.price) || 0,
      currency: 'SAR',
      city: form.city.trim() || 'الرياض',
      district: form.district.trim(),
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      areaSqm: Number(form.areaSqm) || 0,
      features: form.featuresText.split(/[،,\n]/).map((f) => f.trim()).filter(Boolean),
      images: form.imagesText.split(/\n/).map((s) => s.trim()).filter(Boolean),
      latitude: null,
      longitude: null,
      featured: form.featured,
      status: 'available' as const,
    };
    // keep existing status when editing
    const existing = editingId ? properties.find((p) => p.id === editingId) : undefined;
    if (editingId && existing) {
      updateProperty(editingId, { ...payload, id: existing.id, status: existing.status });
    } else if (!properties.some((p) => p.slug === slug)) {
      addProperty(payload);
    }
    setEditorOpen(false);
  };

  const tabs: Array<{ id: Tab; label: string; icon: typeof LayoutDashboard }> = [
    { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
    { id: 'listings', label: 'العقارات', icon: Table2 },
    { id: 'inquiries', label: 'طلبات المعاينة', icon: Inbox },
    { id: 'settings', label: 'إعدادات الموقع', icon: Settings },
  ];

  return (
    <div className={`re-rtl re-page ${themeClass}`} dir="rtl">
      {/* Header */}
      <header className="re-header">
        <div className="re-container re-header-inner">
          <div className="re-logo">
            <span className="re-logo-badge"><LayoutDashboard size={19} /></span>
            لوحة تحكم {settings.agencyName}
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Link href="/demo/real-estate" className="re-btn re-btn-ghost">عرض الموقع</Link>
            <button className="re-btn re-btn-primary" onClick={openAdd}>
              <Plus size={16} /> إضافة عقار
            </button>
          </div>
        </div>
      </header>

      <section className="re-container" style={{ paddingTop: '2rem' }}>
        {/* Tabs */}
        <div className="re-admin-tabs">
          {tabs.map((t) => (
            <button key={t.id} className={`re-chip ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <t.icon size={14} style={{ display: 'inline', marginInlineEnd: 6 }} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ---------- Overview ---------- */}
        {tab === 'overview' && (
          <>
            <div className="re-stats" style={{ marginTop: 0 }}>
              {stats.map((s) => (
                <div key={s.label} className="re-stat">
                  <s.icon size={18} style={{ marginInlineStart: 'auto', marginInlineEnd: 'auto', color: 'var(--re-secondary)', marginBottom: 4 }} />
                  <b style={{ fontSize: s.value.length > 8 ? '1.05rem' : '1.6rem' }}>{s.value}</b>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>

            <h2 className="re-section-title" style={{ marginTop: '2.5rem' }}>أحدث الطلبات</h2>
            {inquiries.slice(0, 3).map((q) => (
              <div key={q.id} className="re-inq-card">
                <div>
                  <b>{q.name}</b> — <span style={{ color: 'var(--re-muted)' }}>{q.propertyTitle ?? 'عام'}</span>
                  <div style={{ color: 'var(--re-muted)', fontSize: '0.82rem', marginTop: 4 }}>{q.message}</div>
                </div>
                <span style={{ color: 'var(--re-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{q.createdAt}</span>
              </div>
            ))}

            <h2 className="re-section-title" style={{ marginTop: '2.5rem' }}>مظهر الموقع الحالي</h2>
            <ThemeSwatches current={themePreset} onPick={(t) => updateSettings({ themePreset: t })} />
          </>
        )}

        {/* ---------- Listings ---------- */}
        {tab === 'listings' && (
          <div className="re-table-wrap">
            <table className="re-table">
              <thead>
                <tr>
                  <th>العقار</th>
                  <th>النوع</th>
                  <th>المدينة</th>
                  <th>السعر</th>
                  <th>الحالة</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images[0]} alt="" className="re-table-thumb" />
                        <div>
                          <Link href={`/demo/real-estate/${p.slug}`} style={{ color: 'inherit', fontWeight: 700 }}>
                            {p.title}
                          </Link>
                          {p.featured && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--re-primary)' }}>★ مميز</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{PROPERTY_TYPE_LABELS[p.type]}</td>
                    <td>{p.city}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatPrice(p.price, p.listingType)}</td>
                    <td>
                      <button
                        className={`re-pill re-pill-status-${p.status}`}
                        style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.76rem' }}
                        onClick={() => cycleStatus(p.id)}
                        title="اضغط لتغيير الحالة"
                      >
                        {STATUS_LABELS[p.status]?.label || p.status} ⟳
                      </button>
                    </td>
                    <td>
                      <div className="re-table-actions">
                        <button className="re-btn re-btn-ghost re-btn-sm" onClick={() => openEdit(p)}>
                          <Pencil size={13} /> تعديل
                        </button>
                        <button
                          className="re-btn re-btn-ghost re-btn-sm"
                          onClick={() => updateProperty(p.id, { featured: !p.featured })}
                        >
                          <Star size={13} fill={p.featured ? 'currentColor' : 'none'} />
                          {p.featured ? 'إلغاء التمييز' : 'تمييز'}
                        </button>
                        <button className="re-btn re-btn-danger re-btn-sm" onClick={() => deleteProperty(p.id)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ---------- Inquiries ---------- */}
        {tab === 'inquiries' && (
          <div>
            {inquiries.length === 0 ? (
              <div className="re-empty">لا توجد طلبات معاينة بعد.</div>
            ) : (
              inquiries.map((q) => (
                <div key={q.id} className="re-inq-card">
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <b>
                      {q.status === 'new' && <i className="re-dot-new" />}
                      {q.name}
                    </b>
                    <span style={{ color: 'var(--re-muted)', fontSize: '0.85rem' }}> · {q.phone}</span>
                    {q.email && <span style={{ color: 'var(--re-muted)', fontSize: '0.85rem' }}> · {q.email}</span>}
                    <div style={{ color: 'var(--re-muted)', fontSize: '0.82rem', marginTop: 6 }}>
                      {q.propertyTitle ? `بخصوص: ${q.propertyTitle}` : 'استفسار عام'}
                    </div>
                    {q.message && <div style={{ marginTop: 8, lineHeight: 1.9 }}>{q.message}</div>}
                    <div style={{ color: 'var(--re-muted)', fontSize: '0.75rem', marginTop: 6 }}>{q.createdAt}</div>
                  </div>
                  <div style={{ display: 'grid', gap: '0.5rem', alignContent: 'start' }}>
                    <select
                      className="re-select"
                      style={{ padding: '0.4rem 0.7rem', fontSize: '0.82rem' }}
                      value={q.status}
                      onChange={(e) => setInquiryStatus(q.id, e.target.value as typeof q.status)}
                    >
                      <option value="new">جديد</option>
                      <option value="contacted">تم التواصل</option>
                      <option value="closed">مغلق</option>
                    </select>
                    <a href={`tel:${q.phone}`} className="re-btn re-btn-ghost re-btn-sm">📞 اتصال</a>
                    <button className="re-btn re-btn-danger re-btn-sm" onClick={() => deleteInquiry(q.id)}>
                      <Trash2 size={13} /> حذف
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ---------- Settings ---------- */}
        {tab === 'settings' && (
          <div style={{ maxWidth: 560 }}>
            <div className="re-glass-panel re-panel">
              <h3><Settings size={18} color="var(--re-primary)" /> هوية الجهة العقارية</h3>
              <div className="re-form-grid">
                <div className="re-field">
                  <label>اسم الوكالة</label>
                  <input
                    className="re-input"
                    value={settings.agencyName}
                    onChange={(e) => updateSettings({ agencyName: e.target.value })}
                  />
                </div>
                <div className="re-field">
                  <label>الشعار النصي</label>
                  <input
                    className="re-input"
                    value={settings.slogan}
                    onChange={(e) => updateSettings({ slogan: e.target.value })}
                  />
                </div>
                <div className="re-field">
                  <label>رقم التواصل</label>
                  <input
                    className="re-input"
                    value={settings.phone}
                    onChange={(e) => updateSettings({ phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="re-glass-panel re-panel">
              <h3><Star size={18} color="var(--re-primary)" /> مظهر الموقع (الثيم)</h3>
              <ThemeSwatches current={themePreset} onPick={(t) => updateSettings({ themePreset: t })} />
              <p style={{ color: 'var(--re-muted)', fontSize: '0.82rem', marginTop: '1rem' }}>
                يتم تطبيق الثيم فوراً على الموقع العام ولوحة التحكم.
              </p>
            </div>

            <div className="re-glass-panel re-panel">
              <h3><RotateCcw size={18} color="var(--re-secondary)" /> منطقة الخطر</h3>
              <p style={{ color: 'var(--re-muted)', fontSize: '0.88rem' }}>
                يعيد تعيين جميع بيانات العرض التجريبي (العقارات، الطلبات، المفضلة، الإعدادات) إلى وضعها الأصلي.
              </p>
              <button className="re-btn re-btn-danger" onClick={resetDemo}>
                <RefreshCw size={15} /> إعادة تعيين العرض التجريبي
              </button>
            </div>
          </div>
        )}
      </section>

      <footer className="re-container re-footer">
        <span>© 2026 {settings.agencyName} — لوحة التحكم</span>
        <span>نموذج توضيحي من تصميم D-Arrow الرقمية</span>
      </footer>

      {/* ---------- Add/Edit modal ---------- */}
      {editorOpen && (
        <div className="re-admin-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setEditorOpen(false)}>
          <div className="re-admin-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, fontWeight: 800 }}>{editingId ? 'تعديل عقار' : 'إضافة عقار جديد'}</h3>
              <button className="re-btn re-btn-ghost re-btn-sm" onClick={() => setEditorOpen(false)}>
                <X size={15} />
              </button>
            </div>
            <div className="re-form-grid">
              <div className="re-field">
                <label>عنوان العقار *</label>
                <input className="re-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="فيلا مودرن بحي..." />
              </div>
              <div className="re-field">
                <label>الوصف</label>
                <textarea className="re-textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="re-form-row">
                <div className="re-field">
                  <label>النوع</label>
                  <select className="re-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as PropertyType })}>
                    {(Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[]).map((t) => (
                      <option key={t} value={t}>{PROPERTY_TYPE_LABELS[t]}</option>
                    ))}
                  </select>
                </div>
                <div className="re-field">
                  <label>عرض</label>
                  <select className="re-select" value={form.listingType} onChange={(e) => setForm({ ...form, listingType: e.target.value as 'sale' | 'rent' })}>
                    <option value="sale">للبيع</option>
                    <option value="rent">للإيجار</option>
                  </select>
                </div>
              </div>
              <div className="re-form-row">
                <div className="re-field">
                  <label>السعر (ر.س)</label>
                  <input className="re-input" type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                </div>
                <div className="re-field">
                  <label>المساحة (م²)</label>
                  <input className="re-input" type="number" min={0} value={form.areaSqm} onChange={(e) => setForm({ ...form, areaSqm: Number(e.target.value) })} />
                </div>
              </div>
              <div className="re-form-row">
                <div className="re-field">
                  <label>المدينة</label>
                  <input className="re-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div className="re-field">
                  <label>الحي</label>
                  <input className="re-input" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
                </div>
              </div>
              <div className="re-form-row">
                <div className="re-field">
                  <label>غرف النوم</label>
                  <input className="re-input" type="number" min={0} value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })} />
                </div>
                <div className="re-field">
                  <label>دورات المياه</label>
                  <input className="re-input" type="number" min={0} value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })} />
                </div>
              </div>
              <div className="re-field">
                <label>روابط الصور (رابط في كل سطر)</label>
                <textarea className="re-textarea" rows={3} dir="ltr" value={form.imagesText} onChange={(e) => setForm({ ...form, imagesText: e.target.value })} placeholder="https://images.unsplash.com/..." />
              </div>
              <div className="re-field">
                <label>المميزات (افصل بفاصلة)</label>
                <input className="re-input" value={form.featuresText} onChange={(e) => setForm({ ...form, featuresText: e.target.value })} placeholder="مسبح خاص، مصعد، مجلس رجال" />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                عقار مميز (يظهر بشارة ★)
              </label>
              <button className="re-btn re-btn-primary" onClick={saveProperty}>
                <CheckCircle2 size={16} /> حفظ العقار
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="re-demo-note"><span>✦ نموذج تجريبي</span></div>
    </div>
  );
}

function ThemeSwatches({
  current,
  onPick,
}: {
  current: ReThemePreset;
  onPick: (t: ReThemePreset) => void;
}) {
  return (
    <div className="re-theme-swatches">
      {(Object.keys(RE_THEME_LABELS) as ReThemePreset[]).map((t) => (
        <button
          key={t}
          className={`re-theme-swatch ${current === t ? 'active' : ''}`}
          onClick={() => onPick(t)}
        >
          <span className="re-swatch-dots">
            <i style={{ background: THEME_SWATCH_COLORS[t][0] }} />
            <i style={{ background: THEME_SWATCH_COLORS[t][1] }} />
          </span>
          {RE_THEME_LABELS[t]}
        </button>
      ))}
    </div>
  );
}
