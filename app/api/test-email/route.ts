import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// GET /api/test-email - Diagnostic endpoint to test email configuration
export async function GET() {
  try {
    console.log('=== Email Configuration Test ===');
    
    // Check if environment variables are set
    const config = {
      CONTACT_RECIPIENT: process.env.CONTACT_RECIPIENT ? '✓ Set' : '❌ Missing',
      SMTP_HOST: process.env.SMTP_HOST ? '✓ Set' : '❌ Missing',
      SMTP_PORT: process.env.SMTP_PORT ? '✓ Set' : '❌ Missing',
      SMTP_USER: process.env.SMTP_USER ? '✓ Set' : '❌ Missing',
      SMTP_PASS: process.env.SMTP_PASS ? '✓ Set (hidden)' : '❌ Missing',
      SMTP_FROM: process.env.SMTP_FROM ? '✓ Set' : '❌ Missing',
      SMTP_SECURE: process.env.SMTP_SECURE ? process.env.SMTP_SECURE : 'false',
      SMTP_REJECT_UNAUTHORIZED: process.env.SMTP_REJECT_UNAUTHORIZED ? process.env.SMTP_REJECT_UNAUTHORIZED : 'true',
    };

    console.log('Configuration Status:', config);

    // Try to create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: (process.env.SMTP_SECURE === 'true') || Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
      tls: { rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== 'false' },
    });

    // Verify SMTP connection
    try {
      await transporter.verify();
      console.log('✓ SMTP connection verified successfully');
      
      return NextResponse.json({
        ok: true,
        message: 'Email configuration is correct',
        config,
        smtp_status: 'Connected ✓',
        next_steps: [
          '1. Try submitting a contact form',
          '2. Check d.arrow2026@gmail.com inbox',
          '3. If email doesn\'t arrive, check Vercel function logs',
        ],
      });
    } catch (verifyErr) {
      console.error('SMTP verification failed:', verifyErr);
      
      return NextResponse.json({
        ok: false,
        message: 'SMTP connection failed',
        config,
        error: (verifyErr as any)?.message || 'Could not connect to SMTP server',
        smtp_status: 'Connection Failed ✗',
        troubleshooting: [
          'Make sure all 8 environment variables are set in Vercel',
          'Verify SMTP_HOST and SMTP_PORT are correct',
          'Check SMTP_USER and SMTP_PASS (especially spaces)',
          'Gmail may block: https://support.google.com/accounts/answer/6010255',
          'Try SendGrid as alternative: https://sendgrid.com/',
        ],
      }, { status: 500 });
    }
  } catch (err) {
    console.error('Test endpoint error:', err);
    return NextResponse.json({
      ok: false,
      error: (err as any)?.message || 'Server error',
    }, { status: 500 });
  }
}
