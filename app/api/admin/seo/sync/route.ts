import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { analyzeContent } from '@/lib/seo/analyzer';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    // Dynamically get the base URL from the request, fallback to localhost for dev
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host') || '127.0.0.1:3000';
    const baseUrl = `${protocol}://${host}`;
    
    // Core static routes
    const routes = [
      '/',
      '/services',
      '/pricing',
      '/process',
      '/contact',
      '/why-us',
      '/custom-package',
      '/blog',
      '/store',
      // Services
      '/services/dm_smm', '/services/dm_marketing', '/services/dm_visual', '/services/dm_influencer',
      '/services/dm_content', '/services/dm_exhibitions', '/services/dm_advertising', '/services/dm_consultation', '/services/dm_seo',
      '/services/id_apps', '/services/id_website', '/services/id_branding', '/services/id_software', '/services/id_cloud',
      '/services/re_appraisal', '/services/re_marketing', '/services/re_management', '/services/re_photography',
      '/services/re_campaign', '/services/re_project_images', '/services/re_current_eval', '/services/re_project_naming'
    ];

    // Dynamically fetch all Blog Posts from the database
    try {
      const posts = await prisma.blogPost.findMany({
        where: { status: 'published' },
        select: { id: true, slug: true }
      });
      posts.forEach(post => {
        // Use slug if available, otherwise fallback to id
        routes.push(`/blog/${post.slug || post.id}`);
      });
    } catch (e) {
      console.error('Failed to fetch blog posts for SEO sync', e);
    }

    // Dynamically fetch all Store Products from the database
    try {
      const products = await prisma.product.findMany({
        where: { status: 'published' },
        select: { slug: true }
      });
      products.forEach(product => {
        routes.push(`/store/${product.slug}`);
      });
    } catch (e) {
      console.error('Failed to fetch store products for SEO sync', e);
    }

    // Proper Arabic defaults for each page
    const PAGE_DEFAULTS: Record<string, { title: string; description: string; keyword: string }> = {
      '/': { title: 'D Arrow | وكالة تسويق رقمي متكاملة', description: 'وكالة دي أرو للتسويق الرقمي - حلول تسويقية متكاملة، تصميم مواقع، تطوير تطبيقات، هوية بصرية، وإدارة سوشيال ميديا. احصل على استشارة مجانية الآن.', keyword: 'تسويق رقمي' },
      '/services': { title: 'خدماتنا | D Arrow - حلول تسويق رقمي شاملة', description: 'اكتشف خدمات التسويق الرقمي الشاملة من D Arrow: إدارة سوشيال ميديا، تصميم مواقع، تطوير تطبيقات، هوية بصرية، حملات إعلانية، وتحسين محركات البحث.', keyword: 'خدمات تسويق رقمي' },
      '/pricing': { title: 'الأسعار والباقات | D Arrow', description: 'باقات تسويق رقمي احترافية تبدأ من 2,950 ريال سعودي. باقة الأساس، النمو، الاحتراف، والباقة المخصصة. حزم تطوير المواقع والتطبيقات.', keyword: 'أسعار تسويق رقمي' },
      '/process': { title: 'آلية العمل | D Arrow - كيف نعمل معك خطوة بخطوة', description: 'تعرف على منهجيتنا في العمل: من الاستشارة الأولى إلى تحقيق النتائج. خطوات واضحة ونتائج قابلة للقياس.', keyword: 'آلية العمل' },
      '/contact': { title: 'اتصل بنا | D Arrow - استشارة مجانية', description: 'تواصل مع فريق D Arrow للتسويق الرقمي. احصل على استشارة مجانية واعرف كيف يمكننا مساعدتك في نمو عملك.', keyword: 'اتصل بنا' },
      '/why-us': { title: 'لماذا D Arrow؟ | وكالة تسويق رقمي موثوقة', description: 'اكتشف لماذا تثق أكثر من 500 شركة في D Arrow لاحتياجاتها التسويقية. استراتيجيات مبنية على البيانات وفريق خبراء.', keyword: 'لماذا نحن' },
      '/custom-package': { title: 'باقة مخصصة | D Arrow - صمم باقتك التسويقية', description: 'صمم باقتك التسويقية المخصصة مع D Arrow. اختر الخدمات التي تناسب عملك من SEO، تصميم مواقع، هوية بصرية، والمزيد.', keyword: 'باقة مخصصة' },
      '/blog': { title: 'المدونة | D Arrow - مقالات ونصائح تسويقية', description: 'اقرأ أحدث المقالات والنصائح التسويقية من خبراء D Arrow في التسويق الرقمي وتحسين محركات البحث.', keyword: 'مدونة تسويق رقمي' },
      '/store': { title: 'المتجر | D Arrow - منتجات وخدمات رقمية', description: 'تصفح منتجاتنا وخدماتنا الرقمية الجاهزة. قوالب، أدوات تسويقية، وحلول رقمية احترافية.', keyword: 'متجر رقمي' },
    };

    // Service defaults
    const SERVICE_DEFAULTS: Record<string, { title: string; description: string; keyword: string }> = {
      dm_smm: { title: 'إدارة السوشيال ميديا | D Arrow', description: 'خدمة إدارة حسابات السوشيال ميديا باحترافية. إنشاء محتوى، جدولة منشورات، تفاعل مع الجمهور، وتقارير أداء شهرية.', keyword: 'إدارة سوشيال ميديا' },
      dm_marketing: { title: 'التسويق الرقمي | D Arrow', description: 'استراتيجيات تسويق رقمي متكاملة لنمو عملك. حملات إعلانية، تسويق بالمحتوى، وتحليل بيانات.', keyword: 'تسويق رقمي' },
      dm_visual: { title: 'الإنتاج البصري | D Arrow', description: 'خدمات إنتاج بصري احترافية: تصوير فوتوغرافي، فيديو، موشن جرافيك، وتصميم جرافيك.', keyword: 'إنتاج بصري' },
      dm_influencer: { title: 'التسويق عبر المؤثرين | D Arrow', description: 'حملات تسويقية فعالة عبر المؤثرين. اختيار المؤثر المناسب، إدارة الحملة، وقياس النتائج.', keyword: 'تسويق مؤثرين' },
      dm_content: { title: 'صناعة المحتوى | D Arrow', description: 'خدمات صناعة محتوى إبداعي ومؤثر. كتابة محتوى، تصميم، فيديو، وإنفوجرافيك.', keyword: 'صناعة محتوى' },
      dm_exhibitions: { title: 'تنظيم المعارض | D Arrow', description: 'خدمات تنظيم المعارض والفعاليات. تصميم أجنحة، إدارة لوجستية، وتسويق الفعاليات.', keyword: 'تنظيم معارض' },
      dm_advertising: { title: 'الحملات الإعلانية | D Arrow', description: 'إدارة حملات إعلانية على جوجل، فيسبوك، انستقرام، وسناب شات. استهداف دقيق ونتائج قابلة للقياس.', keyword: 'حملات إعلانية' },
      dm_consultation: { title: 'الاستشارات التسويقية | D Arrow', description: 'استشارات تسويقية متخصصة لتطوير استراتيجية عملك الرقمية وزيادة المبيعات.', keyword: 'استشارات تسويقية' },
      dm_seo: { title: 'تحسين محركات البحث SEO | D Arrow', description: 'خدمات SEO احترافية لتصدر نتائج البحث. تحسين داخلي وخارجي، بناء روابط، وتحليل منافسين.', keyword: 'تحسين محركات البحث' },
      id_apps: { title: 'تطوير تطبيقات الهواتف | D Arrow', description: 'تطوير تطبيقات iOS و Android احترافية. تصميم واجهات مستخدم، برمجة، واختبار.', keyword: 'تطوير تطبيقات' },
      id_website: { title: 'برمجة وتصميم المواقع | D Arrow', description: 'تصميم وبرمجة مواقع إلكترونية احترافية ومتجاوبة. مواقع شركات، متاجر إلكترونية، ومنصات.', keyword: 'تصميم مواقع' },
      id_branding: { title: 'الهوية البصرية | D Arrow', description: 'تصميم هوية بصرية متكاملة تعكس قيم علامتك التجارية. شعار، ألوان، خطوط، ومواد تسويقية.', keyword: 'هوية بصرية' },
      id_software: { title: 'البرمجيات الخاصة | D Arrow', description: 'تطوير برمجيات مخصصة لاحتياجات عملك. أنظمة إدارة، CRM، وحلول برمجية متقدمة.', keyword: 'برمجيات خاصة' },
      id_cloud: { title: 'الخدمات السحابية | D Arrow', description: 'خدمات سحابية متكاملة: استضافة، نسخ احتياطي، أمان، وإدارة خوادم.', keyword: 'خدمات سحابية' },
      re_appraisal: { title: 'التقييم العقاري | D Arrow', description: 'خدمات تقييم عقاري احترافية ودقيقة. تقييم شامل للعقارات السكنية والتجارية.', keyword: 'تقييم عقاري' },
      re_marketing: { title: 'التسويق العقاري | D Arrow', description: 'خدمات تسويق عقاري متكاملة. تصوير احترافي، إعلانات رقمية، وجولات افتراضية.', keyword: 'تسويق عقاري' },
      re_management: { title: 'إدارة الأملاك | D Arrow', description: 'خدمات إدارة أملاك احترافية. إدارة الإيجارات، صيانة، وتقارير مالية.', keyword: 'إدارة أملاك' },
      re_photography: { title: 'التصوير العقاري | D Arrow', description: 'تصوير عقاري احترافي بجودة عالية. تصوير فوتوغرافي، فيديو، وجولات 360 درجة.', keyword: 'تصوير عقاري' },
      re_campaign: { title: 'الحملات العقارية | D Arrow', description: 'حملات تسويقية متخصصة للقطاع العقاري. إعلانات رقمية، محتوى عقاري، واستهداف دقيق.', keyword: 'حملات عقارية' },
      re_project_images: { title: 'تصوير المشاريع | D Arrow', description: 'تصوير مشاريع عقارية ومعمارية بجودة احترافية. تصوير جوي، داخلي، وخارجي.', keyword: 'تصوير مشاريع' },
      re_current_eval: { title: 'تقييم الوضع الحالي | D Arrow', description: 'تقييم شامل للوضع الحالي لمشروعك العقاري. تحليل السوق، المنافسين، ونقاط القوة.', keyword: 'تقييم عقاري' },
      re_project_naming: { title: 'تسمية المشاريع | D Arrow', description: 'خدمة تسمية المشاريع العقارية. اختيار اسم مميز وجذاب يعكس هوية مشروعك.', keyword: 'تسمية مشاريع' },
    };

    let syncedCount = 0;

    for (const slug of routes) {
      // Create or update the route in SeoMeta
      let meta = await prisma.seoMeta.findUnique({ where: { slug } });
      
      // Get proper defaults for this slug
      const serviceKey = slug.replace('/services/', '');
      const defaults = PAGE_DEFAULTS[slug] || SERVICE_DEFAULTS[serviceKey] || {
        title: `D Arrow | ${slug}`,
        description: 'D Arrow - وكالة تسويق رقمي متكاملة',
        keyword: slug.replace('/', '').replace('-', ' '),
      };
      
      if (!meta) {
        meta = await prisma.seoMeta.create({
          data: {
            slug,
            title: defaults.title,
            description: defaults.description,
            focusKeyword: defaults.keyword,
            robots: 'index, follow',
          }
        });
      }

      // Try fetching the live content to evaluate
      try {
        const res = await fetch(`${baseUrl}${slug}`, { 
          // Use a short timeout to prevent hanging the dev server
          signal: AbortSignal.timeout(5000) 
        });
        
        if (res.ok) {
          const html = await res.text();
          // Extract body text roughly
          const bodyTextMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
          const bodyText = bodyTextMatch ? bodyTextMatch[1] : html;
          
          const analysis = analyzeContent(
            bodyText,
            meta.title || '',
            meta.description || '',
            meta.focusKeyword || '',
            slug
          );

          // Save Audit Log
          await prisma.seoAuditLog.create({
            data: {
              seoMetaId: meta.id,
              score: analysis.score,
              issuesCount: analysis.suggestions.length,
              suggestions: JSON.stringify(analysis.suggestions)
            }
          });
          syncedCount++;
        }
      } catch (err) {
        console.warn(`Failed to fetch ${slug} for SEO analysis during sync`, err);
        // Even if fetch fails, we created the SeoMeta entry
      }
    }

    return NextResponse.json({ success: true, count: routes.length, syncedCount });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ success: false, error: 'Failed to sync pages' }, { status: 500 });
  }
}
