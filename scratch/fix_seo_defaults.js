const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PAGE_DEFAULTS = {
  '/': { title: 'D Arrow | وكالة تسويق رقمي متكاملة', description: 'وكالة دي أرو للتسويق الرقمي - حلول تسويقية متكاملة، تصميم مواقع، تطوير تطبيقات، هوية بصرية، وإدارة سوشيال ميديا. احصل على استشارة مجانية الآن.' },
  '/services': { title: 'خدماتنا | D Arrow - حلول تسويق رقمي شاملة', description: 'اكتشف خدمات التسويق الرقمي الشاملة من D Arrow: إدارة سوشيال ميديا، تصميم مواقع، تطوير تطبيقات، هوية بصرية، حملات إعلانية، وتحسين محركات البحث.' },
  '/pricing': { title: 'الأسعار والباقات | D Arrow', description: 'باقات تسويق رقمي احترافية تبدأ من 2,950 ريال سعودي. باقة الأساس، النمو، الاحتراف، والباقة المخصصة. حزم تطوير المواقع والتطبيقات.' },
  '/process': { title: 'آلية العمل | D Arrow - كيف نعمل معك خطوة بخطوة', description: 'تعرف على منهجيتنا في العمل: من الاستشارة الأولى إلى تحقيق النتائج. خطوات واضحة ونتائج قابلة للقياس.' },
  '/contact': { title: 'اتصل بنا | D Arrow - استشارة مجانية', description: 'تواصل مع فريق D Arrow للتسويق الرقمي. احصل على استشارة مجانية واعرف كيف يمكننا مساعدتك في نمو عملك.' },
  '/why-us': { title: 'لماذا D Arrow؟ | وكالة تسويق رقمي موثوقة', description: 'اكتشف لماذا تثق أكثر من 500 شركة في D Arrow لاحتياجاتها التسويقية. استراتيجيات مبنية على البيانات وفريق خبراء.' },
  '/custom-package': { title: 'باقة مخصصة | D Arrow - صمم باقتك التسويقية', description: 'صمم باقتك التسويقية المخصصة مع D Arrow. اختر الخدمات التي تناسب عملك من SEO، تصميم مواقع، هوية بصرية، والمزيد.' },
  '/blog': { title: 'المدونة | D Arrow - مقالات ونصائح تسويقية', description: 'اقرأ أحدث المقالات والنصائح التسويقية من خبراء D Arrow في التسويق الرقمي وتحسين محركات البحث.' },
  '/store': { title: 'المتجر | D Arrow - منتجات وخدمات رقمية', description: 'تصفح منتجاتنا وخدماتنا الرقمية الجاهزة. قوالب، أدوات تسويقية، وحلول رقمية احترافية.' },
};

