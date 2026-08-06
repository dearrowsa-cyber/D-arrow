import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import BlogPostClient from '@/components/BlogPostClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const FALLBACK_POSTS: Record<string, any> = {
  'seo-saudi-market': {
    id: 'seo-saudi-market',
    title: 'SEO Strategies for Saudi Market Growth',
    titleAr: 'استراتيجيات تحسين محركات البحث لنمو السوق السعودي',
    content: `<p>Search Engine Optimization is critical for businesses operating in the Saudi market. In this comprehensive guide, we explore the key strategies that help brands achieve top rankings on Google in the Kingdom of Saudi Arabia.</p>
    <h2>Understanding the Saudi Search Landscape</h2>
    <p>The Saudi market has unique characteristics that require specialized SEO approaches. With Arabic being the primary language and mobile-first usage dominating, businesses need to optimize for both language and device preferences.</p>
    <h2>Key SEO Pillars for Saudi Arabia</h2>
    <p><strong>1. Arabic Content Excellence:</strong> High-quality, culturally relevant Arabic content that resonates with Saudi audiences.</p>
    <p><strong>2. Local SEO Optimization:</strong> Google Business Profile setup, local citations, and Riyadh/Al-Ahsa region targeting.</p>
    <p><strong>3. Mobile-First Indexing:</strong> Over 90% of Saudi searches happen on mobile devices — your site must be lightning-fast on mobile.</p>
    <p><strong>4. Technical SEO:</strong> Core Web Vitals, HTTPS, and structured data (Schema.org) tailored for Arabic RTL layouts.</p>
    <h2>How D-Arrow Can Help</h2>
    <p>At D-Arrow Digital, we implement proven SEO strategies that have helped Saudi brands achieve measurable growth in organic traffic and conversions.</p>`,
    contentAr: `<p>يعد تحسين محركات البحث أمرًا بالغ الأهمية للشركات العاملة في السوق السعودي. في هذا الدليل الشامل، نستكشف الاستراتيجيات الأساسية التي تساعد العلامات التجارية على تحقيق تصنيفات متقدمة في جوجل في المملكة العربية السعودية.</p>
    <h2>فهم بيئة البحث السعودية</h2>
    <p>يتمتع السوق السعودي بخصائص فريدة تتطلب مناهج متخصصة في تحسين محركات البحث. مع كون اللغة العربية هي اللغة الأساسية وهيمنة استخدام الهواتف المحمولة، تحتاج الشركات إلى التحسين لكل من تفضيلات اللغة والجهاز.</p>
    <h2>أعمدة تحسين محركات البحث الأساسية للسعودية</h2>
    <p><strong>١. تميز المحتوى العربي:</strong> محتوى عربي عالي الجودة وذو صلة ثقافية يلقى صدى لدى الجمهور السعودي.</p>
    <p><strong>٢. تحسين تحسين محركات البحث المحلي:</strong> إعداد ملف أعمال جوجل، الاستشهادات المحلية، واستهداف منطقة الرياض/الأحساء.</p>
    <p><strong>٣. فهرسة الجوال أولاً:</strong> أكثر من ٩٠٪ من عمليات البحث السعودية تتم على أجهزة الجوال — يجب أن يكون موقعك سريعًا جدًا على الجوال.</p>
    <p><strong>٤. تحسين محركات البحث التقني:</strong> مقاييس الويب الأساسية، بروتوكول HTTPS، والبيانات المنظمة (Schema.org) المصممة لتخطيطات اللغة العربية من اليمين إلى اليسار.</p>
    <h2>كيف يمكن لدي آرو المساعدة</h2>
    <p>في دي آرو الرقمية، نطبق استراتيجيات تحسين محركات البحث المثبتة التي ساعدت العلامات التجارية السعودية على تحقيق نمو قابل للقياس في الزيارات العضوية والتحويلات.</p>`,
    excerpt: 'Learn the essential SEO strategies tailored for the Saudi market including Arabic optimization, local SEO, and mobile-first approaches.',
    excerptAr: 'تعلم استراتيجيات تحسين محركات البحث الأساسية المصممة للسوق السعودي بما في ذلك التحسين العربي، تحسين محركات البحث المحلي، ومناهج الجوال أولاً.',
    author: 'D-Arrow Team',
    category: 'SEO',
    categoryAr: 'تحسين محركات البحث',
    date: '2026-07-15',
    time: '10:30:00',
    readTime: 8,
    imageUrl: '',
    tags: ['SEO', 'السعودية', 'Digital Marketing', 'التسويق الرقمي'],
    status: 'published',
    createdAt: '2026-07-15T10:30:00.000Z',
    updatedAt: '2026-07-15T10:30:00.000Z',
    isGated: false,
    ctaType: 'seo',
    slug: 'seo-saudi-market',
  },
  'social-media-2026': {
    id: 'social-media-2026',
    title: 'Social Media Marketing Trends in Saudi Arabia 2026',
    titleAr: 'اتجاهات التسويق عبر وسائل التواصل الاجتماعي في السعودية ٢٠٢٦',
    content: `<p>The social media landscape in Saudi Arabia continues to evolve at a rapid pace. In 2026, we're seeing several key trends that brands need to leverage to stay competitive.</p>
    <h2>Platform Priorities for 2026</h2>
    <p><strong>Instagram:</strong> Remains the king of engagement in Saudi Arabia with Reels driving massive reach.</p>
    <p><strong>TikTok:</strong> Short-form video consumption continues to grow exponentially, especially among Gen Z and millennial Saudis.</p>
    <p><strong>Snapchat:</strong> Strong daily usage among Saudi youth for Stories and AR experiences.</p>
    <p><strong>X (Twitter):</strong> Important for news, customer service, and trending conversations in the Saudi business community.</p>
    <h2>Content Trends to Watch</h2>
    <p><strong>1. Short-Form Video Dominance:</strong> Reels, Shorts, and TikToks now account for 70% of social content consumed.</p>
    <p><strong>2. Influencer Marketing 2.0:</strong> Micro-influencers (10K-100K followers) deliver 2x higher engagement rates than mega-influencers.</p>
    <p><strong>3. Live Shopping & Commerce:</strong> Social commerce via Instagram Shop and TikTok Shop is the fastest-growing sales channel.</p>
    <p><strong>4. AI-Generated Personalization:</strong> Tailored content recommendations powered by AI for each user segment.</p>
    <h2>Why Choose D-Arrow for Social Media?</h2>
    <p>D-Arrow Digital specializes in Saudi-specific social media strategies. We create content in both Arabic and English, manage influencer partnerships, and run data-driven ad campaigns that deliver measurable ROI.</p>`,
    contentAr: `<p>تواصل مشهد وسائل التواصل الاجتماعي في المملكة العربية السعودية بالتطور بوتيرة سريعة. في عام ٢٠٢٦، نرى عدة اتجاهات رئيسية تحتاج العلامات التجارية إلى الاستفادة منها للبقاء في منافسة قوية.</p>
    <h2>أولويات المنصات لعام ٢٠٢٦</h2>
    <p><strong>إنستغرام:</strong> يظل ملك التفاعل في المملكة العربية السعودية حيث تقود Reels الوصول الشامل.</p>
    <p><strong>تيك توك:</strong> يستمر استهلاك الفيديو القصير في النمو بشكل هائل، خاصة بين جيل الزي والجيل الألفي السعوديين.</p>
    <p><strong>سناب شات:</strong> استخدام يومي قوي بين الشباب السعودي للقصص وتجارب الواقع المعزز.</p>
    <p><strong>اكس (تويتر):</strong> مهم للأخبار، خدمة العملاء، والمحادثات الرائجة في مجتمع الأعمال السعودي.</p>
    <h2>اتجاهات المحتوى التي يجب مراقبتها</h2>
    <p><strong>١. هيمنة الفيديو القصير:</strong> تمثل Reels و Shorts و TikToks الآن ٧٠٪ من محتوى التواصل الاجتماعي المستهلك.</p>
    <p><strong>٢. التسويق عبر المؤثرين الإصدار ٢.٠:</strong> يحقق المؤثرون الصغار (١٠ ألف-١٠٠ ألف متابع) معدلات تفاعل أعلى بمرتين من المؤثرين الكبار.</p>
    <p><strong>٣. البيع المباشر والتجارة عبر وسائل التواصل:</strong> التجارة الاجتماعية عبر متجر إنستغرام ومتجر تيك توك هي قناة المبيعات الأسرع نموًا.</p>
    <p><strong>٤. التخصيص المدعوم بالذكاء الاصطناعي:</strong> توصيات محتوى مخصصة مدعومة بالذكاء الاصطناعي لكل جزء من المستخدمين.</p>
    <h2>لماذا تختار دي آرو لوسائل التواصل الاجتماعي؟</h2>
    <p>تتخصص دي آرو الرقمية في استراتيجيات وسائل التواصل الاجتماعي الخاصة بالسوق السعودي. ننشئ المحتوى باللغتين العربية والإنجليزية، وندير شراكات المؤثرين، وندير حملات إعلانية مبنية على البيانات تحقق عائد استثماري قابل للقياس.</p>`,
    excerpt: 'Discover the top social media marketing trends, platform priorities, and content strategies for Saudi brands in 2026.',
    excerptAr: 'اكتشف أفضل اتجاهات التسويق عبر وسائل التواصل الاجتماعي وأولويات المنصات واستراتيجيات المحتوى للعلامات التجارية السعودية في عام ٢٠٢٦.',
    author: 'D-Arrow Social Team',
    category: 'Social Media',
    categoryAr: 'وسائل التواصل الاجتماعي',
    date: '2026-07-20',
    time: '14:00:00',
    readTime: 6,
    imageUrl: '',
    tags: ['Social Media', 'وسائل التواصل', 'Instagram', 'TikTok', 'Trends 2026'],
    status: 'published',
    createdAt: '2026-07-20T14:00:00.000Z',
    updatedAt: '2026-07-20T14:00:00.000Z',
    isGated: false,
    ctaType: 'smm',
    slug: 'social-media-2026',
  },
  'ecommerce-saudi-payment': {
    id: 'ecommerce-saudi-payment',
    title: 'E-Commerce in Saudi Arabia: Payment Gateways & Growth',
    titleAr: 'التجارة الإلكترونية في السعودية: بوابات الدفع والنمو',
    content: `<p>Saudi Arabia's e-commerce market is projected to exceed 57 billion SAR by 2026. Understanding payment preferences and user experience is crucial for online success.</p>
    <h2>Payment Methods Saudi Shoppers Prefer</h2>
    <p><strong>1. Mada (ATM):</strong> The most popular debit card in Saudi Arabia — must have for any e-commerce store.</p>
    <p><strong>2. Apple Pay:</strong> Fast-growing contactless payment method, especially among younger demographics.</p>
    <p><strong>3. Buy Now Pay Later (BNPL):</strong> Tabby and Tamara have become essential payment options, driving 30%+ conversion uplift.</p>
    <p><strong>4. STC Pay:</strong> Mobile wallet with wide adoption across the Kingdom.</p>
    <p><strong>5. Bank Transfer:</strong> Still preferred by 25% of customers for high-value purchases.</p>
    <h2>Key E-Commerce UX Principles for KSA</h2>
    <p><strong>• Arabic-first:</strong> RTL-optimized checkout and product pages with primary Arabic content.</p>
    <p><strong>• Fast Loading:</strong> Under 2 seconds page load time — bounce rate increases 50% for slower sites.</p>
    <p><strong>• Saudi Riyal (SAR):</strong> Display prices in local currency, no USD defaults.</p>
    <p><strong>• Address Verification:</strong> Integration with Saudi Post (Wasel) addresses and National Address system.</p>
    <h2>The D-Arrow E-Commerce Advantage</h2>
    <p>Our flagship Saudi E-Commerce Store Template comes pre-configured with all payment gateways (Mada, Apple Pay, Tabby, Tamara), RTL Arabic support, and is optimized for the Saudi market. Launch your store in days, not months.</p>`,
    contentAr: `<p>من المتوقع أن يتجاوز سوق التجارة الإلكترونية في المملكة العربية السعودية ٥٧ مليار ريال سعودي بحلول عام ٢٠٢٦. يعد فهم تفضيلات الدفع وتجربة المستخدم أمرًا بالغ الأهمية للنجاح عبر الإنترنت.</p>
    <h2>طرق الدفع التي يفضلها المتسوقون السعوديون</h2>
    <p><strong>١. مدى:</strong> بطاقة الخصم الأكثر شيوعًا في المملكة العربية السعودية — يجب أن تتوفر في أي متجر إلكتروني.</p>
    <p><strong>٢. أبل باي:</strong> طريقة دفع بدون تلامس سريعة النمو، خاصة بين الفئات العمرية الأصغر.</p>
    <p><strong>٣. اشترِ الآن وادفع لاحقًا:</strong> أصبحت تابي وتمارا خيارات دفع أساسية، مما دفع معدل التحويل بما يزيد عن ٣٠٪.</p>
    <p><strong>٤. STC باي:</strong> محفظة جوال باعتماد واسع عبر المملكة.</p>
    <p><strong>٥. التحويل البنكي:</strong> لا يزال يفضله ٢٥٪ من العملاء للمشتريات عالية القيمة.</p>
    <h2>مبادئ تجربة المستخدم الأساسية للتجارة الإلكترونية في المملكة العربية السعودية</h2>
    <p><strong>• العربية أولاً:</strong> صفحات الدفع والمنتجات المحسنة لاتجاه النص من اليمين إلى اليسار مع محتوى عربي أساسي.</p>
    <p><strong>• تحميل سريع:</strong> وقت تحميل الصفحة أقل من ثانيتين — يزيد معدل الارتداد ٥٠٪ للمواقع الأبطأ.</p>
    <p><strong>• الريال السعودي:</strong> عرض الأسعار بالعملة المحلية، ولا استخدام افتراضي للدولار الأمريكي.</p>
    <p><strong>• التحقق من العنوان:</strong> التكامل مع عناوين البريد السعودي (واصل) ونظام العنوان الوطني.</p>
    <h2>ميزة دي آرو في التجارة الإلكترونية</h2>
    <p>يأتي قالب المتجر الإلكتروني السعودي الرائد لدينا مجهز مسبقًا بجميع بوابات الدفع (مدى، أبل باي، تابي، تمارا)، ودعم اللغة العربية، ومحسّن للسوق السعودي. أطلق متجرك في أيام وليس أشهرًا.</p>`,
    excerpt: 'Everything Saudi e-commerce brands need to know about payment gateways, UX optimization, and growth in 2026.',
    excerptAr: 'كل ما تحتاج إليه العلامات التجارية السعودية للتجارة الإلكترونية لمعرفة بوابات الدفع وتحسين تجربة المستخدم والنمو في عام ٢٠٢٦.',
    author: 'D-Arrow E-Commerce Team',
    category: 'E-Commerce',
    categoryAr: 'التجارة الإلكترونية',
    date: '2026-08-01',
    time: '09:15:00',
    readTime: 7,
    imageUrl: '',
    tags: ['E-Commerce', 'التجارة الإلكترونية', 'Mada', 'Apple Pay', 'Tamara', 'Tabby'],
    status: 'published',
    createdAt: '2026-08-01T09:15:00.000Z',
    updatedAt: '2026-08-01T09:15:00.000Z',
    isGated: false,
    ctaType: 'web',
    slug: 'ecommerce-saudi-payment',
  },
  'branding-saudi-vision-2030': {
    id: 'branding-saudi-vision-2030',
    title: 'Building Strong Brands Aligned with Saudi Vision 2030',
    titleAr: 'بناء علامات تجارية قوية متوافقة مع رؤية السعودية ٢٠٣٠',
    content: `<p>Saudi Vision 2030 has transformed the business landscape, creating unprecedented opportunities for brands that align with the Kingdom's ambitious goals.</p>
    <h2>Key Vision 2030 Pillars for Brands</h2>
    <p><strong>• Quality of Life:</strong> Brands focused on entertainment, wellness, and lifestyle experiences.</p>
    <p><strong>• A Vibrant Society:</strong> Culture, heritage, sports, and entertainment sectors growing rapidly.</p>
    <p><strong>• A Thriving Economy:</strong> SME support, entrepreneurship, and diversification beyond oil.</p>
    <p><strong>• An Ambitious Nation:</strong> Digital transformation, innovation, and global competitiveness.</p>
    <h2>Brand Strategy Tips for 2030 Alignment</h2>
    <p>1. <strong>Speak the Vision Language:</strong> Incorporate Vision 2030 themes into your brand narrative authentically.</p>
    <p>2. <strong>Embrace Digital Transformation:</strong> Brands with strong digital presence capture the Saudi youth market.</p>
    <p>3. <strong>Support Local Talent:</strong> Highlight your commitment to Saudi employment and skills development.</p>
    <p>4. <strong>Sustainability & Social Impact:</strong> ESG (Environmental, Social, Governance) initiatives resonate strongly.</p>
    <h2>How D-Arrow Helps Build Vision-Aligned Brands</h2>
    <p>We specialize in creating brand identities and digital presences that resonate with Saudi Vision 2030 goals. From brand strategy to website development, our team delivers results that matter.</p>`,
    contentAr: `<p>لقد حولت رؤية السعودية ٢٠٣٠ المشهد التجاري، وخلقت فرصًا غير مسبوقة للعلامات التجارية التي تتماشى مع أهداف المملكة الطموحة.</p>
    <h2>أعمدة رؤية ٢٠٣٠ الأساسية للعلامات التجارية</h2>
    <p><strong>• جودة الحياة:</strong> العلامات التجارية التي تركز على الترفيه والعافية وتجارب نمط الحياة.</p>
    <p><strong>• مجتمع حيوي:</strong> قطاعات الثقافة والتراث والرياضة والترفيه تنمو بسرعة.</p>
    <p><strong>• اقتصاد مزدهر:</strong> دعم المشاريع الصغيرة والمتوسطة وريادة الأعمال والتنويع بعيدًا عن النفط.</p>
    <p><strong>• أمة طموحة:</strong> التحول الرقمي والابتكار والقدرة التنافسية العالمية.</p>
    <h2>نصائح استراتيجية العلامة التجارية للتوافق مع ٢٠٣٠</h2>
    <p>١. <strong>تحدث لغة الرؤية:</strong> ادمج مواضيع رؤية ٢٠٣٠ في سرد علامتك التجارية بشكل أصيل.</p>
    <p>٢. <strong>احتضن التحول الرقمي:</strong> العلامات التجارية ذات الوجود الرقمي القوي تجتذب سوق الشباب السعودي.</p>
    <p>٣. <strong>ادعم المواهب المحلية:</strong> سلط الضوء على التزامك بالتوظيف السعودي وتطوير المهارات.</p>
    <p>٤. <strong>الاستدامة والأثر الاجتماعي:</strong> تردد مبادرات الحوكمة البيئية والاجتماعية والحوكمة صدىً قويًا.</p>
    <h2>كيف تساعد دي آرو في بناء علامات تجارية متوافقة مع الرؤية</h2>
    <p>نتخصص في إنشاء هويات العلامات التجارية والوجود الرقمي الذي يلقى صدىً مع أهداف رؤية السعودية ٢٠٣٠. من استراتيجية العلامة التجارية إلى تطوير المواقع، يقدم فريقنا النتائج التي تهم.</p>`,
    excerpt: 'How to build brands that leverage Saudi Vision 2030 pillars, tap into national pride, and connect with the Saudi market authentically.',
    excerptAr: 'كيفية بناء علامات تجارية تستفيد من أعمدة رؤية السعودية ٢٠٣٠ وتستغل الفخر الوطني وتتواصل مع السوق السعودي بشكل أصيل.',
    author: 'D-Arrow Brand Strategy',
    category: 'Branding',
    categoryAr: 'الهوية التجارية',
    date: '2026-07-28',
    time: '16:45:00',
    readTime: 5,
    imageUrl: '',
    tags: ['Branding', 'الهوية التجارية', 'Vision 2030', 'رؤية 2030', 'Saudi Arabia'],
    status: 'published',
    createdAt: '2026-07-28T16:45:00.000Z',
    updatedAt: '2026-07-28T16:45:00.000Z',
    isGated: false,
    ctaType: 'default',
    slug: 'branding-saudi-vision-2030',
  },
};

