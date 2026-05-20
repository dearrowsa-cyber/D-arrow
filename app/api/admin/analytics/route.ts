import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';

export async function GET() {
  let fileData = { totalVisitors: 0, todayViews: 0, pageViews: {} };
  let sortedPages: any[] = [];

  try {
    const dataPath = path.join(process.cwd(), 'public', 'data', 'analytics.json');
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf8');
      const parsed = JSON.parse(raw);
      fileData = {
        totalVisitors: parsed.totalVisitors || 0,
        todayViews: parsed.todayViews || 0,
        pageViews: parsed.pageViews || {}
      };
      
      // Sort pageViews
      sortedPages = Object.entries(fileData.pageViews)
        .map(([path, hits]) => ({ path, hits }))
        .sort((a: any, b: any) => b.hits - a.hits)
        .slice(0, 5); // top 5 pages
    }
  } catch (err) {
    console.error('Error reading analytics file:', err);
  }

  // Fetch store and database stats with fallback values
  let storeStats = {
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCoupons: 0,
    pendingReviews: 0
  };

  try {
    const [totalOrders, paidOrders, totalProducts, totalCoupons, pendingReviews] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({
        where: { paymentStatus: 'paid' },
        select: { total: true }
      }),
      prisma.product.count(),
      prisma.coupon.count(),
      prisma.productReview.count({ where: { approved: false } })
    ]);

    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);

    storeStats = {
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCoupons,
      pendingReviews
    };
  } catch (dbError) {
    console.error('Error fetching DB stats for admin dashboard:', dbError);
  }

  return NextResponse.json({ 
    success: true, 
    data: {
      totalVisitors: fileData.totalVisitors,
      todayViews: fileData.todayViews,
      topPages: sortedPages,
      store: storeStats
    }
  });
}
