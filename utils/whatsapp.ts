// Shared WhatsApp utility for all forms across the site
const WHATSAPP_NUMBER = "966500466349";

export function openWhatsApp(message: string) {
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  window.open(url, '_blank');
}

// Send automatic WhatsApp notification to company via server-side API (no client action needed)
export function sendAutoNotification(type: string, data: Record<string, unknown>) {
  fetch('/api/whatsapp-notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, data }),
  }).catch(console.error); // fire-and-forget
}

export function buildPricingInquiryMessage(data: {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  packageName?: string;
  packagePrice?: string;
  timeline?: string;
  additionalInfo?: string;
  lang?: string;
}) {
  const isAr = data.lang === 'ar';
  return isAr
    ? `*طلب استفسار عن باقة من الموقع* 📋

*الاسم:* ${data.name}
*رقم الجوال:* ${data.phone}
*البريد الإلكتروني:* ${data.email || 'غير محدد'}
*الشركة:* ${data.company || 'غير محدد'}
*الباقة المختارة:* ${data.packageName || 'غير محدد'}
*السعر:* ${data.packagePrice || 'غير محدد'}
*الجدول الزمني:* ${data.timeline || 'غير محدد'}
*ملاحظات إضافية:* ${data.additionalInfo || 'لا توجد'}`
    : `*Pricing Inquiry from Website* 📋

*Name:* ${data.name}
*Phone:* ${data.phone}
*Email:* ${data.email || 'N/A'}
*Company:* ${data.company || 'N/A'}
*Package:* ${data.packageName || 'N/A'}
*Price:* ${data.packagePrice || 'N/A'}
*Timeline:* ${data.timeline || 'N/A'}
*Additional Info:* ${data.additionalInfo || 'None'}`;
}

export function buildCustomServicesMessage(data: {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  services: string[];
  totalAmount?: number;
  timeline?: string;
  additionalInfo?: string;
  lang?: string;
}) {
  const isAr = data.lang === 'ar';
  const servicesList = data.services.map(s => `  • ${s}`).join('\n');
  return isAr
    ? `*طلب باقة مخصصة من الموقع* 🎯

*الاسم:* ${data.name}
*رقم الجوال:* ${data.phone}
*البريد الإلكتروني:* ${data.email || 'غير محدد'}
*الشركة:* ${data.company || 'غير محدد'}

*الخدمات المختارة:*
${servicesList}

*الإجمالي التقريبي:* ${data.totalAmount ? data.totalAmount.toLocaleString() + ' ر.س' : 'غير محدد'}
*الجدول الزمني:* ${data.timeline || 'غير محدد'}
*ملاحظات إضافية:* ${data.additionalInfo || 'لا توجد'}`
    : `*Custom Package Request from Website* 🎯

*Name:* ${data.name}
*Phone:* ${data.phone}
*Email:* ${data.email || 'N/A'}
*Company:* ${data.company || 'N/A'}

*Selected Services:*
${servicesList}

*Estimated Total:* ${data.totalAmount ? data.totalAmount.toLocaleString() + ' SAR' : 'N/A'}
*Timeline:* ${data.timeline || 'N/A'}
*Additional Info:* ${data.additionalInfo || 'None'}`;
}

export function buildContactMessage(data: {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  service?: string;
  message?: string;
  lang?: string;
}) {
  const isAr = data.lang === 'ar';
  return isAr
    ? `*طلب تواصل جديد من الموقع* 💬

*الاسم:* ${data.name}
*رقم الجوال:* ${data.phone}
*البريد الإلكتروني:* ${data.email || 'غير محدد'}
*الشركة:* ${data.company || 'غير محدد'}
*الخدمة:* ${data.service || 'غير محدد'}

*الرسالة:*
${data.message || 'لا توجد رسالة'}`
    : `*New Contact Request from Website* 💬

*Name:* ${data.name}
*Phone:* ${data.phone}
*Email:* ${data.email || 'N/A'}
*Company:* ${data.company || 'N/A'}
*Service:* ${data.service || 'N/A'}

*Message:*
${data.message || 'No message'}`;
}

export function buildConsultationMessage(data: {
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  lang?: string;
}) {
  const isAr = data.lang === 'ar';
  return isAr
    ? `*حجز استشارة مجانية* 📅

*الاسم:* ${data.name}
*رقم الجوال:* ${data.phone}
*الخدمة المطلوبة:* ${data.service}
*التاريخ المفضل:* ${data.date}
*الوقت المفضل:* ${data.time}`
    : `*Free Consultation Booking* 📅

*Name:* ${data.name}
*Phone:* ${data.phone}
*Service:* ${data.service}
*Preferred Date:* ${data.date}
*Preferred Time:* ${data.time}`;
}
