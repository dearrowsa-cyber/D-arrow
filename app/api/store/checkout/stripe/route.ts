import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Stripe implementation without SDK (using fetch)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey || stripeSecretKey === 'YOUR_STRIPE_SECRET_KEY') {
      return NextResponse.json({ 
        error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.' 
      }, { status: 500 });
    }

    // Map order items to Stripe line items
    const lineItems = order.items.map((item: any) => ({
      price_data: {
        currency: 'sar',
        product_data: {
          name: item.productName,
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amount in cents/halalas
      },
      quantity: item.quantity,
    }));

    // Create Checkout Session via REST API
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'success_url': `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/store/checkout/success?session_id={CHECKOUT_SESSION_ID}&orderId=${order.id}`,
        'cancel_url': `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/store/checkout?orderId=${order.id}`,
        'mode': 'payment',
        'customer_email': order.customerEmail,
        'client_reference_id': order.id,
        ...Object.fromEntries(
          lineItems.flatMap((item: any, i: number) => [
            [`line_items[${i}][price_data][currency]`, item.price_data.currency],
            [`line_items[${i}][price_data][product_data][name]`, item.price_data.product_data.name],
            [`line_items[${i}][price_data][unit_amount]`, item.price_data.unit_amount.toString()],
            [`line_items[${i}][quantity]`, item.quantity.toString()],
          ])
        ),
      }),
    });

    const session = await response.json();

    if (!response.ok) {
      console.error('Stripe API Error:', session);
      return NextResponse.json({ error: session.error?.message || 'Stripe Session Creation Failed' }, { status: 500 });
    }

    // Redirect to Stripe Checkout
    return NextResponse.redirect(session.url);
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
