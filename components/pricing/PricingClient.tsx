"use client";

import { useLanguage } from "@/components/LanguageProvider";
import Link from "@util/link";
import type { PricingPlan } from "@/features/pricing/data";
import styles from "@/app/(main)/pricing/pricing.module.css";

const ADVANTAGES = [
  {
    icon: "0%",
    titleAr: "بدون عمولات مخفية",
    titleEn: "No Hidden Fees",
    descAr: "تدفع ميزانية الإعلانات مباشرة بدون أي هامش ربح إضافي عليها",
    descEn: "Pay your ad budget directly with zero markup on top",
  },
  {
    icon: "10%",
    titleAr: "خصم العقد الربع سنوي",
    titleEn: "Quarterly Contract Discount",
    descAr: "التزام أطول = توفير أكبر على نفس مستوى الخدمة",
    descEn: "Longer commitment = bigger savings on the same service level",
  },
  {
    icon: "15%",
    titleAr: "خصم العقد السنوي",
    titleEn: "Annual Contract Discount",
    descAr: "أفضل قيمة للشركات اللي تخطط لنمو طويل المدى",
    descEn: "Best value for companies planning long-term growth",
  },
  {
    icon: "15",
    titleAr: "يوم تجربة B2B",
    titleEn: "Day B2B Trial",
    descAr: "باقة تجريبية بسعر رمزي تكسر التردد قبل التوقيع على عقد كبير",
    descEn:
      "A trial package at a nominal price to break hesitation before signing a big contract",
  },
];

interface PricingClientProps {
  initialPlans: PricingPlan[];
}

export default function PricingClient({ initialPlans }: PricingClientProps) {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const t = (ar: string | null | undefined, en: string | null | undefined) =>
    (isAr ? ar || en : en || ar) ?? "";

  return (
    <div className={styles.page} dir={isAr ? "rtl" : "ltr"}>
      {/* SEO H1 - visually hidden but read by search engines */}
      <h1
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          borderWidth: 0,
        }}
      >
        {isAr
          ? "باقات وأسعار خدمات التسويق الرقمي | دي آرو"
          : "Digital Marketing Packages & Pricing | D-Arrow"}
      </h1>
      {/* ── PACKAGES ── */}
      <section className={styles.section} id="packages">
        <div className={styles.sectionHead}>
          <span className={styles.tag}>{t("الباقات", "Packages")}</span>
          <h2 className={styles.sectionTitle}>
            {t(
              "اختر السرعة اللي تناسب نموّك",
              "Choose the Speed That Fits Your Growth",
            )}
          </h2>
          <p className={styles.sectionDesc}>
            {t(
              "من المشاريع الناشئة إلى المجموعات الكبرى — أربع باقات مصممة لتغطي كل شرائح السوق",
              "From startups to large groups — four packages designed to cover every market segment",
            )}
          </p>
        </div>
        <div className={styles.packagesGrid}>
          {initialPlans.length > 0 ? (
            initialPlans.map((pkg) => (
              <div
                key={pkg.id}
                className={`${styles.pkg} ${pkg.featured ? styles.pkgFeatured : ""}`}
              >
                {pkg.featured && (
                  <span className={styles.pkgBadge}>
                    {t(pkg.badgeAr, pkg.badgeEn)}
                  </span>
                )}
                <div className={styles.pkgName}>{t(pkg.nameAr, pkg.nameEn)}</div>
                <div className={styles.pkgAudience}>
                  {t(pkg.audienceAr, pkg.audienceEn)}
                </div>
                <div className={styles.price}>
                  {pkg.priceRange}
                  <span className={styles.priceUnit}>
                    {" "}
                    {t(pkg.priceUnitAr, pkg.priceUnitEn)}
                  </span>
                </div>
                <div className={styles.priceNote}>
                  {t(pkg.noteAr, pkg.noteEn)}
                </div>
                <ul className={styles.featureList}>
                  {pkg.features.map((f, i) => (
                    <li key={i} className={styles.featureItem}>
                      <span className={styles.bulletArrow} />
                      <span>{t(f.ar, f.en)}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`${styles.pkgCta} ${pkg.featured ? styles.pkgCtaFeatured : ""}`}
                >
                  {t(pkg.ctaAr, pkg.ctaEn)}
                </Link>
              </div>
            ))
          ) : (
            <p className={styles.sectionDesc} style={{ gridColumn: "1 / -1" }}>
              {t(
                "لا توجد باقات متاحة حالياً — تواصل معنا لمعرفة الباقات والأسعار",
                "No packages available right now — contact us to learn about our packages and pricing",
              )}
            </p>
          )}
        </div>
      </section>

      {/* ── ADVANTAGE ── */}
      <section className={`${styles.section} ${styles.advantage}`}>
        <div className={styles.sectionHead}>
          <span className={styles.tag}>
            {t("لماذا نكسب السوق", "Why We Win the Market")}
          </span>
          <h2 className={styles.sectionTitle}>
            {t("أسعار شفافة بلا مفاجآت", "Transparent Pricing, No Surprises")}
          </h2>
        </div>
        <div className={styles.advantageGrid}>
          {ADVANTAGES.map((adv, i) => (
            <div key={i} className={styles.advItem}>
              <div className={styles.advIcon}>{adv.icon}</div>
              <h4 className={styles.advTitle}>{t(adv.titleAr, adv.titleEn)}</h4>
              <p className={styles.advDesc}>{t(adv.descAr, adv.descEn)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}