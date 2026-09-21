"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Star,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  CreditCard,
  Zap,
  Lock,
  ExternalLink,
  Bot,
  Building2,
  Server,
  ShoppingBag,
  Clock,
  Code2,
  Layers,
  HelpCircle,
  MessageCircle,
  Flame,
  CheckCircle2,
  Minus,
  Plus,
  Share2,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useCart } from "@/components/store/CartContext";

export interface DetailedProduct {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  category: "templates" | "realestate" | "payments" | "ai" | "hosting";
  categoryNameAr: string;
  categoryNameEn: string;
  categoryIcon: any;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  ordersCount: number;
  badge?: string;
  badgeIcon?: any;
  badgeColor?: string;
  image: string;
  summaryAr: string;
  summaryEn: string;
  descriptionAr: string;
  descriptionEn: string;
  demoUrl?: string;
  deliveryTimeAr: string;
  deliveryTimeEn: string;
  techStack: string[];
  keyBenefitsAr: { title: string; desc: string }[];
  keyBenefitsEn: { title: string; desc: string }[];
  featuresAr: string[];
  featuresEn: string[];
  faqsAr: { q: string; a: string }[];
  faqsEn: { q: string; a: string }[];
}

const toReadableText = (value: unknown) => {
  if (typeof value !== "string") return "";

  if (typeof document === "undefined") {
    return value.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").trim();
  }

  const container = document.createElement("div");
  container.innerHTML = value;
  return (container.textContent || "").replace(/\u00a0/g, " ").trim();
};

