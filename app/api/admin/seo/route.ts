import { NextRequest, NextResponse } from 'next/server';

const MODELS = ['glm-4-flash', 'glm-4v-flash'];
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const TIMEOUT_MS = 15000;

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
    const { content, type = 'post', language = 'ar' } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required for SEO generation' }, { status: 400 });
    }

    const apiKey = process.env.ZAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ZAI_API_KEY is missing' }, { status: 500 });
    }

    const systemPrompt = language === 'ar' 
      ? `أنت خبير سيو (SEO) متميز. سأعطيك نصاً (عبارة عن ${type === 'post' ? 'مقال' : 'محتوى صفحة'}) وأريدك أن تستخرج التالي بصيغة JSON فقط:
         1. "title": عنوان جذاب ومحسن للسيو (لا يتجاوز 60 حرفاً).
         2. "description": وصف ميتا (Meta Description) قوي يحفز على النقر (لا يتجاوز 160 حرفاً).
         3. "keywords": قائمة من 5 إلى 10 كلمات مفتاحية مفصولة بفواصل.
         ممنوع كتابة أي نص خارج الـ JSON.`
      : `You are an expert SEO specialist. I will give you text (a ${type === 'post' ? 'blog post' : 'page content'}) and you must extract the following in pure JSON format:
         1. "title": An engaging, SEO-optimized title (max 60 characters).
         2. "description": A compelling meta description (max 160 characters).
         3. "keywords": A comma-separated string of 5-10 keywords.
         Do not output anything outside the JSON object.`;

    const msgs = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: content.substring(0, 3000) } // limit to 3000 chars to avoid token limits
    ];

    for (const model of MODELS) {
      try {
        const response = await fetchWithTimeout(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: msgs,
            temperature: 0.4,
            max_tokens: 300,
          }),
        }, TIMEOUT_MS);

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content?.trim();
          
          if (reply) {
            // Attempt to parse JSON. Sometimes the model wraps it in ```json ... ```
            const jsonStr = reply.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(jsonStr);
            return NextResponse.json({ success: true, seo: parsed });
          }
        }
      } catch (e) {
        console.error(`Error with ${model}:`, e);
      }
    }

    return NextResponse.json({ error: 'Failed to generate SEO from AI models' }, { status: 500 });

  } catch (error) {
    console.error('SEO generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
