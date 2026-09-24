"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowRight, Plus, X, Save, DollarSign } from "lucide-react";
import Link from "@util/link";
import { useAdminPricingPlan } from "@/features/pricing/admin-hooks";
import type { PricingPlan } from "@/features/pricing/data";

interface PricingFeature {
  ar: string;
  en: string;
}

export default function EditPricingPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.id as string;
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(
    null,
  );

  const [form, setForm] = useState({
    id: "",
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

  const { plan, loading, updatePlan } = useAdminPricingPlan(planId);

  useEffect(() => {
    if (plan) {
      setForm({
        id: plan.id,
        nameAr: plan.nameAr || "",
        nameEn: plan.nameEn || "",
        audienceAr: plan.audienceAr || "",
        audienceEn: plan.audienceEn || "",
        priceRange: plan.priceRange || "",
        priceUnitAr: plan.priceUnitAr || "ر.س / شهرياً",
        priceUnitEn: plan.priceUnitEn || "SAR / month",
        noteAr: plan.noteAr || "",
        noteEn: plan.noteEn || "",
        featured: plan.featured || false,
        badgeAr: plan.badgeAr || "",
        badgeEn: plan.badgeEn || "",
        features: Array.isArray(plan.features) ? plan.features : [],
        ctaAr: plan.ctaAr || "ابدأ الآن",
        ctaEn: plan.ctaEn || "Get Started",
        status: plan.status || "published",
      });
    } else if (!loading) {
      showToast("الباقة غير موجودة", "error");
      setTimeout(() => router.push("/admin/pricing"), 1500);
    }
  }, [plan, loading, router]);

  const updateField = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (statusOverride?: "published" | "draft") => {
    if (!form.nameAr || !form.nameEn) {
      showToast("يرجى إدخال اسم الباقة بالعربي والإنجليزي", "error");
      return;
    }
    if (!form.priceRange || !form.priceRange.trim()) {
      showToast("يرجى إدخال السعر (مثال: 499 - 799 ر.س)", "error");
      return;
    }
    const price = Number(form.priceRange.replace(/[^0-9.\-]/g, ""));
    if (!Number.isFinite(price) || price < 0) {
      showToast("يرجى إدخال سعر صحيح للباقة", "error");
      return;
    }

    setSaving(true);
    const finalStatus = (statusOverride || form.status) as "published" | "draft";
    try {
      const success = await updatePlan({
        ...form,
        status: finalStatus,
      });
      if (success) {
        showToast(
          finalStatus === "published"
            ? "تم نشر الباقة بنجاح"
            : "تم حفظ التعديلات بنجاح",
          "success",
        );
        setTimeout(() => router.push("/admin/pricing"), 1000);
      } else {
        showToast("فشل في تحديث الباقة", "error");
      }
    } catch {
      showToast("حدث خطأ", "error");
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div
        className="admin-content"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid rgba(255,77,109,0.2)",
            borderTopColor: "#FF4D6D",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
    );
  }

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
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#E6E6EA",
              margin: 0,
            }}
          >
            تعديل الباقة
          </h2>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {form.status === "draft" ? (
            <>
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => handleSubmit("draft")}
                disabled={saving}
              >
                حفظ كمسودة
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => handleSubmit("published")}
                disabled={saving}
                style={{
                  background: "linear-gradient(90deg, #10B981, #059669)",
                  border: "none",
                }}
              >
                {saving ? "جاري النشر..." : "نشر الباقة الآن"}
              </button>
            </>
          ) : (
            <>
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => handleSubmit("draft")}
                disabled={saving}
                style={{ color: "#9CA3AF" }}
              >
                تحويل لمسودة
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => handleSubmit("published")}
                disabled={saving}
              >
                {saving ? (
                  "جاري الحفظ..."
                ) : (
                  <>
                    <Save size={16} /> حفظ التعديلات
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className="admin-grid-2"
        style={{ gridTemplateColumns: "1fr 360px", alignItems: "start" }}
      >
        {/* Editor */}
        <div>
          <div className="admin-card">
            {/* Names */}
            <div className="admin-grid-2" style={{ marginBottom: 20 }}>
              <div>
                <label className="admin-label">اسم الباقة (عربي)</label>
                <input
                  className="admin-input"
                  value={form.nameAr}
                  onChange={(e) => updateField("nameAr", e.target.value)}
                  dir="rtl"
                />
              </div>
              <div>
                <label className="admin-label">Plan Name (English)</label>
                <input
                  className="admin-input"
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
                  value={form.audienceAr}
                  onChange={(e) => updateField("audienceAr", e.target.value)}
                  dir="rtl"
                />
              </div>
              <div>
                <label className="admin-label">Target Audience (English)</label>
                <input
                  className="admin-input"
                  value={form.audienceEn}
                  onChange={(e) => updateField("audienceEn", e.target.value)}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Price */}
            <div className="admin-grid-2" style={{ marginBottom: 20, gridTemplateColumns: "1fr 1fr" }}>
              <div>
                <label className="admin-label">السعر / النطاق السعري</label>
                <input
                  className="admin-input"
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
                  value={form.noteAr}
                  onChange={(e) => updateField("noteAr", e.target.value)}
                  dir="rtl"
                />
              </div>
              <div>
                <label className="admin-label">Price Note (English)</label>
                <input
                  className="admin-input"
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

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Settings */}
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
                  value={form.badgeAr}
                  onChange={(e) => updateField("badgeAr", e.target.value)}
                  dir="rtl"
                />
              </div>
              <div>
                <label className="admin-label">Featured Badge (English)</label>
                <input
                  className="admin-input"
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
