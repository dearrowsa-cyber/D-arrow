export type LocalizedString = {
  en: string;
  ar: string;
};

export type ProjectCategory = 'All' | 'Web Design' | 'Marketing' | 'Branding';

export interface PortfolioProject {
  id: string;
  slug: string;
  logoUrl: string | null;
  title: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  imageUrl: string;
  tags: LocalizedString;
  category: ProjectCategory[];
  challenge: LocalizedString;
  solution: LocalizedString;
  results: LocalizedString[];
  gallery: string[];
}

export const projects: PortfolioProject[] = [
  {
    id: 'pro1',
    slug: 'al-syahaal-arabia',
    logoUrl: '/pro1.png',
    title: { en: 'Design & Development of Al Syahaal Arabia Digital Magazine', ar: 'تصميم وتطوير مجلة السياحة العربية الرقمية' },
    subtitle: { en: 'Web Design & Content Strategy', ar: 'تصميم الويب واستراتيجية المحتوى' },
    description: {
      en: 'A digital magazine focused on tourism in the Arab world. We delivered a modern site with clear UX, curated content structure and SEO-friendly pages to attract organic visitors.',
      ar: 'مجلة رقمية تركز على السياحة في العالم العربي. قدمنا موقعًا حديثًا مع تجربة مستخدم واضحة وبنية محتوى مُنظمة وصفحات محسّنة لمحركات البحث.'
    },
    imageUrl: '/pro1.png',
    tags: {
      en: 'UI/UX, Web Design, Magazine/News Portal',
      ar: 'واجهة المستخدم, تصميم الويب, مدخل المجلة والأخبار'
    } as any, // using any because tags in original code was array, but let's keep it as array
    category: ['Web Design', 'Branding'],
    challenge: {
      en: 'The client needed a digital platform capable of handling high traffic while providing an intuitive reading experience for various types of tourism content across the Arab region.',
      ar: 'احتاج العميل إلى منصة رقمية قادرة على التعامل مع حركة المرور العالية مع توفير تجربة قراءة بديهية لأنواع مختلفة من المحتوى السياحي في جميع أنحاء المنطقة العربية.'
    },
    solution: {
      en: 'We designed a custom architecture optimized for content delivery. The UI was crafted to prioritize readability and engagement, incorporating modern design principles with a mobile-first approach.',
      ar: 'قمنا بتصميم بنية مخصصة ومُحسّنة لتوصيل المحتوى. تم تصميم واجهة المستخدم لإعطاء الأولوية لسهولة القراءة والتفاعل، مع دمج مبادئ التصميم الحديثة مع نهج يركز على الأجهزة المحمولة أولاً.'
    },
    results: [
      { en: 'Increased organic traffic by 150%', ar: 'زيادة حركة المرور العضوية بنسبة 150٪' },
      { en: 'Reduced bounce rate by 40%', ar: 'تقليل معدل الارتداد بنسبة 40٪' },
      { en: 'Improved page load speed to under 2 seconds', ar: 'تحسين سرعة تحميل الصفحة إلى أقل من ثانيتين' }
    ],
    gallery: ['/pro1.png', '/pro1.png', '/pro1.png'] // Using the same image as placeholder
  },
  {
    id: 'beedco',
    slug: 'beedco',
    logoUrl: '/beedco-logo.png',
    title: { en: 'Development of the Comprehensive Digital Platform for Beedco', ar: 'تطوير المنصة الرقمية الشاملة لمؤسسة بيدكو' },
    subtitle: { en: 'Enterprise Digital Platform', ar: 'منصة رقمية للمؤسسات' },
    description: {
      en: 'An enterprise-level platform for construction management. We implemented a scalable UI, integrated module flows, and clear dashboards for operations teams.',
      ar: 'منصة على مستوى المؤسسات لإدارة البناء. قمنا بتنفيذ واجهة قابلة للتوسع، وتكامل الوحدات، ولوحات تحكم واضحة لفرق التشغيل.'
    },
    imageUrl: '/beedco-logo.png',
    tags: {
      en: 'Construction & Contracting, Design & Engineering, Digital Services',
      ar: 'البناء والمقاولات, التصميم والهندسة, الخدمات الرقمية'
    } as any,
    category: ['Web Design', 'Marketing'],
    challenge: {
      en: 'Managing complex construction operations required a centralized digital system that could be easily adopted by field workers and management alike.',
      ar: 'تطلبت إدارة عمليات البناء المعقدة نظامًا رقميًا مركزيًا يمكن اعتماده بسهولة من قبل العاملين في الميدان والإدارة على حد سواء.'
    },
    solution: {
      en: 'We developed a comprehensive dashboard with role-based access, streamlining communication and reporting processes. The interface was simplified to reduce the learning curve.',
      ar: 'قمنا بتطوير لوحة تحكم شاملة مع وصول قائم على الأدوار، مما أدى إلى تبسيط عمليات الاتصال وإعداد التقارير. تم تبسيط الواجهة لتقليل منحنى التعلم.'
    },
    results: [
      { en: 'Streamlined daily reporting', ar: 'تبسيط إعداد التقارير اليومية' },
      { en: 'Increased team productivity by 35%', ar: 'زيادة إنتاجية الفريق بنسبة 35٪' },
      { en: 'Centralized document management', ar: 'إدارة مركزية للمستندات' }
    ],
    gallery: ['/beedco-logo.png', '/beedco-logo.png', '/beedco-logo.png']
  },
  {
    id: 'pro3',
    slug: 'new-age-maintenance-center',
    logoUrl: '/pro3.png',
    title: { en: 'Digital Marketing Campaign for Lead Generation for New Age', ar: 'إدارة وتطوير الحملات التسويقية لمركز صيانة العصر الجديد' },
    subtitle: { en: 'Social Campaigns & Leads', ar: 'حملات تواصل وتوليد عملاء' },
    description: {
      en: 'Targeted social campaigns, creative assets and lead funnels. Campaigns brought higher engagement and a predictable pipeline of leads.',
      ar: 'حملات تواصل مستهدفة وأصول إبداعية وقنوات لتوليد العملاء. حققت الحملات تفاعلًا أعلى وقنوات متوقعة للعملاء المحتملين.'
    },
    imageUrl: '/pro3.png',
    tags: {
      en: 'Social Media, Marketing, Lead Gen',
      ar: 'وسائل التواصل الاجتماعي, التسويق, توليد العملاء'
    } as any,
    category: ['Marketing', 'Branding'],
    challenge: {
      en: 'The maintenance center needed to stand out in a competitive local market and generate a consistent flow of qualified leads.',
      ar: 'احتاج مركز الصيانة إلى التميز في سوق محلي تنافسي وتوليد تدفق مستمر من العملاء المحتملين المؤهلين.'
    },
    solution: {
      en: 'We launched targeted ad campaigns highlighting their quick response times and expertise, supported by engaging visual content and clear calls to action.',
      ar: 'أطلقنا حملات إعلانية مستهدفة تسلط الضوء على أوقات الاستجابة السريعة وخبراتهم، مدعومة بمحتوى مرئي جذاب ودعوات واضحة لاتخاذ إجراء.'
    },
    results: [
      { en: 'Generated over 500 qualified leads in month one', ar: 'تم إنشاء أكثر من 500 عميل محتمل مؤهل في الشهر الأول' },
      { en: 'Reduced Cost Per Acquisition by 25%', ar: 'تخفيض تكلفة الاستحواذ بنسبة 25٪' },
      { en: 'Increased brand awareness locally', ar: 'زيادة الوعي بالعلامة التجارية محليًا' }
    ],
    gallery: ['/pro3.png', '/pro3.png', '/pro3.png']
  }
];

// Re-map tags to actual arrays to match original data format
projects.forEach(p => {
    if (typeof p.tags.en === 'string') {
        p.tags.en = (p.tags.en as unknown as string).split(', ');
        p.tags.ar = (p.tags.ar as unknown as string).split(', ');
    }
});
