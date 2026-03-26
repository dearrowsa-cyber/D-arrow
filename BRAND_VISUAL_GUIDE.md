# D Arrow Brand Visual Implementation Guide

## 🎨 Complete Color Reference

### Brand Color Swatches

```
PRIMARY GRADIENT:
┌─────────────────────────────────────────────────┐
│ #FF4D6D  →  #FF6F4F  →  #FF9A3C               │
│ PINK       MID-TONE     ORANGE                 │
└─────────────────────────────────────────────────┘

LIGHT THEME BACKGROUNDS:
┌──────────────┬──────────────┐
│ #F9FAFB      │ #F3F4F6      │
│ PRIMARY      │ SECONDARY    │
│ (Main BG)    │ (Cards/Sec)  │
└──────────────┴──────────────┘

TEXT COLORS:
┌──────────────┬──────────────┐
│ #1F2937      │ #6B7280      │
│ DARK TEXT    │ LIGHT TEXT   │
└──────────────┴──────────────┘
```

---

## 🔤 Typography Examples

### Headlines (Gilroy 800)
**Main Page Title**
```
font-family: 'Gilroy', sans-serif;
font-size: clamp(48px, 8vw, 72px);
font-weight: 800;
color: #1F2937;
line-height: 1.1;
letter-spacing: -0.02em;
```

### Subheadings (Gilroy 700)
**Section Title**
```
font-family: 'Gilroy', sans-serif;
font-size: clamp(32px, 6vw, 48px);
font-weight: 700;
color: #1F2937;
line-height: 1.2;
```

### Body Text (TT Hoves Pro 400)
```
font-family: 'TT Hoves Pro', system-ui, sans-serif;
font-size: 14-16px;
font-weight: 400;
color: #6B7280;
line-height: 1.6;
```

---

## <img src="/icon/update/select3.png" alt="User Icon" className="w-7 h-10 pt-2" /> Component Examples

### Primary CTA Button
```
┌─────────────────────────────────┐
│   Get Started Now →             │
└─────────────────────────────────┘

Background: linear-gradient(135deg, #FF4D6D, #FF6F4F, #FF9A3C)
Color: #FFFFFF
Padding: 12px 32px
Border Radius: 12px
Shadow: 0 10px 30px rgba(255, 77, 109, 0.3)
Hover: Translate Y -2px
```

### Feature Card
```
┌──────────────────────────────┐
│  ✓ Card Title (Gilroy 600)   │
│                              │
│  Card description text goes  │
│  here in TT Hoves Pro 400    │
│                              │
│  [Learn More →]              │
└──────────────────────────────┘

Background: rgba(255, 255, 255, 0.9)
Border: 1px solid rgba(255, 77, 109, 0.15)
Shadow: 0 4px 16px rgba(0, 0, 0, 0.06)
Hover Shadow: 0 12px 32px rgba(255, 77, 109, 0.12)
```

### Featured Card
```
┌──────────────────────────────┐
│  [POPULAR CHOICE]            │
│  ✓ Featured Title            │
│                              │
│  Highlighted package with    │
│  enhanced styling            │
│                              │
│  [Get This Plan →]           │
└──────────────────────────────┘

Scale: 1.02x
Border Color: rgba(255, 77, 109, 0.5)
Box Shadow: 0 0 40px rgba(255, 77, 109, 0.2)
Ribbon: #FF4D6D → #FF9A3C gradient
```

---

## <img src="/icon/services-icon/analytics_report_approval.png" alt="User Icon" className="w-7 h-9 pt-3" /> Brand Color Usage Matrix

### When to Use Each Color

| Color | Use Case | Examples |
|-------|----------|----------|
| **#FF4D6D (Pink)** | Primary actions, main CTA, hover states | Buttons, links, primary accents |
| **#FF9A3C (Orange)** | Secondary actions, gradient accents | Button hover states, accents |
| **#FF6F4F (Mid-tone)** | Gradient transitions | Smoothing between pink and orange |
| **#F9FAFB (Light BG)** | Primary page background | Body pages |
| **#F3F4F6 (Light BG-2)** | Secondary backgrounds | Card backgrounds |
| **#1F2937 (Dark)** | Primary text | Headings, body text on light |
| **#6B7280 (Gray)** | Secondary text | Descriptions, metadata |

---

## 🚨 Critical Implementation Points

### 1. Theme Colors in Code
```css
/* CORRECT ✅ */
background: linear-gradient(135deg, #FF4D6D, #FF9A3C);
color: #1F2937;
border-color: rgba(255, 77, 109, 0.2);

/* WRONG ❌ */
background: linear-gradient(135deg, #7C3AED, #5B21B6); /* Purple - OLD */
color: #000000; /* Pure black - contrast issue */
```

