'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, DollarSign, Star } from 'lucide-react';

interface PricingFeature {
  en: string;
  ar: string;
}

interface PricingPlan {
  id: string;
  name: { en: string; ar: string };
  price: string;
  currency: string;
  period: { en: string; ar: string };
  features: PricingFeature[];
  popular: boolean;
}

export default function PricingManagementPage() {
  const [data, setData] = useState<{ marketing: PricingPlan[]; development: PricingPlan[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'marketing' | 'development'>('marketing');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/pricing');
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (err) {
      console.error(err);
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
        showToast('تم حفظ الأسعار بنجاح', 'success');
      } else {
        showToast('فشل في الحفظ', 'error');
      }
    } catch {
      showToast('حدث خطأ', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updatePlan = (category: 'marketing' | 'development', planIndex: number, field: string, value: any) => {
    setData(prev => {
      if (!prev) return prev;
      const plans = [...prev[category]];
      plans[planIndex] = { ...plans[planIndex], [field]: value };
      return { ...prev, [category]: plans };
    });
  };

  const updatePlanName = (category: 'marketing' | 'development', planIndex: number, lang: string, value: string) => {
    setData(prev => {
      if (!prev) return prev;
      const plans = [...prev[category]];
      plans[planIndex] = { ...plans[planIndex], name: { ...plans[planIndex].name, [lang]: value } };
      return { ...prev, [category]: plans };
    });
  };

  const updateFeature = (category: 'marketing' | 'development', planIndex: number, featureIndex: number, lang: string, value: string) => {
    setData(prev => {
      if (!prev) return prev;
      const plans = [...prev[category]];
      const features = [...plans[planIndex].features];
      features[featureIndex] = { ...features[featureIndex], [lang]: value };
      plans[planIndex] = { ...plans[planIndex], features };
      return { ...prev, [category]: plans };
    });
  };

  const addFeature = (category: 'marketing' | 'development', planIndex: number) => {
    setData(prev => {
      if (!prev) return prev;
      const plans = [...prev[category]];
      plans[planIndex] = { ...plans[planIndex], features: [...plans[planIndex].features, { en: '', ar: '' }] };
      return { ...prev, [category]: plans };
    });
  };

  const removeFeature = (category: 'marketing' | 'development', planIndex: number, featureIndex: number) => {
    setData(prev => {
      if (!prev) return prev;
      const plans = [...prev[category]];
      const features = plans[planIndex].features.filter((_, i) => i !== featureIndex);
      plans[planIndex] = { ...plans[planIndex], features };
      return { ...prev, [category]: plans };
    });
  };

  const addPlan = (category: 'marketing' | 'development') => {
    setData(prev => {
      if (!prev) return prev;
      const newPlan: PricingPlan = {
        id: `plan-${Date.now()}`,
        name: { en: 'New Plan', ar: 'خطة جديدة' },
        price: '0',
        currency: 'SAR',
        period: { en: '/month', ar: '/شهرياً' },
        features: [{ en: 'Feature', ar: 'ميزة' }],
        popular: false,
      };
      return { ...prev, [category]: [...prev[category], newPlan] };
    });
  };

  const removePlan = (category: 'marketing' | 'development', planIndex: number) => {
    setData(prev => {
      if (!prev) return prev;
      return { ...prev, [category]: prev[category].filter((_, i) => i !== planIndex) };
    });
  };

  const showToast = (msg: string, type: string) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading || !data) {
    return (
      <div className="admin-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(255,77,109,0.2)', borderTopColor: '#FF4D6D', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  const currentPlans = data[activeTab];

  return (
    <div className="admin-content">
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#E6E6EA', margin: '0 0 4px' }}>إدارة الأسعار</h2>
          <p style={{ color: '#6B7280', fontSize: 14, margin: 0 }}>تعديل باقات الأسعار والمميزات</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'جاري الحفظ...' : <><Save size={16} /> حفظ التعديلات</>}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === 'marketing' ? 'active' : ''}`} onClick={() => setActiveTab('marketing')}>
            باقات التسويق
          </button>
          <button className={`admin-tab ${activeTab === 'development' ? 'active' : ''}`} onClick={() => setActiveTab('development')}>
            باقات التطوير
          </button>
        </div>
        <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => addPlan(activeTab)}>
          <Plus size={16} /> إضافة باقة
        </button>
      </div>

      {/* Plans */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {currentPlans.map((plan, planIndex) => (
          <div key={plan.id} className="admin-card" style={{ position: 'relative' }}>
            {/* Plan header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: plan.popular ? 'linear-gradient(135deg, #FF4D6D, #FF9A3C)' : 'rgba(255,77,109,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: plan.popular ? 'white' : '#FF4D6D',
                }}>
                  <DollarSign size={20} />
                </div>
                <h3 style={{ color: '#E6E6EA', fontSize: 18, margin: 0 }}>
                  {plan.name.ar || plan.name.en}
                </h3>
                {plan.popular && <span className="admin-badge admin-badge-success">الأكثر شعبية</span>}
              </div>
              <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => removePlan(activeTab, planIndex)}>
                <Trash2 size={14} /> حذف
              </button>
            </div>

            {/* Plan details */}
            <div className="admin-grid-2" style={{ marginBottom: 20 }}>
              <div>
                <label className="admin-label">اسم الباقة (عربي)</label>
                <input className="admin-input" value={plan.name.ar} onChange={e => updatePlanName(activeTab, planIndex, 'ar', e.target.value)} dir="rtl" />
              </div>
              <div>
                <label className="admin-label">Plan Name (English)</label>
                <input className="admin-input" value={plan.name.en} onChange={e => updatePlanName(activeTab, planIndex, 'en', e.target.value)} dir="ltr" />
              </div>
            </div>

            <div className="admin-grid-2" style={{ marginBottom: 20, gridTemplateColumns: '1fr 120px' }}>
              <div>
                <label className="admin-label">السعر</label>
                <input className="admin-input" value={plan.price} onChange={e => updatePlan(activeTab, planIndex, 'price', e.target.value)} dir="ltr" />
              </div>
              <div>
                <label className="admin-label">الأكثر شعبية</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '12px 0' }}>
                  <input
                    type="checkbox"
                    checked={plan.popular}
                    onChange={e => updatePlan(activeTab, planIndex, 'popular', e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#FF4D6D' }}
                  />
                  <Star size={16} style={{ color: plan.popular ? '#FF4D6D' : '#6B7280' }} />
                </label>
              </div>
            </div>

            {/* Features */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <label className="admin-label" style={{ margin: 0 }}>المميزات</label>
                <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => addFeature(activeTab, planIndex)}>
                  <Plus size={14} /> إضافة ميزة
                </button>
              </div>

              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <input
                    className="admin-input"
                    placeholder="العربية"
                    value={feature.ar}
                    onChange={e => updateFeature(activeTab, planIndex, featureIndex, 'ar', e.target.value)}
                    dir="rtl"
                    style={{ flex: 1 }}
                  />
                  <input
                    className="admin-input"
                    placeholder="English"
                    value={feature.en}
                    onChange={e => updateFeature(activeTab, planIndex, featureIndex, 'en', e.target.value)}
                    dir="ltr"
                    style={{ flex: 1 }}
                  />
                  <button
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => removeFeature(activeTab, planIndex, featureIndex)}
                    style={{ flexShrink: 0 }}
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

function X({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
