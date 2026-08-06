'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Home,
  Building2,
  Search,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Heart,
  Star,
  Phone,
  MessageCircle,
  Calendar,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Award,
  Users,
  Clock,
  TrendingUp,
  Share2,
  Eye,
  Zap,
  Lock,
  Truck,
  Sparkles,
  DollarSign
} from 'lucide-react';

// ===== Types =====
interface Property {
  id: string;
  title: string;
  titleEn: string;
  type: 'villa' | 'apartment' | 'land' | 'commercial';
  purpose: 'sale' | 'rent';
  price: number;
  priceUnit: string;
  location: string;
  locationEn: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  image: string;
  gallery: string[];
  featured?: boolean;
  isNew?: boolean;
  furnished?: boolean;
  pool?: boolean;
  garage?: boolean;
  description: string;
  descriptionEn: string;
  amenities: string[];
  agent: {
    name: string;
    nameEn: string;
    role: string;
    phone: string;
    avatar: string;
    rating: number;
  };
}

// ===== Sample Saudi Real Estate Data =====
const PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'فيلا فاخرة بحمام سباحة خاص في الرياض',
    titleEn: 'Luxury Villa with Private Pool in Riyadh',
    type: 'villa',
    purpose: 'sale',
    price: 4500000,
    priceUnit: 'ر.س',
    location: 'حي الملقا، شمال الرياض',
    locationEn: 'Al Malqa, North Riyadh',
    city: 'الرياض',
    bedrooms: 5,
    bathrooms: 6,
    area: 650,
    areaUnit: 'م²',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=90'
    ],
    featured: true,
    isNew: true,
    furnished: true,
    pool: true,
    garage: true,
    description: 'فيلا سعودية فاخرة بمواصفات عالية الجودة، تصميم عصري مع مدخل خاص، صالة واسعة، مجلس منفصل، مطعم مجهز بالكامل، غرف نوم مع أدراج داخلية، حمام سباحة ملحق بمساحة خضراء، مواقف سيارات لـ 5 سيارات، مركز صيانة ومخزن.',
    descriptionEn: 'Luxurious Saudi villa with high-end finishes. Modern design with private entrance, spacious majlis, separate formal living room, fully-equipped gourmet kitchen, bedrooms with built-in wardrobes, private pool with landscaped garden, 5-car garage, maid room and storage.',
    amenities: ['مكيفات مركزية', 'إنترنت ألياف بصرية', 'أنظمة أمان وكاميرات', 'مصعد داخلي', 'ماء مياه مستقل', 'تدفئة أرضية'],
    agent: {
      name: 'خالد السبيعي',
      nameEn: 'Khalid Al-Subai',
      role: 'مسؤول مبيعات عقاري',
      phone: '0500000001',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=90',
      rating: 4.9
    }
  },
  {
    id: 'prop-2',
    title: 'شقه فاخرة مفروشة في برج جدة الساحلي',
    titleEn: 'Luxury Furnished Apartment in Jeddah Corniche',
    type: 'apartment',
    purpose: 'rent',
    price: 120000,
    priceUnit: 'ر.س / سنوياً',
    location: 'كورنيش جدة، حي الشاطئ',
    locationEn: 'Jeddah Corniche, Al Shatie District',
    city: 'جدة',
    bedrooms: 3,
    bathrooms: 3,
    area: 220,
    areaUnit: 'م²',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=90'
    ],
    featured: true,
    furnished: true,
    pool: true,
    description: 'شقه فاخرة بإطلالة بحرية بانورامية مباشرة على البحر الأحمر، تتكون من صالة استقبال رسمية، غرفة طعام، مجلس عائلي، مطبخ راقي، 3 غرف نوم رئيسية مع حمامات خاصة، شرفة واسعة مطلة على البحر، وصالة رياضية وسباحة مشتركة في البرج.',
    descriptionEn: 'Luxury apartment with panoramic direct sea view on the Red Sea. Formal reception, dining room, family lounge, high-end kitchen, 3 master bedrooms with en-suite bathrooms, wide sea-facing balcony, building features: shared gym & pool, 24/7 security, covered parking.',
    amenities: ['إطلالة بحرية كاملة', 'مسبح وصالة رياضية مشتركة', 'أمن وحراسة 24/7', 'مواقف مغطاة', 'أبواب ذكية', 'مصعد خاص'],
    agent: {
      name: 'سارة المطيري',
      nameEn: 'Sarah Al-Mutairi',
      role: 'مستشارة عقارية',
      phone: '0500000002',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=90',
      rating: 4.8
    }
  },
  {
    id: 'prop-3',
    title: 'أرض تجارية استثمارية طريق الملك فهد',
    titleEn: 'Commercial Land Investment on King Fahd Road',
    type: 'land',
    purpose: 'sale',
    price: 12000000,
    priceUnit: 'ر.س',
    location: 'طريق الملك فهد، الرياض',
    locationEn: 'King Fahd Road, Riyadh',
    city: 'الرياض',
    bedrooms: 0,
    bathrooms: 0,
    area: 2400,
    areaUnit: 'م²',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=90'
    ],
    isNew: true,
    description: 'قطعة أرض تجارية فاخرة في أحد أهم شوارع العاصمة، الواجهة التجارية الرئيسية، سهولة الوصول من الشوارع الفرعية، صالحة لبناء برج إداري أو تجاري أو سكني، موقع استثماري ممتاز قرب مراكز الأعمال والبنوك.',
    descriptionEn: 'Prime commercial land on one of Riyadh\'s most prestigious avenues. Direct frontage to King Fahd Road, easy access from side streets. Suitable for commercial tower, offices, or residential complex. Excellent investment near business centers and banks.',
    amenities: ['تصنيع تجاري/سكني', 'واجهة 80 متر طريق رئيسي', 'جميع المرافق متوفرة', 'رخصة بناء جاهزة', 'أرصدة إضافية'],
    agent: {
      name: 'فهد الزهراني',
      nameEn: 'Fahd Al-Zahrani',
      role: 'خبير استثمار عقاري',
      phone: '0500000003',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=90',
      rating: 5.0
    }
  },
  {
    id: 'prop-4',
    title: 'فيلا سكنية فاخرة في حي الروضة الدمام',
    titleEn: 'Luxury Residential Villa in Al Rawdah, Dammam',
    type: 'villa',
    purpose: 'sale',
    price: 2850000,
    priceUnit: 'ر.س',
    location: 'حي الروضة، الدمام',
    locationEn: 'Al Rawdah District, Dammam',
    city: 'الدمام',
    bedrooms: 4,
    bathrooms: 5,
    area: 480,
    areaUnit: 'م²',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=90'
    ],
    garage: true,
    furnished: true,
    description: 'فيلا سكنية فاخرة في منتصف حي الروضة بالدمام، 3 طوابق، مدخلين للرجال والنساء، مجلس، صالة واسعة، مطبخ أمريكي، 4 غرف نوم رئيسية، شقة ملحقة للعاملة، ساحة للعب أطفال، حديقة مزروعة.',
    descriptionEn: 'Elegant residential villa in the heart of Al Rawdah, Dammam. 3 floors, separate men and women entrances, majlis, huge living room, American kitchen, 4 master bedrooms, maid\'s quarter, kids\' play area, landscaped garden.',
    amenities: ['إنترنت فايبر', 'مكيفات سبليت', 'خزانات مياه مستقلة', 'مساحة خاصة للأطفال', 'حديقة مع أشجار مثمرة', 'مباني ملحقة'],
    agent: {
      name: 'نورة القحطاني',
      nameEn: 'Nora Al-Qahtani',
      role: 'مختصة شؤون عقارية',
      phone: '0500000004',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=90',
      rating: 4.7
    }
  },
  {
    id: 'prop-5',
    title: 'مبنى تجاري (سوق) للشركات والمكاتب',
    titleEn: 'Commercial Building (Mall) with Offices & Shops',
    type: 'commercial',
    purpose: 'rent',
    price: 450000,
    priceUnit: 'ر.س / سنوياً',
    location: 'حي العليا، الرياض',
    locationEn: 'Al Olaya, Riyadh',
    city: 'الرياض',
    bedrooms: 0,
    bathrooms: 12,
    area: 3500,
    areaUnit: 'م²',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=90'
    ],
    featured: true,
    description: 'مبنى تجاري فاخر في حي العليا، باطلاع مباشر على أحد الشوارع الرئيسية، مكون من أرضية + 5 طوابق، 12 محل تجاري بالطابق الأرضي، مكاتب وشركات من الطابق الأول فما فوق، مواقف واسعة ونظام تكييف مركزي.',
    descriptionEn: 'Luxury commercial building in Al Olaya with direct main street exposure. Ground + 5 floors. 12 retail on ground, offices from 1st floor up. Large parking, central HVAC, elevator, meeting rooms.',
    amenities: ['تكييف مركزي', 'مصاعد للضيوف', 'مواقف واسعة للزوار', 'إنترنت مؤسسي', 'غرفة إجتماعات', 'نظام إطفاء آلي'],
    agent: {
      name: 'سعود العتيبي',
      nameEn: 'Saud Al-Otaibi',
      role: 'مدير المبيعات التجارية',
      phone: '0500000005',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=90',
      rating: 4.9
    }
  },
  {
    id: 'prop-6',
    title: 'شقه بغرفتين للإيجار السنوي بالخبر',
    titleEn: 'Two Bedroom Apartment Yearly Rent, Khobar',
    type: 'apartment',
    purpose: 'rent',
    price: 48000,
    priceUnit: 'ر.س / سنوياً',
    location: 'الكورنيش، الخبر',
    locationEn: 'Corniche, Khobar',
    city: 'الخبر',
    bedrooms: 2,
    bathrooms: 2,
    area: 110,
    areaUnit: 'م²',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=90'
    ],
    furnished: true,
    description: 'شقه إيجار سنوي بالخبر الكورنيش، صالة واسعة، مطبخ مجهز، غرفتان نوم، حمامين، مودرن فنيش، أمن وسلامة، قريبة من جميع الخدمات والمراكز التجارية والمدارس والمستشفيات.',
    descriptionEn: 'Yearly rent apartment in Khobar Corniche, spacious living room, furnished kitchen, 2 bedrooms, 2 bathrooms, modern finishing, 24/7 security, close to all services, malls, schools and hospitals.',
    amenities: ['أمن 24 ساعة', 'مكيفات سبليت', 'كاميرات مراقبة', 'أبواب شواوية', 'خزان مستقل', 'مواقف زوار'],
    agent: {
      name: 'ريم الحربي',
      nameEn: 'Reem Al-Harbi',
      role: 'استشارية عقارية',
      phone: '0500000006',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=90',
      rating: 4.8
    }
  }
];

