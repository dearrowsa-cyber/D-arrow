import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, source } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const lead = await prisma.capturedLead.create({
      data: {
        email,
        name: name || null,
        source: source || 'unknown',
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Lead captured successfully',
      leadId: lead.id
    });
  } catch (error) {
    console.error('Error capturing lead:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to capture lead'
    }, { status: 500 });
  }
}
