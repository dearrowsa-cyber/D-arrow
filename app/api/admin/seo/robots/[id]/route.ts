import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
     const id = (await params).id;
     await prisma.robotsRule.delete({
       where: { id }
     });
     return new NextResponse(null, { status: 204 });
  } catch (error) {
     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
