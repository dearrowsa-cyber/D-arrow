// ============================================================
// D-Arrow Real Estate Demo · Single source of truth for data
// Extended with Saudi Real Estate General Authority (FAL) Compliance,
// Investment ROI Metrics, and Interactive 360 Tour Scenes.
// ============================================================

export type PropertyType = 'villa' | 'apartment' | 'townhouse' | 'land' | 'office';
export type ListingType = 'sale' | 'rent';

export interface DemoAgent {
  id: string;
  name: string;
  nameEn?: string | null;
  jobTitle: string;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  rating: number;
  dealsClosed: number;
  falLicenseNumber?: string;
}

export interface TourScene {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
}

export interface DemoProperty {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: PropertyType;
  listingType: ListingType;
  price: number;
  currency: string;
  city: string;
  district: string;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  features: string[];
  images: string[];
  latitude?: number | null;
  longitude?: number | null;
  featured: boolean;
  status: 'available' | 'sold' | 'reserved';
  agentId?: string | null;

  // Saudi Real Estate Compliance & FAL License Fields
  falLicenseNumber: string;
  adLicenseNumber: string;
  deedNumber?: string;
  ejarCompliant?: boolean;
  wafiCompliant?: boolean;
  sakaniSupported?: boolean;
  buildingCodeCertified?: boolean;

  // Investment & ROI Metrics
  expectedAnnualRent?: number;
  estimatedROI?: number; // percentage e.g. 7.8%
  pricePerSqm?: number;

  // 360 Tour Scenes
  tourScenes?: TourScene[];
}

const img = (id: string) => `https://images.unsplash.com/${id}?q=80&w=1400&auto=format&fit=crop`;

export const DEMO_AGENTS: DemoAgent[] = [
  {
    id: 'agent-faisal',
    name: 'فهد القحطاني',
    nameEn: 'Fahad Al-Qahtani',
    jobTitle: 'مدير المبيعات العقارية — وسيط معتمد',
    phone: '+966551234567',
    whatsapp: '966551234567',
    email: 'fahad@d-arrow-realestate.sa',
    avatarUrl: img('photo-1560250097-0b93528c311a'),
    rating: 4.9,
    dealsClosed: 214,
    falLicenseNumber: 'FAL-1200028491',
  },
  {
    id: 'agent-nora',
    name: 'نورة العتيبي',
    nameEn: 'Noura Al-Otaibi',
    jobTitle: 'مستشارة عقارية واستثمارية معتمدة',
    phone: '+966556789123',
    whatsapp: '966556789123',
    email: 'noura@d-arrow-realestate.sa',
    avatarUrl: img('photo-1573497019940-1c28c88b4f3e'),
    rating: 4.8,
    dealsClosed: 167,
    falLicenseNumber: 'FAL-1200039120',
  },
];

