import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const redirectSchema = z.object({
  sourceUrl: z.string().min(1).optional(),
  destinationUrl: z.string().min(1).optional(),
  type: z.number().int().optional(),
  enabled: z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const body = await req.json();
    const validatedData = redirectSchema.parse(body);

    const updatedRedirect = await prisma.redirect.update({
      where: { id },
      data: validatedData
    });

    return NextResponse.json(updatedRedirect);
  } catch (error) {
     if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
     }
     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
     const id = (await params).id;
     await prisma.redirect.delete({
       where: { id }
     });
     return new NextResponse(null, { status: 204 });
  } catch (error) {
     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
