# 🧪 Testing & Deployment Guide

## Quick Start Commands

### 1. Verify Build
```bash
cd "c:\Users\yusuf\OneDrive\Desktop\digital marketing-1\main"
npm run build
# Expected: "✓ Compiled successfully in 3.8s"
```

### 2. Start Development Server
```bash
npm run dev
# Visit: http://localhost:3000
```

### 3. Start Production Server
```bash
npm run start
# More representative of real performance
```

---

## Performance Testing Checklist

### Chrome DevTools
1. **Open DevTools**: F12
2. **Performance Tab**:
   - Click Record
   - Reload page
   - Stop after 5 seconds
   - Check metrics:
     - FCP (blue): Should be <1s
     - LCP (red): Should be <2.5s  
     - TBT: Should be <200ms

### Lighthouse
1. **DevTools → Lighthouse**
2. **Settings**: Desktop + Fast 3G
3. **Generate Report**
4. **Expected Scores**:
   - Performance: 90+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+

### Mobile Testing
1. **DevTools → Device Toolbar** (Ctrl+Shift+M)
2. **Select**: iPhone 12
3. **Network**: Slow 4G
4. **Test LCP**: Should still be <3s

---

## Real-World Testing

### Test on Actual Devices
```bash
# Get your local IP
ipconfig | findstr "IPv4"

# Then visit from mobile:
# http://[YOUR-IP]:3000
```

### Test Network Conditions
- Chrome: DevTools → Network → Throttling
- Test with:
  - Fast 3G (realistic for most users)
  - Slow 4G (worst case)
  - WiFi (best case)

---

## Deployment

### To Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### To Netlify
```bash
# Build first
npm run build

# Netlify will detect Next.js automatically on push
git add .
git commit -m "Performance optimization complete"
git push
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Expected Results After Deployment

### Metrics Check (Using Lighthouse in Prod)
| Metric | Before | After | Status |
|--------|--------|-------|--------|
| Perf Score | 40-50 | 90+ | ✅ |
| LCP | 5.0s | 2.5s | ✅ |
| TBT | 1050ms | 150ms | ✅ |
| CLS | 0.24 | 0.08 | ✅ |

### Monitor in Production

#### Google Analytics 4
1. Set up Web Vitals tracking
2. Create dashboard for Core Web Vitals
3. Monitor alerts for degradation

#### Sentry
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.captureException(error);
Sentry.captureMessage("Performance degraded", "warning");
```

---

## Troubleshooting

### Issue: Build fails
**Solution**:
```bash
rm -r node_modules package-lock.json
rm -r .next
npm install
npm run build
```

### Issue: High LCP still
**Check**:
- Network tab: Is header image loading first?
- Performance tab: Are animations deferred?
- DevTools: Is main thread clear before 1.5s?

### Issue: Layout shifts after video loads
**Check**:
- Video has fixed aspect ratio
- Hero section height is locked
- No content repositioning on video load

---

## Monitoring Commands

### Check Bundle Size
```bash
npm run analyze
# Shows what's in your JavaScript bundle
```

### Check Performance in Prod
```bash
# Visit production URL with Performance API
# DevTools Console:
performance.getEntriesByType("navigation")[0]
```

---

## Optimization Tips for Future Improvements

### 1. Consider Image Compression
```bash
# Use tools like Sharp to pre-compress images
npm install sharp
```

### 2. Add Service Worker
```javascript
// For offline support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

### 3. Prefetch Important Routes
```tsx
import Link from 'next/link';
<Link href="/contact" prefetch={true}>Contact</Link>
```

### 4. Monitor Real User Metrics
```bash
npm install web-vitals
```

---

## Success Indicators

✅ **You'll Know It's Working When**:
- Pages load before animations start
- No janky movements during initial render
- Main thread always < 50ms busy
- Lighthouse scores 90+
- Mobile users report "instant" loads
- Google Search Console shows better crawl efficiency

---

## Support

If you see issues:
1. Check error console (F12 → Console tab)
2. Check performance tab for TBT spikes
3. Verify images are loading with `priority` flag
4. Ensure deferred animations start after 1.5s

---

Generated: 2026-03-24
Performance Optimization Complete ✅
