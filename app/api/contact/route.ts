import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// POST /api/contact
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, phone, company, service, message, isCustomService, services, description } = data;

    const recipient = process.env.CONTACT_RECIPIENT || 'de.arrow.sa@gmail.com';

    // Generate HTML based on request type
    const html = isCustomService 
      ? generateCustomServiceEmail(name, email, phone, company, services, description)
      : generateStandardContactEmail(name, email, phone, company, service, message);

    const subject = isCustomService 
      ? `<img src="/icon/update/select3.png" alt="User Icon" className="w-7 h-10 pt-2" /> Custom Service Request — ${name} from ${company}`
      : `New contact — ${name} (${service || 'general'})`;

    // If SMTP settings are not provided, create a test (Ethereal) account so devs can inspect messages.
    let transporter;
    const hasSmtp = !!process.env.SMTP_HOST || !!process.env.SMTP_USER;

    if (!hasSmtp) {
      // Create test account (Ethereal) for development — this does not deliver to real inboxes,
      // but provides a preview URL that appears in the server logs and response.
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

    // Use provided SMTP settings
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
        ? 'Connection refused when trying to reach SMTP server. Check SMTP_HOST and SMTP_PORT environment variables and ensure your SMTP server accepts connections.'
        : (sendErr as any)?.message || 'Failed to send email';
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ ok: false, error: (err as any)?.message || 'Server error' }, { status: 500 });
  }
}

