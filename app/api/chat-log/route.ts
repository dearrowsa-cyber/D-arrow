import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, language, sessionId } = await req.json() as {
      messages: Array<{ user: string; bot: string }>;
      language: string;
      sessionId: string;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ ok: false, error: 'No messages' }, { status: 400 });
    }

    // Skip if only the auto-greeting exists (no real conversation)
    const realMessages = messages.filter(m => m.user && m.user.trim());
    if (realMessages.length === 0) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const recipient = process.env.CONTACT_RECIPIENT || 'y.iqbal@beedco.com';
    const timestamp = new Date().toLocaleString('en-SA', { timeZone: 'Asia/Riyadh' });

    // Build conversation HTML
    const conversationHtml = messages
      .filter(m => m.user || m.bot)
      .map(m => {
        let html = '';
        if (m.user) {
          html += `<div style="margin:8px 0;padding:10px 14px;background:#FF6F4F;color:#fff;border-radius:12px;max-width:80%;margin-left:auto;font-size:14px;">${escapeHtml(m.user)}</div>`;
        }
        if (m.bot) {
          html += `<div style="margin:8px 0;padding:10px 14px;background:#f0f0f0;color:#333;border-radius:12px;max-width:80%;font-size:14px;">${escapeHtml(m.bot)}</div>`;
        }
        return html;
      })
      .join('');

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f5;padding:20px;">
  <div style="max-width:500px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#FF4D6D,#FF6F4F);padding:20px;color:#fff;">
      <h2 style="margin:0;font-size:18px;">💬 D-Arrow Chat Log</h2>
      <p style="margin:4px 0 0;font-size:12px;opacity:0.9;">${timestamp} | ${language === 'ar' ? 'العربية' : 'English'} | ID: ${sessionId.slice(0, 8)}</p>
    </div>
    <div style="padding:16px;">
      <p style="font-size:12px;color:#999;margin:0 0 12px;">Messages: ${realMessages.length}</p>
      ${conversationHtml}
    </div>
    <div style="padding:12px 16px;background:#f9f9f9;border-top:1px solid #eee;font-size:11px;color:#999;">
      D-Arrow Chatbot — Auto-logged conversation
    </div>
  </div>
</body>
</html>`;

    // Send via SMTP
    const hasSmtp = !!process.env.SMTP_HOST || !!process.env.SMTP_USER;
    if (!hasSmtp) {
      console.log('📝 Chat log (no SMTP):', JSON.stringify(messages.map(m => ({ u: m.user, b: m.bot?.slice(0, 50) }))));
      return NextResponse.json({ ok: true, logged: 'console' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: (process.env.SMTP_SECURE === 'true') || Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
      tls: { rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== 'false' },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || (process.env.SMTP_USER ?? 'chatbot@d-arrow.com'),
      to: recipient,
      subject: `💬 Chat Log — ${realMessages.length} messages (${language})`,
      html,
    });

    console.log(`📧 Chat log sent: ${realMessages.length} messages`);
    return NextResponse.json({ ok: true, logged: 'email' });

  } catch (err) {
    console.error('Chat log error:', err);
    // Don't fail silently — still return ok so chat experience isn't affected
    return NextResponse.json({ ok: true, logged: 'error' });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}
