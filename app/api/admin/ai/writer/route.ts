import { NextRequest, NextResponse } from 'next/server';

const MODELS = ['glm-4-flash', 'glm-4v-flash'];
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const TIMEOUT_MS = 90000; // 90 seconds for longer generations

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
    const { prompt, action, language = 'ar', context = '' } = await req.json();

    const apiKey = process.env.ZAI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey.trim() === '') {
      return NextResponse.json({ error: 'ZAI_API_KEY is missing or not configured' }, { status: 500 });
    }

    let systemPrompt = '';
    
    if (language === 'ar') {
      systemPrompt = 'أنت مساعد ذكاء اصطناعي خبير في كتابة محتوى التسويق الرقمي والسيو (SEO). اكتب محتوى احترافي، مقسم لفقرات وعناوين، وبأسلوب جذاب.';
      if (action === 'generate_draft') {
        systemPrompt += ' المطلوب منك كتابة مسودة مقال كاملة بناءً على العنوان أو الفكرة المعطاة. استخدم وسوم HTML (مثل <h2>, <p>, <ul>, <strong>) لتنسيق المقال.';
      } else if (action === 'improve') {
        systemPrompt += ' قم بتحسين وإعادة صياغة النص التالي ليكون أكثر احترافية وجاذبية، دون تغيير المعنى الأصلي. أعد النص بتنسيق HTML إذا لزم الأمر.';
      } else if (action === 'expand') {
        systemPrompt += ' قم بتوسيع وشرح النص التالي بتفصيل أكبر وإضافة أمثلة مفيدة، أعد النص بتنسيق HTML.';
      }
    } else {
      systemPrompt = 'You are an expert AI assistant specializing in digital marketing and SEO content writing. Write professional, well-structured, and engaging content.';
      if (action === 'generate_draft') {
        systemPrompt += ' Write a full blog post draft based on the given title/topic. Use HTML tags (e.g. <h2>, <p>, <ul>, <strong>) to format the post.';
      } else if (action === 'improve') {
        systemPrompt += ' Improve and rewrite the following text to be more professional and engaging, without changing its core meaning. Return HTML format if needed.';
      } else if (action === 'expand') {
        systemPrompt += ' Expand on the following text by adding more details and helpful examples. Return HTML format if needed.';
      }
    }

    const msgs = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Context/Current Text:\n${context}\n\nTask/Prompt:\n${prompt}`.trim() }
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
            temperature: 0.7,
            max_tokens: 2000,
          }),
        }, TIMEOUT_MS);

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content?.trim();
          
          if (reply) {
            // Remove markdown codeblock wrapping if AI adds it
            const cleanHtml = reply.replace(/```html/g, '').replace(/```/g, '').trim();
            return NextResponse.json({ success: true, content: cleanHtml });
          }
        } else {
          const errData = await response.text();
          console.error(`ZhipuAI Error with ${model}: HTTP ${response.status} - ${errData}`);
        }
      } catch (e) {
        console.error(`Error with ${model}:`, e);
      }
    }

    return NextResponse.json({ error: 'Failed to generate content from AI models' }, { status: 500 });

  } catch (error) {
    console.error('AI Writer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
