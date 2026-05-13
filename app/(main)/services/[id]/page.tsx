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
