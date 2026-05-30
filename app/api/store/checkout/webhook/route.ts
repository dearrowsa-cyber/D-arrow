import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // This webhook can be used by N8N, Moyasar, or PayTabs
    // to automatically update order status to 'paid' and send credentials.
    
    const body = await req.json();
    const { orderId, status, transactionId, paymentMethod } = body;

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: 'orderId and status are required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Update order
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: status === 'paid' ? 'paid' : order.paymentStatus,
        paymentMethod: paymentMethod || order.paymentMethod,
        // you can also save transactionId in a new field if added to schema later
      }
    });

    // TODO: Trigger automated delivery if the product is digital
    // 1. Fetch products linked to this order
    // 2. If product.type === 'digital' || 'template' -> send downloadUrl via Email or N8N webhook
    
    return NextResponse.json({ success: true, message: 'Order updated successfully' });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
