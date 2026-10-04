import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

const parseNumber = (value: unknown, field = 'price') => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) throw new Error(`${field} must be a valid positive number`);
  return parsed;
};

const VALID_TYPES = ['digital', 'service', 'template', 'course'] as const;
const VALID_STATUSES = ['published', 'draft'] as const;

const validType = (t: unknown): boolean =>
  typeof t === 'string' && (VALID_TYPES as readonly string[]).includes(t);
const validStatus = (s: unknown): boolean =>
  typeof s === 'string' && (VALID_STATUSES as readonly string[]).includes(s);

const parseJsonArray = (value: unknown) => {
  if (Array.isArray(value)) return JSON.stringify(value.filter(item => typeof item === 'string' && item.trim()));
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? JSON.stringify(parsed.filter(item => typeof item === 'string' && item.trim())) : null;
  } catch {
    return JSON.stringify(value.split('\n').map(item => item.trim()).filter(Boolean));
  }
};

// Get single product
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: { where: { approved: true }, orderBy: { createdAt: 'desc' } },
        _count: { select: { reviews: true, orderItems: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}

// Update product
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const { id: _id, createdAt, updatedAt, reviews, orderItems, _count, ...rawUpdateData } = data;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'المنتج غير موجود' }, { status: 404 });
    }

    const hasNameUpdate = 'name' in rawUpdateData || 'nameAr' in rawUpdateData;
    if (hasNameUpdate &&
      !(typeof rawUpdateData.name === 'string' && rawUpdateData.name.trim()) &&
      !(typeof rawUpdateData.nameAr === 'string' && rawUpdateData.nameAr.trim())) {
      return NextResponse.json({
        success: false,
        error: 'اسم المنتج مطلوب (بالعربية أو بالإنجليزية)',
      }, { status: 400 });
    }

    if (rawUpdateData.status !== undefined && !validStatus(rawUpdateData.status)) {
      return NextResponse.json({
        success: false,
        error: 'الحالة غير صالحة — يجب أن تكون "published" أو "draft"',
      }, { status: 400 });
    }

    if (rawUpdateData.type !== undefined && !validType(rawUpdateData.type)) {
      return NextResponse.json({
        success: false,
        error: 'النوع غير صالح — يجب أن يكون digital أو service أو template أو course',
      }, { status: 400 });
    }

    if (rawUpdateData.salePrice !== undefined && rawUpdateData.salePrice !== '' && rawUpdateData.salePrice !== null) {
      const sale = parseNumber(rawUpdateData.salePrice, 'salePrice');
      if (sale !== null && rawUpdateData.price !== undefined) {
        const price = Number(rawUpdateData.price === '' ? 0 : rawUpdateData.price);
        if (Number.isFinite(price) && sale > price) {
          return NextResponse.json({
            success: false,
            error: 'سعر التخفيض (salePrice) لا يمكن أن يكون أكبر من السعر الأصلي',
          }, { status: 400 });
        }
      }
    }

    const updateData: Prisma.ProductUpdateInput = {};
    const nullableTextFields = ['nameAr', 'description', 'descriptionAr', 'categoryAr', 'downloadUrl', 'demoUrl'] as const;
    for (const field of nullableTextFields) {
      if (rawUpdateData[field] !== undefined) updateData[field] = rawUpdateData[field] === '' ? null : String(rawUpdateData[field]);
    }
    const requiredTextFields = ['name', 'currency', 'category', 'type', 'status'] as const;
    for (const field of requiredTextFields) {
      if (rawUpdateData[field] !== undefined) updateData[field] = String(rawUpdateData[field]);
    }
    if (rawUpdateData.slug !== undefined) {
      const slug = String(rawUpdateData.slug).toLowerCase().replace(/[^a-z0-9\u0621-\u064A]+/g, '-').replace(/^-|-$/g, '');
      if (!slug) {
        return NextResponse.json({ success: false, error: 'الرابط (Slug) مطلوب', }, { status: 400 });
      }
      if (slug !== existing.slug) {
        const duplicate = await prisma.product.findUnique({ where: { slug } });
        if (duplicate) {
          return NextResponse.json({ success: false, error: 'هذا الرابط مستخدم بالفعل، اختر رابطاً آخر' }, { status: 409 });
        }
      }
      updateData.slug = slug;
    }
    if (rawUpdateData.price !== undefined) updateData.price = parseNumber(rawUpdateData.price, 'price') ?? 0;
    if (rawUpdateData.salePrice !== undefined) updateData.salePrice = parseNumber(rawUpdateData.salePrice, 'salePrice');
    if (rawUpdateData.images !== undefined) updateData.images = parseJsonArray(rawUpdateData.images);
    if (rawUpdateData.features !== undefined) updateData.features = parseJsonArray(rawUpdateData.features);
    if (rawUpdateData.featuresAr !== undefined) updateData.featuresAr = parseJsonArray(rawUpdateData.featuresAr);
    if (rawUpdateData.featured !== undefined) updateData.featured = rawUpdateData.featured === true || rawUpdateData.featured === 'true';

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    revalidateTag('store-products', { expire: 0 });

    return NextResponse.json({ success: true, message: 'تم تحديث المنتج بنجاح', product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

// Delete product
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'المنتج غير موجود' }, { status: 404 });
    }
    await prisma.product.delete({ where: { id } });
    revalidateTag('store-products', { expire: 0 });
    return NextResponse.json({ success: true, message: 'تم حذف المنتج بنجاح' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
