import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const templateSchema = z.object({
  type: z.string().min(1),
  titleTemplate: z.string().min(1),
  descTemplate: z.string().min(1),
});

export async function GET() {
  try {
    const templates = await prisma.seoTemplate.findMany();
    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = templateSchema.parse(body);

    const newTemplate = await prisma.seoTemplate.create({
      data: validatedData
    });

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
     if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
     }
     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
