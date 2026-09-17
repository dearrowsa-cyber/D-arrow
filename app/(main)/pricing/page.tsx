'use client';

import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';
import styles from './pricing.module.css';
import { useEffect, useState } from 'react';

/* ───────── Default data (fallback if /data/pricing-data.json is unavailable) ───────── */
const DEFAULT_PACKAGES = [
  {
    id: 'starter',
    nameAr: 'الانطلاقة',
    nameEn: 'Starter',
    audienceAr: 'محلات، عيادات فردية، مشاريع ناشئة',
    audienceEn: 'Small shops, clinics, startups',
    priceRange: '1,800 - 2,500',
    priceUnitAr: 'ر.س / شهرياً',
    priceUnitEn: 'SAR / month',
    noteAr: '+ ميزانية إعلانات منفصلة',
    noteEn: '+ Separate ad budget',
    featured: false,
    badgeAr: '',
    badgeEn: '',
    features: [
      { ar: 'منصتين سوشيال ميديا - 12 منشور شهرياً', en: '2 social platforms – 12 posts/month' },
      { ar: 'تصاميم جرافيك بهوية العميل', en: 'Branded graphic designs' },
      { ar: 'إدارة حملة إعلانية واحدة', en: '1 ad campaign management' },
      { ar: 'تقرير أداء شهري مبسّط', en: 'Simple monthly performance report' },
      { ar: 'رد على الرسائل خلال الدوام', en: 'Message replies during business hours' },
    ],
    ctaAr: 'ابدأ بهذي الباقة',
    ctaEn: 'Get Started',
  },
  {
    id: 'professional',
    nameAr: 'الاحتراف',
    nameEn: 'Professional',
    audienceAr: 'شركات تجارية، سلاسل مطاعم، عقارات، عيادات',
    audienceEn: 'Businesses, restaurant chains, real estate, clinics',
    priceRange: '4,500 - 6,500',
    priceUnitAr: 'ر.س / شهرياً',
    priceUnitEn: 'SAR / month',
    noteAr: 'مدير حساب مخصص',
    noteEn: 'Dedicated account manager',
    featured: true,
    badgeAr: 'الأكثر طلباً',
    badgeEn: 'Most Popular',
    features: [
      { ar: '3-4 منصات - 20 منشور + 8 فيديوهات', en: '3-4 platforms – 20 posts + 8 videos' },
      { ar: 'جلسة تصوير احترافي شهرية', en: 'Monthly professional photoshoot' },
      { ar: 'إدارة كاملة Meta + Google + Snapchat', en: 'Full Meta + Google + Snapchat management' },
      { ar: 'SEO بكلمات محلية (خبر، دمام، أحساء)', en: 'Local SEO (Khobar, Dammam, Al-Ahsa)' },
      { ar: 'إدارة واتساب بزنس', en: 'WhatsApp Business management' },
      { ar: 'تقارير أسبوعية + تحليل شهري', en: 'Weekly reports + monthly analytics' },
    ],
    ctaAr: 'ابدأ بهذي الباقة',
    ctaEn: 'Get Started',
  },
  {
    id: 'business',
    nameAr: 'الأعمال',
    nameEn: 'Business',
    audienceAr: 'مقاولات، موردين، معدات صناعية، B2B',
    audienceEn: 'Contractors, suppliers, industrial, B2B',
    priceRange: '8,000 - 12,000',
    priceUnitAr: 'ر.س / شهرياً',
    priceUnitEn: 'SAR / month',
    noteAr: 'استراتيجية ربع سنوية',
    noteEn: 'Quarterly strategy',
    featured: false,
    badgeAr: '',
    badgeEn: '',
    features: [
      { ar: 'كل خدمات باقة الاحتراف', en: 'All Professional package services' },
      { ar: 'محتوى ثنائي اللغة (عربي / إنجليزي)', en: 'Bilingual content (Arabic / English)' },
      { ar: 'حملات LinkedIn لصناع القرار', en: 'LinkedIn campaigns for decision makers' },
      { ar: 'إدارة وتحسين الموقع الإلكتروني', en: 'Website management & optimization' },
      { ar: 'فيديو تعريفي كل ربع سنة', en: 'Quarterly promo video' },
      { ar: 'اجتماع استراتيجي شهري', en: 'Monthly strategic meeting' },
    ],
    ctaAr: 'ابدأ بهذي الباقة',
    ctaEn: 'Get Started',
  },
  {
    id: 'enterprise',
    nameAr: 'المؤسسية',
    nameEn: 'Enterprise',
    audienceAr: 'مجموعات شركات، مصانع، سلاسل متعددة الفروع',
    audienceEn: 'Corporate groups, factories, multi-branch chains',
    priceRange: '15,000+',
    priceUnitAr: 'ر.س / شهرياً',
    priceUnitEn: 'SAR / month',
    noteAr: 'فريق مخصص بالكامل',
    noteEn: 'Fully dedicated team',
    featured: false,
    badgeAr: '',
    badgeEn: '',
    features: [
      { ar: 'كل خدمات باقة الأعمال', en: 'All Business package services' },
      { ar: 'فريق متكامل: مصمم، كاتب، معلن، مدير حساب', en: 'Full team: designer, writer, advertiser, account manager' },
      { ar: 'تغطية فعاليات ومعارض صناعية', en: 'Events & industrial exhibitions coverage' },
      { ar: 'إدارة سمعة رقمية ومراجعات', en: 'Digital reputation & reviews management' },
      { ar: 'تقارير تنفيذية مرتبطة بالمبيعات', en: 'Executive reports linked to sales' },
      { ar: 'دعم أسبوعي على مدار الساعة', en: '24/7 weekly support' },
    ],
    ctaAr: 'تواصل معنا',
    ctaEn: 'Contact Us',
  },
];

