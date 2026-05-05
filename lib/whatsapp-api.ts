// WhatsApp Cloud API - Server-side notification sender
// Sends automatic WhatsApp messages to the company number when forms are submitted

const WHATSAPP_API_URL = 'https://graph.facebook.com/v21.0';

interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  recipientNumber: string;
}

function getConfig(): WhatsAppConfig {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const recipientNumber = process.env.WHATSAPP_RECIPIENT_NUMBER || '966500466349';

  if (!phoneNumberId || !accessToken) {
    throw new Error('WhatsApp API not configured. Set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN env vars.');
  }

  return { phoneNumberId, accessToken, recipientNumber };
}

export async function sendWhatsAppNotification(message: string): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getConfig();

    const response = await fetch(
      `${WHATSAPP_API_URL}/${config.phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: config.recipientNumber,
          type: 'text',
          text: {
            preview_url: false,
            body: message,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('WhatsApp API Error:', data);
      return { success: false, error: data.error?.message || 'Failed to send WhatsApp message' };
    }

    return { success: true };
  } catch (error) {
    console.error('WhatsApp notification error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Message builders for server-side use

export function buildPricingNotification(data: {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  packageName?: string;
  packagePrice?: string;
  timeline?: string;
  additionalInfo?: string;
}) {
  return `📋 *طلب استفسار عن باقة جديد*

👤 *الاسم:* ${data.name}
📱 *الجوال:* ${data.phone}
📧 *الإيميل:* ${data.email || 'غير محدد'}
🏢 *الشركة:* ${data.company || 'غير محدد'}

📦 *الباقة:* ${data.packageName || 'غير محدد'}
💰 *السعر:* ${data.packagePrice || 'غير محدد'}
⏰ *الجدول الزمني:* ${data.timeline || 'غير محدد'}

📝 *ملاحظات:* ${data.additionalInfo || 'لا توجد'}

🌐 _تم الإرسال من موقع D-Arrow_`;
}

export function buildCustomServicesNotification(data: {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  services: string[];
  totalAmount?: number;
  timeline?: string;
  additionalInfo?: string;
}) {
  const servicesList = data.services.map(s => `  ✅ ${s}`).join('\n');
  return `🎯 *طلب باقة مخصصة جديد*

👤 *الاسم:* ${data.name}
📱 *الجوال:* ${data.phone}
📧 *الإيميل:* ${data.email || 'غير محدد'}
🏢 *الشركة:* ${data.company || 'غير محدد'}

📋 *الخدمات المختارة:*
${servicesList}

💰 *الإجمالي:* ${data.totalAmount ? data.totalAmount.toLocaleString() + ' ر.س' : 'غير محدد'}
⏰ *الجدول الزمني:* ${data.timeline || 'غير محدد'}

📝 *ملاحظات:* ${data.additionalInfo || 'لا توجد'}

🌐 _تم الإرسال من موقع D-Arrow_`;
}

export function buildContactNotification(data: {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  service?: string;
  message?: string;
}) {
  return `💬 *رسالة تواصل جديدة*

👤 *الاسم:* ${data.name}
📱 *الجوال:* ${data.phone}
📧 *الإيميل:* ${data.email || 'غير محدد'}
🏢 *الشركة:* ${data.company || 'غير محدد'}
🔧 *الخدمة:* ${data.service || 'غير محدد'}

📝 *الرسالة:*
${data.message || 'لا توجد رسالة'}

🌐 _تم الإرسال من موقع D-Arrow_`;
}

export function buildConsultationNotification(data: {
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
}) {
  return `📅 *حجز استشارة مجانية جديد*

👤 *الاسم:* ${data.name}
📱 *الجوال:* ${data.phone}
🔧 *الخدمة:* ${data.service}
📆 *التاريخ:* ${data.date}
🕐 *الوقت:* ${data.time}

🌐 _تم الإرسال من موقع D-Arrow_`;
}
