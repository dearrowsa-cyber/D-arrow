import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPTS: Record<string, string> = {
  ar: `أنت 'دي آرو للذكاء الاصطناعي'، المساعد الذكي والمستشار التسويقي الرسمي لوكالة دي آرو (D-Arrow) للتسويق الرقمي في السعودية (الأحساء).
أنت تتحدث دائماً بـ "اللهجة السعودية البيضاء" الاحترافية والودودة (مثل: "يا هلا بك"، "حياك الله"، "أبشر"، "سم"، "تفضل كيف أقدر أخدمك؟").

بيانات وكالة دي آرو (D-Arrow):
- الخدمات: تصميم وتطوير المواقع، تحسين محركات البحث (SEO)، الحملات الإعلانية الممولة (جوجل، سناب، تيك توك)، إدارة السوشيال ميديا، الأتمتة وصناعة المحتوى.
- الباقات: تبدأ من 800 ريال سعودي شهرياً.
- للتواصل والتعاقد: الواتساب https://wa.me/966500466349 أو البريد info@d-arrow.com.

قواعد مهمة:
1. أجب باختصار وتركيز (3-4 أسطر كحد أقصى) وبأسلوب سعودي مميز.
2. ضع رابط الواتساب فقط عندما يسأل العميل عن الأسعار أو التعاقد أو التواصل المباشر.`,
  en: `You are 'D-Arrow AI', the official digital marketing assistant for D-Arrow Digital Marketing Agency in Saudi Arabia (Al-Ahsa).
Services: Web Design & Development, SEO, Paid Ads (Google, Snapchat, TikTok), Social Media Management, Content & Automation.
Packages start from 800 SAR/month.
Rules: Keep responses concise (3-4 lines max), friendly, and professional. Provide WhatsApp link (https://wa.me/966500466349) when asked about pricing, contact, or hiring.`
};

// Endpoints to try for maximum speed
const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://ollama:11434';
const ZHIPU_API_URL = process.env.ZAI_API_BASE || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const ZHIPU_API_KEY = process.env.ZAI_API_KEY || '';

const TIMEOUT_MS = 6000; // 6 second max per request for instant feel

// Abort controller fetch helper
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
    const { message, language = 'ar', history = [] } = await req.json() as {
      message: string;
      language?: 'en' | 'ar';
      history?: Array<{ user: string; bot: string }>;
    };

    if (!message) {
      return NextResponse.json({ error: 'Message is required', reply: 'يرجى كتابة رسالتك.' }, { status: 400 });
    }

    const currentLang = language === 'en' ? 'en' : 'ar';
    const msgs: Array<{ role: string; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPTS[currentLang] }
    ];

    // Append last 3 turns for context
    const recentHistory = history.slice(-3);
    for (const h of recentHistory) {
      if (h.user) msgs.push({ role: 'user', content: h.user });
      if (h.bot) msgs.push({ role: 'assistant', content: h.bot });
    }
    msgs.push({ role: 'user', content: message });

    // 1. Try Local Ollama (qwen2.5:3b or glm4 with fast 2k context & 10 CPU threads)
    try {
      console.log(`🤖 Requesting local Ollama model at ${OLLAMA_URL}...`);
      const startTime = Date.now();
      const ollamaRes = await fetchWithTimeout(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen2.5:3b', // Ultra-fast 3B model (8.9s on CPU vs 23.7s for 8B)
          messages: msgs,
          stream: false,
          options: {
            num_thread: 10,
            num_ctx: 2048,
            temperature: 0.7,
            top_p: 0.9,
          }
        })
      }, 5000);

      if (ollamaRes.ok) {
        const data = await ollamaRes.json();
        const reply = data.message?.content;
        if (reply) {
          console.log(`✅ Ollama qwen2.5:3b replied in ${Date.now() - startTime}ms`);
          return NextResponse.json({
            reply: reply.trim(),
            language: currentLang,
            success: true,
            source: 'ollama-qwen2.5:3b',
          });
        }
      }
    } catch (e: any) {
      console.log(`⚠️ Local Ollama fast attempt bypassed: ${e?.message || e}`);
    }

    // 2. Try GLM-4 via Ollama if qwen isn't loaded
    try {
      const startTime = Date.now();
      const glmRes = await fetchWithTimeout(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'glm4:latest',
          messages: msgs,
          stream: false,
          options: {
            num_thread: 10,
            num_ctx: 2048,
            temperature: 0.7,
          }
        })
      }, 5000);

      if (glmRes.ok) {
        const data = await glmRes.json();
        const reply = data.message?.content;
        if (reply) {
          console.log(`✅ Ollama glm4 replied in ${Date.now() - startTime}ms`);
          return NextResponse.json({
            reply: reply.trim(),
            language: currentLang,
            success: true,
            source: 'ollama-glm4',
          });
        }
      }
    } catch (e: any) {
      console.log(`⚠️ Local Ollama GLM-4 attempt bypassed: ${e?.message || e}`);
    }

    // 3. Try Cloud Zhipu API (if key configured)
    if (ZHIPU_API_KEY) {
      try {
        const startTime = Date.now();
        const zhipuRes = await fetchWithTimeout(ZHIPU_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ZHIPU_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'glm-4-flash',
            messages: msgs,
            stream: false,
            temperature: 0.7,
            max_tokens: 250,
          })
        }, TIMEOUT_MS);

        if (zhipuRes.ok) {
          const data = await zhipuRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            console.log(`✅ Zhipu Cloud GLM-4 replied in ${Date.now() - startTime}ms`);
            return NextResponse.json({
              reply: reply.trim(),
              language: currentLang,
              success: true,
              source: 'zhipu-glm-4-flash',
            });
          }
        }
      } catch (e: any) {
        console.log(`⚠️ Zhipu API bypassed: ${e?.message || e}`);
      }
    }

    // 4. Instant intelligent fallback
    console.log('⚡ Returning instant intelligent fallback response');
    return NextResponse.json({
      reply: generateFallbackResponse(message, currentLang),
      language: currentLang,
      success: true,
      source: 'fallback-fast',
    });

  } catch (error: unknown) {
    console.error('💥 Chat API error:', error);
    return NextResponse.json({
      reply: generateFallbackResponse('مرحبا', 'ar'),
      success: true,
      source: 'fallback',
    }, { status: 200 });
  }
}

