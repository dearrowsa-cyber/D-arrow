import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get('orderNumber');
    const email = searchParams.get('email');

    if (!orderNumber || !email) {
      return NextResponse.json({ success: false, error: 'رقم الطلب والبريد الإلكتروني مطلوبان' }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        orderNumber,
        customerEmail: {
          equals: email,
          mode: 'insensitive',
        },
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'لم يتم العثور على الطلب. تأكد من صحة البيانات.' }, { status: 404 });
    }

    // Hide notes if the order is not yet completed/delivered
    if (order.status !== 'completed') {
      order.notes = null;
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Track order error:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ داخلي' }, { status: 500 });
  }
}