export const DEMO_PROPERTIES: DemoProperty[] = [
  {
    id: 're-villa-hittin',
    slug: 'villa-hittin-riyadh',
    title: 'فيلا مودرن فاخرة بحي حطين — تشطيب فندقي خاص',
    description:
      'فيلا عصرية بتشطيب سوبر لوكس على مساحة 600 متر في أرقى أحياء شمال الرياض. تتضمن مجلس رجال منفصل، مسبح خاص، مصعد داخلي بانورامي، ومطبخ إيطالي مجهز بالكامل. قريبة من مركز الملك عبدالله المالي والواجهة البحرية والمدارس العالمية. صك إلكتروني حر جاهز للإفراغ الفوري وكود البناء السعودي.',
    type: 'villa',
    listingType: 'sale',
    price: 4850000,
    currency: 'SAR',
    city: 'الرياض',
    district: 'حي حطين',
    bedrooms: 6,
    bathrooms: 7,
    areaSqm: 600,
    pricePerSqm: 8083,
    features: ['مسبح خاص أوفرفلو', 'مصعد إيطالي بانورامي', 'مجلس رجال فخم', 'مطبخ مجهز بالكامل', 'تكييف مركزي VRV', 'أنظمة سمارت هوم ذكية', 'غرفة سائق وخادمة'],
    images: [
      img('photo-1600596542815-ffad4c1539a9'),
      img('photo-1600585154340-be6161a56a0c'),
      img('photo-1600607687939-ce8a6c25118c'),
      img('photo-1600566753086-00f18fb6b3ea'),
    ],
    latitude: 24.7743,
    longitude: 46.6182,
    featured: true,
    status: 'available',
    agentId: 'agent-faisal',

    // Saudi Compliance
    falLicenseNumber: '1200028491',
    adLicenseNumber: '7200019482',
    deedNumber: '310129481902',
    ejarCompliant: true,
    sakaniSupported: true,
    buildingCodeCertified: true,

    // ROI
    expectedAnnualRent: 360000,
    estimatedROI: 7.4,

    // 360 Tour Scenes
    tourScenes: [
      { id: 'ext', name: 'الواجهة الخارجية والمدخل', imageUrl: img('photo-1600596542815-ffad4c1539a9'), description: 'واجهة عصرية بحجر ترافنتينو وإضاءة ليد مخفية' },
      { id: 'living', name: 'الصالة الرئيسية والمجالس', imageUrl: img('photo-1600585154340-be6161a56a0c'), description: 'صالة مفتوحة بأسقف مرتفعة 4.2 متر وإطلالة على المسبح' },
      { id: 'master', name: 'جناح الماستر الرئيسي', imageUrl: img('photo-1600566753086-00f18fb6b3ea'), description: 'غرفة نوم ماستر مع غرفة ملابس واسعة وجاكوزي' },
      { id: 'pool', name: 'المسبح والحديقة الخلفية', imageUrl: img('photo-1600607687939-ce8a6c25118c'), description: 'مسبح خاص مع جلسة خارجية شلال ونظام تدفئة' }
    ]
  },
  {
    id: 're-apart-alolaya',
    slug: 'apartment-alolaya-riyadh',
    title: 'شقة فندقية فاخرة بإطلالة بانورامية — العليا',
    description:
      'شقة مفروشة بالكامل بأرقى الماركات العالمية في برج سكني حديث بطريق الملك فهد. إطلالة بانورامية على برج المملكة، صالات رياضية، مسابح، مواقف خاصة، وخدمات أمن واستقبال على مدار 24 ساعة. فرصة استثمارية بعائد سنوي مضمون عبر منصات التأجير القصير والطويل.',
    type: 'apartment',
    listingType: 'sale',
    price: 1450000,
    currency: 'SAR',
    city: 'الرياض',
    district: 'العليا',
    bedrooms: 3,
    bathrooms: 4,
    areaSqm: 210,
    pricePerSqm: 6905,
    features: ['مفروشة بالكامل تصميم إيطالي', 'إطلالة برج المملكة', 'نادي صحي وسبا', 'أمن واستقبال 24/7', 'موقف قبو خاص', 'عائد استثماري مرتفع'],
    images: [
      img('photo-1545324418-cc1a3fa10c00'),
      img('photo-1502672260266-1c1ef2d93688'),
      img('photo-1560448204-e02f11c3d0e2'),
      img('photo-1522708323590-d24dbb6b0267'),
    ],
    latitude: 24.7136,
    longitude: 46.6753,
    featured: true,
    status: 'available',
    agentId: 'agent-nora',

    // Saudi Compliance
    falLicenseNumber: '1200039120',
    adLicenseNumber: '7200024810',
    deedNumber: '310188491204',
    ejarCompliant: true,
    sakaniSupported: true,
    buildingCodeCertified: true,

    // ROI
    expectedAnnualRent: 130000,
    estimatedROI: 8.9,

    // 360 Tour Scenes
    tourScenes: [
      { id: 'living', name: 'الصالة البانورامية', imageUrl: img('photo-1545324418-cc1a3fa10c00'), description: 'واجهات زجاجية ممتدة بإطلالة كاملة على الرياض' },
      { id: 'bed', name: 'غرفة النوم الفندقية', imageUrl: img('photo-1502672260266-1c1ef2d93688'), description: 'إضاءة طبيعية وتصميم فندقي 5 نجوم' },
      { id: 'kitchen', name: 'المطبخ المفتوح', imageUrl: img('photo-1560448204-e02f11c3d0e2'), description: 'مطبخ كونتيننتال بأجهزة بلت-إن حديثة' }
    ]
  },
  {
    id: 're-town-yasmin',
    slug: 'townhouse-alyasmin-riyadh',
    title: 'تاون هاوس عصري مع روف خاص — حي الياسمين',
    description:
      'تاون هاوس بتصميم مودرن ومدخل مستقل في حي الياسمين المتميز شمال الرياض. يحتوي على روف وجلسة خارجية على السطح مجهزة للشواء، مصعد راكب، وموقفين داخليين. معتمد بالكامل لتمويل سكني وجميع البنوك السعودية.',
    type: 'townhouse',
    listingType: 'sale',
    price: 2650000,
    currency: 'SAR',
    city: 'الرياض',
    district: 'الياسمين',
    bedrooms: 4,
    bathrooms: 5,
    areaSqm: 380,
    pricePerSqm: 6974,
    features: ['روف وجلسة شواء خاصة', 'مدخل مستقل وحوش', 'مصعد راكب بالضمان', 'تكييف اسبليت راكب', 'ضمانات إنشائية 10 سنوات', 'موقع هادئ قريب من الخدمات'],
    images: [
      img('photo-1600585154526-990dced4db0d'),
      img('photo-1600573472591-ee6b68d14c68'),
      img('photo-1600566752355-35792bedcfea'),
    ],
    latitude: 24.8124,
    longitude: 46.6432,
    featured: false,
    status: 'available',
    agentId: 'agent-faisal',

    // Saudi Compliance
    falLicenseNumber: '1200028491',
    adLicenseNumber: '7200031958',
    deedNumber: '310245819033',
    ejarCompliant: true,
    sakaniSupported: true,
    buildingCodeCertified: true,

    // ROI
    expectedAnnualRent: 190000,
    estimatedROI: 7.2,

    // 360 Tour Scenes
    tourScenes: [
      { id: 'roof', name: 'الروف والجلسة الخارجية', imageUrl: img('photo-1600585154526-990dced4db0d'), description: 'جلسة سكايلوف مجهزة بإطلالة واسعة' },
      { id: 'living', name: 'الصالة العائلية', imageUrl: img('photo-1600573472591-ee6b68d14c68'), description: 'تصميم أوروبي بتوزيع مساحات ممتاز' }
    ]
  },
  {
    id: 're-villa-alshate',
    slug: 'villa-alshatee-jeddah',
    title: 'قصر فيلا شاطئي فاخر مع مرسى — الشاطئ جدة',
    description:
      'تحفة معمارية استثنائية في حي الشاطئ على كورنيش جدة مباشرة. مسبح لا متناهي يطل على البحر الأحمر، نادي رياضي، قاعة سينما خاصة، مصعد زجاجي، وتراسات واسعة. إطلالة بحرية لا تُحجب على مدار الساعة.',
    type: 'villa',
    listingType: 'sale',
    price: 12800000,
    currency: 'SAR',
    city: 'جدة',
    district: 'حي الشاطئ',
    bedrooms: 7,
    bathrooms: 9,
    areaSqm: 1100,
    pricePerSqm: 11636,
    features: ['مسبح إنفينيتي بحري', 'سينما منزلية 4K', 'سبا وجاكوزي', 'إطلالة مباشرة على البحر', 'مصعد زجاجي', 'حدائق استوائية', 'نظام أمني متكامل'],
    images: [
      img('photo-1613977257363-707ba9348227'),
      img('photo-1613490493576-7fde63acd811'),
      img('photo-1600607687920-4e2a09cf159d'),
      img('photo-1600566753190-17f0baa2a6c3'),
    ],
    latitude: 21.5833,
    longitude: 39.1058,
    featured: true,
    status: 'available',
    agentId: 'agent-nora',

    // Saudi Compliance
    falLicenseNumber: '1200039120',
    adLicenseNumber: '7200049103',
    deedNumber: '320091849102',
    ejarCompliant: true,
    sakaniSupported: false,
    buildingCodeCertified: true,

    // ROI
    expectedAnnualRent: 850000,
    estimatedROI: 6.6,

    // 360 Tour Scenes
    tourScenes: [
      { id: 'ext', name: 'الواجهة البحرية والمسبح', imageUrl: img('photo-1613977257363-707ba9348227'), description: 'إطلالة مباشرة على مياه البحر الأحمر' },
      { id: 'cinema', name: 'قاعة المعيشة والسينما', imageUrl: img('photo-1613490493576-7fde63acd811'), description: 'شاشات وأنظمة صوت محيطية فاخرة' },
      { id: 'suite', name: 'الجناح الملكي', imageUrl: img('photo-1600607687920-4e2a09cf159d'), description: 'جناح نوم رئيسي بلكونة واسعة تطل على الغروب' }
    ]
  },
  {
    id: 're-office-khobar',
    slug: 'commercial-office-khobar',
    title: 'مكتب تجاري بريميوم في برج أعمال — الخبر',
    description:
      'مساحة مكتبية ذكية مصنفة Class-A على طريق الملك فيصل بالخبر. إطلالة بحرية خلابة، قاعات اجتماعات مجهزة، شبكة ألياف بصرية، وخدمات صيانة وإدارة مرافق متكاملة للمقرات الإقليمية والشركات الكبرى.',
    type: 'office',
    listingType: 'rent',
    price: 185000,
    currency: 'SAR/سنة',
    city: 'الخبر',
    district: 'الكورنيش',
    bedrooms: 0,
    bathrooms: 3,
    areaSqm: 280,
    pricePerSqm: 660,
    features: ['مبنى مكتبي Class-A', 'ألياف بصرية وإنترنت فائق', 'قاعات اجتماعات VIP', 'مواقف مخصصة', 'أمن 24/7 ودخول ذكي', 'موثق عبر إيجار'],
    images: [
      img('photo-1497366216548-37526070297c'),
      img('photo-1497366811353-6870744d04b2'),
      img('photo-1497215728101-856f4ea42174'),
    ],
    latitude: 26.2886,
    longitude: 50.2084,
    featured: false,
    status: 'available',
    agentId: 'agent-faisal',

    // Saudi Compliance
    falLicenseNumber: '1200028491',
    adLicenseNumber: '7200051940',
    deedNumber: '330194819055',
    ejarCompliant: true,
    sakaniSupported: false,
    buildingCodeCertified: true,

    // ROI
    expectedAnnualRent: 185000,
    estimatedROI: 9.2,

    // 360 Tour Scenes
    tourScenes: [
      { id: 'office', name: 'المساحة المكتبية الرئيسية', imageUrl: img('photo-1497366216548-37526070297c'), description: 'مساحات مفتوحة قابلة للتقسيم بسهولة' },
      { id: 'board', name: 'غرفة الاجتماعات التنفيذية', imageUrl: img('photo-1497366811353-6870744d04b2'), description: 'مجهزة بأحدث شاشات الفيديو كونفرنس' }
    ]
  }
];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  villa: 'فيلا',
  apartment: 'شقة',
  townhouse: 'تاون هاوس',
  land: 'أرض',
  office: 'مكتب تجاري',
};

