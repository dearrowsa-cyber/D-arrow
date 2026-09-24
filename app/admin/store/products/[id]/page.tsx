"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowRight, Save, Upload, X, Plus, Trash2 } from "lucide-react";
import Link from "@util/link";
import Image from "next/image";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { useAdminProduct, useAdminProductMutation } from "@/features/store/admin-hooks";

const CATEGORIES = [
  "General",
  "Digital Marketing",
  "SEO",
  "Design",
  "Development",
  "Templates",
  "Courses",
  "Tools",
];
const TYPES = [
  { value: "digital", label: "منتج رقمي" },
  { value: "course", label: "كورس" },
  { value: "template", label: "قالب" },
  { value: "service", label: "خدمة" },
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { product, loading } = useAdminProduct(productId);
  const { loading: saving, updateProduct } = useAdminProductMutation();
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<"ar" | "en">("ar");

  const [form, setForm] = useState({
    name: "",
    nameAr: "",
    slug: "",
    description: "",
    descriptionAr: "",
    price: "",
    salePrice: "",
    currency: "SAR",
    category: "General",
    categoryAr: "",
    type: "digital",
    downloadUrl: "",
    demoUrl: "",
    status: "published",
    featured: false,
  });

  const [images, setImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [featuresAr, setFeaturesAr] = useState<string[]>([""]);

  useEffect(() => {
    if (!product) return;
    setForm({
      name: product.name || "",
      nameAr: product.nameAr || "",
      slug: product.slug || "",
      description: product.description || "",
      descriptionAr: product.descriptionAr || "",
      price: String(product.price || ""),
      salePrice: product.salePrice ? String(product.salePrice) : "",
      currency: product.currency || "SAR",
      category: product.category || "General",
      categoryAr: product.categoryAr || "",
      type: product.type || "digital",
      downloadUrl: product.downloadUrl || "",
      demoUrl: product.demoUrl || "",
      status: product.status || "published",
      featured: product.featured || false,
    });
    setImages(product.images ? JSON.parse(product.images) : []);
    setFeatures(product.features ? JSON.parse(product.features) : [""]);
    setFeaturesAr(product.featuresAr ? JSON.parse(product.featuresAr) : [""]);
  }, [product]);

  useEffect(() => {
    if (!loading && !product) {
      showToast("المنتج غير موجود", "error");
      setTimeout(() => router.push("/admin/store/products"), 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, product]);

  const updateField = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        setImages((prev) => [...prev, data.url]);
        showToast("تم رفع الصورة", "success");
      }
    } catch {
      showToast("فشل رفع الصورة", "error");
    }
  };

  const handleSubmit = async () => {
    if (!form.name && !form.nameAr)
      return showToast("يرجى إدخال اسم المنتج", "error");
    const price = Number(form.price);
    if (form.price === "" || !Number.isFinite(price) || price < 0)
      return showToast("يرجى إدخال سعر صحيح للمنتج", "error");
    const salePrice =
      form.salePrice !== "" && form.salePrice !== undefined
        ? Number(form.salePrice)
        : undefined;
    if (salePrice !== undefined && (!Number.isFinite(salePrice) || salePrice < 0))
      return showToast("يرجى إدخال سعر تخفيض صحيح", "error");
    if (salePrice !== undefined && salePrice > price)
      return showToast("سعر التخفيض لا يمكن أن يكون أكبر من السعر الأصلي", "error");
    const result = await updateProduct({
      id: productId,
      ...form,
      status: form.status as "published" | "draft",
      price,
      salePrice,
      images,
      features: features.filter((f) => f.trim()),
      featuresAr: featuresAr.filter((f) => f.trim()),
    });
    if (result.success) {
      showToast("تم تحديث المنتج", "success");
      setTimeout(() => router.push("/admin/store/products"), 1000);
    } else {
      showToast(result.error || "فشل التحديث", "error");
    }
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
            href="/admin/store/products"
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
            تعديل المنتج
          </h2>
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={handleSubmit}
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
      </div>

      <div
        className="admin-grid-2"
        style={{ gridTemplateColumns: "1fr 360px", alignItems: "start" }}
      >
        <div>
          <div className="admin-tabs" style={{ marginBottom: 20 }}>
            <button
              className={`admin-tab ${activeTab === "ar" ? "active" : ""}`}
              onClick={() => setActiveTab("ar")}
            >
              العربية
            </button>
            <button
              className={`admin-tab ${activeTab === "en" ? "active" : ""}`}
              onClick={() => setActiveTab("en")}
            >
              English
            </button>
          </div>

          <div className="admin-card">
            {activeTab === "ar" ? (
              <>
                <div style={{ marginBottom: 20 }}>
                  <label className="admin-label">اسم المنتج بالعربية</label>
                  <input
                    className="admin-input"
                    value={form.nameAr}
                    onChange={(e) => updateField("nameAr", e.target.value)}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="admin-label">وصف المنتج بالعربية</label>
                  <RichTextEditor
                    value={form.descriptionAr}
                    onChange={(val) => updateField("descriptionAr", val)}
                    dir="rtl"
                  />
                </div>
                <div style={{ marginTop: 20 }}>
                  <label className="admin-label">مميزات المنتج (عربي)</label>
                  {featuresAr.map((f, i) => (
                    <div
                      key={i}
                      style={{ display: "flex", gap: 8, marginBottom: 8 }}
                    >
                      <input
                        className="admin-input"
                        value={f}
                        onChange={(e) => {
                          const n = [...featuresAr];
                          n[i] = e.target.value;
                          setFeaturesAr(n);
                        }}
                        dir="rtl"
                      />
                      {featuresAr.length > 1 && (
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() =>
                            setFeaturesAr((p) => p.filter((_, j) => j !== i))
                          }
                          style={{ color: "#EF4444" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    onClick={() => setFeaturesAr((p) => [...p, ""])}
                  >
                    <Plus size={14} /> إضافة ميزة
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: 20 }}>
                  <label className="admin-label">Product Name</label>
                  <input
                    className="admin-input"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="admin-label">Product Description</label>
                  <RichTextEditor
                    value={form.description}
                    onChange={(val) => updateField("description", val)}
                    dir="ltr"
                  />
                </div>
                <div style={{ marginTop: 20 }}>
                  <label className="admin-label">Product Features</label>
                  {features.map((f, i) => (
                    <div
                      key={i}
                      style={{ display: "flex", gap: 8, marginBottom: 8 }}
                    >
                      <input
                        className="admin-input"
                        value={f}
                        onChange={(e) => {
                          const n = [...features];
                          n[i] = e.target.value;
                          setFeatures(n);
                        }}
                        dir="ltr"
                      />
                      {features.length > 1 && (
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() =>
                            setFeatures((p) => p.filter((_, j) => j !== i))
                          }
                          style={{ color: "#EF4444" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    onClick={() => setFeatures((p) => [...p, ""])}
                  >
                    <Plus size={14} /> Add Feature
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Images */}
          <div className="admin-card">
            <h4 style={{ color: "#E6E6EA", fontSize: 15, margin: "0 0 16px" }}>
              صور المنتج
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 8,
              }}
            >
              {images.map((img, i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid rgba(255,77,109,0.15)",
                  }}
                >
                  <Image
                    src={img}
                    alt="Product Image"
                    width={100}
                    height={100}
                    style={{ width: "100%", height: 100, objectFit: "cover" }}
                    unoptimized
                  />
                  <button
                    onClick={() =>
                      setImages((p) => p.filter((_, j) => j !== i))
                    }
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "rgba(239,68,68,0.9)",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <div
              className="admin-upload-zone"
              onClick={() => fileInputRef.current?.click()}
              style={{ marginTop: images.length > 0 ? 8 : 0 }}
            >
              <Upload
                size={24}
                style={{
                  color: "#6B7280",
                  margin: "0 auto 8px",
                  display: "block",
                }}
              />
              <p style={{ color: "#9CA3AF", fontSize: 13, margin: 0 }}>
                اضغط لإضافة صورة
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>

          {/* Pricing */}
          <div className="admin-card">
            <h4 style={{ color: "#E6E6EA", fontSize: 15, margin: "0 0 16px" }}>
              التسعير
            </h4>
            <div style={{ marginBottom: 16 }}>
              <label className="admin-label">السعر (ر.س)</label>
              <input
                className="admin-input"
                type="number"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                dir="ltr"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="admin-label">سعر العرض</label>
              <input
                className="admin-input"
                type="number"
                value={form.salePrice}
                onChange={(e) => updateField("salePrice", e.target.value)}
                dir="ltr"
              />
            </div>
            <div>
              <label className="admin-label">العملة</label>
              <select
                className="admin-select"
                value={form.currency}
                onChange={(e) => updateField("currency", e.target.value)}
              >
                <option value="SAR">ريال سعودي</option>
                <option value="USD">دولار</option>
                <option value="EGP">جنيه مصري</option>
              </select>
            </div>
          </div>

          {/* Settings */}
          <div className="admin-card">
            <h4 style={{ color: "#E6E6EA", fontSize: 15, margin: "0 0 16px" }}>
              الإعدادات
            </h4>
            <div style={{ marginBottom: 16 }}>
              <label className="admin-label">Slug</label>
              <input
                className="admin-input"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                dir="ltr"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="admin-label">الفئة</label>
              <select
                className="admin-select"
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="admin-label">الفئة بالعربية</label>
              <input
                className="admin-input"
                value={form.categoryAr}
                onChange={(e) => updateField("categoryAr", e.target.value)}
                dir="rtl"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="admin-label">نوع المنتج</label>
              <select
                className="admin-select"
                value={form.type}
                onChange={(e) => updateField("type", e.target.value)}
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="admin-label">رابط التحميل</label>
              <input
                className="admin-input"
                value={form.downloadUrl}
                onChange={(e) => updateField("downloadUrl", e.target.value)}
                dir="ltr"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="admin-label">
                رابط المعاينة الحية (Live Demo)
              </label>
              <input
                className="admin-input"
                placeholder="/demo/store"
                value={form.demoUrl}
                onChange={(e) => updateField("demoUrl", e.target.value)}
                dir="ltr"
              />
              <p style={{ color: "#6B7280", fontSize: 12, margin: "6px 0 0" }}>
                يظهر زر &quot;معاينة حية&quot; في صفحة المنتج للقوالب (مثال: /demo/store)
              </p>
            </div>
            <div style={{ marginBottom: 16 }}>
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
            <div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  color: "#9CA3AF",
                  fontSize: 14,
                }}
              >
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => updateField("featured", e.target.checked)}
                  style={{ accentColor: "#FF4D6D" }}
                />
                منتج مميز
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