const CITIES = ['كل المدن', 'الرياض', 'جدة', 'الدمام', 'الخبر', 'المدينة المنورة', 'مكة المكرمة'];
const TYPES = [
  { ar: 'جميع الأنواع', en: 'All Types', value: 'all' },
  { ar: 'فلل', en: 'Villas', value: 'villa' },
  { ar: 'شقق', en: 'Apartments', value: 'apartment' },
  { ar: 'أراضي', en: 'Land', value: 'land' },
  { ar: 'تجاري', en: 'Commercial', value: 'commercial' }
];

export default function RealEstateDemoPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';
  const t = isAr ? {
    topbarTag: '🇸🇦 وضع المعاينة المباشرة — سكريبت الموقع العقاري السعودي',
    backToStore: 'المتجر DA',
    buyTemplate: 'شراء القالب',
    title: 'العقارات السعودية المتميزة',
    subtitle: 'اكتشف أفضل العقارات في المملكة سواء للبيع أو الإيجار مع وسيط عقاري معتمد وموثوق',
    searchPlaceholder: 'ابحث عن عنوان، حي، مدينة، أو نوع العقار...',
    search: 'بحث',
    sale: 'للبيع',
    rent: 'للإيجار',
    type: 'النوع',
    city: 'المدينة',
    price: 'السعر',
    filters: 'المزيد من الفلاتر',
    featured: 'العقارات المميزة 🏆',
    allProperties: 'جميع العقارات المعروضة',
    bed: 'نوم',
    bath: 'حمام',
    area: 'المساحة',
    featuredBadge: 'مميز',
    newBadge: 'جديد',
    furnished: 'مفروش',
    pool: 'مسبح',
    garage: 'كراج',
    viewDetails: 'عرض التفاصيل',
    agent: 'التواصل مع الوكيل',
    aboutTitle: 'نظام الموقع العقاري السعودي من D-Arrow',
    aboutSubtitle: 'قالب موقع عقاري متكامل جاهز للتخصيص والتشغيل الفوري',
    whyChoose: 'لماذا تختار قالب العقار السعودي؟',
    stats1: 'عقار مسجل في النظام',
    stats2: 'صفحة تفاصيل مع صور',
    stats3: 'بحث متقدم وفلترة',
    stats4: 'نماذج استفسارات عملاء',
    faqTitle: 'الأسئلة الشائعة حول القالب',
    ctaTitle: 'هل تريد اقتناء قالب الموقع العقاري السعودي؟',
    ctaSubtitle: 'تواصل مع فريق دي آرو اليوم للحصول على العرض الخاص وتخصيص القالب لعلامتك التجارية.',
    whatsappCta: 'تواصل واتساب مباشر',
    backStore: 'العودة لمتجر D-Arrow',
    nearContact: 'حجز معاينة عقار',
    phoneCall: 'اتصال مباشر',
    chat: 'دردشة واتساب',
    gallery: 'معرض الصور',
    locationOnMap: 'الموقع على الخريطة',
    nearbyAmenities: 'المرافق القريبة',
    similarProps: 'عقارات مشابهة',
    inquiryForm: 'نموذج طلب استفسار أو حجز',
    formName: 'الاسم الكامل',
    formPhone: 'رقم الجوال',
    formEmail: 'البريد الإلكتروني',
    formMsg: 'التفاصيل أو استفسارك',
    formSubmit: 'إرسال الطلب',
    perSqm: 'ر.س/م²',
    totalArea: 'إجمالي المساحة:',
    perYear: '/ سنوياً',
    currency: 'ر.س'
  } : {
    topbarTag: '🇸🇦 Live Preview Mode — Saudi Real Estate Template',
    backToStore: 'Back to Store',
    buyTemplate: 'Buy Template',
    title: 'Premium Saudi Real Estate',
    subtitle: 'Discover the best properties across the Kingdom for sale or rent with verified, licensed brokers.',
    searchPlaceholder: 'Search by address, district, city, or property type...',
    search: 'Search',
    sale: 'For Sale',
    rent: 'For Rent',
    type: 'Type',
    city: 'City',
    price: 'Price',
    filters: 'More Filters',
    featured: 'Featured Properties 🏆',
    allProperties: 'All Listed Properties',
    bed: 'Bed',
    bath: 'Bath',
    area: 'Area',
    featuredBadge: 'Featured',
    newBadge: 'New',
    furnished: 'Furnished',
    pool: 'Pool',
    garage: 'Garage',
    viewDetails: 'View Details',
    agent: 'Contact Agent',
    aboutTitle: 'D-Arrow Saudi Real Estate Template System',
    aboutSubtitle: 'A complete, production-ready real estate website template — fully customizable.',
    whyChoose: 'Why Choose the Saudi Real Estate Template?',
    stats1: 'Registered properties',
    stats2: 'Detail pages with gallery',
    stats3: 'Advanced search & filters',
    stats4: 'Customer inquiry forms',
    faqTitle: 'Template FAQ',
    ctaTitle: 'Want to Acquire the Saudi Real Estate Template?',
    ctaSubtitle: 'Contact D-Arrow now for your exclusive offer and white-label customization for your brand.',
    whatsappCta: 'Contact on WhatsApp',
    backStore: 'Back to D-Arrow Store',
    nearContact: 'Book a Viewing',
    phoneCall: 'Call Agent',
    chat: 'WhatsApp Chat',
    gallery: 'Photo Gallery',
    locationOnMap: 'Location on Map',
    nearbyAmenities: 'Nearby Amenities',
    similarProps: 'Similar Properties',
    inquiryForm: 'Inquiry / Booking Form',
    formName: 'Full Name',
    formPhone: 'Mobile Number',
    formEmail: 'Email Address',
    formMsg: 'Details or your Question',
    formSubmit: 'Submit Request',
    perSqm: 'SAR/sqm',
    totalArea: 'Total Area:',
    perYear: '/ year',
    currency: 'SAR'
  };

  const [purpose, setPurpose] = useState<'sale' | 'rent'>('sale');
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCity, setSelectedCity] = useState('كل المدن');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [filterModal, setFilterModal] = useState(false);

  // filtered properties
  const filtered = PROPERTIES.filter(p => {
    const matchPurpose = p.purpose === purpose;
    const matchType = selectedType === 'all' || p.type === selectedType;
    const matchCity = selectedCity === 'كل المدن' || p.city === selectedCity;
    const q = search.trim();
    const matchSearch = !q || p.title.includes(q) || p.titleEn.toLowerCase().includes(q.toLowerCase()) ||
      p.location.includes(q) || p.city.includes(q);
    return matchPurpose && matchType && matchCity && matchSearch;
  });
  const featured = PROPERTIES.filter(p => p.featured);

  // ===== Property Detail View =====
  if (selectedProperty) {
    const p = selectedProperty;
    return (
      <div dir={isAr ? 'rtl' : 'ltr'} style={{ background: '#0B0D1F', color: '#E6E6EA', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
        {/* Top bar */}
        <div style={{ background: 'linear-gradient(90deg, #10B981, #FF9A3C)', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, fontSize: 14, fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Sparkles size={16} /> {t.topbarTag}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setLang(isAr ? 'en' : 'ar')} style={{ background: 'rgba(0,0,0,0.25)', color: 'white', padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
              {isAr ? 'English' : 'العربية'}
            </button>
            <Link href="/store" style={{ background: 'rgba(0,0,0,0.25)', color: 'white', padding: '5px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}><ArrowRight size={14} style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} /> {t.backToStore}</Link>
            <a href="https://wa.me/966000000000" target="_blank" rel="noreferrer" style={{ background: 'white', color: '#10B981', padding: '5px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 700 }}>{t.buyTemplate}</a>
          </div>
        </div>

        {/* Header */}
        <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(20,22,46,0.85)', backdropFilter: 'blur(14px)', position: 'sticky', top: 0, zIndex: 40, padding: '12px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setSelectedProperty(null)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 16px', color: '#E6E6EA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13 }}>
              <ChevronRight size={16} style={{ transform: isAr ? 'none' : 'rotate(180deg)' }} /> {isAr ? 'العودة للقائمة' : 'Back to listings'}
            </button>
            <div style={{ flex: 1 }} />
            <button onClick={() => setWishlist(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })} style={{ background: wishlist.has(p.id) ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px', color: wishlist.has(p.id) ? '#EF4444' : '#E6E6EA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <Heart size={16} fill={wishlist.has(p.id) ? '#EF4444' : 'none'} />
            </button>
            <button onClick={() => navigator.clipboard?.writeText(window.location.href)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', color: '#E6E6EA', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <Share2 size={16} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div style={{ maxWidth: 1200, margin: '24px auto 80px', padding: '0 24px' }}>
          {/* Breadcrumb & Title */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              <span style={{ background: p.purpose === 'sale' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', border: `1px solid ${p.purpose === 'sale' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`, color: p.purpose === 'sale' ? '#EF4444' : '#10B981', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                {p.purpose === 'sale' ? t.sale : t.rent}
              </span>
              {p.featured && <span style={{ background: 'rgba(250,204,21,0.15)', border: '1px solid rgba(250,204,21,0.3)', color: '#FACC15', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>⭐ {t.featuredBadge}</span>}
              <span style={{ color: '#6B7280', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {isAr ? p.location : p.locationEn}</span>
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 800, margin: '6px 0 14px', color: 'white', lineHeight: 1.3 }}>{isAr ? p.title : p.titleEn}</h1>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#FF9A3C' }}>
              {p.price.toLocaleString(isAr ? 'ar-SA' : 'en-US')} <span style={{ fontSize: 16, fontWeight: 600, color: '#9CA3AF' }}>{p.priceUnit}</span>
              <span style={{ fontSize: 14, color: '#6B7280', fontWeight: 500, marginLeft: 12 }}>({Math.round(p.price / p.area).toLocaleString()} {t.perSqm})</span>
            </div>
          </div>

          {/* Gallery + Quick Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 40 }}>
            {/* Gallery */}
            <div>
              <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(16,185,129,0.15)', aspectRatio: '16/10', background: '#14162E', position: 'relative', marginBottom: 12 }}>
                <img src={p.gallery[galleryIdx]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={() => setGalleryIdx((p.gallery.length + galleryIdx - 1) % p.gallery.length)} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: isAr ? 12 : 'auto', right: isAr ? 'auto' : 12, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronLeft size={22} style={{ transform: isAr ? 'none' : 'rotate(180deg)' }} />
                </button>
                <button onClick={() => setGalleryIdx((galleryIdx + 1) % p.gallery.length)} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: isAr ? 12 : 'auto', left: isAr ? 'auto' : 12, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight size={22} style={{ transform: isAr ? 'none' : 'rotate(180deg)' }} />
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(p.gallery.length, 5)}, 1fr)`, gap: 10 }}>
                {p.gallery.map((g, i) => (
                  <button key={i} onClick={() => setGalleryIdx(i)} style={{ aspectRatio: '1', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', border: galleryIdx === i ? '2px solid #10B981' : '2px solid transparent', padding: 0, background: '#14162E' }}>
                    <img src={g} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Info Box */}
            <div style={{ background: 'rgba(20,22,46,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, alignSelf: 'start', position: 'sticky', top: 90 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14, padding: 14, textAlign: 'center' }}>
                  <div style={{ color: '#10B981', marginBottom: 6 }}><BedDouble size={24} style={{ margin: '0 auto' }} /></div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>{p.bedrooms || '-'}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>{t.bed}</div>
                </div>
                <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 14, padding: 14, textAlign: 'center' }}>
                  <div style={{ color: '#3B82F6', marginBottom: 6 }}><Bath size={24} style={{ margin: '0 auto' }} /></div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>{p.bathrooms || '-'}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>{t.bath}</div>
                </div>
                <div style={{ background: 'rgba(255,154,60,0.08)', border: '1px solid rgba(255,154,60,0.2)', borderRadius: 14, padding: 14, textAlign: 'center', gridColumn: 'span 2' }}>
                  <div style={{ color: '#FF9A3C', marginBottom: 6 }}><Maximize2 size={24} style={{ margin: '0 auto' }} /></div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>{p.area.toLocaleString()} <span style={{ fontSize: 14 }}>{p.areaUnit}</span></div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>{t.totalArea}</div>
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {p.furnished && <span style={{ background: 'rgba(168,85,247,0.12)', color: '#A855F7', border: '1px solid rgba(168,85,247,0.25)', padding: '5px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>🛋️ {t.furnished}</span>}
                {p.pool && <span style={{ background: 'rgba(14,165,233,0.12)', color: '#0EA5E9', border: '1px solid rgba(14,165,233,0.25)', padding: '5px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>🏊 {t.pool}</span>}
                {p.garage && <span style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)', padding: '5px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>🚗 {t.garage}</span>}
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href={`https://wa.me/${p.agent.phone}?text=${encodeURIComponent(isAr ? `مرحباً، أود الاستفسار حول: ${p.title}` : `Hello, I would like to inquire about: ${p.titleEn}`)}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 20px', borderRadius: 14, background: 'linear-gradient(135deg, #10B981, #FF9A3C)', color: 'white', fontWeight: 800, fontSize: 15, textDecoration: 'none', border: 'none', cursor: 'pointer' }}>
                  <Calendar size={18} /> {t.nearContact}
                </a>
                <a href={`tel:${p.agent.phone}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px', borderRadius: 14, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#3B82F6', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                  <Phone size={16} /> {t.phoneCall}
                </a>
                <a href={`https://wa.me/${p.agent.phone}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px', borderRadius: 14, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                  <MessageCircle size={16} /> {t.chat}
                </a>
              </div>

              {/* Agent Card */}
              <div style={{ marginTop: 20, padding: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={p.agent.avatar} alt="" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(16,185,129,0.4)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{isAr ? p.agent.name : p.agent.nameEn}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>{p.agent.role}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#FACC15', marginTop: 2 }}>
                      <Star size={12} fill="#FACC15" /> {p.agent.rating}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description + Amenities + Inquiry */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 32 }}>
            <div>
              <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 12 }}>{isAr ? 'الوصف التفصيلي' : 'Full Description'}</h2>
                <p style={{ color: '#D1D5DB', lineHeight: 1.9, fontSize: 15 }}>{isAr ? p.description : p.descriptionEn}</p>
              </section>

              <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 14 }}>{isAr ? 'المرافق والمميزات' : 'Amenities & Features'}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                  {p.amenities.map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}>
                      <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: '#E5E7EB' }}>{a}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 14 }}>{t.locationOnMap}</h2>
                <div style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', aspectRatio: '16/9', background: '#14162E', position: 'relative' }}>
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80" alt="map" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'rgba(16,185,129,0.9)', padding: '10px 18px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 8px 32px rgba(16,185,129,0.4)' }}>
                      <MapPin size={18} style={{ color: 'white' }} />
                      <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{isAr ? p.location : p.locationEn}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Inquiry Form + Similar */}
            <div>
              <section style={{ background: 'rgba(20,22,46,0.7)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 4 }}>{t.inquiryForm}</h3>
                <p style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 20 }}>{isAr ? 'املأ النموذج وسنتواصل معك خلال 24 ساعة' : 'Fill the form and we\'ll contact within 24 hours'}</p>

                {formSubmitted ? (
                  <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 14, padding: 20, textAlign: 'center' }}>
                    <CheckCircle2 size={44} style={{ color: '#10B981', margin: '0 auto 10px' }} />
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 4 }}>{isAr ? '✅ تم إرسال طلبك بنجاح!' : '✅ Request submitted successfully!'}</div>
                    <div style={{ fontSize: 13, color: '#9CA3AF' }}>{isAr ? 'سيقوم الوكيل بالتواصل معك قريباً.' : 'Agent will contact you shortly.'}</div>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setFormSubmitted(true); setTimeout(() => setFormSubmitted(false), 5000); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <input required placeholder={t.formName} style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none' }} />
                    <input required type="tel" placeholder={t.formPhone} style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none' }} />
                    <input type="email" placeholder={t.formEmail} style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none' }} />
                    <textarea required rows={4} placeholder={t.formMsg} style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none', resize: 'vertical' }} />
                    <button type="submit" style={{ padding: '14px 20px', borderRadius: 12, background: 'linear-gradient(135deg, #10B981, #FF9A3C)', color: 'white', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <MessageCircle size={18} /> {t.formSubmit}
                    </button>
                  </form>
                )}
              </section>

              {/* Similar */}
              <section>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 14 }}>{t.similarProps}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {PROPERTIES.filter(pp => pp.id !== p.id && pp.type === p.type).slice(0, 3).map(pp => (
                    <button key={pp.id} onClick={() => { setSelectedProperty(pp); setGalleryIdx(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      style={{ display: 'flex', gap: 12, background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 12, cursor: 'pointer', textAlign: isAr ? 'right' : 'left' }}>
                      <img src={pp.image} alt="" style={{ width: 90, height: 80, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{isAr ? pp.title : pp.titleEn}</div>
                        <div style={{ fontSize: 12, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}><MapPin size={12} /> {pp.city}</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#FF9A3C' }}>{pp.price.toLocaleString()} {t.currency}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* CTA */}
        <section style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(255,154,60,0.08))', borderTop: '1px solid rgba(16,185,129,0.2)', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: '0 0 10px' }}>{t.ctaTitle}</h2>
            <p style={{ color: '#D1D5DB', fontSize: 16, margin: '0 0 24px' }}>{t.ctaSubtitle}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://wa.me/966000000000" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 14, background: 'linear-gradient(135deg, #10B981, #FF9A3C)', color: 'white', fontWeight: 800, fontSize: 16, textDecoration: 'none', boxShadow: '0 10px 40px rgba(16,185,129,0.3)' }}>
                <MessageCircle size={20} /> {t.whatsappCta}
              </a>
              <Link href="/store" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                <ArrowRight size={18} style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} /> {t.backStore}
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ===== Main Listing View =====
  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ background: '#0B0D1F', color: '#E6E6EA', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Bar */}
      <div style={{ background: 'linear-gradient(90deg, #10B981, #FF9A3C)', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, fontSize: 14, fontWeight: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} /> {t.topbarTag}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setLang(isAr ? 'en' : 'ar')} style={{ background: 'rgba(0,0,0,0.25)', color: 'white', padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
            {isAr ? 'English' : 'العربية'}
          </button>
          <Link href="/store" style={{ background: 'rgba(0,0,0,0.25)', color: 'white', padding: '5px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
            <ArrowRight size={14} style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} /> {t.backToStore}
          </Link>
          <a href="https://wa.me/966000000000" target="_blank" rel="noreferrer" style={{ background: 'white', color: '#10B981', padding: '5px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 700 }}>
            {t.buyTemplate}
          </a>
        </div>
      </div>

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(20,22,46,0.85)', backdropFilter: 'blur(14px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <Link href="/demo/real-estate" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/Darrow-1.png" alt="" style={{ width: 100, height: 40, objectFit: 'contain' }} />
            <div style={{ borderRight: isAr ? '1px solid rgba(255,255,255,0.1)' : 'none', borderLeft: isAr ? 'none' : '1px solid rgba(255,255,255,0.1)', paddingInline: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: 'white', display: 'block', lineHeight: 1.2 }}>
                {isAr ? 'العقارات السعودية' : 'Saudi Real Estate'}
              </span>
              <span style={{ fontSize: 10, color: '#9CA3AF' }}>D-Arrow RealEstate Template</span>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="tel:92000000" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#D1D5DB', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>
              <Phone size={16} style={{ color: '#10B981' }} /> 92000000
            </a>
            <button onClick={() => setFilterModal(true)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '8px 14px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
              <Heart size={15} style={{ color: wishlist.size ? '#EF4444' : '#9CA3AF', fill: wishlist.size ? '#EF4444' : 'none' }} />
              <span style={{ fontSize: 11, opacity: 0.7 }}>({wishlist.size})</span>
            </button>
            <a href="#contact" style={{ background: 'linear-gradient(135deg, #10B981, #FF9A3C)', color: 'white', padding: '10px 18px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>
              {isAr ? 'تواصل معنا' : 'Contact Us'}
            </a>
          </div>
        </div>
      </header>

      {/* Hero + Search */}
      <section style={{ maxWidth: 1200, margin: '32px auto 0', padding: '0 24px' }}>
        <div style={{ borderRadius: 24, background: 'linear-gradient(135deg, #10122B 0%, #1A1C3B 100%)', border: '1px solid rgba(16,185,129,0.25)', padding: '40px 36px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: 300, background: 'rgba(16,185,129,0.08)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 300, height: 300, background: 'rgba(255,154,60,0.08)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', padding: '5px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                🇸🇦 {isAr ? 'تغطي جميع مدن المملكة' : 'Covering all Saudi cities'}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.06)', color: '#D1D5DB', padding: '5px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                {isAr ? '+1000 عقار مُفعّل' : '+1000 active listings'}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(28px,4.2vw,44px)', fontWeight: 900, margin: '0 0 10px', color: '#FFFFFF', lineHeight: 1.2 }}>
              {t.title}
            </h1>
            <p style={{ color: '#D1D5DB', fontSize: 16, margin: '0 0 28px', maxWidth: 700, lineHeight: 1.6 }}>{t.subtitle}</p>

            {/* Purpose Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {[
                { k: 'sale', label: t.sale, color: '#EF4444' },
                { k: 'rent', label: t.rent, color: '#10B981' }
              ].map(o => (
                <button key={o.k} onClick={() => setPurpose(o.k as 'sale' | 'rent')}
                  style={{
                    padding: '11px 28px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer',
                    transition: '0.2s',
                    border: purpose === o.k ? '2px solid transparent' : '2px solid rgba(255,255,255,0.1)',
                    background: purpose === o.k ? o.color : 'rgba(255,255,255,0.04)',
                    color: purpose === o.k ? 'white' : '#D1D5DB',
                    boxShadow: purpose === o.k ? `0 8px 24px ${o.color}40` : 'none'
                  }}>
                  {o.label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
              <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '8px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 6 }}>
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: isAr ? 14 : 'auto', left: isAr ? 'auto' : 14, color: '#6B7280' }} />
                  <input
                    placeholder={t.searchPlaceholder}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', padding: '14px 46px 14px 16px', background: 'transparent', border: 'none', color: 'white', fontSize: 14, outline: 'none' }}
                  />
                </div>
                <div style={{ borderInline: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
                  <Building2 size={17} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: isAr ? 12 : 'auto', left: isAr ? 'auto' : 12, color: '#6B7280' }} />
                  <select
                    value={selectedType}
                    onChange={e => setSelectedType(e.target.value)}
                    style={{ width: '100%', height: '100%', padding: '14px 42px 14px 14px', background: 'transparent', border: 'none', color: 'white', fontSize: 13, outline: 'none', appearance: 'none', cursor: 'pointer' }}
                  >
                    {TYPES.map(ty => <option key={ty.value} value={ty.value} style={{ background: '#14162E', color: 'white' }}>{isAr ? ty.ar : ty.en}</option>)}
                  </select>
                </div>
                <div style={{ position: 'relative' }}>
                  <MapPin size={17} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: isAr ? 12 : 'auto', left: isAr ? 'auto' : 12, color: '#6B7280' }} />
                  <select
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    style={{ width: '100%', height: '100%', padding: '14px 42px 14px 14px', background: 'transparent', border: 'none', color: 'white', fontSize: 13, outline: 'none', appearance: 'none', cursor: 'pointer' }}
                  >
                    {CITIES.map(c => <option key={c} value={c} style={{ background: '#14162E', color: 'white' }}>{c}</option>)}
                  </select>
                </div>
                <button onClick={() => setFilterModal(true)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '0 14px', color: '#D1D5DB', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600 }}>
                  <Filter size={15} /> {t.filters}
                </button>
              </div>
              <button style={{ padding: '0 32px', borderRadius: 14, background: 'linear-gradient(135deg, #10B981, #FF9A3C)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 15, boxShadow: '0 10px 32px rgba(16,185,129,0.35)' }}>
                {t.search}
              </button>
            </div>
          </div>
        </div>

        {/* Trust Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 24 }}>
          {[
            { icon: <Building2 size={24} style={{ color: '#10B981' }} />, n: '2,500+', s: isAr ? 'عقار مسجل' : 'Listed Properties' },
            { icon: <Users size={24} style={{ color: '#3B82F6' }} />, n: '180+', s: isAr ? 'وسيط مسجل' : 'Licensed Agents' },
            { icon: <TrendingUp size={24} style={{ color: '#FF9A3C' }} />, n: '97%', s: isAr ? 'نسبة الإغلاق' : 'Close Rate' },
            { icon: <ShieldCheck size={24} style={{ color: '#A855F7' }} />, n: '100%', s: isAr ? 'عقارات موثقة' : 'Verified Listings' }
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 16, textAlign: 'center' }}>
              <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 2 }}>{s.n}</div>
              <div style={{ fontSize: 12, color: '#9CA3AF' }}>{s.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section style={{ maxWidth: 1200, margin: '52px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ background: 'rgba(250,204,21,0.12)', border: '1px solid rgba(250,204,21,0.3)', color: '#FACC15', padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>⭐ {isAr ? 'المختارة منا' : 'Our Picks'}</span>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: 'white', margin: '10px 0 4px' }}>{t.featured}</h2>
            <p style={{ color: '#9CA3AF', fontSize: 14, margin: 0 }}>{isAr ? 'أجود العقارات المعتمدة في المملكة' : 'Highest-quality verified listings across the Kingdom'}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
          {featured.map(p => <PropertyCard key={p.id} p={p} isAr={isAr} t={t} onOpen={() => { setSelectedProperty(p); setGalleryIdx(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }} wishlist={wishlist} toggleW={() => setWishlist(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })} />)}
        </div>
      </section>

      {/* All Properties */}
      <section id="contact" style={{ maxWidth: 1200, margin: '56px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: 'white', margin: '0 0 4px' }}>{t.allProperties} <span style={{ color: '#6B7280', fontWeight: 500, fontSize: 16 }}>({filtered.length})</span></h2>
            <p style={{ color: '#9CA3AF', fontSize: 14, margin: 0 }}>{isAr ? 'عرض جميع النتائج حسب بحثك وفلاترك' : 'All listings matching your search and filters'}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {filtered.map(p => <PropertyCard key={p.id} p={p} isAr={isAr} t={t} onOpen={() => { setSelectedProperty(p); setGalleryIdx(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }} wishlist={wishlist} toggleW={() => setWishlist(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })} />)}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.04)', borderRadius: 18, border: '1px dashed rgba(255,255,255,0.1)' }}>
              <Search size={40} style={{ color: '#6B7280', margin: '0 auto 10px', opacity: 0.4 }} />
              <div style={{ color: '#9CA3AF', fontSize: 16 }}>{isAr ? 'لا توجد نتائج مطابقة لبحثك — جرّب تغيير الفلاتر' : 'No results — try adjusting search filters.'}</div>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Section */}
      <section style={{ maxWidth: 1200, margin: '72px auto 0', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: '0 0 8px' }}>{t.whyChoose}</h2>
          <p style={{ color: '#9CA3AF', fontSize: 14, margin: 0 }}>{isAr ? 'ما يميز قالب الموقع العقاري السعودي من دي آرو' : 'What makes this Saudi real estate template by D-Arrow the best choice'}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {[
            { icon: <Zap size={22} />, c: '#10B981', t: isAr ? 'تحميل فائق السرعة' : 'Ultra-Fast Loading', d: isAr ? 'أقل من ثانية لتحميل الصفحة وSEO عالي' : 'Sub-second load times with strong SEO built-in' },
            { icon: <Lock size={22} />, c: '#3B82F6', t: isAr ? 'حماية وتشفير كامل' : 'Privacy & Security', d: isAr ? 'توافق مع نظام حماية البيانات السعودي' : 'Saudi data protection regulation compliant' },
            { icon: <Award size={22} />, c: '#FF9A3C', t: isAr ? 'تصميم سعودي أصيل' : 'Saudi-Centric Design', d: isAr ? 'RTL عربي كامل + إنجليزي + دعم اللغات' : 'Full Arabic RTL + English, dual-language ready' },
            { icon: <Truck size={22} />, c: '#A855F7', t: isAr ? 'تكامل استفسارات فوري' : 'Instant Inquiry System', d: isAr ? 'واتساب، نماذج، حجوزات، وإشعارات مباشرة' : 'WhatsApp, forms, bookings, instant notifications' }
          ].map((x, i) => (
            <div key={i} style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 22, transition: '0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = `${x.c}55`)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${x.c}20`, border: `1px solid ${x.c}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: x.c, marginBottom: 14 }}>
                {x.icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 6 }}>{x.t}</h3>
              <p style={{ color: '#9CA3AF', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ margin: '72px 0 0', background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(255,154,60,0.1))', borderTop: '1px solid rgba(16,185,129,0.2)', padding: '56px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: 'white', margin: '0 0 10px' }}>{t.ctaTitle}</h2>
          <p style={{ color: '#D1D5DB', fontSize: 16, margin: '0 0 28px', lineHeight: 1.6 }}>{t.ctaSubtitle}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://wa.me/966000000000" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 14, background: 'linear-gradient(135deg, #10B981, #FF9A3C)', color: 'white', fontWeight: 800, fontSize: 16, textDecoration: 'none', boxShadow: '0 10px 40px rgba(16,185,129,0.35)' }}>
              <MessageCircle size={20} /> {t.whatsappCta}
            </a>
            <Link href="/store" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              <ArrowRight size={18} style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} /> {t.backStore}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '36px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <img src="/Darrow-1.png" alt="" style={{ width: 100, height: 40, objectFit: 'contain', marginBottom: 8 }} />
            <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{isAr ? 'هذا موقع استعراضي لقالب الموقع العقاري السعودي المتكامل مع نظام الإدراج والبحث والاستفسارات. تم تطويره بواسطة فريق D-Arrow.' : 'This is a preview demo of the full Saudi real estate template with listings, search, and inquiry engine. Developed by D-Arrow team.'}</p>
          </div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>
            D-Arrow © 2026 — {isAr ? 'قالب العقار السعودي' : 'Saudi Real Estate Template'} 🇸🇦
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a href="https://wa.me/966000000000" target="_blank" rel="noreferrer" title="WhatsApp"
        style={{ position: 'fixed', bottom: 24, left: isAr ? 24 : 'auto', right: isAr ? 'auto' : 24, zIndex: 100, width: 56, height: 56, borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(16,185,129,0.5)', color: 'white', cursor: 'pointer' }}>
        <MessageCircle size={26} />
      </a>

      {/* Filter Modal */}
      {filterModal && (
        <div onClick={() => setFilterModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 520, background: '#14162E', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', margin: 0 }}>{t.filters}</h3>
              <button onClick={() => setFilterModal(false)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 6, fontWeight: 600 }}>{t.type}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {TYPES.map(ty => (
                    <button key={ty.value} onClick={() => setSelectedType(ty.value)}
                      style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                        borderColor: selectedType === ty.value ? '#10B981' : 'rgba(255,255,255,0.1)',
                        background: selectedType === ty.value ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
                        color: selectedType === ty.value ? '#10B981' : '#E5E7EB'
                      }}>
                      {isAr ? ty.ar : ty.en}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 6, fontWeight: 600 }}>{t.city}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {CITIES.map(c => (
                    <button key={c} onClick={() => setSelectedCity(c)}
                      style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                        borderColor: selectedCity === c ? '#FF9A3C' : 'rgba(255,255,255,0.1)',
                        background: selectedCity === c ? 'rgba(255,154,60,0.12)' : 'rgba(255,255,255,0.04)',
                        color: selectedCity === c ? '#FF9A3C' : '#E5E7EB'
                      }}>{c}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => setFilterModal(false)} style={{ marginTop: 8, padding: '14px', borderRadius: 12, background: 'linear-gradient(135deg, #10B981, #FF9A3C)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 15 }}>
                {isAr ? 'تطبيق الفلاتر' : 'Apply Filters'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== Reusable Property Card =====
function PropertyCard({ p, isAr, t, onOpen, wishlist, toggleW }: {
  p: Property; isAr: boolean; t: any; onOpen: () => void; wishlist: Set<string>; toggleW: () => void;
}) {
  const typeLabel = isAr
    ? p.type === 'villa' ? 'فيلا' : p.type === 'apartment' ? 'شقه' : p.type === 'land' ? 'أرض' : 'تجاري'
    : p.type === 'villa' ? 'Villa' : p.type === 'apartment' ? 'Apartment' : p.type === 'land' ? 'Land' : 'Commercial';
  const pricePer = p.purpose === 'rent' ? ` ${t.perYear}` : '';

  return (
    <div
      onClick={onOpen}
      style={{
        background: 'rgba(20,22,46,0.6)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.35s ease',
        position: 'relative',
        cursor: 'pointer',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.35)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.4)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Image */}
      <div style={{ height: 240, position: 'relative', overflow: 'hidden', background: '#14162E' }}>
        <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }} />

        {/* Badges */}
        <div style={{ position: 'absolute', top: 12, left: isAr ? 'auto' : 12, right: isAr ? 12 : 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{
            padding: '5px 12px', borderRadius: 10, fontSize: 11, fontWeight: 800, color: 'white',
            background: p.purpose === 'sale' ? '#EF4444' : '#10B981'
          }}>{p.purpose === 'sale' ? t.sale : t.rent}</span>
          {p.featured && <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, color: '#0B0D1F', background: '#FACC15' }}>⭐ {t.featuredBadge}</span>}
          {p.isNew && <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, color: 'white', background: '#3B82F6' }}>🆕 {t.newBadge}</span>}
        </div>

        {/* Wishlist + View */}
        <div style={{ position: 'absolute', bottom: 12, left: isAr ? 12 : 'auto', right: isAr ? 'auto' : 12, display: 'flex', gap: 8 }}>
          <button onClick={e => { e.stopPropagation(); toggleW(); }} style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', border: 'none', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: wishlist.has(p.id) ? '#EF4444' : 'white' }}>
            <Heart size={16} fill={wishlist.has(p.id) ? '#EF4444' : 'none'} />
          </button>
          <button onClick={e => { e.stopPropagation(); onOpen(); }} style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', border: 'none', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: isAr ? 'right' : 'left' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#10B981', fontWeight: 600 }}>{typeLabel}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={13} style={{ color: '#FACC15', fill: '#FACC15' }} />
              <span style={{ fontSize: 12, color: '#FACC15', fontWeight: 700 }}>{p.agent.rating}</span>
            </div>
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', margin: '0 0 6px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 44 }}>
            {isAr ? p.title : p.titleEn}
          </h3>
          <div style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={12} style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{isAr ? p.location : p.locationEn}</span>
          </div>

          {/* Meta */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14, fontSize: 12, color: '#9CA3AF', flexWrap: 'wrap' }}>
            {p.bedrooms > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BedDouble size={13} /> {p.bedrooms} {t.bed}</span>}
            {p.bathrooms > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Bath size={13} /> {p.bathrooms} {t.bath}</span>}
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Maximize2 size={13} /> {p.area} {p.areaUnit}</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#FF9A3C', lineHeight: 1 }}>
              {p.price.toLocaleString(isAr ? 'ar-SA' : 'en-US')}
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{p.priceUnit}{pricePer}</div>
          </div>
          <button onClick={e => { e.stopPropagation(); onOpen(); }}
            style={{ padding: '10px 14px', borderRadius: 12, background: 'linear-gradient(135deg, #10B981, #FF9A3C)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
            {t.viewDetails} <ArrowRight size={14} style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
