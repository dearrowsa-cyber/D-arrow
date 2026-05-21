'use client';

import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { useState, useEffect, use } from 'react';

const DETAILED_SERVICES: Record<string, any> = {
  dm_smm: {
    ar: {
      headline: "إدارة منصات التواصل الاجتماعي",
      subheadline: "صناعة حضور رقمي لا يُنسى وبناء مجتمعات تتنفس علامتك التجارية",
      content: [
        "في عصر أصبحت فيه منصات التواصل الاجتماعي هي الواجهة الأولى لأي عمل تجاري، لم يعد التواجد العشوائي أو مجرد النشر الروتيني كافياً لجذب الانتباه. نحن نقدم خدمة \"إدارة منصات التواصل الاجتماعي\" كحل استراتيجي متكامل لا يقتصر على إدارة الحسابات، بل يمتد لبناء مجتمعات رقمية نابضة بالحياة تدين بالولاء لعلامتك التجارية.",
        "نبدأ رحلتنا معك بدراسة وتحليل دقيق لجمهورك المستهدف ومنافسيك، لنضع استراتيجية مخصصة تحدد نبرة الصوت المناسبة (Tone of Voice) وأفضل المنصات للوصول إلى عملائك (سواء كانت إكس، إنستغرام، تيك توك، أو لينكد إن). تتضمن خدمتنا:",
      ],
      bullets: [
        "التخطيط الاستراتيجي: بناء تقويم محتوى (Content Calendar) مدروس يضمن استمرارية وتنوع الرسائل التسويقية.",
        "الإدارة والتفاعل اليومي: الرد على استفسارات العملاء بأسلوب يعكس احترافيتك، وبناء تفاعل حقيقي (Engagement) يزيد من ثقة الجمهور.",
        "التحليل والتقييم اللحظي: رصد مؤشرات الأداء الرئيسية (KPIs) وتقديم تقارير دورية تضمن تحقيق أهدافك، سواء كانت زيادة الوعي بالعلامة التجارية، أو توجيه الزيارات لموقعك."
      ],
      footer: "دعنا نحول متابعيك إلى سفراء لعلامتك التجارية من خلال حضور رقمي قوي ومؤثر."
    },
    en: {
      headline: "Social Media Management",
      subheadline: "Creating an unforgettable digital presence and building communities that breathe your brand",
      content: [
        "In an era where social media platforms are the primary storefront for any business, random presence or routine posting is no longer enough to grab attention. We offer 'Social Media Management' as an integrated strategic solution that goes beyond account management to building vibrant digital communities loyal to your brand.",
        "We begin our journey with a thorough study and analysis of your target audience and competitors, crafting a tailored strategy that defines the right Tone of Voice and the best platforms to reach your customers (whether X, Instagram, TikTok, or LinkedIn). Our service includes:"
      ],
      bullets: [
        "Strategic Planning: Building a well-thought-out Content Calendar that ensures continuity and variety in marketing messages.",
        "Daily Management & Interaction: Responding to customer inquiries professionally and building real Engagement that increases audience trust.",
        "Real-time Analysis & Evaluation: Monitoring Key Performance Indicators (KPIs) and providing regular reports ensuring your goals are met, whether increasing brand awareness or driving traffic."
      ],
      footer: "Let us turn your followers into brand ambassadors through a strong and influential digital presence."
    },
    image: '/services/social-media-marketing1.jpeg',
    icon: '/icon/mainicons1/social-media10.png'
  },
  dm_marketing: {
    ar: {
      headline: "التسويق الرقمي",
      subheadline: "استراتيجيات متكاملة ومبنية على البيانات للوصول إلى القمة",
      content: [
        "التسويق الرقمي ليس مجرد حملات مبعثرة، بل هو منظومة متكاملة تعمل بتناغم لتحقيق هدف واحد: نمو أعمالك وزيادة أرباحك. نحن نقدم استراتيجيات تسويق رقمي شاملة وموجهة بالبيانات (Data-Driven)، مصممة لاختراق السوق والوصول إلى جمهورك المستهدف في اللحظة التي يبحثون فيها عنك.",
        "خدمتنا مصممة لتأخذ العميل في رحلة سلسة (Customer Journey) بدءاً من مرحلة الوعي وحتى مرحلة اتخاذ قرار الشراء والولاء. تشمل هذه الخدمة:"
      ],
      bullets: [
        "تحليل السوق والمنافسين: فهم المشهد الرقمي الذي تعمل به لاكتشاف الفجوات والفرص البيعية.",
        "التسويق متعدد القنوات (Omnichannel): دمج قنوات التسويق المختلفة مثل البريد الإلكتروني، تحسين محركات البحث، والإعلانات المدفوعة لضمان إحاطة العميل برسالتك من كل جانب.",
        "تحسين مسار المبيعات (Funnel Optimization): سد الثغرات التي تؤدي إلى تسرب العملاء المحتملين، وتعظيم معدلات التحويل (Conversion Rates)."
      ],
      footer: "نحن لا نعدك بمجرد زيارات، بل نعدك بنتائج ملموسة وعائد حقيقي على الاستثمار (ROI) يضمن استدامة نجاحك وتوسع أعمالك."
    },
    en: {
      headline: "Digital Marketing",
      subheadline: "Integrated, Data-Driven Strategies to Reach the Top",
      content: [
        "Digital marketing is not just scattered campaigns; it's an integrated system working in harmony to achieve one goal: business growth and increased profits. We offer comprehensive, data-driven marketing strategies designed to penetrate the market and reach your target audience exactly when they are looking for you.",
        "Our service is designed to take the customer on a seamless journey from awareness to purchase decision and loyalty. This service includes:"
      ],
      bullets: [
        "Market and Competitor Analysis: Understanding the digital landscape you operate in to discover gaps and sales opportunities.",
        "Omnichannel Marketing: Integrating various marketing channels like email, SEO, and paid ads to ensure your customer is surrounded by your message from all sides.",
        "Funnel Optimization: Plugging gaps that lead to potential customer drop-offs and maximizing Conversion Rates."
      ],
      footer: "We don't just promise visits; we promise tangible results and a real Return on Investment (ROI) ensuring the sustainable success and expansion of your business."
    },
    image: '/services/Digital-marketing1.jpeg',
    icon: '/icon/services-icon/digital_marketing_promotion.png'
  },
  dm_visual: {
    ar: {
      headline: "الإنتاج البصري",
      subheadline: "تجسيد هويتك في صور وفيديوهات تأسر الحواس وتصنع الفارق",
      content: [
        "المحتوى البصري هو اللغة الأسرع وصولاً والأكثر تأثيراً في العالم الرقمي. نحن ندرك أن جودة الصورة أو الفيديو الذي تقدمه تعكس مباشرة جودة خدماتك أو منتجاتك في ذهن العميل. لذا، صممنا خدمة \"الإنتاج البصري\" لترجمة أفكارك وهويتك إلى أعمال فنية احترافية تخطف الأنظار وتترك انطباعاً لا يُمحى.",
        "يضم فريقنا نخبة من المبدعين في التصوير، التصميم، والمونتاج، لتقديم حلول بصرية متكاملة تشمل:"
      ],
      bullets: [
        "تصوير المنتجات والخدمات: إبراز أدق التفاصيل الجمالية لمنتجاتك بأسلوب احترافي يشجع على الشراء.",
        "إنتاج الفيديوهات والموشن جرافيك: صناعة فيديوهات ترويجية، تعريفية، أو تثقيفية تروي قصة علامتك التجارية بأسلوب مشوق وسلس.",
        "التصميم الجرافيكي: ابتكار هويات بصرية، وتصاميم لمنصات التواصل الاجتماعي تتسم بالابتكار وتتماشى مع أحدث الاتجاهات العالمية."
      ],
      footer: "ارتقِ بصورتك الذهنية، واجعل من محتواك البصري أداة الجذب الأولى لجمهورك."
    },
    en: {
      headline: "Visual Production",
      subheadline: "Embodying Your Identity in Images and Videos that Captivate the Senses and Make a Difference",
      content: [
        "Visual content is the fastest-reaching and most impactful language in the digital world. We understand that the quality of the image or video you present directly reflects the quality of your services or products in the customer's mind. Therefore, we designed the 'Visual Production' service to translate your ideas and identity into professional artwork that catches the eye and leaves an indelible impression.",
        "Our team includes top creators in photography, design, and editing, providing comprehensive visual solutions that include:"
      ],
      bullets: [
        "Product and Service Photography: Highlighting the finest aesthetic details of your products professionally to encourage purchase.",
        "Video and Motion Graphics Production: Creating promotional, introductory, or educational videos that tell your brand's story smoothly and engagingly.",
        "Graphic Design: Innovating visual identities and social media designs characterized by creativity and aligned with the latest global trends."
      ],
      footer: "Elevate your brand image and make your visual content the primary attraction tool for your audience."
    },
    image: '/services/Visual-Production1.jpeg',
    icon: '/icon/mainicons1/visiual.png'
  },
  dm_influencer: {
    ar: {
      headline: "تسويق المؤثرين",
      subheadline: "بناء جسور الثقة والمصداقية من خلال الأصوات الأكثر تأثيراً",
      content: [
        "في وقت تتزايد فيه مقاومة الجمهور للإعلانات التقليدية، تبرز قوة \"تسويق المؤثرين\" كأداة لا غنى عنها لاختراق الحواجز الإعلانية والوصول إلى قلوب العملاء مباشرة. نحن نساعدك على استغلال الثقة التي بناها المؤثرون مع متابعيهم لتحويلها إلى مبيعات وانتشار واسع لعلامتك التجارية.",
        "لا يعتمد نهجنا على اختيار المؤثرين بناءً على أعداد المتابعين فحسب، بل على مدى توافقهم مع قيم هويتك التجارية وتأثيرهم الفعلي في شريحتك المستهدفة. نقدم لك إدارة شاملة للحملة تتضمن:"
      ],
      bullets: [
        "البحث الدقيق والاستقطاب: اختيار نخبة المؤثرين الذين يتحدثون لغة جمهورك ويشاركونهم نفس الاهتمامات.",
        "إدارة العقود والتفاوض: ضمان حصولك على أفضل قيمة مقابل الاستثمار، مع وضع أهداف واضحة للحملة.",
        "توجيه المحتوى وقياس الأثر: الإشراف على خروج المحتوى بشكل طبيعي وغير متكلف، مع تقديم تقارير مفصلة عن معدلات التفاعل والمبيعات الناتجة عن الحملة (Promo codes/Tracking links)."
      ],
      footer: "اضمن وصول رسالتك بشكل موثوق وفعال عبر شراكات استراتيجية مع صناع الرأي في مجالك."
    },
    en: {
      headline: "Influencer Marketing",
      subheadline: "Building Bridges of Trust and Credibility Through the Most Influential Voices",
      content: [
        "At a time when audience resistance to traditional ads is increasing, the power of 'Influencer Marketing' emerges as an indispensable tool to break through advertising barriers and reach customers' hearts directly. We help you leverage the trust influencers have built with their followers to turn it into sales and widespread brand reach.",
        "Our approach doesn't just rely on selecting influencers based on follower counts, but on their alignment with your brand values and their actual impact on your target audience. We provide comprehensive campaign management including:"
      ],
      bullets: [
        "Precise Research & Recruitment: Selecting top influencers who speak your audience's language and share their interests.",
        "Contract Management & Negotiation: Ensuring you get the best value for your investment, with clear campaign goals.",
        "Content Guidance & Impact Measurement: Overseeing content delivery to appear natural and unforced, providing detailed reports on engagement rates and sales generated from the campaign (Promo codes/Tracking links)."
      ],
      footer: "Ensure your message arrives reliably and effectively through strategic partnerships with opinion leaders in your field."
    },
    image: '/services/influencer.jpeg',
    icon: '/icon/mainicons1/influencer.png'
  },
  dm_content: {
    ar: {
      headline: "المحتوى الإبداعي",
      subheadline: "صياغة الكلمات التي تلهم، تؤثر، وتدفع نحو اتخاذ القرار",
      content: [
        "\"المحتوى هو الملك\"، ولكن المحتوى الإبداعي هو الذي يصنع الإمبراطوريات الرقمية. الكلمات ليست مجرد أحرف تُملأ بها الصفحات؛ بل هي صوت علامتك التجارية، وأداتك الأقوى لإقناع جمهورك، والتعبير عن قيمك، وبناء علاقة طويلة الأمد مع عملائك. في خدمة \"المحتوى الإبداعي\"، نحن نصنع السردية (Storytelling) التي تجعل منافسيك في الخلفية.",
        "نقدم لك نصوصاً مبتكرة مصاغة بعناية فائقة لتناسب مختلف القنوات الرقمية والتقليدية، وتتضمن:"
      ],
      bullets: [
        "كتابة الإعلانات (Copywriting): صياغة نصوص بيعية جذابة تستهدف نقاط الألم (Pain Points) لدى العميل وتقدم منتجك كحل نهائي، مما يضاعف معدلات التحويل.",
        "كتابة المدونات والمقالات: تقديم محتوى غني بالمعلومات والقيمة المضافة، يعزز من مكانتك كخبير في مجالك ويحسن من ظهورك في محركات البحث.",
        "كتابة السيناريوهات والمحتوى التفاعلي: ابتكار نصوص للفيديوهات وحملات تفاعلية تضمن بقاء جمهورك متفاعلاً ومترقباً لكل جديد تقدمه."
      ],
      footer: "اجعل من كل كلمة تنشرها استثماراً يعود عليك بالولاء والأرباح."
    },
    en: {
      headline: "Creative Content",
      subheadline: "Crafting Words that Inspire, Influence, and Drive Decision-Making",
      content: [
        "'Content is King,' but creative content builds digital empires. Words aren't just letters filling pages; they are your brand's voice, your strongest tool to persuade your audience, express your values, and build a long-term relationship with customers. In our 'Creative Content' service, we craft the Storytelling that puts your competitors in the background.",
        "We provide innovative texts carefully crafted to suit various digital and traditional channels, including:"
      ],
      bullets: [
        "Copywriting: Crafting engaging sales copy that targets the customer's Pain Points and presents your product as the ultimate solution, doubling conversion rates.",
        "Blog & Article Writing: Providing informative and value-added content that reinforces your position as an expert in your field and improves your search engine visibility.",
        "Scriptwriting & Interactive Content: Creating video scripts and interactive campaigns ensuring your audience remains engaged and anticipating everything new you offer."
      ],
      footer: "Make every word you publish an investment that returns loyalty and profits."
    },
    image: '/services/creative-content1.jpeg',
    icon: '/icon/services-icon/marketing_performance_chart.png'
  },
  dm_exhibitions: {
    ar: {
      headline: "إدارة المعارض والمؤتمرات",
      subheadline: "تنظيم استثنائي وتجارب حية تعكس ريادتك في السوق",
      content: [
        "التواجد على أرض الواقع لا يقل أهمية عن التواجد الرقمي؛ فالمعارض والمؤتمرات تمثل فرصة ذهبية لعرض حجم أعمالك، بناء شراكات استراتيجية، والالتقاء بعملائك وجهاً لوجه. نحن نقدم خدمة \"إدارة المعارض والمؤتمرات\" لرفع عبء التخطيط عن كاهلك، وضمان خروج حدثك بأبهى صورة تعكس احترافيتك العالية.",
        "نتولى إدارة كافة التفاصيل اللوجستية والتنظيمية من الألف إلى الياء، لتتفرغ أنت لبناء العلاقات وإغلاق الصفقات. تشمل إدارتنا:"
      ],
      bullets: [
        "التخطيط المسبق والتصميم: اختيار المواقع، وتصميم الأجنحة (Booths) بشكل مبتكر يخطف أنظار الحاضرين ويعبر عن هويتك.",
        "الإدارة اللوجستية والتنفيذ: الإشراف الميداني الكامل على التجهيزات التقنية، المطبوعات، وإدارة فريق العمل على أرض الواقع.",
        "التغطية التسويقية والإعلامية: ربط الحدث بالعالم الرقمي من خلال تغطية حية على منصات التواصل الاجتماعي لتعظيم الاستفادة وتوسيع دائرة التأثير لما بعد انتهاء الحدث."
      ],
      footer: "اجعل من مشاركتك القادمة حدثاً يتحدث عنه الجميع، وتجربة تترك أثراً ملموساً في مسيرة نجاحك."
    },
    en: {
      headline: "Exhibitions & Conferences Management",
      subheadline: "Exceptional Organization and Live Experiences Reflecting Your Market Leadership",
      content: [
        "Physical presence is no less important than digital presence; exhibitions and conferences represent a golden opportunity to showcase your business scale, build strategic partnerships, and meet customers face-to-face. We offer 'Exhibitions & Conferences Management' to lift the planning burden off your shoulders, ensuring your event appears in the best light reflecting your high professionalism.",
        "We handle all logistical and organizational details from A to Z, so you can focus on building relationships and closing deals. Our management includes:"
      ],
      bullets: [
        "Pre-planning & Design: Selecting locations and designing Booths innovatively to catch attendees' eyes and express your identity.",
        "Logistics & Execution: Full field supervision of technical setups, prints, and managing the on-ground team.",
        "Marketing & Media Coverage: Connecting the event to the digital world through live social media coverage to maximize benefits and expand influence beyond the event."
      ],
      footer: "Make your next participation an event everyone talks about, and an experience leaving a tangible impact on your path to success."
    },
    image: '/services/Exhibitions1.jpeg',
    icon: '/icon/mainicons1/sales-real10.png'
  },
  dm_advertising: {
    ar: {
      headline: "حملات الإعلانات",
      subheadline: "استثمار ذكي للميزانيات الإعلانية لتحقيق أقصى قدر من النتائج",
      content: [
        "هل تنفق الكثير على الإعلانات دون رؤية نتائج حقيقية؟ الحملات الإعلانية الناجحة لا تعتمد على حجم الميزانية بقدر ما تعتمد على دقة الاستهداف والاستراتيجية المتبعة. نحن نصمم وندير حملات إعلانية مدفوعة عبر قنوات متعددة، تضمن وضع رسالتك أمام الشخص المناسب، في الوقت المناسب، وبالرسالة المناسبة التي تحفزه على الشراء.",
        "يعتمد فريقنا على التحليل المستمر والتحسين اللحظي (Optimization) لضمان عدم إهدار أي جزء من ميزانيتك. خدماتنا الإعلانية تغطي:"
      ],
      bullets: [
        "إعلانات محركات البحث (Google Ads): التقاط العملاء ذوي النية الشرائية العالية في اللحظة التي يبحثون فيها عن خدماتك.",
        "إعلانات منصات التواصل الاجتماعي: استهداف دقيق مبني على السلوكيات، الاهتمامات، والمناطق الجغرافية (فيسبوك، إنستغرام، تيك توك، سناب شات).",
        "حملات إعادة الاستهداف (Retargeting): ملاحقة العملاء المحتملين الذين أبدوا اهتماماً سابقاً بخدماتك، وإعادتهم إلى مسار الشراء لإتمام العملية بنجاح."
      ],
      footer: "نحن نحول كل نقرة إلى فرصة، وكل حملة إعلانية إلى استثمار رابح."
    },
    en: {
      headline: "Advertising Campaigns",
      subheadline: "Smart Investment of Advertising Budgets for Maximum Results",
      content: [
        "Are you spending heavily on ads without seeing real results? Successful ad campaigns depend not on budget size, but on targeting precision and strategy. We design and manage paid ad campaigns across multiple channels, ensuring your message reaches the right person, at the right time, with the right prompt for purchase.",
        "Our team relies on continuous analysis and real-time Optimization to ensure no part of your budget is wasted. Our advertising services cover:"
      ],
      bullets: [
        "Search Engine Ads (Google Ads): Capturing high-intent customers at the exact moment they search for your services.",
        "Social Media Ads: Precise targeting based on behaviors, interests, and geographical locations (Facebook, Instagram, TikTok, Snapchat).",
        "Retargeting Campaigns: Pursuing potential customers who previously showed interest in your services, bringing them back to the purchase funnel to successfully complete the transaction."
      ],
      footer: "We turn every click into an opportunity, and every ad campaign into a profitable investment."
    },
    image: '/services/Advertisements1.jpeg',
    icon: '/icon/mainicons1/real-estate-marketing.png'
  },
  dm_consultation: {
    ar: {
      headline: "الاستشارات التسويقية",
      subheadline: "شراكة استراتيجية وتوجيه خبير لعبور تحديات السوق بثقة",
      content: [
        "في عالم الأعمال المتسارع، قد يكون التحدي الأكبر هو تحديد الوجهة الصحيحة وسط بحر من الخيارات التكتيكية. خدمة \"الاستشارات التسويقية\" صُممت لتكون البوصلة التي توجه قارب أعمالك نحو النمو المستدام. نحن نضع خبراتنا الطويلة بين يديك لنساعدك على فك شفرة السوق وتجاوز العقبات التسويقية بذكاء وحكمة.",
        "نجلس معك كشركاء نجاح لتحليل الوضع الراهن لأعمالك (Auditing) وتحديد مكامن القوة والضعف. تتضمن جلساتنا الاستشارية:"
      ],
      bullets: [
        "تطوير استراتيجيات الدخول والتوسع: رسم خارطة طريق تسويقية واضحة المعالم لتحقيق أهداف قصيرة وطويلة المدى، سواء لدخول سوق جديد أو إطلاق منتج مبتكر.",
        "حل المشكلات وتحسين الأداء: تشخيص التحديات التي تعيق نمو مبيعاتك وتقديم حلول عملية ومبتكرة قابلة للتنفيذ الفوري.",
        "توجيه وبناء فرق العمل: تقديم المشورة لفرق التسويق الداخلية لديك، وتطوير مهاراتهم لضمان كفاءة التنفيذ وتوحيد الرؤية."
      ],
      footer: "استثمر في المعرفة، واجعل قراراتك التسويقية مبنية على رؤى خبيرة وبيانات صلبة لا مجرد تخمينات."
    },
    en: {
      headline: "Marketing Consultation",
      subheadline: "Strategic Partnership and Expert Guidance to Cross Market Challenges Confidently",
      content: [
        "In a fast-paced business world, the biggest challenge might be determining the right direction amidst a sea of tactical options. The 'Marketing Consultation' service is designed to be the compass guiding your business ship towards sustainable growth. We put our long experience in your hands to help you decode the market and overcome marketing obstacles wisely.",
        "We sit with you as success partners to analyze your current business situation (Auditing) and identify strengths and weaknesses. Our consulting sessions include:"
      ],
      bullets: [
        "Entry & Expansion Strategy Development: Drawing a clear marketing roadmap to achieve short and long-term goals, whether entering a new market or launching an innovative product.",
        "Problem Solving & Performance Improvement: Diagnosing challenges hindering sales growth and providing practical, innovative solutions for immediate implementation.",
        "Guiding & Building Teams: Advising your internal marketing teams and developing their skills to ensure execution efficiency and vision alignment."
      ],
      footer: "Invest in knowledge, and make your marketing decisions based on expert insights and solid data, not mere guesses."
    },
    image: '/services/Marketing-Consultation1.jpeg',
    icon: '/icon/mainicons1/expertteam1.png'
  },
  dm_seo: {
    ar: {
      headline: "تحسين محركات البحث وتحسين السمعة (SEO & Reputation)",
      subheadline: "تصدر نتائج البحث وابنِ حصناً منيعاً لسمعتك الرقمية",
      content: [
        "إذا لم تكن متواجداً في الصفحة الأولى من جوجل، فأنت عملياً غير مرئي بالنسبة لشريحة ضخمة من عملائك المحتملين. خدمة \"تحسين محركات البحث وتحسين السمعة\" هي استثمارك الأطول أجلاً والأكثر استدامة. نحن نجمع بين التقنيات المتقدمة لتصدر محركات البحث، وبين الفن الدقيق لإدارة الانطباع العام عن علامتك التجارية على الإنترنت.",
        "نعمل على خطين متوازيين لضمان سيادتك الرقمية:"
      ],
      bullets: [
        "تحسين محركات البحث (SEO): نقوم بهيكلة موقعك تقنياً (Technical SEO)، وبناء محتوى متوافق مع خوارزميات جوجل (On-Page SEO)، وتعزيز موثوقية موقعك من خلال بناء روابط خلفية قوية (Off-Page SEO)، لنضمن لك تدفقاً مستمراً من الزيارات العضوية والمجانية.",
        "إدارة وتحسين السمعة الرقمية (ORM): نراقب ما يُقال عن علامتك التجارية في كل زاوية من زوايا الإنترنت، وندير التقييمات والمراجعات بذكاء، مع التعامل السريع والاحترافي مع أي أزمات محتملة للحفاظ على صورة ذهنية ناصعة وموثوقة."
      ],
      footer: "كن الخيار الأول والأكثر موثوقية عندما يبحث عنك العملاء، ودع نتائجك وسمعتك تتحدثان بالنيابة عنك."
    },
    en: {
      headline: "SEO & Reputation Management",
      subheadline: "Top Search Results and Build an Impenetrable Fortress for Your Digital Reputation",
      content: [
        "If you're not on the first page of Google, you are practically invisible to a massive segment of your potential customers. 'SEO & Reputation Management' is your longest-term and most sustainable investment. We combine advanced techniques to dominate search engines with the delicate art of managing your brand's public impression online.",
        "We work on two parallel tracks to ensure your digital sovereignty:"
      ],
      bullets: [
        "Search Engine Optimization (SEO): Technically structuring your website (Technical SEO), building content compliant with Google algorithms (On-Page SEO), and enhancing site authority through strong backlinks (Off-Page SEO) to guarantee a continuous flow of free organic traffic.",
        "Online Reputation Management (ORM): Monitoring what is said about your brand in every corner of the internet, intelligently managing ratings and reviews, and swiftly handling potential crises professionally to maintain a pristine and reliable image."
      ],
      footer: "Be the first and most trusted choice when customers search for you, and let your results and reputation speak on your behalf."
    },
    image: '/services/seo-sro1.jpeg',
    icon: '/icon/mainicons1/seo&sro10.png'
  },
  id_apps: {
    ar: {
      headline: "تصميم وتطوير التطبيقات",
      subheadline: "تطبيقات هواتف أصلية ومتعددة المنصات مصممة بأعلى معايير الأداء وتجربة المستخدم",
      content: [
        "في عالم يعتمد بشكل متزايد على الهواتف الذكية، لم يعد امتلاك تطبيق لعملك مجرد رفاهية، بل هو ضرورة استراتيجية للوصول إلى عملائك في أي وقت ومكان. خدمة \"تصميم وتطوير التطبيقات\" لدينا تركز على تحويل أفكارك إلى تطبيقات سلسة، سريعة، ومبتكرة تضمن بقاء علامتك التجارية في جيب العميل.",
        "نحن لا نكتفي بكتابة الأكواد، بل نصمم رحلة مستخدم (User Journey) متكاملة تزيد من ولاء العملاء وترفع معدلات التفاعل والمبيعات، معتمدين على أحدث التقنيات لضمان التوافق التام مع أنظمة iOS و Android."
      ],
      bullets: [
        "تصميم واجهة وتجربة المستخدم (UI/UX): ابتكار واجهات جذابة ومريحة تضمن بقاء المستخدم لأطول فترة ممكنة داخل التطبيق وتحقيق الهدف بسهولة.",
        "تطوير شامل ومرن: بناء تطبيقات أصلية (Native) أو هجينة (Cross-Platform) قابلة للتطوير والتوسع مع نمو أعمالك، مع ضمان الأمان العالي للبيانات.",
        "الصيانة والدعم المستمر: نحن معك حتى بعد الإطلاق لنضمن عمل التطبيق بكفاءة، وتقديم التحديثات المستمرة لتتوافق مع متطلبات السوق وأنظمة التشغيل الحديثة."
      ],
      footer: "اجعل الوصول إلى خدماتك بلمسة زر، وكن الخيار الأقرب لعملائك مع تطبيق يعكس احترافيتك."
    },
    en: {
      headline: "Apps Design & Development",
      subheadline: "Native and cross-platform mobile apps built to the highest performance and UX standards",
      content: [
        "In an increasingly mobile-centric world, having an app for your business is no longer a luxury, but a strategic necessity to reach your customers anytime, anywhere. Our 'Apps Design & Development' service focuses on transforming your ideas into seamless, fast, and innovative applications that ensure your brand stays in the customer's pocket.",
        "We don't just write code; we design a complete User Journey that increases customer loyalty, engagement, and sales, relying on the latest technologies to ensure full compatibility with iOS and Android systems."
      ],
      bullets: [
        "UI/UX Design: Creating attractive, intuitive interfaces that ensure users stay longer and achieve their goals effortlessly.",
        "Comprehensive & Flexible Development: Building scalable Native or Cross-Platform apps that grow with your business while ensuring high data security.",
        "Ongoing Maintenance & Support: We are with you even after launch, ensuring your app runs efficiently and providing continuous updates to match market demands and new OS versions."
      ],
      footer: "Make your services accessible with a tap, and be the closest choice for your customers with a highly professional app."
    },
    image: '/services/app-development.jpg',
    icon: '/icon/mainicons1/app10.png'
  },
  id_website: {
    ar: {
      headline: "تصميم وتطوير المواقع الإلكترونية",
      subheadline: "مواقع احترافية تدفع عجلة التحويلات وتضمن تفاعل المستخدم",
      content: [
        "موقعك الإلكتروني هو واجهتك الرقمية الأولى والأساسية؛ فهو الموظف الذي لا ينام، ويعمل على مدار الساعة لاستقبال عملائك وعرض خدماتك ومنتجاتك بأفضل صورة ممكنة. نحن نصمم ونطور مواقع إلكترونية ليست فقط جذابة بصرياً، بل مصممة هندسياً لتحقيق أعلى معدلات التحويل (Conversion Rates).",
        "سواء كنت تحتاج إلى موقع تعريفي للشركة أو منصة تجارة إلكترونية متكاملة، يضمن فريقنا تقديم حلول سريعة، متجاوبة مع كافة الشاشات (Responsive)، ومبنية وفق أحدث معايير تحسين محركات البحث (SEO)."
      ],
      bullets: [
        "تصميم متجاوب وعصري: تصميمات تتكيف بسلاسة مع الهواتف الذكية والأجهزة اللوحية والحواسيب المكتبية لضمان تجربة مستخدم مثالية.",
        "تحسين محركات البحث والسرعة: بناء كود نظيف وسريع يرضي خوارزميات محركات البحث ويضمن لك تصدراً عضوياً ووصولاً أكبر لجمهورك.",
        "الأمان والموثوقية: توفير أعلى معايير الحماية لبيانات عملائك وضمان استقرار الموقع حتى في أوقات الذروة وزيادة الزيارات."
      ],
      footer: "حول زوار موقعك إلى عملاء دائمين من خلال منصة رقمية تعبر عن طموحات أعمالك."
    },
    en: {
      headline: "Website Design & Development",
      subheadline: "Professional websites that drive conversions and user engagement",
      content: [
        "Your website is your primary digital storefront; it's the employee who never sleeps, working around the clock to welcome customers and showcase your services or products in the best possible light. We design and develop websites that are not only visually stunning but architected to achieve the highest Conversion Rates.",
        "Whether you need a corporate informational site or a full-scale e-commerce platform, our team guarantees fast, fully responsive solutions built to the latest SEO standards."
      ],
      bullets: [
        "Responsive & Modern Design: Layouts that adapt seamlessly to smartphones, tablets, and desktops to ensure a flawless user experience.",
        "SEO & Speed Optimization: Writing clean, fast code that satisfies search engine algorithms, ensuring organic ranking and wider audience reach.",
        "Security & Reliability: Providing the highest protection standards for your customers' data and ensuring site stability even during traffic spikes."
      ],
      footer: "Turn your website visitors into loyal customers through a digital platform that reflects your business ambitions."
    },
    image: '/services/website-development1.jpeg',
    icon: '/icon/mainicons1/webd1.png'
  },
  id_branding: {
    ar: {
      headline: "تصميم وتطوير العلامات التجارية",
      subheadline: "هوية بصرية استثنائية تميزك عن المنافسين وترسخ في أذهان عملائك",
      content: [
        "العلامة التجارية (Branding) هي الروح التي تميز أعمالك في سوق مزدحم؛ إنها الشعور الذي تتركه لدى العميل والقصة التي ترويها ألوانك وشعاراتك. نحن نؤمن بأن الهوية التجارية القوية هي الأساس الذي تُبنى عليه الثقة والولاء. لذا، نقدم حلاً شاملاً لبناء وتطوير علامتك التجارية من الصفر أو إعادة هيكلتها لتواكب رؤيتك المستقبلية.",
        "من خلال دراسة دقيقة للسوق وفهم عميق للجمهور المستهدف، نصمم هوية متكاملة تعبر عن قيم شركتك، لتكون لغتك البصرية واضحة، متسقة، ولا تُنسى عبر جميع نقاط الاتصال مع العملاء."
      ],
      bullets: [
        "تصميم الشعار والهوية البصرية: ابتكار شعار عصري وألوان وخطوط تعكس جوهر نشاطك التجاري بدقة.",
        "الدليل الإرشادي للعلامة التجارية (Brand Guidelines): بناء قواعد واضحة لضمان اتساق هويتك البصرية واللفظية عبر كافة القنوات والمطبوعات.",
        "صناعة القصة والصوت (Brand Voice): صياغة نبرة صوت مميزة تعبر عن شخصية علامتك التجارية وتسهل التواصل مع جمهورك."
      ],
      footer: "دعنا نصنع لك هوية تعبر عن قيمتك وتترك بصمة لا تُمحى في ذاكرة عملائك."
    },
    en: {
      headline: "Branding Design & Development",
      subheadline: "An exceptional visual identity that distinguishes you and sticks in your customers' minds",
      content: [
        "Branding is the soul that sets your business apart in a crowded market; it's the feeling you leave with the customer and the story your colors and logos tell. We believe a strong brand identity is the foundation upon which trust and loyalty are built. Therefore, we offer a comprehensive solution to build and develop your brand from scratch or rebrand to align with your future vision.",
        "Through careful market study and deep understanding of the target audience, we design an integrated identity that expresses your company's values, making your visual language clear, consistent, and unforgettable across all touchpoints."
      ],
      bullets: [
        "Logo & Visual Identity Design: Creating a modern logo, color palette, and typography that accurately reflect the core of your business.",
        "Brand Guidelines: Establishing clear rules to ensure visual and verbal consistency across all channels and printed materials.",
        "Brand Voice & Storytelling: Crafting a distinct tone of voice that expresses your brand personality and facilitates communication with your audience."
      ],
      footer: "Let us create an identity that expresses your value and leaves an indelible mark in your customers' memory."
    },
    image: '/services/BRAND-DESIGN.png',
    icon: '/icon/mainicons1/bdeveloment.png'
  },
  id_software: {
    ar: {
      headline: "تصميم وتطوير البرمجيات",
      subheadline: "حلول برمجية مخصصة لرفع كفاءة أعمالك وأتمتة عملياتك",
      content: [
        "مع تزايد تعقيد الأعمال وتوسع الشركات، تصبح الحلول البرمجية الجاهزة غير كافية لتلبية الاحتياجات الدقيقة للعمل. خدمة \"تصميم وتطوير البرمجيات\" لدينا تركز على بناء أنظمة (ERP/CRM) وحلول برمجية مخصصة (Custom Software) تُصمم خصيصاً لكي تتناسب مع نموذج أعمالك الفريد، مما يسهم في تبسيط العمليات وتقليل التكاليف التشغيلية.",
        "يقوم فريقنا من المهندسين والمطورين ببناء هياكل تقنية قوية، قابلة للتطوير المستقبلي، وتعتمد على أحدث التقنيات لضمان بيئة عمل رقمية متكاملة وخالية من الأعطال."
      ],
      bullets: [
        "التطوير المخصص وأتمتة العمليات: تصميم أنظمة داخلية تلبي احتياجاتك الدقيقة، مما يقلل من التدخل البشري ويرفع الكفاءة الإنتاجية.",
        "بنية قواعد البيانات وتكامل الأنظمة (API): بناء قواعد بيانات قوية وربط أنظمتك المختلفة ببعضها البعض لضمان تدفق سلس للمعلومات والبيانات.",
        "ضمان الجودة والأمان العالي: إخضاع كافة الأنظمة لاختبارات أداء صارمة وبروتوكولات أمان متقدمة لحماية بيانات شركتك وعملائك."
      ],
      footer: "استثمر في تكنولوجيا مصممة خصيصاً لك، لتقود أعمالك نحو مستوى جديد من التنظيم والكفاءة."
    },
    en: {
      headline: "Software Design & Development",
      subheadline: "Custom software solutions tailored to elevate efficiency and automate your operations",
      content: [
        "As businesses grow more complex, off-the-shelf software solutions become insufficient to meet exact operational needs. Our 'Software Design & Development' service focuses on building customized ERP/CRM systems and bespoke software specifically tailored to your unique business model, helping streamline operations and reduce operational costs.",
        "Our team of engineers and developers builds robust, scalable technical architectures relying on the latest technologies to ensure a seamless, crash-free digital work environment."
      ],
      bullets: [
        "Custom Development & Automation: Designing internal systems that meet your precise needs, reducing human intervention and boosting productivity.",
        "Database Architecture & API Integration: Building robust databases and connecting your various systems together to ensure a smooth flow of information.",
        "Quality Assurance & High Security: Subjecting all systems to rigorous performance testing and advanced security protocols to protect company and customer data."
      ],
      footer: "Invest in technology tailored just for you, leading your business to a new level of organization and efficiency."
    },
    image: '/services/software-development.jpg',
    icon: '/icon/mainicons1/software-10.png'
  },
  id_cloud: {
    ar: {
      headline: "خدمات السحابة",
      subheadline: "بنية تحتية رقمية آمنة، مرنة، وقابلة للتوسع لدعم استمرارية أعمالك",
      content: [
        "الانتقال إلى الحوسبة السحابية (Cloud Computing) هو الخطوة الأكثر أهمية نحو التحول الرقمي الحديث. نحن نقدم حلولاً سحابية متكاملة تتيح لك إدارة بياناتك وتطبيقاتك بمرونة عالية وأمان مطلق، مما يوفر لك التكاليف الهائلة المرتبطة بامتلاك وصيانة الخوادم التقليدية.",
        "سواء كنت ترغب في نقل أنظمتك الحالية إلى السحابة أو بناء تطبيقات تعتمد على البنية السحابية منذ اليوم الأول، نحن هنا لتوفير أفضل الاستراتيجيات التقنية (مثل AWS أو Google Cloud) لضمان استقرار وسرعة أداء غير مسبوقة لأعمالك."
      ],
      bullets: [
        "تأسيس وإدارة البنية التحتية (Infrastructure): إعداد سيرفرات سحابية تتميز بالأداء الفائق والقدرة على استيعاب ضغط العمل المتزايد بسلاسة.",
        "حلول التوسع التلقائي (Scaling): تخصيص الأنظمة لكي تتوسع قدراتها آلياً خلال أوقات الذروة، مما يضمن تجربة مستخدم خالية من البطء أو التوقف.",
        "الأمان والنسخ الاحتياطي اللحظي: تطبيق أقصى درجات الأمان السيبراني مع توفير أنظمة نسخ احتياطي مستمرة لضمان حماية واسترجاع بياناتك في أي لحظة."
      ],
      footer: "انتقل بأعمالك إلى آفاق أوسع مع بيئة سحابية تضمن لك الأمان، المرونة، والسرعة الفائقة."
    },
    en: {
      headline: "Cloud Services",
      subheadline: "Secure, flexible, and scalable digital infrastructure to support business continuity",
      content: [
        "Moving to Cloud Computing is the most crucial step towards modern digital transformation. We offer integrated cloud solutions that allow you to manage your data and applications with high flexibility and absolute security, saving you the massive costs associated with owning and maintaining traditional servers.",
        "Whether you want to migrate existing systems to the cloud or build cloud-native applications from day one, we are here to provide the best technical strategies (such as AWS or Google Cloud) to ensure unprecedented stability and speed for your business."
      ],
      bullets: [
        "Infrastructure Setup & Management: Setting up high-performance cloud servers capable of seamlessly handling increasing workloads.",
        "Auto-Scaling Solutions: Configuring systems to automatically expand capabilities during peak times, ensuring a lag-free user experience.",
        "Security & Real-time Backup: Applying top-tier cybersecurity measures with continuous backup systems to ensure your data is protected and recoverable instantly."
      ],
      footer: "Take your business to broader horizons with a cloud environment that guarantees security, flexibility, and ultimate speed."
    },
    image: '/services/cloud-services1.jpeg',
    icon: '/icon/mainicons1/cloud10.png'
  },
  re_appraisal: {
    ar: {
      headline: "التقييم العقاري والتسويق",
      subheadline: "رؤية تسويقية دقيقة مبنية على تقييم احترافي لتعظيم قيمة عقاراتك",
      content: [
        "النجاح في القطاع العقاري يبدأ من فهم القيمة الحقيقية للأصول وكيفية إبرازها للسوق. خدمة \"التقييم والتسويق العقاري\" تدمج بين الخبرة التقييمية الدقيقة والحلول التسويقية المبتكرة، لنضمن لك تقديم عقاراتك بالصورة التي تليق بها وبما يعكس قيمتها الفعلية لجذب المستثمرين والمشترين المناسبين.",
        "نعتمد على تحليل متعمق للسوق ودراسات مقارنة لتحديد الميزات التنافسية لكل عقار، ثم نضع خطة ترويجية مخصصة تستهدف العملاء المحتملين بدقة متناهية عبر القنوات الرقمية والتقليدية."
      ],
      bullets: [
        "التقييم الاحترافي والدقيق: دراسة العقار ومحيطه لتقديم تقدير سعر واقعي وتنافسي يعزز من فرص البيع أو التأجير السريع.",
        "التسويق المستهدف للمشترين: تصميم حملات إعلانية ذكية تستهدف الشريحة المهتمة بقطاع العقار بناءً على السلوكيات والقدرة الشرائية.",
        "صياغة الميزات التنافسية: كتابة نصوص بيعية ووصف دقيق يبرز نقاط القوة في العقار (مثل الموقع، التصميم، العوائد الاستثمارية) لخلق رغبة ملحة في الشراء."
      ],
      footer: "حقق أعلى عوائد ممكنة لعقاراتك من خلال تقييم دقيق وتسويق ذكي يصيب الهدف."
    },
    en: {
      headline: "Real Estate Appraisal & Marketing",
      subheadline: "A precise marketing vision based on professional valuation to maximize your property value",
      content: [
        "Success in the real estate sector starts with understanding the true value of assets and how to present them to the market. The 'Appraisal & Marketing' service merges precise valuation expertise with innovative marketing solutions, ensuring your properties are presented in a way that reflects their true value to attract the right investors and buyers.",
        "We rely on in-depth market analysis and comparative studies to determine the competitive advantages of each property, then create a customized promotional plan targeting potential clients with extreme precision across digital and traditional channels."
      ],
      bullets: [
        "Professional & Accurate Valuation: Studying the property and its surroundings to provide a realistic, competitive price estimate that boosts quick sale/rent chances.",
        "Targeted Buyer Marketing: Designing smart ad campaigns targeting real estate-interested demographics based on behaviors and purchasing power.",
        "Highlighting Competitive Advantages: Writing compelling sales copy and descriptions that highlight the property's strengths (like location, design, ROI) to create an urgent desire to buy."
      ],
      footer: "Achieve the highest possible returns for your properties through precise valuation and smart, targeted marketing."
    },
    image: '/services/appraisal1.jpeg',
    icon: '/icon/mainicons1/analysis.png'
  },
  re_marketing: {
    ar: {
      headline: "التسويق العقاري",
      subheadline: "استراتيجيات تسويق عقاري متكاملة لتسريع المبيعات وتعزيز الثقة",
      content: [
        "التسويق العقاري يختلف جذرياً عن أي نوع آخر من التسويق؛ فهو يتطلب بناء ثقة عميقة واستعراضاً دقيقاً للتفاصيل التي يبحث عنها العميل والمستثمر. خدمة \"التسويق العقاري\" لدينا مصممة خصيصاً لتلبية تحديات سوق العقارات، حيث نقدم حلولاً متكاملة تأخذ العميل المحتمل في رحلة سلسة من لحظة رؤية الإعلان وحتى إتمام صفقة الشراء.",
        "نحن نجمع بين أحدث أدوات التسويق الرقمي، صناعة المحتوى المتخصص، وإدارة الحملات المبنية على البيانات لضمان الوصول إلى العملاء ذوي النية الشرائية العالية والقدرة المالية المناسبة."
      ],
      bullets: [
        "توليد العملاء المحتملين (Lead Generation): إطلاق حملات متخصصة لاصطياد بيانات المهتمين الجادين بالشراء أو الاستثمار العقاري.",
        "إدارة الحضور الرقمي العقاري: تعزيز تواجدك على وسائل التواصل الاجتماعي والمواقع العقارية بمحتوى احترافي يبني مصداقيتك كمطور أو مسوق عقاري موثوق.",
        "تحسين معدلات التحويل (Conversion Optimization): متابعة مسار العملاء وتحليل سلوكياتهم وتوجيههم تدريجياً لزيارة المشاريع وإتمام الصفقات."
      ],
      footer: "تجاوز تحديات السوق العقاري وحقق أهداف مبيعاتك عبر خطط تسويقية مبنية على الأرقام والنتائج."
    },
    en: {
      headline: "Real Estate Marketing",
      subheadline: "Comprehensive real estate marketing strategies to accelerate sales and build trust",
      content: [
        "Real estate marketing differs fundamentally from other marketing types; it requires building deep trust and a meticulous showcase of details sought by clients and investors. Our 'Real Estate Marketing' service is specifically tailored to meet real estate market challenges, providing integrated solutions that take potential clients on a seamless journey from ad view to deal closure.",
        "We combine the latest digital marketing tools, specialized content creation, and data-driven campaign management to ensure reaching high-intent customers with the appropriate financial capability."
      ],
      bullets: [
        "Lead Generation: Launching specialized campaigns to capture the data of leads genuinely interested in buying or investing in real estate.",
        "Real Estate Digital Presence Management: Enhancing your presence on social media and real estate portals with professional content that builds your credibility as a trusted developer or marketer.",
        "Conversion Optimization: Tracking customer journeys, analyzing behaviors, and guiding them gradually to visit projects and close deals."
      ],
      footer: "Overcome real estate market challenges and achieve your sales goals through marketing plans built on numbers and results."
    },
    image: '/services/REAL-MARKETING1.jpeg',
    icon: '/icon/mainicons1/real-estate-marketing.png'
  },
  re_management: {
    ar: {
      headline: "إدارة الأملاك والمبيعات",
      subheadline: "إدارة احترافية شاملة تضمن نمو العوائد وراحة البال",
      content: [
        "إدارة العقارات والمشاريع ليست مجرد تحصيل للإيجارات أو إغلاق لصفقات بيع عابرة، بل هي فن إدارة الأصول لتعظيم عوائدها الاستثمارية والحفاظ على قيمتها السوقية. نحن نقدم خدمة \"إدارة الأملاك والمبيعات\" لرفع عبء المتابعة اليومية عن كاهلك، مع تقديم تجربة استثنائية وعالية الموثوقية للمستأجرين والمشترين.",
        "يتولى فريقنا كل التفاصيل بداية من الترويج وتأجير الوحدات الشاغرة، مروراً بالصيانة الدورية والتواصل الفعال مع العملاء، وصولاً إلى إغلاق الصفقات البيعية الكبرى باحترافية وسرعة فائقة."
      ],
      bullets: [
        "إدارة المبيعات والتأجير: تسويق وعرض الوحدات للعملاء المحتملين، وإجراء المفاوضات، وإتمام العقود بطريقة تضمن حقوق جميع الأطراف.",
        "إدارة علاقات العملاء (CRM): توفير دعم متواصل للمستأجرين والمشترين، والرد على استفساراتهم بسرعة لضمان رضاهم واستقرارهم الطويل.",
        "التقارير المالية والتحليلات: تزويدك بتقارير دورية دقيقة توضح التدفقات النقدية، نسب الإشغال، ومؤشرات أداء المبيعات لتبقى على اطلاع دائم باستثماراتك."
      ],
      footer: "ارتح من عناء الإدارة اليومية، ودع خبراءنا يضاعفون من قيمة أصولك وعوائدك الاستثمارية."
    },
    en: {
      headline: "Property Management & Sales",
      subheadline: "Comprehensive professional management ensuring revenue growth and peace of mind",
      content: [
        "Property and project management is not just about collecting rent or closing passing sales deals; it's the art of asset management to maximize ROI and maintain market value. We offer 'Property Management & Sales' to lift the burden of daily tracking off your shoulders, while delivering an exceptional and highly reliable experience for tenants and buyers.",
        "Our team handles every detail from promoting and leasing vacant units, through regular maintenance and effective client communication, down to closing major sales deals professionally and swiftly."
      ],
      bullets: [
        "Sales & Leasing Management: Marketing and showcasing units to prospects, conducting negotiations, and finalizing contracts ensuring all parties' rights.",
        "Customer Relationship Management (CRM): Providing continuous support to tenants and buyers, answering inquiries quickly to ensure long-term satisfaction and stability.",
        "Financial Reporting & Analytics: Providing precise periodic reports showing cash flows, occupancy rates, and sales KPIs so you remain fully aware of your investments."
      ],
      footer: "Rest from the hassle of daily management, and let our experts multiply your asset value and investment returns."
    },
    image: '/services/propert1.jpeg',
    icon: '/icon/mainicons1/sales-real10.png'
  },
  re_photography: {
    ar: {
      headline: "تصوير المشاريع والتمثيل المرئي",
      subheadline: "إبراز التفاصيل المعمارية الجمالية بصور تنبض بالحياة وتسحر المستثمرين",
      content: [
        "في قطاع العقارات، الصورة الأولى هي التي تصنع القرار. لا يكفي أن يكون مشروعك متميزاً على أرض الواقع، بل يجب أن ينعكس هذا التميز بوضوح في العالم الرقمي. نحن نقدم خدمة \"تصوير المشاريع والتمثيل المرئي\" لتوثيق عقاراتك بطريقة احترافية تُبرز فخامة التشطيبات، ذكاء التصميم الهندسي، ومساحات المشروع الواسعة.",
        "يستخدم فريقنا من المصورين المحترفين أحدث المعدات وعدسات الزوايا العريضة (Wide-angle) وتقنيات الإضاءة السينمائية لتقديم محتوى بصري فاخر يرفع من قيمة العقار ويشجع العميل على اتخاذ خطوة الزيارة أو الشراء."
      ],
      bullets: [
        "التصوير الفوتوغرافي المعماري: لقطات احترافية تبرز زوايا العقار والتوزيع الداخلي والإضاءة الطبيعية بأبهى صورة.",
        "التصوير الجوي (Drone): توثيق المشروع من الأعلى لبيان حجم الإنجاز وإبراز الموقع الاستراتيجي والخدمات المحيطة به.",
        "الترتيب واللمسات الفنية (Virtual & Physical Staging): تجهيز العقار بصرياً لإظهار إمكانياته الكاملة ومساعدة المشتري على تخيل مساحته كمنزل أو مكتب أحلامه."
      ],
      footer: "التقط جوهر مشروعك بعدسات احترافية، واجعل صورك هي البائع الأول لعقاراتك."
    },
    en: {
      headline: "Professional Photography & Representation",
      subheadline: "Highlighting aesthetic architectural details with lively photos that enchant investors",
      content: [
        "In the real estate sector, the first image drives the decision. It is not enough for your project to be outstanding on the ground; this excellence must be clearly reflected in the digital world. We offer 'Professional Photography & Representation' to document your properties professionally, highlighting luxury finishes, smart architectural design, and spacious project areas.",
        "Our team of professional photographers uses the latest equipment, wide-angle lenses, and cinematic lighting techniques to deliver premium visual content that elevates property value and prompts clients to visit or buy."
      ],
      bullets: [
        "Architectural Photography: Professional shots highlighting property angles, internal layout, and natural lighting in their best form.",
        "Aerial (Drone) Photography: Documenting the project from above to show scale, strategic location, and surrounding amenities.",
        "Virtual & Physical Staging: Visually preparing the property to showcase its full potential, helping buyers imagine the space as their dream home or office."
      ],
      footer: "Capture the essence of your project through professional lenses, and make your photos the primary seller of your properties."
    },
    image: '/services/PHOTOGRAPH1.jpeg',
    icon: '/icon/mainicons1/influencer.png'
  },
  re_campaign: {
    ar: {
      headline: "إدارة الحملات الإعلانية العقارية",
      subheadline: "استهداف دقيق للمستثمرين والمشترين لضمان سرعة إغلاق الصفقات",
      content: [
        "سوق العقارات شديد التنافسية، والوصول إلى المشتري المناسب يتطلب ما هو أكثر من مجرد إعلان تقليدي. خدمة \"إدارة الحملات الإعلانية العقارية\" تمنحك القوة للوصول إلى الأشخاص الذين يبحثون فعلياً عن عقارات توافق مواصفات مشاريعك، في التوقيت والمنصة المناسبين.",
        "نحن نصمم وندير حملات مدفوعة معقدة ومبنية على البيانات (عبر جوجل، ميتا، تيك توك، وسناب شات) تستهدف شرائح محددة بناءً على قدراتهم المالية واهتماماتهم العقارية، لضمان أعلى عائد على استثمارك الإعلاني."
      ],
      bullets: [
        "استراتيجية القنوات المتعددة (Multi-channel): توزيع الميزانية بذكاء على المنصات التي يتواجد بها المستثمرون لضمان تغطية شاملة وحضور مهيمن.",
        "توليد بيانات عملاء جادين (Qualified Leads): التركيز على جمع بيانات دقيقة لعملاء لديهم النية الحقيقية للشراء، مما يسهل عملية الإغلاق على فريق المبيعات.",
        "حملات إعادة الاستهداف (Retargeting): ملاحقة الزوار الذين أبدوا اهتماماً بمشاريعك العقارية لحثهم على إتمام التسجيل أو طلب الزيارة الميدانية."
      ],
      footer: "لا تضيع ميزانيتك في إعلانات عشوائية؛ اختر استهدافاً دقيقاً يحول النقرات إلى صفقات عقارية ناجحة."
    },
    en: {
      headline: "Advertising Campaign Management",
      subheadline: "Precise targeting of investors and buyers ensuring swift deal closures",
      content: [
        "The real estate market is highly competitive, and reaching the right buyer requires more than a traditional ad. The 'Real Estate Advertising Campaign Management' service gives you the power to reach people actively looking for properties matching your projects, at the right time and on the right platform.",
        "We design and manage complex, data-driven paid campaigns (across Google, Meta, TikTok, and Snapchat) targeting specific demographics based on their financial capabilities and real estate interests, ensuring the highest ROI on ad spend."
      ],
      bullets: [
        "Multi-channel Strategy: Smartly distributing budgets across platforms where investors reside to ensure comprehensive coverage and dominant presence.",
        "Qualified Lead Generation: Focusing on collecting accurate data of clients with a genuine intent to buy, facilitating closures for the sales team.",
        "Retargeting Campaigns: Pursuing visitors who showed interest in your real estate projects to urge them to complete registration or request a site visit."
      ],
      footer: "Don't waste your budget on random ads; choose precise targeting that turns clicks into successful real estate deals."
    },
    image: '/services/Campaign-Management1.jpeg',
    icon: '/icon/services-icon/real_estate_marketing.png'
  },
  re_project_images: {
    ar: {
      headline: "تصميم الهوية البصرية وصفحات الهبوط للمشاريع العقارية",
      subheadline: "عزز قيمة مشروعك بتصاميم استثنائية وصفحات هبوط مصممة للتحويل",
      content: [
        "كيف يمكنك إقناع المشتري بأن مشروعك العقاري مميز قبل حتى أن يزوره؟ الإجابة تكمن في الجودة البصرية والاحترافية التي تسبق الزيارة. نحن نوفر خدمة متكاملة تشمل ابتكار واجهات مرئية مبهرة وتصميم صفحات هبوط (Landing Pages) مخصصة لمشاريعك العقارية لضمان ترك انطباع أولي لا يُقاوم.",
        "نصمم الصفحات بطريقة هندسية توجه عين الزائر وتدفعه لاتخاذ إجراء سريع (Call to Action)، مع عرض المخططات، المرافق، وميزات الموقع بشكل عصري وسهل التصفح يثبت قوة مشروعك."
      ],
      bullets: [
        "تصميم صفحات الهبوط العقارية: بناء صفحات إلكترونية سريعة وموجهة بالكامل لشرح المشروع وتوليد البيانات (Leads) بكفاءة عالية.",
        "تصميم العروض والكتيبات (Brochures & Profiles): ابتكار ملفات تعريفية رقمية ومطبوعة فاخرة تشرح تفاصيل ومميزات العقار بشكل احترافي وراقٍ.",
        "العرض الثلاثي الأبعاد والمخططات (3D Floor Plans): تحويل المخططات الهندسية المعقدة إلى تصاميم مرئية جذابة يسهل على المشتري فهمها واستيعاب مساحاتها."
      ],
      footer: "ارفع من جاذبية مشروعك وقدمه للسوق بهوية بصرية فاخرة تدفع المستثمرين لاتخاذ القرار بثقة."
    },
    en: {
      headline: "Real Estate Project Image & Landing Page Design",
      subheadline: "Enhance your project value with exceptional designs and conversion-focused landing pages",
      content: [
        "How do you convince a buyer your real estate project is distinct before they even visit? The answer lies in the visual quality and professionalism preceding the visit. We provide an integrated service that includes creating dazzling visual interfaces and designing custom Landing Pages for your projects to ensure an irresistible first impression.",
        "We engineer pages to guide the visitor's eye and drive quick Call to Actions, showcasing floor plans, amenities, and location features in a modern, easily navigable way that proves your project's power."
      ],
      bullets: [
        "Real Estate Landing Page Design: Building fast, highly optimized web pages dedicated to explaining the project and efficiently generating Leads.",
        "Brochures & Profile Design: Creating luxurious digital and printed profiles that professionally and elegantly detail property features.",
        "3D Floor Plans & Displays: Transforming complex architectural blueprints into attractive visual designs that are easy for the buyer to understand and perceive space."
      ],
      footer: "Elevate your project's appeal and present it to the market with a premium visual identity that drives investors to decide confidently."
    },
    image: '/services/image1.jpeg',
    icon: '/icon/mainicons1/creation10.png'
  },
  re_current_eval: {
    ar: {
      headline: "تقييم وتحسين الهوية الحالية للمشاريع العقارية",
      subheadline: "إعادة إحياء المشاريع المتعثرة وبناء صورة ذهنية جديدة تجذب المستثمرين",
      content: [
        "هل يمتلك مشروعك العقاري مقومات النجاح لكنه يواجه صعوبة في المبيعات؟ قد تكمن المشكلة في الهوية التجارية أو الطريقة التي يُعرض بها للسوق. خدمة \"تقييم وتحسين الهوية\" مصممة لتشخيص وإعادة هندسة صورة مشروعك بشكل كامل ليكتسب زخماً تسويقياً جديداً ومؤثراً.",
        "نقوم بتحليل شامل لانطباعات العملاء (Brand Audit)، وتحديد نقاط الضعف في الحملات أو الهوية البصرية الحالية، ثم نبتكر استراتيجية إعادة وضع (Rebranding) تعيد المشروع إلى الواجهة بقوة وتجعله الخيار المفضل للمشترين."
      ],
      bullets: [
        "تحليل وتشخيص الهوية الحالية: تقييم نقاط القوة والضعف في شعار المشروع، طريقة تواصله، وانطباعات الجمهور المستهدف.",
        "إعادة بناء الهوية (Rebranding): تحديث الهوية البصرية وتغيير الرسائل التسويقية لتبدو أكثر عصرية وتتوافق مع تطلعات الشريحة المستهدفة.",
        "استراتيجية إعادة الإطلاق (Relaunch Strategy): دعم المشروع بخطة تسويق جديدة تماماً تبرز التحسينات وتخلق ضجة إيجابية في السوق العقاري."
      ],
      footer: "امنح مشروعك فرصة ثانية للنجاح من خلال هوية متجددة ورسائل تسويقية تصنع الفارق."
    },
    en: {
      headline: "Current Image Evaluation & Enhancement",
      subheadline: "Reviving stalled projects and building a new brand image that attracts investors",
      content: [
        "Does your real estate project have the components of success but struggles with sales? The problem might lie in the branding or how it's presented to the market. The 'Image Evaluation & Enhancement' service is designed to diagnose and entirely re-engineer your project's image to gain fresh, impactful marketing momentum.",
        "We conduct a comprehensive Brand Audit, identifying weaknesses in current campaigns or visual identity, then invent a Rebranding strategy that strongly brings the project back to the forefront and makes it the preferred choice for buyers."
      ],
      bullets: [
        "Current Identity Analysis & Diagnosis: Evaluating the strengths and weaknesses of the project's logo, communication style, and target audience impressions.",
        "Rebranding: Updating visual identity and altering marketing messages to appear more modern and align with the target demographic's aspirations.",
        "Relaunch Strategy: Supporting the project with a completely new marketing plan that highlights improvements and creates positive buzz in the real estate market."
      ],
      footer: "Give your project a second chance at success with a renewed identity and marketing messages that make a difference."
    },
    image: '/services/current-image.jpeg',
    icon: '/icon/mainicons1/current-image.png'
  },
  re_project_naming: {
    ar: {
      headline: "تسمية المشاريع العقارية",
      subheadline: "ابتكار أسماء استراتيجية رنانة تحمل قصة مشروعك وتسهل تذكره",
      content: [
        "الاسم هو أول ما يصافح مسامع العميل، وهو الحجر الأساس الذي تبنى عليه كافة جهودك التسويقية. اختيار اسم لمشروعك العقاري ليس مجرد تجميع لحروف، بل هو فن وعلم يتطلب فهماً للثقافة، الموقع، وطبيعة الشريحة المستهدفة. نحن نقدم خدمة \"تسمية المشاريع\" لابتكار أسماء فريدة وقوية ترتبط عاطفياً بعملائك.",
        "تمر عملية التسمية لدينا بعدة مراحل صارمة تبدأ من دراسة المنافسين وتوليد الأفكار، مروراً باختبار وقع الاسم وسهولة نطقه، ووصولاً إلى التأكد من إمكانية تسجيله قانونياً وحماية حقوقه الفكرية."
      ],
      bullets: [
        "البحث والاستكشاف المبدع: توليد قائمة من الأسماء المبتكرة التي تعكس رؤية المشروع، سواء كان سكنياً فاخراً أو تجارياً نابضاً بالحياة.",
        "الحساسية الثقافية واختبار السوق: التأكد من ملاءمة الاسم للثقافة المحلية وسهولة نطقه وتذكره لدى الجمهور المستهدف لضمان انتشار سريع.",
        "الفحص القانوني وتسجيل العلامة: التحقق من خلو الاسم من أي تعارضات قانونية لضمان حقوق الملكية الفكرية وسهولة حجز النطاق الإلكتروني (Domain Name)."
      ],
      footer: "اختر لمشروعك اسماً يعلق في الأذهان، ويكون نقطة الانطلاق الأولى نحو نجاحك التسويقي."
    },
    en: {
      headline: "Real Estate Project Naming",
      subheadline: "Inventing resonant, strategic names that carry your project's story and are easy to remember",
      content: [
        "A name is the first thing that reaches the customer's ears, and it is the cornerstone upon which all your marketing efforts are built. Choosing a name for your real estate project is not merely grouping letters; it is an art and science requiring an understanding of culture, location, and the nature of the target demographic. We offer the 'Project Naming' service to invent unique, strong names that emotionally connect with your clients.",
        "Our naming process goes through rigorous stages starting from competitor study and brainstorming, through testing the name's resonance and ease of pronunciation, down to ensuring its legal registrability and intellectual property protection."
      ],
      bullets: [
        "Creative Research & Exploration: Generating a list of innovative names reflecting the project's vision, whether it's luxury residential or vibrant commercial.",
        "Cultural Sensitivity & Market Testing: Ensuring the name suits local culture and is easy to pronounce and remember by the target audience ensuring rapid spread.",
        "Legal Check & Trademark Registration: Verifying the name is clear of any legal conflicts to ensure intellectual property rights and easy Domain Name booking."
      ],
      footer: "Choose a memorable name for your project that will be the first starting point toward your marketing success."
    },
    image: '/services/project-naming.jpeg',
    icon: '/icon/mainicons1/real-estate-project.png'
  }
};

