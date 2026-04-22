import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { fetchKeywordRankings } from '@/lib/seo/google-search-console';

export async function POST(req: NextRequest) {
  try {
    const allKeywords = await prisma.trackedKeyword.findMany();

    if (allKeywords.length === 0) {
      return NextResponse.json({ success: false, error: 'No tracked keywords. Add keywords first.' }, { status: 400 });
    }

    const keywordStrings = allKeywords.map(k => k.keyword);
    const rankingData = await fetchKeywordRankings(keywordStrings);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let synced = 0;

    for (const data of rankingData) {
      const tracked = allKeywords.find(k => k.keyword === data.keyword);
      if (!tracked) continue;

      // Upsert daily ranking snapshot
      await prisma.keywordRanking.upsert({
        where: {
          keywordId_date: {
            keywordId: tracked.id,
            date: today,
          },
        },
        update: {
          position: data.position,
          clicks: data.clicks,
          impressions: data.impressions,
          ctr: data.ctr,
        },
        create: {
          keywordId: tracked.id,
          position: data.position,
          clicks: data.clicks,
          impressions: data.impressions,
          ctr: data.ctr,
          date: today,
        },
      });

      // Upsert page-level keyword data
      for (const page of data.pages) {
        await prisma.pageKeyword.upsert({
          where: {
            keywordId_pageUrl_date: {
              keywordId: tracked.id,
              pageUrl: page.url,
              date: today,
            },
          },
          update: {
            position: page.position,
            clicks: page.clicks,
            impressions: page.impressions,
          },
          create: {
            keywordId: tracked.id,
            pageUrl: page.url,
            position: page.position,
            clicks: page.clicks,
            impressions: page.impressions,
            date: today,
          },
        });
      }

      synced++;
    }

    return NextResponse.json({ success: true, synced, total: allKeywords.length });
  } catch (error) {
    console.error('Keyword sync error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
