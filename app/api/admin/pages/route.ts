import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';

const getPagesDataPath = () => {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'pages-content.json');
};

const defaultPagesContent = {
  hero: {
    badge: { en: 'NEXT-GENERATION SOLUTIONS', ar: 'حلول الجيل التالي' },
    heading: { en: 'Next-Generation Digital Marketing Solutions', ar: 'حلول تسويق رقمي من الجيل التالي' },
    subheading: { en: 'We deliver innovative ideas to elevate your digital products and sharpen your brand.', ar: 'نقدم أفكارًا مبتكرة للنهوض بمنتجاتك الرقمية وصقل علامتك التجارية.' },
  },
  stats: {
    yearsExperience: '6',
    teamMembers: '25',
    projectsCompleted: '500',
    satisfiedCustomers: '300',
  },
  contact: {
    email: 'support@d-arrow.com',
    phone: '+966 50 046 6349',
    address: { en: 'Al-Ahsa Region, Saudi Arabia', ar: 'منطقة الأحساء، المملكة العربية السعودية' },
    workingHours: { en: 'Mon - Fri, 9AM - 6PM', ar: 'الاثنين - الجمعة، 9 صباحًا - 6 مساءً' },
  },
  footer: {
    tagline: { en: 'Next-generation digital marketing solutions for modern businesses driving growth and innovation', ar: 'حلول تسويق رقمي من الجيل التالي للأعمال الحديثة لدفع النمو والابتكار' },
    copyright: { en: '© 2026 D Arrow Digital. All rights reserved.', ar: '© 2026 دي آرو الرقمي. جميع الحقوق محفوظة.' },
  },
  social: {
    instagram: 'https://www.instagram.com/darrow.co/',
    snapchat: 'https://www.snapchat.com/@darrow.co?share_id=bINbFcr6nOc&locale=en-EG',
    linkedin: 'https://www.linkedin.com/company/darrowdigital',
    tiktok: 'https://www.tiktok.com/@d.arrow.sa?_r=1&_t=ZS-95OXOuGs34j',
    whatsapp: 'https://wa.me/966500466349',
  },
  whyUs: {
    badge: { en: 'WHY CHOOSE US', ar: 'لماذا تختارنا' },
    title: { en: 'Why Choose Us', ar: 'لماذا تختارنا' },
    description: { en: 'We deliver excellence through innovation, expertise, and unwavering commitment', ar: 'نقدم التميز من خلال الابتكار والخبرة والالتزام المستمر' },
  },
  services: {
    badge: { en: 'OUR SERVICES', ar: 'خدماتنا' },
    title: { en: 'Services', ar: 'الخدمات' },
    description: { en: 'At our digital marketing agency, we offer a range of services to help businesses grow and succeed online.', ar: 'في وكالتنا للتسويق الرقمي، نقدم مجموعة من الخدمات لمساعدة الشركات على النمو والنجاح عبر الإنترنت.' }
  },
  process: {
    badge: { en: 'OUR PROCESS', ar: 'آلية العمل' },
    title: { en: 'How We Work', ar: 'كيف نعمل' },
    description: { en: 'We follow a structured and transparent process to ensure your project is a success from start to finish.', ar: 'نتبع عملية منظمة وشفافة لضمان نجاح مشروعك من البداية إلى النهاية.' }
  }
};

const initializePagesData = () => {
  const filePath = getPagesDataPath();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultPagesContent, null, 2));
  }
};

export async function GET() {
  try {
    initializePagesData();
    const filePath = getPagesDataPath();
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch pages data' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const updates = await req.json();
    initializePagesData();
    const filePath = getPagesDataPath();
    const currentData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // Deep merge updates
    const mergedData = deepMerge(currentData, updates);
    fs.writeFileSync(filePath, JSON.stringify(mergedData, null, 2));
    
    return NextResponse.json({ success: true, data: mergedData, message: 'تم تحديث المحتوى بنجاح' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update pages data' }, { status: 500 });
  }
}

function deepMerge(target: any, source: any): any {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}
