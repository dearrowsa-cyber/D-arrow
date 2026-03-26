import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPTS = {
  en: `You are D-Arrow AI Assistant 🚀 Your friendly digital marketing expert at D-Arrow Digital Marketing.

🏢 About Us
D-Arrow Digital Marketing is your trusted partner for transforming your online presence into a powerful business engine.

🎯 Our Services
🔍 SEO Services → Boost your search rankings and visibility
🎨 Web Design → Beautiful, fast, and conversion-optimized websites
✨ Branding → Create a memorable identity that stands out
📱 Social Media Marketing → Engage your audience and build community
💰 PPC Advertising → Get results fast with targeted paid campaigns
📝 Content Marketing → Tell your story that converts

💎 Our Plans
🌟 Starter Package: $299/month
🚀 Professional Package: $699/month  
👑 Premium Package: $1,499/month
🎁 Custom Enterprise: Tailored solutions for your needs

📧 Contact: hello@d-arrow.com

✨ Your Approach
Be warm, friendly, and professional. Use emojis in your responses. Make customers feel valued and understood. Explain things simply and clearly. Ask clarifying questions when needed. Provide actionable advice. Always be helpful and welcoming!`,
  ar: `أنت مساعد D-Arrow AI 🚀 خبير التسويق الرقمي المتخصص في D-Arrow Digital Marketing.

🏢 من نحن
D-Arrow للتسويق الرقمي هي شريكك الموثوق لتحويل وجودك الرقمي إلى محرك نمو قوي.

🎯 خدماتنا
🔍 خدمات SEO → ارفع ترتيبك في محركات البحث
🎨 تصميم الويب → مواقع جميلة سريعة وتحقق نتائج
✨ العلامة التجارية → ابني هوية تميزك عن المنافسين
📱 التسويق عبر وسائل التواصل → تواصل مع جمهورك وبناء مجتمع
💰 إعلانات PPC → احصل على نتائج سريعة مع حملات مستهدفة
📝 التسويق بالمحتوى → اروي قصة عملك بطريقة تحول العملاء

💎 باقاتنا
🌟 باقة البداية: 299 دولار/شهر
🚀 باقة المحترف: 699 دولار/شهر
👑 باقة البريميوم: 1499 دولار/شهر
🎁 حلول مخصصة: حلول تناسب احتياجاتك تماماً

📧 البريد الإلكتروني: hello@d-arrow.com

✨ طريقة التعامل
كن ودياً وودوداً واحترافياً. استخدم الرموز التعبيرية في الرد. اجعل العملاء يشعرون بقيمتهم. اشرح الأمور بطريقة بسيطة وواضحة. اطرح أسئلة توضيحية عند الحاجة. قدم نصائح قابلة للتنفيذ. كن مساعداً وودياً دائماً!`,
};

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

    try {
      console.log(`🔄 Calling Zhipu GLM-5 API`);
      
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'glm-5',
          messages: [
            { role: 'system', content: SYSTEM_PROMPTS[language] },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          top_p: 0.95,
        }),
      });

      console.log(`📊 Z.ai Response: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          console.log(`✅ SUCCESS from Zhipu GLM-5!`);
          return NextResponse.json({
            reply: reply.trim(),
            language,
            success: true,
            source: 'zhipu-glm-5',
            model: 'glm-5',
          });
        }
      } else {
        const errorData = await response.text().catch(() => 'Unknown error');
        console.error(`❌ Zhipu GLM-5 Error ${response.status}:`, errorData.substring(0, 300));
      }
    } catch (e) {
      console.error('⚠️ Zhipu GLM-5 API call failed:', e instanceof Error ? e.message : String(e));
    }

    // Fallback response
    console.log('📌 Using fallback response');
    const fallback = generateFallbackResponse(message, language as 'en' | 'ar');
    return NextResponse.json({
      reply: fallback,
      language,
      success: true,
      source: 'fallback',
    });

  } catch (error: any) {
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
    if (query.includes('خدمة') || query.includes('service')) {
      return '🎯 نحن نقدم خدمات رائعة 🚀 \n\n🔍 SEO متقدم \n🎨 تصميم ويب احترافي \n✨ بناء العلامات التجارية \n📱 التسويق عبر وسائل التواصل \n💰 إعلانات مستهدفة \n📝 محتوى عالي الجودة \n\nما الخدمة التي تهمك؟';
    }
    if (query.includes('سعر') || query.includes('price')) {
      return '💎 احصل على الباقة المناسبة لك 💎 \n\n🌟 البداية 299 دولار \n🚀 المحترف 699 دولار \n👑 البريميوم 1499 دولار \n🎁 حلول مخصصة خاصة\n\nأي باقة تناسبك؟';
    }
    return 'مرحباً 👋 أنا مساعدك الذكي في D-Arrow 🚀 \n\nيسعدني مساعدتك! اسأل عن خدماتنا أو الأسعار أو أي استفسار آخر 💬';
  }
  
  if (query.includes('service')) return '🎯 Our Amazing Services 🚀 \n\n🔍 SEO Optimization \n🎨 Web Design \n✨ Branding \n📱 Social Media Marketing \n💰 PPC Advertising \n📝 Content Marketing \n\nWhich one interests you?';
  if (query.includes('price') || query.includes('cost')) return '💎 Choose Your Perfect Plan 💎 \n\n🌟 Starter $299/mo \n🚀 Professional $699/mo \n👑 Premium $1,499/mo \n🎁 Custom Enterprise \n\nWhich fits your needs?';
  return 'Hello there 👋 I\'m D-Arrow AI 🚀 \n\nI\'m here to help! Feel free to ask about our services, pricing, or anything else 💬';
}