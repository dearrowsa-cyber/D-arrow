import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const group = searchParams.get('group');
    const starred = searchParams.get('starred');
    const search = searchParams.get('search');

    const where: any = {};
    if (group) where.group = group;
    if (starred === 'true') where.starred = true;
    if (search) where.keyword = { contains: search };

    const keywords = await prisma.trackedKeyword.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        rankings: {
          orderBy: { date: 'desc' },
          take: 2, // Latest + previous for change calculation
        },
      },
    });

    // Calculate position changes
    const enriched = keywords.map(kw => {
      const latest = kw.rankings[0];
      const previous = kw.rankings[1];
      const change = latest && previous ? previous.position - latest.position : 0;

      return {
        ...kw,
        latestPosition: latest?.position ?? null,
        latestClicks: latest?.clicks ?? 0,
        latestImpressions: latest?.impressions ?? 0,
        latestCtr: latest?.ctr ?? 0,
        positionChange: Math.round(change * 10) / 10,
      };
    });

    // Get unique groups for filter
    const groups = await prisma.trackedKeyword.findMany({
      where: { group: { not: null } },
      select: { group: true },
      distinct: ['group'],
    });

    return NextResponse.json({
      keywords: enriched,
      groups: groups.map(g => g.group).filter(Boolean),
      total: enriched.length,
    });
  } catch (error) {
    console.error('Keywords GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { keywords, group } = await req.json();

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json({ error: 'Keywords array is required' }, { status: 400 });
    }

    const results = [];
    for (const kw of keywords) {
      const keyword = typeof kw === 'string' ? kw.trim().toLowerCase() : kw.keyword?.trim()?.toLowerCase();
      if (!keyword) continue;

      try {
        const created = await prisma.trackedKeyword.upsert({
          where: { keyword },
          update: { group: group || undefined },
          create: { keyword, group: group || null },
        });
        results.push(created);
      } catch (e) {
        // Skip duplicates silently
      }
    }

    return NextResponse.json({ success: true, count: results.length, keywords: results });
  } catch (error) {
    console.error('Keywords POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