const ADVANTAGES = [
  {
    icon: '0%',
    titleAr: 'بدون عمولات مخفية',
    titleEn: 'No Hidden Fees',
    descAr: 'تدفع ميزانية الإعلانات مباشرة بدون أي هامش ربح إضافي عليها',
    descEn: 'Pay your ad budget directly with zero markup on top',
  },
  {
    icon: '10%',
    titleAr: 'خصم العقد الربع سنوي',
    titleEn: 'Quarterly Contract Discount',
    descAr: 'التزام أطول = توفير أكبر على نفس مستوى الخدمة',
    descEn: 'Longer commitment = bigger savings on the same service level',
  },
  {
    icon: '15%',
    titleAr: 'خصم العقد السنوي',
    titleEn: 'Annual Contract Discount',
    descAr: 'أفضل قيمة للشركات اللي تخطط لنمو طويل المدى',
    descEn: 'Best value for companies planning long-term growth',
  },
  {
    icon: '15',
    titleAr: 'يوم تجربة B2B',
    titleEn: 'Day B2B Trial',
    descAr: 'باقة تجريبية بسعر رمزي تكسر التردد قبل التوقيع على عقد كبير',
    descEn: 'A trial package at a nominal price to break hesitation before signing a big contract',
  },
];

interface PricingFeature {
  ar: string;
  en: string;
}

interface PricingPackage {
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

const normalizePricingArray = (raw: unknown): PricingPackage[] | null => {
  let list: unknown[] = [];
  if (Array.isArray(raw)) {
    list = raw;
  } else if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.marketing)) {
      list = obj.marketing;
    } else {
      list = Object.values(obj).flat();
    }
  }

  if (!list.length) return null;

  return list.map((item: any) => ({
    id: String(item.id || ''),
    nameAr: String(item.nameAr || item.name?.ar || ''),
    nameEn: String(item.nameEn || item.name?.en || ''),
    audienceAr: String(item.audienceAr || ''),
    audienceEn: String(item.audienceEn || ''),
    priceRange: String(item.priceRange || item.price || ''),
    priceUnitAr: String(item.priceUnitAr || item.period?.ar || 'ر.س / شهرياً'),
    priceUnitEn: String(item.priceUnitEn || item.period?.en || 'SAR / month'),
    noteAr: String(item.noteAr || ''),
    noteEn: String(item.noteEn || ''),
    featured: Boolean(item.featured || item.popular),
    badgeAr: String(item.badgeAr || (item.popular ? 'الأكثر طلباً' : '')),
    badgeEn: String(item.badgeEn || (item.popular ? 'Most Popular' : '')),
    features: Array.isArray(item.features)
      ? item.features.map((f: any) =>
          typeof f === 'string'
            ? { ar: f, en: f }
            : { ar: String(f?.ar || ''), en: String(f?.en || '') }
        )
      : [],
    ctaAr: String(item.ctaAr || 'ابدأ بهذي الباقة'),
    ctaEn: String(item.ctaEn || 'Get Started'),
  }));
};

