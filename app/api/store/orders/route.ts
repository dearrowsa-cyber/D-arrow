import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Get all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    return NextResponse.json({ success: true, orders, count: orders.length });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// Create a new order (checkout)
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.customerName || !data.customerEmail || !data.items?.length) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `DA-${String(orderCount + 1001).padStart(5, '0')}`;

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of data.items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) continue;

      const price = product.salePrice || product.price;
      const itemTotal = price * (item.quantity || 1);
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.nameAr || product.name,
        price,
        quantity: item.quantity || 1,
        total: itemTotal,
      });
    }

    // Apply coupon discount
    let discount = 0;
    if (data.couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: data.couponCode } });
      if (coupon && coupon.active) {
        if (coupon.type === 'percentage') {
          discount = subtotal * (coupon.value / 100);
        } else {
          discount = coupon.value;
        }
        // Update coupon usage
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    const total = Math.max(0, subtotal - discount);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone || null,
        subtotal,
        discount,
        total,
        couponCode: data.couponCode || null,
        paymentMethod: data.paymentMethod || 'bank_transfer',
        paymentStatus: 'pending',
        status: 'pending',
        notes: data.notes || null,
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, message: 'تم إنشاء الطلب بنجاح', order });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}

// Update order status
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ success: false, error: 'Missing order ID' }, { status: 400 });
    }

    const { id, items, ...updateData } = data;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });

    return NextResponse.json({ success: true, message: 'تم تحديث الطلب', order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}
