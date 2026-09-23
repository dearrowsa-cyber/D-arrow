import { NextRequest, NextResponse } from 'next/server';
import { analyzeContent } from '@/lib/seo/analyzer';
import { getAdminToken, verifyToken } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  const token = getAdminToken(req);

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { content, title, description, focusKeyword, slug } = await req.json();

    if (content === undefined || !title || !slug) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const analysis = analyzeContent(content, title, description || '', focusKeyword || '', slug);

    return NextResponse.json({ success: true, data: analysis });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
