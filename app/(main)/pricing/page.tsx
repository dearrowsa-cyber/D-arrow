"use client";

import { useState, useEffect, useRef } from 'react';
import PricingCard from '@/components/PricingCard';
import CustomServiceModal from '@/components/CustomServiceModal';
import PricingInquiryModal from '@/components/PricingInquiryModal';
import styles from './pricing.module.css';
import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';
import { motion } from 'framer-motion';

// FAQs moved inside component to support translations

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isPricingInquiryOpen, setIsPricingInquiryOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'marketing' | 'development'>('marketing');
  const { t, lang } = useLanguage();
  const bgRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = bgRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // capture non-null references for use in nested functions
    const canvasEl = canvas;
    const ctxEl = ctx;

    let width = canvasEl.clientWidth || window.innerWidth;
    let height = canvasEl.clientHeight || window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const c = bgRef.current;
      if (!c) return;
      width = c.clientWidth || window.innerWidth;
      height = c.clientHeight || window.innerHeight;
      c.width = Math.max(1, Math.floor(width * dpr));
      c.height = Math.max(1, Math.floor(height * dpr));
      c.style.width = width + 'px';
      c.style.height = height + 'px';
      const localCtx = c.getContext('2d');
      if (localCtx) localCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    type Point = { x: number; y: number; vx: number; vy: number };
    const points: Point[] = [];
    const POINT_COUNT = Math.max(25, Math.floor((width * height) / 80000));
    for (let i = 0; i < POINT_COUNT; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
      });
    }

    let raf = 0;
    const maxDist = Math.min(160, Math.max(80, Math.sqrt(width * height) / 4));

    function step() {
      ctxEl.clearRect(0, 0, width, height);

      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = 1 - dist / maxDist;
            ctxEl.beginPath();
            ctxEl.strokeStyle = `rgba(80,180,220,${(alpha * 0.18).toFixed(3)})`;
            ctxEl.lineWidth = 1;
            ctxEl.moveTo(a.x, a.y);
            ctxEl.lineTo(b.x, b.y);
            ctxEl.stroke();
          }
        }
      }

      for (const p of points) {
        ctxEl.beginPath();
        ctxEl.fillStyle = 'rgba(90,190,230,0.9)';
        ctxEl.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctxEl.fill();
      }

      raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [bgRef]);

  const faqs = [
    { question: t('faq_q1'), answer: t('faq_a1') },
    { question: t('faq_q2'), answer: t('faq_a2') },
    { question: t('faq_q3'), answer: t('faq_a3') },
    { question: t('faq_q4'), answer: t('faq_a4') },
  ];

  const digitalServices = lang === 'ar' ? [
    'التسويق عبر وسائل التواصل الاجتماعي',
    'تحسين محركات البحث وتسويق المحتوى',
    'التسويق عبر البريد الإلكتروني',
    'إعلانات الدفع مقابل النقرة',
    'إنتاج الفيديو',
    'صناعة المحتوى',
    'التحليلات والتقارير',
    'استراتيجية العلامة التجارية',
  ] : [
    'Social Media Marketing',
    'SEO & Content Marketing',
    'Email Marketing',
    'PPC Advertising',
    'Video Production',
    'Content Creation',
    'Analytics & Reporting',
    'Brand Strategy',
  ];

  const realEstateServices = lang === 'ar' ? [
    'جولات العقارات الافتراضية',
    'تسويق العقارات',
    'تحسين قوائم العقارات',
    'التصوير بالطائرات بدون طيار',
    'التصوير المعماري',
    'جذب العملاء المحتملين',
    'تحسين محركات البحث العقاري',
    'هوية العلامة التجارية العقارية',
  ] : [
    'Virtual Property Tours',
    'Property Marketing',
    'Listing Optimization',
    'Drone Photography',
    'Architectural Visualization',
    'Lead Generation',
    'Real Estate SEO',
    'Property Branding',
  ];

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const categories = [
    {
      id: 'marketing',
      title: t('marketingPackages'),
      plans: [
        {
          title: t('pricingBasic'),
          price: t('pricingBasicPrice'),
          oldPrice: t('pricingBasicOldPrice'),
          features: [
            t('pricingBasicFeature1'),
            t('pricingBasicFeature2'),
            t('pricingBasicFeature3'),
            t('pricingBasicFeature4'),
            t('pricingBasicFeature5'),
            t('pricingBasicFeature6'),
            t('pricingBasicFeature7'),
          ],
          cta: t('pricingCta'),
          icon: '/icon/update/basic2.png',
        },
        {
          title: t('pricingGrowth'),
          price: t('pricingGrowthPrice'),
          oldPrice: t('pricingGrowthOldPrice'),
          features: [
            t('pricingGrowthFeature1'),
            t('pricingGrowthFeature2'),
            t('pricingGrowthFeature3'),
            t('pricingGrowthFeature4'),
            t('pricingGrowthFeature5'),
            t('pricingGrowthFeature6'),
            t('pricingGrowthFeature7'),
            t('pricingGrowthFeature8'),
            t('pricingGrowthFeature9'),
          ],
          cta: t('pricingCta'),
          featured: true,
          icon: '/icon/update/growth2.png',
        },
        {
          title: t('pricingProfessional'),
          price: t('pricingProfessionalPrice'),
          oldPrice: t('pricingProfessionalOldPrice'),
          features: [
            t('pricingProfessionalFeature1'),
            t('pricingProfessionalFeature2'),
            t('pricingProfessionalFeature3'),
            t('pricingProfessionalFeature4'),
            t('pricingProfessionalFeature5'),
            t('pricingProfessionalFeature6'),
            t('pricingProfessionalFeature7'),
            t('pricingProfessionalFeature8'),
            t('pricingProfessionalFeature9'),
            t('pricingProfessionalFeature10'),
          ],
          cta: t('pricingCta'),
          icon: '/icon/update/professional2.png',
        },
        {
          title: t('pricingCustom'),
          price: t('pricingCustomPrice'),
          features: [
            t('pricingCustomFeature1'),
            t('pricingCustomFeature2'),
            t('pricingCustomFeature3'),
            t('pricingCustomFeature4'),
            t('pricingCustomFeature5'),
            t('pricingCustomFeature6'),
            t('pricingCustomFeature7'),
            t('pricingCustomFeature8'),
          ],
          cta: t('pricingCta'),
          icon: '/icon/update/custom2.png',
          isCustom: true,
        },
      ],
    },
    {
      id: 'development',
      title: t('developmentDesignPackage'),
      plans: [
        {
          title: t('pricingStarterPackage'),
          price: t('pricingStarterPrice'),
          features: [
            t('pricingStarterFeature1'),
            t('pricingStarterFeature2'),
            t('pricingStarterFeature3'),
            t('pricingStarterFeature4'),
            t('pricingStarterFeature5'),
            t('pricingStarterFeature6'),
            t('pricingStarterFeature7'),
          ],
          cta: t('pricingCta'),
          icon: '/icon/update/basic2.png',
        },
        {
          title: t('pricingBusiness'),
          price: t('pricingBusinessPrice'),
          features: [
            t('pricingBusinessFeature1'),
            t('pricingBusinessFeature2'),
            t('pricingBusinessFeature3'),
            t('pricingBusinessFeature4'),
            t('pricingBusinessFeature5'),
            t('pricingBusinessFeature6'),
            t('pricingBusinessFeature7'),
          ],
          cta: t('pricingCta'),
          icon: '/icon/update/growth2.png',
        },
        {
          title: t('pricingEcommerce'),
          price: t('pricingEcommercePrice'),
          features: [
            t('pricingEcommerceFeature1'),
            t('pricingEcommerceFeature2'),
            t('pricingEcommerceFeature3'),
            t('pricingEcommerceFeature4'),
            t('pricingEcommerceFeature5'),
            t('pricingEcommerceFeature6'),
            t('pricingEcommerceFeature7'),
            t('pricingEcommerceFeature8'),
            t('pricingEcommerceFeature9'),
          ],
          cta: t('pricingCta'),
          icon: '/icon/update/professional2.png',
        },
        {
          title: t('pricingEnterprise'),
          price: t('requestQuote'),
          features: [
            t('pricingEnterpriseFeature1'),
            t('pricingEnterpriseFeature2'),
            t('pricingEnterpriseFeature3'),
            t('pricingEnterpriseFeature4'),
            t('pricingEnterpriseFeature5'),
            t('pricingEnterpriseFeature6'),
            t('pricingEnterpriseFeature7'),
            t('pricingEnterpriseFeature8'),
          ],
          cta: t('pricingCta'),
          icon: '/icon/update/custom2.png',
          isCustom: true,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden relative">
      <canvas ref={bgRef} className={styles.networkCanvas} />
      {/* JSON-LD Schema for Pricing Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'PriceSpecification',
            priceCurrency: 'SAR',
            offers: [
              {
                '@type': 'Offer',
                name: 'Branding Identity',
                price: '800 - 1500',
                priceCurrency: 'SAR',
                description: 'Logo design, brand colors, visual identity, and social media templates',
              },
              {
                '@type': 'Offer',
                name: 'Digital Marketing',
                price: '1200 - 2500',
                priceCurrency: 'SAR',
                priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                description: 'Instagram & social media content, digital templates, email marketing, and analytics',
              },
              {
                '@type': 'Offer',
                name: 'Web Solutions',
                price: '2000 - 4000',
                priceCurrency: 'SAR',
                description: 'Custom WordPress website, responsive design, SEO optimization, and performance tuning',
              },
            ],
          }),
        }}
      />
      
      {/* Dynamic Localized FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />
      
      {/* Hero Section */}
      <section className={`relative py-10 lg:py-18`}>
        <div className="w-full max-w-full px-4 md:px-8">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className={styles.heroMeta}>
              <span className={styles.heroBadge}>{t('pricingBadge')}</span>
              <span className={styles.heroPill}>{t('pricingPill')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {t('pricingHeroTitle')}
            </h1>
            <p className="text-lg mb-6 text-black dark:text-white">
              {t('pricingHeroSubtitle')}
            </p>

           
          </div>

          {/* Category selector (show only selected category) */}
          <div className="flex justify-center gap-4 mt-6 text-center">
            <motion.button
              className={`px-4 sm:px-6 py-2 rounded-full  text-sm sm:text-base ${selectedCategory === 'marketing' ? 'bg-amber-400 text-black' : 'bg-gray-700 text-black'}`}
              onClick={() => setSelectedCategory('marketing')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {t('marketingPackages')}
            </motion.button>
            <motion.button
              className={`px-4 sm:px-6 py-2 rounded-full  text-sm sm:text-base ${selectedCategory === 'development' ? 'bg-amber-400 text-black' : 'bg-gray-700 text-black'}`}
              onClick={() => setSelectedCategory('development')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {t('developmentDesignPackage')}
            </motion.button>
          </div>

          {/* Active category plans */}
          {(() => {
            const active = categories.find(c => c.id === selectedCategory);
            if (!active) return null;
            return (
              <section className="mt-12">
               <div className="flex items-center justify-center mb-6">
  <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-pink-600 to-orange-500 text-transparent bg-clip-text drop-shadow-lg">
  {active.title}
</h2>

</div>


                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {active.plans.map((plan, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if ((plan as any).isCustom) {
                          setIsCustomModalOpen(true);
                        } else {
                          setSelectedPackage(plan.title);
                          setIsPricingInquiryOpen(true);
                        }
                      }}
                    >
                      <PricingCard {...plan as any} titleKey={undefined} />
                    </div>
                  ))}
                </div>
              </section>
            );
          })()}
        </div>

        {/* Custom Service Modal */}
        <CustomServiceModal isOpen={isCustomModalOpen} onClose={() => setIsCustomModalOpen(false)} />
        
        {/* Pricing Inquiry Modal */}
        <PricingInquiryModal 
          isOpen={isPricingInquiryOpen} 
          onClose={() => setIsPricingInquiryOpen(false)}
          packageName={selectedPackage}
        />

        
        
      </section>

      {/* Features Comparison */}
      <section className="relative py-16 lg:py-20 border-t border-gray-800/50">
        <div className="w-full mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black dark:text-white">{t('whatsIncluded')}</h2>
            <p className="text-gray-800 dark:text-gray-400 text-lg">{t('processDesc')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '/icon/update/fast-turnaround.png', titleKey: 'feature_fastTurnaround_title', descKey: 'feature_fastTurnaround_desc' },
              { icon: '/icon/update/result-oriented.png', titleKey: 'feature_resultsFocused_title', descKey: 'feature_resultsFocused_desc' },
              { icon: '/icon/mainicons1/support10.png', titleKey: 'feature_dedicatedSupport_title', descKey: 'feature_dedicatedSupport_desc' },
              { icon: '/icon/mainicons1/analysis.png', titleKey: 'feature_analytics_title', descKey: 'feature_analytics_desc' },
              { icon: '/icon/mainicons1/transparent10.png', titleKey: 'feature_revisions_title', descKey: 'feature_revisions_desc' },
              { icon: '/icon/update/premium-quality.png', titleKey: 'feature_premium_title', descKey: 'feature_premium_desc' },
            ].map((feature, i) => (
              <div key={i} className="p-6 border border-gray-800 rounded-lg text-center hover:border-amber-500/50 transition">
                <div className="mb-3"><img src={feature.icon} alt={t(feature.titleKey)} className={styles.iconImage} /></div>
                <h3 className="font-semibold mb-2 text-white dark:text-white">{t(feature.titleKey)}</h3>
                <p className="text-white dark:text-gray-400 text-sm">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-4 lg:py-10 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black dark:text-white">{t('faqTitle')}</h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details key={index} className="group p-6 border border-gray-800 rounded-lg hover:border-amber-500/50 transition cursor-pointer">
                <summary className="flex justify-between items-center font-semibold text-lg text-black dark:text-white">
                  <span className='text-white'>{faq.question}</span>
                  <span className="text-amber-500 group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="text-white dark:text-gray-400 mt-4 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-2 lg:py-6 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white">{t('readyToGrowTitle')}</h2>
          <p className="text-xl text-gray-800 dark:text-gray-400 mb-8">
            {t('readyToGrowDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Link href="/contact" className="bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] !text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-amber-500/50 inline-block text-center">
                {t('startFreeConsultation')}
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Link href="/" className="border border-amber-500/50 hover:border-amber-500 text-amber-400 px-8 py-4 rounded-lg font-semibold text-lg transition inline-block text-center">
                {t('viewPortfolio')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
