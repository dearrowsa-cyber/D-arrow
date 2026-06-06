import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/app/api/admin/auth/route';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const entry = await prisma.seoMeta.findUnique({
      where: { id }
    });

    if (!entry) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: entry });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();

    const updated = await prisma.seoMeta.update({
      where: { id },
      data: {
        slug: data.slug,
        title: data.title,
        titleAr: data.titleAr,
        titleEn: data.titleEn,
        description: data.description,
        descriptionAr: data.descriptionAr,
        descriptionEn: data.descriptionEn,
        focusKeyword: data.focusKeyword,
        focusKeywordAr: data.focusKeywordAr,
        focusKeywordEn: data.focusKeywordEn,
        canonicalUrl: data.canonicalUrl,
        robots: data.robots,
        ogTitle: data.ogTitle,
        ogTitleAr: data.ogTitleAr,
        ogTitleEn: data.ogTitleEn,
        ogDescription: data.ogDescription,
        ogDescriptionAr: data.ogDescriptionAr,
        ogDescriptionEn: data.ogDescriptionEn,
        ogImage: data.ogImage,
        twitterCard: data.twitterCard,
        schemaType: data.schemaType,
      }
    });

    if (updated.slug) {
      try {
        revalidatePath(updated.slug, 'page');
        revalidatePath(updated.slug, 'layout');
      } catch (e) {
        console.warn('Cache revalidation failed:', e);
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Get slug before deleting so we can revalidate the page
    const entry = await prisma.seoMeta.findUnique({ where: { id }, select: { slug: true } });
    
    await prisma.seoMeta.delete({
      where: { id }
    });

    if (entry?.slug) {
      try {
        revalidatePath(entry.slug, 'page');
        revalidatePath(entry.slug, 'layout');
      } catch (e) {
        console.warn('Cache revalidation failed:', e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
