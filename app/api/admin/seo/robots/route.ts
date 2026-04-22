import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const robotsRuleSchema = z.object({
  userAgent: z.string().min(1).default('*'),
  directive: z.string().min(1),
  path: z.string().min(1),
});

export async function GET() {
  try {
    const rules = await prisma.robotsRule.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(rules);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = robotsRuleSchema.parse(body);

    const newRule = await prisma.robotsRule.create({
      data: validatedData
    });

    return NextResponse.json(newRule, { status: 201 });
  } catch (error) {
     if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
     }
     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
