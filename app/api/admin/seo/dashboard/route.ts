import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [metaCount, redirectCount, schemaCount, auditLogs] = await Promise.all([
      prisma.seoMeta.count(),
      prisma.redirect.count(),
      prisma.schemaMarkup.count(),
      prisma.seoAuditLog.findMany({
        orderBy: { analyzedAt: 'desc' },
        include: { seoMeta: true }
      })
    ]);

    // Calculate Avg Score & Collect all unique errors/suggestions
    let totalScore = 0;
    let totalIssues = 0;
    const allErrors: { page: string; error: string }[] = [];
    
    // We only want the LATEST audit log per page
    const latestLogsMap = new Map();
    auditLogs.forEach(log => {
      if (!latestLogsMap.has(log.seoMetaId)) {
        latestLogsMap.set(log.seoMetaId, log);
      }
    });
    
    const latestLogs = Array.from(latestLogsMap.values());
    
    latestLogs.forEach(log => {
      totalScore += log.score;
      totalIssues += log.issuesCount;
      
      try {
        const suggestions = JSON.parse(log.suggestions);
        suggestions.forEach((s: string) => {
          allErrors.push({ page: log.seoMeta.slug, error: s });
        });
      } catch (e) {}
    });

    const avgScore = latestLogs.length > 0 ? Math.round(totalScore / latestLogs.length) : 0;

    // Fetch Keywords Rankings
    const keywords = await prisma.trackedKeyword.findMany({
      include: {
        rankings: {
          orderBy: { date: 'desc' },
          take: 1
        }
      }
    });

    const brandKeywords: any[] = [];
    const generalKeywords: any[] = [];

    keywords.forEach(kw => {
      const position = kw.rankings[0]?.position || null;
      const clicks = kw.rankings[0]?.clicks || 0;
      const data = { keyword: kw.keyword, position, clicks, group: kw.group };

      if (kw.keyword.includes('d arrow') || kw.keyword.includes('d-arrow') || kw.keyword.includes('darrow')) {
        brandKeywords.push(data);
      } else {
        generalKeywords.push(data);
      }
    });

    // Sort by position (nulls last)
    const sortFn = (a: any, b: any) => {
      if (a.position === null) return 1;
      if (b.position === null) return -1;
      return a.position - b.position;
    };

    return NextResponse.json({
      success: true,
      data: {
        avgScore,
        totalIssues,
        totalPages: metaCount,
        redirectsCount: redirectCount,
        brandKeywords: brandKeywords.sort(sortFn).slice(0, 5),
        generalKeywords: generalKeywords.sort(sortFn).slice(0, 5),
        recentErrors: allErrors.slice(0, 10), // Limit to top 10 errors for dashboard UI
        allErrors // Used for AI
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard aggregation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
