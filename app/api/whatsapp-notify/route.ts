import { NextRequest, NextResponse } from 'next/server';
import {
  sendWhatsAppNotification,
  buildPricingNotification,
  buildCustomServicesNotification,
  buildContactNotification,
  buildConsultationNotification,
} from '@/lib/whatsapp-api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json({ ok: false, error: 'Missing type or data' }, { status: 400 });
    }

    let message = '';

    switch (type) {
      case 'pricing':
        message = buildPricingNotification(data);
        break;
      case 'custom-services':
        message = buildCustomServicesNotification(data);
        break;
      case 'contact':
        message = buildContactNotification(data);
        break;
      case 'consultation':
        message = buildConsultationNotification(data);
        break;
      default:
        return NextResponse.json({ ok: false, error: 'Unknown notification type' }, { status: 400 });
    }

    const result = await sendWhatsAppNotification(message);

    if (result.success) {
      return NextResponse.json({ ok: true });
    } else {
      console.error('WhatsApp send failed:', result.error);
      // Return ok: true anyway so the user experience isn't affected
      return NextResponse.json({ ok: true, warning: 'WhatsApp notification failed but form was received' });
    }
  } catch (error) {
    console.error('WhatsApp notify route error:', error);
    return NextResponse.json({ ok: true, warning: 'Notification service unavailable' });
  }
}
