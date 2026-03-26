import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'nodejs',
};

// Vercel Crons: This is called automatically based on the cron schedule
// Schedule defined in vercel.json
export default async function handler(req: NextRequest) {
  try {
    console.log('⏰ Vercel Cron: Blog Auto-Post Job Started');

    // Call the blog schedule endpoint
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://www.d-arrow.com/';

    const response = await fetch(`${baseUrl}/api/blog/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log('✅ Cron job completed:', data);

    return NextResponse.json({
      success: true,
      message: 'Blog cron job executed',
      result: data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Cron job failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Cron job failed',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
