import { NextRequest, NextResponse } from 'next/server';

// WAHA WhatsApp Webhook — receives messages and replies using AI
// Docs: https://waha-docs.devlike.pro/

const WAHA_API_URL = process.env.WAHA_API_URL || 'http://localhost:3000'; // WAHA server URL
const WAHA_SESSION = process.env.WAHA_SESSION || 'default';

// System prompt (same as chatbot — Saudi dialect)
const SYSTEM_PROMPT = `انت مستشار تسويق رقمي في D-Arrow. عندك ذاكرة محادثة — اقرأ الرسائل السابقة ولا تكرر السلام أو الترحيب أبد. ادخل في الموضوع على طول.

قواعد مهمة:
- لا تقول "هلا" أو "أهلاً" أو "مرحبا" إذا سبق وسلّمت. اقرأ المحادثة.
- افهم وش يبي العميل قبل ما تقترح شي. اسأله عن نشاطه ووش يواجه.
- اربط مشكلته بحل واضح. مثال: "منافسينك يطلعون قبلك في قوقل؟ هذا يعني تخسر عملاء كل يوم. برنامجنا يوصّلك الصفحة الأولى خلال 90 يوم."
- ردك 2-3 جمل بس. إيموجي واحد بالكثير. تكلم كخبير حقيقي مش بوت.
- تكلم سعودي 100%. لا فصحى. استخدم: وش، ليش، كذا، يعني، ابي، تبي، عندك، وش رايك، يالله.
- لو الرسالة بالإنجليزي، رد بالإنجليزي.

خبرتك: SEO (صفحة أولى خلال 90 يوم)، تصميم مواقع (سريعة وتبيع)، سوشيال ميديا (محتوى + مجتمع)، إعلانات قوقل (نتائج من أول يوم)، براندنق (هوية تميّزك).
الشركة: D-Arrow، المنطقة الشرقية، السعودية. أكثر من 500 مشروع. الباقات من 800 ريال/شهر.
التواصل: info@d-arrow.com | +966138121213`;

const AI_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const AI_MODEL = 'glm-4-flash';

// In-memory conversation store (per phone number, last 4 messages)
const conversations = new Map<string, Array<{ role: string; content: string }>>();

// GET — WAHA webhook verification
export async function GET() {
  return NextResponse.json({ status: 'ok', webhook: 'whatsapp' });
}

// POST — receive messages from WAHA
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // WAHA sends different event types
    const event = body.event;
    
    // Only process incoming messages (not status updates, etc.)
    if (event !== 'message') {
      return NextResponse.json({ ok: true, skipped: 'not a message event' });
    }

    const payload = body.payload;
    if (!payload || !payload.body || payload.fromMe) {
      return NextResponse.json({ ok: true, skipped: 'empty or own message' });
    }

    const from = payload.from; // e.g. "966501234567@c.us"
    const messageText = payload.body;
    const isGroup = from.includes('@g.us');

    // Skip group messages (optional — remove this if you want group replies)
    if (isGroup) {
      return NextResponse.json({ ok: true, skipped: 'group message' });
    }

    console.log(`📱 WhatsApp from ${from}: ${messageText.slice(0, 50)}`);

    // Get or create conversation history for this number
    let history = conversations.get(from) || [];
    history.push({ role: 'user', content: messageText });

    // Keep only last 4 exchanges (8 messages) for speed
    if (history.length > 8) {
      history = history.slice(-8);
    }

    // Build AI messages
    const aiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
    ];

    // Call AI
    const apiKey = process.env.ZAI_API_KEY;
    let replyText = 'عذراً، حصل خطأ تقني. تقدر تتواصل معنا على info@d-arrow.com أو تزور موقعنا d-arrow.com 🙏';

    if (apiKey) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 10000);

        const aiRes = await fetch(AI_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: AI_MODEL,
            messages: aiMessages,
            temperature: 0.6,
            max_tokens: 250,
          }),
          signal: controller.signal,
        });

        clearTimeout(timer);

        if (aiRes.ok) {
          const data = await aiRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            replyText = reply.trim();
          }
        } else {
          console.error(`❌ AI error: ${aiRes.status}`);
        }
      } catch (e) {
        console.error('⏱️ AI timeout/error');
      }
    }

    // Save assistant reply to conversation history
    history.push({ role: 'assistant', content: replyText });
    conversations.set(from, history);

    // Send reply via WAHA
    try {
      const wahaRes = await fetch(`${WAHA_API_URL}/api/sendText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: from,
          text: replyText,
          session: WAHA_SESSION,
        }),
      });

      if (wahaRes.ok) {
        console.log(`✅ Reply sent to ${from}`);
      } else {
        console.error(`❌ WAHA send error: ${wahaRes.status}`);
      }
    } catch (e) {
      console.error('❌ WAHA connection error');
    }

    // Log conversation via email (async, don't wait)
    logConversation(from, messageText, replyText).catch(() => {});

    return NextResponse.json({ ok: true, replied: true });

  } catch (error) {
    console.error('💥 WhatsApp webhook error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// Log WhatsApp conversations via email
async function logConversation(from: string, userMsg: string, botReply: string) {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    await fetch(`${baseUrl}/api/chat-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ user: userMsg, bot: botReply }],
        language: 'ar',
        sessionId: `wa-${from.replace('@c.us', '')}`,
      }),
    });
  } catch (e) {
    // Silent fail
  }
}
