const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Store & Admin Panel Template product...');

  const templateProduct = {
    name: 'Full E-Commerce Store Template + Admin Panel',
    nameAr: 'قالب متجر إلكتروني متكامل + لوحة تحكم',
    slug: 'ecommerce-store-admin-template',
    price: 499.0,
    salePrice: 299.0,
    currency: 'SAR',
    category: 'Templates',
    categoryAr: 'قوالب ومتاجر',
    type: 'template',
    downloadUrl: '/downloads/ecommerce-store-template.zip',
    demoUrl: '/demo/store',
    images: JSON.stringify([
      '/projects-showcase/store-preview.png',
      '/main-one.png',
      '/connect2.png'
    ]),
    featuresAr: JSON.stringify([
      'لوحة تحكم احترافية شاملة لإدارة المنتجات والطلبات والعملاء',
      'دعم بوابات الدفع الإلكتروني (مدى، الفيزا، Stripe، والتحويل البنكي)',
      'تصميم متجاوب وسريع جداً مبني بتقنية Next.js & React & TypeScript',
      'نظام كوبونات الخصم وتتبع المبيعات والتقارير المالية المباشرة',
      'دعم كامل للغتين العربية والإنجليزية ومعادلة SEO مدمجة',
      'كود مصدري نقي وسهل التخصيص والربط مع أي قاعدة بيانات'
    ]),
    features: JSON.stringify([
      'Comprehensive Admin Panel for products, orders, and customers',
      'Multi-payment gateway integration (Mada, Visa, Stripe, Bank transfer)',
      'Responsive & ultra-fast UI built with Next.js & React & TypeScript',
      'Coupon code system, sales analytics & financial reports',
      'Full Arabic & English support with built-in SEO engine',
      'Clean source code with easy database integration'
    ]),
    description: 'A full-featured e-commerce store template with an interactive admin panel built using Next.js & TypeScript.',
    descriptionAr: `<div style="line-height: 1.8; font-size: 16px;">
      <p style="margin-bottom: 16px; color: #D1D5DB;">
        قالب وسكريبت متجر إلكتروني متكامل مبني بأحدث تقنيات <strong>Next.js</strong> و <strong>TypeScript</strong>، يأتي مجهزاً بلوحة تحكم تفاعلية وشاملة لإدارة المنتجات، الطلبات، الخصومات، العملاء والتقارير المالية بسهولة تامة.
      </p>
      
      <h3 style="color: #FF4D6D; margin-top: 24px; margin-bottom: 12px; font-size: 18px;">مميزات القالب ولوحة التحكم:</h3>
      <ul style="padding-right: 20px; color: #9CA3AF; display: flex; flex-direction: column; gap: 8px;">
        <li><strong style="color: #E6E6EA;">إدارة المنتجات:</strong> إضافة، تعديل، حذف، رفع صور متعددة، وتحديد فئات وأسعار العروض.</li>
        <li><strong style="color: #E6E6EA;">إدارة الطلبات:</strong> تتبع حالة الطلبات (قيد الانتظار، مدفوع، مكتمل) وطباعة الفواتير.</li>
        <li><strong style="color: #E6E6EA;">نظام الكوبونات:</strong> إنشاء قسائم خصم بنسبة مئوية أو قيمة ثابتة وتحديد تاريخ الانتهاء.</li>
        <li><strong style="color: #E6E6EA;">بوابات الدفع:</strong> جاهز للربط الفوري مع مدى، Stripe، التحويل البنكي وبوابات الدفع المحلية.</li>
        <li><strong style="color: #E6E6EA;">لوحة تحكم إحصائية:</strong> ملخص يومي وشهر للمبيعات وأداء المتجر.</li>
      </ul>
    </div>`,
    status: 'published',
    featured: true,
  };

  const product = await prisma.product.upsert({
    where: { slug: templateProduct.slug },
    update: templateProduct,
    create: templateProduct,
  });

  console.log('✅ Template product seeded successfully:', product.id, product.nameAr);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding template product:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
