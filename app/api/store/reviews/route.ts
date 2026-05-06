import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Get reviews (admin: all, public: approved only)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const all = searchParams.get('all'); // admin flag

    const where: any = {};
    if (productId) where.productId = productId;
    if (!all) where.approved = true;

    const reviews = await prisma.productReview.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { product: { select: { name: true, nameAr: true } } },
    });

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// Submit a review (public)
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.productId || !data.customerName || !data.rating) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const review = await prisma.productReview.create({
      data: {
        productId: data.productId,
        customerName: data.customerName,
        customerEmail: data.customerEmail || null,
        rating: Math.min(5, Math.max(1, parseInt(data.rating))),
        comment: data.comment || null,
        approved: false, // Requires admin approval
      },
    });

    return NextResponse.json({ success: true, message: 'شكراً لتقييمك! سيظهر بعد المراجعة', review });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to submit review' }, { status: 500 });
  }
}

// Update review (admin: approve/reject)
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) return NextResponse.json({ success: false, error: 'Missing review ID' }, { status: 400 });

    const review = await prisma.productReview.update({
      where: { id: data.id },
      data: { approved: data.approved },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update review' }, { status: 500 });
  }
}

// Delete review
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 });

    await prisma.productReview.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'تم حذف التقييم' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete review' }, { status: 500 });
  }
}
