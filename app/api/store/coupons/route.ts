import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Get all coupons
export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

// Create coupon
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.code || !data.value) {
      return NextResponse.json({ success: false, error: 'Code and value are required' }, { status: 400 });
    }

    const existing = await prisma.coupon.findUnique({ where: { code: data.code.toUpperCase() } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'هذا الكود مستخدم بالفعل' }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        type: data.type || 'percentage',
        value: parseFloat(data.value),
        minOrder: data.minOrder ? parseFloat(data.minOrder) : null,
        maxUses: data.maxUses ? parseInt(data.maxUses) : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        active: data.active !== false,
      },
    });

    return NextResponse.json({ success: true, message: 'تم إنشاء الكوبون', coupon });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create coupon' }, { status: 500 });
  }
}

// Update coupon
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) return NextResponse.json({ success: false, error: 'Missing coupon ID' }, { status: 400 });

    const { id, createdAt, updatedAt, ...updateData } = data;
    if (updateData.value) updateData.value = parseFloat(updateData.value);
    if (updateData.minOrder) updateData.minOrder = parseFloat(updateData.minOrder);
    if (updateData.maxUses) updateData.maxUses = parseInt(updateData.maxUses);
    if (updateData.expiresAt) updateData.expiresAt = new Date(updateData.expiresAt);
    if (updateData.code) updateData.code = updateData.code.toUpperCase();

    const coupon = await prisma.coupon.update({ where: { id }, data: updateData });
    return NextResponse.json({ success: true, message: 'تم تحديث الكوبون', coupon });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update coupon' }, { status: 500 });
  }
}

// Delete coupon
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 });

    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'تم حذف الكوبون' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete coupon' }, { status: 500 });
  }
}
