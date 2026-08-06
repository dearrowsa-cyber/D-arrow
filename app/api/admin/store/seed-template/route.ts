import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const productsToSeed = [
      {
        name: 'Saudi E-Commerce Store & Admin System',
        nameAr: 'قالب المتجر الإلكتروني السعودي المتكامل + لوحة التحكم',
        slug: 'saudi-ecommerce-store-system',
        price: 499.0,
        salePrice: 299.0,
        currency: 'SAR',
        category: 'Ecommerce',
        categoryAr: 'متاجر إلكترونية',
        type: 'template',
        downloadUrl: '/downloads/ecommerce-store-template.zip',
        demoUrl: '/demo/store',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1556742049-0a67e6f49969?auto=format&fit=crop&w=800&q=90',
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=90'
        ]),
        featuresAr: JSON.stringify([
          'لوحة تحكم احترافية شاملة لإدارة المنتجات والطلبات والعملاء',
          'دعم بوابات الدفع الإلكتروني السعودية (مدى، أبل باي، سداد، فيزا)',
          'تصميم متجاوب وسريع جداً مبني بتقنية Next.js & React & Tailwind',
          'نظام كوبونات الخصم وتتبع المبيعات والتقارير المباشرة',
          'دعم كامل للغتين العربية والإنجليزية ومعادلة SEO مدمجة'
        ]),
        features: JSON.stringify([
          'Comprehensive Admin Panel for products, orders, and customers',
          'Multi-payment gateway integration (Mada, Apple Pay, Visa)',
          'Responsive & ultra-fast UI built with Next.js & React',
          'Coupon code system, sales analytics & financial reports'
        ]),
        description: 'قالب وسكريبت متجر إلكتروني سعودي حديث مجهز بلوحة تحكم وبوابة دفع تفاعلية.',
        descriptionAr: 'قالب وسكريبت متجر إلكتروني سعودي حديث مجهز بلوحة تحكم وبوابة دفع تفاعلية وتصفح المنتجات.',
        status: 'published',
        featured: true,
      },
      {
        name: 'Saudi Real Estate Platform & CRM',
        nameAr: 'قالب المنصة العقارية وإدارة الأملاك (Real Estate Platform)',
        slug: 'saudi-real-estate-platform',
        price: 899.0,
        salePrice: 599.0,
        currency: 'SAR',
        category: 'Real Estate',
        categoryAr: 'عقارات وتطوير',
        type: 'template',
        downloadUrl: '/downloads/real-estate-template.zip',
        demoUrl: '/demo/real-estate',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=90',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=90'
        ]),
        featuresAr: JSON.stringify([
          'منظومة فلترة وتصفح العقارات بالمخططات والمدن والأسعار',
          'نظام حجز ومعاينة فورية وربط مع واتساب المستشار العقاري',
          'خارطة تفاعلية لعرض المشاريع السكنية والتجارية بالمملكة',
          'لوحة تحكم لإضافة المشاريع وتتبع طلبات المستثمرين'
        ]),
        features: JSON.stringify([
          'Real estate listing and interactive search engine',
          'Direct booking & WhatsApp agent integration',
          'Interactive map for residential & commercial projects'
        ]),
        description: 'نظام متكامل للمكاتب والمطورين العقاريين لعرض المشاريع واستقبال طلبات الشراء.',
        descriptionAr: 'نظام متكامل للمكاتب والمطورين العقاريين لعرض المشاريع واستقبال طلبات الشراء والتحليل.',
        status: 'published',
        featured: true,
      },
      {
        name: 'Influencer Marketing Platform SaaS',
        nameAr: 'منصة تسويق المؤثرين والحملات الإعلانية (SaaS Platform)',
        slug: 'influencer-marketing-platform',
        price: 1299.0,
        salePrice: 849.0,
        currency: 'SAR',
        category: 'SaaS',
        categoryAr: 'أنظمة سحابية',
        type: 'software',
        downloadUrl: '/downloads/influencer-platform.zip',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=90'
        ]),
        featuresAr: JSON.stringify([
          'نظام إدارة وتتبع حملات المشاهير والمؤثرين',
          'تحليلات وصول الحملات ونسبة التفاعل والعائد على الاستثمار ROI',
          'ربط مع أنظمة العملاء وإرسال التقارير التلقائية'
        ]),
        features: JSON.stringify([
          'Influencer campaign management & analytics',
          'ROI calculation & automatic performance reporting'
        ]),
        description: 'منصة سحابية لإدارة الحملات الإعلانية مع المؤثرين والمشاهير.',
        descriptionAr: 'منصة سحابية لإدارة الحملات الإعلانية مع المؤثرين والمشاهير وتتبع نتائج الإعلانات.',
        status: 'published',
        featured: false,
      },
      {
        name: 'Digital Marketing & SEO Mastery Course',
        nameAr: 'كورس التسويق الرقمي وتصدر محركات البحث (SEO Course)',
        slug: 'digital-marketing-seo-course',
        price: 299.0,
        salePrice: 149.0,
        currency: 'SAR',
        category: 'Courses',
        categoryAr: 'كورسات وأدوات',
        type: 'course',
        downloadUrl: '/downloads/seo-course-access.pdf',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=90'
        ]),
        featuresAr: JSON.stringify([
          'شرح عملي ومبسط لاستراتيجيات تصدر نتائج البحث الأولى Google',
          'أدوات وتحليلات الكلمات المفتاحية بالسوق السعودي والخليجي',
          'شهادة إتمام ودعم مباشر عبر مجتمع دي آرو'
        ]),
        features: JSON.stringify([
          'Comprehensive SEO & Search Engine dominance course',
          'Keyword strategy tailored for Saudi & Gulf markets'
        ]),
        description: 'دورة تدريبية شاملة لتنميتها أعمالك وحصيلة مبيعاتك عبر محركات البحث.',
        descriptionAr: 'دورة تدريبية شاملة لتنميتها أعمالك وحصيلة مبيعاتك عبر محركات البحث والتسويق.',
        status: 'published',
        featured: true,
      }
    ];

    const results = [];
    for (const item of productsToSeed) {
      const p = await prisma.product.upsert({
        where: { slug: item.slug },
        update: item,
        create: item,
      });
      results.push(p);
    }

    return NextResponse.json({
      success: true,
      message: `تم زرع/تحديث ${results.length} من المنتجات والقوالب بنجاح في قاعدة البيانات!`,
      products: results
    });
  } catch (error) {
    console.error('Error seeding store template:', error);
    return NextResponse.json({ success: false, error: 'فشل في إضافة/تحديث المنتجات' }, { status: 500 });
  }
}
