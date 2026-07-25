import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPTS: Record<string, string> = {
  ar: `أنت ممثل خدمة العملاء والمبيعات الرسمي لوكالة دي آرو (D-Arrow) للتسويق الرقمي بالسعودية.
طريقة الحديث: تحدث بـ "اللهجة السعودية البيضاء" الاحترافية واللبقة (مثل: "يا هلا بك"، "حياك الله"، "أبشر"، "تفضل كيف أقدر أخدمك؟").

نطاق عملك واختصاصك الوحيد:
أنت متخصص فقط في خدمات ومبيعات وكالة دي آرو (D-Arrow). لا تجب على أي أسئلة خارج نطاق التسويق الرقمي وخدمات دي آرو. إذا سألك العميل عن موضوع خارج التخصص، اعتذر بلباقة ووجه الحوار مباشرة لخدماتنا.

خدمات دي آرو:
1. تصميم وتطوير المواقع والمتاجر الإلكترونية.
2. تحسين محركات البحث (SEO).
3. إدارة وتصميم حسابات السوشيال ميديا.
4. الحملات الإعلانية الممولة (جوجل، سناب شات، تيك توك، انستقرام).
5. الأتمتة وصناعة المحتوى الرقمي.

الباقات والأسعار:
- باقاتنا التسويقية تبدأ من 800 ريال سعودي شهرياً وتختلف حسب متطلبات المشروع.

التواصل والتعاقد:
- للتعاقد أو التواصل المباشر مع فريق المبيعات: الواتساب https://wa.me/966500466349 أو البريد info@d-arrow.com

تعليمات الرد:
- كن مختصراً، وودوداً، ومباشراً (3 أسطر كحد أقصى).
- لا تضع كلمة "سم" في نهاية ردك بتاتاً.
- ضع رابط الواتساب فقط عندما يسأل العميل عن الأسعار، أو التعاقد، أو طلب التواصل المباشر.`,
  en: `You are the official Customer Service and Sales Representative for D-Arrow Digital Marketing Agency in Saudi Arabia.
Your ONLY role is D-Arrow sales and customer support. Never answer questions outside of digital marketing and D-Arrow services.
Services: Web Design & Development, SEO, Social Media Management, Paid Ads (Google, Snapchat, TikTok, Instagram), Content Creation.
Packages: Starts from 800 SAR/month.
Contact/Sales: WhatsApp https://wa.me/966500466349 or info@d-arrow.com
Rules: Be concise, polite, professional (max 3 lines). Provide WhatsApp link when asked for pricing or direct contact.`
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

    // 1. Try Local Ollama (qwen2.5:3b)
    try {
      console.log(`🤖 Requesting local Ollama model at ${OLLAMA_URL}...`);
      const startTime = Date.now();
      const ollamaRes = await fetchWithTimeout(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen2.5:3b',
          messages: msgs,
          stream: false,
          options: {
            num_thread: 10,
            num_ctx: 2048,
            temperature: 0.6,
            top_p: 0.9,
          }
        })
      }, 5000);

      if (ollamaRes.ok) {
        const data = await ollamaRes.json();
        let reply = data.message?.content;
        if (reply) {
          // Clean any stray "سم" at the end if model outputs it
          reply = cleanReplyText(reply);
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

    // 2. Try GLM-4 via Ollama
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
            temperature: 0.6,
          }
        })
      }, 5000);

      if (glmRes.ok) {
        const data = await glmRes.json();
        let reply = data.message?.content;
        if (reply) {
          reply = cleanReplyText(reply);
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

    // 3. Try Cloud Zhipu API
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
            temperature: 0.6,
            max_tokens: 250,
          })
        }, TIMEOUT_MS);

        if (zhipuRes.ok) {
          const data = await zhipuRes.json();
          let reply = data.choices?.[0]?.message?.content;
          if (reply) {
            reply = cleanReplyText(reply);
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
    console.log('⚡ Returning instant fallback response');
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

function cleanReplyText(text: string): string {
  if (!text) return '';
  let cleaned = text.trim();
  // Strip trailing "سم" or "سم." or "سم!"
  cleaned = cleaned.replace(/\s*سم[.!؟]*$/gi, '');
  return cleaned;
}

function generateFallbackResponse(message: string, language: 'en' | 'ar'): string {
  const query = message.toLowerCase();

  if (language === 'ar') {
    if (query.includes('خدمة') || query.includes('خدمات') || query.includes('شو') || query.includes('وش') || query.includes('ايش') || query.includes('موقع')) {
      return 'يا هلا بك! نقدم في وكالة دي آرو كافة خدمات التسويق الرقمي وتصميم المواقع والمتاجر، تحسين SEO، وإدارة الحملات الإعلانية. تفضل، وش نوع الخدمة اللي تفكر تطلقها لمشروعك؟';
    }
    if (query.includes('سعر') || query.includes('كم') || query.includes('تكلفة') || query.includes('بكم') || query.includes('باقات')) {
      return 'أبشر! باقاتنا التسويقية تبدأ من 800 ريال شهرياً وتختلف حسب احتياجات مشروعك. تواصل معنا على الواتساب للمبيعات ونحدد لك الباقة المناسبة: https://wa.me/966500466349';
    }
    if (query.includes('تواصل') || query.includes('رقم') || query.includes('واتس') || query.includes('اميل') || query.includes('شراء') || query.includes('تعاقد')) {
      return 'حياك الله! يسعدنا تواصلك المباشر مع فريق مبيعات دي آرو عبر الواتساب: https://wa.me/966500466349 أو البريد info@d-arrow.com وسنقوم بالرد عليك فوراً.';
    }
    return 'يا هلا بك في دي آرو! أنا ممثل خدمة العملاء والمبيعات. يسعدني إجابة أي استفسار حول خدماتنا التسويقية وتصميم المواقع والباقات المتاحة.';
  }

  if (query.includes('service') || query.includes('offer') || query.includes('website')) {
    return 'Welcome to D-Arrow! We offer full digital marketing services: Web & Store Development, SEO, Social Media, & Paid Ads. How can we help your business today?';
  }
  if (query.includes('price') || query.includes('cost') || query.includes('package')) {
    return 'Our marketing packages start from 800 SAR/month. Contact our sales team on WhatsApp for a custom quote: https://wa.me/966500466349';
  }
  if (query.includes('contact') || query.includes('whatsapp') || query.includes('email') || query.includes('buy')) {
    return 'Feel free to contact D-Arrow sales team on WhatsApp: https://wa.me/966500466349 or via email at info@d-arrow.com.';
  }
  return 'Welcome to D-Arrow! I am your sales and customer support representative. How can I assist you with our services today?';
}