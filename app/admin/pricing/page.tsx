'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, DollarSign, Star, X } from 'lucide-react';

interface PricingFeature {
  ar: string;
  en: string;
}

interface PricingPlan {
  id: string;
  nameAr: string;
  nameEn: string;
  audienceAr: string;
  audienceEn: string;
  priceRange: string;
  priceUnitAr: string;
  priceUnitEn: string;
  noteAr: string;
  noteEn: string;
  featured: boolean;
  badgeAr: string;
  badgeEn: string;
  features: PricingFeature[];
  ctaAr: string;
  ctaEn: string;
}

const normalizePlan = (raw: any): PricingPlan => ({
  id: String(raw.id || `plan-${Date.now()}`),
  nameAr: String(raw.nameAr || raw.name?.ar || ''),
  nameEn: String(raw.nameEn || raw.name?.en || ''),
  audienceAr: String(raw.audienceAr || ''),
  audienceEn: String(raw.audienceEn || ''),
  priceRange: String(raw.priceRange || raw.price || ''),
  priceUnitAr: String(raw.priceUnitAr || raw.period?.ar || 'ر.س / شهرياً'),
  priceUnitEn: String(raw.priceUnitEn || raw.period?.en || 'SAR / month'),
  noteAr: String(raw.noteAr || ''),
  noteEn: String(raw.noteEn || ''),
  featured: Boolean(raw.featured || raw.popular),
  badgeAr: String(raw.badgeAr || ''),
  badgeEn: String(raw.badgeEn || ''),
  features: Array.isArray(raw.features)
    ? raw.features.map((f: any) =>
        typeof f === 'string'
          ? { ar: f, en: f }
          : { ar: String(f?.ar || f?.title || ''), en: String(f?.en || f?.title || '') }
      )
    : [],
  ctaAr: String(raw.ctaAr || 'ابدأ الآن'),
  ctaEn: String(raw.ctaEn || 'Get Started'),
});

