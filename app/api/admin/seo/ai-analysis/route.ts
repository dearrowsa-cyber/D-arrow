import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const MODEL = 'glm-4-flash';

export async function POST(req: NextRequest) {
  try {
    const { errors } = await req.json();

    if (!errors || !Array.isArray(errors) || errors.length === 0) {
      return NextResponse.json({ error: 'No errors provided for analysis.' }, { status: 400 });
    }

    const apiKey = process.env.ZAI_API_KEY;

    if (!apiKey) {
      // Mock response if API key is not set
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
      return NextResponse.json({
        analysis: `⚠️ **تنبيه:** مفتاح \`ZAI_API_KEY\` غير موجود في الإعدادات.\n\nهذا مجرد **تحليل تجريبي (Mock)** بناءً على الأخطاء المرسلة:\n\n### 1. تحسين الكلمات المفتاحية\nلاحظنا غياب الكلمة المفتاحية في العنوان والوصف لعدة صفحات. **يجب عليك:**\n- إضافة الكلمة المستهدفة في أول 150 كلمة.\n- كتابة وصف (Meta Description) جذاب بين 120 و 160 حرف.\n\n### 2. محتوى الصفحات\nهناك صفحات محتواها قصير جداً (أقل من 300 كلمة). \n- قم بإضافة تفاصيل أكثر تفيد الزائر لتجنب عقوبات "Helpful Content Update".\n\n### 3. تحسين الصور\nأغلب الصور لا تحتوي على \`Alt Text\`. \n- قم بالدخول للمقالات وإضافة نصوص بديلة (Alt Tags) لتحسين الظهور في بحث الصور.`
      });
    }

    // Prepare prompt
    const errorList = errors.map((e: any) => `- Page: ${e.page} -> Issue: ${e.error}`).join('\n');
    const prompt = `أنت خبير SEO محترف. قم بتحليل قائمة الأخطاء التالية من موقعنا، واكتب خطة عمل من 3 خطوات واضحة (باللغة العربية) لحلها. اجعل الرد منسقاً باستخدام Markdown. لا تقم بشرح الأخطاء خطأ بخطأ، بل أعطني استراتيجية عامة ومركزة لإصلاح أهم المشاكل.\n\nالأخطاء:\n${errorList}`;

    // Fetch with timeout helper
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    // Call Zhipu AI (GLM) API
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1000
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ZAI API Error:', errorText);
        return NextResponse.json({ error: 'Failed to fetch AI analysis.' }, { status: 500 });
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || 'No analysis generated.';

      return NextResponse.json({ analysis: text });
    } catch (fetchError: any) {
      clearTimeout(timeout);
      console.error('ZAI API Fetch Error:', fetchError);
      return NextResponse.json({ error: fetchError.name === 'AbortError' ? 'AI request timed out' : 'Failed to reach AI service' }, { status: 504 });
    }


  } catch (error) {
    console.error('AI Analysis API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
