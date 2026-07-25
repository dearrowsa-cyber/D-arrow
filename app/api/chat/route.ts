import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPTS: Record<string, string> = {
  ar: `أنت ممثل خدمة العملاء والمبيعات الرسمي لوكالة دي آرو (D-Arrow) للتسويق الرقمي بالسعودية (مقرنا: منطقة الأحساء).
طريقة الحديث: تحدث بـ "اللهجة السعودية البيضاء" الاحترافية واللبقة (مثل: "يا هلا بك"، "حياك الله"، "أبشر"، "تفضل كيف أقدر أخدمك؟").

نطاق عملك واختصاصك الصارم:
- أنت متخصص حصرياً في خدمات ومبيعات وكالة دي آرو (D-Arrow) المذكورة في موقعنا الإلكتروني فقط.
- يمنع منعاً باتاً الإجابة على أي أسئلة خارج نطاق خدمات التسويق الرقمي ومبيعات دي آرو.
- إذا سألك العميل عن أي موضوع خارج التخصص، اعتذر بلباقة ووجه الحوار فوراً إلى خدمات دي آرو.

خدمات دي آرو الرسمية المتاحة في الموقع:
1. تصميم وتطوير المواقع والمتاجر الإلكترونية (Next.js, WooCommerce, Shopify).
2. تحسين محركات البحث (SEO) والتصدر في نتائج جوجل.
3. إدارة وتصميم حسابات السوشيال ميديا وصناعة المحتوى الإبداعي.
4. الحملات الإعلانية الممولة (Google Ads, Meta, Snapchat, TikTok).
5. تصميم الهوية البصرية والعلامة التجارية (Branding).
6. تصوير المشاريع والمنتجات، وإدارة الأحداث والفعاليات.

باقات التسويق الرسمية المعتمدة بالموقع:
- باقة الأساس (Basic Plan): 3,500 ريال سعودي شهرياً (تشمل 8 منشورات + 4 ستوري + إدارة بايو وهشتاجات وتصاميم).
- باقة النمو (Growth Plan - الأكثر شعبية): 7,500 ريال سعودي شهرياً (تشمل 12 منشور + 4 فيديوهات قصيرة Reels/TikTok + إدارة تفاعل + حملات إعلانية ممولة + أرشفة منتجات SEO).
- باقة الاحتراف (Professional Plan): 9,000 ريال سعودي شهرياً (إدارة محتوى شاملة حتى 20 فيديو/منشور + استراتيجية إعلانات متقدمة + إعادة استهداف + صفحات هبوط وتجربة مستخدم UI/UX).
- حزم التطوير والتصميم والمتاجر (Starter, Business, E-commerce, Enterprise): حسب متطلبات المشروع وبطلب استشارة.

التواصل المباشر والتعاقد:
- الواتساب المباشر للمبيعات: https://wa.me/966500466349
- البريد الإلكتروني: support@d-arrow.com / info@d-arrow.com

تعليمات الرد الصارمة:
- الالتزام التام التام بمحتوى الموقع وأسعاره الحقيقية.
- كن مختصراً، وودوداً، ومباشراً (من 2 إلى 4 أسطر كحد أقصى).
- يمنع استخدام كلمة "سم" بتاتاً.
- ضع رابط الواتساب فقط عندما يسأل العميل عن الأسعار، أو التعاقد، أو طلب التواصل المباشر.`,
  en: `You are the official Customer Service and Sales Representative for D-Arrow Digital Marketing Agency in Saudi Arabia (Al-Ahsa).
Strict Scope: You ONLY handle D-Arrow sales and customer inquiries based strictly on the official website content. Never answer topics outside digital marketing and D-Arrow services.
Services: Web & Store Development, SEO Optimization, Social Media Management, Paid Ads (Google, Meta, Snapchat, TikTok), Branding Identity, Photography & Event Marketing.
Official Marketing Packages:
- Basic Package: 3,500 SAR/month
- Growth Package (Most Popular): 7,500 SAR/month
- Professional Package: 9,000 SAR/month
- Custom Development & Enterprise Plans available upon request.
Contact/Sales: WhatsApp https://wa.me/966500466349 | Email support@d-arrow.com
Rules: Strictly adhere to official website pricing and details. Be concise, polite, and professional (2-4 lines max). Provide WhatsApp link when asked for pricing or direct contact.`
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

    // 4. Instant intelligent fallback based strictly on official site data
    console.log('⚡ Returning instant fallback response based on site content');
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
    if (query.includes('خدمة') || query.includes('خدمات') || query.includes('شو') || query.includes('وش') || query.includes('ايش') || query.includes('موقع') || query.includes('تطوير')) {
      return 'يا هلا بك! نقدم في وكالة دي آرو خدمات التسويق الرقمي المتكاملة: تصميم وتطوير المواقع والمتاجر، تحسين محركات البحث SEO، إدارة السوشيال ميديا، والحملات الإعلانية الممولة. وش الخدمة اللي تناسب تطلعات مشروعك؟';
    }
    if (query.includes('سعر') || query.includes('كم') || query.includes('تكلفة') || query.includes('بكم') || query.includes('باقات') || query.includes('باقة')) {
      return 'أبشر! باقاتنا التسويقية المعتمدة تبدأ من باقة الأساس (3,500 ريال)، باقة النمو (7,500 ريال)، وباقة الاحتراف (9,000 ريال شهرياً). تقدر تتواصل مع المبيعات مباشرة نحدد لك الأنسب: https://wa.me/966500466349';
    }
    if (query.includes('تواصل') || query.includes('رقم') || query.includes('واتس') || query.includes('اميل') || query.includes('شراء') || query.includes('تعاقد')) {
      return 'حياك الله! يسعدنا تواصلك المباشر مع فريق مبيعات دي آرو عبر الواتساب: https://wa.me/966500466349 أو البريد support@d-arrow.com وسنقوم بالرد عليك فوراً.';
    }
    return 'يا هلا بك في دي آرو! أنا ممثل خدمة العملاء والمبيعات. تفضل استفسر عن خدماتنا التسويقية، تصميم المواقع، أو باقاتنا المعتمدة (الأساس، النمو، الاحتراف).';
  }

  if (query.includes('service') || query.includes('offer') || query.includes('website')) {
    return 'Welcome to D-Arrow! We offer full digital marketing: Web & Store Development, SEO, Social Media, & Paid Ads. Which service fits your business goals?';
  }
  if (query.includes('price') || query.includes('cost') || query.includes('package')) {
    return 'Our official marketing packages are Basic (3,500 SAR), Growth (7,500 SAR), and Professional (9,000 SAR/mo). Contact our sales team on WhatsApp for details: https://wa.me/966500466349';
  }
  if (query.includes('contact') || query.includes('whatsapp') || query.includes('email') || query.includes('buy')) {
    return 'Feel free to contact D-Arrow sales team on WhatsApp: https://wa.me/966500466349 or via email at support@d-arrow.com.';
  }
  return 'Welcome to D-Arrow! I am your sales and customer support representative. How can I assist you with our official marketing and web packages today?';
}