export default function PricingManagementPage() {
  const [data, setData] = useState<PricingPlan[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/pricing', { cache: 'no-store' });
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setData(result.data.map(normalizePlan));
      } else if (result.success && result.data && typeof result.data === 'object') {
        const allPlans = Object.values(result.data).flat();
        setData((allPlans as any[]).map(normalizePlan));
      } else {
        setData([]);
      }
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        showToast('تم حفظ الأسعار بنجاح — ستظهر فوراً في صفحة الأسعار', 'success');
      } else {
        showToast('فشل في الحفظ', 'error');
      }
    } catch {
      showToast('حدث خطأ أثناء الحفظ', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updatePlan = (planIndex: number, field: keyof PricingPlan, value: any) => {
    setData(prev => {
      if (!prev) return prev;
      const plans = [...prev];
      plans[planIndex] = { ...plans[planIndex], [field]: value };
      return plans;
    });
  };

  const updateFeature = (planIndex: number, featureIndex: number, lang: 'ar' | 'en', value: string) => {
    setData(prev => {
      if (!prev) return prev;
      const plans = [...prev];
      const features = [...plans[planIndex].features];
      features[featureIndex] = { ...features[featureIndex], [lang]: value };
      plans[planIndex] = { ...plans[planIndex], features };
      return plans;
    });
  };

  const addFeature = (planIndex: number) => {
    setData(prev => {
      if (!prev) return prev;
      const plans = [...prev];
      plans[planIndex] = { ...plans[planIndex], features: [...plans[planIndex].features, { ar: '', en: '' }] };
      return plans;
    });
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    setData(prev => {
      if (!prev) return prev;
      const plans = [...prev];
      const features = plans[planIndex].features.filter((_, i) => i !== featureIndex);
      plans[planIndex] = { ...plans[planIndex], features };
      return plans;
    });
  };

  const addPlan = () => {
    setData(prev => {
      if (!prev) return prev;
      const newPlan: PricingPlan = {
        id: `plan-${Date.now()}`,
        nameAr: 'باقة جديدة',
        nameEn: 'New Plan',
        audienceAr: '',
        audienceEn: '',
        priceRange: '',
        priceUnitAr: 'ر.س / شهرياً',
        priceUnitEn: 'SAR / month',
        noteAr: '',
        noteEn: '',
        featured: false,
        badgeAr: '',
        badgeEn: '',
        features: [{ ar: 'ميزة', en: 'Feature' }],
        ctaAr: 'ابدأ الآن',
        ctaEn: 'Get Started',
      };
      return [...prev, newPlan];
    });
  };

  const removePlan = (planIndex: number) => {
    setData(prev => {
      if (!prev) return prev;
      return prev.filter((_, i) => i !== planIndex);
    });
  };

  const showToast = (msg: string, type: string) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
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
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#E6E6EA', margin: '0 0 4px' }}>إدارة الأسعار والباقات</h2>
          <p style={{ color: '#9CA3AF', fontSize: 14, margin: 0 }}>
            التعديلات تُحفظ مباشرة وتظهر فوراً في صفحة الأسعار العامة للموقع
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="admin-btn admin-btn-secondary" onClick={addPlan} type="button">
            <Plus size={16} /> إضافة باقة
          </button>
          <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving} type="button">
            {saving ? 'جاري الحفظ...' : <><Save size={16} /> حفظ التعديلات</>}
          </button>
        </div>
      </div>

      {/* Plans */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {(data || []).map((plan, planIndex) => (
          <div key={plan.id} className="admin-card" style={{ position: 'relative' }}>
            {/* Plan header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: plan.featured ? 'linear-gradient(135deg, #FF4D6D, #FF9A3C)' : 'rgba(255,77,109,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: plan.featured ? 'white' : '#FF4D6D',
                }}>
                  <DollarSign size={20} />
                </div>
                <h3 style={{ color: '#E6E6EA', fontSize: 18, margin: 0 }}>
                  {plan.nameAr || plan.nameEn || 'باقة بدون اسم'}
                </h3>
                {plan.featured && <span className="admin-badge admin-badge-success">{plan.badgeAr || plan.badgeEn || 'الأكثر طلباً'}</span>}
              </div>
              <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => removePlan(planIndex)} type="button">
                <Trash2 size={14} /> حذف
              </button>
            </div>

            {/* Names */}
            <div className="admin-grid-2" style={{ marginBottom: 20 }}>
              <div>
                <label className="admin-label">اسم الباقة (عربي)</label>
                <input className="admin-input" value={plan.nameAr || ''} onChange={e => updatePlan(planIndex, 'nameAr', e.target.value)} dir="rtl" />
              </div>
              <div>
                <label className="admin-label">Plan Name (English)</label>
                <input className="admin-input" value={plan.nameEn || ''} onChange={e => updatePlan(planIndex, 'nameEn', e.target.value)} dir="ltr" />
              </div>
            </div>

            {/* Audience */}
            <div className="admin-grid-2" style={{ marginBottom: 20 }}>
              <div>
                <label className="admin-label">الجمهور المستهدف (عربي)</label>
                <input className="admin-input" value={plan.audienceAr || ''} onChange={e => updatePlan(planIndex, 'audienceAr', e.target.value)} dir="rtl" placeholder="مثال: محلات، عيادات فردية، مشاريع ناشئة" />
              </div>
              <div>
                <label className="admin-label">Target Audience (English)</label>
                <input className="admin-input" value={plan.audienceEn || ''} onChange={e => updatePlan(planIndex, 'audienceEn', e.target.value)} dir="ltr" placeholder="e.g. Small shops, clinics, startups" />
              </div>
            </div>

            {/* Price */}
            <div className="admin-grid-2" style={{ marginBottom: 20, gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <label className="admin-label">السعر / النطاق السعري</label>
                <input className="admin-input" value={plan.priceRange || ''} onChange={e => updatePlan(planIndex, 'priceRange', e.target.value)} dir="ltr" placeholder="مثال: 1,800 - 2,500 أو 15,000+" />
              </div>
              <div>
                <label className="admin-label">الوحدة (عربي)</label>
                <input className="admin-input" value={plan.priceUnitAr || ''} onChange={e => updatePlan(planIndex, 'priceUnitAr', e.target.value)} dir="rtl" />
              </div>
              <div>
                <label className="admin-label">Unit (English)</label>
                <input className="admin-input" value={plan.priceUnitEn || ''} onChange={e => updatePlan(planIndex, 'priceUnitEn', e.target.value)} dir="ltr" />
              </div>
              <div>
                <label className="admin-label">ملاحظة السعر (عربي)</label>
                <input className="admin-input" value={plan.noteAr || ''} onChange={e => updatePlan(planIndex, 'noteAr', e.target.value)} dir="rtl" placeholder="مثال: + ميزانية إعلانات منفصلة" />
              </div>
              <div>
                <label className="admin-label">Price Note (English)</label>
                <input className="admin-input" value={plan.noteEn || ''} onChange={e => updatePlan(planIndex, 'noteEn', e.target.value)} dir="ltr" placeholder="e.g. + Separate ad budget" />
              </div>
              <div>
                <label className="admin-label">زر الشراء — النص (عربي)</label>
                <input className="admin-input" value={plan.ctaAr || ''} onChange={e => updatePlan(planIndex, 'ctaAr', e.target.value)} dir="rtl" />
              </div>
              <div>
                <label className="admin-label">CTA Button Text (English)</label>
                <input className="admin-input" value={plan.ctaEn || ''} onChange={e => updatePlan(planIndex, 'ctaEn', e.target.value)} dir="ltr" />
              </div>
            </div>

            {/* Featured + Badge */}
            <div className="admin-grid-2" style={{ marginBottom: 20, gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <label className="admin-label">باقة مميزة (الأكثر طلباً)</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '12px 0' }}>
                  <input
                    type="checkbox"
                    checked={plan.featured}
                    onChange={e => updatePlan(planIndex, 'featured', e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#FF4D6D' }}
                  />
                  <Star size={16} style={{ color: plan.featured ? '#FF4D6D' : '#6B7280' }} />
                </label>
              </div>
              <div>
                <label className="admin-label">شارة الباقة المميزة (عربي)</label>
                <input className="admin-input" value={plan.badgeAr || ''} onChange={e => updatePlan(planIndex, 'badgeAr', e.target.value)} dir="rtl" placeholder="مثال: الأكثر طلباً" />
              </div>
              <div>
                <label className="admin-label">Featured Badge (English)</label>
                <input className="admin-input" value={plan.badgeEn || ''} onChange={e => updatePlan(planIndex, 'badgeEn', e.target.value)} dir="ltr" placeholder="e.g. Most Popular" />
              </div>
            </div>

            {/* Features */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <label className="admin-label" style={{ margin: 0 }}>المميزات</label>
                <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => addFeature(planIndex)} type="button">
                  <Plus size={14} /> إضافة ميزة
                </button>
              </div>

              {(plan.features || []).map((feature, featureIndex) => (
                <div key={featureIndex} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <input
                    className="admin-input"
                    placeholder="العربية"
                    value={feature?.ar || ''}
                    onChange={e => updateFeature(planIndex, featureIndex, 'ar', e.target.value)}
                    dir="rtl"
                    style={{ flex: 1 }}
                  />
                  <input
                    className="admin-input"
                    placeholder="English"
                    value={feature?.en || ''}
                    onChange={e => updateFeature(planIndex, featureIndex, 'en', e.target.value)}
                    dir="ltr"
                    style={{ flex: 1 }}
                  />
                  <button
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => removeFeature(planIndex, featureIndex)}
                    style={{ flexShrink: 0 }}
                    type="button"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