### 2. Font Stack Priority
```css
/* CORRECT ✅ */
font-family: 'Gilroy', 'TT Hoves Pro', system-ui, sans-serif;

/* WRONG ❌ */
font-family: 'IBM Plex Sans'; /* Outdated font */
```

### 3. Button States
```css
/* Default State */
background: linear-gradient(135deg, #FF4D6D 0%, #FF6F4F 50%, #FF9A3C 100%);
box-shadow: 0 10px 30px rgba(255, 77, 109, 0.3);

/* Hover State */
transform: translateY(-2px);
box-shadow: 0 15px 40px rgba(255, 77, 109, 0.4);

/* Active State */
transform: scale(0.98);
```

---

## 🌐 Light Theme Implementation

### Page Background
```css
background: linear-gradient(135deg, var(--light-bg) 0%, var(--light-bg-secondary) 50%, var(--light-bg) 100%);
color: var(--text-dark);
```

### Grid Pattern Overlay
```css
background: 
  linear-gradient(to right, rgba(255, 77, 109, 0.04) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(255, 77, 109, 0.04) 1px, transparent 1px),
  radial-gradient(circle at 20% 50%, rgba(255, 77, 109, 0.08) 0%, transparent 50%),
  radial-gradient(circle at 80% 80%, rgba(255, 154, 60, 0.05) 0%, transparent 50%);
background-size: 50px 50px, 50px 50px, cover, cover;
```

---

## 📱 Responsive Design Breakpoints

### Mobile First Approach
```css
/* Mobile (default) */
h1 { font-size: clamp(32px, 6vw, 48px); }
padding: 16px;

/* Tablet (640px+) */
@media (min-width: 640px) {
  h1 { font-size: 40px; }
  padding: 24px;
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  h1 { font-size: 56px; }
  padding: 32px;
}

/* Large Desktop (1280px+) */
@media (min-width: 1280px) {
  h1 { font-size: 72px; }
  padding: 48px;
}
```

---

## ♿ Accessibility Checklist

- [x] Color contrast ≥ 4.5:1 for WCAG AA
- [x] All interactive elements have focus states
- [x] Focus outlines visible and brand-colored
- [x] Text sizes ≥ 12px (14px for body)
- [x] Line heights ≥ 1.5 for readability
- [x] Sufficient color differentiation (not color-only)
- [x] Semantic HTML structure
- [x] ARIA labels where needed
- [x] RTL support for Arabic content

---

## <img src="/icon/update/select3.png" alt="User Icon" className="w-7 h-10 pt-2" /> Component Status

### ✅ Completed Components
- [x] Header Navigation
- [x] Primary Buttons (CTA)
- [x] Secondary Buttons
- [x] Pricing Cards
- [x] Feature Cards
- [x] Form Elements
- [x] Badges & Pills
- [x] Gradients
- [x] Light Theme Background
- [x] Typography System
- [x] Grid Pattern
- [x] Responsive Layout

### 🔄 In Progress
- [ ] Notion Brand Page (linked documentation)
- [ ] Interactive Component Library
- [ ] Brand Asset Downloads

---

## 📊 Color Palette Console

### RGB Values
```
Pink:   RGB(255, 77, 109)
Orange: RGB(255, 154, 60)
Mid:    RGB(255, 111, 79)
```

### HSL Values
```
Pink:   HSL(347°, 100%, 67%)
Orange: HSL(25°, 100%, 62%)
Mid:    HSL(10°, 100%, 67%)
```

### CMYK Values (Print)
```
Pink:   CMYK(0, 70, 57, 0)
Orange: CMYK(0, 40, 76, 0)
```

---

## 🔗 File References

- **Main Stylesheet:** `app/globals.css`
- **Tailwind Config:** `tailwind.config.ts`
- **Pricing Styles:** `app/pricing/pricing.module.css`
- **Header Component:** `components/Header.tsx`
- **Custom Modal:** `components/CustomServiceModal.tsx`
- **Brand Guidelines:** `D_ARROW_BRAND_GUIDELINES.md` (this file)

---

## ✅ Quality Assurance Checklist

Before deployment, verify:

- [ ] All pink colors are #FF4D6D (not purple or other variations)
- [ ] All orange colors are #FF9A3C
- [ ] Gradient always uses three colors: Pink → Mid → Orange
- [ ] Headlines use Gilroy font
- [ ] Body text uses TT Hoves Pro
- [ ] Light background is #F9FAFB or #F3F4F6
- [ ] Dark text is #1F2937
- [ ] All CTAs have gradient backgrounds
- [ ] Button hover states translate -2px on Y
- [ ] Card shadows match specifications
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] Arabic RTL layout verified
- [ ] Accessibility contrast ratios verified
- [ ] All dependencies installed (Gilroy font)

---

**Last Updated:** February 2026
**Status:** Active & Production-Ready
**Maintainer:** D Arrow Design Team
