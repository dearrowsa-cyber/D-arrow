'use client';

import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';
import styles from './packages.module.css';

/* ───────── Data ───────── */
const PACKAGES = [
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

const WHY_CARDS = [
  {
    num: '01',
    titleAr: 'تنوع اقتصادي فريد',
    titleEn: 'Unique Economic Diversity',
    descAr: 'قطاع صناعي وبترولي ضخم في الدمام، تجارة عائلية راسخة في الأحساء، وقطاع خدمي وترفيهي متسارع في الخبر — كل سوق يحتاج لغة مختلفة.',
    descEn: 'A huge industrial and petrochemical sector in Dammam, established family businesses in Al-Ahsa, and a fast-growing service & entertainment sector in Khobar — each market needs a different approach.',
  },
  {
    num: '02',
    titleAr: 'جمهور ثنائي اللغة',
    titleEn: 'Bilingual Audience',
    descAr: 'نسبة كبيرة من المقيمين والشركات المرتبطة بالقطاع الصناعي تتطلب محتوى عربي وإنجليزي معاً، وهذا مدمج في باقاتنا من الأساس.',
    descEn: 'A large percentage of residents and companies linked to the industrial sector require both Arabic and English content, which is built into our packages from the start.',
  },
  {
    num: '03',
    titleAr: 'فرصة تفوق حقيقية',
    titleEn: 'A Real Competitive Edge',
    descAr: 'المنافسة أقل احترافية مقارنة بالمدن الكبرى، وهذا يفتح المجال لتنفيذ أعلى جودة بسعر أذكى يكسب حصة سوقية بسرعة.',
    descEn: 'Competition is less professional compared to major cities, opening the door for higher-quality execution at smarter prices to capture market share quickly.',
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

const CITIES = [
  {
    nameAr: 'الأحساء',
    nameEn: 'Al-Ahsa',
    focusAr: 'المحلات العائلية والقطاع التجاري',
    focusEn: 'Family businesses & commercial sector',
    descAr: 'عرض باقة الانطلاقة بسعر تأسيسي لأول 20 عميل، مع التركيز على القطاع الزراعي والتجاري المحلي الراسخ.',
    descEn: 'Starter package at a founding price for the first 20 clients, focusing on the established agricultural and local commercial sector.',
    gradient: 'linear-gradient(180deg, rgba(236,44,109,0.06), #12203E)',
  },
  {
    nameAr: 'الخبر',
    nameEn: 'Khobar',
    focusAr: 'المطاعم والعيادات وقطاع الجمال',
    focusEn: 'Restaurants, clinics & beauty sector',
    descAr: 'محتوى مرئي قوي بالريلز نظراً لارتفاع التفاعل، مع شراكات مع مصورين ومؤثرين محليين بدل الاعتماد على الرياض.',
    descEn: 'Strong visual Reels content due to high engagement, with local photographer & influencer partnerships instead of relying on Riyadh.',
    gradient: 'linear-gradient(180deg, rgba(242,84,45,0.06), #12203E)',
  },
  {
    nameAr: 'الدمام',
    nameEn: 'Dammam',
    focusAr: 'الشركات الصناعية والمقاولين',
    focusEn: 'Industrial companies & contractors',
    descAr: 'باقة الأعمال بمحتوى ثنائي اللغة موجّه مباشرة لصناع القرار في القطاع الصناعي والمقاولات الكبرى.',
    descEn: 'Business package with bilingual content directed at decision-makers in the industrial sector and major contracting companies.',
    gradient: 'linear-gradient(180deg, rgba(236,44,109,0.06), #12203E)',
  },
];

/* ───────── Component ───────── */
export default function PackagesPage() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const t = (ar: string, en: string) => isAr ? ar : en;

  return (
    <div className={styles.page} dir={isAr ? 'rtl' : 'ltr'}>

      {/* ── HERO ── */}
      <header className={styles.hero}>
        <svg className={styles.bigArrowBg} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,0 200,100 0,200" fill="url(#pkgG1)" />
          <defs>
            <linearGradient id="pkgG1" x1="0" y1="0" x2="200" y2="200">
              <stop offset="0%" stopColor="#EC2C6D" />
              <stop offset="100%" stopColor="#F2542D" />
            </linearGradient>
          </defs>
        </svg>

        <span className={styles.eyebrow}>
          {t('دي آرو للتسويق', 'D-Arrow Marketing')} <b className={styles.eyebrowAccent}>|</b> {t('باقات التسويق الرقمي 2026', 'Digital Marketing Packages 2026')}
        </span>

        <h1 className={`${styles.heroTitle} ${styles.display}`}>
          {t('نوصّلك ', 'We get you ')}
          <span className={styles.grad}>{t('قدّام', 'ahead of')}</span>
          {t(' السوق', ' the market')}
          <br />
          {t('في الأحساء، الخبر والدمام', 'in Al-Ahsa, Khobar & Dammam')}
        </h1>

        <p className={styles.heroSub}>
          {t(
            'باقات متكاملة، أسعار تنافسية، وتنفيذ احترافي مصمم خصيصاً لطبيعة المنطقة الشرقية — لأن دي آرو دايماً للأمام.',
            'Integrated packages, competitive prices, and professional execution designed specifically for the Eastern Province — because D-Arrow is always ahead.'
          )}
        </p>

        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <b className={styles.statNum}>3</b>
            <span className={styles.statLabel}>{t('مدن نغطيها بعمق', 'Cities we deeply cover')}</span>
          </div>
          <div className={styles.stat}>
            <b className={styles.statNum}>4</b>
            <span className={styles.statLabel}>{t('باقات متدرجة', 'Tiered packages')}</span>
          </div>
          <div className={styles.stat}>
            <b className={styles.statNum}>20%</b>
            <span className={styles.statLabel}>{t('خصم إطلاق للعملاء الجدد', 'Launch discount for new clients')}</span>
          </div>
        </div>
      </header>

      {/* ── WHY SECTION ── */}
      <section className={`${styles.section} ${styles.why}`}>
        <div className={styles.sectionHead}>
          <span className={styles.tag}>{t('لماذا المنطقة الشرقية مختلفة', 'Why the Eastern Province is Different')}</span>
          <h2 className={styles.sectionTitle}>{t('سوق نعرفه بالتفصيل', 'A Market We Know Inside Out')}</h2>
          <p className={styles.sectionDesc}>
            {t(
              'ما هي عبارة عن نسخة مكررة من باقات الرياض وجدة — كل باقة مبنية على طبيعة العملاء هنا فعلاً',
              'These aren\'t copy-pasted Riyadh & Jeddah packages — every package is built on the reality of clients here'
            )}
          </p>
        </div>
        <div className={styles.whyGrid}>
          {WHY_CARDS.map((card) => (
            <div key={card.num} className={styles.whyCard}>
              <span className={styles.whyNum}>{card.num}</span>
              <h3 className={styles.whyCardTitle}>{t(card.titleAr, card.titleEn)}</h3>
              <p className={styles.whyCardDesc}>{t(card.descAr, card.descEn)}</p>
            </div>
          ))}
        </div>
      </section>

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
          {PACKAGES.map((pkg) => (
            <div key={pkg.id} className={`${styles.pkg} ${pkg.featured ? styles.pkgFeatured : ''}`}>
              {pkg.featured && (
                <span className={styles.badge}>{t(pkg.badgeAr, pkg.badgeEn)}</span>
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

      {/* ── CITIES ── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.tag}>{t('خطة الدخول للسوق', 'Market Entry Strategy')}</span>
          <h2 className={styles.sectionTitle}>{t('استراتيجية مدينة بمدينة', 'City-by-City Strategy')}</h2>
        </div>
        <div className={styles.citiesGrid}>
          {CITIES.map((city, i) => (
            <div key={i} className={styles.cityCard} style={{ background: city.gradient }}>
              <h3 className={styles.cityName}>{t(city.nameAr, city.nameEn)}</h3>
              <div className={styles.cityFocus}>{t(city.focusAr, city.focusEn)}</div>
              <p className={styles.cityDesc}>{t(city.descAr, city.descEn)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <footer className={styles.footerCta}>
        <h2 className={styles.footerTitle}>
          {t('جاهز تبدأ نموّك الرقمي في المنطقة الشرقية؟', 'Ready to Start Your Digital Growth in the Eastern Province?')}
        </h2>
        <p className={styles.footerSub}>
          {t(
            'تواصل معنا الحين واحصل على استشارة مجانية وخطة مخصصة لنشاطك',
            'Contact us now and get a free consultation & custom plan for your business'
          )}
        </p>
        <Link href="/contact" className={styles.ctaBig}>
          {t('اطلب عرض سعر مجاني', 'Request a Free Quote')}
        </Link>
        <div className={styles.footBottom}>
          {t(
            '© 2026 دي آرو للتسويق الرقمي — المنطقة الشرقية، المملكة العربية السعودية',
            '© 2026 D-Arrow Digital Marketing — Eastern Province, Saudi Arabia'
          )}
        </div>
      </footer>
    </div>
  );
}
