import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { source } = await req.json();

    if (source === 'focus-keywords') {
      // Import all focus keywords from SeoMeta table
      const metas = await prisma.seoMeta.findMany({
        where: { focusKeyword: { not: null } },
        select: { focusKeyword: true },
      });

      const keywords = metas
        .map(m => m.focusKeyword?.trim().toLowerCase())
        .filter((kw): kw is string => !!kw);

      const unique = [...new Set(keywords)];
      const results = [];

      for (const keyword of unique) {
        try {
          const created = await prisma.trackedKeyword.upsert({
            where: { keyword },
            update: {},
            create: { keyword, group: 'focus-keywords' },
          });
          results.push(created);
        } catch (e) {
          // Skip duplicates
        }
      }

      return NextResponse.json({ success: true, count: results.length, source: 'focus-keywords' });
    }

    if (source === 'csv') {
      // CSV content expected in body.data
      const { data } = await req.json().catch(() => ({ data: '' }));
      if (!data) {
        return NextResponse.json({ error: 'CSV data is required' }, { status: 400 });
      }

      const lines = data.split('\n').map((l: string) => l.trim()).filter(Boolean);
      const keywords = lines.map((l: string) => {
        const parts = l.split(',');
        return { keyword: parts[0]?.trim().toLowerCase(), group: parts[1]?.trim() || null };
      }).filter((k: any) => k.keyword);

      const results = [];
      for (const { keyword, group } of keywords) {
        try {
          const created = await prisma.trackedKeyword.upsert({
            where: { keyword },
            update: { group: group || undefined },
            create: { keyword, group },
          });
          results.push(created);
        } catch (e) {
          // Skip
        }
      }

      return NextResponse.json({ success: true, count: results.length, source: 'csv' });
    }

    return NextResponse.json({ error: 'Invalid source. Use "focus-keywords" or "csv"' }, { status: 400 });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
