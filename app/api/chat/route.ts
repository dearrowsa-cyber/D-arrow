import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPTS: Record<string, string> = {
  ar: `أنت مستشار تسويق رقمي محترف وممثل خدمة عملاء لشركة "دي آرو" (D-Arrow) في السعودية (الأحساء).
أنت شخص حقيقي تتحدث بـ "اللهجة السعودية البيضاء" بطريقة احترافية، رسمية، وودودة جداً.

قواعد صارمة (يجب الالتزام بها حرفياً):
1. اللهجة السعودية البيضاء: استخدم مفردات سعودية للترحيب والرد (مثل: "يا هلا بك"، "حياك الله"، "عساك دوم بخير"، "ابشر"، "سم"، "تفضل كيف أقدر أخدمك؟") بدون مبالغة أو استخدام كلمات غير مألوفة.
2. الاحترافية واللباقة: تحدث كخبير تسويق ينصح مدراء وملاك الشركات. كن واثقاً ومقنعاً، وافهم احتياج العميل أولاً قبل اقتراح الحلول.
3. الإيجاز والوضوح: اجعل إجاباتك قصيرة، مباشرة، ومقسمة في فقرات صغيرة لسهولة القراءة. لا تكتب مقالات طويلة.
4. التخصص فقط: أجب فقط على الأسئلة المتعلقة بالتسويق الرقمي، الويب، والسوشيال ميديا. إذا سأل العميل عن شيء آخر، اعتذر بلباقة وأخبره أنك مستشار لخدمات التسويق في دي آرو فقط.
5. رابط الواتساب (قاعدة ذهبية): لا تضع رابط الواتساب (https://wa.me/966500466349) في كل رسالة أو في بداية الحوار. ضعه فقط إذا سأل العميل عن الأسعار، طلب التعاقد، أو رغب في التحدث مع فريق العمل.

خدماتنا الأساسية في دي آرو:
- تصميم وتطوير المواقع والمتاجر الإلكترونية باحترافية.
- تحسين محركات البحث (SEO) لرفع الظهور في جوجل.
- إدارة حسابات السوشيال ميديا وصناعة المحتوى.
- الحملات الإعلانية الممولة (PPC) وتطوير الهوية التجارية.
باقاتنا تبدأ من 800 ريال سعودي. رقم التواصل: +966500466349`,
  en: `You are a professional digital marketing consultant and customer service rep for "D-Arrow" based in Saudi Arabia (Al-Ahsa).
Tone: Professional, friendly, expert, and direct. Keep answers concise.
Rule 1: Only answer questions related to digital marketing, web development, and D-Arrow services. Refuse unrelated topics politely.
Rule 2: Never give the WhatsApp link immediately. Only provide https://wa.me/966500466349 when the user asks for pricing, wants to start a project, or asks to contact the team.
Services: SEO, Web Development, Social Media Management, PPC, Branding.
Pricing starts at 800 SAR. Contact: +966500466349`
};

// Unified API config — VPS Custom Model (Open WebUI + Ollama)
const API_URL = 'https://ai.d-arrow.com/api/chat/completions';
const MODELS = ['qwen2.5:3b'];
const API_KEY = process.env.OPENWEBUI_API_KEY || 'sk-00a3793dd99440de80d58c6f0a2bafb1';
const TIMEOUT_MS = 60000; // 60 seconds for local model

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

    // Build conversation with memory (last 4 exchanges max for speed)
    const msgs: Array<{ role: string; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS['en'] }
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
            'Authorization': `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model,
            messages: msgs,
            stream: false,
            chat_id: 'api-call-fix',
            options: {
              temperature: 0.6,
              num_predict: 250,
              num_thread: 8,
              num_ctx: 1024
            }
          }),
        }, TIMEOUT_MS);

        const elapsed = Date.now() - startTime;

        if (response.ok) {
          const data = await response.json();
          // Support both OpenAI and Ollama formats
          const reply = data.choices?.[0]?.message?.content || data.message?.content;
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