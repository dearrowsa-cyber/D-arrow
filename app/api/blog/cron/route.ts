import { NextRequest, NextResponse } from 'next/server';

// Cron job endpoint for automatic blog posting
// This endpoint should be called by your cron service (e.g., cron-job.org, EasyCron, etc.)
export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Auto-posting cron job is permanently disabled by admin request.',
    disabled: true
  });
}

export async function POST(req: NextRequest) {
  // Handle POST requests the same way as GET for webhook compatibility
  return GET(req);
}
