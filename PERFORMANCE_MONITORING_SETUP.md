# 📊 Performance Monitoring & Analytics Setup - D Arrow Digital

## Quick Setup Checklist

- [ ] Google Search Console connected
- [ ] Google Analytics 4 installed  
- [ ] Meta Pixel installed
- [ ] Performance monitoring dashboard created
- [ ] Scheduled reporting configured

---

## 1. GOOGLE SEARCH CONSOLE SETUP

### Purpose:
- Monitor how Google sees your website
- Track keyword rankings
- Monitor indexing issues
- Analyze search traffic

### Setup:

**Step 1: Verify Website Ownership**
```
1. Go to: https://search.google.com/search-console
2. Click "Start now"
3. Select property type: "URL prefix"
4. Enter: https://d-arrow.com
5. Choose verification method:
   - HTML file upload (easiest)
   - HTML tag (for Next.js)
   - Domain name provider
6. Complete verification
```

**Step 2: Submit Sitemap**
```
1. In GSC, go to "Sitemaps"
2. Click "Add/test sitemap"
3. Enter: https://d-arrow.com/sitemap.xml
4. Submit
5. Verify via Next.js sitemap generation:
   - File: app/sitemap.ts (should already exist)
```

**Step 3: Monitor Key Metrics**
```
Check Weekly:
- Coverage: All indexed pages listed
- Enhancements: Mobile usability, Rich results
- Performance: Click-through rate, impressions
- Links: Top linking sites

Check Monthly:
- Organic search data trends
- New keyword rankings
- Index coverage issues
- Manual actions (if any)
```

---

## 2. GOOGLE ANALYTICS 4 SETUP

### Install GA4:

**Option A: Using @next/third-parties (Recommended)**

1. Install package:
```bash
npm install @next/third-parties
```

2. Add to app/layout.tsx:
```tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

3. Get your GA4 ID:
   - Go to: https://analytics.google.com
   - Create new property "D Arrow Digital"
   - Get Measurement ID: G-XXXXXXXXXX

**Option B: Using gtag (Legacy)**

```tsx
<script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  strategy="afterInteractive"
/>
<script
  id="google-analytics"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    `,
  }}
/>
```

### GA4 Goals to Track:

Set up these conversion goals in GA4:

1. **Contact Form Submission**
   - Event: form_submit
   - Trigger: User completes contact form
   - Value: $50 (estimated)

2. **Pricing Inquiry**
   - Event: pricing_inquiry
   - Trigger: User clicks "Get Quote"
   - Value: $100 (estimated)

3. **Service Page Visit**
   - Event: service_view
   - Trigger: User visits any service page
   - Value: $10 (estimated)

4. **Chat Initiated**
   - Event: chat_start
   - Trigger: User opens chatbot
   - Value: $5 (estimated)

```javascript
// Example: Track form submission in app/api/contact/route.ts
gtag('event', 'form_submit', {
  'event_category': 'Contact',
  'event_label': 'Contact Form',
  'value': 1
});

// Track pricing inquiry
gtag('event', 'pricing_inquiry', {
  'event_category': 'Pricing',
  'event_label': 'Pricing - Get Quote',
  'value': 1
});
```

### GA4 Dashboard Setup:

Create custom report:
1. Organic traffic → Conversions
2. Top landing pages → Bounce rate
3. Traffic by device (mobile vs desktop)
4. Conversion funnel analysis

---

## 3. META PIXEL (FACEBOOK PIXEL) SETUP

### Install Meta Pixel:

**Create: components/MetaPixel.tsx**

```tsx
'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function MetaPixel() {
  useEffect(() => {
    // Facebook Pixel initialization
    (window as any).fbq('init', 'YOUR_PIXEL_ID');
    (window as any).fbq('track', 'PageView');
  }, []);

  return (
    <>
      <Script
        src="https://connect.facebook.net/en_US/fbevents.js"
        strategy="afterInteractive"
      />
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            fbq('init', 'YOUR_PIXEL_ID');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
    </>
  );
}
```

**Add to app/layout.tsx:**
```tsx
import MetaPixel from '@/components/MetaPixel';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MetaPixel />
        {children}
      </body>
    </html>
  )
}
```

### Meta Pixel Events to Track:

```javascript
// Lead event (when contact form submitted)
fbq('track', 'Lead');

// View Content (service page visited)
fbq('track', 'ViewContent', {
  content_name: 'Service Name',
  content_type: 'service',
  value: 100,
  currency: 'SAR'
});

// Complete Purchase (pricing inquiry)
fbq('track', 'Purchase', {
  value: 100,
  currency: 'SAR'
});
```

---

## 4. PERFORMANCE METRICS TO TRACK

### Weekly Dashboard (in Google Analytics 4):

| Metric | Target | Current |
|--------|--------|---------|
| **Organic Sessions** | > 100 | [Check] |
| **Bounce Rate** | < 50% | [Check] |
| **Avg. Session Duration** | > 2 min | [Check] |
| **Conversion Rate** | > 2% | [Check] |
| **Pages/Session** | > 3 | [Check] |

### Core Web Vitals (in PageSpeed Insights):

| Metric | Target | Tool |
|--------|--------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | PageSpeed Insights |
| **FID** (First Input Delay) | < 100ms | PageSpeed Insights |
| **CLS** (Cumulative Layout Shift) | < 0.1 | PageSpeed Insights |

### SEO Metrics (in Google Search Console):

