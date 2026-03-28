'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Lang = 'en' | 'ar';

type Translations = Record<string, { en: string | string[]; ar: string | string[] }>;

const translations: Translations = {
  services: { en: 'Services', ar: 'الخدمات' },
  whyUs: { en: 'Why Us', ar: 'لماذا نحن' },
  pricing: { en: 'Pricing', ar: 'الأسعار' },
  process: { en: 'Process', ar: 'العملية' },
    provisions: { en: 'Provisions', ar: 'المشاريع' },
    
    solutions: { en: 'Services', ar: 'الخدمات' },
    packages: { en: 'Packages', ar: 'الباقات' },
    ourCommitment: { en: 'Our Commitment', ar: 'التزامنا' },
    digitalMarketing: { en: 'Digital Marketing', ar: 'التسويق الرقمي' },
    InnovationDevelopments: { en: 'Innovation & Developments', ar: 'الابتكار والتطورات' },
    servicesTitle: { en: 'Services', ar: 'الخدمات' },
    servicesDesc: { en: 'At our digital marketing agency, we offer a range of services to help businesses grow and succeed online.', ar: 'في وكالتنا للتسويق الرقمي، نقدم مجموعة من الخدمات لمساعدة الشركات على النمو والنجاح عبر الإنترنت.' },
    service_seo: { en: 'Search engine optimization', ar: 'تحسين محركات البحث' },
    service_ppc: { en: 'Pay-per-click advertising', ar: 'إعلان الدفع مقابل النقرة' },
    service_smm: { en: 'Social Media Marketing', ar: 'التسويق عبر وسائل التواصل الاجتماعي' },
    service_email: { en: 'Email Marketing', ar: 'التسويق عبر البريد الإلكتروني' },
    service_pr: { en: 'Public Relations', ar: 'العلاقات العامة' },
    service_brand: { en: 'Brand Identity', ar: 'هوية العلامة التجارية' },
    learnMore: { en: 'Learn more', ar: 'تعرف على المزيد' },

    whyChooseUsTitle: { en: 'Why Choose Us', ar: 'لماذا تختارنا' },
    whyChooseUsDesc: { en: 'We deliver excellence through innovation, expertise, and unwavering commitment', ar: 'نقدم التميز من خلال الابتكار والخبرة والالتزام المستمر' },
    feature_dataDriven_title: { en: 'Data-Driven Results', ar: 'نتائج مستندة إلى البيانات' },
    feature_dataDriven_desc: { en: 'Every decision backed by analytics and measurable outcomes', ar: 'كل قرار مدعوم بالتحليلات والنتائج القابلة للقياس' },
    feature_expertTeam_title: { en: 'Expert Team', ar: 'فريق خبير' },
    feature_expertTeam_desc: { en: 'Industry veterans with 15+ years of combined experience', ar: 'خبراء في الصناعة مع أكثر من 6 عامًا من الخبرة المجمعة' },
    feature_support_title: { en: '24/7 Support', ar: 'الدعم 24/7' },
    feature_support_desc: { en: 'Dedicated support team ready to help whenever you need', ar: 'فريق دعم مخصص جاهز للمساعدة في أي وقت' },
    feature_custom_title: { en: 'Custom Solutions', ar: 'حلول مخصصة' },
    feature_custom_desc: { en: 'Tailored strategies for your unique business goals', ar: 'استراتيجيات مخصصة لأهداف عملك الفريدة' },
    feature_reporting_title: { en: 'Transparent Reporting', ar: 'تقارير شفافة' },
    feature_reporting_desc: { en: 'Clear, detailed reports on campaign performance and ROI', ar: 'تقارير واضحة ومفصلة عن أداء الحملات ونتائجها ' },
    feature_proven_title: { en: 'Proven Track Record', ar: 'سجل حافل' },
    feature_proven_desc: { en: '500+ successful campaigns with average 120% ROI growth', ar: 'أكثر من 500 حملة ناجحة بمتوسط نمو في العائد على الاستثمار 120%' },

    discoverDesc: { en: 'Explore a selection of our projects that showcase our commitment to quality, creativity, and results.', ar: 'استعرض مجموعة من مشاريعنا التي تُظهر التزامنا بالجودة والإبداع والنتائج.' },
    viewProject: { en: 'View Project', ar: 'عرض المشروع' },

    processDesc: { en: 'We follow a structured and transparent process to ensure your project is a success from start to finish.', ar: 'نتبع عملية منظمة وشفافة لضمان نجاح مشروعك من البداية إلى النهاية.' },
    step_initial_title: { en: 'Initial Consultation', ar: 'الاستشارة الأولية' },
    step_initial_desc: { en: 'We start by understanding your business goals, challenges, and objectives to lay a solid foundation.', ar: 'نبدأ بفهم أهداف عملك وتحدياته لوضع أساس قوي.' },
    step_strategy_title: { en: 'Strategy & Planning', ar: 'الاستراتيجية والتخطيط' },
    step_strategy_desc: { en: 'We develop a customized digital marketing strategy tailored to your specific needs and target audience.', ar: 'نطور استراتيجية تسويق رقمي مخصصة لاحتياجاتك وجمهورك المستهدف.' },
    step_execution_title: { en: 'Execution & Implementation', ar: 'التنفيذ' },
    step_execution_desc: { en: 'Our team executes the plan, launching campaigns, creating content, and optimizing for performance.', ar: 'ينفذ فريقنا الخطة، يطلق الحملات، ينشئ المحتوى، ويحسّن الأداء.' },
    step_analysis_title: { en: 'Analysis & Reporting', ar: 'التحليل والتقارير' },
    step_analysis_desc: { en: 'We continuously monitor performance, providing detailed reports and actionable insights for ongoing growth.', ar: 'نراقب الأداء باستمرار ونوفر تقارير مفصلة ورؤى قابلة للتنفيذ للنمو المستمر.' },
    stepLabel: { en: 'Step', ar: 'الخطوة' },
    phase: { en: 'Phase', ar: 'المرحلة' },
    ofTheProcess: { en: 'of the process', ar: 'من العملية' },
    faq_q1: { en: 'Can I upgrade or downgrade my plan?', ar: 'هل يمكنني ترقية أو تخفيض خطتي؟' },
    faq_a1: { en: "Yes! You can change your plan anytime. We'll adjust your billing accordingly.", ar: 'نعم! يمكنك تغيير خطتك في أي وقت. سنقوم بتعديل الفواتير وفقًا لذلك.' },
    faq_q2: { en: 'Do you offer custom packages?', ar: 'هل تقدمون باقات مخصصة؟' },
    faq_a2: { en: "Absolutely. Contact us to discuss your specific needs and we'll create a custom solution.", ar: 'بالتأكيد. تواصل معنا لمناقشة احتياجاتك وسننشئ حلاً مخصصًا.' },
    faq_q3: { en: "What's your refund policy?", ar: 'ما هي سياسة الاسترداد لديكم؟' },
    faq_a3: { en: "We offer a 14-day money-back guarantee if you're not satisfied with our services.", ar: 'نقدم ضمان استرداد الأموال خلال 14 يومًا إذا لم تكن راضيًا عن خدماتنا.' },
    faq_q4: { en: 'Do prices include revisions?', ar: 'هل تشمل الأسعار مراجعات؟' },
    faq_a4: { en: 'Yes, all plans include 2-3 rounds of revisions. Additional revisions available at nominal cost.', ar: 'نعم، جميع الخطط تشمل 2-3 جولات من المراجعات. تتوفر مراجعات إضافية بتكلفة رمزية.' },
  contact: { en: 'Contact', ar: 'تواصل' },
  getStarted: { en: 'Get Started', ar: 'ابدأ الآن' },
  trustedByTitle: { en: 'Partners in Success', ar: 'شركاء النجاح' },
  trustedByDesc: { en: 'We partner with top brands to deliver measurable results and lasting impact.', ar: 'نحن نتعاون مع أفضل العلامات التجارية لتحقيق نتائج قابلة للقياس وتأثير دائم.' },
  yearsOfExperience: { en: 'Years of Experience', ar: 'سنوات الخبرة' },
  teamMembers: { en: 'Team Members', ar: 'أعضاء الفريق' },
  projectsCompleted: { en: 'Projects Completed', ar: 'المشاريع المكتملة' },
  satisfiedCustomers: { en: 'Satisfied Customers', ar: 'عملاء راضون' },
  mostPopular: { en: 'Most Popular', ar: 'الأكثر شعبية' },
  startFreeConsultation: { en: 'Start Free Consultation', ar: 'ابدأ استشارة مجانية' },
  viewPortfolio: { en: 'View Portfolio', ar: 'عرض الأعمال' },
  whatsIncluded: { en: "What's Included in Every Plan", ar: 'ما هو مشمول في كل خطة' },
  faqTitle: { en: 'Frequently Asked Questions', ar: 'الأسئلة المتكررة' },
  heroBadge: { en: ' NEXT-GENERATION SOLUTIONS', ar: ' حلول الجيل التالي' },
  heroHeading: { en: 'Next-Generation Digital Marketing Solutions', ar: 'حلول تسويق رقمي من الجيل التالي' },
  heroSub: { en: 'We deliver innovative ideas to elevate your digital products and sharpen your brand.', ar: 'نقدم أفكارًا مبتكرة للنهوض بمنتجاتك الرقمية وصقل علامتك التجارية.' },
  getYourFreeConsultation: { en: 'Get Your Free Consultation', ar: 'احصل على استشارة مجانية' },
  viewPricing: { en: 'View Pricing', ar: 'عرض الأسعار' },
  readyToGrowTitle: { en: 'Ready to Grow Your Business?', ar: 'هل أنت مستعد لتنمية عملك؟' },
  readyToGrowDesc: { en: "Let's build something amazing together. Contact us today to discuss your project and get a free consultation.", ar: 'لننشئ شيئًا مذهلاً معًا. تواصل معنا اليوم لمناقشة مشروعك والحصول على استشارة مجانية.' },
  getStartedToday: { en: 'Get Started Today', ar: 'ابدأ اليوم' },
  viewOurPricing: { en: 'View Our Pricing', ar: 'عرض خططنا' },
  pricingHeroTitle: { en: 'Professional plans for growth - Made to Convert', ar: 'خطط احترافية للنمو - مصممة للتحويل' },
  pricingHeroSubtitle: { en: 'Thoughtful packages with measurable outcomes. Clear deliverables, dedicated support, and design that sells.', ar: 'حزم مدروسة مع نتائج قابلة للقياس. مخرجات واضحة، دعم مخصص وتصميم يبيع.' },
  monthly: { en: 'Monthly', ar: 'شهريًا' },
  yearlySave: { en: 'Yearly — Save 15%', ar: 'سنوي — وفر 15%' },
  feature_fastTurnaround_title: { en: 'Fast Turnaround', ar: 'تسليم سريع' },
  feature_fastTurnaround_desc: { en: 'Delivery in 5-10 business days', ar: 'التسليم في 5-10 أيام عمل' },
  feature_resultsFocused_title: { en: 'Results-Focused', ar: 'موجه بالنتائج' },
  feature_resultsFocused_desc: { en: 'Data-driven strategies for ROI', ar: 'استراتيجيات مدفوعة بالبيانات للعائد على الاستثمار' },
  feature_dedicatedSupport_title: { en: 'Dedicated Support', ar: 'دعم مخصص' },
  feature_dedicatedSupport_desc: { en: 'A small, focused team for your brand', ar: 'فريق صغير ومركز لعلامتك التجارية' },
  feature_analytics_title: { en: 'Analytics', ar: 'التحليلات' },
  feature_analytics_desc: { en: 'Detailed performance reports', ar: 'تقارير أداء مفصلة' },
  feature_revisions_title: { en: 'Revisions', ar: 'مراجعات' },
  feature_revisions_desc: { en: '2-3 rounds of revisions included', ar: 'يشمل 2-3 جولات من المراجعات' },
  feature_premium_title: { en: 'Premium Quality', ar: 'جودة متميزة' },
  feature_premium_desc: { en: 'Professional-grade deliverables', ar: 'مخرجات بمستوى احترافي' },
  quickLinks: { en: 'Quick Links', ar: 'روابط سريعة' },
  contactInfo: { en: 'Contact Info', ar: 'معلومات الاتصال' },
  followUs: { en: 'Follow Us', ar: 'تابعنا' },
  home: { en: 'Home', ar: 'الرئيسية' },
  aboutUs: { en: 'About Us', ar: 'من نحن' },
  testimonials: { en: 'Testimonials', ar: 'آراء العملاء' },
  privacyPolicy: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  termsOfService: { en: 'Terms of Service', ar: 'شروط الخدمة' },
  cookieSettings: { en: 'Cookie Settings', ar: 'إعدادات الكوكيز' },
  siteTagline: { en: 'Next-generation digital marketing solutions for modern businesses driving growth and innovation', ar: 'حلول تسويق رقمي من الجيل التالي للأعمال الحديثة لدفع النمو والابتكار' },
  copyrightText: { en: '© 2026 D Arrow Digital. All rights reserved.', ar: '© 2026 دي آرو الرقمي. جميع الحقوق محفوظة.' },

  // Services Page
  servicesHeroBadge: { en: '6 Core Services', ar: '6 خدمات أساسية' },
  servicesHeroPill: { en: 'Comprehensive Digital Solutions', ar: 'حلول رقمية شاملة' },
  ourServices: { en: 'Our Services', ar: 'خدماتنا' },
  servicesHeroDesc: { en: 'We deliver innovative strategies and solutions tailored to elevate your digital presence and drive measurable results.', ar: 'نقدم استراتيجيات وحلول مبتكرة مصممة لرفع وجودك الرقمي وتحقيق نتائج قابلة للقياس.' },
  service_seo_title: { en: 'Search Engine Optimization', ar: 'تحسين محركات البحث' },
  service_seo_desc: { en: 'Boost your online visibility with our expert SEO strategies and proven techniques.', ar: 'عزز رؤيتك على الإنترنت مع استراتيجيات تحسين محركات البحث الخبيرة والتقنيات المثبتة.' },
  service_ppc_title: { en: 'Pay-Per-Click Advertising', ar: 'إعلان الدفع مقابل النقرة' },
  service_ppc_desc: { en: 'Maximize ROI with targeted PPC campaigns across Google, Facebook, and more.', ar: 'اقصد الحد الأقصى للعائد على الاستثمار مع حملات PPC مستهدفة عبر Google و Facebook وغيرها.' },
  service_smm_title: { en: 'Social Media Marketing', ar: 'التسويق عبر وسائل التواصل الاجتماعي' },
  service_smm_desc: { en: 'Engage your audience with compelling social strategies and content creation.', ar: 'تفاعل مع جمهورك من خلال استراتيجيات اجتماعية جذابة وإنشاء المحتوى.' },
  service_email_title: { en: 'Email Marketing', ar: 'التسويق عبر البريد الإلكتروني' },
  service_email_desc: { en: 'Convert leads into customers with effective email campaigns and automation.', ar: 'حول الفرص إلى عملاء مع حملات بريد إلكترونية فعالة وأتمتة.' },
  service_pr_title: { en: 'Public Relations', ar: 'العلاقات العامة' },
  service_pr_desc: { en: 'Build your brand reputation with strategic PR and media outreach.', ar: 'بناء سمعة علامتك التجارية من خلال العلاقات العامة الاستراتيجية والتواصل الإعلامي.' },
  service_brand_title: { en: 'Brand Identity Design', ar: 'تصميم هوية العلامة التجارية' },
  service_brand_desc: { en: 'Create a memorable brand that stands out in your market and connects with customers.', ar: 'إنشاء علامة تجارية لا تُنسى تتميز في السوق وتتصل بالعملاء.' },
  service_software_title: { en: 'Software Development', ar: 'تطوير البرامج' },
  service_software_desc: { en: 'Designing, building, testing, and maintaining computer programs and applications that drive your business forward.', ar: 'تصميم وبناء واختبار والحفاظ على برامج الكمبيوتر والتطبيقات التي تدفع عملك للأمام.' },
  service_app_title: { en: 'App Development', ar: 'تطوير التطبيقات' },
  service_app_desc: { en: 'App Development is the process of designing, building, testing, and maintaining mobile or web applications that solve user or business problems using software technologies.', ar: 'تطوير التطبيقات هو عملية تصميم وبناء واختبار والحفاظ على تطبيقات الهاتف المحمول أو الويب التي تحل مشاكل المستخدمين أو الأعمال باستخدام تقنيات البرامج.' },
  service_website_title: { en: 'Website Development', ar: 'تطوير المواقع الإلكترونية' },
  service_website_desc: { en: 'Website development is the process of designing, building, and maintaining websites that help businesses grow online with responsive, fast, and secure solutions.', ar: 'تطوير المواقع الإلكترونية هي عملية تصميم وبناء والحفاظ على المواقع التي تساعد الشركات على النمو على الإنترنت مع حلول متجاوبة وسريعة وآمنة.' },
  serviceFeatures_software: { en: ['ERP Software', 'CRM Software', 'HR Software', 'Custom Development'], ar: ['برنامج ERP', 'برنامج CRM', 'برنامج الموارد البشرية', 'التطوير المخصص'] },
  serviceFeatures_app: { en: ['Mobile Apps', 'Web Apps', 'Desktop Apps', 'App Integration'], ar: ['تطبيقات الهاتف المحمول', 'تطبيقات الويب', 'تطبيقات سطح المكتب', 'دمج التطبيقات'] },
  serviceFeatures_website: { en: ['Mobile-friendly & Responsive', 'Fast Loading & SEO-optimized', 'Secure & Reliable', 'User Experience Design'], ar: ['صديق للهاتف المحمول ومتجاوب', 'محسّن للسرعة والبحث', 'آمن وموثوق', 'تصميم تجربة المستخدم'] },
  serviceFeatures_seo: { en: ['Keyword Research', 'On-Page Optimization', 'Link Building', 'Analytics'], ar: ['البحث عن الكلمات المفتاحية', 'تحسين الصفحة', 'بناء الروابط', 'التحليلات'] },
  serviceFeatures_ppc: { en: ['Campaign Setup', 'Ad Optimization', 'Bid Management', 'Monthly Reports'], ar: ['إعداد الحملة', 'تحسين الإعلان', 'إدارة العروض', 'التقارير الشهرية'] },
  serviceFeatures_smm: { en: ['Content Creation', 'Community Management', 'Influencer Outreach', 'Analytics'], ar: ['إنشاء المحتوى', 'إدارة المجتمع', 'التواصل مع المؤثرين', 'التحليلات'] },
  serviceFeatures_email: { en: ['Email Design', 'List Building', 'Automation Setup', 'Performance Tracking'], ar: ['تصميم البريد الإلكتروني', 'بناء القائمة', 'إعداد الأتمتة', 'تتبع الأداء'] },
  serviceFeatures_pr: { en: ['Media Pitching', 'Press Release Writing', 'Brand Positioning', 'Crisis Management'], ar: ['عرض وسائل الإعلام', 'كتابة بيان صحفي', 'تحديد موضع العلامة التجارية', 'إدارة الأزمات'] },
  serviceFeatures_brand: { en: ['Logo Design', 'Brand Guidelines', 'Visual Identity', 'Style Guides'], ar: ['تصميم الشعار', 'إرشادات العلامة التجارية', 'الهوية البصرية', 'أدلة الأسلوب'] },
  service_event_title: { en: 'Event Management', ar: 'إدارة الأحداث' },
  service_event_desc: { en: 'Plan and execute memorable events that engage your audience and build your brand presence.', ar: 'خطط وقم بتنفيذ أحداث لا تُنسى تجذب جمهورك وتبني وجود علامتك التجارية.' },
  serviceFeatures_event: { en: ['Event Planning', 'Vendor Management', 'On-site Coordination', 'Post-event Analytics'], ar: ['تخطيط الحدث', 'إدارة الموردين', 'التنسيق على الموقع', 'تحليلات ما بعد الحدث'] },
  service_photography_title: { en: 'Project Photography', ar: 'تصوير المشاريع' },
  service_photography_desc: { en: 'Capture the essence of your projects with professional photography that showcases your work and attracts clients.', ar: 'التقط جوهر مشاريعك من خلال التصوير الفوتوغرافي الاحترافي الذي يعرض عملك ويجذب العملاء.' },
  serviceFeatures_photography: { en: ['Portfolio Photography', 'Product Photography', 'Professional Editing', 'Digital Delivery'], ar: ['تصوير المحفظة', 'تصوير المنتجات', 'التحرير الاحترافي', 'التسليم الرقمي'] },

  // New Digital Marketing Services
  service_softwareDev_title: { en: 'Software Design Development ', ar: 'تطوير تصميم البرمجيات' },
  service_softwareDev_desc: { en: 'Custom software solutions tailored to your business needs', ar: 'حلول برامج مخصصة مصممة لاحتياجات عملك' },
  serviceFeatures_softwareDev: { en: ['Custom Development', 'Scalable Solutions', 'Quality Assurance', 'Maintenance Support', 'API Integration', 'Database Design', 'Security Implementation', 'Cloud Deployment'], ar: ['التطوير المخصص', 'حلول قابلة للتوسع', 'ضمان الجودة', 'دعم الصيانة', 'دمج API', 'تصميم قاعدة البيانات', 'تنفيذ الأمان', 'نشر سحابة'] },
  
  service_appDev_title: { en: 'App Design and Development', ar: 'تصميم وتطوير التطبيقات' },
  service_appDev_desc: { en: 'Native and cross-platform mobile applications', ar: 'تطبيقات الهاتف المحمول الأصلية والمتقاطعة' },
  serviceFeatures_appDev: { en: ['iOS & Android', 'User-Friendly Design', 'Performance Optimization', 'App Store Deployment', 'Push Notifications', 'Offline Functionality', 'In-App Analytics', 'Regular Updates'], ar: ['iOS و Android', 'تصميم سهل الاستخدام', 'تحسين الأداء', 'نشر متجر التطبيقات', 'إشعارات فورية', 'وظائف بدون اتصال', 'تحليلات داخل التطبيق', 'تحديثات منتظمة'] },
  
  service_websiteDev_title: { en: 'Website Design Development', ar: 'تطوير تصميم المواقع' },
  service_websiteDev_desc: { en: 'Professional websites that convert visitors to customers', ar: 'مواقع احترافية تحول الزوار إلى عملاء' },
  serviceFeatures_websiteDev: { en: ['Responsive Design', 'Fast Loading', 'SEO Friendly', 'CMS Integration', 'Responsive Design', 'SEO Integration', 'Fast Loading', 'Security Features'], ar: ['تصميم متجاوب', 'تحميل سريع', 'محسّن للبحث', 'دمج نظام إدارة المحتوى', 'تصميم متجاوب', 'دمج SEO', 'تحميل سريع', 'ميزات الأمان'] },
  
  service_seoNew_title: { en: 'Search Engine Optimization', ar: 'تحسين محركات البحث' },
  service_seoNew_desc: { en: 'Improve your online visibility and organic search rankings', ar: 'حسّن رؤيتك على الإنترنت وترتيبات البحث العضوي' },
  serviceFeatures_seoNew: { en: ['Keyword Research', 'On-Page SEO', 'Link Building', 'Analytics Tracking', 'Local SEO Setup', 'Monthly Reports', 'Competitor Analysis'], ar: ['البحث عن الكلمات المفتاحية', 'تحسين الصفحة', 'بناء الروابط', 'تتبع التحليلات', 'إعداد SEO المحلي', 'تقارير شهرية', 'تحليل المنافسين'] },
  
  service_ppcNew_title: { en: 'Pay-Per-Click Advertising', ar: 'إعلان الدفع مقابل النقرة' },
  service_ppcNew_desc: { en: 'Targeted paid advertising campaigns for immediate results', ar: 'حملات إعلانية مستهدفة مدفوعة للنتائج الفورية' },
  serviceFeatures_ppcNew: { en: ['Google Ads', 'Social Media Ads', 'Bid Management', 'ROI Optimization', 'Conversion Tracking', 'ROI Reporting', 'A/B Testing'], ar: ['إعلانات Google', 'إعلانات وسائل التواصل الاجتماعي', 'إدارة العروض', 'تحسين العائد على الاستثمار', 'تتبع التحويل', 'تقارير العائد على الاستثمار', 'اختبار A/B'] },
  
  service_smmNew_title: { en: 'Social Media Marketing', ar: 'التسويق عبر وسائل التواصل الاجتماعي' },
  service_smmNew_desc: { en: 'Build and engage your community across social platforms', ar: 'بناء وتفاعل مع مجتمعك عبر منصات التواصل' },
  serviceFeatures_smmNew: { en: ['Content Creation', 'Community Management', 'Influencer Partnership', 'Analytics', 'Instagram & social media content', 'Ready-made digital template', 'Logo design packs', 'Email marketing setup', 'Analytics & reporting'], ar: ['إنشاء المحتوى', 'إدارة المجتمع', 'شراكة المؤثرين', 'التحليلات', 'محتوى Instagram ووسائل التواصل الاجتماعي', 'قالب رقمي جاهز', 'حزم تصميم الشعار', 'إعداد التسويق عبر البريد الإلكتروني', 'التحليلات والتقارير'] },
  
  service_emailNew_title: { en: 'Email Marketing', ar: 'التسويق عبر البريد الإلكتروني' },
  service_emailNew_desc: { en: 'Drive conversions with targeted email campaigns', ar: 'اقود التحويلات مع حملات البريد الإلكتروني المستهدفة' },
  serviceFeatures_emailNew: { en: ['Campaign Design', 'Audience Segmentation', 'Automation', 'Performance Reports', 'Automation Workflows', 'Segmentation', 'Performance Optimization'], ar: ['تصميم الحملة', 'تجزئة الجمهور', 'الأتمتة', 'تقارير الأداء', 'سير عمل الأتمتة', 'التقسيم', 'تحسين الأداء'] },
  
  service_prNew_title: { en: 'Public Relations', ar: 'العلاقات العامة' },
  service_prNew_desc: { en: 'Build brand reputation and media coverage', ar: 'بناء سمعة العلامة التجارية وتغطية الإعلام' },
  serviceFeatures_prNew: { en: ['Media Relations', 'Press Releases', 'Crisis Management', 'Brand Positioning', 'Press Release Writing', 'Media Relations', 'Crisis Management'], ar: ['العلاقات الإعلامية', 'بيانات صحفية', 'إدارة الأزمات', 'تحديد موضع العلامة التجارية', 'كتابة بيان صحفي', 'العلاقات الإعلامية', 'إدارة الأزمات'] },
  
  service_brandNew_title: { en: 'Brand Identity Design', ar: 'تصميم هوية العلامة التجارية' },
  service_brandNew_desc: { en: 'Create a memorable brand that stands out', ar: 'إنشاء علامة تجارية لا تُنسى تتميز' },
  serviceFeatures_brandNew: { en: ['Logo Design', 'Brand Guidelines', 'Color Psychology', 'Visual Consistency', 'Brand Guidelines', 'Visual Identity System', 'Brand Voice Development'], ar: ['تصميم الشعار', 'إرشادات العلامة التجارية', 'علم نفس الألوان', 'الاتساق البصري', 'إرشادات العلامة التجارية', 'نظام الهوية البصرية', 'تطوير صوت العلامة التجارية'] },
  
  service_eventNew_title: { en: 'Event Management', ar: 'إدارة الأحداث' },
  service_eventNew_desc: { en: 'Plan and execute successful marketing events', ar: 'خطط وقم بتنفيذ أحداث تسويقية ناجحة' },
  serviceFeatures_eventNew: { en: ['Event Planning', 'Venue Management', 'Promotion', 'Post-Event Analysis', 'Event Planning', 'Vendor Coordination', 'Post-Event Analysis'], ar: ['تخطيط الحدث', 'إدارة الموقع', 'الترويج', 'تحليل ما بعد الحدث', 'تخطيط الحدث', 'تنسيق الموردين', 'تحليل ما بعد الحدث'] },
  
  service_photographyNew_title: { en: 'Project Photography', ar: 'تصوير المشاريع' },
  service_photographyNew_desc: { en: 'Professional photography for your marketing materials', ar: 'التصوير الفوتوغرافي الاحترافي لمواد التسويق الخاصة بك' },
  serviceFeatures_photographyNew: { en: ['Product Photography', 'Corporate Portraits', 'Event Coverage', 'Photo Editing', 'Professional Retouching', 'Print Preparation', 'Digital Delivery'], ar: ['تصوير المنتجات', 'الصور الشركاتية', 'تغطية الأحداث', 'تحرير الصور', 'إعادة لمس احترافية', 'تحضير للطباعة', 'التسليم الرقمي'] },

  // Real Estate Services
  service_realEstateName_title: { en: 'Branding Design & development', ar: 'تصميم وتطوير العلامات التجارية' },
  service_realEstateName_desc: { en: 'Strategic naming solutions for real estate projects', ar: 'حلول تسمية استراتيجية لمشاريع العقارات' },
  serviceFeatures_realEstateName: { en: ['Brand Identity', 'Market Research', 'Legal Compliance', 'Cultural Sensitivity', 'Legal Trademark Check'], ar: ['هوية العلامة التجارية', 'أبحاث السوق', 'الامتثال القانوني', 'الحساسية الثقافية', 'فحص العلامة التجارية القانوني'] },
  
  service_realEstateLaunch_title: { en: 'Project Launch Management', ar: 'إدارة إطلاق المشروع' },
  service_realEstateLaunch_desc: { en: 'Complete project launch strategy and execution', ar: 'استراتيجية وتنفيذ إطلاق المشروع الكامل' },
  serviceFeatures_realEstateLaunch: { en: ['Pre-Launch Planning', 'Marketing Strategy', 'Event Management', 'Community Engagement', 'Grand Opening Event', 'Launch Analytics'], ar: ['التخطيط قبل الإطلاق', 'استراتيجية التسويق', 'إدارة الأحداث', 'تفاعل المجتمع', 'حفل الافتتاح الكبير', 'تحليلات الإطلاق'] },
  
  service_realEstateContent_title: { en: 'Real Estate Content Strategy', ar: 'استراتيجية محتوى العقارات' },
  service_realEstateContent_desc: { en: 'Professional content creation for property marketing', ar: 'إنشاء محتوى احترافي لتسويق العقارات' },
  serviceFeatures_realEstateContent: { en: ['Photography/Videography', 'Property Descriptions', 'Virtual Tours', 'Social Media Content', '360 Virtual Tours'], ar: ['التصوير/الفيديو', 'وصف الممتلكات', 'الجولات الافتراضية', 'محتوى وسائل التواصل الاجتماعي', 'جولات 360 افتراضية'] },
  
  service_realEstateDigital_title: { en: 'Digital Content Management', ar: 'إدارة المحتوى الرقمي' },
  service_realEstateDigital_desc: { en: 'Comprehensive digital content for real estate', ar: 'محتوى رقمي شامل للعقارات' },
  serviceFeatures_realEstateDigital: { en: ['Website Content', 'Blog Management', 'Email Campaigns', 'Brochure Design', 'Website Integration'], ar: ['محتوى الموقع', 'إدارة المدونة', 'حملات البريد الإلكتروني', 'تصميم الكتيب', 'دمج الموقع'] },
  
  service_realEstateCampaign_title: { en: 'Campaign Management', ar: 'إدارة الحملات' },
  service_realEstateCampaign_desc: { en: 'Targeted marketing campaigns for property sales', ar: 'حملات تسويقية موجهة لبيع العقارات' },
  serviceFeatures_realEstateCampaign: { en: ['Paid Advertising', 'Lead Generation', 'Analytics Tracking', 'Performance Optimization', 'Investor Relations'], ar: ['الإعلان المدفوع', 'توليد العملاء المحتملين', 'تتبع التحليلات', 'تحسين الأداء', 'علاقات المستثمرين'] },
  whyChooseServicesTitle: { en: 'Why Choose Our Services', ar: 'لماذا تختار خدماتنا' },
  whyChooseServicesDesc: { en: 'Experts committed to your success', ar: 'خبراء ملتزمون بنجاحك' },
  servicesFeature_turnaround: { en: 'Fast Turnaround', ar: 'تسليم سريع' },
  servicesFeature_turnaround_desc: { en: 'Quick results without compromising quality', ar: 'نتائج سريعة دون المساس بالجودة' },
  servicesFeature_focused: { en: 'Results Focused', ar: 'موجه بالنتائج' },
  servicesFeature_focused_desc: { en: 'Every strategy designed to achieve your goals', ar: 'كل استراتيجية مصممة لتحقيق أهدافك' },
  servicesFeature_support: { en: 'Dedicated Support', ar: 'دعم مخصص' },
  servicesFeature_support_desc: { en: '24/7 support from our expert team', ar: 'دعم 24/7 من فريقنا الخبير' },
  servicesFeature_analytics: { en: 'Analytics & Reporting', ar: 'التحليلات والتقارير' },
  servicesFeature_analytics_desc: { en: 'Transparent reports with detailed insights', ar: 'تقارير شفافة مع رؤى تفصيلية' },
  readyToElevateTitle: { en: 'Ready to Elevate Your Digital Presence?', ar: 'هل أنت مستعد لرفع وجودك الرقمي؟' },
  readyToElevateDesc: { en: "Let's discuss how our services can help your business achieve its goals.", ar: 'دعونا نناقش كيف يمكن لخدماتنا مساعدة عملك في تحقيق أهدافه.' },

  // Why Us Page
  whyChooseUsBadge: { en: '6 Core Advantages', ar: '6 مزايا أساسية' },
  whyChooseUsPill: { en: 'Partners in Your Success', ar: 'شركاء في نجاحك' },
  projectsDelivered: { en: 'Projects Delivered', ar: 'المشاريع المسلمة' },
  clientSatisfaction: { en: 'Client Satisfaction', ar: 'رضا العملاء' },
  yearsExperience: { en: 'Years Experience', ar: 'سنوات الخبرة' },
  whatMakesDifferent: { en: 'What Makes Us Different', ar: 'ما يميزنا' },
  whatMakesDifferentDesc: { en: 'The foundation of our partnership approach', ar: 'أساس نهجنا في الشراكة' },
  dedicatedAccountManagers: { en: 'Dedicated Account Managers', ar: 'مديرو الحسابات المخصصون' },
  dedicatedAccountManagersDesc: { en: 'Get a single point of contact who understands your business goals and strategies.', ar: 'احصل على نقطة اتصال واحدة تفهم أهداف عملك واستراتيجياتك.' },
  transparentReporting: { en: 'Transparent Reporting', ar: 'التقارير الشفافة' },
  transparentReportingDesc: { en: 'Regular, detailed reports that clearly show ROI and progress toward your objectives.', ar: 'تقارير منتظمة ومفصلة تظهر بوضوح العائد على الاستثمار والتقدم نحو أهدافك.' },
  continuousOptimization: { en: 'Continuous Optimization', ar: 'تحسين مستمر' },
  continuousOptimizationDesc: { en: 'We constantly test, analyze, and improve your campaigns for better results.', ar: 'نقوم باستمرار باختبار وتحليل وتحسين حملاتك للحصول على نتائج أفضل.' },
  industryExpertise: { en: 'Industry Expertise', ar: 'خبرة صناعية' },
  industryExpertiseDesc: { en: 'Our team stays current with latest trends and best practices in digital marketing.', ar: 'يظل فريقنا محدثًا بأحدث الاتجاهات وأفضل الممارسات في التسويق الرقمي.' },
  experienceDifference: { en: 'Experience the Difference', ar: 'اختبر الفرق' },
  experienceDifferenceDesc: { en: "Let's have a conversation about how we can help your business grow and succeed in the digital space.", ar: 'لنجري محادثة حول كيفية مساعدتنا لعملك على النمو والنجاح في المساحة الرقمية.' },

  // Contact Page
  getInTouchTitle: { en: 'Get in Touch', ar: 'تواصل معنا' },
  getInTouchDesc: { en: 'Have a question or ready to start your digital transformation? We\'d love to hear from you. Reach out and let\'s create somethings amazing together.', ar: 'هل لديك سؤال أو مستعد لبدء التحول الرقمي؟ نود أن نسمع منك. تواصل معنا ولننشئ شيئًا رائعًا معًا.' },
  contactEmail: { en: 'Email', ar: 'البريد الإلكتروني' },
  contactEmailValue: { en: 'support@d-arrow.com', ar: 'support@d-arrow.com' },
  contactEmailSubtext: { en: "We'll respond within 24 hours", ar: 'سنرد عليك في غضون 24 ساعة' },
  contactPhone: { en: 'Phone', ar: 'الهاتف' },
  contactPhoneValue: { en: '+966 50 046 6349', ar: '+966 50 046 6349' },
  contactPhoneSubtext: { en: 'Available during business hours', ar: 'متاح خلال ساعات العمل' },
  contactLocation: { en: 'Location', ar: 'الموقع' },
  contactLocationValue: { en: '6399, 4, Ibn Sina, AlKhobar, 34626,Dammam, Saudi Arabia', ar: '6399، 4، ابن سينا، الخبر، 34626، الدمام، المملكة العربية السعودية' },
  contactLocationSubtext: { en: 'Visit our office', ar: 'قم بزيارة مكتبنا' },
  contactHours: { en: 'Working Hours', ar: 'ساعات العمل' },
  contactHoursValue: { en: 'Mon - Fri, 9AM - 6PM', ar: 'الاثنين - الجمعة، 9 صباحًا - 6 مساءً' },
  contactHoursSubtext: { en: 'Saturday by appointment', ar: 'السبت بموعد مسبق' },
  sendMessage: { en: 'Send us a Message', ar: 'أرسل لنا رسالة' },
  messageSuccessful: { en: "Message sent successfully! We'll get back to you soon.", ar: 'تم إرسال الرسالة بنجاح! سنعود إليك قريبًا.' },
  yourName: { en: 'Name', ar: 'اسمك' },
  yourEmail: { en: 'Your Email', ar: 'بريدك الإلكتروني' },
  yourPhone: { en: 'Phone Number', ar: 'رقم هاتفك' },
  yourCompany: { en: 'Company', ar: 'الشركة' },
  selectService: { en: 'Select Service', ar: 'اختر الخدمة' },
  yourMessage: { en: 'Your Message', ar: 'رسالتك' },
  sendButton: { en: 'Send Message', ar: 'إرسال الرسالة' },
  contactFormResponseText: { en: "Fill out the form and we'll get back to you within 24 hours with a personalized response.", ar: 'ملء النموذج وسنعود إليك في غضون 24 ساعة برد مخصص.' },
  transparentPricingText: { en: 'Transparent pricing with no hidden fees', ar: 'أسعار شفافة بدون رسوم مخفية' },
  followUsTitle: { en: 'Follow Us', ar: 'تابعنا' },
  followUsDesc: { en: 'Connect with D Arrow Digital on social media for latest updates and insights', ar: 'تواصل مع D Arrow الرقمية على وسائل التواصل الاجتماعي لأحدث التحديثات والرؤى' },
  socialInstagram: { en: 'Instagram', ar: 'إنستغرام' },
  socialSnapchat: { en: 'Snapchat', ar: 'سناب تشات' },
  socialLinkedin: { en: 'LinkedIn', ar: 'لينكدإن' },
  socialTiktok: { en: 'TikTok', ar: 'تيك توك' },
  socialWhatsapp: { en: 'WhatsApp', ar: 'واتس آب' },
  emailPreview: { en: 'Preview', ar: 'معاينة' },
  emailSubject: { en: 'Subject', ar: 'الموضوع' },
  generalInquiry: { en: 'General Inquiry', ar: 'استفسار عام' },
  chatbotOnline: { en: 'Online', ar: 'متصل' },
  meetOurTeam: { en: 'Meet our Team', ar: 'قابل فريقنا' },
  portfolioProjectDesc: { en: 'Each project is presented as a focused case — clear goals, approach, and results.', ar: 'يتم عرض كل مشروع كحالة مركزة — أهداف واضحة، نهج، ونتائج.' },
  testEmailSending: { en: 'Test Email Sending', ar: 'اختبار إرسال البريد الإلكتروني' },
  sending: { en: 'Sending...', ar: 'جاري الإرسال...' },
  testContactFormEmail: { en: 'Test Contact Form Email', ar: 'اختبار بريد نموذج الاتصال' },
  testCustomServiceEmail: { en: 'Test Custom Service Email', ar: 'اختبار بريد الخدمة المخصصة' },

  // Pricing Page
  pricingBadge: { en: '20+ Years Design Experience', ar: '20+ سنة من خبرة التصميم' },
  pricingPill: { en: 'Trusted by businesses in MENA', ar: 'موثوق من قبل الشركات في منطقة الشرق الأوسط وشمال أفريقيا' },
  marketingPackages: { en: 'Marketing Packages', ar: 'حزم التسويق' },
  developmentDesignPackage: { en: 'Development & Design Package', ar: 'حزمة التطوير والتصميم' },
  
  // Pricing Card - Basic Plan
  pricingBasic: { en: 'Basic', ar: 'أساسي' },
  pricingBasicPrice: { en: '3,500 SAR', ar: '3,500 ريال سعودي' },
  pricingBasicFeature1: { en: '8 social media posts / month', ar: '8 منشورات على وسائل التواصل الاجتماعي / شهرياً' },
  pricingBasicFeature2: { en: 'Basic creatives & captions', ar: 'تصاميم وتعليقات أساسية' },
  pricingBasicFeature3: { en: 'Hashtag research', ar: 'بحث علامات التجزئة' },
  pricingBasicFeature4: { en: 'Monthly performance report', ar: 'تقرير الأداء الشهري' },
  pricingBasicFeature5: { en: 'Account insights & recommendations', ar: 'رؤى الحساب والتوصيات' },
  
  // Pricing Card - Growth Plan
  pricingGrowth: { en: 'Growth', ar: 'النمو' },
  pricingGrowthPrice: { en: '5,500 SAR', ar: '5,500 ريال سعودي' },
  pricingGrowthFeature1: { en: '12 posts / month + content calendar', ar: '12 منشور / شهرياً + تقويم المحتوى' },
  pricingGrowthFeature2: { en: 'Community engagement (comments & DMs)', ar: 'مشاركة المجتمع (التعليقات والرسائل المباشرة)' },
  pricingGrowthFeature3: { en: 'Basic ad spend management (up to X SAR ad budget)', ar: 'إدارة الإنفاق الإعلاني الأساسية (حتى X ريال سعودي ميزانية إعلانية)' },
  pricingGrowthFeature4: { en: 'Weekly optimization & reporting', ar: 'التحسين والإبلاغ الأسبوعي' },
  pricingGrowthFeature5: { en: 'Audience growth strategy', ar: 'استراتيجية نمو الجمهور' },
  pricingMostPopular: { en: 'Most Popular', ar: 'الأكثر شعبية' },
  
  // Pricing Card - Professional Plan
  pricingProfessional: { en: 'Professional', ar: 'احترافي' },
  pricingProfessionalPrice: { en: '7,000 SAR', ar: '7,000 ريال سعودي' },
  pricingProfessionalFeature1: { en: 'Strategy & campaign planning', ar: 'الاستراتيجية وتخطيط الحملة' },
  pricingProfessionalFeature2: { en: 'Targeted paid ads (Facebook/Instagram)', ar: 'إعلانات مدفوعة موجهة (Facebook/Instagram)' },
  pricingProfessionalFeature3: { en: 'Landing page creatives', ar: 'تصاميم صفحة الهبوط' },
  pricingProfessionalFeature4: { en: 'Advanced monthly analytics report', ar: 'تقرير التحليلات المتقدم الشهري' },
  pricingProfessionalFeature5: { en: 'A/B testing & monthly optimization', ar: 'اختبار A/B والتحسين الشهري' },
  
  // Pricing Card - Custom Plan
  pricingCustom: { en: 'Custom Package', ar: 'حزمة مخصصة' },
  pricingCustomPrice: { en: 'Custom Pricing', ar: 'أسعار مخصصة' },
  pricingCustomFeature1: { en: 'Tailored marketing mix (posts + ads + reels + influencer collabs)', ar: 'مزيج تسويقي مخصص (منشورات + إعلانات + ملفات فيديو + تعاونات المؤثرين)' },
  pricingCustomFeature2: { en: 'Dedicated account manager', ar: 'مدير حساب مخصص' },
  pricingCustomFeature3: { en: 'SEO + email + content marketing alignment', ar: 'توافق SEO + البريد الإلكتروني + التسويق بالمحتوى' },
  pricingCustomFeature4: { en: 'Quarterly strategy & planning', ar: 'استراتيجية وتخطيط ربع سنوي' },
  pricingCustomFeature5: { en: 'Advanced reporting & integrations', ar: 'إعداد التقارير والتكاملات المتقدمة' },
  
  // Development Plans
  pricingStarterPackage: { en: 'Starter Package (Basic Website)', ar: 'حزمة البداية (موقع إلكتروني أساسي)' },
  pricingStarterPrice: { en: '4,000 SAR', ar: '4,000 ريال سعودي' },
  pricingStarterFeature1: { en: '5 Pages Website (Home, About, Services, Contact)', ar: 'موقع إلكتروني من 5 صفحات (الرئيسية، من نحن، الخدمات، اتصل بنا)' },
  pricingStarterFeature2: { en: 'Responsive Design (Mobile Friendly)', ar: 'تصميم متجاوب (صديق الهاتف المحمول)' },
  pricingStarterFeature3: { en: 'Basic UI/UX Design', ar: 'تصميم واجهة المستخدم الأساسي' },
  pricingStarterFeature4: { en: 'Contact Form Integration', ar: 'تكامل نموذج الاتصال' },
  pricingStarterFeature5: { en: 'Basic SEO Setup', ar: 'إعداد SEO الأساسي' },
  pricingStarterFeature6: { en: '1 Month Support', ar: 'دعم شهر واحد' },
  pricingStarterFeature7: { en: 'Best for: New startups / small offices', ar: 'الأفضل للشركات الناشئة الجديدة / المكاتب الصغيرة' },
  
  // Business Package
  pricingBusiness: { en: 'Business Package', ar: 'حزمة الأعمال' },
  pricingBusinessPrice: { en: '7,000 SAR', ar: '7,000 ريال سعودي' },
  pricingBusinessFeature1: { en: '8–12 Pages Website', ar: 'موقع إلكتروني من 8-12 صفحة' },
  pricingBusinessFeature2: { en: 'Custom UI/UX Design', ar: 'تصميم واجهة المستخدم المخصص' },
  pricingBusinessFeature3: { en: 'Admin Panel (Content Management)', ar: 'لوحة التحكم (إدارة المحتوى)' },
  pricingBusinessFeature4: { en: 'Speed Optimization', ar: 'تحسين السرعة' },
  pricingBusinessFeature5: { en: 'On-Page SEO Optimization', ar: 'تحسين SEO داخل الصفحة' },
  pricingBusinessFeature6: { en: 'WhatsApp / Live Chat Integration', ar: 'تكامل WhatsApp / الدردشة المباشرة' },
  pricingBusinessFeature7: { en: '2 Months Support', ar: 'دعم شهرين' },
  
  // E-Commerce Package
  pricingEcommerce: { en: 'E-Commerce / Advanced Package', ar: 'حزمة التجارة الإلكترونية / المتقدمة' },
  pricingEcommercePrice: { en: '12,000 SAR', ar: '12,000 ريال سعودي' },
  pricingEcommerceFeature1: { en: 'Full E-Commerce Website', ar: 'موقع إلكتروني للتجارة الإلكترونية الكامل' },
  pricingEcommerceFeature2: { en: 'Product Management System', ar: 'نظام إدارة المنتجات' },
  pricingEcommerceFeature3: { en: 'Payment Gateway Integration', ar: 'تكامل بوابة الدفع' },
  pricingEcommerceFeature4: { en: 'Order & Invoice System', ar: 'نظام الطلبات والفواتير' },
  pricingEcommerceFeature5: { en: 'Customer Dashboard', ar: 'لوحة تحكم العميل' },
  pricingEcommerceFeature6: { en: 'Advanced Security Setup', ar: 'إعداد الأمان المتقدم' },
  pricingEcommerceFeature7: { en: 'Performance Optimization', ar: 'تحسين الأداء' },
  pricingEcommerceFeature8: { en: '3 Months Support', ar: 'دعم ثلاثة أشهر' },
  pricingEcommerceFeature9: { en: 'Best for: Online stores / product-based business', ar: 'الأفضل للمتاجر الإلكترونية / الأعمال القائمة على المنتجات' },
  
  // Enterprise Package
  pricingEnterprise: { en: 'Enterprise / Custom Solution Package', ar: 'حزمة الحل المخصص / المؤسسي' },
  pricingEnterpriseFeature1: { en: 'Custom Web Application / ERP / CRM', ar: 'تطبيق ويب مخصص / ERP / CRM' },
  pricingEnterpriseFeature2: { en: 'API Integration', ar: 'تكامل API' },
  pricingEnterpriseFeature3: { en: 'Advanced Database Architecture', ar: 'بنية قاعدة البيانات المتقدمة' },
  pricingEnterpriseFeature4: { en: 'Role-based Admin System', ar: 'نظام admin قائم على الأدوار' },
  pricingEnterpriseFeature5: { en: 'Cloud Deployment (AWS / VPS)', ar: 'نشر سحابي (AWS / VPS)' },
  pricingEnterpriseFeature6: { en: 'High-Level Security', ar: 'أمان عالي المستوى' },
  pricingEnterpriseFeature7: { en: 'Ongoing Maintenance Option', ar: 'خيار الصيانة المستمرة' },
  pricingEnterpriseFeature8: { en: 'Dedicated Technical Support', ar: 'دعم فني مخصص' },

  // Portfolio Page
  discoverOurWork: { en: 'Discover Our Work', ar: 'اكتشف أعمالنا' },
  ecommerceTitle: { en: 'Al Syahaal Arabia ', ar: 'أخبار ومجلة على الانترنت' },
  ecommerceDesc: { en: 'Alsyahaalarabia.com is an Al Syahaal Arabia website focusing mainly on tourism-related content in the Arab world, especially Saudi Arabia. It appears to be a digital magazine publishing news, tourism articles, travel insights, and related topics.', ar: 'إعادة هيكلية كاملة للواجهة والتجربة لعميل تجارة إلكترونية كبير، مما أدى إلى زيادة 40% في التحويلات وتجربة مستخدم أكثر سهولة.' },
  saasTitle: { en: 'Beedco', ar: 'هوية علامة SaaS التجارية' },
  saasDesc: { en: 'Developed a comprehensive brand identity for a new SaaS startup, including logo, color palette, and a full brand style guide to ensure consistency.', ar: 'طورنا هوية علامة تجارية شاملة لشركة SaaS ناشئة جديدة، تشمل الشعار ولوحة الألوان وكتيب نمط العلامة التجارية الكامل لضمان الاتساق.' },
  socialMediaTitle: { en: 'Social Media Campaign', ar: 'حملة وسائل التواصل الاجتماعي' },
  socialMediaDesc: { en: "Executed a targeted social media campaign that boosted engagement by 200% and grew the client's follower base by 50% in three months.", ar: 'نفذنا حملة وسائل التواصل الاجتماعي المستهدفة التي زادت الالتزام بمقدار 200% ونمت قاعدة متابعي العميل بنسبة 50% في ثلاثة أشهر.' },
  projectTags_uiux: { en: 'UI/UX', ar: 'واجهة المستخدم' },
  projectTags_webDesign: { en: 'Web Design', ar: 'تصميم الويب' },
  projectTags_ecommerce: { en: 'Magazine/News Portal', ar: 'التجارة الإلكترونية' },
  projectTags_branding: { en: 'Branding', ar: 'العلامة التجارية' },
  projectTags_identity: { en: 'Identity', ar: 'الهوية' },
  projectTags_logoDesign: { en: 'Logo Design', ar: 'تصميم الشعار' },
  projectTags_socialMedia: { en: 'Social Media', ar: 'وسائل التواصل الاجتماعي' },
  projectTags_marketing: { en: 'Marketing', ar: 'التسويق' },

  // Process Page
  processHeroBadge: { en: 'Proven 4-Step Process', ar: 'عملية مثبتة بـ 4 خطوات' },
  processHeroPill: { en: 'Transparent & Systematic', ar: 'شفاف ومنهجي' },
  ourProvenProcess: { en: 'Our Proven Process', ar: 'عملياتنا المثبتة' },
  processHeroDesc: { en: 'A systematic and transparent approach to deliver measurable results for your business.', ar: 'نهج منظم وشفاف لتحقيق نتائج قابلة للقياس لعملك.' },
  processOverviewTitle: { en: 'Process Overview', ar: 'نظرة عامة على العملية' },
  processOverviewDesc: { en: 'How we structure our work to ensure your success', ar: 'كيف نهيكل عملنا لضمان نجاحك' },
  discoveryConsultation: { en: '1. Discovery & Consultation', ar: '1. الاكتشاف والاستشارة' },
  discoveryDetails: { en: 'Understand your business goals and target audience. Analyze current market position and competition.', ar: 'فهم أهداف عملك والجمهور المستهدف. تحليل موضع السوق الحالي والمنافسة.' },
  strategyDevelopment: { en: '2. Strategy Development', ar: '2. تطوير الاستراتيجية' },
  strategyDetails: { en: 'Design comprehensive marketing strategy. Set measurable KPIs and objectives. Plan content and campaign calendar.', ar: 'تصميم استراتيجية تسويق شاملة. وضع مؤشرات الأداء الرئيسية والأهداف القابلة للقياس. تخطيط المحتوى وتقويم الحملة.' },
  implementationExecution: { en: '3. Implementation & Execution', ar: '3. التنفيذ' },
  implementationDetails: { en: 'Launch campaigns across selected channels. Create and optimize content assets. Monitor performance in real-time.', ar: 'إطلاق الحملات عبر القنوات المختارة. إنشاء وتحسين أصول المحتوى. مراقبة الأداء في الوقت الفعلي.' },
  analysisOptimization: { en: '4. Analysis & Optimization', ar: '4. التحليل والتحسين' },
  analysisDetails: { en: 'Review comprehensive performance metrics. Identify what worked and improvements needed. Plan next steps for growth.', ar: 'مراجعة مقاييس الأداء الشاملة. تحديد ما نجح والتحسينات المطلوبة. تخطيط الخطوات التالية للنمو.' },
  whyThisProcess: { en: 'Why This Approach Works', ar: 'لماذا ينجح هذا النهج' },
  whyThisProcessDesc: { en: 'The foundation of our success', ar: 'أساس نجاحنا' },
  strategicFoundation: { en: 'Strategic Foundation', ar: 'الأساس الاستراتيجي' },
  strategicFoundationDesc: { en: 'Data-driven strategy before any action', ar: 'استراتيجية مدفوعة بالبيانات قبل أي إجراء' },
  continuousMonitoring: { en: 'Continuous Monitoring', ar: 'المراقبة المستمرة' },
  continuousMonitoringDesc: { en: 'Real-time tracking and adjustments', ar: 'التتبع والتعديلات في الوقت الفعلي' },
  measurableResults: { en: 'Measurable Results', ar: 'نتائج قابلة للقياس' },
  measurableResultsDesc: { en: 'Every decision backed by metrics', ar: 'كل قرار مدعوم بالمقاييس' },
  transparentCommunication: { en: 'Transparent Communication', ar: 'الاتصال الشفاف' },
  transparentCommunicationDesc: { en: 'Keep you informed every step', ar: 'إطلاعك على كل خطوة' },
  readyToGetStartedTitle: { en: 'Ready to Get Started?', ar: 'هل أنت مستعد للبدء؟' },
  readyToGetStartedDesc: { en: "Let's discuss how our proven process can help your business achieve its goals.", ar: 'دعنا نناقش كيف يمكن لعملياتنا المثبتة أن تساعد عملك على تحقيق أهدافه.' },
  scheduleConsultation: { en: 'Schedule Free Consultation', ar: 'جدول استشارة مجانية' },
  viewOurServices: { en: 'View Our Services', ar: 'عرض خدماتنا' },
  // Custom Services / Pricing form
  customPackageTitle: { en: 'Custom Services Package', ar: 'باقة خدمات مخصصة' },
  selectServicesSubtitle: { en: 'Select services that fit your needs', ar: 'اختر الخدمات التي تناسب احتياجاتك' },
  digitalMarketingServices: { en: 'Digital Marketing Services', ar: 'خدمات التسويق الرقمي' },
  realEstateMarketingServices: { en: 'Real Estate Marketing Services', ar: 'خدمات تسويق العقارات' },
  selectedServices: { en: 'Selected Services', ar: 'الخدمات المختارة' },
  remove: { en: 'Remove', ar: 'حذف' },
  subtotal: { en: 'Subtotal', ar: 'الإجمالي' },
  yourInformation: { en: 'Your Information', ar: 'معلوماتك' },
  fullNamePlaceholder: { en: 'Full Name', ar: 'الاسم الكامل' },
  emailAddressPlaceholder: { en: 'Email Address', ar: 'البريد الإلكتروني' },
  phoneNumberPlaceholder: { en: 'Phone Number', ar: 'رقم الهاتف' },
  companyNameOptional: { en: 'Company Name (Optional)', ar: 'اسم الشركة (اختياري)' },
  projectDetails: { en: 'Project Details', ar: 'تفاصيل المشروع' },
  selectBudgetRangeOptional: { en: 'Select Budget Range (Optional)', ar: 'اختر نطاق الميزانية (اختياري)' },
  budget_under_1000: { en: 'Under 5,000 SAR', ar: 'أقل من 5,000 ريال' },
  budget_1000_5000: { en: '1,000 - 5,000 SAR', ar: '1,000 - 5,000 ريال' },
  budget_5000_10000: { en: '5,000 - 10,000 SAR', ar: '5,000 - 10,000 ريال' },
  budget_10000_25000: { en: '10,000 - 25,000 SAR', ar: '10,000 - 25,000 ريال' },
  budget_25000_plus: { en: '25,000+ SAR', ar: 'أكثر من 25,000 ريال' },
  budget_25000_50000: { en: '25,000 - 50,000 SAR', ar: '25,000 - 50,000 ريال' },
  budget_above_50000: { en: 'Above 50,000 SAR', ar: 'أكثر من 50,000 ريال' },
  selectTimelineOptional: { en: 'Select Timeline (Optional)', ar: 'اختر الإطار الزمني (اختياري)' },
  timeline_asap: { en: 'ASAP (Within 1 week)', ar: 'بأقرب وقت (خلال أسبوع)' },
  timeline_short: { en: 'Short term (2-4 weeks)', ar: 'قصير المدى (2-4 أسابيع)' },
  timeline_medium: { en: 'Medium term (1-3 months)', ar: 'متوسط المدى (1-3 أشهر)' },
  timeline_long: { en: 'Long term (3+ months)', ar: 'طويل المدى (أكثر من 3 أشهر)' },
  timeline_flexible: { en: 'Flexible', ar: 'مرن' },
  timeline_1week: { en: '1 Week', ar: 'أسبوع واحد' },
  timeline_2weeks: { en: '2 Weeks', ar: 'أسبوعان' },
  timeline_1month: { en: '1 Month', ar: 'شهر واحد' },
  additionalInfoPlaceholder: { en: 'Tell us more about your project requirements... (Optional)', ar: 'أخبرنا المزيد عن متطلبات مشروعك... (اختياري)' },
  errorTitle: { en: 'Error', ar: 'خطأ' },
  sendingInquiry: { en: 'Sending Inquiry...', ar: 'جارٍ إرسال الطلب...' },
  submitCustomPackage: { en: 'Submit Custom Package', ar: 'إرسال الباقة المخصصة' },
  getCustomQuote: { en: 'Get Custom Quote', ar: 'احصل على عرض مخصص' },
  privacyNote: { en: 'By submitting this form, you agree to our privacy policy and consent to be contacted regarding your inquiry.', ar: 'من خلال إرسال هذا النموذج، فإنك توافق على سياسة الخصوصية لدينا وتسمح بالتواصل بخصوص استفسارك.' },
  thankYou: { en: 'Thank you!', ar: 'شكرًا لك!' },
  customServicesReceived: { en: "We've received your custom services inquiry. Our team will contact you within 24 hours with a personalized quote based on your selected services.", ar: 'لقد استلمنا طلبك للخدمات المخصصة. سيتواصل فريقنا معك خلال 24 ساعة لتقديم عرض سعر مخصص بناءً على الخدمات المختارة.' },
  selectedPackageLabel: { en: 'Selected Package', ar: 'الباقة المختارة' },
  requestQuote: { en: 'Request Quote', ar: 'طلب عرض سعر' },
  pricingReceived: { en: "We've received your pricing inquiry. Our team will contact you within 24 hours with a customized quote.", ar: 'لقد استلمنا استفسارك عن الأسعار. سيتواصل فريقنا معك خلال 24 ساعة لتقديم عرض سعر مخصص.' },
  experienceYears: { en: 'With 20+ years of experience in digital marketing', ar: 'مع أكثر من 20 عامًا من الخبرة في التسويق الرقمي' },
  experienceNote: { en: "We've helped 500+ businesses transform their digital presence. Your project is in expert hands.", ar: 'لقد ساعدنا أكثر من 500 شركة في تحويل وجودها الرقمي. مشروعك في أيدٍ خبيرة.' },
  selectServicesHeader: { en: 'Select Your Services', ar: 'اختر خدماتك' },
  backToServices: { en: 'Back to Services', ar: 'العودة إلى الخدمات' },
  createTailoredPackage: { en: 'Professional consultation for your project', ar: 'استشارة احترافية لمشروعك' },
  // Custom services labels and form errors
  selectAtLeastOneService: { en: 'Please select at least one service', ar: 'الرجاء اختيار خدمة واحدة على الأقل' },
  dm_social_media: { en: 'Social Media Management', ar: 'إدارة وسائل التواصل الاجتماعي' },
  dm_content_creation: { en: 'Content Creation', ar: 'إنشاء المحتوى' },
  dm_paid_ads: { en: 'Paid Advertising (Facebook, Instagram)', ar: 'إعلانات مدفوعة (فيسبوك، إنستغرام)' },
  dm_email_marketing: { en: 'Email Marketing Campaigns', ar: 'حملات التسويق عبر البريد الإلكتروني' },
  dm_analytics: { en: 'Analytics & Reporting', ar: 'التحليلات والتقارير' },
  dm_influencer: { en: 'Influencer Marketing', ar: 'التسويق عبر المؤثرين' },
  dm_seo: { en: 'SEO Optimization', ar: 'تحسين محركات البحث' },
  dm_google_ads: { en: 'Google Ads Management', ar: 'إدارة إعلانات Google' },
  re_listing_photos: { en: 'Property Listing Photography', ar: 'تصوير قوائم العقارات' },
  re_virtual_tours: { en: 'Virtual Tours & 3D Walkthroughs', ar: 'جولات افتراضية وجولات ثلاثية الأبعاد' },
  re_website: { en: 'Real Estate Website Design', ar: 'تصميم مواقع العقارات' },
  re_description_writing: { en: 'Property Description Writing', ar: 'كتابة وصف العقار' },
  re_smm: { en: 'Real Estate Social Media Campaigns', ar: 'حملات وسائل التواصل الاجتماعي للعقارات' },
  re_drone: { en: 'Drone Photography & Videography', ar: 'التصوير الجوي بالفيديو والصور' },
  re_market_analysis: { en: 'Market Analysis Reports', ar: 'تقارير تحليل السوق' },
  re_lead_gen: { en: 'Lead Generation for Real Estate', ar: 'توليد العملاء المحتملين للعقارات' },

  // Category Headers
  digitalMarketingHeader: { en: 'Digital Marketing Services', ar: 'خدمات التسويق الرقمي' },
  innovationHeader: { en: 'Innovation & Development', ar: 'التصميم والتطوير' },
  realEstateHeader: { en: 'Real Estate Marketing', ar: 'تسويق العقارات' },

  // Digital Marketing Services (9 services)
  dm_smm_title: { en: 'Social Media Accounts Management', ar: 'إدارة منصات التواصل الاجتماعي' },
  dm_smm_desc: { en: 'Comprehensive management of your social media presence across all platforms', ar: 'إدارة شاملة لوجودك على وسائل التواصل الاجتماعي عبر جميع المنصات' },
  dm_marketing_title: { en: 'Digital Marketing', ar: 'التسويق الرقمي' },
  dm_marketing_desc: { en: 'Strategic digital marketing campaigns to reach your target audience', ar: 'حملات تسويق رقمي استراتيجية للوصول إلى جمهورك المستهدف' },
  dm_visual_title: { en: 'Visual Production', ar: 'الإنتاج البصري' },
  dm_visual_desc: { en: 'Professional visual content creation for engaging your audience', ar: 'إنشاء محتوى بصري احترافي لجذب جمهورك' },
  dm_influencer_title: { en: 'Influencer Marketing', ar: 'تسويق المؤثرين' },
  dm_influencer_desc: { en: 'Connect with influential personalities to amplify your brand message', ar: 'التواصل مع شخصيات مؤثرة لتضخيم رسالة علامتك التجارية' },
  dm_content_title: { en: 'Creative Content', ar: 'المحتوى الإبداعي' },
  dm_content_desc: { en: 'Compelling creative content that resonates with your audience', ar: 'محتوى إبداعي جذاب يتردد مع جمهورك' },
  dm_exhibitions_title: { en: 'Exhibitions and Conferences Management', ar: 'إدارة المعارض والمؤتمرات' },
  dm_exhibitions_desc: { en: 'Complete management of exhibitions and conferences for maximum impact', ar: 'إدارة كاملة للمعارض والمؤتمرات للحصول على أقصى تأثير' },
  dm_advertising_title: { en: 'Advertisements', ar: 'حملات الإعلانات' },
  dm_advertising_desc: { en: 'Strategic advertising campaigns across multiple channels', ar: 'حملات إعلانية استراتيجية عبر قنوات متعددة' },
  dm_consultation_title: { en: 'Marketing Consultation', ar: 'الاستشارات التسويقية' },
  dm_consultation_desc: { en: 'Expert marketing guidance tailored to your business goals', ar: 'توجيه تسويقي خبير مصمم لأهداف عملك' },
  dm_seo_title: { en: 'SEO & SRO', ar: 'تحسين محركات البحث SEO & SRO' },
  dm_seo_desc: { en: 'Optimize your online presence for search engines', ar: 'حسّن وجودك على الإنترنت لمحركات البحث' },

  // Innovation & Development (5 services)
  id_apps_title: { en: 'Apps Design and Development', ar: 'تصميم وتطوير التطبيقات' },
  id_apps_desc: { en: 'Native and cross-platform mobile applications built for performance', ar: 'تطبيقات الهاتف المحمول الأصلية والمتقاطعة المبنية للأداء' },
  id_website_title: { en: 'Website Design and Development', ar: 'تصميم وتطوير المواقع الإلكترونية' },
  id_website_desc: { en: 'Professional websites that drive conversions and user engagement', ar: 'مواقع احترافية تحفز التحويلات والمشاركة' },
  id_branding_title: { en: 'Branding Design & Development', ar: 'تصميم وتطوير العلامات التجارية' },
  id_branding_desc: { en: 'Complete brand identity development from concept to execution', ar: 'تطوير هوية العلامة التجارية الكاملة من المفهوم إلى التنفيذ' },
  id_software_title: { en: 'Software Design and Development', ar: 'تصميم وتطوير البرمجيات' },
  id_software_desc: { en: 'Custom software solutions tailored to your specific business needs', ar: 'حلول برامج مخصصة مصممة لاحتياجات عملك المحددة' },
  id_cloud_title: { en: 'Cloud Services', ar: 'خدمات السحابة' },
  id_cloud_desc: { en: 'Secure and scalable cloud infrastructure for your applications', ar: 'بنية تحتية سحابية آمنة وقابلة للتوسع لتطبيقاتك' },

  // Real Estate Marketing (8 services)
  re_appraisal_title: { en: 'Real Estate Appraisal', ar: 'التسويق العقاري' },
  re_appraisal_desc: { en: 'Professional property valuation and appraisal services', ar: 'خدمات تقييم وتقدير العقارات الاحترافية' },
  re_marketing_title: { en: 'Real Estate Marketing', ar: 'التطوير العقاري' },
  re_marketing_desc: { en: 'Comprehensive real estate marketing strategies and campaigns', ar: 'استراتيجيات وحملات تسويق العقارات الشاملة' },
  re_management_title: { en: 'Property Management and Sales', ar: 'إدارة الأملاك والمبيعات' },
  re_management_desc: { en: 'Professional property and sales management services', ar: 'خدمات إدارة الممتلكات والمبيعات الاحترافية' },
  re_photography_title: { en: 'Professional Photography & Representation', ar: 'تصوير المشاريع' },
  re_photography_desc: { en: 'High-quality photography and professional property representation', ar: 'تصوير عالي الجودة وتمثيل احترافي للعقارات' },
  re_campaign_title: { en: 'Advertising Campaign Management', ar: 'إدارة الحملات الإعلانية' },
  re_campaign_desc: { en: 'Strategic advertising campaigns to attract qualified buyers', ar: 'حملات إعلانية استراتيجية لجذب المشترين المؤهلين' },
  re_project_images_title: { en: 'Real Estate Project Image Creation', ar: 'تصميم صفحات الوصول' },
  re_project_images_desc: { en: 'Professional image creation and presentation for real estate projects', ar: 'إنشاء صور احترافية وعرض لمشاريع العقارات' },
  re_current_eval_title: { en: 'Current Image Evaluation & Enhancement', ar: 'تحسين الهوية الحالية للمشاريع العقارية' },
  re_current_eval_desc: { en: 'Evaluate and enhance current project images and branding', ar: 'تقييم وتحسين صور المشاريع الحالية والعلامات التجارية' },
  re_project_naming_title: { en: 'Real Estate Project Naming', ar: 'تسمية المشاريع العقارية' },
  re_project_naming_desc: { en: 'Strategic naming services for real estate projects', ar: 'خدمات التسمية الاستراتيجية لمشاريع العقارات' },

  // Service Features for Digital Marketing
  features_smm: { en: ['Community engagement', 'Content calendar', 'Social listening', 'Crisis management', 'Performance analytics'], ar: ['تفاعل المجتمع', 'تقويم المحتوى', 'الاستماع الاجتماعي', 'إدارة الأزمات', 'تحليل الأداء'] },
  features_digitalMarketing: { en: ['Market research', 'Strategy development', 'Campaign execution', 'Performance tracking', 'Continuous optimization'], ar: ['أبحاث السوق', 'تطوير الاستراتيجية', 'تنفيذ الحملة', 'تتبع الأداء', 'التحسين المستمر'] },
  features_visualProduction: { en: ['Video production', 'Photography', 'Graphics design', 'Animation', 'Post-production'], ar: ['إنتاج الفيديو', 'التصوير الفوتوغرافي', 'تصميم الرسوميات', 'الرسوم المتحركة', 'المعالجة اللاحقة'] },
  features_influencer: { en: ['Influencer identification', 'Outreach & negotiation', 'Campaign management', 'Performance tracking', 'ROI reporting'], ar: ['تحديد المؤثرين', 'المراسلة والتفاوض', 'إدارة الحملة', 'تتبع الأداء', 'تقارير العائد على الاستثمار'] },
  features_creativeContent: { en: ['Content strategy', 'Copywriting', 'Visual design', 'Brand storytelling', 'Multi-format delivery'], ar: ['استراتيجية المحتوى', 'كتابة النصوص', 'تصميم مرئي', 'سرد قصة العلامة التجارية', 'التسليم متعدد الصيغ'] },
  features_exhibitions: { en: ['Event planning', 'Booth design', 'Promotion strategy', 'Vendor coordination', 'Analytics & reporting'], ar: ['تخطيط الحدث', 'تصميم البراج', 'استراتيجية الترويج', 'تنسيق الموردين', 'التحليلات والتقارير'] },
  features_advertising: { en: ['Ad strategy', 'Creative design', 'Media buying', 'Campaign optimization', 'Performance reporting'], ar: ['استراتيجية الإعلان', 'تصميم إبداعي', 'شراء الوسائط', 'تحسين الحملة', 'تقارير الأداء'] },
  features_consultation: { en: ['Market analysis', 'Competitor research', 'Strategy development', 'Implementation guidance', 'Ongoing support'], ar: ['تحليل السوق', 'أبحاث المنافسين', 'تطوير الاستراتيجية', 'إرشادات التنفيذ', 'الدعم المستمر'] },
  features_seoSro: { en: ['Keyword research', 'On-page optimization', 'Link building', 'Technical SEO', 'Analytics & tracking'], ar: ['البحث عن الكلمات المفتاحية', 'تحسين الصفحة', 'بناء الروابط', 'تحسين الأداء التقني', 'التحليلات والتتبع'] },

  // Service Features for Innovation & Development
  features_appsDesign: { en: ['UI/UX design', 'iOS development', 'Android development', 'Testing & QA', 'Deployment support'], ar: ['تصميم واجهة المستخدم', 'تطوير iOS', 'تطوير Android', 'الاختبار وضمان الجودة', 'دعم النشر'] },
  features_websiteDesign: { en: ['Responsive design', 'SEO optimization', 'Performance tuning', 'Security', 'Maintenance support'], ar: ['تصميم متجاوب', 'تحسين محركات البحث', 'ضبط الأداء', 'الأمان', 'دعم الصيانة'] },
  features_brandingDesign: { en: ['Logo design', 'Brand guidelines', 'Color palette', 'Typography', 'Visual identity system'], ar: ['تصميم الشعار', 'إرشادات العلامة التجارية', 'لوحة الألوان', 'الطباعة', 'نظام الهوية البصرية'] },
  features_softwareDesign: { en: ['Custom development', 'Architecture design', 'Database design', 'API integration', 'Maintenance & support'], ar: ['التطوير المخصص', 'تصميم البنية', 'تصميم قاعدة البيانات', 'دمج API', 'الصيانة والدعم'] },
  features_cloudServices: { en: ['Infrastructure setup', 'Deployment services', 'Scaling solutions', 'Security management', '24/7 monitoring'], ar: ['إعداد البنية التحتية', 'خدمات النشر', 'حلول التوسع', 'إدارة الأمان', 'المراقبة 24/7'] },

  // Service Features for Real Estate Marketing
  features_realEstateAppraisal: { en: ['Property valuation', 'Market analysis', 'Comparative study', 'Report generation', 'Legal compliance'], ar: ['تقييم الممتلكات', 'تحليل السوق', 'دراسة مقارنة', 'إنشاء التقارير', 'الامتثال القانوني'] },
  features_realEstateMarketing: { en: ['Market strategy', 'Buyer targeting', 'Digital campaigns', 'Lead generation', 'Conversion optimization'], ar: ['استراتيجية السوق', 'استهداف المشترين', 'الحملات الرقمية', 'توليد العملاء المحتملين', 'تحسين التحويل'] },
  features_realEstateManagement: { en: ['Property management', 'Tenant relations', 'Maintenance coordination', 'Financial reporting', 'Legal support'], ar: ['إدارة الممتلكات', 'علاقات المستأجرين', 'تنسيق الصيانة', 'التقارير المالية', 'الدعم القانوني'] },
  features_realEstatePhotography: { en: ['Professional photography', 'Drone imagery', 'Virtual staging', 'Post-processing', 'Digital delivery'], ar: ['التصوير الفوتوغرافي الاحترافي', 'صور الطائرات بدون طيار', 'الترتيب الافتراضي', 'المعالجة اللاحقة', 'التسليم الرقمي'] },
  features_advertisingCampaign: { en: ['Campaign planning', 'Multi-channel strategy', 'Creative assets', 'Budget management', 'Performance tracking'], ar: ['تخطيط الحملة', 'استراتيجية متعددة القنوات', 'الأصول الإبداعية', 'إدارة الميزانية', 'تتبع الأداء'] },
  features_projectImages: { en: ['Professional shots', 'Architectural focus', 'Lifestyle imagery', 'Virtual tours', 'Editing & enhancement'], ar: ['لقطات احترافية', 'التركيز المعماري', 'صور نمط الحياة', 'جولات افتراضية', 'التحرير والتحسين'] },
  features_currentImageEval: { en: ['Image analysis', 'Brand evaluation', 'Improvement recommendations', 'Rebranding strategy', 'Implementation support'], ar: ['تحليل الصور', 'تقييم العلامة التجارية', 'توصيات التحسين', 'استراتيجية إعادة الوضع', 'دعم التنفيذ'] },
  features_projectNaming: { en: ['Name research', 'Market testing', 'Legal verification', 'Cultural sensitivity', 'Branding guidelines'], ar: ['بحث الاسم', 'اختبار السوق', 'التحقق القانوني', 'الحساسية الثقافية', 'إرشادات العلامة التجارية'] },

  // Blog Page Translations
  blog: { en: 'Blog', ar: 'المدونة' },
  blogTitle: { en: 'Blog', ar: 'المدونة' },
  blogSubtitle: { en: 'Get the latest articles on digital marketing, innovation, and business growth', ar: 'احصل على آخر الأخبار والمقالات عن التسويق الرقمي والابتكار' },
  blogCategory: { en: 'Category', ar: 'الفئة' },
  allBlogPosts: { en: 'All', ar: 'الكل' },
  blogReadMore: { en: 'Read More', ar: 'اقرأ المزيد' },
  blogAuthor: { en: 'Author', ar: 'الكاتب' },
  blogDate: { en: 'Date', ar: 'التاريخ' },
  blogReadTime: { en: 'min read', ar: 'دقيقة قراءة' },
  blogNoPosts: { en: 'No blog posts yet', ar: 'لا توجد مقالات حتى الآن' },
  blogCheckBack: { en: 'Check back soon for new content', ar: 'تحقق مرة أخرى قريباً للحصول على محتوى جديد' },
  blogAutoPosting: { en: '✨ 2 new articles are automatically posted daily', ar: '✨ يتم نشر مقالين جديدين تلقائياً كل يوم' },
  blogDigitalMarketing: { en: 'Digital Marketing', ar: 'التسويق الرقمي' },
  blogAITechnology: { en: 'AI & Technology', ar: 'الذكاء الاصطناعي والتكنولوجيا' },
  blogInnovation: { en: 'Innovation', ar: 'الابتكار' },
  blogBusiness: { en: 'Business', ar: 'الأعمال' },
  blogStrategy: { en: 'Strategy', ar: 'الاستراتيجية' },
  blogTipsTricks: { en: 'Tips & Tricks', ar: 'نصائح وحيل' },
  blogLoading: { en: 'Loading articles...', ar: 'جاري تحميل المقالات...' },
  blogError: { en: 'Failed to load blog posts', ar: 'فشل في تحميل مقالات المدونة' },
  resources: { en: 'Resources', ar: 'الموارد' },
  portfolio: { en: 'Portfolio', ar: 'المحفظة' },
};

