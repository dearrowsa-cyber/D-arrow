import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

const parseNumber = (value: unknown) => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) throw new Error('Price must be a valid positive number');
  return parsed;
};

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

    const updateData: Prisma.ProductUpdateInput = {};
    const textFields = ['name', 'nameAr', 'slug', 'description', 'descriptionAr', 'currency', 'category', 'categoryAr', 'type', 'downloadUrl', 'demoUrl', 'status'] as const;
    for (const field of textFields) {
      if (rawUpdateData[field] !== undefined) updateData[field] = rawUpdateData[field] === '' ? null : String(rawUpdateData[field]);
    }
    if (rawUpdateData.price !== undefined) updateData.price = parseNumber(rawUpdateData.price) ?? 0;
    if (rawUpdateData.salePrice !== undefined) updateData.salePrice = parseNumber(rawUpdateData.salePrice);
    if (rawUpdateData.images !== undefined) updateData.images = parseJsonArray(rawUpdateData.images);
    if (rawUpdateData.features !== undefined) updateData.features = parseJsonArray(rawUpdateData.features);
    if (rawUpdateData.featuresAr !== undefined) updateData.featuresAr = parseJsonArray(rawUpdateData.featuresAr);
    if (rawUpdateData.featured !== undefined) updateData.featured = rawUpdateData.featured === true || rawUpdateData.featured === 'true';

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

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
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'تم حذف المنتج بنجاح' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