/* ───────── Component ───────── */
export default function PricingPage() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const t = (ar: string, en: string) => isAr ? ar : en;
  const [packages, setPackages] = useState<PricingPackage[]>(DEFAULT_PACKAGES);

  // Load dynamic pricing data edited from the admin dashboard.
  // Falls back to static file or built-in packages if unavailable.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/pricing', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const norm = normalizePricingArray(json?.data ?? json);
        if (!cancelled && norm) {
          setPackages(norm);
        } else {
          fetch('/data/pricing-data.json', { cache: 'no-store' })
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => {
              const normStatic = normalizePricingArray(d);
              if (!cancelled && normStatic) setPackages(normStatic);
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        fetch('/data/pricing-data.json', { cache: 'no-store' })
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => {
            const normStatic = normalizePricingArray(d);
            if (!cancelled && normStatic) setPackages(normStatic);
          })
          .catch(() => {});
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.page} dir={isAr ? 'rtl' : 'ltr'}>
        {/* SEO H1 - visually hidden but read by search engines */}
        <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
          {isAr ? 'باقات وأسعار خدمات التسويق الرقمي | دي آرو' : 'Digital Marketing Packages & Pricing | D-Arrow'}
        </h1>
        {/* ── PACKAGES ── */}
        <section className={styles.section} id="packages">
        <div className={styles.sectionHead}>
          <span className={styles.tag}>{t('الباقات', 'Packages')}</span>
          <h2 className={styles.sectionTitle}>{t('اختر السرعة اللي تناسب نموّك', 'Choose the Speed That Fits Your Growth')}</h2>
          <p className={styles.sectionDesc}>
            {t(
              'من المشاريع الناشئة إلى المجموعات الكبرى — أربع باقات مصممة لتغطي كل شرائح السوق',
              'From startups to large groups — four packages designed to cover every market segment'
            )}
          </p>
        </div>
        <div className={styles.packagesGrid}>
          {packages.map((pkg) => (
            <div key={pkg.id} className={`${styles.pkg} ${pkg.featured ? styles.pkgFeatured : ''}`}>
              {pkg.featured && (
                <span className={styles.pkgBadge}>{t(pkg.badgeAr, pkg.badgeEn)}</span>
              )}
              <div className={styles.pkgName}>{t(pkg.nameAr, pkg.nameEn)}</div>
              <div className={styles.pkgAudience}>{t(pkg.audienceAr, pkg.audienceEn)}</div>
              <div className={styles.price}>
                {pkg.priceRange}
                <span className={styles.priceUnit}> {t(pkg.priceUnitAr, pkg.priceUnitEn)}</span>
              </div>
              <div className={styles.priceNote}>{t(pkg.noteAr, pkg.noteEn)}</div>
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
                className={`${styles.pkgCta} ${pkg.featured ? styles.pkgCtaFeatured : ''}`}
              >
                {t(pkg.ctaAr, pkg.ctaEn)}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── ADVANTAGE ── */}
      <section className={`${styles.section} ${styles.advantage}`}>
        <div className={styles.sectionHead}>
          <span className={styles.tag}>{t('لماذا نكسب السوق', 'Why We Win the Market')}</span>
          <h2 className={styles.sectionTitle}>{t('أسعار شفافة بلا مفاجآت', 'Transparent Pricing, No Surprises')}</h2>
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
