import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { generatePricingInquiryEmail, generateCustomServicesInquiryEmail } from '../contact/route';

// POST /api/pricing
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, phone, company, selectedPackage, budget, timeline, additionalInfo, selectedServices, totalAmount, isCustomServicesInquiry } = data;

    const recipient = process.env.CONTACT_RECIPIENT || 'd.arrow2026@gmail.com';

    // Generate appropriate email based on inquiry type
    let html: string;
    let subject: string;

    if (isCustomServicesInquiry && selectedServices && selectedServices.length > 0) {
      html = generateCustomServicesInquiryEmail(
        name,
        email,
        phone,
        company,
        selectedServices,
        budget,
        timeline,
        additionalInfo,
        totalAmount
      );
      subject = `<img src="/icon/update/select3.png" alt="User Icon" className="w-7 h-10 pt-2" /> Custom Services Package — ${name} from ${company || 'Direct'} (${selectedServices.length} services)`;
    } else {
      html = generatePricingInquiryEmail(
        name,
        email,
        phone,
        company,
        selectedPackage,
        budget,
        timeline,
        additionalInfo
      );
      subject = `💰 Pricing Inquiry — ${name} from ${company || 'Direct'} (${selectedPackage})`;
    }

    // Setup SMTP transporter
    let transporter;
    const hasSmtp = !!process.env.SMTP_HOST || !!process.env.SMTP_USER;

    if (!hasSmtp) {
      // Development: Use Ethereal test account
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || testAccount.user,
        to: recipient,
        subject: subject,
        html,
      });

      const preview = nodemailer.getTestMessageUrl(info) || null;
      console.log('Ethereal preview URL:', preview);
      return NextResponse.json({ ok: true, preview });
    }

    // Production: Use Gmail or configured SMTP
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: (process.env.SMTP_SECURE === 'true') || Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
      tls: { rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== 'false' },
    });

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || (process.env.SMTP_USER ?? 'no-reply@example.com'),
        to: recipient,
        subject: subject,
        html,
      });

      return NextResponse.json({ ok: true });
    } catch (sendErr) {
      console.error('Mail send error:', sendErr);
      const msg = (sendErr as any)?.code === 'ECONNREFUSED'
        ? 'Connection refused. Check SMTP configuration.'
        : (sendErr as any)?.message || 'Failed to send email';
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }
  } catch (err) {
    console.error('Pricing API error:', err);
    return NextResponse.json({ ok: false, error: (err as any)?.message || 'Server error' }, { status: 500 });
  }
}
