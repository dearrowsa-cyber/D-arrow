import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        reviews: { where: { approved: true } },
        _count: { select: { reviews: true, orderItems: true } },
      },
    });

    return NextResponse.json({ success: true, products, count: products.length });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

// Create a new product
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.name || data.price === undefined) {
      return NextResponse.json({ success: false, error: 'Name and price are required' }, { status: 400 });
    }

    // Auto-generate slug if not provided
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9\u0621-\u064A]+/g, '-').replace(/^-|-$/g, '');

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'هذا الرابط مستخدم بالفعل، اختر رابطاً آخر' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        nameAr: data.nameAr || null,
        slug,
        description: data.description || null,
        descriptionAr: data.descriptionAr || null,
        price: parseFloat(data.price),
        salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
        currency: data.currency || 'SAR',
        images: data.images || null,
        category: data.category || 'General',
        categoryAr: data.categoryAr || null,
        type: data.type || 'digital',
        downloadUrl: data.downloadUrl || null,
        features: data.features || null,
        featuresAr: data.featuresAr || null,
        status: data.status || 'published',
        featured: data.featured || false,
      },
    });

    return NextResponse.json({ success: true, message: 'تم إنشاء المنتج بنجاح', product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