| Metric | Target | Frequency |
|--------|--------|-----------|
| **Average CTR** | > 5% | Weekly |
| **Average Position** | Top 20 for keywords | Monthly |
| **Impressions** | Growing | Weekly |
| **Index Coverage** | 100% | Daily |

---

## 5. MONTHLY REPORTING TEMPLATE

### Report: March 2026

**1. Organic Traffic**
```
Sessions: ___ (vs. last month: +/- _%)
Users: ___
Pageviews: ___
Bounce Rate: ___%
Avg Session Duration: __ min
```

**2. Keyword Performance**
```
New Keywords Ranking (Top 10): ___
Keywords in Position 11-20: ___
Keywords in Position 21-50: ___
Traffic from Organic Search: $__ (estimated value)
```

**3. Backlinks & Link Building**
```
New Backlinks: ___
Average DA of New Links: __
Referring Domains: ___
Top Referring Domains:
  1. ___
  2. ___
  3. ___
```

**4. Conversions**
```
Total Conversions: ___
Conversion Rate: ___%
Lead Value (Estimated): $___
Top Converting Pages:
  1. ___ (rate: _%)
  2. ___ (rate: _%)
  3. ___ (rate: _%)
```

**5. Technical Performance**
```
Core Web Vitals Score: __ / 100
Mobile Speed: __ / 100
Desktop Speed: __ / 100
Largest Contentful Paint (LCP): __ s
First Input Delay (FID): __ ms
Cumulative Layout Shift (CLS): __
```

**6. Action Items for Next Month**
```
[ ] Action 1: ___
[ ] Action 2: ___
[ ] Action 3: ___
```

---

## 6. TOOLS DASHBOARD SETUP

### Create Master Analytics Dashboard:

**Google Sheets Template:**
```
Sheet 1: Monthly Metrics (updated monthly)
- Date | Sessions | Conversions | Leads | Revenue | CTR | Ranking Position

Sheet 2: Backlink Tracker (updated weekly)
- Date | Source | DA | Status | Anchor Text | nofollow/dofollow

Sheet 3: Keyword Rankings (updated biweekly)
- Keyword | Current Position | Previous Position | Search Volume | Priority

Sheet 4: Content Calendar (updated quarterly)
- Date | Title | Keywords | Link Building | Promotion Plan

Sheet 5: Goals (quarterly review)
- Q1 Goal | Q1 Actual | Q2 Goal | Q2 Actual
```

### Tools to Use:

1. **Google Analytics 4**
   - URL: https://analytics.google.com
   - Update: Check 2x per week
   - Owner: Marketing Manager

2. **Google Search Console**
   - URL: https://search.google.com/search-console
   - Update: Check weekly
   - Owner: Marketing Manager

3. **Ahrefs Site Explorer** (free)
   - URL: https://ahrefs.com
   - Update: Check monthly
   - Owner: SEO Specialist

4. **PageSpeed Insights**
   - URL: https://pagespeed.web.dev
   - Check: Monthly
   - Goal: > 90 score

5. **Google Data Studio** (for reports)
   - Create dashboard from GSC + GA4 data
   - Auto-updates daily
   - Share with stakeholders

---

## 7. AUTOMATED REPORTING

### Setup Email Reports:

**Google Analytics 4 Email Reports:**
1. Go to Admin → Audiences
2. Create custom audience for "High-value visitors"
3. Go to Reports → Manage custom reports
4. Add "Weekly Organic Traffic Report"
5. Schedule delivery: Every Monday 8 AM

**Google Search Console Data Export:**
1. Use Google Sheets add-on: "SEO Stats"
2. Automatically pull GSC data daily
3. Create charts and trends

---

## 8. QUARTERLY BUSINESS REVIEW

### Monthly Check-in (15 min):
- [ ] Review organic sessions trend
- [ ] Check top keywords ranking
- [ ] Monitor bounce rate
- [ ] Validate conversion tracking

### Quarterly Review (1 hour):
- [ ] Analyze quarterly traffic growth
- [ ] Review goal achievement
- [ ] Identify opportunities and gaps
- [ ] Plan next quarter initiatives

### Annual Strategy Review (2 hours):
- [ ] Year-over-year comparison
- [ ] Industry benchmark comparison
- [ ] Update 12-month strategy
- [ ] Set next year goals

---

## 9. PERFORMANCE TARGETS & GOALS

### Year 1 Targets (March 2026 - March 2027):

**Organic Traffic:**
- Month 3: 500 sessions/month
- Month 6: 1,500 sessions/month
- Month 12: 5,000 sessions/month

**Conversion Rate:**
- Baseline: 2%
- Target by Month 6: 3%
- Target by Month 12: 4%

**Keyword Rankings:**
- Month 3: Top 50 for 10 keywords
- Month 6: Top 20 for 20 keywords
- Month 12: Top 10 for 30 keywords

**Backlinks:**
- Q1: 15 backlinks (DA > 30)
- Q2: 15 backlinks
- Q3: 15 backlinks
- Q4: 15 backlinks
- **Total: 60+ backlinks by end of year**

**Revenue Impact:**
- Year 1 Organic Value: $50,000+
- Year 2 Organic Value: $150,000+

---

## 📞 SUPPORT CONTACTS

**For help setting up analytics:**
- Google Analytics Support: https://support.google.com/analytics
- Google Search Console Help: https://support.google.com/webmasters
- Meta Business Help: https://www.facebook.com/business/help

---

**Last Updated:** March 2026
**Status:** ✅ Ready for Implementation
