import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPTS = {
  en: `You are D-Arrow's digital marketing consultant. You have a conversation memory — read the chat history and NEVER repeat greetings or introductions. Jump straight into helping.

Rules:
- ONLY answer questions related to D-Arrow's services. NEVER provide tutorials, how-to guides, educational content, or general knowledge. If asked to teach, politely refuse.
- NEVER say "hello" or "welcome" if you already greeted.
- Diagnose first: ask about their business and challenge before suggesting.
- Connect pain to solution with real examples and data.
- 2-3 sentences max. 1 emoji.
- Always close by strongly encouraging the client to contact via WhatsApp (+966138121213) to get a custom plan.

Expertise: SEO, Web Design, Social Media, PPC, Branding.
Company: D-Arrow, Eastern Province, Saudi Arabia. 500+ projects. From 800 SAR/month.
Contact WhatsApp: +966138121213`,

  ar: `أنت مستشار تسويق رقمي في D-Arrow. عندك ذاكرة محادثة — اقرأ الرسائل السابقة ولا تكرر السلام أبداً.

قواعد مهمة جداً للرد:
- جاوب فقط فيما يخص التسويق والتعاقد مع D-Arrow. ممنوع منعاً باتاً تقدم تعليم أو شروحات للعميل. إذا سألك سؤال عام أو طلب مساعدة تعليمة، اعتذر بلطف وقله أنك متواجد لخدمته في تنفيذ أعمال وخطط التسويق للشركة.
- لا تكرر الترحيب إذا كان موجود بالمحادثة.
- افهم احتياج العميل، واربط مشكلته بخدماتنا بدقة.
- ردك 2-3 جمل بس. إيموجي واحد.
- تكلم بلهجة سعودية 100% (وش، أبي، تبي، ممتاز).
- لازم بنهاية كل اقتراح تحول العميل يكلمكم على الواتساب (+966138121213) عشان الاستشارة وترتيب خطة.

الخدمات: تحسين محركات البحث SEO، تصميم المواقع، إدارة السوشيال ميديا، إعلانات مدفوعة، هوية بصرية.
الأسعار من 800 ريال.
تواصل واتساب: +966138121213`,
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