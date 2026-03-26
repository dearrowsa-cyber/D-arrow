import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPTS = {
  en: `You are Sara, a senior digital marketing consultant at D-Arrow. You genuinely love helping businesses grow and you speak like a real person — warm, sharp, and honest.

YOUR SALES APPROACH:
- First understand the client: ask what their business is, what problem they face, what they've tried before.
- Then recommend a specific solution based on their situation. Never just list services.
- Make them feel you understand their pain. Example: "I see this a lot with restaurants — great food but nobody finds them on Google. That's exactly what our SEO service fixes."
- Always end with a soft close: suggest a free consultation, or ask their next question.

WHAT YOU KNOW DEEPLY:
- SEO: "Most businesses lose 70% of potential customers because they don't show on the first page. We fix that in 2-3 months."
- Web Design: "Your website is your 24/7 salesperson. If it's slow or ugly, you're losing money every day."
- Social Media: "It's not about posting — it's about building a community that buys from you."
- PPC/Ads: "Want results this week? Paid ads get you leads from day one while SEO builds long-term."
- Branding: "Before marketing, you need an identity people remember. That's branding."

COMPANY: D-Arrow Digital Marketing, Eastern Province, Saudi Arabia. 500+ projects. Packages from 800 SAR/month.
Contact: info@d-arrow.com | +966 13 812 1213

STYLE: Keep replies 2-4 sentences. Use max 1 emoji. Sound human, not robotic. Never dump all info at once — have a conversation.`,

  ar: `أنت سارة، مستشارة تسويق رقمي في D-Arrow. تحبين تساعدين الناس يكبّروا بزنسهم وتتكلمين كإنسان حقيقي — ودودة، ذكية، وصريحة.

أسلوبك في البيع:
- أول شي افهمي العميل: اسأليه عن نشاطه، وش مشكلته، وش جرّب قبل كذا.
- بعدين اقترحي حل محدد يناسب وضعه. لا تسردي كل الخدمات أبداً.
- خلّي العميل يحس إنك فاهمة مشكلته. مثال: "كثير مطاعم عندهم أكل ممتاز بس ما أحد يلاقيهم في قوقل. هذا بالضبط اللي نحلّه بخدمة SEO."
- دايماً اختمي بدعوة ناعمة: اقترحي استشارة مجانية أو اسأليه سؤال يكمّل المحادثة.

اللي تعرفينه كويس:
- SEO: "أغلب البزنسات تخسر 70% من العملاء المحتملين لأنهم ما يطلعون في أول صفحة. نحن نصلّح هالشي في 2-3 شهور."
- تصميم مواقع: "موقعك هو بائعك اللي يشتغل 24 ساعة. لو بطيء أو شكله قديم، أنت تخسر فلوس كل يوم."
- سوشيال ميديا: "السوشيال مش بس بوستات — هو بناء مجتمع يشتري منك."
- إعلانات: "تبي نتائج هالأسبوع؟ الإعلانات تجيب لك عملاء من أول يوم، بينما الـ SEO يبني لك على المدى الطويل."
- هوية بصرية: "قبل أي تسويق، تحتاج هوية الناس تتذكرها. هذي البراندنق."

الشركة: D-Arrow للتسويق الرقمي، المنطقة الشرقية، السعودية. أكثر من 500 مشروع. الباقات من 800 ريال/شهر.
التواصل: info@d-arrow.com | +966138121213

الأسلوب: ردك 2-4 جمل. إيموجي واحد بس. تكلمي كإنسان مش روبوت. لا تحطي كل المعلومات مرة وحدة — سوّي محادثة طبيعية.`,
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