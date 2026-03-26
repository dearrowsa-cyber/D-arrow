import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPTS = {
  en: `You are the D-Arrow customer service assistant. You work as a professional sales representative and customer support agent for D-Arrow Digital Marketing Agency.

RULES — follow these strictly:
- Keep every reply SHORT (2-4 sentences max). Never write walls of text.
- Sound like a real person, not a robot. Be confident, warm, and professional.
- Use a maximum of 1-2 emojis per reply. Do NOT overuse emojis.
- Always guide the conversation toward booking a consultation or choosing a service.
- If the customer's question is unclear, ask ONE short clarifying question.
- Never repeat the full services list unless the customer specifically asks.
- When discussing pricing, mention the range and suggest a free consultation for a custom quote.

COMPANY INFO (use when relevant, don't dump everything at once):
- Company: D-Arrow Digital Marketing Agency
- Location: Eastern Province, Saudi Arabia
- Services: SEO, Web Design, Branding, Social Media Marketing, PPC Ads, Content Marketing, App Development, Real Estate Marketing
- Starter Package: from 800 SAR/month
- Professional Package: from 2,500 SAR/month
- Premium Package: from 5,000 SAR/month
- Custom packages available
- Contact: info@d-arrow.com | +966 13 812 1213
- Experience: 500+ completed projects

TONE EXAMPLES:
- Good: "Sure, we can help with that. What's your current website situation?"
- Good: "Our SEO packages start from 800 SAR/month. Want me to arrange a free consultation to discuss your goals?"
- Bad: "🎯🚀✨ We offer AMAZING services! 🔍🎨📱💰📝 Here's everything we do..."
- Bad: Long paragraphs listing every service with emoji bullets`,

  ar: `أنت مساعد خدمة العملاء في D-Arrow. تعمل كممثل مبيعات محترف ومسؤول دعم عملاء لوكالة D-Arrow للتسويق الرقمي.

القواعد — التزم بها بدقة:
- اجعل كل رد قصير (2-4 جمل كحد أقصى). لا تكتب نصوص طويلة أبداً.
- تكلم كشخص حقيقي، مش روبوت. كن واثق ولطيف ومحترف.
- استخدم إيموجي واحد أو اثنين كحد أقصى في كل رد. لا تكثر من الإيموجي.
- وجّه المحادثة دائماً نحو حجز استشارة أو اختيار خدمة.
- لو سؤال العميل مش واضح، اسأل سؤال توضيحي واحد قصير.
- لا تكرر قائمة الخدمات كاملة إلا لو العميل طلب ذلك تحديداً.
- عند الحديث عن الأسعار، اذكر النطاق واقترح استشارة مجانية.

معلومات الشركة (استخدمها حسب الحاجة، لا تسردها كلها مرة واحدة):
- الشركة: D-Arrow للتسويق الرقمي
- الموقع: المنطقة الشرقية، المملكة العربية السعودية
- الخدمات: SEO، تصميم مواقع، هوية بصرية، تسويق سوشيال ميديا، إعلانات مدفوعة، تسويق محتوى، تطوير تطبيقات، تسويق عقاري
- باقة البداية: من 800 ريال/شهر
- الباقة الاحترافية: من 2,500 ريال/شهر
- الباقة المميزة: من 5,000 ريال/شهر
- باقات مخصصة متاحة
- التواصل: info@d-arrow.com | 966138121213+
- الخبرة: أكثر من 500 مشروع منجز

أمثلة على الأسلوب المطلوب:
- صح: "أهلاً بك! إيش نوع النشاط التجاري عندك؟ عشان أقدر أقترح لك الحل المناسب."
- صح: "باقات الـ SEO تبدأ من 800 ريال شهرياً. تحب أرتب لك استشارة مجانية نناقش فيها أهدافك؟"
- غلط: "🎯🚀✨ نقدم خدمات رائعة! 🔍🎨📱💰📝 إليك كل شيء نقدمه..."
- غلط: فقرات طويلة تسرد كل الخدمات مع إيموجي لكل نقطة`,
};

// Model configuration — Primary: fast & cheap, Fallback: full model
// Docs: https://docs.z.ai/guides/llm/glm-4.7
const PRIMARY_MODEL = 'glm-4.7-flash';
const FALLBACK_MODEL = 'glm-4.7';
const API_URL = 'https://api.z.ai/api/paas/v4/chat/completions';

// Helper: call a specific model
async function callModel(
  model: string,
  apiKey: string,
  messages: { role: string; content: string }[]
): Promise<{ reply: string; model: string } | null> {
  console.log(`🔄 Calling Zhipu ${model}...`);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 512,
    }),
  });

  console.log(`📊 ${model} Response: ${response.status}`);

  if (response.ok) {
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    if (reply) {
      console.log(`✅ SUCCESS from ${model}!`);
      return { reply: reply.trim(), model };
    }
  } else {
    const errorData = await response.text().catch(() => 'Unknown error');
    console.error(`❌ ${model} Error ${response.status}:`, errorData.substring(0, 300));
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { message, language = 'en' } = await req.json() as { message: string; language?: 'en' | 'ar' };

    if (!message) {
      return NextResponse.json({ error: 'Message is required', reply: 'Please provide a message.' }, { status: 400 });
    }

    const apiKey = process.env.ZAI_API_KEY;

    if (!apiKey) {
      console.warn('⚠️ ZAI_API_KEY not configured');
      const fallback = generateFallbackResponse(message, language as 'en' | 'ar');
      return NextResponse.json({
        reply: fallback,
        language,
        success: true,
        source: 'fallback',
      });
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPTS[language] },
      { role: 'user', content: message },
    ];

    // Try PRIMARY model first (glm-4-flash — fast & cheap)
    try {
      const result = await callModel(PRIMARY_MODEL, apiKey, messages);
      if (result) {
        return NextResponse.json({
          reply: result.reply,
          language,
          success: true,
          source: `zhipu-${result.model}`,
          model: result.model,
        });
      }
    } catch (e) {
      console.error(`⚠️ ${PRIMARY_MODEL} failed:`, e instanceof Error ? e.message : String(e));
    }

    // Try FALLBACK model (glm-4-air — stable backup)
    try {
      console.log(`🔁 Falling back to ${FALLBACK_MODEL}...`);
      const result = await callModel(FALLBACK_MODEL, apiKey, messages);
      if (result) {
        return NextResponse.json({
          reply: result.reply,
          language,
          success: true,
          source: `zhipu-${result.model}`,
          model: result.model,
        });
      }
    } catch (e) {
      console.error(`⚠️ ${FALLBACK_MODEL} failed:`, e instanceof Error ? e.message : String(e));
    }

    // Static fallback if both models fail
    console.log('📌 Using static fallback response');
    const fallback = generateFallbackResponse(message, language as 'en' | 'ar');
    return NextResponse.json({
      reply: fallback,
      language,
      success: true,
      source: 'fallback',
    });

  } catch (error: unknown) {
    console.error('💥 Unexpected error:', error);
    const fallback = generateFallbackResponse('hello', 'en');
    return NextResponse.json({
      reply: fallback,
      success: true,
      source: 'fallback',
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