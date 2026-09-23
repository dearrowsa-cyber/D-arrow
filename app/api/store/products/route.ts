import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const parseNumber = (value: unknown, field: string, required = false) => {
  if (value === '' || value === null || value === undefined) {
    if (required) throw new Error(`${field} is required`);
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) throw new Error(`${field} must be a valid positive number`);
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

const stripHtml = (value: string | null) =>
  value
    ?.replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .trim() ?? null;

const toProductData = (data: Record<string, unknown>) => ({
  name: String(data.name || data.nameAr || '').trim(),
  nameAr: data.nameAr ? String(data.nameAr).trim() : null,
  slug: String(data.slug || '').trim(),
  description: data.description ? String(data.description) : null,
  descriptionAr: data.descriptionAr ? String(data.descriptionAr) : null,
  price: parseNumber(data.price, 'price', true) ?? 0,
  salePrice: parseNumber(data.salePrice, 'salePrice'),
  currency: String(data.currency || 'SAR'),
  images: parseJsonArray(data.images),
  category: String(data.category || 'General'),
  categoryAr: data.categoryAr ? String(data.categoryAr) : null,
  type: String(data.type || 'digital'),
  downloadUrl: data.downloadUrl ? String(data.downloadUrl) : null,
  demoUrl: data.demoUrl ? String(data.demoUrl) : null,
  features: parseJsonArray(data.features),
  featuresAr: parseJsonArray(data.featuresAr),
  status: String(data.status || 'published'),
  featured: data.featured === true || data.featured === 'true',
});

// Get all products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (featured === 'true') where.featured = true;

    let products: any[] = [];
    try {
      products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          reviews: { where: { approved: true } },
          _count: { select: { reviews: true, orderItems: true } },
        },
      });
    } catch (e) {
      console.warn('Prisma fetch failed, using default templates', e);
    }

    const normalizedProducts = products.map((product) => ({
      ...product,
      description: stripHtml(product.description),
      descriptionAr: stripHtml(product.descriptionAr),
    }));

    return NextResponse.json({ success: true, products: normalizedProducts, count: normalizedProducts.length });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

// Create a new product
export async function POST(req: NextRequest) {
  try {
    const data = await req.json() as Record<string, unknown>;

    if ((!data.name && !data.nameAr) || data.price === undefined) {
      return NextResponse.json({ success: false, error: 'Name and price are required' }, { status: 400 });
    }

    // Auto-generate slug if not provided
    const slug = String(data.slug || data.name).toLowerCase().replace(/[^a-z0-9\u0621-\u064A]+/g, '-').replace(/^-|-$/g, '');

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'هذا الرابط مستخدم بالفعل، اختر رابطاً آخر' }, { status: 400 });
    }

    const product = await prisma.product.create({ data: { ...toProductData(data), slug } });

    return NextResponse.json({ success: true, message: 'تم إنشاء المنتج بنجاح', product });
  } catch (error) {
    console.error('Error creating product:', error);
    const message = error instanceof Error ? error.message : '';
    const isValidationError = message.endsWith('is required') || message.includes('must be a valid');
    return NextResponse.json({ success: false, error: isValidationError ? message : 'Failed to create product' }, { status: isValidationError ? 400 : 500 });
  }
}
