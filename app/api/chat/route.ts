import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPTS = {
  en: `You are the virtual consultant for D-Arrow Digital Marketing Agency. You speak like a real senior marketing expert — confident, knowledgeable, and genuinely helpful.

HOW YOU THINK:
- You diagnose before prescribing. Ask about their business, target audience, current challenges.
- You connect their pain to a specific solution. Example: "If your competitors are ranking above you on Google, that's costing you real customers every day. Our SEO program typically gets clients to page one within 90 days."
- You use data and results to build trust: "We've helped 500+ businesses across Saudi Arabia grow their digital presence."
- You close naturally: offer a free consultation, ask a follow-up question, suggest next steps.

YOUR EXPERTISE:
- SEO: You know search algorithms, keyword strategy, local SEO for Saudi market.
- Web Design: You understand conversion optimization, page speed, mobile-first design.
- Social Media: You know content strategy, community building, paid social vs organic.
- PPC: You understand Google Ads, cost-per-lead optimization, ROAS.
- Branding: You know visual identity, brand positioning, competitive differentiation.

COMPANY: D-Arrow, Eastern Province, Saudi Arabia. 500+ projects. From 800 SAR/month. Contact: info@d-arrow.com | +966 13 812 1213

STYLE: 2-4 sentences. Max 1 emoji. Have a real conversation — never dump information.`,

  ar: `أنت المستشار الرقمي لوكالة D-Arrow للتسويق الرقمي. تتكلم كخبير تسويق حقيقي — واثق، عنده خبرة، ويبي فعلاً يساعد العميل.

طريقة تفكيرك:
- تفهم قبل ما تقترح. اسأل عن نشاطه، جمهوره المستهدف، وش التحديات اللي يواجهها.
- تربط مشكلته بحل محدد. مثال: "إذا منافسينك يطلعون قبلك في قوقل، هذا معناه إنك تخسر عملاء كل يوم. برنامج الـ SEO عندنا عادةً يوصّل العميل للصفحة الأولى خلال 90 يوم."
- تستخدم أرقام ونتائج تبني ثقة: "ساعدنا أكثر من 500 بزنس في السعودية يطوّروا وجودهم الرقمي."
- تختم بشكل طبيعي: تقترح استشارة مجانية، تسأل سؤال متابعة، أو تقترح الخطوة الجاية.

خبرتك:
- SEO: تفهم خوارزميات البحث، استراتيجيات الكلمات المفتاحية، والـ SEO المحلي للسوق السعودي.
- تصميم مواقع: تفهم تحسين معدل التحويل، سرعة الصفحة، وتصميم الموبايل أولاً.
- سوشيال ميديا: تفهم استراتيجية المحتوى، بناء المجتمع، الفرق بين المدفوع والعضوي.
- إعلانات: تفهم قوقل أدز، تحسين تكلفة العميل المحتمل، والعائد على الإنفاق الإعلاني.
- هوية بصرية: تفهم الهوية البصرية، تموضع البراند، والتمييز عن المنافسين.

الشركة: D-Arrow، المنطقة الشرقية، السعودية. أكثر من 500 مشروع. الباقات من 800 ريال/شهر. التواصل: info@d-arrow.com | +966138121213

الأسلوب: ردك 2-4 جمل. إيموجي واحد بالكثير. سوّي محادثة طبيعية — لا تحط كل المعلومات مرة وحدة. تكلم بلهجة سعودية واضحة ومهنية.`,
};

// Use glm-4-flash — confirmed working, no rate limits
const MODELS = ['glm-4-flash', 'glm-4v-flash'];
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const TIMEOUT_MS = 8000; // 8 second timeout — fall back to static if API is slow

// Fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, language = 'en' } = await req.json() as { message: string; language?: 'en' | 'ar' };

    if (!message) {
      return NextResponse.json({ error: 'Message is required', reply: 'Please provide a message.' }, { status: 400 });
    }

    const apiKey = process.env.ZAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: generateFallbackResponse(message, language as 'en' | 'ar'),
        language, success: true, source: 'fallback',
      });
    }

    const msgs = [
      { role: 'system', content: SYSTEM_PROMPTS[language] },
      { role: 'user', content: message },
    ];

    // Try each model with a timeout
    for (const model of MODELS) {
      try {
        console.log(`🔄 Trying ${model}...`);
        const response = await fetchWithTimeout(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: msgs,
            temperature: 0.6,
            max_tokens: 250,
          }),
        }, TIMEOUT_MS);

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            console.log(`✅ ${model} replied`);
            return NextResponse.json({
              reply: reply.trim(), language, success: true,
              source: `zhipu-${model}`, model,
            });
          }
        } else {
          console.error(`❌ ${model}: ${response.status}`);
        }
      } catch (e) {
        // Timeout or network error — try next model or fall back
        console.error(`⏱️ ${model} timeout/error`);
      }
    }

    // All models failed — return instant static response
    console.log('📌 Static fallback');
    return NextResponse.json({
      reply: generateFallbackResponse(message, language as 'en' | 'ar'),
      language, success: true, source: 'fallback',
    });

  } catch (error: unknown) {
    console.error('💥 Error:', error);
    return NextResponse.json({
      reply: generateFallbackResponse('hello', 'en'),
      success: true, source: 'fallback',
    }, { status: 200 });
  }
}

function generateFallbackResponse(message: string, language: 'en' | 'ar'): string {
  const query = message.toLowerCase();

  if (language === 'ar') {
    if (query.includes('خدمة') || query.includes('service') || query.includes('شو') || query.includes('ايش')) {
      return 'نقدم خدمات التسويق الرقمي الشاملة: SEO، تصميم مواقع، هوية بصرية، سوشيال ميديا، وإعلانات مدفوعة. إيش المجال اللي يهمك بالتحديد؟';
    }
    if (query.includes('سعر') || query.includes('كم') || query.includes('price') || query.includes('تكلفة')) {
      return 'باقاتنا تبدأ من 800 ريال شهرياً، وتختلف حسب الخدمات المطلوبة. تحب أرتب لك استشارة مجانية نحدد فيها الأنسب لك؟';
    }
    if (query.includes('تواصل') || query.includes('رقم') || query.includes('اتصال') || query.includes('contact')) {
      return 'تقدر تتواصل معنا على info@d-arrow.com أو تتصل على 966138121213+. أو لو تحب، أقدر أرتب لك موعد استشارة مجانية.';
    }
    return 'أهلاً بك في D-Arrow! أنا هنا أساعدك. تقدر تسأل عن خدماتنا أو الأسعار أو تحجز استشارة مجانية.';
  }

  if (query.includes('service') || query.includes('what') || query.includes('offer')) {
    return 'We offer full-spectrum digital marketing: SEO, web design, branding, social media, and paid advertising. Which area are you most interested in?';
  }
  if (query.includes('price') || query.includes('cost') || query.includes('how much') || query.includes('package')) {
    return 'Our packages start from 800 SAR/month depending on the services you need. Would you like to schedule a free consultation so we can recommend the right plan?';
  }
  if (query.includes('contact') || query.includes('call') || query.includes('email') || query.includes('phone')) {
    return 'You can reach us at info@d-arrow.com or call +966 13 812 1213. I can also arrange a free consultation if you prefer.';
  }
  return 'Welcome to D-Arrow! I\'m here to help. Feel free to ask about our services, pricing, or schedule a free consultation.';
}