// Generate dynamic SEO metadata for each blog post
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  let post: any = null;

  try {
    post = await prisma.blogPost.findUnique({ where: { id } });
  } catch {
    post = null;
  }

  if (!post && FALLBACK_POSTS[id]) {
    post = FALLBACK_POSTS[id];
  }

  if (!post) return { title: 'مقال غير موجود | D Arrow' };

  const title = post.titleAr || post.title;
  const description = post.excerptAr || post.excerpt || (post.contentAr || post.content || '').substring(0, 160);
  const tags: string[] = typeof post.tags === 'string' && post.tags ? JSON.parse(post.tags) : (post.tags || []);
  const keywords = [
    post.category,
    ...(post.categoryAr ? [post.categoryAr] : []),
    ...tags,
    'دي آرو',
    'D Arrow',
    'تسويق رقمي',
    'digital marketing',
  ].join(', ');

  return {
    title: `${title} | D Arrow`,
    description,
    keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title,
      description,
      url: `https://d-arrow.com/blog/${post.id}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags,
      images: post.imageUrl
        ? [{ url: post.imageUrl, width: 1200, height: 630, alt: title }]
        : [{ url: 'https://d-arrow.com/og-image.jpg', width: 1200, height: 630, alt: 'D Arrow Blog' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
    alternates: {
      canonical: `https://d-arrow.com/blog/${post.id}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let post: any = null;

  try {
    const rawPost = await prisma.blogPost.findUnique({ where: { id } });
    if (rawPost) {
      post = {
        ...rawPost,
        tags: rawPost.tags ? JSON.parse(rawPost.tags) : [],
        createdAt: rawPost.createdAt.toISOString(),
        updatedAt: rawPost.updatedAt.toISOString(),
      };
    }
  } catch (error) {
    console.error('Error fetching single blog post, trying fallback:', error);
  }

  if (!post && FALLBACK_POSTS[id]) {
    post = FALLBACK_POSTS[id];
  }

  if (!post) return notFound();

  const tags: string[] = Array.isArray(post.tags) ? post.tags : [];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titleAr || post.title,
    description: post.excerptAr || post.excerpt || '',
    image: post.imageUrl || 'https://d-arrow.com/og-image.jpg',
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://d-arrow.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'D Arrow',
      url: 'https://d-arrow.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://d-arrow.com/logo-darrow.png',
      },
    },
    datePublished: post.date,
    dateModified: post.updatedAt || post.createdAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://d-arrow.com/blog/${post.id}`,
    },
    keywords: tags.join(', '),
    articleSection: post.category,
    inLanguage: ['ar', 'en'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient post={post} />
    </>
  );
}
