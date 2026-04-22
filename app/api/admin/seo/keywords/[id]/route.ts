import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const keyword = await prisma.trackedKeyword.findUnique({
      where: { id },
      include: {
        rankings: { orderBy: { date: 'desc' }, take: 60 },
        pageKeywords: { orderBy: { date: 'desc' }, take: 30 },
      },
    });

    if (!keyword) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(keyword);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    const updated = await prisma.trackedKeyword.update({
      where: { id },
      data: {
        ...(data.starred !== undefined && { starred: data.starred }),
        ...(data.group !== undefined && { group: data.group }),
        ...(data.priority !== undefined && { priority: data.priority }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.trackedKeyword.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