function generateFallbackResponse(message: string, language: 'en' | 'ar'): string {
  const query = message.toLowerCase();

  if (language === 'ar') {
    if (query.includes('خدمة') || query.includes('خدمات') || query.includes('شو') || query.includes('وش') || query.includes('ايش')) {
      return 'يا هلا بك! نقدم في دي آرو كافة خدمات التسويق الرقمي: تصميم المواقع، SEO، إدارة حسابات التواصل الاجتماعي، والحملات الإعلانية الممولة. وش القطاع أو الخدمة اللي تفضل نبدأ فيها؟';
    }
    if (query.includes('سعر') || query.includes('كم') || query.includes('تكلفة') || query.includes('بكم') || query.includes('باقات')) {
      return 'أبشر! باقاتنا التسويقية تبدأ من 800 ريال شهرياً وتتحدد حسب احتياجات مشروعك. تقدر تتواصل معنا مباشرة على الواتساب نحدد لك الباقة المناسبة: https://wa.me/966500466349';
    }
    if (query.includes('تواصل') || query.includes('رقم') || query.includes('واتس') || query.includes('اميل')) {
      return 'حياك الله! يسعدنا تواصلك معنا مباشرة عبر الواتساب: https://wa.me/966500466349 أو الإيميل info@d-arrow.com وسنقوم بالرد عليك فوراً.';
    }
    return 'يا هلا بك في دي آرو! أنا مستشارك الذكي للتسويق الرقمي. تفضل كيف أقدر أساعدك اليوم؟ (الخدمات، الأسعار، أو استشارة مجانية).';
  }

  if (query.includes('service') || query.includes('offer')) {
    return 'Welcome to D-Arrow! We provide full digital marketing services: Web Design, SEO, Social Media, & Paid Ads. Which service are you interested in?';
  }
  if (query.includes('price') || query.includes('cost') || query.includes('package')) {
    return 'Our marketing packages start from 800 SAR/month. Contact us on WhatsApp for a custom quote: https://wa.me/966500466349';
  }
  if (query.includes('contact') || query.includes('whatsapp') || query.includes('email')) {
    return 'Feel free to contact us on WhatsApp: https://wa.me/966500466349 or via email at info@d-arrow.com.';
  }
  return 'Welcome to D-Arrow! I am your AI digital marketing assistant. How can I help you today?';
}