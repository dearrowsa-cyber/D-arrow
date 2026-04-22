import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const redirectSchema = z.object({
  sourceUrl: z.string().min(1),
  destinationUrl: z.string().min(1),
  type: z.number().int().default(301),
  enabled: z.boolean().default(true),
});

export async function GET() {
  try {
    const redirects = await prisma.redirect.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(redirects);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = redirectSchema.parse(body);

    const newRedirect = await prisma.redirect.create({
      data: validatedData
    });

    return NextResponse.json(newRedirect, { status: 201 });
  } catch (error) {
     if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
     }
     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
