import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/demo/real-estate/inquiry
 * Stores a property inquiry (viewing request). In demo mode the DB may be
 * offline — we still return success so the UX flows naturally.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      email?: string;
      message?: string;
      propertyId?: string;
    };

    if (!body.name || !body.phone) {
      return NextResponse.json({ success: false, error: 'الاسم ورقم الجوال مطلوبان' }, { status: 400 });
    }

    const inquiry = await prisma.realEstateInquiry.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email ?? null,
        message: body.message ?? null,
        propertyId: body.propertyId ?? null,
      },
    });

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (error) {
    // Demo mode — DB likely unreachable. Log and acknowledge anyway.
    console.error('Real-estate inquiry failed:', error);
    return NextResponse.json({ success: true, demo: true });
  }
}
