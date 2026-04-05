import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { pathname, referrer } = await req.json();
    
    // Ignore admin routes
    if (pathname && pathname.startsWith('/admin')) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const dataPath = path.join(process.cwd(), 'public', 'data', 'analytics.json');
    let analyticsData = { totalVisitors: 0, todayViews: 0, pageViews: {} as Record<string, number>, lastResetDate: new Date().toISOString().split('T')[0] };
    
    if (fs.existsSync(dataPath)) {
      try {
        const raw = fs.readFileSync(dataPath, 'utf8');
        analyticsData = JSON.parse(raw);
      } catch (e) {
        console.error('Error reading analytics.json:', e);
      }
    }

    const todayString = new Date().toISOString().split('T')[0];
    
    // Reset today views if it's a new day
    if (analyticsData.lastResetDate !== todayString) {
      analyticsData.todayViews = 0;
      analyticsData.lastResetDate = todayString;
    }

    // Increment counters
    analyticsData.totalVisitors += 1;
    analyticsData.todayViews += 1;
    
    // Track specific page
    const pageKey = pathname || '/';
    analyticsData.pageViews[pageKey] = (analyticsData.pageViews[pageKey] || 0) + 1;

    // Save
    fs.writeFileSync(dataPath, JSON.stringify(analyticsData, null, 2), 'utf8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ error: 'Failed to record analytics' }, { status: 500 });
  }
}
