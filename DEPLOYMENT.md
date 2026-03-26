# Deployment Guide - D Arrow Digital

## Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Git account
- Vercel account

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Copy `.env.example` to `.env.local` and update with your configuration:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```

The site will be available at `https://www.d-arrow.com/`

### 4. Build for Production
```bash
npm run build
npm start
```

## Vercel Deployment

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add custom services inquiry and SEO improvements"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Click "Import"
5. Configure environment variables:
   - `CONTACT_RECIPIENT`: Your email for inquiries
   - `SMTP_HOST`: Your SMTP server
   - `SMTP_PORT`: SMTP port (usually 587)
   - `SMTP_USER`: SMTP username
   - `SMTP_PASS`: SMTP password
   - `SMTP_FROM`: From email address
   - `NEXT_PUBLIC_SITE_URL`: Your production URL

### Step 3: Deploy
Click "Deploy" and wait for the build to complete.

## Features Implemented

### 1. Custom Services Selection Form
- Two service categories:
  - **Digital Marketing Services** (8 options)
  - **Real Estate Marketing Services** (8 options)
- Clients can select multiple services from both categories
- Real-time service count display
- Service removal via chips/tags

### 2. Email Integration
- Custom email template for service inquiries
- Displays all selected services
- Professional HTML email design
- Includes client contact info, budget, and timeline
- Automatic email delivery on form submission

### 3. SEO Optimization
- Enhanced metadata for pricing page
- OpenGraph tags for social sharing
- Twitter card integration
- Structured data support
- Optimized keywords for Digital Marketing and Real Estate Marketing services

### 4. Production Ready
- Error handling and validation
- Loading states on buttons
- Success/error messaging
- Responsive design
- TypeScript type safety

## API Endpoints

### POST /api/pricing
Handles both standard pricing inquiries and custom services inquiries.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "company": "string",
  "budget": "string (optional)",
  "timeline": "string (optional)",
  "additionalInfo": "string (optional)",
  "selectedServices": ["service1", "service2"], // For custom services
  "isCustomServicesInquiry": true // Set to true for custom services
}
```

**Response:**
```json
{
  "ok": true,
  "preview": "url" // Only in development
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | No | Your production URL |
| `CONTACT_RECIPIENT` | No | Email recipient for inquiries |
| `SMTP_HOST` | No | SMTP server hostname |
| `SMTP_PORT` | No | SMTP port (default: 587) |
| `SMTP_USER` | No | SMTP username |
| `SMTP_PASS` | No | SMTP password |
| `SMTP_FROM` | No | From email address |
| `SMTP_SECURE` | No | Use secure connection (true/false) |
| `SMTP_REJECT_UNAUTHORIZED` | No | Reject unauthorized TLS |

## Email Testing

### Development Mode (No SMTP)
If SMTP is not configured, the app uses Ethereal Email (test service):
- Check terminal for preview URL
- Emails are not actually sent

### Production Mode (With SMTP)
Configure SMTP variables for real email delivery:

**Gmail Example:**
1. Create [App Password](https://myaccount.google.com/apppasswords)
2. Set `SMTP_HOST=smtp.gmail.com`
3. Set `SMTP_PORT=587`
4. Set `SMTP_USER=your-email@gmail.com`
5. Set `SMTP_PASS=your-app-password`

## Troubleshooting

### Build Fails
- Clear cache: `npm run build -- --reset-cache`
- Check Node version: `node --version`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Emails Not Sending
- Verify SMTP credentials
- Check firewall/network settings
- Review server logs in Vercel dashboard
- Ensure sender email is authorized

### Performance Issues
- Check Vercel Analytics
- Optimize images
- Review bundle size: `npm run build -- --analyze`

## File Structure

```
app/
├── pricing/
│   ├── page.tsx           # Pricing page with custom services button
│   └── layout.tsx         # SEO metadata
├── api/
│   └── pricing/
│       └── route.ts       # Pricing inquiry API
└── ...

components/
├── CustomServicesInquiryModal.tsx  # New custom services form
├── PricingInquiryModal.tsx         # Standard pricing inquiry
└── ...
```

## Next Steps

1. Test the application locally
2. Push changes to your GitHub repository
3. Deploy to Vercel
4. Test the pricing page and forms in production
5. Configure email settings for real inquiries
6. Monitor analytics and conversion rates

## Support

For issues or questions:
- Check Next.js docs: https://nextjs.org/docs
- Vercel docs: https://vercel.com/docs
- Create an issue in your GitHub repository
