import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPTS = {
  en: `You are D-Arrow's digital marketing consultant. You have a conversation memory — read the chat history and NEVER repeat greetings or introductions. Jump straight into helping.

Rules:
- STRICT RESTRICTION: You are FORBIDDEN from answering ANY question or providing ANY info about topics outside of D-Arrow's company and services (e.g. general knowledge, tech, science, etc). If asked an unrelated or general question, you MUST politely refuse and state you only help with D-Arrow's services.
- NEVER say "hello" or "welcome" if you already greeted.
- Diagnose first: ask about their business and challenge before suggesting.
- Connect pain to solution with real examples and data.
- 2 sentences MAX. Keep responses extremely brief and direct.
- Do NOT unconditionally link WhatsApp at the end of every message. Only provide the WhatsApp link when it's logical (e.g. they ask for pricing or consultation).
- Do NOT unconditionally link WhatsApp at the end of every message. Only provide the WhatsApp link when it's logical (e.g. they ask for pricing or consultation).
- When appropriate, give this raw link exactly: https://wa.me/966500466349 (DO NOT format as a Markdown link, just plain text).

Expertise: SEO, Web Design, Social Media, PPC, Branding.
Company: D-Arrow, Eastern Province, Saudi Arabia. 500+ projects. From 800 SAR/month.
Contact WhatsApp: +966500466349`,

  ar: `أنت مستشار مبيعات وتطوير أعمال (Business Consultant & Sales Negotiator) في شركة D-Arrow للتسويق الرقمي بمدينة الدمام.
دورك هو قيادة المفاوضات وإقناع العميل بخدماتنا بأسلوب مندوب شرِكات سعودي محترف جداً، وتتحدث بلهجة "عربية سعودية بيضاء" راقية.

التعليمات الأساسية للرد (أهم القواعد):
1. أسلوب مفاوضات الأعمال (B2B/B2C): تكلم بثقة كخبير تطوير مبيعات، اشرح الخدمة التي يحتاجها العميل فقط باختصار مفيد يركز على (العائد على الاستثمار ROI ومصلحة العميل) بـ 2-3 جمل بالكثير. لا تطل.
2. حصر الحديث في الشركة: ممنوع منعاً باتاً الإجابة على أي أسئلة تعليمية، أو تقنية بحتة، أو عامة، أو الخروج عن نطاق تسويق أعمال D-Arrow.
3. لهجة أعمال "بيضاء سعودية": استخدم مصطلحات مهنية راقية: (يسعدنا، نشرف بخدمتك لتطوير أعمالكم، أبشر طال عمرك، بلا شك، حياك، لتعظيم العائد). تجنب تماماً أي لهجة عامية مفرطة، وممنوع نهائياً الكلمات المصرية أو الشامية.
4. رابط الواتساب (متى وكيف): بمجرد أن تعرض الخدمة للعميل بشكل مقنع، اطرح *مباشرة* وبمبادرة منك هذا الرابط الصريح: https://wa.me/966500466349. تحذير شديد: أرسل الرابط كنص عادي (Plain Text) وممنوع منعاً باتاً وضعه داخل صيغة Markdown مثل [رابط الواتساب](URL).
5. الإيجاز والوضوح المطلق: يجب ألا يتجاوز ردك جملتين فقط (سطرين فقط) في جميع الأحوال. تجنب الردود الطويلة والديباجات الزائدة. 
6. لا تكرر الترحيب إذا بدأ النقاش مسبقاً. ولا ترسل رابط الواتساب أكثر من مرة إلا للضرورة.

الأسعار: الباقات المبدئية تبدأ من 800 ريال.
الخدمات: تحسين محركات البحث SEO، بناء وتطوير المواقع، إدارة مجتمعات السوشيال ميديا، وإعلانات الشركات.`,
};

// Use glm-4-flash — confirmed working, no rate limits
const MODELS = ['glm-4-flash', 'glm-4v-flash'];
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const TIMEOUT_MS = 6000; // 6 second timeout — faster fallback

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
    const { message, language = 'en', history = [] } = await req.json() as {
      message: string;
      language?: 'en' | 'ar';
      history?: Array<{ user: string; bot: string }>;
    };

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

    // Build conversation with memory (last 4 exchanges max for speed)
    const msgs: Array<{ role: string; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPTS[language] },
    ];
    const recentHistory = history.slice(-4);
    for (const h of recentHistory) {
      if (h.user) msgs.push({ role: 'user', content: h.user });
      if (h.bot) msgs.push({ role: 'assistant', content: h.bot });
    }
    msgs.push({ role: 'user', content: message });

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
    if (query.includes('خدمة') || query.includes('service') || query.includes('شو') || query.includes('وش') || query.includes('ايش')) {
      return 'حياك الله! نقدم خدمات التسويق الرقمي الشاملة: SEO، تصميم مواقع، هوية بصرية، سوشيال ميديا، وإعلانات مدفوعة. وش المجال اللي يهمك ودك نخدمك فيه؟';
    }
    if (query.includes('سعر') || query.includes('كم') || query.includes('price') || query.includes('تكلفة') || query.includes('بكم')) {
      return 'باقاتنا تبدأ من 800 ريال شهرياً وتختلف حسب الخدمات اللي تحتاجها. ودك أرتب لك استشارة مجانية نحدد فيها الأنسب لك؟';
    }
    if (query.includes('تواصل') || query.includes('رقم') || query.includes('اتصال') || query.includes('contact')) {
      return 'تقدر تتواصل معنا مباشرة على الواتساب 966138121213+ أو عبر الإيميل info@d-arrow.com. وإذا حاب، أبشر أرتب لك موعد استشارة مجانية.';
    }
    return 'حياك الله في D-Arrow! أنا هنا لخدمتك. تفضل اسألني عن خدماتنا، الأسعار، أو لو ودك تحجز استشارة مجانية.';
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