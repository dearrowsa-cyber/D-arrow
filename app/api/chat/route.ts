import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const preferredRegion = 'hkg1';
const SYSTEM_PROMPTS = {
  en: `You are D-Arrow's customer service agent. Be professional, confident, and concise.
Rules: Reply in 2-3 sentences max. Use 1 emoji max per reply. Guide toward booking a free consultation. Don't list all services unless asked.
Company: D-Arrow Digital Marketing, Eastern Province, Saudi Arabia. Services: SEO, Web Design, Branding, Social Media, PPC, Content Marketing, App Dev. Packages from 800 SAR/month. Contact: info@d-arrow.com | +966 13 812 1213. 500+ projects completed.`,

  ar: `أنت مسؤول خدمة عملاء D-Arrow. كن محترف وواثق ومختصر.
القواعد: رد في 2-3 جمل كحد أقصى. إيموجي واحد بس في كل رد. وجّه العميل لحجز استشارة مجانية. لا تسرد كل الخدمات إلا لو طُلب.
الشركة: D-Arrow للتسويق الرقمي، المنطقة الشرقية، السعودية. الخدمات: SEO، تصميم مواقع، هوية بصرية، سوشيال ميديا، إعلانات، تسويق محتوى، تطبيقات. الباقات من 800 ريال/شهر. التواصل: info@d-arrow.com | +966138121213. أكثر من 500 مشروع.`,
};

// Model configuration — from https://docs.bigmodel.cn
const PRIMARY_MODEL = 'glm-4.7-flash';   // Free, fastest
const FALLBACK_MODEL = 'glm-4.5-flash';  // Free, stable
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

// Helper: call a specific model
async function callModel(
  model: string,
  apiKey: string,
  messages: { role: string; content: string }[]
): Promise<{ reply: string; model: string } | null> {
  console.log(`🔄 Calling ${model}...`);
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.6,
      top_p: 0.85,
      max_tokens: 150,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    if (reply) {
      console.log(`✅ ${model} success`);
      return { reply: reply.trim(), model };
    }
  } else {
    console.error(`❌ ${model} error: ${response.status}`);
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