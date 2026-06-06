import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const metaSchema = z.object({
  slug: z.string().min(1),
  title: z.string().optional().nullable(),
  titleAr: z.string().optional().nullable(),
  titleEn: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  focusKeyword: z.string().optional().nullable(),
  focusKeywordAr: z.string().optional().nullable(),
  focusKeywordEn: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
  robots: z.string().optional().nullable(),
  ogTitle: z.string().optional().nullable(),
  ogTitleAr: z.string().optional().nullable(),
  ogTitleEn: z.string().optional().nullable(),
  ogDescription: z.string().optional().nullable(),
  ogDescriptionAr: z.string().optional().nullable(),
  ogDescriptionEn: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  twitterCard: z.string().optional().nullable(),
  schemaType: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const meta = await prisma.seoMeta.findUnique({
        where: { slug }
      });
      if (!meta) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(meta);
    }

    const metas = await prisma.seoMeta.findMany({
       orderBy: { updatedAt: 'desc' },
       include: { auditLogs: { orderBy: { analyzedAt: 'desc' }, take: 1 } }
    });
    return NextResponse.json(metas);
  } catch (error) {
    console.error('Error fetching SEO Meta:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = metaSchema.parse(body);

    const newMeta = await prisma.seoMeta.create({
      data: validatedData
    });

    if (newMeta.slug) {
      try {
        revalidatePath(newMeta.slug, 'page');
        revalidatePath(newMeta.slug, 'layout');
      } catch (e) {
        console.warn('Cache revalidation failed:', e);
      }
    }

    return NextResponse.json({ success: true, data: newMeta }, { status: 201 });
  } catch (error) {
     if (error instanceof z.ZodError) {
        return NextResponse.json({ success: false, error: 'Validation Error', details: error.issues }, { status: 400 });
     }
     console.error('Error creating SEO Meta:', error);
     return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