export const STATUS_LABELS: Record<DemoProperty['status'], { label: string; tone: 'green' | 'red' | 'amber' }> = {
  available: { label: 'متاح للطلب', tone: 'green' },
  reserved: { label: 'محجوز مؤقتاً', tone: 'amber' },
  sold: { label: 'تمت الصفقة', tone: 'red' },
};

export type ReThemePreset = 'emerald-gold' | 'sapphire-silver' | 'noir-platinum';

export const RE_THEME_LABELS: Record<ReThemePreset, string> = {
  'emerald-gold': 'الزمردي والذهبي الفاخر (Emerald Gold)',
  'sapphire-silver': 'الياقوتي والفضي الملكي (Sapphire Silver)',
  'noir-platinum': 'الأسود والبلاتينيوم النبيل (Noir Platinum)',
};

export interface DemoInquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'viewing_scheduled' | 'closed';
  createdAt: string;
}

export const DEMO_INQUIRIES: DemoInquiry[] = [
  {
    id: 'inq-1',
    propertyId: 're-villa-hittin',
    propertyTitle: 'فيلا مودرن فاخرة بحي حطين',
    name: 'سلطان الدوسري',
    phone: '0501234567',
    email: 'sultan@example.com',
    message: 'مهتم بشراء الفيلا نرجو التواصل لتحديد موعد معاينة',
    status: 'new',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inq-2',
    propertyId: 're-apart-alolaya',
    propertyTitle: 'شقة فندقية فاخرة بإطلالة بانورامية',
    name: 'عبدالله الشهري',
    phone: '0559876543',
    email: 'a.shehri@example.com',
    message: 'استفسار عن خطة الدفع وعائد الإيجار السنوي',
    status: 'contacted',
    createdAt: new Date().toISOString(),
  },
];

export function formatPrice(price: number, currency: string = 'SAR'): string {
  return `${price.toLocaleString('ar-SA')} ${currency === 'SAR' ? 'ر.س' : currency}`;
}