export default function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { lang, t } = useLanguage();
  const resolvedParams = use(params);
  const serviceId = resolvedParams?.id;
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    console.log('Service Detail Page Mounted. ID:', serviceId);
  }, [serviceId]);

  const serviceData = serviceId ? DETAILED_SERVICES[serviceId] : null;

  if (mounted && serviceId && serviceId !== 'undefined' && !serviceData) {
    console.warn(`Service data not found for ID: ${serviceId}. Redirecting to custom-package.`);
    // If the service is not in our detailed list, we fallback to custom-package for now
    window.location.href = `/custom-package?service=${serviceId}`;
    return null;
  }

  if (mounted && (serviceId === 'undefined' || !serviceId)) {
    console.error('Invalid service ID provided. Redirecting back to services.');
    window.location.href = '/services';
    return null;
  }

  if (!mounted || !serviceData) return <div className="min-h-screen bg-[#0A0D1E]" />;

  const content = lang === 'ar' && serviceData.ar ? serviceData.ar : (serviceData.en || serviceData.ar);
  const isArabic = lang === 'ar';

  return (
    <div className="min-h-screen bg-[#0A0D1E] text-white">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${serviceData.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D1E] via-[#0A0D1E]/80 to-[#0A0D1E]/40" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 bg-[#14162e]/80 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
              <img src={serviceData.icon} alt="Icon" className="w-12 h-12 object-contain" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-orange"
          >
            {content.headline}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 font-light"
          >
            {content.subheadline}
          </motion.p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link 
          href="/services" 
          className="inline-flex items-center gap-2 text-brand-pink hover:text-brand-orange mb-10 transition font-medium"
        >
          {isArabic ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          {t('backToServices') || (isArabic ? 'العودة إلى الخدمات' : 'Back to Services')}
        </Link>

        <div className="space-y-8">
          {/* Paragraphs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {content.content.map((paragraph: string, idx: number) => (
              <p key={idx} className="text-gray-300 leading-relaxed text-lg text-justify">
                {paragraph}
              </p>
            ))}
          </motion.div>

          {/* Bullets */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#14162e]/50 border border-white/5 rounded-2xl p-8 shadow-xl mt-10"
          >
            <ul className="space-y-6">
              {content.bullets.map((bullet: string, idx: number) => {
                const [title, desc] = bullet.split(':');
                return (
                  <li key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-brand-pink to-brand-orange flex items-center justify-center">
                        <Check size={14} className="text-[#0A0D1E] font-bold" />
                      </div>
                    </div>
                    <div>
                      {desc ? (
                        <>
                          <strong className="brand-gradient-text block mb-1 text-xl">{title}:</strong>
                          <span className="text-gray-300 leading-relaxed block">{desc}</span>
                        </>
                      ) : (
                        <span className="text-gray-300 leading-relaxed">{bullet}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Footer Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12 py-8 border-t border-white/10"
          >
            <p className="text-xl md:text-2xl font-bold brand-gradient-text">
              {content.footer}
            </p>
          </motion.div>
          
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mt-10"
          >
            <Link 
              href="/pricing"
              className="bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] !text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(255,154,60,0.4)] transition-all transform hover:-translate-y-1 inline-block"
              style={{ color: '#ffffff' }}
            >
              {isArabic ? 'اطلب الخدمة الآن' : 'Request Service Now'}
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
