import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const getPricingDataPath = () => {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'pricing-data.json');
};

// Default packages mirror the public /pricing page content. This file is the
// single source of truth shared between the admin dashboard and the live page.
const defaultPricingData = [
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

const initializePricingData = () => {
  const filePath = getPricingDataPath();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultPricingData, null, 2));
    return;
  }
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!Array.isArray(content)) {
      // Convert legacy object format to standard 4 packages array
      fs.writeFileSync(filePath, JSON.stringify(defaultPricingData, null, 2));
    }
  } catch {
    fs.writeFileSync(filePath, JSON.stringify(defaultPricingData, null, 2));
  }
};

export async function GET() {
  try {
    initializePricingData();
    const filePath = getPricingDataPath();
    let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!Array.isArray(data)) {
      data = defaultPricingData;
      fs.writeFileSync(filePath, JSON.stringify(defaultPricingData, null, 2));
    }
    return NextResponse.json(
      { success: true, data },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch pricing data' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const updates = await req.json();
    if (!Array.isArray(updates)) {
      return NextResponse.json({ success: false, error: 'Invalid data format' }, { status: 400 });
    }
    const filePath = getPricingDataPath();
    fs.writeFileSync(filePath, JSON.stringify(updates, null, 2));
    return NextResponse.json({ success: true, data: updates, message: 'تم تحديث الأسعار بنجاح' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update pricing data' }, { status: 500 });
  }
}