function generateStandardContactEmail(name: string, email: string, phone: string, company: string, service: string, message: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #f0f4f8;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 700px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(0, 51, 102, 0.12);
            border-left: 5px solid #0066cc;
        }
        .header {
            background: linear-gradient(135deg, #003366 0%, #0052a3 100%);
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 14px;
            opacity: 0.95;
            font-weight: 500;
        }
        .content {
            padding: 35px 30px;
        }
        .section {
            margin-bottom: 28px;
        }
        .section-header {
            display: flex;
            align-items: center;
            margin-bottom: 18px;
            padding-bottom: 12px;
            border-bottom: 2px solid #e8eef5;
        }
        .section-icon {
            font-size: 20px;
            margin-right: 12px;
        }
        .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #003366;
            margin: 0;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 20px;
        }
        .info-item {
            background-color: #f8fbff;
            padding: 14px;
            border-radius: 8px;
            border-left: 3px solid #0066cc;
        }
        .info-label {
            font-size: 11px;
            color: #0052a3;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            font-weight: 700;
            margin-bottom: 6px;
            display: block;
        }
        .info-value {
            font-size: 14px;
            color: #1a1a1a;
            font-weight: 600;
            word-break: break-word;
        }
        .message-section {
            background-color: #f8fbff;
            padding: 18px;
            border-radius: 8px;
            border-left: 3px solid #0066cc;
        }
        .message-label {
            font-size: 11px;
            color: #0052a3;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            font-weight: 700;
            margin-bottom: 10px;
            display: block;
        }
        .message-content {
            font-size: 14px;
            color: #333;
            line-height: 1.8;
            white-space: pre-wrap;
            word-wrap: break-word;
            background-color: #ffffff;
            padding: 12px;
            border-radius: 6px;
        }
        .action-buttons {
            background: linear-gradient(135deg, #003366 0%, #0052a3 100%);
            color: #ffffff;
            padding: 20px 30px;
            text-align: center;
            margin-top: 28px;
            border-radius: 8px;
        }
        .action-buttons p {
            margin: 0 0 12px 0;
            font-weight: 600;
            font-size: 14px;
        }
        .action-link {
            display: inline-block;
            margin: 0 10px;
            padding: 10px 18px;
            background-color: #ffffff;
            color: #0066cc;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 600;
            font-size: 13px;
            transition: all 0.2s;
        }
        .action-link:hover {
            background-color: #e8eef5;
        }
        .footer {
            background-color: #f0f4f8;
            padding: 20px 30px;
            border-top: 1px solid #e8eef5;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
        .footer p {
            margin: 5px 0;
        }
        .timestamp {
            color: #0052a3;
            font-size: 11px;
            margin-top: 12px;
            font-weight: 600;
        }
        .priority-badge {
            display: inline-block;
            background-color: #0066cc;
            color: #ffffff;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>📩 New Contact Inquiry</h1>
            <p>Client Information & Message Details</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="priority-badge">CONTACT INQUIRY</div>

            <!-- Client Information Section -->
            <div class="section">
                <div class="section-header">
                    <span class="section-icon"><img src="/icon/update/user-cion.png" alt="User Icon" className="w-7 h-10 pt-2" /></span>
                    <h2 class="section-title">Client Information</h2>
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <label class="info-label">Full Name</label>
                        <div class="info-value">${name}</div>
                    </div>
                    <div class="info-item">
                        <label class="info-label">Email Address</label>
                        <div class="info-value"><a href="mailto:${email}" style="color: #0066cc; text-decoration: none; font-weight: 600;">${email}</a></div>
                    </div>
                    <div class="info-item">
                        <label class="info-label">Phone Number</label>
                        <div class="info-value"><a href="tel:${phone}" style="color: #0066cc; text-decoration: none; font-weight: 600;">${phone}</a></div>
                    </div>
                    <div class="info-item">
                        <label class="info-label">Company</label>
                        <div class="info-value">${company || 'Not Specified'}</div>
                    </div>
                </div>
            </div>

            <!-- Service Interest Section -->
            <div class="section">
                <div class="section-header">
                    <span class="section-icon"><img src="/icon/update/select3.png" alt="User Icon" className="w-7 h-10 pt-2" /></span>
                    <h2 class="section-title">Service Interest</h2>
                </div>
                <div class="info-item">
                    <label class="info-label">Interested In</label>
                    <div class="info-value">${service || 'General Inquiry'}</div>
                </div>
            </div>

            <!-- Message Section -->
            <div class="section">
                <div class="section-header">
                    <span class="section-icon">💬</span>
                    <h2 class="section-title">Client Message</h2>
                </div>
                <div class="message-section">
                    <div class="message-content">${message.replace(/\n/g, '<br/>')}</div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
                <p>Quick Actions:</p>
                <a href="mailto:${email}?subject=Re: Your Inquiry - D Arrow Digital" class="action-link">📧 Reply Email</a>
                <a href="tel:${phone}" class="action-link">📞 Call Client</a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>D Arrow Digital</strong> | Professional Digital Marketing Agency</p>
            <p>This is an automated notification. Client information has been securely captured.</p>
            <p class="timestamp">📅 ${new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</p>
        </div>
    </div>
</body>
</html>
  `;
}

function generateCustomServiceEmail(name: string, email: string, phone: string, company: string, services: string[], description: string): string {
  const servicesList = services.map(s => `<li>${s}</li>`).join('');
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #f0f4f8;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 700px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(0, 51, 102, 0.12);
            border-left: 5px solid #0066cc;
        }
        .header {
            background: linear-gradient(135deg, #003366 0%, #0052a3 100%);
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 14px;
            opacity: 0.95;
            font-weight: 500;
        }
        .content {
            padding: 35px 30px;
        }
        .section {
            margin-bottom: 28px;
        }
        .section-header {
            display: flex;
            align-items: center;
            margin-bottom: 18px;
            padding-bottom: 12px;
            border-bottom: 2px solid #e8eef5;
        }
        .section-icon {
            font-size: 20px;
            margin-right: 12px;
        }
        .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #003366;
            margin: 0;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 20px;
        }
        .info-item {
            background-color: #f8fbff;
            padding: 14px;
            border-radius: 8px;
            border-left: 3px solid #0066cc;
        }
        .info-label {
            font-size: 11px;
            color: #0052a3;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            font-weight: 700;
            margin-bottom: 6px;
            display: block;
        }
        .info-value {
            font-size: 14px;
            color: #1a1a1a;
            font-weight: 600;
            word-break: break-word;
        }
        .services-list {
            list-style: none;
            padding: 0;
            margin: 0;
            background-color: #f8fbff;
            border-radius: 8px;
            border-left: 3px solid #0066cc;
            padding: 16px;
        }
        .services-list li {
            padding: 12px 0;
            border-bottom: 1px solid #e8eef5;
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #1a1a1a;
            font-weight: 600;
        }
        .services-list li:before {
            content: "✓";
            color: #0066cc;
            font-weight: bold;
            margin-right: 12px;
            font-size: 18px;
            flex-shrink: 0;
        }
        .services-list li:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }
        .description-box {
            background-color: #f8fbff;
            padding: 16px;
            border-radius: 8px;
            border-left: 3px solid #0066cc;
            font-size: 14px;
            color: #333;
            line-height: 1.8;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .service-count-badge {
            display: inline-block;
            background-color: #0066cc;
            color: #ffffff;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .action-buttons {
            background: linear-gradient(135deg, #003366 0%, #0052a3 100%);
            color: #ffffff;
            padding: 20px 30px;
            text-align: center;
            margin-top: 28px;
            border-radius: 8px;
        }
        .action-buttons p {
            margin: 0 0 12px 0;
            font-weight: 600;
            font-size: 14px;
        }
        .action-link {
            display: inline-block;
            margin: 0 10px;
            padding: 10px 18px;
            background-color: #ffffff;
            color: #0066cc;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 600;
            font-size: 13px;
            transition: all 0.2s;
        }
        .action-link:hover {
            background-color: #e8eef5;
        }
        .footer {
            background-color: #f0f4f8;
            padding: 20px 30px;
            border-top: 1px solid #e8eef5;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
        .footer p {
            margin: 5px 0;
        }
        .timestamp {
            color: #0052a3;
            font-size: 11px;
            margin-top: 12px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1><img src="/icon/update/select3.png" alt="User Icon" className="w-7 h-10 pt-2" /> Custom Service Request</h1>
            <p>Client Service Selection & Requirements</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="service-count-badge">${services.length} Services Selected</div>

            <!-- Client Information -->
            <div class="section">
                <div class="section-header">
                    <span class="section-icon"><img src="/icon/update/user-cion.png" alt="User Icon" className="w-7 h-10 pt-2" /></span>
                    <h2 class="section-title">Client Information</h2>
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <label class="info-label">Full Name</label>
                        <div class="info-value">${name}</div>
                    </div>
                    <div class="info-item">
                        <label class="info-label">Company</label>
                        <div class="info-value">${company || 'Not Specified'}</div>
                    </div>
                    <div class="info-item" style="grid-column: 1 / -1;">
                        <label class="info-label">Email Address</label>
                        <div class="info-value"><a href="mailto:${email}" style="color: #0066cc; text-decoration: none; font-weight: 600;">${email}</a></div>
                    </div>
                    <div class="info-item" style="grid-column: 1 / -1;">
                        <label class="info-label">Phone Number</label>
                        <div class="info-value"><a href="tel:${phone}" style="color: #0066cc; text-decoration: none; font-weight: 600;">${phone}</a></div>
                    </div>
                </div>
            </div>

            <!-- Selected Services -->
            <div class="section">
                <div class="section-header">
                    <span class="section-icon">✅</span>
                    <h2 class="section-title">Requested Services</h2>
                </div>
                <ul class="services-list">
                    ${servicesList}
                </ul>
            </div>

            <!-- Project Details -->
            <div class="section">
                <div class="section-header">
                    <span class="section-icon"><img src="/icon/services-icon/analytics_report_approval.png" alt="User Icon" className="w-7 h-10 pt-2" /></span>
                    <h2 class="section-title">Project Requirements</h2>
                </div>
                <div class="description-box">${description.replace(/\n/g, '<br/')}</div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
                <p>Respond within 24 hours with a customized proposal</p>
                <a href="mailto:${email}?subject=D Arrow Digital - Custom Service Proposal" class="action-link">📧 Send Proposal</a>
                <a href="tel:${phone}" class="action-link">📞 Discuss Services</a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>D Arrow Digital</strong> | Professional Digital Marketing Agency</p>
            <p>20+ Years of Experience | 500+ Successful Projects</p>
            <p class="timestamp">📅 ${new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</p>
        </div>
    </div>
</body>
</html>
  `;
}

// Professional Email Template for Pricing Inquiries
export function generatePricingInquiryEmail(name: string, email: string, phone: string, company: string, selectedPackage: string, budget?: string, timeline?: string, additionalInfo?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #f0f4f8;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 700px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(0, 51, 102, 0.12);
            border-left: 5px solid #0066cc;
        }
        .header {
            background: linear-gradient(135deg, #003366 0%, #0052a3 100%);
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 14px;
            opacity: 0.95;
            font-weight: 500;
        }
        .content {
            padding: 35px 30px;
        }
        .section {
            margin-bottom: 28px;
        }
        .section-header {
            display: flex;
            align-items: center;
            margin-bottom: 18px;
            padding-bottom: 12px;
            border-bottom: 2px solid #e8eef5;
        }
        .section-icon {
            font-size: 20px;
            margin-right: 12px;
        }
        .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #003366;
            margin: 0;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 20px;
        }
        .info-item {
            background-color: #f8fbff;
            padding: 14px;
            border-radius: 8px;
            border-left: 3px solid #0066cc;
        }
        .info-label {
            font-size: 11px;
            color: #0052a3;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            font-weight: 700;
            margin-bottom: 6px;
            display: block;
        }
        .info-value {
            font-size: 14px;
            color: #1a1a1a;
            font-weight: 600;
            word-break: break-word;
        }
        .info-full {
            grid-column: 1 / -1;
        }
        .highlight-box {
            background: linear-gradient(135deg, #e8eef5 0%, #f0f4f8 100%);
            border-left: 4px solid #0052a3;
            padding: 16px;
            border-radius: 8px;
            margin: 16px 0;
        }
        .package-name {
            font-size: 16px;
            font-weight: 700;
            color: #003366;
            margin: 0;
        }
        .package-icon {
            font-size: 24px;
            margin-bottom: 8px;
        }
        .details-box {
            background-color: #f8fbff;
            padding: 16px;
            border-radius: 8px;
            border-left: 3px solid #0066cc;
        }
        .detail-item {
            margin-bottom: 14px;
            padding-bottom: 14px;
            border-bottom: 1px solid #e8eef5;
        }
        .detail-item:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        .detail-label {
            font-size: 10px;
            color: #0052a3;
            text-transform: uppercase;
            letter-spacing: 0.7px;
            font-weight: 800;
            margin-bottom: 6px;
            display: block;
        }
        .detail-value {
            font-size: 14px;
            color: #1a1a1a;
            font-weight: 600;
        }
        .action-buttons {
            background: linear-gradient(135deg, #003366 0%, #0052a3 100%);
            color: #ffffff;
            padding: 20px 30px;
            text-align: center;
            margin-top: 28px;
            border-radius: 8px;
        }
        .action-buttons p {
            margin: 0 0 12px 0;
            font-weight: 600;
            font-size: 14px;
        }
        .action-link {
            display: inline-block;
            margin: 0 10px;
            padding: 10px 18px;
            background-color: #ffffff;
            color: #0066cc;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 600;
            font-size: 13px;
            transition: all 0.2s;
        }
        .action-link:hover {
            background-color: #e8eef5;
        }
        .footer {
            background-color: #f0f4f8;
            padding: 20px 30px;
            border-top: 1px solid #e8eef5;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
        .footer p {
            margin: 5px 0;
        }
        .timestamp {
            color: #0052a3;
            font-size: 11px;
            margin-top: 12px;
            font-weight: 600;
        }
        .priority-badge {
            display: inline-block;
            background-color: #0066cc;
            color: #ffffff;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>💰 Pricing Inquiry</h1>
            <p>Client Budget & Package Interest</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="priority-badge">PRICING INQUIRY - HOT LEAD</div>

            <!-- Client Information -->
            <div class="section">
                <div class="section-header">
                    <span class="section-icon"><img src="/icon/update/user-cion.png" alt="User Icon" className="w-7 h-10 pt-2" /></span>
                    <h2 class="section-title">Client Details</h2>
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <label class="info-label">Full Name</label>
                        <div class="info-value">${name}</div>
                    </div>
                    <div class="info-item">
                        <label class="info-label">Company</label>
                        <div class="info-value">${company || 'Not Specified'}</div>
                    </div>
                    <div class="info-item info-full">
                        <label class="info-label">Email Address</label>
                        <div class="info-value"><a href="mailto:${email}" style="color: #0066cc; text-decoration: none; font-weight: 600;">${email}</a></div>
                    </div>
                    <div class="info-item info-full">
                        <label class="info-label">Phone Number</label>
                        <div class="info-value"><a href="tel:${phone}" style="color: #0066cc; text-decoration: none; font-weight: 600;">${phone}</a></div>
                    </div>
                </div>
            </div>

            <!-- Package Interest -->
            <div class="section">
                <div class="section-header">
                    <span class="section-icon">📦</span>
                    <h2 class="section-title">Selected Package</h2>
                </div>
                <div class="highlight-box">
                    <div class="package-icon">📊</div>
                    <p class="package-name">${selectedPackage}</p>
                </div>
            </div>

            <!-- Budget & Timeline Highlights -->
            <div class="section">
                <div class="section-header">
                    <span class="section-icon">💵</span>
                    <h2 class="section-title">Budget & Timeline</h2>
                </div>
                <div class="details-box">
                    ${budget ? `
                    <div class="detail-item">
                        <label class="detail-label">💰 Budget Range</label>
                        <div class="detail-value">${budget}</div>
                    </div>
                    ` : ''}
                    
                    ${timeline ? `
                    <div class="detail-item">
                        <label class="detail-label">⏱️ Project Timeline</label>
                        <div class="detail-value">${timeline}</div>
                    </div>
                    ` : ''}
                </div>
            </div>

            <!-- Additional Information -->
            ${additionalInfo ? `
            <div class="section">
                <div class="section-header">
                    <span class="section-icon"><img src="/icon/services-icon/analytics_report_approval.png" alt="User Icon" className="w-7 h-10 pt-2" /></span>
                    <h2 class="section-title">Project Details</h2>
                </div>
                <div class="info-item info-full" style="background-color: #f8fbff; padding: 16px; border-left: 3px solid #0066cc;">
                    <div style="font-size: 14px; color: #333; line-height: 1.8; white-space: pre-wrap; word-wrap: break-word;">${additionalInfo.replace(/\n/g, '<br/>')}</div>
                </div>
            </div>
            ` : ''}

            <!-- Action Buttons -->
            <div class="action-buttons">
                <p>⏰ Respond within 24 hours for best conversion</p>
                <a href="mailto:${email}?subject=D Arrow Digital - Custom Quote for Your Project" class="action-link">📧 Send Quote</a>
                <a href="tel:${phone}" class="action-link">📞 Schedule Call</a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>D Arrow Digital</strong> | Professional Digital Marketing Agency</p>
            <p>This is a high-priority sales lead ready for immediate follow-up.</p>
            <p class="timestamp">📅 ${new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</p>
        </div>
    </div>
</body>
</html>
  `;
}

export function generateCustomServicesInquiryEmail(
    name: string,
    email: string,
    phone: string,
    company: string,
    selectedServices: { id?: string; label: string; price?: number }[],
    budget?: string,
    timeline?: string,
    additionalInfo?: string,
    totalAmount?: number
): string {
  const servicesHTML = selectedServices
        .map((service) => `<li style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px;color:#333;"><span>✓ ${service.label}</span><span style="font-weight:700">${(service.price||0).toLocaleString()} SAR</span></li>`)
    .join('');
    const total = typeof totalAmount === 'number' ? totalAmount : selectedServices.reduce((s, v) => s + (v.price || 0), 0);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #f0f4f8;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 700px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(0, 51, 102, 0.12);
            border-left: 5px solid #d97706;
        }
        .header {
            background: linear-gradient(135deg, #b45309 0%, #d97706 100%);
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 14px;
            opacity: 0.95;
            font-weight: 500;
        }
        .content {
            padding: 35px 30px;
        }
        .section {
            margin-bottom: 28px;
        }
        .section-header {
            display: flex;
            align-items: center;
            margin-bottom: 18px;
            padding-bottom: 12px;
            border-bottom: 2px solid #fef3c7;
        }
        .section-icon {
            font-size: 20px;
            margin-right: 12px;
        }
        .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #b45309;
            margin: 0;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 20px;
        }
        .info-item {
            background-color: #fef9e7;
            padding: 14px;
            border-radius: 8px;
            border-left: 3px solid #d97706;
        }
        .info-label {
            font-size: 11px;
            color: #b45309;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            font-weight: 700;
            margin-bottom: 6px;
            display: block;
        }
        .info-value {
            font-size: 14px;
            color: #1a1a1a;
            font-weight: 600;
            word-break: break-word;
        }
        .info-full {
            grid-column: 1 / -1;
        }
        .services-box {
            background: linear-gradient(135deg, #fef9e7 0%, #fef3c7 100%);
            border-left: 4px solid #d97706;
            padding: 16px;
            border-radius: 8px;
            margin: 16px 0;
        }
        .services-title {
            font-size: 14px;
            font-weight: 700;
            color: #b45309;
            margin: 0 0 12px 0;
        }
        .services-list {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .details-box {
            background-color: #fef9e7;
            padding: 16px;
            border-radius: 8px;
            border-left: 3px solid #d97706;
        }
        .detail-item {
            margin-bottom: 14px;
            padding-bottom: 14px;
            border-bottom: 1px solid #fef3c7;
        }
        .detail-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .detail-label {
            font-size: 11px;
            color: #b45309;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            font-weight: 700;
            margin-bottom: 6px;
            display: block;
        }
        .detail-value {
            font-size: 14px;
            color: #1a1a1a;
            font-weight: 500;
        }
        .action-buttons {
            margin: 30px 0 0 0;
            padding: 20px 0 0 0;
            border-top: 2px solid #fef3c7;
            text-align: center;
        }
        .action-buttons p {
            margin: 0 0 12px 0;
            font-size: 14px;
            color: #666;
            font-weight: 500;
        }
        .action-link {
            display: inline-block;
            margin: 0 10px;
            padding: 10px 20px;
            background-color: #d97706;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 13px;
        }
        .footer {
            background-color: #f0f4f8;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e8eef5;
            font-size: 12px;
            color: #666;
        }
        .footer p {
            margin: 6px 0;
        }
        .timestamp {
            color: #999;
            font-style: italic;
            margin-top: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1><img src="/icon/update/select3.png" alt="User Icon" className="w-7 h-10 pt-2" /> Custom Services Inquiry</h1>
            <p>New custom package request received</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <!-- Contact Information -->
            <div class="section">
                <div class="section-header">
                    <span class="section-icon"><img src="/icon/update/user-cion.png" alt="User Icon" className="w-7 h-10 pt-2" /></span>
                    <h2 class="section-title">Client Information</h2>
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <label class="info-label">Name</label>
                        <div class="info-value">${name}</div>
                    </div>
                    <div class="info-item">
                        <label class="info-label">Company</label>
                        <div class="info-value">${company || 'Not Specified'}</div>
                    </div>
                    <div class="info-item info-full">
                        <label class="info-label">Email Address</label>
                        <div class="info-value"><a href="mailto:${email}" style="color: #d97706; text-decoration: none; font-weight: 600;">${email}</a></div>
                    </div>
                    <div class="info-item info-full">
                        <label class="info-label">Phone Number</label>
                        <div class="info-value"><a href="tel:${phone}" style="color: #d97706; text-decoration: none; font-weight: 600;">${phone}</a></div>
                    </div>
                </div>
            </div>

            <!-- Selected Services -->
            <div class="section">
                <div class="section-header">
                    <span class="section-icon"><img src="/icon/services-icon/analytics_report_approval.png" alt="User Icon" className="w-7 h-9 pt-3" /></span>
                    <h2 class="section-title">Selected Services (${selectedServices.length})</h2>
                </div>
                <div class="services-box">
                    <p class="services-title">Services Requested:</p>
                    <ul class="services-list">
                        ${servicesHTML}
                    </ul>
                    <div style="margin-top:12px;padding-top:12px;border-top:1px solid #fff6e0;font-weight:700;font-size:16px;color:#b45309;display:flex;justify-content:space-between;">
                        <span>Total</span><span>${total.toLocaleString()} SAR</span>
                    </div>
                </div>
                </div>
            </div>

            <!-- Budget & Timeline -->
            <div class="section">
                <div class="section-header">
                    <span class="section-icon">💵</span>
                    <h2 class="section-title">Budget & Timeline</h2>
                </div>
                <div class="details-box">
                    ${budget ? `
                    <div class="detail-item">
                        <label class="detail-label">💰 Budget Range</label>
                        <div class="detail-value">${budget}</div>
                    </div>
                    ` : ''}
                    
                    ${timeline ? `
                    <div class="detail-item">
                        <label class="detail-label">⏱️ Project Timeline</label>
                        <div class="detail-value">${timeline}</div>
                    </div>
                    ` : ''}
                </div>
            </div>

            <!-- Additional Information -->
            ${additionalInfo ? `
            <div class="section">
                <div class="section-header">
                    <span class="section-icon"><img src="/icon/services-icon/analytics_report_approval.png" alt="User Icon" className="w-7 h-10 pt-2" /></span>
                    <h2 class="section-title">Project Requirements</h2>
                </div>
                <div class="info-item info-full" style="background-color: #fef9e7; padding: 16px; border-left: 3px solid #d97706;">
                    <div style="font-size: 14px; color: #333; line-height: 1.8; white-space: pre-wrap; word-wrap: break-word;">${additionalInfo.replace(/\n/g, '<br/>')}</div>
                </div>
            </div>
            ` : ''}

            <!-- Action Buttons -->
            <div class="action-buttons">
                <p>⏰ High-priority custom inquiry - Respond within 24 hours for best results</p>
                <a href="mailto:${email}?subject=Custom Package Quote from D Arrow Digital" class="action-link">📧 Send Quote</a>
                <a href="tel:${phone}" class="action-link">📞 Schedule Call</a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>D Arrow Digital</strong> | Professional Digital Marketing & Real Estate Marketing Services</p>
            <p>This is a custom package inquiry ready for personalized follow-up.</p>
            <p class="timestamp">📅 ${new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</p>
        </div>
    </div>

    
</body>
</html>
  `;
}
