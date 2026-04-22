import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const schemaMarkupSchema = z.object({
  slug: z.string().min(1),
  type: z.string().min(1),
  jsonData: z.string().min(1),
});

export async function GET() {
  try {
    const schemas = await prisma.schemaMarkup.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(schemas);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = schemaMarkupSchema.parse(body);

    const newSchema = await prisma.schemaMarkup.create({
      data: validatedData
    });

    return NextResponse.json(newSchema, { status: 201 });
  } catch (error) {
     if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
     }
     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
