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
- When appropriate, give this raw link exactly: https://wa.me/966500466349 (DO NOT format as a Markdown link, just plain text).

Expertise: SEO, Web Design, Social Media, PPC, Branding.
Company: D-Arrow, Al-Ahsa Region, Saudi Arabia. 45+ projects. From 800 SAR/month.
Contact WhatsApp: +966500466349`,

  ar: `أنت مستشار مبيعات وتطوير أعمال (Business Consultant) في شركة D-Arrow للتسويق الرقمي بمنطقة الأحساء.
دورك هو التحدث مع العملاء وكأنك إنسان سعودي محترف تتحدث بلهجة "سعودية بيضاء" راقية وودودة.

التعليمات الأساسية للرد:
1. رد السلام والتحية: إذا قال العميل "السلام عليكم" أو ألقى التحية، يجب أن ترد عليه بتحية إسلامية وسعودية لائقة أولاً (مثل: وعليكم السلام ورحمة الله، حياك الله أخوي/أختي، يا هلا والله...). لا تتجاهل التحية أبداً.
2. الاستماع والفهم أولاً: لا تقم برمي إجابات جاهزة أو تسويق مباشر. اسأل العميل أسئلة منطقية لفهم احتياجه ومشروعه أولاً (مثال: وش طبيعة مشروعك طال عمرك؟ أو كيف نقدر نساعدك في تطوير أعمالك؟).
3. لهجة سعودية بيضاء طبيعية: استخدم كلمات ترحيبية مثل (حياك الله، أبشر، طال عمرك، يسعدنا نخدمك). تجنب اللهجات الشامية، المصرية، أو العربية الفصحى المعقدة والآلية. تحدث كأنك شخص طبيعي.
4. متى ترسل رابط الواتساب: ممنوع منعاً باتاً إرسال رابط الواتساب في كل رسالة أو في بداية الحديث. أرسل الرابط (https://wa.me/966500466349) *فقط* في الحالات التالية:
   - إذا طلب العميل التواصل مع شخص حقيقي أو الإدارة.
   - إذا سأل عن الأسعار النهائية أو أراد إتمام التعاقد.
   - إذا لم يعد لديك إجابات أو معلومات تفيده وتريد تحويله لخدمة العملاء.
5. الإيجاز والتركيز: حافظ على ردودك قصيرة ومريحة للقراءة (جملتين أو 3 كحد أقصى).
6. حصر الحديث في الشركة: لا تجب على أي أسئلة خارج نطاق خدمات الشركة أو التسويق. اعتذر بلباقة إذا سألك عن مواضيع عامة.

الأسعار: الباقات المبدئية تبدأ من 800 ريال.
الخدمات: تحسين محركات البحث SEO، بناء وتطوير المواقع، إدارة مجتمعات السوشيال ميديا، وإعلانات الشركات.`,
};

// Unified API config — Zhipu BigModel (GLM)
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const MODELS = ['glm-4-flash', 'glm-4v-flash'];
const TIMEOUT_MS = 15000; // 15 seconds — enough for China-based API

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

    // Check if API key is missing or is the placeholder value
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      console.warn('⚠️ ZAI_API_KEY is not configured or is placeholder. Using fallback.');
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
        console.log(`🔄 Trying ${model} at ${API_URL}...`);
        const startTime = Date.now();
        
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

        const elapsed = Date.now() - startTime;

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            console.log(`✅ ${model} replied in ${elapsed}ms`);
            return NextResponse.json({
              reply: reply.trim(), language, success: true,
              source: `zhipu-${model}`, model,
            });
          }
        } else {
          const errorBody = await response.text();
          console.error(`❌ ${model}: HTTP ${response.status} in ${elapsed}ms — ${errorBody.substring(0, 200)}`);
        }
      } catch (e: any) {
        if (e?.name === 'AbortError') {
          console.error(`⏱️ ${model} timed out after ${TIMEOUT_MS}ms`);
        } else {
          console.error(`💥 ${model} error:`, e?.message || e);
        }
      }
    }

    // All models failed — return instant static response
    console.log('📌 All AI models failed. Returning static fallback.');
    return NextResponse.json({
      reply: generateFallbackResponse(message, language as 'en' | 'ar'),
      language, success: true, source: 'fallback',
    });

  } catch (error: unknown) {
    console.error('💥 Chat API Error:', error);
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
      return 'تقدر تتواصل معنا مباشرة على الواتساب https://wa.me/966500466349 أو عبر الإيميل support@d-arrow.com. وإذا حاب، أبشر أرتب لك موعد استشارة مجانية.';
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
    return 'You can reach us at support@d-arrow.com or WhatsApp https://wa.me/966500466349. I can also arrange a free consultation if you prefer.';
  }
  return 'Welcome to D-Arrow! I\'m here to help. Feel free to ask about our services, pricing, or schedule a free consultation.';
}