const SERVICE_DEFAULTS = {
  dm_smm: { title: 'إدارة السوشيال ميديا | D Arrow', description: 'خدمة إدارة حسابات السوشيال ميديا باحترافية. إنشاء محتوى، جدولة منشورات، تفاعل مع الجمهور، وتقارير أداء شهرية.' },
  dm_marketing: { title: 'التسويق الرقمي | D Arrow', description: 'استراتيجيات تسويق رقمي متكاملة لنمو عملك. حملات إعلانية، تسويق بالمحتوى، وتحليل بيانات.' },
  dm_visual: { title: 'الإنتاج البصري | D Arrow', description: 'خدمات إنتاج بصري احترافية: تصوير فوتوغرافي، فيديو، موشن جرافيك، وتصميم جرافيك.' },
  dm_influencer: { title: 'التسويق عبر المؤثرين | D Arrow', description: 'حملات تسويقية فعالة عبر المؤثرين. اختيار المؤثر المناسب، إدارة الحملة، وقياس النتائج.' },
  dm_content: { title: 'صناعة المحتوى | D Arrow', description: 'خدمات صناعة محتوى إبداعي ومؤثر. كتابة محتوى، تصميم، فيديو، وإنفوجرافيك.' },
  dm_exhibitions: { title: 'تنظيم المعارض | D Arrow', description: 'خدمات تنظيم المعارض والفعاليات. تصميم أجنحة، إدارة لوجستية، وتسويق الفعاليات.' },
  dm_advertising: { title: 'الحملات الإعلانية | D Arrow', description: 'إدارة حملات إعلانية على جوجل، فيسبوك، انستقرام، وسناب شات. استهداف دقيق ونتائج قابلة للقياس.' },
  dm_consultation: { title: 'الاستشارات التسويقية | D Arrow', description: 'استشارات تسويقية متخصصة لتطوير استراتيجية عملك الرقمية وزيادة المبيعات.' },
  dm_seo: { title: 'تحسين محركات البحث SEO | D Arrow', description: 'خدمات SEO احترافية لتصدر نتائج البحث. تحسين داخلي وخارجي، بناء روابط، وتحليل منافسين.' },
  id_apps: { title: 'تطوير تطبيقات الهواتف | D Arrow', description: 'تطوير تطبيقات iOS و Android احترافية. تصميم واجهات مستخدم، برمجة، واختبار.' },
  id_website: { title: 'برمجة وتصميم المواقع | D Arrow', description: 'تصميم وبرمجة مواقع إلكترونية احترافية ومتجاوبة. مواقع شركات، متاجر إلكترونية، ومنصات.' },
  id_branding: { title: 'الهوية البصرية | D Arrow', description: 'تصميم هوية بصرية متكاملة تعكس قيم علامتك التجارية. شعار، ألوان، خطوط، ومواد تسويقية.' },
  id_software: { title: 'البرمجيات الخاصة | D Arrow', description: 'تطوير برمجيات مخصصة لاحتياجات عملك. أنظمة إدارة، CRM، وحلول برمجية متقدمة.' },
  id_cloud: { title: 'الخدمات السحابية | D Arrow', description: 'خدمات سحابية متكاملة: استضافة، نسخ احتياطي، أمان، وإدارة خوادم.' },
  re_appraisal: { title: 'التقييم العقاري | D Arrow', description: 'خدمات تقييم عقاري احترافية ودقيقة. تقييم شامل للعقارات السكنية والتجارية.' },
  re_marketing: { title: 'التسويق العقاري | D Arrow', description: 'خدمات تسويق عقاري متكاملة. تصوير احترافي، إعلانات رقمية، وجولات افتراضية.' },
  re_management: { title: 'إدارة الأملاك | D Arrow', description: 'خدمات إدارة أملاك احترافية. إدارة الإيجارات، صيانة، وتقارير مالية.' },
  re_photography: { title: 'التصوير العقاري | D Arrow', description: 'تصوير عقاري احترافي بجودة عالية. تصوير فوتوغرافي، فيديو، وجولات 360 درجة.' },
  re_campaign: { title: 'الحملات العقارية | D Arrow', description: 'حملات تسويقية متخصصة للقطاع العقاري. إعلانات رقمية، محتوى عقاري، واستهداف دقيق.' },
  re_project_images: { title: 'تصوير المشاريع | D Arrow', description: 'تصوير مشاريع عقارية ومعمارية بجودة احترافية. تصوير جوي، داخلي، وخارجي.' },
  re_current_eval: { title: 'تقييم الوضع الحالي | D Arrow', description: 'تقييم شامل للوضع الحالي لمشروعك العقاري. تحليل السوق، المنافسين، ونقاط القوة.' },
  re_project_naming: { title: 'تسمية المشاريع | D Arrow', description: 'خدمة تسمية المشاريع العقارية. اختيار اسم مميز وجذاب يعكس هوية مشروعك.' },
};

async function main() {
  // Get all existing entries
  const allEntries = await prisma.seoMeta.findMany();
  let updated = 0;

  for (const entry of allEntries) {
    const serviceKey = entry.slug.replace('/services/', '');
    const defaults = PAGE_DEFAULTS[entry.slug] || SERVICE_DEFAULTS[serviceKey];

    if (!defaults) continue;

    // Only update if the current values are the generic defaults
    const isGenericTitle = !entry.title || entry.title.startsWith('D Arrow |') || entry.title === 'D Arrow Digital Marketing Agency';
    const isGenericDesc = !entry.description || entry.description === 'D Arrow Digital Marketing Agency';

    if (isGenericTitle || isGenericDesc) {
      const updateData = {};
      if (isGenericTitle) updateData.title = defaults.title;
      if (isGenericDesc) updateData.description = defaults.description;

      await prisma.seoMeta.update({
        where: { id: entry.id },
        data: updateData,
      });
      updated++;
      console.log(`  ✅ Updated: ${entry.slug}`);
    }
  }

  console.log(`\nDone! Updated ${updated} entries.`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
