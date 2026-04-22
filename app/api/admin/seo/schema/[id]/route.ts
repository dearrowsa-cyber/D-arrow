import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const schemaMarkupSchema = z.object({
  slug: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  jsonData: z.string().min(1).optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = schemaMarkupSchema.parse(body);

    const updatedSchema = await prisma.schemaMarkup.update({
      where: { id },
      data: validatedData
    });

    return NextResponse.json(updatedSchema);
  } catch (error) {
     if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
     }
     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
     const { id } = await params;
     await prisma.schemaMarkup.delete({
       where: { id }
     });
     return new NextResponse(null, { status: 204 });
  } catch (error) {
     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
