"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus, X, DollarSign } from "lucide-react";
import Link from "@util/link";
import { useAdminPricingPlanMutation } from "@/features/pricing/admin-hooks";
import type { PricingPlan } from "@/features/pricing/data";

interface PricingFeature {
  ar: string;
  en: string;
}

export default function NewPricingPage() {
  const router = useRouter();
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(
    null,
  );
  const { loading: saving, createPlan } = useAdminPricingPlanMutation();

  const [form, setForm] = useState({
    nameAr: "",
    nameEn: "",
    audienceAr: "",
    audienceEn: "",
    priceRange: "",
    priceUnitAr: "ر.س / شهرياً",
    priceUnitEn: "SAR / month",
    noteAr: "",
    noteEn: "",
    featured: false,
    badgeAr: "",
    badgeEn: "",
    features: [] as PricingFeature[],
    ctaAr: "ابدأ الآن",
    ctaEn: "Get Started",
    status: "published",
  });
  const [featureInput, setFeatureInput] = useState({ ar: "", en: "" });

  const updateField = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (asDraft = false) => {
    if (!form.nameAr || !form.nameEn) {
      showToast("يرجى إدخال اسم الباقة بالعربي والإنجليزي", "error");
      return;
    }
    if (!form.priceRange) {
      showToast("يرجى إدخال السعر أو النطاق السعري", "error");
      return;
    }

    try {
      const result = await createPlan({
        ...form,
        status: asDraft ? "draft" : "published",
      });
      if (result.success) {
        showToast("تم إنشاء الباقة بنجاح", "success");
        setTimeout(() => router.push("/admin/pricing"), 1000);
      } else {
        showToast(result.error || "فشل في إنشاء الباقة", "error");
      }
    } catch {
      showToast("حدث خطأ", "error");
    }
  };

  const addFeature = () => {
    if (featureInput.ar || featureInput.en) {
      setForm((prev) => ({
        ...prev,
        features: [...prev.features, { ar: featureInput.ar, en: featureInput.en }],
      }));
      setFeatureInput({ ar: "", en: "" });
    }
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const showToast = (msg: string, type: string) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="admin-content">
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/admin/pricing"
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            <ArrowRight size={18} />
          </Link>
          <div>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#E6E6EA",
                margin: 0,
              }}
            >
              باقة جديدة
            </h2>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            className="admin-btn admin-btn-secondary"
            onClick={() => handleSubmit(true)}
            disabled={saving}
          >
            حفظ كمسودة
          </button>
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => handleSubmit(false)}
            disabled={saving}
            style={{
              background: "linear-gradient(90deg, #10B981, #059669)",
              border: "none",
            }}
          >
            {saving ? "جاري النشر..." : "نشر الباقة الآن"}
          </button>
        </div>
      </div>

      <div
        className="admin-grid-2"
        style={{ gridTemplateColumns: "1fr 360px", alignItems: "start" }}
      >
        {/* Main Editor */}
        <div>
          <div className="admin-card">
            {/* Names */}
            <div className="admin-grid-2" style={{ marginBottom: 20 }}>
              <div>
                <label className="admin-label">اسم الباقة (عربي) *</label>
                <input
                  className="admin-input"
                  placeholder="مثال: الانطلاقة"
                  value={form.nameAr}
                  onChange={(e) => updateField("nameAr", e.target.value)}
                  dir="rtl"
                />
              </div>
              <div>
                <label className="admin-label">Plan Name (English) *</label>
                <input
                  className="admin-input"
                  placeholder="e.g. Starter"
                  value={form.nameEn}
                  onChange={(e) => updateField("nameEn", e.target.value)}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Audience */}
            <div className="admin-grid-2" style={{ marginBottom: 20 }}>
              <div>
                <label className="admin-label">الجمهور المستهدف (عربي)</label>
                <input
                  className="admin-input"
                  placeholder="مثال: محلات، عيادات فردية، مشاريع ناشئة"
                  value={form.audienceAr}
                  onChange={(e) => updateField("audienceAr", e.target.value)}
                  dir="rtl"
                />
              </div>
              <div>
                <label className="admin-label">Target Audience (English)</label>
                <input
                  className="admin-input"
                  placeholder="e.g. Small shops, clinics, startups"
                  value={form.audienceEn}
                  onChange={(e) => updateField("audienceEn", e.target.value)}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Price */}
            <div className="admin-grid-2" style={{ marginBottom: 20, gridTemplateColumns: "1fr 1fr" }}>
              <div>
                <label className="admin-label">السعر / النطاق السعري *</label>
                <input
                  className="admin-input"
                  placeholder="مثال: 1,800 - 2,500 أو 15,000+"
                  value={form.priceRange}
                  onChange={(e) => updateField("priceRange", e.target.value)}
                  dir="ltr"
                />
              </div>
              <div>
                <label className="admin-label">الوحدة (عربي)</label>
                <input
                  className="admin-input"
                  value={form.priceUnitAr}
                  onChange={(e) => updateField("priceUnitAr", e.target.value)}
                  dir="rtl"
                />
              </div>
              <div>
                <label className="admin-label">Unit (English)</label>
                <input
                  className="admin-input"
                  value={form.priceUnitEn}
                  onChange={(e) => updateField("priceUnitEn", e.target.value)}
                  dir="ltr"
                />
              </div>
              <div>
                <label className="admin-label">ملاحظة السعر (عربي)</label>
                <input
                  className="admin-input"
                  placeholder="مثال: + ميزانية إعلانات منفصلة"
                  value={form.noteAr}
                  onChange={(e) => updateField("noteAr", e.target.value)}
                  dir="rtl"
                />
              </div>
              <div>
                <label className="admin-label">Price Note (English)</label>
                <input
                  className="admin-input"
                  placeholder="e.g. + Separate ad budget"
                  value={form.noteEn}
                  onChange={(e) => updateField("noteEn", e.target.value)}
                  dir="ltr"
                />
              </div>
              <div>
                <label className="admin-label">زر الشراء — النص (عربي)</label>
                <input
                  className="admin-input"
                  value={form.ctaAr}
                  onChange={(e) => updateField("ctaAr", e.target.value)}
                  dir="rtl"
                />
              </div>
              <div>
                <label className="admin-label">CTA Button Text (English)</label>
                <input
                  className="admin-input"
                  value={form.ctaEn}
                  onChange={(e) => updateField("ctaEn", e.target.value)}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <label className="admin-label" style={{ margin: 0 }}>المميزات</label>
                <button
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  onClick={addFeature}
                  type="button"
                >
                  <Plus size={14} /> إضافة ميزة
                </button>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
                <input
                  className="admin-input"
                  placeholder="العربية"
                  value={featureInput.ar}
                  onChange={(e) => setFeatureInput({ ...featureInput, ar: e.target.value })}
                  dir="rtl"
                  style={{ flex: 1 }}
                />
                <input
                  className="admin-input"
                  placeholder="English"
                  value={featureInput.en}
                  onChange={(e) => setFeatureInput({ ...featureInput, en: e.target.value })}
                  dir="ltr"
                  style={{ flex: 1 }}
                />
              </div>

              {form.features.map((feature, index) => (
                <div key={index} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                  <input
                    className="admin-input"
                    value={feature.ar}
                    onChange={(e) => {
                      const newFeatures = [...form.features];
                      newFeatures[index] = { ...newFeatures[index], ar: e.target.value };
                      setForm({ ...form, features: newFeatures });
                    }}
                    dir="rtl"
                    style={{ flex: 1 }}
                  />
                  <input
                    className="admin-input"
                    value={feature.en}
                    onChange={(e) => {
                      const newFeatures = [...form.features];
                      newFeatures[index] = { ...newFeatures[index], en: e.target.value };
                      setForm({ ...form, features: newFeatures });
                    }}
                    dir="ltr"
                    style={{ flex: 1 }}
                  />
                  <button
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => removeFeature(index)}
                    style={{ flexShrink: 0 }}
                    type="button"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Featured Settings */}
          <div className="admin-card">
            <h4 style={{ color: "#E6E6EA", fontSize: 15, margin: "0 0 16px" }}>
              إعدادات الباقة
            </h4>

            <div style={{ marginBottom: 16 }}>
              <label className="admin-label">باقة مميزة (الأكثر طلباً)</label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "12px 0" }}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => updateField("featured", e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: "#FF4D6D" }}
                />
                <DollarSign size={16} style={{ color: form.featured ? "#FF4D6D" : "#6B7280" }} />
              </label>
            </div>

            <div className="admin-grid-2" style={{ marginBottom: 16 }}>
              <div>
                <label className="admin-label">شارة الباقة المميزة (عربي)</label>
                <input
                  className="admin-input"
                  placeholder="مثال: الأكثر طلباً"
                  value={form.badgeAr}
                  onChange={(e) => updateField("badgeAr", e.target.value)}
                  dir="rtl"
                />
              </div>
              <div>
                <label className="admin-label">Featured Badge (English)</label>
                <input
                  className="admin-input"
                  placeholder="e.g. Most Popular"
                  value={form.badgeEn}
                  onChange={(e) => updateField("badgeEn", e.target.value)}
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="admin-label">الحالة</label>
              <select
                className="admin-select"
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
              >
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
