'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../pricing/pricing.module.css';
import { useLanguage } from '@/components/LanguageProvider';
import Head from 'next/head';
import ServiceCard from '@/components/ServiceCard';
import AnimatedServicesShowcase from '@/components/AnimatedServicesShowcase';
import { useSearchParams } from 'next/navigation';

export default function ServicesPage() {
  const { t, lang, siteData } = useLanguage();
  const [expandedCategory, setExpandedCategory] = useState('digital-marketing');
  const searchParams = useSearchParams();
  const pageData = siteData;


  useEffect(() => {
    const category = searchParams?.get('category') || 'digital-marketing';
    setExpandedCategory(category);
  }, [searchParams]);

  const services = {
    'digital-marketing': [
      {
        titleKey: 'dm_smm_title',
        descKey: 'dm_smm_desc',
        icon: '/icon/mainicons1/social-media10.png',
        featuresKey: 'features_smm',
        price: '3,000',
        priceCurrency: 'SAR / month',
        backgroundImage: '/services/social-media-marketing1.jpeg'
      },
      {
        titleKey: 'dm_marketing_title',
        descKey: 'dm_marketing_desc',
        icon: '/icon/services-icon/digital_marketing_promotion.png',
        featuresKey: 'features_digitalMarketing',
        price: 'Contact for Quote',
        priceCurrency: 'Custom',
        backgroundImage: '/services/Digital-marketing1.jpeg'
      },
      {
        titleKey: 'dm_visual_title',
        descKey: 'dm_visual_desc',
        icon: '/icon/mainicons1/visiual.png',
        featuresKey: 'features_visualProduction',
        price: '2,000',
        priceCurrency: 'SAR / project',
        backgroundImage: '/services/Visual-Production1.jpeg'
      },
      {
        titleKey: 'dm_influencer_title',
        descKey: 'dm_influencer_desc',
        icon: '/icon/mainicons1/influencer.png',
        featuresKey: 'features_influencer',
        price: 'Contact for Quote',
        priceCurrency: 'Custom',
        backgroundImage: '/services/influencer.jpeg'
      },
      {
        titleKey: 'dm_content_title',
        descKey: 'dm_content_desc',
        icon: '/icon/services-icon/marketing_performance_chart.png',
        featuresKey: 'features_creativeContent',
        price: '1,200',
        priceCurrency: 'SAR / month',
        backgroundImage: '/services/creative-content1.jpeg'
      },
      {
        titleKey: 'dm_exhibitions_title',
        descKey: 'dm_exhibitions_desc',
        icon: '/icon/mainicons1/sales-real10.png',
        featuresKey: 'features_exhibitions',
        price: 'Contact for Quote',
        priceCurrency: 'Custom',
        backgroundImage: '/services/Exhibitions1.jpeg'
      },
      {
        titleKey: 'dm_advertising_title',
        descKey: 'dm_advertising_desc',
        icon: '/icon/mainicons1/real-estate-marketing.png',
        featuresKey: 'features_advertising',
        price: '1,500',
        priceCurrency: 'SAR / month',
        backgroundImage: '/services/Advertisements1.jpeg'
      },
      {
        titleKey: 'dm_consultation_title',
        descKey: 'dm_consultation_desc',
        icon: '/icon/mainicons1/expertteam1.png',
        featuresKey: 'features_consultation',
        price: '500',
        priceCurrency: 'SAR / hour',
        backgroundImage: '/services/Marketing-Consultation1.jpeg'
      },
      {
        titleKey: 'dm_seo_title',
        descKey: 'dm_seo_desc',
        icon: '/icon/mainicons1/seo&sro10.png',
        featuresKey: 'features_seoSro',
        featured: true,
        price: '1,800',
        priceCurrency: 'SAR / month',
        backgroundImage: '/services/seo-sro1.jpeg'
      },
    ],
    'innovation-development': [
      {
        titleKey: 'id_apps_title',
        descKey: 'id_apps_desc',
        icon: '/icon/mainicons1/app10.png',
        featuresKey: 'features_appsDesign',
        price: 'Contact for Quote',
        priceCurrency: 'Custom',
        backgroundImage: '/services/app-development.jpg'
      },
      {
        titleKey: 'id_website_title',
        descKey: 'id_website_desc',
        icon: '/icon/mainicons1/webd1.png',
        featuresKey: 'features_websiteDesign',
        price: 'Contact for Quote',
        priceCurrency: 'Custom',
        backgroundImage: '/services/website-development1.jpeg'
      },
      {
        titleKey: 'id_branding_title',
        descKey: 'id_branding_desc',
        icon: '/icon/mainicons1/bdeveloment.png',
        featuresKey: 'features_brandingDesign',
        featured: true,
        price: 'Contact for Quote',
        priceCurrency: 'Custom',
        backgroundImage: '/services/BRAND-DESIGN.png'
      },
      {
        titleKey: 'id_software_title',
        descKey: 'id_software_desc',
        icon: '/icon/mainicons1/software-10.png',
        featuresKey: 'features_softwareDesign',
        price: 'Contact for Quote',
        priceCurrency: 'Custom',
        backgroundImage: '/services/software-development.jpg'
      },
      {
        titleKey: 'id_cloud_title',
        descKey: 'id_cloud_desc',
        icon: '/icon/mainicons1/cloud10.png',
        featuresKey: 'features_cloudServices',
        price: 'Contact for Quote',
        priceCurrency: 'Custom',
        backgroundImage: '/services/cloud-services1.jpeg'
      },
    ],
    'real-estate': [
      {
        titleKey: 're_appraisal_title',
        descKey: 're_appraisal_desc',
        icon: '/icon/mainicons1/analysis.png',
        featuresKey: 'features_realEstateAppraisal',
        price: 'Contact for Quote',
        priceCurrency: 'Custom',
        backgroundImage: '/services/appraisal1.jpeg'
      },
      {
        titleKey: 're_marketing_title',
        descKey: 're_marketing_desc',
        icon: '/icon/mainicons1/real-estate-marketing.png',
        featuresKey: 'features_realEstateMarketing',
        price: 'Contact for Quote',
        priceCurrency: 'Custom',
        backgroundImage: '/services/REAL-MARKETING1.jpeg'
      },
      {
        titleKey: 're_management_title',
        descKey: 're_management_desc',
        icon: '/icon/mainicons1/sales-real10.png',
        featuresKey: 'features_realEstateManagement',
        featured: true,
        price: 'Contact for Quote',
        priceCurrency: 'Custom',
        backgroundImage: '/services/propert1.jpeg'
      },
      {
        titleKey: 're_photography_title',
        descKey: 're_photography_desc',
        icon: '/icon/mainicons1/influencer.png',
        featuresKey: 'features_realEstatePhotography',
        price: '2,500',
        priceCurrency: 'SAR / project',
        backgroundImage: '/services/PHOTOGRAPH1.jpeg'
      },
      {
        titleKey: 're_campaign_title',
        descKey: 're_campaign_desc',
        icon: '/icon/services-icon/real_estate_marketing.png',
        featuresKey: 'features_advertisingCampaign',
        price: '2,000',
        priceCurrency: 'SAR / month',
        backgroundImage: '/services/Campaign-Management1.jpeg'
      },
      {
        titleKey: 're_project_images_title',
        descKey: 're_project_images_desc',
        icon: '/icon/mainicons1/creation10.png',
        featuresKey: 'features_projectImages',
        price: '3,000',
        priceCurrency: 'SAR / project',
        backgroundImage: '/services/image1.jpeg'
      },
      {
        titleKey: 're_current_eval_title',
        descKey: 're_current_eval_desc',
        icon: '/icon/mainicons1/current-image.png',
        featuresKey: 'features_currentImageEval',
        price: '1,500',
        priceCurrency: 'SAR / project',
        backgroundImage: '/services/current-image.jpeg'
      },
      {
        titleKey: 're_project_naming_title',
        descKey: 're_project_naming_desc',
        icon: '/icon/mainicons1/real-estate-project.png',
        featuresKey: 'features_projectNaming',
        price: '1,000',
        priceCurrency: 'SAR / project',
        backgroundImage: '/services/project-naming.jpeg'
      },
    ]
  };

  return (
    <div className="min-h-screen">
      {/* SEO Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            'name': 'D Arrow Digital',
            'url': 'https://d-arrow.com',
            'telephone': '+966-XXXXXXXXX',
            'address': {
              '@type': 'PostalAddress',
              'addressCountry': 'SA',
            },
            'description': 'Comprehensive digital marketing and software development services for businesses worldwide.',
            'image': 'https://d-arrow.com/logo.png',
            'sameAs': [
              'https://www.facebook.com/darrowdigital',
              'https://www.twitter.com/darrowdigital',
              'https://www.linkedin.com/company/darrowdigital',
            ],
            'areaServed': ['SA', 'AE', 'KW', 'QA', 'BH', 'OM'],
            'serviceType': ['Digital Marketing', 'Software Development', 'Web Design', 'Real Estate Marketing'],
          }),
        }}
      />

      {/* Services Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            'name': 'Digital Marketing & Development Services',
            'description': 'Professional digital marketing, software development, and real estate marketing services',
            'provider': {
              '@type': 'LocalBusiness',
              'name': 'D Arrow Digital',
            },
            'areaServed': {
              '@type': 'Country',
              'name': ['Saudi Arabia', 'UAE', 'Kuwait', 'Qatar', 'Bahrain', 'Oman'],
            },
            'offers': {
              '@type': 'AggregateOffer',
              'priceCurrency': 'SAR',
              'offerCount': '16',
            },
          }),
        }}
      />

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://d-arrow.com',
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Services',
                'item': 'https://d-arrow.com/services',
              },
            ],
          }),
        }}
      />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'D Arrow Digital',
            'url': 'https://d-arrow.com',
            'logo': 'https://d-arrow.com/logo.png',
            'description': 'Leading digital marketing and software development agency',
            'foundingDate': '2015',
            'contactPoint': {
              '@type': 'ContactPoint',
              'contactType': 'Customer Service',
              'email': 'support@d-arrow.com',
              'availableLanguage': ['ar', 'en'],
            },
          }),
        }}
      />
      
      {/* Hero Section */}
      <section className={`relative py-8 lg:py-6 border-b border-gray-800/50`}>
        <div className="w-full mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-4">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-black dark:text-white"
            >
              {pageData?.services?.title?.[lang] || t('ourServices')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="text-lg text-gray-800 dark:text-gray-300"
            >
              {pageData?.services?.description?.[lang] || t('servicesHeroDesc')}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Animated Services Showcase */}
   

      {/* Category is selected via `?category=` query param from header links */}

      {/* Services Cards */}
      <section className="relative py-12 lg:py-6">
        <div className="w-full mx-auto px-6 md:px-12">
          <motion.div
            key={expandedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {(pageData?.services?.categories?.[expandedCategory] || services[expandedCategory as keyof typeof services] || []).map((service: any, index: number) => {
               // Normalization to handle both the old hardcoded structure (titleKey, descKey) and the new dynamic structure (title.en, title.ar)
               const normalizedService = {
                 ...service,
                 title: service.title?.[lang] || t(service.titleKey),
                 description: service.description?.[lang] || t(service.descKey),
               };
               return <ServiceCard key={index} service={normalizedService} index={index} />;
            })}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-16 lg:py-20 border-t border-gray-800/50">
        <div className="w-full mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 text-black dark:text-white"
            >
              {t('whyChooseServicesTitle')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-800 dark:text-gray-400 text-lg"
            >
              {t('whyChooseServicesDesc')}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '/icon/mainicons1/execution10.png', titleKey: 'servicesFeature_turnaround', descKey: 'servicesFeature_turnaround_desc' },
              { icon: '/icon/mainicons1/datadrive1.png', titleKey: 'servicesFeature_focused', descKey: 'servicesFeature_focused_desc' },
              { icon: '/icon/mainicons1/support10.png', titleKey: 'servicesFeature_support', descKey: 'servicesFeature_support_desc' },
              { icon: '/icon/mainicons1/analysis.png', titleKey: 'servicesFeature_analytics', descKey: 'servicesFeature_analytics_desc' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(251, 146, 60, 0.2)' }}
                className="p-6 border border-gray-800 rounded-lg text-center hover:border-amber-500/50 transition"
              >
                <motion.div
                  className="mb-3"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={feature.icon} alt={t(feature.titleKey)} className={styles.iconImage} />
                </motion.div>
                <h4 className="font-semibold mb-2 !text-white dark:text-white">{t(feature.titleKey)}</h4>
                <p className="text-gray-800 dark:text-gray-400 text-sm">{t(feature.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 lg:py-20 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
              className="text-3xl text-black dark:text-white md:text-4xl font-bold mb-6"
          >
            {t('readyToElevateTitle')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-800 dark:text-gray-400 mb-8"
          >
            {t('readyToElevateDesc')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/contact" className="bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] !text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-amber-500/50 inline-block text-center">
                {t('getYourFreeConsultation')}
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/pricing" className="border border-amber-500/50 hover:border-amber-500 text-amber-400 px-8 py-4 rounded-lg font-semibold text-lg transition inline-block text-center">
                {t('viewPricing')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
