"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import Link from "@util/link";
import {
  ArrowRight,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Building2,
  Star,
  Phone,
  MessageCircle,
  Mail,
  Calculator,
  CheckCircle2,
  Compass,
  Send,
  Heart,
  Calendar,
  Printer,
  ShieldCheck,
  TrendingUp,
  Percent,
  Sparkles,
  Maximize2,
  X,
  Share2,
  Clock,
} from "lucide-react";
import { useRealEstate } from "./RealEstateContext";
import {
  formatPrice,
  PROPERTY_TYPE_LABELS,
  STATUS_LABELS,
  type DemoProperty,
} from "@/lib/real-estate/data";

export default function RealEstateDetail({ slug }: { slug: string }) {
  const {
    getPropertyBySlug,
    agents,
    settings,
    themeClass,
    isFav,
    toggleFavorite,
    addInquiry,
  } = useRealEstate();

  const property = getPropertyBySlug(slug);
  const [activeImg, setActiveImg] = useState(0);

  // 360 Panorama Tour Modal State
  const [is360Open, setIs360Open] = useState(false);
  const [active360Scene, setActive360Scene] = useState(0);
  const [panAngle, setPanAngle] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  // Auto-rotate 360 scene when modal is open
  useEffect(() => {
    if (!is360Open || !isAutoRotate) return;
    const interval = setInterval(() => {
      setPanAngle((prev) => (prev + 0.5) % 100);
    }, 40);
    return () => clearInterval(interval);
  }, [is360Open, isAutoRotate]);

  // Schedule Viewing Modal State
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const [viewingDate, setViewingDate] = useState("");
  const [viewingTime, setViewingTime] = useState("صباحاً (10:00 ص - 12:00 م)");
  const [viewingForm, setViewingForm] = useState({
    name: "",
    phone: "",
    notes: "",
  });
  const [viewingBooked, setViewingBooked] = useState(false);

  // Dual Calculator State (Mortgage vs Investment ROI)
  const [calcTab, setCalcTab] = useState<"mortgage" | "roi">("mortgage");
  const price = property?.price ?? 0;
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [years, setYears] = useState(20);
  const [interestRate, setInterestRate] = useState(4.5);

  const downPaymentVal = useMemo(
    () => Math.round((price * downPaymentPct) / 100),
    [price, downPaymentPct],
  );
  const loanAmount = useMemo(
    () => Math.max(0, price - downPaymentVal),
    [price, downPaymentVal],
  );

  const monthlyMortgage = useMemo(() => {
    if (loanAmount <= 0) return 0;
    const r = interestRate / 100 / 12;
    const n = years * 12;
    return Math.round((loanAmount * r) / (1 - Math.pow(1 + r, -n)));
  }, [loanAmount, years, interestRate]);

  // Contact Form State
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  if (!property) {
    return (
      <div
        className={`re-rtl re-page ${themeClass}`}
        dir="rtl"
        style={{ display: "grid", placeItems: "center" }}
      >
        <div
          style={{
            textAlign: "center",
            margin: "6rem auto",
            maxWidth: 420,
            padding: "2rem",
          }}
        >
          <h3>هذا العقار غير متوفر حالياً</h3>
          <p style={{ color: "var(--re-muted)", marginBottom: "1.5rem" }}>
            ربما تم حذفه أو تحديث رابطه.
          </p>
          <Link href="/demo/real-estate" className="re-btn re-btn-primary">
            العودة لجميع العقارات
          </Link>
        </div>
      </div>
    );
  }

  const agent = agents.find((a) => a.id === property.agentId) ?? agents[0];
  const faved = isFav(property.id);
  const scenes = property.tourScenes || [
    { id: "1", name: "الواجهة الرئيسية", imageUrl: property.images[0] },
    {
      id: "2",
      name: "المساحة الداخلية",
      imageUrl: property.images[1] || property.images[0],
    },
  ];

  const submitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      name: form.name,
      phone: form.phone,
      email: form.email || null,
      message: form.message || null,
    });
    setSent(true);
  };

  const handleBookViewing = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry({
      propertyId: property.id,
      propertyTitle: `[طلب معاينة] ${property.title}`,
      name: viewingForm.name,
      phone: viewingForm.phone,
      email: null,
      message: `طلب معاينة يوم: ${viewingDate || "أقرب وقت"} — الفترة: ${viewingTime} — ملاحظات: ${viewingForm.notes}`,
    });
    setViewingBooked(true);

    // Open WhatsApp prefilled message
    const msg = encodeURIComponent(
      `السلام عليكم، أود حجز موعد لمعاينة العقار:\n*${property.title}*\nالرمز: ${property.id}\nالتاريخ المقترح: ${viewingDate}\nالفترة: ${viewingTime}\nالاسم: ${viewingForm.name}`,
    );
    if (agent?.whatsapp) {
      window.open(`https://wa.me/${agent.whatsapp}?text=${msg}`, "_blank");
    }
  };

  const handlePrintFactsheet = () => {
    window.print();
  };

  return (
    <div className={`re-rtl re-page ${themeClass}`} dir="rtl">
      {/* Header */}
      <header className="re-header no-print">
        <div className="re-container re-header-inner">
          <Link href="/demo/real-estate" className="re-logo">
            <div className="re-logo-icon">
              <Building2 size={20} />
            </div>
            <div className="re-logo-text">
              <div className="re-logo-title">{settings.siteName}</div>
              <span>{settings.tagline}</span>
            </div>
          </Link>
          <div className="re-nav-actions">
            <button
              onClick={handlePrintFactsheet}
              className="re-btn re-btn-outline"
              title="طباعة بروشور العقار"
            >
              <Printer size={16} />
              <span>تحميل بروشور PDF</span>
            </button>
            <Link href="/demo/real-estate" className="re-btn re-btn-secondary">
              <ArrowRight size={16} />
              <span>الرئيسية</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="re-container" style={{ padding: "2rem 1.25rem 4rem" }}>
        {/* Breadcrumb & Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.9rem",
              color: "var(--re-muted)",
            }}
          >
            <Link
              href="/demo/real-estate"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              العقارات
            </Link>
            <span>/</span>
            <span>{property.city}</span>
            <span>/</span>
            <span style={{ color: "var(--re-text)", fontWeight: 700 }}>
              {property.district}
            </span>
          </div>

          {/* FAL & Official Licensing Badge */}
          <div className="re-fal-banner">
            <ShieldCheck size={16} />
            <span>
              مرخص من الهيئة العامة للعقار • ترخيص فال:{" "}
              {property.falLicenseNumber}
            </span>
          </div>
        </div>

        {/* Title & Key Specs Row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 900,
                marginBottom: "0.5rem",
                lineHeight: 1.3,
              }}
            >
              {property.title}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--re-text-secondary)",
                fontSize: "0.95rem",
              }}
            >
              <MapPin size={18} color="var(--re-primary)" />
              <span>
                {property.city}، {property.district} • ترخيص إعلاني #
                {property.adLicenseNumber}
              </span>
            </div>
          </div>
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontSize: "2.2rem",
                fontWeight: 900,
                color: "var(--re-primary)",
              }}
            >
              {formatPrice(property.price, property.currency)}
            </div>
            {property.pricePerSqm && (
              <div style={{ fontSize: "0.85rem", color: "var(--re-muted)" }}>
                متوسط سعر المتر: {property.pricePerSqm.toLocaleString("ar-SA")}{" "}
                ر.س/م²
              </div>
            )}
          </div>
        </div>

        {/* Media Gallery & 360 Tour Trigger */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{
              position: "relative",
              height: "440px",
              borderRadius: "1.25rem",
              overflow: "hidden",
              background: "#000",
            }}
          >
            <img
              src={property.images[activeImg] || property.images[0]}
              alt={property.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* 360 Tour Button Overlay */}
            <button
              onClick={() => setIs360Open(true)}
              className="re-btn re-btn-primary"
              style={{
                position: "absolute",
                bottom: "1.25rem",
                left: "1.25rem",
                backdropFilter: "blur(8px)",
                zIndex: 10,
              }}
            >
              <Compass size={18} />
              <span>بدء الجولة الافتراضية 360°</span>
            </button>
            <button
              onClick={() => toggleFavorite(property.id)}
              className={`re-fav-btn ${faved ? "faved" : ""}`}
              style={{ position: "absolute", top: "1.25rem", left: "1.25rem" }}
            >
              <Heart size={18} fill={faved ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Thumbnails list */}
          <div
            style={{
              display: "grid",
              gridTemplateRows: "repeat(3, 1fr)",
              gap: "0.75rem",
              height: "440px",
            }}
          >
            {property.images.slice(0, 3).map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImg(idx)}
                style={{
                  borderRadius: "0.85rem",
                  overflow: "hidden",
                  cursor: "pointer",
                  border:
                    activeImg === idx
                      ? "2px solid var(--re-primary)"
                      : "1px solid var(--re-border)",
                  position: "relative",
                }}
              >
                <img
                  src={imgUrl}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Grid: Details & Sidebars */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "2rem",
          }}
        >
          {/* Main Info Column */}
          <div>
            {/* Specifications Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1rem",
                padding: "1.25rem",
                background: "var(--re-surface-elevated)",
                borderRadius: "1rem",
                border: "1px solid var(--re-border)",
                marginBottom: "2rem",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <Ruler
                  size={22}
                  color="var(--re-primary)"
                  style={{ margin: "0 auto 0.4rem" }}
                />
                <div style={{ fontSize: "0.8rem", color: "var(--re-muted)" }}>
                  المساحة الإجمالية
                </div>
                <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                  {property.areaSqm} م²
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <BedDouble
                  size={22}
                  color="var(--re-primary)"
                  style={{ margin: "0 auto 0.4rem" }}
                />
                <div style={{ fontSize: "0.8rem", color: "var(--re-muted)" }}>
                  غرف النوم
                </div>
                <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                  {property.bedrooms > 0 ? property.bedrooms : "مفتوح"}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <Bath
                  size={22}
                  color="var(--re-primary)"
                  style={{ margin: "0 auto 0.4rem" }}
                />
                <div style={{ fontSize: "0.8rem", color: "var(--re-muted)" }}>
                  دورات المياه
                </div>
                <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                  {property.bathrooms}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <Building2
                  size={22}
                  color="var(--re-primary)"
                  style={{ margin: "0 auto 0.4rem" }}
                />
                <div style={{ fontSize: "0.8rem", color: "var(--re-muted)" }}>
                  نوع العقار
                </div>
                <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                  {PROPERTY_TYPE_LABELS[property.type]}
                </div>
              </div>
            </div>

            {/* Saudi Regulatory & Compliance Matrix */}
            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  marginBottom: "0.75rem",
                }}
              >
                بيانات التوثيق والاعتماد السعودي
              </h3>
              <div className="re-compliance-grid">
                {property.ejarCompliant && (
                  <div className="re-compliance-card">
                    <CheckCircle2 size={18} />
                    <span>موثق عبر منصة إيجار</span>
                  </div>
                )}
                {property.sakaniSupported && (
                  <div className="re-compliance-card">
                    <CheckCircle2 size={18} />
                    <span>متوافق مع الدعم السكني</span>
                  </div>
                )}
                {property.buildingCodeCertified && (
                  <div className="re-compliance-card">
                    <CheckCircle2 size={18} />
                    <span>شهادة كود البناء السعودي</span>
                  </div>
                )}
                {property.deedNumber && (
                  <div className="re-compliance-card">
                    <CheckCircle2 size={18} />
                    <span>صك إلكتروني: {property.deedNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  marginBottom: "0.75rem",
                }}
              >
                تفاصيل العقار
              </h3>
              <p
                style={{
                  color: "var(--re-text-secondary)",
                  lineHeight: 1.8,
                  fontSize: "1rem",
                }}
              >
                {property.description}
              </p>
            </div>

            {/* Features & Amenities */}
            <div style={{ marginBottom: "2.5rem" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  marginBottom: "1rem",
                }}
              >
                المميزات والمرافق
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                {property.features.map((feat, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.6rem 0.9rem",
                      background: "var(--re-surface)",
                      borderRadius: "0.65rem",
                      border: "1px solid var(--re-border)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <CheckCircle2 size={16} color="var(--re-primary)" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dual Calculator Section */}
            <div
              style={{
                padding: "1.75rem",
                background: "var(--re-surface)",
                borderRadius: "1.25rem",
                border: "1px solid var(--re-border)",
                marginBottom: "2.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    margin: 0,
                  }}
                >
                  <Calculator size={20} color="var(--re-primary)" />
                  <span>الحاسبة المالية والاستثمارية</span>
                </h3>
              </div>

              {/* Tabs */}
              <div className="re-calc-tabs">
                <button
                  onClick={() => setCalcTab("mortgage")}
                  className={`re-calc-tab-btn ${calcTab === "mortgage" ? "active" : ""}`}
                >
                  حاسبة التمويل العقاري
                </button>
                <button
                  onClick={() => setCalcTab("roi")}
                  className={`re-calc-tab-btn ${calcTab === "roi" ? "active" : ""}`}
                >
                  حاسبة العائد الاستثماري (ROI)
                </button>
              </div>

              {calcTab === "mortgage" ? (
                <div>
                  <div className="re-slider-wrap">
                    <div className="re-slider-label">
                      <span>الدفعة الأولى ({downPaymentPct}%)</span>
                      <span style={{ color: "var(--re-primary)" }}>
                        {downPaymentVal.toLocaleString("ar-SA")} ر.س
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={50}
                      step={5}
                      value={downPaymentPct}
                      onChange={(e) =>
                        setDownPaymentPct(Number(e.target.value))
                      }
                      className="re-slider"
                    />
                  </div>

                  <div className="re-slider-wrap">
                    <div className="re-slider-label">
                      <span>مدة التمويل ({years} سنة)</span>
                      <span>{years * 12} شهر</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={30}
                      step={5}
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="re-slider"
                    />
                  </div>

                  <div className="re-calc-result-box">
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--re-muted)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      القسط الشهري التقديري
                    </div>
                    <div className="re-calc-result-val">
                      {monthlyMortgage.toLocaleString("ar-SA")} ر.س / شهر
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--re-muted)",
                        marginTop: "0.5rem",
                      }}
                    >
                      * يعتمد على معايير البنوك السعودية ونسبة المرابحة
                      التقديرية ({interestRate}%)
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        padding: "1rem",
                        background: "var(--re-surface-elevated)",
                        borderRadius: "0.75rem",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{ fontSize: "0.8rem", color: "var(--re-muted)" }}
                      >
                        الإيجار السنوي المتوقع
                      </div>
                      <div
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 800,
                          color: "var(--re-primary)",
                        }}
                      >
                        {(property.expectedAnnualRent || 180000).toLocaleString(
                          "ar-SA",
                        )}{" "}
                        ر.س
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "1rem",
                        background: "var(--re-surface-elevated)",
                        borderRadius: "0.75rem",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{ fontSize: "0.8rem", color: "var(--re-muted)" }}
                      >
                        العائد الصافي السنوي (ROI)
                      </div>
                      <div
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 800,
                          color: "var(--re-green)",
                        }}
                      >
                        {property.estimatedROI || 7.5}% سنوياً
                      </div>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--re-text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    تعتبر هذه المنطقة من أعلى مناطق الرياض نمواً وإقبالاً
                    للتأجير طويل وقصير المدى، مع متوسط استرداد كامل لقيمة رأس
                    المال خلال 11-13 سنة.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Sidebar: Agent & Action CTAs */}
          <div className="no-print">
            {/* Quick Action Box */}
            <div
              style={{
                padding: "1.5rem",
                background: "var(--re-surface)",
                borderRadius: "1.25rem",
                border: "1px solid var(--re-border)",
                marginBottom: "1.5rem",
                boxShadow: "var(--re-shadow-sm)",
              }}
            >
              <button
                onClick={() => setIsViewingModalOpen(true)}
                className="re-btn re-btn-primary"
                style={{
                  width: "100%",
                  padding: "0.9rem",
                  fontSize: "1rem",
                  marginBottom: "0.75rem",
                }}
              >
                <Calendar size={18} />
                <span>حجز موعد معاينة ميدانية</span>
              </button>

              {agent?.whatsapp && (
                <a
                  href={`https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(`السلام عليكم، أستفسر عن العقار: ${property.title}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="re-btn re-btn-green"
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    textDecoration: "none",
                  }}
                >
                  <MessageCircle size={18} />
                  <span>تواصل فوري عبر واتساب</span>
                </a>
              )}
            </div>

            {/* Certified Agent Card */}
            <div
              style={{
                padding: "1.5rem",
                background: "var(--re-surface)",
                borderRadius: "1.25rem",
                border: "1px solid var(--re-border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  marginBottom: "1rem",
                }}
              >
                <img
                  src={agent?.avatarUrl || ""}
                  alt={agent?.name}
                  style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    borderRadius: "9999px",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>
                    {agent?.name}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--re-muted)" }}>
                    {agent?.jobTitle}
                  </div>
                  {agent?.falLicenseNumber && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--re-green)",
                        fontWeight: 700,
                      }}
                    >
                      رخصة فال: {agent.falLicenseNumber}
                    </div>
                  )}
                </div>
              </div>

              {/* Inquiry Form */}
              <form
                onSubmit={submitInquiry}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <input
                  type="text"
                  placeholder="اسمك الكريم"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="re-input"
                  style={{ padding: "0.65rem 0.9rem" }}
                />
                <input
                  type="tel"
                  placeholder="رقم الجوال (05xxxxxxx)"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="re-input"
                  style={{ padding: "0.65rem 0.9rem" }}
                />
                <textarea
                  placeholder="اكتب استفسارك هنا..."
                  rows={3}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="re-input"
                  style={{ padding: "0.65rem 0.9rem", resize: "none" }}
                />
                <button
                  type="submit"
                  className="re-btn re-btn-secondary"
                  style={{ width: "100%" }}
                >
                  <Send size={16} />
                  <span>
                    {sent ? "تم استلام طلبك بنجاح ✓" : "إرسال الاستفسار للوسيط"}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* 360 Virtual Tour Modal */}
      {is360Open && (
        <div
          className="re-modal-overlay no-print"
          onClick={() => setIs360Open(false)}
        >
          <div className="re-modal-360" onClick={(e) => e.stopPropagation()}>
            <div className="re-modal-header">
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
              >
                <Compass size={20} color="var(--re-primary)" />
                <span style={{ fontWeight: 800, color: "#fff" }}>
                  الجولة الافتراضية 360° — {property.title}
                </span>
              </div>
              <button
                onClick={() => setIs360Open(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Interactive 360 Panorama Viewport */}
            <div
              className="re-360-canvas-wrap"
              onMouseDown={(e) => {
                isDraggingRef.current = true;
                startXRef.current = e.clientX;
                setIsAutoRotate(false);
              }}
              onMouseMove={(e) => {
                if (!isDraggingRef.current) return;
                const delta = e.clientX - startXRef.current;
                setPanAngle((prev) => (prev - delta * 0.15) % 100);
                startXRef.current = e.clientX;
              }}
              onMouseUp={() => {
                isDraggingRef.current = false;
              }}
              onMouseLeave={() => {
                isDraggingRef.current = false;
              }}
            >
              <img
                src={scenes[active360Scene]?.imageUrl}
                alt="360 Scene"
                className="re-360-bg-img"
                style={{
                  transform: `translateX(-${(panAngle + 100) % 50}%) scale(1.1)`,
                }}
              />
              <div className="re-360-overlay-hud">
                <div className="re-360-compass">
                  <Compass size={16} />
                  <span>زاوية العرض 360° • اسحب بالفأرة للتدوير</span>
                </div>
                <div className="re-360-controls">
                  <button
                    className="re-360-btn"
                    onClick={() => setPanAngle((prev) => prev - 10)}
                    title="تدوير يميناً"
                  >
                    ↺
                  </button>
                  <button
                    className="re-360-btn"
                    onClick={() => setIsAutoRotate(!isAutoRotate)}
                    title="تشغيل/إيقاف الدوران التلقائي"
                  >
                    {isAutoRotate ? "⏸" : "▶"}
                  </button>
                  <button
                    className="re-360-btn"
                    onClick={() => setPanAngle((prev) => prev + 10)}
                    title="تدوير يساراً"
                  >
                    ↻
                  </button>
                </div>
              </div>
            </div>

            {/* Scene Selector Tabs */}
            <div className="re-360-scenes-bar">
              {scenes.map((scene, idx) => (
                <div
                  key={scene.id}
                  onClick={() => {
                    setActive360Scene(idx);
                    setPanAngle(0);
                  }}
                  className={`re-360-scene-tab ${active360Scene === idx ? "active" : ""}`}
                >
                  <span>{scene.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Viewing Modal */}
      {isViewingModalOpen && (
        <div
          className="re-modal-overlay no-print"
          onClick={() => setIsViewingModalOpen(false)}
        >
          <div
            className="re-modal-360"
            style={{ maxWidth: 500, background: "var(--re-surface)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="re-modal-header">
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
              >
                <Calendar size={20} color="var(--re-primary)" />
                <span style={{ fontWeight: 800, color: "var(--re-text)" }}>
                  حجز موعد معاينة ميدانية
                </span>
              </div>
              <button
                onClick={() => setIsViewingModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--re-text)",
                  cursor: "pointer",
                }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              {viewingBooked ? (
                <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                  <CheckCircle2
                    size={48}
                    color="var(--re-green)"
                    style={{ margin: "0 auto 1rem" }}
                  />
                  <h3
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 800,
                      marginBottom: "0.5rem",
                    }}
                  >
                    تم تأكيد طلب المعاينة!
                  </h3>
                  <p
                    style={{
                      color: "var(--re-text-secondary)",
                      marginBottom: "1.5rem",
                    }}
                  >
                    تم إشعار المستشار العقاري وسيتواصل معك خلال دقائق لتأكيد
                    الموعد.
                  </p>
                  <button
                    onClick={() => setIsViewingModalOpen(false)}
                    className="re-btn re-btn-primary"
                  >
                    إغلاق
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleBookViewing}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        display: "block",
                        marginBottom: "0.4rem",
                      }}
                    >
                      اليوم المفضل للمعاينة
                    </label>
                    <input
                      type="date"
                      required
                      value={viewingDate}
                      onChange={(e) => setViewingDate(e.target.value)}
                      className="re-input"
                      style={{ padding: "0.65rem 0.9rem" }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        display: "block",
                        marginBottom: "0.4rem",
                      }}
                    >
                      الفترة الزمنية
                    </label>
                    <select
                      value={viewingTime}
                      onChange={(e) => setViewingTime(e.target.value)}
                      className="re-select"
                    >
                      <option value="صباحاً (10:00 ص - 12:00 م)">
                        صباحاً (10:00 ص - 12:00 م)
                      </option>
                      <option value="عصراً (04:00 م - 06:00 م)">
                        عصراً (04:00 م - 06:00 م)
                      </option>
                      <option value="مساءً (07:00 م - 09:30 م)">
                        مساءً (07:00 م - 09:30 م)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        display: "block",
                        marginBottom: "0.4rem",
                      }}
                    >
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="الاسم"
                      value={viewingForm.name}
                      onChange={(e) =>
                        setViewingForm({ ...viewingForm, name: e.target.value })
                      }
                      className="re-input"
                      style={{ padding: "0.65rem 0.9rem" }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        display: "block",
                        marginBottom: "0.4rem",
                      }}
                    >
                      رقم الجوال
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="05xxxxxxx"
                      value={viewingForm.phone}
                      onChange={(e) =>
                        setViewingForm({
                          ...viewingForm,
                          phone: e.target.value,
                        })
                      }
                      className="re-input"
                      style={{ padding: "0.65rem 0.9rem" }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="re-btn re-btn-primary"
                    style={{ marginTop: "0.5rem" }}
                  >
                    تأكيد الحجز وإرسال الموعد للوكيل
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
