import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = ['published', 'draft'] as const;

const validStatus = (s: unknown): boolean =>
  typeof s === 'string' && (VALID_STATUSES as readonly string[]).includes(s);

const validFeatures = (f: unknown): f is unknown[] => {
  if (Array.isArray(f)) return true;
  if (typeof f === 'string' && f.trim()) {
    try {
      return Array.isArray(JSON.parse(f));
    } catch {
      return false;
    }
  }
  return false;
};

// Get all pricing plans
export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status');
    const where = status === 'draft' || status === 'published' ? { status } : undefined;
    const rawPlans = await prisma.pricingPlan.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });

    // Parse features JSON string to array
    const plans = rawPlans.map(plan => ({
      ...plan,
      features: plan.features ? JSON.parse(plan.features) : [],
    }));

    return NextResponse.json({
      success: true,
      source: 'database',
      plans,
      count: plans.length,
    });
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch pricing plans',
      plans: [],
      count: 0,
    }, { status: 500 });
  }
}

// Add a new pricing plan
export async function POST(req: NextRequest) {
  try {
    const newPlan = await req.json();

    const hasNameAr = typeof newPlan.nameAr === 'string' && newPlan.nameAr.trim();
    const hasNameEn = typeof newPlan.nameEn === 'string' && newPlan.nameEn.trim();

    if (!hasNameAr || !hasNameEn) {
      return NextResponse.json({
        success: false,
        error: !hasNameAr
          ? 'اسم الباقة بالعربية مطلوب'
          : 'اسم الباقة بالإنجليزية مطلوب',
      }, { status: 400 });
    }

    if (newPlan.status !== undefined && !validStatus(newPlan.status)) {
      return NextResponse.json({
        success: false,
        error: 'الحالة غير صالحة — يجب أن تكون "published" أو "draft"',
      }, { status: 400 });
    }

    if (newPlan.features !== undefined && !validFeatures(newPlan.features)) {
      return NextResponse.json({
        success: false,
        error: 'المميزات (features) يجب أن تكون مصفوفة',
      }, { status: 400 });
    }

    // Get max sortOrder to place new plan at the end
    const maxSortOrder = await prisma.pricingPlan.findFirst({
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const plan = await prisma.pricingPlan.create({
      data: {
        nameAr: newPlan.nameAr,
        nameEn: newPlan.nameEn,
        audienceAr: newPlan.audienceAr || '',
        audienceEn: newPlan.audienceEn || '',
        priceRange: newPlan.priceRange || '',
        priceUnitAr: newPlan.priceUnitAr || 'ر.س / شهرياً',
        priceUnitEn: newPlan.priceUnitEn || 'SAR / month',
        noteAr: newPlan.noteAr || null,
        noteEn: newPlan.noteEn || null,
        featured: newPlan.featured || false,
        badgeAr: newPlan.badgeAr || null,
        badgeEn: newPlan.badgeEn || null,
        features: newPlan.features ? JSON.stringify(newPlan.features) : JSON.stringify([]),
        ctaAr: newPlan.ctaAr || 'ابدأ الآن',
        ctaEn: newPlan.ctaEn || 'Get Started',
        status: newPlan.status || 'published',
        sortOrder: (maxSortOrder?.sortOrder || 0) + 1,
      }
    });

    revalidateTag('pricing-plans', { expire: 0 });

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الباقة بنجاح',
      plan: {
        ...plan,
        features: plan.features ? JSON.parse(plan.features) : [],
      },
    });
  } catch (error) {
    console.error('Error creating pricing plan:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create pricing plan: ' + message,
      details: message,
    }, { status: 500 });
  }
}

// Update a pricing plan
export async function PUT(req: NextRequest) {
  try {
    const updates = await req.json();

    if (!updates.id) {
      return NextResponse.json({ success: false, error: 'Missing plan ID' }, { status: 400 });
    }

    // Remove id from updates object as it shouldn't be updated
    const { id, createdAt, updatedAt, ...updateData } = updates;

    const hasNameUpdate = 'nameAr' in updateData || 'nameEn' in updateData;
    if (hasNameUpdate &&
      !(typeof updateData.nameAr === 'string' && updateData.nameAr.trim()) &&
      !(typeof updateData.nameEn === 'string' && updateData.nameEn.trim())) {
      return NextResponse.json({
        success: false,
        error: 'اسم الباقة مطلوب (بالعربية وبالإنجليزية)',
      }, { status: 400 });
    }

    if (updateData.status !== undefined && !validStatus(updateData.status)) {
      return NextResponse.json({
        success: false,
        error: 'الحالة غير صالحة — يجب أن تكون "published" أو "draft"',
      }, { status: 400 });
    }

    if (updateData.features !== undefined && !validFeatures(updateData.features)) {
      return NextResponse.json({
        success: false,
        error: 'المميزات (features) يجب أن تكون مصفوفة',
      }, { status: 400 });
    }

    const existing = await prisma.pricingPlan.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({
        success: false,
        error: 'الباقة غير موجودة',
      }, { status: 404 });
    }

    // Serialize features array to JSON string if present
    if (updateData.features && Array.isArray(updateData.features)) {
      updateData.features = JSON.stringify(updateData.features);
    }

    const plan = await prisma.pricingPlan.update({
      where: { id },
      data: updateData,
    });

    revalidateTag('pricing-plans', { expire: 0 });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الباقة بنجاح',
      plan: {
        ...plan,
        features: plan.features ? JSON.parse(plan.features) : [],
      },
    });
  } catch (error) {
    console.error('Error updating pricing plan:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: 'Failed to update pricing plan: ' + message }, { status: 500 });
  }
}

// Delete a pricing plan
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing plan ID' }, { status: 400 });
    }

    const existing = await prisma.pricingPlan.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'الباقة غير موجودة' }, { status: 404 });
    }

    await prisma.pricingPlan.delete({
      where: { id },
    });

    revalidateTag('pricing-plans', { expire: 0 });

    return NextResponse.json({
      success: true,
      message: 'تم حذف الباقة بنجاح',
    });
  } catch (error) {
    console.error('Error deleting pricing plan:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete pricing plan' }, { status: 500 });
  }
}