const defaultLang: Lang = 'ar';

// List of Arabic-speaking countries (country codes)
const arabicCountries = [
  'SA', // Saudi Arabia
  'AE', // United Arab Emirates
  'EG', // Egypt
  'JO', // Jordan
  'LB', // Lebanon
  'SY', // Syria
  'IQ', // Iraq
  'KW', // Kuwait
  'QA', // Qatar
  'BH', // Bahrain
  'OM', // Oman
  'YE', // Yemen
  'MA', // Morocco
  'DZ', // Algeria
  'TN', // Tunisia
  'LY', // Libya
  'SD', // Sudan
  'PS', // Palestine
  'TR', // Turkey (has Arabic speakers)
  'IR', // Iran (has Arabic speakers)
];

// Function to detect user's country from IP geolocation
const detectCountryFromIP = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://geojs.io/geolocation/geojs', { 
      method: 'GET',
      headers: { Accept: 'application/json' }
    });
    const data = await response.json();
    return data.country_code || null;
  } catch (error) {
    console.log('Geolocation detection failed, using browser language instead');
    return null;
  }
};

const createTranslationFunction = (lang: Lang) => {
  return (key: string): string => {
    const value = translations[key]?.[lang];
    if (Array.isArray(value)) {
      return '';
    }
    return typeof value === 'string' ? value : key;
  };
};

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}>({
  lang: defaultLang,
  setLang: () => {},
  t: createTranslationFunction(defaultLang),
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(defaultLang);

  useEffect(() => {
    // Check for stored language preference first (user manual selection takes priority)
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('site_lang') : null;
    if (stored === 'ar' || stored === 'en') {
      setLangState(stored as Lang);
      applyLanguageToDOM(stored as Lang);
      return;
    }

    // If no stored preference, detect language from geolocation or browser
    const detectAndSetLanguage = async () => {
      let detectedLang: Lang = defaultLang;

      if (typeof window !== 'undefined') {
        // Try geolocation first
        const countryCode = await detectCountryFromIP();
        if (countryCode && arabicCountries.includes(countryCode)) {
          detectedLang = 'ar';
        } else {
          // Fall back to browser language detection
          const browserLang = navigator.language || navigator.languages?.[0] || 'en';
          detectedLang = browserLang.startsWith('ar') ? 'ar' : 'en';
        }
      }

      setLangState(detectedLang);
      applyLanguageToDOM(detectedLang);
    };

    detectAndSetLanguage();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('site_lang', lang);
      applyLanguageToDOM(lang);
    }
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  const t = createTranslationFunction(lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Helper function to apply language to DOM
const applyLanguageToDOM = (lang: Lang) => {
  if (typeof window !== 'undefined') {
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (lang === 'ar') {
      document.documentElement.classList.add('lang-ar');
    } else {
      document.documentElement.classList.remove('lang-ar');
    }
  }
};

export const useLanguage = () => useContext(LanguageContext);