const PRODUCTS_DATABASE: Record<string, DetailedProduct> = {
  "saudi-ecommerce-store-template": {
    id: "saudi-ecommerce-store-template",
    slug: "saudi-ecommerce-store-template",
    name: "Saudi E-Commerce Store System & Template",
    nameAr: "نظام وقالب المتجر الإلكتروني السعودي المتكامل",
    category: "templates",
    categoryNameAr: "قوالب المتاجر الإلكترونية",
    categoryNameEn: "E-Commerce Templates",
    categoryIcon: ShoppingBag,
    price: 349,
    originalPrice: 699,
    rating: 4.9,
    reviewsCount: 142,
    ordersCount: 380,
    badge: "الأكثر طلباً ومبيعاً",
    badgeIcon: Flame,
    badgeColor: "from-[#FF4D6D] to-[#FF9A3C]",
    image: "/store/ecommerce.jpg",
    summaryAr:
      "حل برمجي متكامل لبناء متجر إلكتروني سعودي فائق السرعة، مجهز ببوابات الدفع الوطنية وسلة شراء سريعة ولوحة تحكم حية للتاجر.",
    summaryEn:
      "Complete turnkey Saudi e-commerce system with sub-second page speed, built-in Mada, Apple Pay, Tamara, Tabby, and merchant dashboard.",
    descriptionAr:
      "تم تصميم نظام وقالب المتجر الإلكتروني السعودي من دي آرو ليوفر للتجار ورواد الأعمال في المملكة العربية السعودية منصة تجارة رقمية متطورة وفائقة السرعة. النظام مجهز بالكامل للربط مع بوابات الدفع الوطنية (مدى، Apple Pay، تمارا، تابي)، مع تصميم مخصص لتجربة المستخدم العربي على الجوال، وسلة شراء تسويقية مجهزة لرفع معدل التحويل (Conversion Rate). يشمل النظام كود المصدر النظيف ولوحة تحكم إدارية متقدمة لإدارة المنتجات والطلبات والعملاء والكوبونات الترويجية.",
    descriptionEn:
      "Engineered specifically for the Saudi market, this full-stack e-commerce solution provides sub-second page loads, integrated Saudi payment gateways (Mada, Apple Pay, Tamara, Tabby), and a high-converting 1-click checkout experience. Includes full merchant admin control, coupon management, and instant deployment support.",
    demoUrl: "/demo/store",
    deliveryTimeAr: "تسليم فوري للأكواد ودليل التثبيت خلال 24 ساعة",
    deliveryTimeEn: "Instant source code delivery & setup guide in 24h",
    techStack: [
      "Next.js 16",
      "React 19",
      "Tailwind CSS",
      "Prisma ORM",
      "Mada & Apple Pay Gateway",
      "Stripe / HyperPay",
    ],
    keyBenefitsAr: [
      {
        title: "بوابات دفع سعودية مدمجة",
        desc: "دعم كامل ومباشر لبطاقات مدى، Apple Pay، فيزا، ماستركارد، وتقسيط تابي وتمارا بدون فوائد.",
      },
      {
        title: "سلة شراء سريعة 1-Click Checkout",
        desc: "سلسلة دفع مبسطة من صفحة واحدة ترفع نسبة إتمام الطلبات وتقضي على هجر سلات الشراء.",
      },
      {
        title: "لوحة تحكم شاملة للتاجر",
        desc: "إدارة المخزون، الطلبات، أكواد الخصم، تقارير المبيعات، وبيانات العملاء في مكان واحد.",
      },
      {
        title: "سرعة استجابة فائقة وتحسين الجوال",
        desc: "أداء 95+ على Google PageSpeed وتجربة تصفح سلسة مصممة خصيصاً لمستخدمي الهواتف الذكية.",
      },
    ],
    keyBenefitsEn: [
      {
        title: "Integrated Saudi Payments",
        desc: "Native support for Mada, Apple Pay, Visa, Mastercard, and 0% interest Tamara & Tabby installments.",
      },
      {
        title: "1-Click Fast Checkout",
        desc: "Streamlined single-page checkout flow designed to minimize cart abandonment and maximize ROI.",
      },
      {
        title: "Merchant Management Hub",
        desc: "Real-time inventory management, order processing, coupon codes, and financial analytics.",
      },
      {
        title: "Sub-Second Speed & Mobile First",
        desc: "95+ Google PageSpeed score and ultra-responsive layout tailored for mobile consumers.",
      },
    ],
    featuresAr: [
      "كود مصدري كامل ونظيف 100% قابل للتخصيص والتطوير",
      "بوابات دفع سعودية جاهزة (مدى، أبل باي، تمارا، تابي)",
      "سلة تسوق ذكية مع احتساب رسوم الشحن والضرائب تلقائياً",
      "لوحة تحكم للتاجر لإدارة المنتجات والمخزون والطلبات",
      "نظام كوبونات وأكواد الخصم الترويجية المتقدم",
      "تتبع حالات الطلبات بالفيديو والإشعارات الفورية",
      "متوافق مع محركات البحث SEO وتقنيات Schema Markup للمنتجات",
      "دعم فني مباشر وتثبيت مجاني على استضافتك",
    ],
    featuresEn: [
      "100% full source code with clean architecture",
      "Pre-integrated Saudi payments (Mada, Apple Pay, Tamara, Tabby)",
      "Smart cart with automated tax and shipping calculator",
      "Comprehensive merchant control dashboard",
      "Advanced promotional coupon & voucher engine",
      "Live order tracking & automated customer notifications",
      "Pre-configured SEO & Product Schema Structured Data",
      "Direct technical onboarding & deployment support",
    ],
    faqsAr: [
      {
        q: "هل أحصل على الكود المصدري كاملاً؟",
        a: "نعم، فور إتمام الشراء تستلم كود المصدر كاملاً مع رخصة الاستخدام ودليل التثبيت والتشغيل.",
      },
      {
        q: "هل يمكن ربط بوابات دفع أخرى؟",
        a: "نعم، النظام مبني بهندسة برمجية مرنة تسمح بربط أي بوابة دفع إضافية أو بنك في دقائق.",
      },
      {
        q: "هل يشمل السعر المساعدة في التثبيت؟",
        a: "نعم، يقدم فريق دي آرو الهندسي الدعم الكامل لتثبيت النظام على سيرفرك وتشغيله بنجاح.",
      },
    ],
    faqsEn: [
      {
        q: "Do I get the full source code?",
        a: "Yes, upon checkout you receive the complete unminified source code, documentation, and installation manual.",
      },
      {
        q: "Can I integrate custom payment gateways?",
        a: "Yes, the modular architecture allows easy connection to any banking or payment API.",
      },
      {
        q: "Is deployment assistance included?",
        a: "Yes, D-Arrow engineering team will assist you in deploying and verifying the system on your server.",
      },
    ],
  },
  "saudi-real-estate-platform": {
    id: "saudi-real-estate-platform",
    slug: "saudi-real-estate-platform",
    name: "Saudi Real Estate Platform & Website System",
    nameAr: "نظام ومنصة الموقع العقاري السعودي الحديث",
    category: "realestate",
    categoryNameAr: "الأنظمة والمنصات العقارية",
    categoryNameEn: "Real Estate Systems",
    categoryIcon: Building2,
    price: 399,
    originalPrice: 799,
    rating: 4.9,
    reviewsCount: 88,
    ordersCount: 195,
    badge: "معتمد عقارياً",
    badgeIcon: Building2,
    badgeColor: "from-[#FF9A3C] to-[#FF4D6D]",
    image: "/store/realestate.jpg",
    summaryAr:
      "منصة عقارية متكاملة مخصصة للسوق السعودي، لعرض العقارات والمشاريع، خرائط جوجل تفاعلية، وفلترة حسب الأحياء وحجز المعاينات.",
    summaryEn:
      "Enterprise real estate portal template for Saudi developers & brokers with live Google Maps search, district filtering, and tour booking.",
    descriptionAr:
      "منصة برمجية متخصصة ومصممة للشركات العقارية والمطورين والوسطاء في المملكة العربية السعودية. تتيح عرض الفلل، الشقق، الأراضي، والمشاريع الكبرى بنظام تفاعلي يشمل البحث والفلترة حسب المدن والأحياء، مع خرائط قوقل التفاعلية المدمجة ونموذج استقبال وحجز مواعيد المعاينات تلقائياً. المنصة متوافقة مع متطلبات الهيئة العامة للعقار ورخص فال.",
    descriptionEn:
      "A high-performance real estate portal engineered for developers and agencies in Saudi Arabia. Features interactive Google Maps exploration, granular district filtering, automated viewing appointments, and 360 virtual tour integration.",
    demoUrl: "/demo/real-estate",
    deliveryTimeAr: "تسليم وتشغيل فوري خلال ساعات",
    deliveryTimeEn: "Instant deployment ready in hours",
    techStack: [
      "Next.js 16",
      "Google Maps API",
      "Tailwind CSS",
      "PostgreSQL / SQLite",
      "Prisma",
    ],
    keyBenefitsAr: [
      {
        title: "خرائط تفاعلية دقيقة",
        desc: "ربط مباشر مع Google Maps لاستعراض العقارات والخدمات المحيطة بالحي بضغطة زر.",
      },
      {
        title: "حجز المعاينات آلياً",
        desc: "جدولة مواعيد زيارة العقارات واستقبال بيانات العملاء المهتمين مباشرة إلى لوحة التحكم والواتساب.",
      },
      {
        title: "معرض وسائط متعددة و 360°",
        desc: "عرض صور العقار بدقة عالية وفيديوهات وجولات افتراضية 360 درجة لإبهار المشتري.",
      },
      {
        title: "فلترة متقدمة ومطابقة الطلبات",
        desc: "تصنيف بالنوع (بيع/إيجار)، عدد الغرف، المساحة، السعر، ورقم ترخيص الإعلان العقاري.",
      },
    ],
    keyBenefitsEn: [
      {
        title: "Interactive Map Search",
        desc: "Granular Google Maps integration to explore listings and surrounding neighborhood amenities.",
      },
      {
        title: "Automated Viewing Scheduler",
        desc: "Direct tour booking forms sending instant lead notifications to WhatsApp and admin CRM.",
      },
      {
        title: "HD Media & 360° Virtual Tours",
        desc: "Showcase properties with high-resolution photo galleries and 360-degree interactive video.",
      },
      {
        title: "Advanced Granular Filters",
        desc: "Filter by property type, bedroom count, square footage, budget, and Fal license compliance.",
      },
    ],
    featuresAr: [
      "نظام تصنيف متقدم للفلل والشقق والأراضي والمشاريع التجارية",
      "خرائط Google Maps تفاعلية مع نقاط تحديد مواقع العقارات",
      "نموذج حجز معاينة وتواصل مباشر عبر الواتساب والاتصال",
      "لوحة تحكم لإضافة العقارات وتحديد المساحات والأسعار والترخيص",
      "حاسبة التمويل العقاري التقديرية المدمجة",
      "تصميم فاخر متجاوب مع الهواتف الذكية والأجهزة اللوحية",
    ],
    featuresEn: [
      "Granular property categorization (Villas, Apartments, Lands, Compounds)",
      "Integrated Google Maps with custom property location pins",
      "Direct viewing request & WhatsApp lead generation widgets",
      "Admin portal for adding properties, licensing, specs & pricing",
      "Built-in estimated mortgage & payment calculator",
      "Luxury mobile-responsive dark and light theme layout",
    ],
    faqsAr: [
      {
        q: "هل النظام متوافق مع شروط الهيئة العامة للعقار؟",
        a: "نعم، يحتوي على حقول مخصصة لرقم ترخيص فال ورقم المعلن العقاري وبيانات الصك.",
      },
      {
        q: "هل يدعم استيراد العقارات وتحديثها؟",
        a: "نعم، يمكن إضافة وتعديل العقارات بسهولة تامة عبر لوحة التحكم المرفقة.",
      },
    ],
    faqsEn: [
      {
        q: "Is the platform compliant with Saudi Real Estate Authority (REGA)?",
        a: "Yes, it includes designated fields for Fal advertiser licenses and property deed validation.",
      },
      {
        q: "Can I easily manage properties?",
        a: "Yes, the dedicated admin panel provides complete control over listings, photos, and inquiries.",
      },
    ],
  },
  "payment-gateways-integration-pack": {
    id: "payment-gateways-integration-pack",
    slug: "payment-gateways-integration-pack",
    name: "Saudi Payment Gateways & Checkout Engine",
    nameAr: "نظام بوابات الدفع والربط المالي السعودي",
    category: "payments",
    categoryNameAr: "بوابات الدفع والربط المالي",
    categoryNameEn: "Payment Gateways",
    categoryIcon: CreditCard,
    price: 249,
    originalPrice: 499,
    rating: 5.0,
    reviewsCount: 112,
    ordersCount: 290,
    badge: "ربط بنكي معتمد",
    badgeIcon: CreditCard,
    badgeColor: "from-[#FF4D6D] to-[#FF9A3C]",
    image: "/store/payments.jpg",
    summaryAr:
      "نظام ربط بنكي ومالي آمن ومباشر لجميع طرق الدفع السعودية (مدى، Apple Pay، فيزا، تمارا، تابي) مع تشفير بنكي 256-bit.",
    summaryEn:
      "Enterprise payment integration engine supporting Mada, Apple Pay, Visa, Mastercard, Tamara & Tabby with 256-bit encryption.",
    descriptionAr:
      "محرك الربط المالي وبوابات الدفع السعودية الشامل، يتيح لك تفعيل التحصيل الإلكتروني لموقعك أو متجرك في وقت قياسي. يدعم مدى الوطنية، Apple Pay بلمسة واحدة، بطاقات الائتمان، بالإضافة إلى دمج حلول الشراء الآن والدفع لاحقاً (تمارا وتابي) لرفع مبيعاتك بنسبة تتجاوز 40%.",
    descriptionEn:
      "The definitive Saudi payment engine designed for frictionless checkout. Pre-configured for Mada, 1-touch Apple Pay, credit cards, and installment leaders Tamara and Tabby with bank-grade 256-bit fraud protection.",
    demoUrl: "/demo/store/checkout",
    deliveryTimeAr: "تسليم وتشغيل فوري خلال ساعات",
    deliveryTimeEn: "Instant integration modules delivered",
    techStack: [
      "Node.js",
      "Next.js",
      "REST Webhooks",
      "Stripe / HyperPay / Moyasar / Geidea",
      "256-Bit SSL",
    ],
    keyBenefitsAr: [
      {
        title: "مدى و Apple Pay فورياً",
        desc: "دفع سلس بلمسة واحدة يرفع نسبة إتمام عمليات الشراء على الهواتف الذكية.",
      },
      {
        title: "تقسيط تمارا وتابي المعتمد",
        desc: "تمكين عملائك من تقسيط مشترياتهم على 4 دفعات بدون فوائد لزيادة متوسط قيمة السلة.",
      },
      {
        title: "تشفير وحماية بنكية 256-Bit",
        desc: "معايير أمان سيبراني عالية تضمن سلامة المعاملات المالية ومكافحة الاحتيال.",
      },
      {
        title: "إشعارات الـ Webhooks والواتساب",
        desc: "تحديث حالة الطلبات تلقائياً فور نجاح الدفع وإرسال الفاتورة للعميل مباشرة.",
      },
    ],
    keyBenefitsEn: [
      {
        title: "Native Mada & Apple Pay",
        desc: "Frictionless 1-touch mobile payments that significantly reduce checkout abandonment.",
      },
      {
        title: "Tamara & Tabby Installments",
        desc: "Allow customers to split purchases into 4 interest-free payments to boost average order value.",
      },
      {
        title: "256-Bit Bank-Grade Security",
        desc: "Enterprise SSL encryption and fraud detection keeping customer financial data secure.",
      },
      {
        title: "Automated Webhooks & Alerts",
        desc: "Instant order state synchronization and automated WhatsApp/email payment receipts.",
      },
    ],
    featuresAr: [
      "وحدات ربط برمجية مسبقة الإعداد لبوابات الدفع السعودية",
      "واجهة Checkout عصرية متوافقة مع الهواتف الذكية",
      "معالجة آمنة لـ Webhooks والتحقق المالي المزدوج",
      "حساب تلقائي لضريبة القيمة المضافة VAT ورسوم الشحن",
      "لوحة تتبع المعاملات المالية وحالات الدفع الناجحة والفاشلة",
    ],
    featuresEn: [
      "Pre-built drop-in payment modules for Saudi processors",
      "High-converting modern mobile-friendly checkout UI",
      "Secure webhook handler with signature verification",
      "Automated VAT and dynamic shipping fee calculations",
      "Transaction monitoring dashboard with live success logs",
    ],
    faqsAr: [
      {
        q: "ما هي بوابات الدفع المدعومة؟",
        a: "يدعم ميسر (Moyasar)، هايبر باي (HyperPay)، جيديا (Geidea)، سترايب (Stripe)، تمارا، وتابي.",
      },
      {
        q: "هل يتطلب إعدادات معقدة؟",
        a: "لا، نوفر إعدادات واضحة وسريعة عبر ملف .env دون الحاجة لكتابة كود من الصفر.",
      },
    ],
    faqsEn: [
      {
        q: "Which payment gateways are supported?",
        a: "Supports Moyasar, HyperPay, Geidea, Stripe, Tamara, and Tabby.",
      },
      {
        q: "Is setup complicated?",
        a: "No, simple configuration via environment keys without writing custom payment bridges.",
      },
    ],
  },
  "ai-customer-support-bot": {
    id: "ai-customer-support-bot",
    slug: "ai-customer-support-bot",
    name: "D-Arrow AI Customer Support & Sales Chatbot",
    nameAr: "مساعد الذكاء الاصطناعي والمبيعات الذكي 24/7",
    category: "ai",
    categoryNameAr: "حلول الذكاء الاصطناعي والمحادثة",
    categoryNameEn: "AI & Chatbots",
    categoryIcon: Bot,
    price: 299,
    originalPrice: 599,
    rating: 4.8,
    reviewsCount: 76,
    ordersCount: 160,
    badge: "ذكاء اصطناعي 24/7",
    badgeIcon: Bot,
    badgeColor: "from-[#FF4D6D] to-[#FF9A3C]",
    image: "/store/ai-chatbot.jpg",
    summaryAr:
      "شات بوت ذكي مخصص مدرب باللغة العربية والإنجليزية واللهجة السعودية، للرد الفوري على العملاء 24 ساعة، واقتراح المنتجات وتجميع البيانات.",
    summaryEn:
      "Conversational AI chatbot trained on your business catalog to handle customer inquiries 24/7, recommend products, and capture warm leads.",
    descriptionAr:
      "مساعد ذكاء اصطناعي تفاعلي متقدم مصمم خصيصاً لخدمة عملاء الشركات والمتاجر في المملكة. يتم تدريب البوت على بيانات نشاطك التجاري، أسعارك، شروطك وسياساتك، ليرد بطلاقة باللغة العربية الفصحى واللهجة السعودية المحببة على مدار 24 ساعة بدون انقطاع، مع قدرة فائقة على اقتراح المنتجات وجمع بيانات العملاء المؤهلين.",
    descriptionEn:
      "Custom conversational AI agent trained specifically on your brand data, products, and FAQs. Delivers instant 24/7 support in native Saudi dialect, Arabic and English, driving sales conversion and automated lead capture.",
    deliveryTimeAr: "تدريب وتشغيل وربط خلال 24 ساعة",
    deliveryTimeEn: "Trained and integrated in 24h",
    techStack: [
      "OpenAI GPT-4o / Claude 3.5",
      "Next.js",
      "Vector Embeddings",
      "Live Chat Widget",
      "Webhooks",
    ],
    keyBenefitsAr: [
      {
        title: "خدمة عملاء فورية 24/7",
        desc: "رد فوري خلال أقل من ثانية على استفسارات العملاء في أي وقت لضمان عدم ضياع المبيعات.",
      },
      {
        title: "فهم اللهجة السعودية واللغات",
        desc: "تدريب مخصص يفهم المصطلحات السعودية بدقة ويتحدث بأسلوب ودود واحترافي.",
      },
      {
        title: "تجميع بيانات العملاء (Leads)",
        desc: "جمع الاسم، رقم الجوال، والإيميل وتصديرها تلقائياً إلى لوحة التحكم أو بريدك.",
      },
      {
        title: "اقتراح المنتجات الذكي",
        desc: "ترشيح المنتجات الأنسب لطلب العميل وتزويده بروابط الشراء المباشرة داخل المحادثة.",
      },
    ],
    keyBenefitsEn: [
      {
        title: "Instant 24/7 Auto Responses",
        desc: "Sub-second response times to customer inquiries around the clock, boosting sales conversion.",
      },
      {
        title: "Saudi Dialect & Bilingual Mastery",
        desc: "Specialized linguistic training that natively understands Saudi colloquial phrases and English.",
      },
      {
        title: "Automated Lead Capture",
        desc: "Effortlessly collects customer names, phone numbers, and emails into your CRM.",
      },
      {
        title: "Intelligent Product Upsells",
        desc: "Recommends tailored solutions and provides direct product checkout links inside the chat.",
      },
    ],
    featuresAr: [
      "ودجت محادثة عائم أنيق وسهل التثبيت بكود واحد (1-Script Tag)",
      "لوحة تحكم لتدريب الشات بوت وتحديث الأسئلة الشائعة والبيانات",
      "سجل كامل لجميع المحادثات وتقييم رضا العملاء",
      "تكامل مباشر مع الواتساب وقنوات التواصل",
      "تخصيص كامل للألوان والشعار ومظهر الشات بما يتطابق مع هويتك",
    ],
    featuresEn: [
      "Floating embeddable chat widget with 1-line script installation",
      "Knowledge-base training portal for uploading FAQs and catalog docs",
      "Complete conversation history archive and satisfaction analytics",
      "WhatsApp API integration bridge",
      "Full white-label styling (custom colors, logo, and welcome messages)",
    ],
    faqsAr: [
      {
        q: "كيف يتم تدريب الشات بوت على بياناتي؟",
        a: "نقوم بربط البوت بملفات منتجاتك أو رابط موقعك ليتعلم كافة التفاصيل تلقائياً.",
      },
      {
        q: "هل يحتاج لتثبيت برامج خاصة؟",
        a: "لا، يعمل ككود جافاسكريبت بسيط يوضع في موقعك ويعمل فوراً على كافة المتصفحات.",
      },
    ],
    faqsEn: [
      {
        q: "How is the AI trained on my business?",
        a: "We feed your product catalogs, pricing, and FAQs to train custom vector embeddings.",
      },
      {
        q: "Does it require server installation?",
        a: "No, it embeds with a lightweight JavaScript snippet on any website or store.",
      },
    ],
  },
  "high-speed-saudi-cloud-infrastructure": {
    id: "high-speed-saudi-cloud-infrastructure",
    slug: "high-speed-saudi-cloud-infrastructure",
    name: "High-Speed Saudi Cloud Hosting & Server Infrastructure",
    nameAr: "الاستضافة السحابية والبنية التحتية السعودية فائقة السرعة",
    category: "hosting",
    categoryNameAr: "الاستضافة والسيرفرات السحابية",
    categoryNameEn: "Cloud Hosting",
    categoryIcon: Server,
    price: 199,
    originalPrice: 399,
    rating: 4.9,
    reviewsCount: 82,
    ordersCount: 210,
    badge: "استضافة محلية سريعة",
    badgeIcon: Server,
    badgeColor: "from-[#FF7544] to-[#FF9A3C]",
    image: "/store/hosting.png",
    summaryAr:
      "بنية تحتية سحابية موثوقة داخل المملكة العربية السعودية، تضمن سرعة تصفح فائقة، حماية متقدمة ضد هجمات DDoS، وجاهزية 99.9%.",
    summaryEn:
      "Ultra-fast Saudi-hosted cloud infrastructure with 99.9% uptime SLA, automated daily backups, and enterprise DDoS protection.",
    descriptionAr:
      "استضافة سحابية فائقة الأداء مستضافة على مراكز بيانات داخل المملكة العربية السعودية، مما يضمن زمن استجابة فائق السرعة (Latency أقل من 50ms) لزوارك من الرياض وجدة وكافة أنحاء المملكة. تشمل حماية متقدمة ضد هجمات حجب الخدمة DDoS، شهادة أمان SSL مجانية، ونسخ احتياطي يومي آلي.",
    descriptionEn:
      "High-performance cloud hosting hosted directly on Tier-III Saudi datacenters, providing sub-50ms latency for users across the Kingdom. Includes free SSL, automated daily backups, and enterprise DDoS protection.",
    deliveryTimeAr: "تفعيل فوري وتجهيز السيرفر خلال دقائق",
    deliveryTimeEn: "Instant provisioning & setup in minutes",
    techStack: [
      "Saudi Local Datacenter",
      "NVMe SSD Storage",
      "Docker & Portainer",
      "Nginx Reverse Proxy",
      "Automated Daily Backups",
    ],
    keyBenefitsAr: [
      {
        title: "سيرفرات داخل المملكة (زمن استجابة <50ms)",
        desc: "تحسين هائل في سرعة فتح موقعك وتجربة المستخدم وترتيب محركات البحث في قوقل السعودية.",
      },
      {
        title: "حماية متقدمة من هجمات DDoS",
        desc: "دروع حماية سيبرانية تعمل على مدار الساعة لصد الهجمات وضمان استمرار عمل موقعك دون توقف.",
      },
      {
        title: "نسخ احتياطي آلي يومي",
        desc: "حفظ نسخ دورية من ملفاتك وقواعد البيانات واستعادتها بضغطة زر واحدة في أي وقت.",
      },
      {
        title: "شهادات أمان SSL مجانية",
        desc: "تشفير كامل لبيانات الزوار وتفعيل القفل الآمن HTTPS تلقائياً.",
      },
    ],
    keyBenefitsEn: [
      {
        title: "Saudi Local Servers (<50ms Latency)",
        desc: "Massive performance boost for Saudi visitors, improving Google ranking and retention.",
      },
      {
        title: "Enterprise DDoS Shield",
        desc: "Automated cybersecurity filtering that blocks malicious traffic and prevents downtime.",
      },
      {
        title: "Automated Daily Backups",
        desc: "Scheduled backups of your code and database with 1-click disaster recovery.",
      },
      {
        title: "Free Automated SSL Certificates",
        desc: "End-to-end encryption securing all customer traffic with HTTPS compliance.",
      },
    ],
    featuresAr: [
      "أقراص تخزين فائقة السرعة NVMe SSD",
      "لوحة تحكم سهلة لإدارة الملفات وقواعد البيانات والمجالات",
      "تجهيز تلقائي لبيئات Node.js, Next.js, PHP, و MySQL",
      "دعم فني هندسي متخصص على مدار الساعة 24/7",
      "ضمان جاهزية الخدمة 99.9% Uptime SLA",
    ],
    featuresEn: [
      "Ultra-fast NVMe SSD storage arrays",
      "Intuitive control panel for domain, file and database management",
      "Automated runtime setup for Node.js, Next.js, PHP, and MySQL",
      "24/7 dedicated DevOps technical assistance",
      "99.9% guaranteed Uptime SLA",
    ],
    faqsAr: [
      {
        q: "أين توجد مراكز البيانات؟",
        a: "السيرفرات مستضافة في مراكز بيانات حديثة ومعتمدة داخل المملكة العربية السعودية.",
      },
      {
        q: "هل يمكن ترقية الموارد لاحقاً؟",
        a: "نعم، يمكنك ترقية المعالج والذاكرة والتخزين في أي وقت بمرونة تامة وبدون انقطاع للخدمة.",
      },
    ],
    faqsEn: [
      {
        q: "Where are the datacenters located?",
        a: "Servers are hosted in certified Tier-III datacenters within Saudi Arabia.",
      },
      {
        q: "Can I scale resources later?",
        a: "Yes, CPU, RAM, and SSD storage can be upgraded seamlessly with zero downtime.",
      },
    ],
  },
};

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = (params.slug as string) || "saudi-ecommerce-store-template";
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const { addItem, items } = useCart();

  const [quantity, setQuantity] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<boolean>(false);
  const [apiProduct, setApiProduct] = useState<DetailedProduct | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    fetch("/api/store/products?status=published")
      .then((res) =>
        res.ok
          ? res.json()
          : Promise.reject(new Error("Failed to load product")),
      )
      .then((data) => {
        const item = data.products?.find(
          (candidate: { slug?: string }) =>
            candidate.slug === slug ||
            (slug === "saudi-real-estate-platform" &&
              candidate.slug === "saudi-real-estate-template") ||
            (slug === "saudi-ecommerce-store-template" &&
              candidate.slug?.includes("ecommerce")),
        );
        if (!active || !item) return;

        const parseArray = (value: unknown, fallbackValue: string[]) => {
          if (Array.isArray(value))
            return value.filter(
              (entry): entry is string => typeof entry === "string",
            );
          if (typeof value !== "string" || !value.trim()) return fallbackValue;
          try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed)
              ? parsed.filter(
                  (entry): entry is string => typeof entry === "string",
                )
              : fallbackValue;
          } catch {
            return fallbackValue;
          }
        };
        const categoryText =
          `${item.category || ""} ${item.categoryAr || ""}`.toLowerCase();
        const category =
          categoryText.includes("real") || categoryText.includes("عقار")
            ? "realestate"
            : categoryText.includes("host") ||
                categoryText.includes("cloud") ||
                categoryText.includes("استضاف")
              ? "hosting"
              : "templates";
        const apiSlug =
          item.slug === "saudi-real-estate-template"
            ? "saudi-real-estate-platform"
            : item.slug;
        const featuresAr = parseArray(item.featuresAr, []);
        const featuresEn = parseArray(item.features, []);
        const images = parseArray(item.images, []);

        setApiProduct({
          id: item.id,
          slug: apiSlug,
          name: item.name || "",
          nameAr: item.nameAr || item.name || "",
          category,
          categoryNameAr: item.categoryAr || item.category || "الأنظمة الرقمية",
          categoryNameEn: item.category || "Digital Systems",
          categoryIcon:
            category === "hosting"
              ? Server
              : category === "realestate"
                ? Building2
                : ShoppingBag,
          price: Number(item.salePrice ?? item.price),
          originalPrice: Number(item.price),
          rating: 5,
          image: images[0] || "/store/hosting.png",
          descriptionAr: toReadableText(item.descriptionAr || item.description),
          descriptionEn: toReadableText(item.description),
          summaryAr: toReadableText(item.descriptionAr || item.description),
          summaryEn: toReadableText(item.description),
          featuresAr,
          featuresEn,
          demoUrl: item.demoUrl || undefined,
          reviewsCount: Number(item._count?.reviews || 0),
          ordersCount: Number(item._count?.orderItems || 0),
          keyBenefitsAr: [],
          keyBenefitsEn: [],
          techStack: [],
          deliveryTimeAr: "تفعيل وتجهيز فوري",
          deliveryTimeEn: "Instant setup",
          faqsAr: [],
          faqsEn: [],
        });
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (isLoading) return null;
  if (!apiProduct) return null;

  const product = apiProduct;
  const inCart = items.some((i) => i.productId === product.id);
  const savings = product.originalPrice - product.price;
  const discountPct = Math.round((savings / product.originalPrice) * 100);
  const installmentAmount = (product.price / 4).toFixed(2);
  const BadgeIcon = product.badgeIcon || Flame;
  const CategoryIcon = product.categoryIcon || ShoppingBag;

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        name: product.name,
        nameAr: product.nameAr,
        price: product.originalPrice,
        salePrice: product.price,
        image: product.image,
      },
      quantity,
    );

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3500);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#070913] text-white pt-24 pb-20 relative overflow-hidden"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-[#FF4D6D]/15 via-[#FF9A3C]/10 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-[#FF4D6D]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] bg-[#FF9A3C]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10 pt-4">
        {/* Top Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <Link
              href="/store"
              className="hover:text-[#FF9A3C] transition flex items-center gap-1.5 font-semibold"
            >
              {isAr ? (
                <ArrowRight className="w-4 h-4" />
              ) : (
                <ArrowLeft className="w-4 h-4" />
              )}
              <span>{isAr ? "العودة لمتجر الأنظمة" : "Back to Store"}</span>
            </Link>
            <span>/</span>
            <span className="text-[#FF4D6D] font-medium">
              {isAr ? product.categoryNameAr : product.categoryNameEn}
            </span>
            <span>/</span>
            <span className="text-white font-bold truncate max-w-[200px] sm:max-w-none">
              {isAr ? product.nameAr : product.name}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#FF9A3C]" />
            <span>
              {copiedLink
                ? isAr
                  ? "تم نسخ الرابط ✓"
                  : "Link Copied ✓"
                : isAr
                  ? "مشاركة الرابط"
                  : "Share Link"}
            </span>
          </button>
        </div>

        {/* Main Product Showcase: 2-Column High-End Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Visual Mockup & Live Demo Trigger */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#0B0D1F] border border-[#FF4D6D]/30 shadow-2xl shadow-[#FF4D6D]/15 group">
              <Image
                src={product.image}
                alt={isAr ? product.nameAr : product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                unoptimized
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070913]/90 via-transparent to-black/30" />

              {/* Badges on Visual */}
              {product.badge && (
                <div
                  className={`absolute top-4 ${isAr ? "right-4" : "left-4"} px-3.5 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r ${product.badgeColor || "from-[#FF4D6D] to-[#FF9A3C]"} shadow-xl border border-white/20 flex items-center gap-1.5 backdrop-blur-md`}
                >
                  <BadgeIcon className="w-3.5 h-3.5 text-white" />
                  <span>{product.badge}</span>
                </div>
              )}

              <div
                className={`absolute top-4 ${isAr ? "left-4" : "right-4"} px-3 py-1 rounded-xl text-xs font-black bg-[#FF4D6D] text-white shadow-md border border-white/20 font-mono`}
              >
                {isAr
                  ? `وفر ${savings} ر.س (${discountPct}% خصم)`
                  : `Save ${savings} SAR (${discountPct}% OFF)`}
              </div>

              {/* Direct Live Demo Overlay Bar */}
              {product.demoUrl && (
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <a
                    href={product.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-2xl bg-black/85 hover:bg-black text-white text-sm font-extrabold backdrop-blur-xl border border-white/25 hover:border-[#FF4D6D] shadow-2xl flex items-center justify-center gap-2 transition-all group/btn cursor-pointer hover:scale-[1.02]"
                  >
                    <ExternalLink className="w-4 h-4 text-[#FF9A3C] group-hover/btn:rotate-12 transition-transform" />
                    <span>
                      {isAr
                        ? "معاينة القالب الحية التفاعلية (Live Demo ↗)"
                        : "Live Interactive Demo Preview ↗"}
                    </span>
                  </a>
                </div>
              )}
            </div>

            {/* Quick Guarantees Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-[#12142B]/80 border border-white/10 rounded-2xl p-3.5 text-center space-y-1">
                <Clock className="w-5 h-5 text-[#FF9A3C] mx-auto" />
                <h5 className="font-bold text-xs text-white">
                  {isAr ? "تسليم فوري" : "Instant Setup"}
                </h5>
                <p className="text-[11px] text-slate-400">
                  {isAr ? "أكواد المصدر خلال 24h" : "Code ready in 24h"}
                </p>
              </div>

              <div className="bg-[#12142B]/80 border border-white/10 rounded-2xl p-3.5 text-center space-y-1">
                <ShieldCheck className="w-5 h-5 text-[#FF4D6D] mx-auto" />
                <h5 className="font-bold text-xs text-white">
                  {isAr ? "ضمان وتشغيل" : "SLA Guarantee"}
                </h5>
                <p className="text-[11px] text-slate-400">
                  {isAr ? "دعم فني مباشر معتمد" : "Direct tech support"}
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-[#12142B]/80 border border-white/10 rounded-2xl p-3.5 text-center space-y-1">
                <CreditCard className="w-5 h-5 text-[#FF9A3C] mx-auto" />
                <h5 className="font-bold text-xs text-white">
                  {isAr ? "دفع آمن 100%" : "Secure Checkout"}
                </h5>
                <p className="text-[11px] text-slate-400">
                  {isAr ? "مدى وApple Pay وتابي" : "Mada & Tabby"}
                </p>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="bg-[#12142B]/60 border border-white/10 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#FF4D6D]" />
                <span>
                  {isAr
                    ? "التقنيات والمحركات المستخدمة:"
                    : "Technology Stack & Architecture:"}
                </span>
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {product.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono font-medium text-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing, Actions, Key Specs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs font-bold">
                  <CategoryIcon className="w-3.5 h-3.5 text-[#FF9A3C]" />
                  <span>
                    {isAr ? product.categoryNameAr : product.categoryNameEn}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-sm">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-white font-bold">{product.rating}</span>
                  <span className="text-slate-400 text-xs font-normal">
                    ({product.reviewsCount} {isAr ? "تقييم معتمد" : "reviews"})
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                {isAr ? product.nameAr : product.name}
              </h1>

              {/* Short Summary */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                {isAr ? product.summaryAr : product.summaryEn}
              </p>
            </div>

            {/* Price Card & Installments Box */}
            <div className="bg-[#12142B]/95 border border-[#FF4D6D]/30 rounded-3xl p-6 space-y-4 shadow-xl backdrop-blur-xl">
              <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">
                    {isAr ? "السعر النهائي للترخيص:" : "License Price:"}
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] font-mono">
                      {product.price} {isAr ? "ر.س" : "SAR"}
                    </span>
                    <span className="text-base text-slate-500 line-through font-mono">
                      {product.originalPrice} {isAr ? "ر.س" : "SAR"}
                    </span>
                  </div>
                </div>

                <div className="text-right sm:text-left">
                  <span className="inline-block px-3 py-1 rounded-xl bg-[#FF4D6D]/20 text-[#FF4D6D] text-xs font-extrabold border border-[#FF4D6D]/40 font-mono">
                    {isAr ? `خصم حصري لفترة محدودة` : `Limited Time Discount`}
                  </span>
                </div>
              </div>

              {/* Installment Widget (Tabby / Tamara) */}
              <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-2xl p-3.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#FF9A3C] flex-shrink-0" />
                  <span>
                    {isAr
                      ? `أو قسّمها على 4 دفعات شهرية بقيمة ${installmentAmount} ر.س بدون أي فوائد عبر تابي أو تمارا`
                      : `Or split in 4 interest-free payments of ${installmentAmount} SAR/mo via Tabby & Tamara`}
                  </span>
                </div>
              </div>

              {/* Quantity Selector & Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity Control */}
                  <div className="flex items-center bg-black/50 rounded-2xl p-1 border border-white/15 h-12">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-full rounded-xl hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-white font-mono text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-full rounded-xl hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 h-12 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                      inCart
                        ? "bg-[#FF4D6D]/25 border border-[#FF4D6D] text-[#FF9A3C] hover:bg-[#FF4D6D]/35"
                        : "bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white hover:opacity-95 active:scale-[0.98] shadow-[#FF4D6D]/30"
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>
                      {inCart
                        ? isAr
                          ? "مضاف بالسلة ✓ (إضافة المزيد +)"
                          : "In Cart ✓ (Add More +)"
                        : isAr
                          ? "إضافة إلى السلة"
                          : "Add to Cart"}
                    </span>
                  </button>
                </div>

                {/* Direct Buy Now Button */}
                <Link
                  href="/store/checkout"
                  onClick={() => {
                    if (!inCart) handleAddToCart();
                  }}
                  className="w-full h-12 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm flex items-center justify-center gap-2 border border-white/20 transition cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-[#FF9A3C]" />
                  <span>
                    {isAr
                      ? "شراء مباشر عبر الدفع السريع (مدى / Apple Pay)"
                      : "Direct Quick Checkout (Mada / Apple Pay)"}
                  </span>
                </Link>

                {/* Highly Prominent Live Interactive Demo Action */}
                {product.demoUrl && (
                  <a
                    href={product.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] hover:brightness-110 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/50 border border-emerald-400/50 transition-all cursor-pointer hover:scale-[1.02] group/demobtn"
                  >
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
                    </span>
                    <ExternalLink className="w-4 h-4 text-white group-hover/demobtn:rotate-12 transition-transform" />
                    <span>
                      {isAr
                        ? "⚡ تجربة النظام ومعاينته حياً الآن (Live Demo ↗)"
                        : "⚡ Experience Live Interactive Demo Now (Live Demo ↗)"}
                    </span>
                  </a>
                )}
              </div>
            </div>

            {/* Key Benefits Grid */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF9A3C]" />
                <span>
                  {isAr
                    ? "أبرز مميزات هذا النظام البرمجي:"
                    : "Key System Advantages:"}
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(isAr ? product.keyBenefitsAr : product.keyBenefitsEn).map(
                  (benefit, i) => (
                    <div
                      key={i}
                      className="bg-[#12142B]/70 border border-white/10 rounded-2xl p-3.5 space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] flex-shrink-0" />
                        <h5 className="font-bold text-xs text-white">
                          {benefit.title}
                        </h5>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Live Demo Spotlight Section */}
        {product.demoUrl && (
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#08151D] via-[#0E232F] to-[#08151D] border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl shadow-emerald-950/40">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 text-center md:text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                  </span>
                  <span>
                    {isAr
                      ? "البيئة التفاعلية الحية جاهزة للتجربة الفورية"
                      : "Live Interactive Demo Environment Ready"}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {isAr
                    ? "جرّب المتجر والنظام بنفسك قبل الشراء واستكشف كافة الوظائف"
                    : "Experience the Store Live Before Purchasing"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                  {isAr
                    ? "يمكنك تصفح واجهة المتجر الحية، إضافة المنتجات للسلة، وتجربة تدفق الدفع وسرعة التحميل وتصفح تجربة المستخدم الكاملة على الجوال والكمبيوتر."
                    : "Browse the live store, test the smart cart and checkout flow, and explore full responsive mobile & desktop UX."}
                </p>
              </div>

              <a
                href={product.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-base flex items-center gap-3 shadow-2xl shadow-emerald-900/50 border border-emerald-300/50 hover:scale-105 transition-all cursor-pointer group/cta"
              >
                <span>
                  {isAr
                    ? "فتح المعاينة التفاعلية الحية الآن (Live Demo) ↗"
                    : "Launch Live Interactive Demo ↗"}
                </span>
                <ExternalLink className="w-5 h-5 text-white group-hover/cta:rotate-12 transition-transform" />
              </a>
            </div>
          </section>
        )}

        {/* Detailed Description & Features Section */}
        <section className="bg-[#101229]/90 border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 backdrop-blur-xl">
          <div className="space-y-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs font-bold">
              <Layers className="w-3.5 h-3.5 text-[#FF9A3C]" />
              <span>
                {isAr
                  ? "الوصف الشامل والمواصفات الفنية"
                  : "Full Architecture & System Specifications"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isAr
                ? "عن هذا النظام وكيف يخدم مشروعك التجاري"
                : "System Overview & Commercial Capabilities"}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              {isAr ? product.descriptionAr : product.descriptionEn}
            </p>
          </div>

          {/* Included Features Checklist */}
          <div className="space-y-4 border-t border-white/10 pt-6">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Check className="w-5 h-5 text-[#FF4D6D]" />
              <span>
                {isAr
                  ? "قائمة الميزات والخصائص المضمنة مع الترخيص:"
                  : "Included Features & Technical Modules:"}
              </span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(isAr ? product.featuresAr : product.featuresEn).map(
                (feat, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-[#151736] border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-slate-200"
                  >
                    <div className="w-5 h-5 rounded-lg bg-[#FF4D6D]/20 text-[#FF4D6D] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="leading-snug">{feat}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="bg-[#12142B]/80 border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF9A3C]">
              <HelpCircle className="w-4 h-4" />
              <span>
                {isAr
                  ? "الأسئلة الشائعة حول هذا النظام"
                  : "Frequently Asked Questions"}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isAr
                ? "إجابات على أهم استفسارات العملاء"
                : "Common Questions & Answers"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(isAr ? product.faqsAr : product.faqsEn).map((faq, i) => (
              <div
                key={i}
                className="bg-[#0D0F22] border border-white/10 rounded-2xl p-5 space-y-2"
              >
                <h5 className="font-bold text-white text-sm flex items-center gap-2">
                  <span className="text-[#FF4D6D] font-mono">Q.</span>
                  <span>{faq.q}</span>
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed font-light pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* WhatsApp Custom Builds CTA */}
        <section className="bg-gradient-to-r from-[#141630] via-[#1A1D3D] to-[#141630] border border-[#FF4D6D]/30 rounded-3xl p-8 sm:p-10 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-xl sm:text-3xl font-extrabold text-white">
              {isAr
                ? "هل تحتاج إلى تخصيص معين أو ربط برمجي خاص؟"
                : "Need Tailored Customization or Integration Support?"}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
              {isAr
                ? "تواصل مباشرة مع المهندس المختص في دي آرو عبر الواتساب لتخصيص الواجهات والربط بالسيرفرات والأنظمة المحاسبية."
                : "Chat directly with our lead engineer on WhatsApp for custom modules, ERP integrations, and onboarding."}
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/966500000000?text=${encodeURIComponent(`مرحباً وكالة دي آرو، أود الاستفسار عن تفاصيل وتخصيص: ${product.nameAr}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white font-black text-sm shadow-xl shadow-[#FF4D6D]/30 hover:scale-105 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>
                  {isAr
                    ? "محادثة المهندس عبر الواتساب"
                    : "Chat with Specialist on WhatsApp"}
                </span>
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Added Toast Notification */}
      {addedToast && (
        <div
          className={`fixed top-24 ${isAr ? "left-6" : "right-6"} z-50 animate-bounce`}
        >
          <div className="bg-[#12142B] border border-[#FF4D6D]/50 rounded-2xl p-4 shadow-2xl flex items-center gap-3 text-white max-w-sm backdrop-blur-xl">
            <div className="w-10 h-10 rounded-xl bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/40 flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-xs truncate">
                {isAr ? product.nameAr : product.name}
              </h5>
              <p className="text-[11px] text-[#FF9A3C] font-semibold">
                {isAr
                  ? "تمت الإضافة إلى السلة بنجاح!"
                  : "Added to cart successfully!"}
              </p>
            </div>
            <Link
              href="/store/cart"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white text-[11px] font-extrabold whitespace-nowrap shadow-md"
            >
              {isAr ? "عرض السلة" : "View Cart"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
