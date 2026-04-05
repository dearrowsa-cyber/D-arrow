import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'public', 'data', 'analytics.json');
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({ success: true, data: { totalVisitors: 0, todayViews: 0, pageViews: {} } });
    }

    const raw = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(raw);

    // Sort pageViews
    const sortedPages = Object.entries(data.pageViews || {})
      .map(([path, hits]) => ({ path, hits }))
      .sort((a: any, b: any) => b.hits - a.hits)
      .slice(0, 5); // top 5 pages

    return NextResponse.json({ 
      success: true, 
      data: {
        totalVisitors: data.totalVisitors || 0,
        todayViews: data.todayViews || 0,
        topPages: sortedPages
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
