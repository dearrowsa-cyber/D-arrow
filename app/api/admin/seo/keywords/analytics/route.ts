import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '28');

    const since = new Date();
    since.setDate(since.getDate() - days);

    // Aggregated stats
    const rankings = await prisma.keywordRanking.findMany({
      where: { date: { gte: since } },
      include: { keyword: true },
    });

    const totalClicks = rankings.reduce((s, r) => s + r.clicks, 0);
    const totalImpressions = rankings.reduce((s, r) => s + r.impressions, 0);
    const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    // Latest positions for avg calculation
    const latestByKeyword = new Map<string, number>();
    for (const r of rankings) {
      if (!latestByKeyword.has(r.keywordId) || r.date > new Date(0)) {
        latestByKeyword.set(r.keywordId, r.position);
      }
    }
    const positions = Array.from(latestByKeyword.values());
    const avgPosition = positions.length > 0 ? positions.reduce((a, b) => a + b, 0) / positions.length : 0;

    // Top movers (biggest position improvements)
    const keywordChanges: { keyword: string; change: number; position: number }[] = [];
    const grouped = new Map<string, typeof rankings>();
    for (const r of rankings) {
      if (!grouped.has(r.keywordId)) grouped.set(r.keywordId, []);
      grouped.get(r.keywordId)!.push(r);
    }

    for (const [kwId, records] of grouped) {
      const sorted = records.sort((a, b) => b.date.getTime() - a.date.getTime());
      if (sorted.length >= 2) {
        const change = sorted[sorted.length - 1].position - sorted[0].position;
        keywordChanges.push({
          keyword: sorted[0].keyword.keyword,
          change: Math.round(change * 10) / 10,
          position: sorted[0].position,
        });
      }
    }

    const topMovers = keywordChanges.sort((a, b) => b.change - a.change).slice(0, 5);
    const topDecliners = keywordChanges.sort((a, b) => a.change - b.change).slice(0, 5);

    // Daily trend data
    const dailyMap = new Map<string, { clicks: number; impressions: number; positions: number[] }>();
    for (const r of rankings) {
      const dateKey = r.date.toISOString().split('T')[0];
      if (!dailyMap.has(dateKey)) dailyMap.set(dateKey, { clicks: 0, impressions: 0, positions: [] });
      const day = dailyMap.get(dateKey)!;
      day.clicks += r.clicks;
      day.impressions += r.impressions;
      day.positions.push(r.position);
    }

    const dailyTrend = Array.from(dailyMap.entries())
      .map(([date, d]) => ({
        date,
        clicks: d.clicks,
        impressions: d.impressions,
        avgPosition: Math.round((d.positions.reduce((a, b) => a + b, 0) / d.positions.length) * 10) / 10,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      totalKeywords: latestByKeyword.size,
      totalClicks,
      totalImpressions,
      avgCtr: Math.round(avgCtr * 100) / 100,
      avgPosition: Math.round(avgPosition * 10) / 10,
      topMovers,
      topDecliners,
      dailyTrend,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
