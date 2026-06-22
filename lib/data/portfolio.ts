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
    id: 'zarabie-social',
    slug: 'zarabie-social-media',
    logoUrl: '/portfolio/zarabie-1.png',
    title: { en: 'Social Media Designs for Zarabie Brand', ar: 'تصميمات السوشيال ميديا لبراند زرابي للأثاث' },
    subtitle: { en: 'Social Media Marketing & Design', ar: 'تسويق وتصميم السوشيال ميديا' },
    description: {
      en: 'A creative social media campaign and visual designs for Zarabie Furniture. The designs highlight exceptional discounts, cashback offers, and premium furniture sets with an elegant layout that drives sales and engagement.',
      ar: 'حملة سوشيال ميديا وتصميمات بصرية إبداعية لبراند زرابي للأثاث. تبرز التصميمات التخفيضات الاستثنائية وعروض الكاش باك وأطقم الأثاث الفاخرة بتنسيق أنيق يساهم في زيادة المبيعات والتفاعل.'
    },
    imageUrl: '/portfolio/zarabie-1.png',
    tags: {
      en: 'Social Media Design, Marketing Campaign, Furniture, Graphic Design',
      ar: 'تصميم سوشيال ميديا, حملة تسويقية, أثاث, تصميم جرافيك'
    } as any,
    category: ['Marketing', 'Branding'],
    challenge: {
      en: 'Designing promotional posts that clearly communicate significant discounts and offers (like 15% cashback) while maintaining the luxurious and elegant feel of the furniture brand.',
      ar: 'تصميم منشورات ترويجية تنقل بوضوح التخفيضات والعروض الكبيرة (مثل 15% كاش باك) مع الحفاظ على الطابع الفاخر والأنيق لعلامة الأثاث.'
    },
    solution: {
      en: 'We created a cohesive set of social media graphics using earthy tones and elegant typography. The designs seamlessly integrate product imagery with clear pricing, promotional badges (Tamara, Tabby), and strong call-to-actions like QR codes.',
      ar: 'قمنا بإنشاء مجموعة متماسكة من تصميمات السوشيال ميديا باستخدام ألوان ترابية وخطوط أنيقة. تدمج التصميمات بسلاسة صور المنتجات مع أسعار واضحة، وشارات ترويجية (تمارا، تابي)، ودعوات قوية لاتخاذ إجراء مثل رموز الاستجابة السريعة (QR codes).'
    },
    results: [
      { en: 'Increased social media engagement', ar: 'زيادة ملحوظة في التفاعل على وسائل التواصل الاجتماعي' },
      { en: 'Higher conversion rates on promotional offers', ar: 'ارتفاع معدلات التحويل والمبيعات للعروض الترويجية' },
      { en: 'Stronger brand aesthetic online', ar: 'تعزيز المظهر الجمالي والاحترافي للعلامة التجارية عبر الإنترنت' }
    ],
    gallery: ['/portfolio/zarabie-1.png', '/portfolio/zarabie-2.png', '/portfolio/zarabie-3.png']
  },
  {
    id: 'weber-burger',
    slug: 'weber-burger',
    logoUrl: '/portfolio/weber-1.png',
    title: { en: 'Design and Development of Weber Burger Restaurant Website', ar: 'تصميم وتطوير موقع مطعم ويبر برجر الإلكتروني' },
    subtitle: { en: 'Restaurant Website & Digital Menu', ar: 'موقع مطعم وقائمة طعام رقمية' },
    description: {
      en: 'A vibrant and appetizing website for Weber Burger restaurant in Al Khobar, featuring a digital menu with online ordering, location info, and delivery integration with major platforms.',
      ar: 'موقع إلكتروني جذاب ومشهّي لمطعم ويبر برجر في الخبر، يتضمن قائمة طعام رقمية مع إمكانية الطلب أونلاين، ومعلومات الموقع، وربط التوصيل مع التطبيقات الرئيسية.'
    },
    imageUrl: '/portfolio/weber-1.png',
    tags: {
      en: 'Restaurant, Web Design, Digital Menu, F&B',
      ar: 'مطاعم, تصميم ويب, قائمة رقمية, أغذية ومشروبات'
    } as any,
    category: ['Web Design', 'Branding'],
    challenge: {
      en: 'Creating a website that captures the bold and energetic brand identity of Weber Burger while providing a seamless digital menu and ordering experience for customers.',
      ar: 'إنشاء موقع يعكس الهوية الجريئة والحيوية لعلامة ويبر برجر التجارية، مع توفير تجربة قائمة طعام رقمية سلسة وسهلة الطلب للعملاء.'
    },
    solution: {
      en: 'We built a bold website using the brand\'s signature blue and yellow palette with playful illustrations. The digital menu showcases products with mouth-watering photography, pricing, and direct add-to-cart functionality.',
      ar: 'قمنا ببناء موقع جريء باستخدام ألوان العلامة التجارية المميزة (الأزرق والأصفر) مع رسومات توضيحية مرحة. القائمة الرقمية تعرض المنتجات بصور احترافية شهية مع الأسعار وإمكانية الإضافة للسلة مباشرة.'
    },
    results: [
      { en: 'Engaging digital presence reflecting brand personality', ar: 'تواجد رقمي جذاب يعكس شخصية العلامة التجارية' },
      { en: 'Streamlined online ordering experience', ar: 'تجربة طلب أونلاين مبسطة وسلسة' },
      { en: 'Integration with delivery apps (Jahez, HungerStation, The Chefz)', ar: 'ربط مع تطبيقات التوصيل (جاهز، هنقرستيشن، ذا شيفز)' }
    ],
    gallery: ['/portfolio/weber-1.png', '/portfolio/weber-2.png', '/portfolio/weber-3.png']
  },
  {
    id: 'fatima-lifecoach',
    slug: 'fatima-life-coach',
    logoUrl: '/portfolio/fatima-1.png',
    title: { en: 'Design and Development of Fatima Life Coach Website', ar: 'تصميم وتطوير موقع فاطمة لايف كوتش للاستشارات والتدريب' },
    subtitle: { en: 'Personal Branding & Coaching Platform', ar: 'منصة استشارات وتدريب شخصي' },
    description: {
      en: 'A personal branding website and coaching platform for Fatima, offering online courses, one-on-one session bookings, and personal development resources in an elegant and feminine design.',
      ar: 'موقع شخصي ومنصة تدريب لفاطمة لايف كوتش، يقدم دورات تدريبية عبر الإنترنت، وحجز جلسات استشارية فردية، وموارد لتطوير الذات بتصميم أنيق وأنثوي.'
    },
    imageUrl: '/portfolio/fatima-1.png',
    tags: {
      en: 'Personal Branding, Coaching, E-Learning, Web Design',
      ar: 'علامة تجارية شخصية, كوتشينج, تعليم إلكتروني, تصميم ويب'
    } as any,
    category: ['Web Design', 'Branding'],
    challenge: {
      en: 'Establishing a strong digital presence that conveys trust, empowerment, and professionalism, while integrating seamless booking and e-learning functionalities.',
      ar: 'بناء تواجد رقمي قوي يعبر عن الثقة والتمكين والاحترافية، مع دمج أنظمة سلسة لحجز الجلسات وعرض الدورات التدريبية (التعليم الإلكتروني).'
    },
    solution: {
      en: 'We created a visually stunning website using a soft lavender and gold color palette. We integrated an intuitive booking system and a structured online course catalog to streamline the user journey.',
      ar: 'قمنا بإنشاء موقع جذاب بصرياً باستخدام لوحة ألوان ناعمة من اللافندر والذهبي. كما قمنا بدمج نظام حجز بديهي وفهرس منظم للدورات التدريبية لتسهيل رحلة المستخدم.'
    },
    results: [
      { en: 'Enhanced personal brand image', ar: 'تعزيز صورة العلامة التجارية الشخصية والثقة الرقمية' },
      { en: 'Increased session bookings and course enrollments', ar: 'زيادة في حجوزات الجلسات والتسجيل في الدورات' },
      { en: 'Centralized platform for coaching services', ar: 'منصة مركزية متكاملة لتقديم خدمات الكوتشينج' }
    ],
    gallery: ['/portfolio/fatima-1.png', '/portfolio/fatima-2.png']
  },
  {
    id: 'oca-furniture',
    slug: 'oca-furniture-store',
    logoUrl: '/portfolio/oca-1.png',
    title: { en: 'E-commerce Design and Development for OCA Furniture Store', ar: 'تصميم وتطوير متجر OCA الإلكتروني للأثاث المنزلي والمكتبي' },
    subtitle: { en: 'Modern E-commerce Platform', ar: 'منصة تجارة إلكترونية حديثة' },
    description: {
      en: 'A comprehensive e-commerce platform for OCA Furniture, featuring a modern, user-friendly design, categorized product listings, and a seamless shopping experience for both home and office furniture.',
      ar: 'منصة تجارة إلكترونية متكاملة لمتجر OCA للأثاث، تتميز بتصميم عصري وسهل الاستخدام، وتصنيف منظم للمنتجات، لتقديم تجربة تسوق سلسة لأثاث المنزل والمكتب والخزائن.'
    },
    imageUrl: '/portfolio/oca-1.png',
    tags: {
      en: 'E-commerce, UI/UX Design, Web Development, Furniture',
      ar: 'تجارة إلكترونية, تصميم واجهة المستخدم, تطوير الويب, أثاث'
    } as any,
    category: ['Web Design', 'Marketing'],
    challenge: {
      en: 'The client needed an elegant and fast online store to showcase diverse furniture collections and safes, requiring intuitive navigation and categorization to handle a large inventory.',
      ar: 'احتاج العميل إلى متجر إلكتروني أنيق وسريع لعرض مجموعات متنوعة من الأثاث والخزائن، مما تطلب نظام تنقل وتصنيف بديهي للتعامل مع مخزون كبير وعرضه بشكل جذاب.'
    },
    solution: {
      en: 'We developed a visually appealing e-commerce site with soft color palettes that highlight the products. We implemented advanced filtering, clear product categorization, and highlighted core features like free delivery and customizable designs.',
      ar: 'قمنا بتطوير متجر إلكتروني جذاب بصرياً بألوان هادئة تبرز جمال المنتجات. طبقنا نظام فلترة متقدم، وتصنيف واضح للمنتجات، مع إبراز المميزات التنافسية مثل التوصيل المجاني والتصاميم القابلة للتعديل.'
    },
    results: [
      { en: 'Intuitive and modern shopping experience', ar: 'تجربة تسوق عصرية وبديهية تزيد من معدل البقاء في الموقع' },
      { en: 'Streamlined product discovery and checkout', ar: 'تبسيط عملية اكتشاف المنتجات وإتمام الشراء' },
      { en: 'Effective presentation of diverse product categories', ar: 'عرض فعّال وجذاب لمختلف فئات المنتجات' }
    ],
    gallery: ['/portfolio/oca-1.png', '/portfolio/oca-2.png', '/portfolio/oca-3.png']
  },
  {
    id: 'oca-branding',
    slug: 'oca-visual-identity',
    logoUrl: '/portfolio/oca-logo.png',
    title: { en: 'OCA Furniture Store Visual Identity Design', ar: 'تصميم الهوية البصرية لمتجر OCA للأثاث' },
    subtitle: { en: 'Branding & Logo Design', ar: 'تصميم الهوية والشعار' },
    description: {
      en: 'Complete visual identity design for OCA Furniture, including the logo, brand colors, typography, and visual guidelines. The design reflects the elegance and modernity of the furniture they sell.',
      ar: 'تصميم هوية بصرية متكاملة لمتجر OCA للأثاث، تشمل تصميم الشعار، الألوان، الخطوط، والأدلة البصرية. يعكس التصميم الأناقة والحداثة للأثاث الذي يقدمونه.'
    },
    imageUrl: '/portfolio/oca-logo.png',
    tags: {
      en: 'Branding, Logo Design, Visual Identity',
      ar: 'تصميم العلامة التجارية, تصميم الشعار, الهوية البصرية'
    } as any,
    category: ['Branding'],
    challenge: {
      en: 'Creating a memorable and modern brand identity that stands out in the competitive furniture market and accurately represents the company\'s high-quality products.',
      ar: 'إنشاء هوية بصرية لا تُنسى وحديثة تبرز في سوق الأثاث التنافسي وتمثل منتجات الشركة عالية الجودة بدقة.'
    },
    solution: {
      en: 'We designed a typographic logo that creatively integrates furniture elements into the letters, using a sophisticated color palette of orange and dark green.',
      ar: 'قمنا بتصميم شعار طباعي يدمج بشكل إبداعي عناصر الأثاث في الحروف (مثل الكرسي والطاولة في حروف OCA)، باستخدام لوحة ألوان راقية من البرتقالي والأخضر الغامق.'
    },
    results: [
      { en: 'Strong brand recognition', ar: 'تعرف قوي وسريع على العلامة التجارية' },
      { en: 'Cohesive visual language across all platforms', ar: 'لغة بصرية متماسكة عبر جميع المنصات' },
      { en: 'Increased trust and perceived value', ar: 'زيادة الثقة والقيمة المدركة للمنتجات' }
    ],
    gallery: ['/portfolio/oca-logo.png', '/portfolio/oca-logo.png', '/portfolio/oca-logo.png']
  },
  {
    id: 'mathwaa',
    slug: 'mathwaa-association',
    logoUrl: '/portfolio/mathwaa-1.png',
    title: { en: 'Design and Development of Mathwaa Association Platform', ar: 'تصميم وتطوير المنصة الرقمية لجمعية مثوى لإكرام الموتى' },
    subtitle: { en: 'Non-Profit Sector Digital Transformation', ar: 'التحول الرقمي للقطاع غير الربحي' },
    description: {
      en: 'A comprehensive digital platform for Mathwaa Association to facilitate donations, volunteering, and governance, featuring a modern UI reflecting their institutional values.',
      ar: 'منصة رقمية متكاملة لجمعية مثوى لتسهيل التبرعات، التطوع، وإبراز الحوكمة والإفصاح، مع واجهة مستخدم حديثة تعكس قيمها المؤسسية.'
    },
    imageUrl: '/portfolio/mathwaa-1.png',
    tags: {
      en: 'Non-Profit, Web Development, UI/UX Design, Donation Portal',
      ar: 'قطاع غير ربحي, تطوير الويب, تصميم واجهة المستخدم, بوابة تبرعات'
    } as any,
    category: ['Web Design', 'Branding'],
    challenge: {
      en: 'The association needed a modern, trustworthy digital presence to streamline donations, showcase partnerships, and clearly present their organizational structure and governance to the public.',
      ar: 'احتاجت الجمعية إلى تواجد رقمي حديث وموثوق لتسهيل التبرعات، إبراز الشراكات، وعرض هيكلها التنظيمي وحوكمتها بشفافية للجمهور.'
    },
    solution: {
      en: 'We designed a premium web experience using their brand colors (Green and Gold). We implemented dedicated sections for donations, memberships, volunteering, and a dynamic organizational structure view.',
      ar: 'قمنا بتصميم تجربة ويب متميزة باستخدام ألوان هويتهم (الأخضر والذهبي). قمنا بتنفيذ أقسام مخصصة للتبرعات، العضويات، التطوع، وعرض ديناميكي للهيكل التنظيمي.'
    },
    results: [
      { en: 'Enhanced digital trust and transparency', ar: 'تعزيز الثقة الرقمية والشفافية' },
      { en: 'Streamlined donation and membership processes', ar: 'تبسيط عمليات التبرع والاشتراك في العضوية' },
      { en: 'Clear representation of partnerships and governance', ar: 'عرض واضح ومميز للشراكات والهيكل التنظيمي' }
    ],
    gallery: ['/portfolio/mathwaa-1.png', '/portfolio/mathwaa-2.png', '/portfolio/mathwaa-3.png']
  },
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
