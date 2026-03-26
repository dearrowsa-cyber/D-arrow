import { NextRequest, NextResponse } from 'next/server';

// Cron job endpoint for automatic blog posting
// This endpoint should be called by your cron service (e.g., cron-job.org, EasyCron, etc.)
export async function GET(req: NextRequest) {
  try {
    // Optional: Verify cron secret if provided
    const cronSecret = req.headers.get('X-Cron-Secret');
    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret && cronSecret !== expectedSecret) {
      return NextResponse.json({
        success: false,
        error: 'Invalid cron secret',
      }, { status: 401 });
    }

    console.log('⏰ Cron job triggered - Running blog auto-post scheduler');

    // Call the schedule endpoint to generate 2 posts per day
    const scheduleResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://www.d-arrow.com/'}/api/blog/schedule`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const scheduleData = await scheduleResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Cron job executed successfully',
      result: scheduleData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json({
      success: false,
      error: 'Cron job failed',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Handle POST requests the same way as GET for webhook compatibility
  return GET(req);
}
