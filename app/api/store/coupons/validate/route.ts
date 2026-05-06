import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Validate a coupon code
export async function POST(req: NextRequest) {
  try {
    const { code, orderTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, error: 'Coupon code is required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

    if (!coupon) {
      return NextResponse.json({ success: false, error: 'كوبون غير صالح' }, { status: 404 });
    }

    if (!coupon.active) {
      return NextResponse.json({ success: false, error: 'هذا الكوبون غير مفعّل' }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ success: false, error: 'هذا الكوبون منتهي الصلاحية' }, { status: 400 });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ success: false, error: 'تم استخدام هذا الكوبون الحد الأقصى من المرات' }, { status: 400 });
    }

    if (coupon.minOrder && orderTotal && orderTotal < coupon.minOrder) {
      return NextResponse.json({
        success: false,
        error: `الحد الأدنى للطلب ${coupon.minOrder} ر.س`,
      }, { status: 400 });
    }

    // Calculate discount
    let discount = 0;
    if (orderTotal) {
      discount = coupon.type === 'percentage'
        ? orderTotal * (coupon.value / 100)
        : coupon.value;
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to validate coupon' }, { status: 500 });
  }
}
