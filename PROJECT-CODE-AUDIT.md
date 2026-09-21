# Project Code Audit

**Project:** D-Arrow — Digital Marketing Agency Platform
**Repository:** `C:\Users\Khaled\Desktop\D-arrow`
**Audit type:** Complete, evidence-based technical audit (analysis only — no code modified)
**Audit date:** September 21, 2026
**Source inspected:** 220 TypeScript files (~2 MB) + config, Docker, CI/CD, scripts, Prisma schema, and public data files.

---

## 1. Project Overview

D-Arrow is a single Next.js monorepo that bundles **five distinct products** in one codebase:

1. **Corporate marketing site** — homepage, services, pricing, process, why-us, provisions (portfolio), contact, blog, custom-package, privacy/cookies.
2. **Main e-commerce store** (`/store`) — Prisma/PostgreSQL-backed catalog, cart, checkout, and order tracking. Checkout is simulated client-side.
3. **Demo e-commerce store** (`/demo/store`) — a fully client-side simulation (localStorage) that is *itself sold as a product* by the main store, including a fake admin panel.
4. **Real-estate demo** (`/demo/real-estate`) — client-side demo platform with simulated listings, calculators, and an admin panel.
5. **Admin dashboard** (`/admin`) — SEO engine, pricing/pages editors (JSON-file backed), store management, blog management, media, analytics.

The platform is deployed to a VPS (188.68.38.154) via Docker Compose + Portainer, with GitHub Actions CI/CD. The UI is Arabic-first (RTL) with a hand-rolled bilingual toggle, dark luxury theme, Three.js chatbot scene, and a custom Zhipu AI (GLM) chatbot backend with Ollama fallback.

During the build phase the app was deployed at https://d-arrow.com with subdomain rewrites (`proxy.ts`) for `sara.d-arrow.com` and `realestate.d-arrow.com`.

---

## 2. Technology Stack

| Layer | Technology | Notes / evidence |
|---|---|---|
| Framework | Next.js **16.1.1** (App Router) | `package.json`, `next.config.js` |
| Language | TypeScript ~5.x | `tsconfig.json` (`strict: true`) |
| React | React 19.2.3 | honeypot v19 |
| Package manager | npm (package-lock.json) | — |
| Build tool | `next build --webpack` | `package.json` `build` script |
| Rendering | Mainly Client Components; some Server Components + `revalidate` ISR + `force-dynamic` pages; a global 24h `revalidate` in root layout (`app/layout.tsx:23`) | mixed strategy, see §16 |
| Routing | App Router file-based + `proxy.ts` middleware for subdomains (`proxy.ts`) | Next 16 middleware alias |
| State | React Context (`LanguageProvider`, `ThemeProvider`, `CartContext`, `StoreContext`, `RealEstateContext`) + localStorage | See §12 |
| Styling | Tailwind CSS v4, CSS modules, global CSS, inline styles heavily | `tailwind.config.ts`, `postcss.config.mjs` |
| UI libraries | lucide-react, react-icons, framer-motion, react-quill-new, three / @react-three/fiber / drei | — |
| Form handling | Hand-rolled controlled `useState` forms, no form library | See §13 |
| Validation | zod (used **only** in 7 SEO routes); everything else manual | See §13 |
| API communication | Native `fetch` (route handlers). No axios/React Query/SWR | See §8 |
| Authentication | Custom HS256 JWT + hardcoded passwords, token in localStorage | See §14 |
| Authorization | Client-side gate only in `app/admin/layout.tsx` | See §14 |
| Database | PostgreSQL 16 (docker container `d-arrow-postgres`) + Prisma 5.22 | `schema.prisma`, `docker-compose.yml` |
| Backend integration | In-repo Prisma route handlers; external: Zhipu AI (bigmodel.cn), Ollama, Stripe (REST), WhatsApp Cloud + WAHA, Google Search Console (simulated), nodemailer SMTP, n8n (env only) | See §5/§8 |
| Image handling | next/image (unoptimized), `public/uploads`, custom `/api/uploads/[filename]`, sharp in scripts only | See §16 |
| Env variables | 28 referenced vars; `.env` present locally (git-ignored) | See §21 |
| Testing | **None** — zero test files in the whole repo | See §3 |
| Deployment | Dockerfile (multi-stage) + docker-compose + Portainer + GitHub Actions | See §3 |
| PWA | **None real.** An in-app "PWAInstallBanner" is a simulated UI (no manifest, no service worker) | See §7 |
| SEO | Metadata API, `sitemap.ts`, `robots.ts`, JSON-LD hardcoded + DB-driven | See §19 |
| i18n | Hand-rolled `LanguageProvider` dictionary (not a framework), `dir` switching | See §20 |
| RTL/LTR | `lang="ar" dir="rtl"` default; JS toggling; some `dir` props | See §20 |
| Error handling | try/catch in most handlers; many silent swallows; **no Error Boundaries** | See §23 |
| Loading states | Inline `useState` flags; artificial `LoadingScreen` (400 ms) | See §23 |
| Caching | Next cache headers set to `no-cache` globally in `next.config.js`; ISR `revalidate` on some pages | See §16 |

---

## 3. Project Structure

### Top-level layout

```
D-arrow/
├── app/                  # App Router — pages, layouts, and ALL backend (route handlers)
│   ├── (main)/           # Public site (marketing + demos + store + influencer)
│   ├── admin/            # Admin dashboard UI (all client components)
│   └── api/              # 54 route handlers (in-repo backend)
├── components/           # ~60 React components
│   ├── admin/            # Admin-specific components (+ dead duplicate SEO widgets)
│   ├── demo/             # Demo store + real-estate components
│   ├── layout/           # Header/DesktopNav/MobileNav
│   ├── seo/              # SEO admin widgets (duplicated under components/admin/seo)
│   ├── store/            # CartContext (main store)
│   └── util/             # link.tsx
├── lib/                  # prisma singleton, email, whatsapp, SEO, blog fallback, real-estate data
│   ├── blog/             # fallback-posts (seed only)
│   ├── data/             # portfolio.ts, projects-showcase.ts (hardcoded content)
│   ├── real-estate/      # demo data + Prisma queries with fallback
│   └── seo/              # metadata, analyzer, GSC (simulated), schema, sitemap, templates
├── prisma/               # schema.prisma, migrations, seed.js
├── public/               # static assets, uploads, data/*.json (WRITABLE content store)
├── scripts/              # dev utilities (image processing, seeding)
├── types/                # nodemailer.d.ts only
├── utils/                # whatsapp, companyContext, imageProcessor
├── Dockerfile            # multi-stage production build (clones from GitHub)
├── docker-compose.yml    # postgres + app, Portainer-ready
├── proxy.ts              # middleware (subdomain rewrites)
├── .github/workflows/    # deploy.yml (SSH deploy to VPS)
└── misc root artifacts    # live.html, live2.html, live_og.jpg, *.ps1/sh test scripts, Postman collection
```

### Responsibilities & cleanliness of each important folder

| Folder | Purpose | Clean? | Issues |
|---|---|---|---|
| `app/api/**` | Entire backend (route handlers + Prisma access + external calls) | ❌ | No auth on most routes; business logic embedded in route handlers; no service layer; JSON-file-backed admin APIs. |
| `app/(main)/**` | Public pages | ⚠️ | Massive single-file pages (services/[id]: 83KB, store: 58KB, store/[slug]: 65KB, demo/store/checkout: 65KB). Mixed data sources. |
| `app/admin/**` | Admin UI (all `'use client'`) | ⚠️ | Auth is client-side only; inline `<style>` injections; large pages (pages: 41KB). |
| `components/` | Shared UI | ⚠️ | Good separation at top level, but `components/admin/seo/*` duplicates `components/seo/*` (dead duplicates). `LanguageProvider.tsx` is 94KB (a dictionary, not a provider). |
| `components/demo/store/` | Demo store simulator | ⚠️ | `StoreContext.tsx` 706 lines mixing state + persistence + sync; heavy mock/simulated behavior. |
| `components/demo/real-estate/` | Real-estate demo | ⚠️ | localStorage-backed; server props overwritten. |
| `lib/` | Shared server helpers | ✅ | Good centralization for prisma/email; but `lib/real-estate/queries.ts` unused by UI (pages use localStorage context). |
| `lib/data/` | Hardcoded portfolio & showcase content | ✅ | Static marketing content — acceptable as content, but blocks DB-driven editing. |
| `utils/` | Client helper functions | ✅ | Small, focused. |
| `types/` | Custom declarations | ⚠️ | Contains only `nodemailer.d.ts`; almost all domain types are defined inline in pages (duplicated). |
| `public/data/` | **Runtime-writable JSON files** served statically (`pages-content.json`, `pricing-data.json`, `analytics.json`) | ❌ | `admin/pages`, `admin/pricing`, `admin/track` write into `public/` at runtime; on serverless/ephemeral FS changes are lost; on self-host they race. |
| `scripts/` | Dev tooling | ✅ | Sharp-based image tools; not part of runtime. |
| Repository root | — | ❌ | Committed build artifacts: `live.html` (58KB), `live2.html`, `live_og.jpg`, `build-output.log`, `.speed.json` (empty), `.env` (git-ignored, contains real credentials). |

### Identified structural problems

- **Duplicated files:** `components/admin/seo/SeoAnalysisPanel.tsx`, `SeoScoreGauge.tsx`, `SerpPreview.tsx`, `SocialPreview.tsx` have clones in `components/seo/`. The `components/admin/seo/*` ones are imported by **zero** files (dead code).
- **Duplicated logic:** checkout forms duplicated between `/store/checkout` and `/demo/store/checkout`; `SAUDI_CITIES`, payment-method lists, and bank details are copy-pasted; coupon discount logic duplicated between checkout pages, `POST /api/store/orders`, and `/api/store/coupons/validate`.
- **Misplaced files:** `app/(main)/demo/store/demo-store.css` is imported by the **main** `/store/checkout` page (cross-namespace coupling). SQLite (`better-sqlite3` dependency) is declared but unused; `@vercel/blob` declared but unused.
- **Overly large files:** `demo/store/admin/page.tsx` (135KB / 2,567 lines), `services/[id]/page.tsx` (83KB), `store/checkout`(56KB), `store/[slug]`(65KB), `contact/route.ts` (44KB/1,259 lines), `LanguageProvider.tsx` (94KB).
- **Unused folders/files:** `components/admin/seo/*` (dead), `app/api/chat/route_backup.ts` (empty stub with 1 comment line), `app/api/cron/blog.ts` (dead path to disabled schedule route), `lib/seo/google-search-console.ts` real path is a TODO stub (always simulated), `.speed.json` (empty), `live.html`/`live2.html` (build artifacts).
- **Missing layers:** no service/repository layer, no shared API client, no central validation schemas, no global error boundary, no centralized types.
- **Architectural problem — JSON-file "database":** `admin/pages`, `admin/pricing`, `admin/track`, `blog/generate` and `blog/schedule` persist to `public/data/*.json`. This is a filesystem-as-database pattern inside `public/` (publicly readable, non-atomic, ephemeral on serverless).

---

## 4. Architecture

**Request / data flow currently operates on four parallel "backends":**

```
Browser
  ├── Next.js pages (Client Components mostly) 
  │     ├── → in-repo route handlers (app/api/**) → Prisma → PostgreSQL 16 (docker)
  │     ├── → in-repo route handlers → public/data/*.json (filesystem "DB")
  │     ├── → localStorage (demo store, real-estate demo, cart, language, theme, admin token)
  │     └── → external APIs (Zhipu AI, Ollama, Stripe, WhatsApp Cloud/WAHA, nodemailer SMTP, n8n webhook)
```

The app has **no server-side auth layer** and **two of the three "databases" are per-instance client or filesystem storage**, so state is inconsistent across visitors and across deployments.

**Separation of concerns assessment:**

| Concern | Where it lives | Problem |
|---|---|---|
| HTTP layer | Route handlers in `app/api` | Correct location for handlers, but handlers also contain business rules (pricing, discount computation, order numbering, AI prompt logic). |
| Business logic | Route handlers + client components | ✓ duplicated across layers (coupon math in checkout pages AND server route); `demo/store/admin` holds finance/marketing logic client-side. |
| Data access | Route handlers importing `lib/prisma` | Mostly good; but `admin/seo/smart-fix` does `new PrismaClient()` per request instead of the singleton. |
| Auth | `app/api/admin/auth` + client effect in `app/admin/layout.tsx` | Weak, client-only enforcement, hardcoded passwords — see §14. |
| Validation | Only SEO routes (zod); everything else ad-hoc | Inconsistent. |
| Types | Inline in pages | Duplicated everywhere, no central domain types. |

**Strengths:** a genuinely working Prisma store API with real orders/emails/WhatsApp; thoughtful SEO infrastructure (metadata defaults + DB override, sitemap builder, robots editor, schema builder); real AI chat with multi-provider fallback; clean use of `next/font`, lazy loading of heavy 3D components.

**Weaknesses:** no auth/security layer, dual fake/real store systems, filesystem persistence, god components, duplicated validation + types, no tests, and the AI "smart-fix" mechanism auto-overwrites live blog/product content.

---

## 5. Pages & Routes

### 5.1 Complete route inventory

**Public pages (App Router) — all under `app/(main)/`:**

| Page | Route | Server/Client | Revalidate | Data source |
|---|---|---|---|---|
| Home | `/` | Server | 60s ISR | Static + `getSeoMetadata('/')` |
| Services | `/services` | Client | (uses ISR layout) | Static marketing content |
| Service detail | `/services/[id]` | Client | — | Static content (83KB file) |
| Pricing | `/pricing` | Client | — | `DEFAULT_PACKAGES` → `/api/admin/pricing` → `/data/pricing-data.json` |
| Why us | `/why-us` | Server | ISR 60 | Static |
| Process | `/process` | Server | ISR 60 | Static |
| Contact | `/contact` | Client | — | Form → `/api/contact` + WhatsApp redirect |
| Custom package | `/custom-package` | Client | `force-dynamic` layout | Form → `/api/pricing` |
| Projects | `/projects`, `/projects/[category]` | Mixed | ISR 60 | Static (`lib/data/projects-showcase.ts`) |
| Provisions | `/provisions`, `/provisions/[slug]` | Server+Client | ISR 60 | Static data files |
| Blog | `/blog` | Server | `force-dynamic` | `/api/blog/posts` (Prisma) |
| Blog post | `/blog/[id]` | Server | `force-dynamic` | Prisma (by id or slug) |
| Influencer | `/influencer` | Server | — | Static |
| Sara | `/sara` | Server | — | Static (subdomain rewrite via `proxy.ts`) |
| SMM landing | `/lp/social-media` | Client | — | Static |
| Cookies / Privacy | `/cookies`, `/privacy` | Client | — | Translation dictionary static content |
| Store | `/store` | Client | — | `/api/store/products?status=published` |
| Store product | `/store/[slug]` | Client | — | API **ignored**; renders hardcoded `PRODUCTS_DATABASE` |
| Store cart | `/store/cart` | Client | — | localStorage `darrow_cart` |
| Store checkout | `/store/checkout` | Client | — | **Simulated** (no fetch) |
| Store track | `/store/track` | Client | — | `/api/store/orders/track` (real) |
| Demo store | `/demo/store` | Client | — | StoreContext (localStorage) |
| Demo product | `/demo/store/[id]` | Client | — | StoreContext |
| Demo checkout | `/demo/store/checkout` | Client | — | Simulated |
| Demo track | `/demo/store/track` | Client | — | Mocked, hardcoded order + tracking |
| Demo store admin | `/demo/store/admin` | Client | — | StoreContext (in-memory demo) |
| Real estate | `/demo/real-estate` | Client | — | RealEstateContext (localStorage) |
| RE property | `/demo/real-estate/[id]` | Client | — | RealEstateContext |
| RE admin | `/demo/real-estate/admin` | Client | — | RealEstateContext |

**Admin pages (all `'use client'`, protected only client-side):** `/admin`, `/admin/login`, `/admin/posts` (+ new/[id]), `/admin/pages`, `/admin/pricing`, `/admin/media`, `/admin/seo` (+ meta, meta/[id], keywords, keywords/[id], redirects, robots, schema, sitemap), `/admin/store/{products, orders, coupons, reviews}` (+ products/new/[id]).

**API routes (in-repo backend):** see §8 full inventory.

### 5.2 Page table

| Page | Route | Static | Dynamic | API Connected | Mock Data | Auth | Issues |
|---|---|---|---|---|---|---|---|
| Home | `/` | Hero, Stats, sections | SEO metadata | SEO only | No | No | — |
| Services | `/services` | all content | — | No | No | No | 83KB file |
| Service [id] | `/services/[id]` | all content | URL param | No | No | No | God page |
| Pricing | `/pricing` | `DEFAULT_PACKAGES` fallback | JSON fetch | Partial | Yes (fallback) | No | 3-layer data waterfall |
| Why-us/Process | `/why-us`, `/process` | all | — | No | No | No | — |
| Contact | `/contact` | layout | form state | Email (fire&forget) + WhatsApp | No | No | Honeypot ok; email errors swallowed |
| Custom package | `/custom-package` | layout | form state | `/api/pricing` (email) | No | No | — |
| Projects/Provisions | `/projects/*`, `/provisions/*` | `lib/data/*` | route param | No | No | No | Content is hardcoded TS arrays |
| Blog | `/blog` | — | posts | Prisma (public CRUD) | Seed-only | No | API unauthenticated |
| Blog [id] | `/blog/[id]` | — | post | Prisma | — | No | **Unsanitized rich HTML** → stored XSS risk |
| Influencer/Sara/LP | `/influencer`,`/sara`,`/lp/*` | all | — | No | No | No | — |
| Store | `/store` | images map | products | Prisma GET | image fallback | No | List empties on DB error |
| Store [slug] | `/store/[slug]` | **hardcoded PRODUCTS_DATABASE** | — | API fetched but unused | Yes — hardcoded product DB | No | Ignores API; `wa.me/966500000000` fake number; cart price bug |
| Store cart | `/store/cart` | — | localStorage | No | — | No | — |
| Store checkout | `/store/checkout` | payment methods/banks | form | **No** (fake submit) | Yes | No | **No order created in DB; fake success** |
| Store track | `/store/track` | — | order | Prisma real | No | No | requires orderNumber+email |
| Demo store (all) | `/demo/store/*` | niches seed | localStorage | **No** | Yes — fully simulated | No | Whole system is a simulation |
| Demo store admin | `/demo/store/admin` | settings | localStorage | No | Yes | No | God component 2567 lines; fake Google indexing + fake SEO score |
| Real estate (all) | `/demo/real-estate/*` | demo data | localStorage | **No** (APIs unused) | Yes | No | API routes exist but UI uses localStorage |
| Admin all | `/admin/*` | nav | — | Docs the CRUD APIs | some fallbacks | Client-only token | Server APIs open; token in localStorage |

---

## 6. Static vs Dynamic Analysis

| Feature | Classification | Where data comes from | Evidence |
|---|---|---|---|
| Marketing pages content (services, why-us, process, projects, provisions, influencer, sara, lp) | **STATIC** | Hardcoded JSX/TS arrays (`lib/data/portfolio.ts`, `projects-showcase.ts`, component JSX) | No fetch/API in these pages |
| i18n translations | **STATIC** | Inline dictionary in `components/LanguageProvider.tsx` (796 lines) | — |
| Pricing packages | **PARTIALLY CONNECTED** | Falls back: `DEFAULT_PACKAGES` → `/api/admin/pricing` (JSON file) → `/data/pricing-data.json` | `pricing/page.tsx:216-240` |
| Store catalog (list page) | **API CONNECTED** | `GET /api/store/products` (Prisma) | `store/page.tsx` |
| Store product detail | **MOCKED** | Hardcoded `PRODUCTS_DATABASE` in `store/[slug]/page.tsx:71`; API result ignored unless slug missing | Confirmed |
| Store order tracking | **API CONNECTED** | `GET /api/store/orders/track` (Prisma) | `store/track/page.tsx` |
| Store checkout | **MOCKED (fake success)** | `setTimeout` → fake `orderId`, no network, no DB write | `store/checkout/page.tsx` confirmed `setTimeout` + `DEMO_CART` |
| Stripe integration | **BACKEND-EXISTS, UI-UNUSED** | `/api/store/checkout/stripe` real REST call; **no checkout page calls it** | — |
| Demo store storefront/products/cart/checkout/track/admin | **MOCKED** | persisted to localStorage (`darrow_demo_store_*`), BroadcastChannel sync; admin has fake Google ping + fake SEO score | `StoreContext.tsx`, `demo/store/admin/page.tsx` |
| Real-estate demo | **MOCKED (local)** | localStorage keys `re_demo_*`; `lib/real-estate/queries.ts` (Prisma+fallback) **not consumed by UI**; inquiry API exists but form uses localStorage | `RealEstateContext.tsx`, `HomeClient.tsx` |
| Blog listing + detail | **API CONNECTED** | `/api/blog/posts` + Prisma server-side | `blog/page.tsx`, `blog/[id]/page.tsx` |
| Chatbot | **API CONNECTED (real AI)** | `/api/chat`: Ollama (qwen2.5:3b → glm4) → Zhipu GLM → keyword fallback | `chat/route.ts` |
| Contact form | **PARTIALLY CONNECTED** | Email (`/api/contact`) fire-and-forget + WhatsApp redirect + `sendAutoNotification` | `contact/page.tsx:69-84`; email errors swallowed `.catch(console.error)` |
| Pricing/custom inquiries | **API CONNECTED (email)** | `/api/pricing` nodemailer; Ethereal test fallback | — |
| Lead capture (gated blog) | **API CONNECTED** | `/api/leads/capture` → `CapturedLead` Prisma | `ContentGate.tsx` |
| Admin auth | **LOCAL + weak server** | Custom JWT (HS256, hardcoded secret fallbacks), token stored in localStorage | `admin/auth/route.ts`, `admin/layout.tsx` |
| SEO admin | **API CONNECTED** (Prisma) | `/api/admin/seo/**` → Prisma; **no auth on 18/20 routes** | — |
| Pages content editor | **LOCAL (JSON file)** | `/api/admin/pages` reads/writes `public/data/pages-content.json` | — |
| Analytics dashboard | **LOCAL (JSON file)** | `/api/admin/track` (POST body from `ClientLayout`) + `analytics.json` | non-atomic file writes |
| GSC keyword rankings | **MOCKED** | `google-search-console.ts` real path is TODO; always `simulateRankings()` (Math.random) | Confirmed |
| Google indexing ping (demo admin) | **MOCKED** | `setTimeout(1500)` → "HTTP 200 success" — no network | `demo/store/admin/page.tsx:1921-1926` |
| Social proof popups, price alerts, PWA install | **MOCKED** | timers + hardcoded examples | `SocialProofPopup.tsx`, `PriceAlertModal.tsx`, `PWAInstallBanner.tsx` |
| `admin/seo/ai-analysis` | **PARTIALLY CONNECTED** | Real GLM if key present; else 2s wait + a **large hardcoded Arabic mock analysis** returned as `success:true` | — |
| Demo real-estate inquiry form | **MOCKED (local)** | `addInquiry` to localStorage; API route exists but unused; DB failure returns `success:true, demo:true` | — |

---

## 7. Mock Data Analysis

| Feature | Mock Location | What It Simulates | Real Backend Exists? | Needs Replacement? |
|---|---|---|---|---|
| Main store product details | `app/(main)/store/[slug]/page.tsx` `PRODUCTS_DATABASE` | Full product pages (features, FAQs, images) ignoring the API | Yes (Prisma `Product`) | Yes |
| Main store checkout | `store/checkout/page.tsx` | Payment processing, order success, `orderId` | Partially (routes exist: orders, stripe, webhook) | Yes |
| Demo store (entire) | `components/demo/store/*` | Catalog, cart, orders, tracking, themes, pixels, coupons | Yes (store APIs) but never used | Optional (it is a product demo) |
| Demo store admin — Google ping | `demo/store/admin/page.tsx:1921` | "Indexing notification accepted (HTTP 200)" | No | Yes (or label clearly) |
| Demo store admin — SEO score | `demo/store/admin/page.tsx:2356` | Hardcoded "98/100" health + "0.4s (A+)" | No | Yes |
| Demo tracking | `demo/store/track/page.tsx` | Live GPS SVG map, order `SAR-8921`, 4 tracking steps | Yes (orders/track API) | Optional |
| Social proof popups | `SocialProofPopup.tsx` | Fake real-time purchase notifications | No | Optional (marketing gimmick) |
| GSC keyword rankings | `lib/seo/google-search-console.ts` | Random positions/clicks/impressions, then `keywordRanking.upsert` into real DB | No (TODO stub) | **Yes** — currently writes fake data into production DB |
| AI analysis without API key | `api/admin/seo/ai-analysis/route.ts` | 2s delay + hardcoded Arabic analysis | Yes (real path exists) | Yes (return clear failure) |
| Real-estate demo & admin | `components/demo/real-estate/*` | Properties, agents, inquiries in localStorage | Yes (seed + inquiry APIs unused) | Optional (is a demo) |
| PWA install | `PWAInstallBanner.tsx` | Install prompt UI | No (no manifest/SW) | Replace or remove |
| `admin/track` page views | `public/data/analytics.json` | Visitor counts | Partial (fire-and-forget POST) | Yes — race-prone file writes |
| Chat fallback | `api/chat/route.ts` `generateFallbackResponse` | Keyword-based canned answers | Yes (real providers before) | acceptable fallback |
| Ethereal email | `lib/email.ts`, `contact`, `pricing` | Test inbox when SMTP missing | Yes (SMTP real when configured) | acceptable dev fallback |

---

## 8. Backend/API Integration

### 8.1 Everything in one table

| Feature | Endpoint | Method | Frontend File | Backend Connected | Auth | Status | Notes |
|---|---|---|---|---|---|---|---|
| Admin login | `/api/admin/auth` | POST/GET | `app/admin/login/page.tsx` | Yes (custom JWT) | — | Works | Hardcoded passwords ± default secret |
| SEO AI (GLM) | `/api/admin/seo` | POST | `app/admin/seo/page.tsx` | Yes | ❌ | Works | Cost-abuse risk |
| AI analysis | `/api/admin/seo/ai-analysis` | POST | admin | Yes+mock | ❌ | Mixed | mock fallback when no key |
| SEO analyze | `/api/admin/seo/analyze` | POST | admin | Local analyzer | ✅ | Works | only authed SEO route |
| SEO dashboard | `/api/admin/seo/dashboard` | GET | admin | Prisma | ❌ | Works | leaks analytics |
| Keywords CRUD | `/api/admin/seo/keywords`(+`/[id]`) | G/P/D | admin | Prisma | ❌ | Works | PUT/DELETE unauthenticated |
| Keyword analytics | `/api/admin/seo/keywords/analytics` | GET | admin | Prisma | ❌ | **Buggy** | always-true condition keeps wrong "latest" |
| Keyword import | `/api/admin/seo/keywords/import` | POST | `KeywordImportModal` | Prisma | ❌ | **CSV broken** | `req.json()` consumed twice → CSV import always fails |
| Keyword sync (GSC) | `/api/admin/seo/keywords/sync` | POST | admin | Prisma + **simulated GSC** | ❌ | Fake data | writes random rankings to DB |
| SEO meta CRUD | `/api/admin/seo/meta`(+[id]) | G/P/U/D | admin | Prisma | GET/PUT only | Works | **DELETE unauthenticated** |
| Redirects | `/api/admin/seo/redirects`(+[id]) | G/P/U/D | admin | Prisma | ❌ | **Broken UI contract** | GET/POST return raw arrays/objects; page expects `{success}`; DELETE returns 204 → page `.json()` throws |
| Robots | `/api/admin/seo/robots`(+[id]) | G/P/D | admin | Prisma | ❌ | **Broken UI contract** | GET raw array → editor empty; save sends DELETE to route with no DELETE handler |
| Schema | `/api/admin/seo/schema`(+[id]) | G/P/U/D | admin | Prisma | ❌ | **Broken UI contract** | same raw-array mismatch as redirects |
| Smart fix (AI writes to blog/product) | `/api/admin/seo/smart-fix` | POST | admin | Prisma + GLM | ❌ | Risky | `new PrismaClient()` per request; overwrites live content |
| SEO sync (self-fetch site) | `/api/admin/seo/sync` | POST | admin | Prisma + self-http | ❌ | Heavy | fetches every route of own site; unused `fs`/`path` imports |
| SEO templates | `/api/admin/seo/templates` | G/P | admin | Prisma | ❌ | Works | — |
| AI writer | `/api/admin/ai/writer` | POST | `AIWriterAssistant` | GLM | ❌ | Works | unauthenticated AI cost abuse |
| Admin analytics | `/api/admin/analytics` | GET | admin | Prisma + `analytics.json` | ❌ | Works | returns zeros on DB failure |
| Pages content | `/api/admin/pages` | G/PUT | `LanguageProvider` + admin | **JSON file** | ❌ | Works | unauthenticated file mutation |
| Pricing admin | `/api/admin/pricing` | G/PUT | pricing + admin | **JSON file** | ❌ | Works | unauthenticated |
| Track | `/api/admin/track` | POST | `ClientLayout` | **JSON file** | ❌ | Race-prone | non-atomic writes |
| Upload | `/api/admin/upload` | POST | `RichTextEditor` | FS `public/uploads` | ❌ | **Insecure** | allows SVG (stored XSS); no auth |
| Uploads serve | `/api/uploads/[filename]` | GET | blog images | FS | public | Works | path traversal guarded |
| Seed template | `/api/admin/store/seed-template` | POST | admin store | Prisma upsert | ❌ | Works | unauthenticated reseed |
| Blog posts CRUD | `/api/blog/posts` | G/P/U/D | blog pages + admin | Prisma | ❌ | **Insecure** | full public CRUD; PUT mass-assign |
| Blog generate | `/api/blog/generate` | POST | (script/init) | GLM + Prisma + JSON | ❌ | Works | writes to DB + JSON file |
| Blog init | `/api/blog/init` | POST | (cron/admin) | self-fetch | ✅(weak) | Works | fallback secret literal `'secret'` |
| Blog cron/schedule | `/api/blog/cron`,`/schedule` | G/P | — | **disabled stub** | — | Disabled | returns `disabled:true` |
| Chat | `/api/chat` | POST | `ChatBot` | Ollama+GLM+fallback | public | Works | heavy console logs |
| Chat log | `/api/chat-log` | POST | `ChatBot` | SMTP | public | Works | console dump when no SMTP |
| Contact | `/api/contact` | POST | contact/custom modals | SMTP | public | **Validation-less** | HTML/email injection risk; `<br/` tag bug; `<img>` in subject |
| Pricing inquiry | `/api/pricing` | POST | `PricingInquiryModal`, custom modal | SMTP | public | **Validation-less** | `<img>` in subject |
| Leads capture | `/api/leads/capture` | POST | `ContentGate` | Prisma | public | Works | no rate limit/format check |
| WhatsApp notify | `/api/whatsapp-notify` | POST | — | WhatsApp Cloud | ❌ | Works | always `ok:true` even on failure |
| WhatsApp (WAHA webhook) | `/api/whatsapp` | POST | — | WAHA + GLM | ❌ | Insecure | no webhook auth; in-memory convo map |
| Store products | `/api/store/products`(+[id]) | G/P/U/D | store pages + admin | Prisma | ❌ | Works | GET swallows DB errors → false empty; anyone can create |
| Store coupons | `/api/store/coupons`(+validate) | G/P/U/D | admin | Prisma | ❌ | **Insecure** | public full CRUD + code enumeration |
| Store reviews | `/api/store/reviews` | G/P/U/D | store/admin | Prisma | ❌ | Insecure | `?all` exposes unapproved; moderation open |
| Store orders | `/api/store/orders` | G/P/U | (admin; no frontend checkout) | Prisma + email + WhatsApp | ❌ | **Insecure** | GET = all customer PII; PUT mass-update; order-number race |
| Order track | `/api/store/orders/track` | GET | `store/track` | Prisma | public | Works | — |
| Stripe checkout | `/api/store/checkout/stripe` | GET | **no consumer** | Stripe REST | orderId guess | Works-if-configured | no salePrice; no session persist |
| Stripe webhook | `/api/store/checkout/webhook` | POST | **no consumer** | Prisma update | ❌ | **Forgery** | NO signature verification — anyone can mark orders paid |
| RE seed | `/api/demo/real-estate/seed` | POST | not in UI | Prisma upsert | ❌ | works | demo seed |
| RE inquiry | `/api/demo/real-estate/inquiry` | POST | **not in UI** | Prisma | public | **Swallows errors** | DB failure returns success |
| Test email | `/api/test-email` | GET | — | SMTP verify | ❌ | Risky | public diagnostic in prod |
| Test Z-AI | `/api/test-z-ai` | G/P | — | GLM | ❌ | Risky | logs first 20 chars of API key |

### 8.2 API-quality problems (concrete)

- **No error handling / loading:** every admin page fetch shows a spinner but most silently swallow `res.ok` check; e.g., `admin/seo/robots/page.tsx` ignores failed GET and shows empty editor.
- **Hardcoded URLs:** `NEXT_PUBLIC_BASE_URL` fallback `http://localhost:3000` in `stripe/route.ts`; `WAHA_API_URL` default `http://localhost:3000` (points at the app itself — almost certainly misconfigured).
- **Exposed secrets:** default passwords/JWT secret in `admin/auth/route.ts`; fallback `'secret'` in `blog/init/route.ts`; real credentials present in local `.env` (git-ignored).
- **Duplicated API logic:** coupon discount math in three places; email builders duplicated in `contact/route.ts` and re-imported by `pricing/route.ts` (route-handler-to-route-handler import is an unusual coupling).
- **Inconsistent response handling:** some routes return `{success, ...}`, others return raw arrays (redirects/robots/schema) → broken admin UIs.
- **Never used:** `stripe` and `webhook` not consumed; `real-estate` APIs not used; `blog/generate` only via `/init`.
- **Unfinished:** `google-search-console.ts` (TODO), `chat/route_backup.ts` (empty), `cron/blog.ts` (dead).

---

## 9. Data Flow

### Functional flows (complete)

**Store catalog (works):**
```
User → /store → fetch /api/store/products → Prisma Product (PostgreSQL)
     → response → normalizeApiProduct → grid UI
```

**Order tracking (works):**
```
User enters orderNumber+email → /store/track → GET /api/store/orders/track
     → Prisma Order (by number + email) → status chips UI
```

**Blog read (works):**
```
/blog and /blog/[id] → Server Component → Prisma BlogPost → UI (+ generateMetadata)
```

**Chat (works):**
```
User message → ChatBot → POST /api/chat → Ollama → GLM → fallback → reply
     → POST /api/chat-log → SMTP (console when no SMTP)
```

**Contact (partial):**
```
Contact form → POST /api/contact (fire-and-forget, errors swallowed)
            + opens wa.me link (user-initiated)
            + sendAutoNotification via WhatsApp util (utils/whatsapp.ts)
→ success state shown regardless of email result
```

**Admin SEO / store CRUD (works against Prisma):** forms → fetch → route handlers → Prisma → response → toasts.

### Broken / incomplete flows

| Flow | Where it breaks |
|---|---|
| **Checkout → sale** | User completes `/store/checkout` → `setTimeout` fake `orderId` → **never calls** `POST /api/store/orders`. No DB order, no revenue. |
| **Stripe payment** | API route exists and is functional, but no UI invokes it. Webhook accepts forged `paid` payloads. |
| **Store product detail** | API fetched but the page renders hardcoded `PRODUCTS_DATABASE`. Editing a product in admin does NOT reflect on `/store/[slug]` → **config drift between admin and public UI**. |
| **Demo store admin** | All "orders", "coupons", "pixels", "SEO" live in localStorage. Google ping and SEO score are fake. |
| **Real-estate demo** | Server queries exist (`lib/real-estate/queries.ts`) and API endpoints exist (seed/inquiry), but pages consume only `RealEstateContext` (localStorage). |
| **Inquiry form → DB** | RE inquiry API returns `{success:true, demo:true}` on DB error — data may be lost silently. |
| **Reviews** | POST sets `approved:false`; admin can approve via open API. UI in `/store/[slug]` reads from the hardcoded DB object, so approved reviews do not appear on the hardcoded product pages. |
| **Seller "buy now" on demo admin** | Demo store admin does not call store APIs — it is a self-contained simulation. |

---

## 10. Components Audit

### Noteworthy components

| Component | Responsibility | Size | Verdict |
|---|---|---|---|
| `LanguageProvider.tsx` | i18n + site data | 94KB/796 lines | Dictionary-in-provider; not a real i18n solution; `siteData: any` |
| `ClientLayout.tsx` | global chrome, loading, chatbot, analytics tracking | 123 | Clean-ish; posts to `/api/admin/track` silently |
| `ChatBot.tsx` | chat UI | 215 lines | OK; markdown-stripping, heavy `console.log` |
| `StoreContext.tsx` | entire demo-store state + persistence + cross-tab sync | 706 lines | God provider; many responsibilities |
| `CartDrawer.tsx` | demo cart drawer + coupon + free-shipping + installments | 282 | OK but logic-heavy for a UI component |
| `RichTextEditor.tsx` | admin blog editor (Quill) supporting upload | — | OK (uploads→`/api/admin/upload`) |
| `SEO widgets` (`components/seo/*`) | SERP preview, gauge, analysis, forms, etc. | — | Used set is fine; `components/admin/seo/*` duplicates are dead |
| `LazySection.tsx` | under-fold activation | small | Good perf-intent pattern |
| `Hero`, `Stats`, `AboutCompany`, etc. | marketing sections | 100–250 | All static; some motion-heavy |

### Problems

- **God components:** `demo/store/admin/page.tsx` (2,567 lines, 8 tabs, all state, all mock logic); `store/[slug]/page.tsx` (1,305 lines incl. hardcoded product DB); `store/checkout` (824), `demo/store/checkout` (952), `services/[id]/page.tsx` (85KB), `store/page.tsx` (1,240).
- **Duplicated components:** checkout UI duplicated 2×; SEO widgets duplicated 2×; `SAUDI_CITIES`+bank list duplicated 2×; `normalizePricingArray` duplicated in page + pricing admin.
- **Prop drilling:** `Header` passes `lang`/`t` down to `DesktopNav`/`MobileNav` instead of consuming context directly (minor).
- **Business logic in UI:** full payment/coupon simulation lives inside checkout pages; demo admin contains fake SEO/finance logic; `CartDrawer` computes installments.
- **Unnecessary state/effects:** `ThemeProvider` sets state in effect (lint error `react-hooks/set-state-in-effect`); `isMounted` unused; `applyTheme` referenced before its declaration (lint `no-explicit-any`/access-before-declaration in `ThemeProvider.tsx:33`).
- **Accessibility gaps:** click-to-open nav without focus management in `MobileNav` (portal drawer without focus trap/aria); many plain `<button>`/`<img>` without accessible labels in store/demo sections.
- **Naming:** `products` JSON strings called "database" (`PRODUCTS_DATABASE`); `DEMO_CART` misleadingly named as real cart.

---

## 11. TypeScript Audit

- **`any` usage:** extensive. Examples (checked via eslint): `app/api/chat/route.ts` (3 `any`s), `LanguageProvider.tsx` `siteData:any`, `BlogPostClient.tsx` `post: any`, `pricing/page.tsx` `normalizePricingArray` `item: any`, `app/robots.ts` `dbRules: any[]`, `app/sitemap.ts` implicit, many route handlers use `(err as any)?.message`.
- **Missing domain types:** No shared types for Product/Order/Coupon/BlogPost/Property outside Prisma-generated ones; pages redefine partial shapes inline (e.g., `PricingPackage`, `DetailedProduct`, `DemoProperty` via `lib/real-estate/data.ts`).
- **Weak types:** `translations` typed as `Record<string, {en;ar}>` but values may be `string[]` (createTranslationFunction checks `Array.isArray`). `t()` returns `string` but often accepts invalid keys silently (returns the key).
- **Type duplication:** `ThemePreset` union in `LiveThemeDrawer` vs presets in `StoreContext` (drift risk — `cyber-cyan`/`luxury-rose` presets exist in drawer but not in the union).
- **`@ts-expect-error`:** used in `RichTextEditor.tsx` (acceptable but a smell).
- **`strict: true` in tsconfig** ❌ but `next.config.js` sets `typescript.ignoreBuildErrors: true` — **the type checker never blocks a bad build**, which is why all this `any` ships to production. This is a TypeScript-quality concern because errors are ignored during `next build`.
- **response types:** returning `{ ok }` from `contact` but consumers inspect `data.success`; inconsistent success shapes across `route` handlers (see §8.2).
- **Verdict:** below-average TS quality; the type system provides little safety value in the current configuration.

---

## 12. State Management

| State | Storage | Location | Appropriate? |
|---|---|---|---|
| Theme | React context + localStorage `site_theme` | `ThemeProvider` | OK (uses requestIdleCallback) |
| Language | React context + localStorage `site_lang` | `LanguageProvider` | OK, but dict is static |
| Main cart | React context + localStorage `darrow_cart` | `components/store/CartContext.tsx` | OK; not synced with backend (fine for authenticated-digit)* |
| Main currency/lang of render | context | — | — |
| Demo store (products, orders, coupons, pixels, settings, cart, wishlist, abandoned) | React context + localStorage `darrow_demo_store_*` + **BroadcastChannel** | `StoreContext` | Heavy; not backend-synced; a full demo DB in the browser |
| Real-estate demo | React context + localStorage `re_demo_*` | `RealEstateContext` | OK for demo; server data gets overwritten |
| Admin token | **localStorage `admin_token`** | `admin/login`, `admin/layout` | ❌ Security concern (XSS-readable), see §14 |
| Page content / pricing | JSON files in `public/data/` via API | admin pages | ❌ filesystem-as-DB |
| Analytics | JSON file `public/data/analytics.json` | `/api/admin/track` | ❌ race-prone non-atomic |
| SEO per page | Prisma (server) | `getSeoMetadata` | Good, but `noStore()` forces dynamic rendering each request |

*Note: `store/checkout` page does not even use the `CartContext`; it reads a `DEMO_CART` fallback and a local `cart` state — the real cart (localStorage) and the checkout are disconnected (*cart → checkout* data flow is broken).

---

## 13. Forms & Validation

| Form | Location | Validation | Backend | Loading | Success | Issues |
|---|---|---|---|---|---|---|
| Contact | `contact/page.tsx` | Honeypot only; no required-field validation | Email fire&forget + WhatsApp | yes | fake on request | server has no validation → email HTML injection |
| Custom package | `CustomPackageForm`/`CustomServiceModal` | minimal | `/api/pricing` (email) | yes | toast | server unvalidated |
| Pricing inquiry | `PricingInquiryModal` | minimal | `/api/pricing` | yes | toast | server unvalidated |
| Consultation | `ConsultationModal` | minimal | WhatsApp only | yes | toast | — |
| Login | `admin/login/page.tsx` | `required` attr only | real `/api/admin/auth` | yes | real | — |
| Blog edit/new | `admin/posts*` | none visible | real CRUD | yes | toast | no zod; PUT mass-assign |
| SEO meta form | `components/seo/SeoMetaForm.tsx` | frontend scoring | real zod on server (POST) | yes | toast | GET/PUT mismatch on `[id]` (no zod on PUT) |
| Product form | `admin/store/products*` | price required | real | yes | toast | PUT collapses validation errors to 500 |
| Store checkout | `store/checkout/page.tsx` | cosmetic red borders | **none** | fake | fake | no backend |
| Demo checkout | `demo/store/checkout/page.tsx` | cosmetic | **none** | fake | fake | no backend |
| RE inquiry | `HomeClient/DetailClient` | none | **localStorage** | — | fake | API exists unused |
| Optimize | — | — | — | — | — | — |

Consistent problems:
- **zod is used in only the SEO family** (`meta`, `templates`, `redirects`, `robots`, `schema`, `[id]` variants). Contact, pricing, orders, coupons, products, reviews, pages, leads have **no structured validation**.
- **Fake submissions:** both checkouts and the demo RE/admin flows.
- **Inconsistent validation:** e.g., `store/reviews` clamps rating via `Math.min/max` *after* `parseInt` — a `NaN` rating can pass through and 500 on Prisma create.
- **No server-side email format validation** anywhere (leads/capture stores any string).

---

## 14. Authentication & Authorization

**Auth UI exists; real authentication is partial and administratively weak.**

- Login form: `admin/login/page.tsx` → `POST /api/admin/auth` → custom **HS256 JWT** (nan: `iat`/`exp` stored as **milliseconds** — non-standard, fine internally) with **exp = 24h**. Token stored in **localStorage** (XSS-readable; also no refresh/renewal — after 24h you are logged out with a silent redirect).
- **Hardcoded secrets:** `const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'DArrow@2026!'`; `ALLOWED_PASSWORDS = Set['DArrow@2026!','D-Arrow.2026','darrow2026']`; `JWT_SECRET = process.env.JWT_SECRET || 'darrow-admin-secret-key-2026'` — if env is not set, tokens are forgeable by anyone who knows the constant. Evidence in code: `app/api/admin/auth/route.ts:4-11`.
- **Client-only protection:** `app/admin/layout.tsx` gates on `localStorage.admin_token` and verifies once via `GET /api/admin/auth`. All other admin **APIs do not verify** → the gate is cosmetic.
- **No middleware protection:** no `proxy.ts` rule checking `/admin` or `/api/admin`. `robots.ts` disallows `/admin` (SEO-only).
- **Role-based access:** none (single role string `role:'admin'` ignored).
- **Refresh tokens / sessions:** none. Password reset: none. Rate limiting: none.
- **Unauthorized handling:** login returns 401; fetch `.catch` clears token and redirects (ok).
- **Cookie-based sessions:** none.
- **Comparison:** login endpoint itself is real (compares against hardcoded list). Everything downstream of login relies on a client-redirect that is bypassable because the APIs are open. **From a security standpoint, the admin area is effectively open.**

---

## 15. Security

Confirmed issues (with file evidence):

| Severity | Issue | Location |
|---|---|---|
| **CRITICAL** | Stripe webhook has **no signature verification** — any caller can `{orderId, status:'paid'}` and mark orders paid | `app/api/store/checkout/webhook/route.ts` |
| **CRITICAL** | 45+ admin/store/blog APIs are unauthenticated; admin auth is client-side cosmetic | `app/api/admin/**`, `app/api/store/**`, `app/api/blog/**` |
| **CRITICAL** | Hardcoded admin default passwords + JWT secret fallbacks; token forgeable | `app/api/admin/auth/route.ts:4-11` |
| **CRITICAL** | Blog content rendered via `dangerouslySetInnerHTML` with **no sanitization**; blog POST is public → stored XSS on `/blog/[id]` | `components/BlogPostClient.tsx:146` + `app/api/blog/posts/route.ts` |
| **HIGH** | `POST /api/store/orders` GET exposes **all orders incl. customer PII**; PUT mass-updates any order | `app/api/store/orders/route.ts:8-20,137-157` |
| **HIGH** | Coupons: public GET enumerates codes; public PUT/DELETE | `app/api/store/coupons/route.ts` |
| **HIGH** | Upload allows SVG + no auth → stored XSS vector; MIME from filename only; `dangerouslyAllowSVG: true` in Next config | `app/api/admin/upload/route.ts`, `next.config.js:72` |
| **HIGH** | Reviews `?all=true` exposes unapproved comments; moderation open | `app/api/store/reviews/route.ts` |
| **HIGH** | Contact/pricing email routes accept unvalidated HTML input interpolated into HTML emails / email-format not enforced | `app/api/contact/route.ts` |
| **MED** | `blog/init` fallback secret literal `'secret'` | `app/api/blog/init/route.ts` |
| **MED** | Admin JWT stored in localStorage (XSS-readable) | `app/admin/layout.tsx` |
| **MED** | `test-z-ai` logs first 20 chars of the API key; `test-email` public diagnostic in production posture | `app/api/test-z-ai/route.ts`, `app/api/test-email/route.ts` |
| **MED** | WAHA webhook `POST /api/whatsapp` with no webhook auth; in-memory conversation store | `app/api/whatsapp/route.ts` |
| **MED** | `X-XSS-Protection` and part CSP in `public/_headers` — but Next `headers()` in `next.config.js` sends `Cache-Control: no-store` for everything (undermines CDN caching) and **does not set the CSP from `_headers` on docker** (`public/_headers` only applies on Vercel/static). | `public/_headers`, `next.config.js` |
| **MED** | `.env` local file contains real SMTP password, Z-AI key, Neon DB credentials, admin password, JWT secret. It is git-ignored (confirmed `git check-ignore .env`), but the file is real and any leak is fatal; Dockerfile fallback includes `changeme` defaults for `ADMIN_PASSWORD`/`JWT_SECRET` if env unset. | `.env` (local), `docker-compose.yml` |
| **INFO** | `next.config.js` enables `dangerouslyAllowSVG`. | — |

`proxy.ts` and `vercel.json` add no security either.

**No XSS sanitization dependency** (no DOMPurify/sanitize-html) anywhere in the repo.

---

## 16. Performance

- **All route handlers** + SEO metadata use **dynamic/no-store** — no API caching, no React Query cache. `getSeoMetadata` calls `unstable_noStore()` (`lib/seo/metadata.ts:74`) meaning every page also disables ISR caching in practice (page-level `revalidate` is counteracted). Home declares `revalidate = 60`, but the layout `revalidate = 86400` and `noStore` in metadata partially cancel each other — inconsistent caching policy.
- **Global no-cache headers**: `next.config.js` sends `Cache-Control: no-store` for every path — kills browser/CDN caching site-wide.
- `images.unoptimized: true` + heavy next/image usage — no CDN optimization.
- **Client components nearly everywhere:** marketing pages are mostly Client components via `'use client'` though content is static → unnecessary JS.
- **Large client JS:** Three.js chatbot (lazy-loaded with `ssr:false` — good), framer-motion across many components, react-quill (dynamically imported — good).
- **Duplicate requests:** `LanguageProvider` fetches `/api/admin/pages` once per layout; multiple components independently fetch overlapping data.
- **Animation/JS churn:** `SocialProofPopup` timers constant; `HeroServicesCarousel`, `ImageMarquee`, `LogoMarquee` run continuously.
- **Self-fetch during request:** `/api/admin/seo/sync` fetches **every** site route from inside a single request — could deadlock on single-threaded dev / slow production.
- **`new PrismaClient()` per request** in `admin/seo/smart-fix` → pool exhaustion under load.
- **Non-atomic file** `analytics.json` writes under concurrent traffic → lost/duplicated counts.
- **Good practices present:** manual `dynamic()` lazy imports for 3D and below-fold sections; `LazySection`; `next/font`; preloads; reduced LoadingScreen to 400ms.

---

## 17. Responsive/UI

- Tailwind responsive classes used (`sm:`,`md:`,`lg:`, etc.) on most marketing components; mobile nav exists (`MobileNav` portal drawer).
- **Concerning spots:**
  - Admin sidebar/topbar: mobile menu button is hidden at ≥1024px but the whole dashboard relies on wide layout; several inline fixed-width elements (e.g., dropdown `w-[380px]` in header, table-heavy admin SEO pages).
  - `store/[slug]/page.tsx` long content with `max-w-*` inside but `min-h-screen` and large fixed paddings — likely overflowing on very small screens.
  - `demo/store/admin` is 8 tabs plus full-screen editors; no responsive tab behavior besides mobile menu.
  - Demo tracking page uses an inline SVG "GPS map" sized for desktop (`demo/store/track/page.tsx`) — no mobile sizing guard confirmed.
  - `viewport` meta sets `user-scalable=0` (disabled pinch-zoom) — accessibility concern (WCAG 1.4.4).
  - Frequent hardcoded font sizes via inline styles (admin login, etc.) bypass tailwind responsive tiers.
- Comprehensive mobile QA is not evidenced; several screens (admin SEO tables, SERP previews) likely break below ~768px.

---

## 18. Accessibility

- Semantic HTML is partially good (header/nav/main/footer present). But:
  - **No focus management/focus trap** in `MobileNav` drawer or any modal (`ConsultationModal`, `ServiceDetailModal`, `PricingInquiryModal`, drawers). No `aria-modal`, no Escape handling in most modals.
  - **No error boundaries** — a runtime error blank-screens the app.
  - Buttons with icon-only content often lack `aria-label` (theme toggle in admin has `title` only; several demo-store buttons are icon-only).
  - `dangerouslySetInnerHTML` blog content has no `lang` segmentation; images in blog rely on `alt`.
  - `user-scalable=0` blocks zoom.
  - Arabic RTL is default and mostly respected; `dir` toggling is event-driven on `documentElement` (ok).
  - Color contrast cannot be verified from code; several light-on-dark gradient text combos (e.g., `text-transparent` gradient text in Header logo) are risky.
  - `CookieConsent`/`Analytics` handle consent via localStorage — ok.
  - Admin login has labels; most admin forms lack explicit `<label htmlFor>`.

---

## 19. SEO

**Strengths:** rich default metadata + DB-overriding `SeoMeta`; `generateMetadata` on blog/home; `sitemap.ts` (DB-driven); `robots.ts` (DB-driven with default); JSON-LD (Organization, LocalBusiness, WebSite, Article, blog Article) — mostly static but present; canonical + OG + Twitter configured; Chinese-character verification placeholder `YOUR_GOOGLE_VERIFICATION_CODE` in root metadata (`app/layout.tsx:86`).

**Weaknesses:**
- `app/not-found.tsx` renders its own `<html>`/`<body>` (discouraged in App Router; nested into the root layout).
- **Duplicate sitemap risk**: hardcoded routes + DB `SeoMeta` merge; slug encoding via `encodeURI` is imprecise for Arabic routes.
- **Dynamic rendering beats ISR**: `noStore()` everywhere means metadata + pages are frequently regenerated → wasted compute, but good freshness.
- **No structured data for products/pricing** despite Product/Coupon schema existing.
- Demo store/influencer pages lack unique metadata (single generic titles).
- **The `<img>` in an email subject for pricing/custom-service is not SEO but signals copy-paste bugs** — no canonical issues here.
- No hreflang for the ar/en toggle (language toggle flips `dir` rather than serving separate URLs). Minor.

---

## 20. i18n / RTL

- **No i18n framework.** A giant inline dictionary (`LanguageProvider.tsx` translations object) with `t(key)`. Fallback returns the key silently.
- Hardcoded Arabic strings remain across many components/pages **outside the dictionary** (e.g., all admin UI, store pages, demos, chatbot prompts, `blog`, `influencer`, `sara`). English mode will show Arabic in hundreds of places — i18n coverage is partial.
- Two "English" variants: many bilingual pages do ad-hoc `lang === 'ar' ? arabic : english`; dozens of components render only Arabic regardless of `lang`.
- **RTL:** default `dir="rtl"`; `LanguageProvider`/`ClientLayout` mutate `documentElement.dir`. Mixed `dir` attributes on examples. Mirrored icons: some components swap arrows manually (`ArrowLeft/ArrowRight`) — inconsistent.
- **Spacing/typography:** RTL spacing relies on logical Tailwind classes (`pl-*/pr-*`), but occasional `right-0`/`left-0`/`text-left` hardcoded flyouts assume direction (Header dropdown uses `absolute right-0 mt-2 w-[380px]`).
- **Dates/currency:** `toLocaleDateString` with `ar-EG` (Egyptian number formatting); intent with IANA — but no currency formatter (manual `toLocaleString()` + `ر.س`).
- Arabic-Indic digit conversion is implemented globally in `ClientLayout` (input listener) — a creative but heavy-handed global listener; it also hijacks every input on the page (a11y/perf smell as well).

---

## 21. Environment Variables

| Variable | Used where | Client/Server | Required | Purpose | Safe? |
|---|---|---|---|---|---|
| `DATABASE_URL` | `lib/prisma` datasource | server | yes | Postgres connection (Neon in `.env`) | local `.env` git-ignored |
| `ADMIN_PASSWORD` | `api/admin/auth` | server | yes | admin password (fallback constant) | ❌ fallback hardcoded |
| `JWT_SECRET` | `api/admin/auth` | server | yes | token secret (fallback constant) | ❌ fallback hardcoded |
| `SMTP_HOST/PORT/USER/PASS/FROM/SECURE/REJECT_UNAUTHORIZED` | email routes + `lib/email` | server | for real email | SMTP | `.env` has real Gmail app-password |
| `CONTACT_RECIPIENT` | contact, pricing, chat-log | server | no | recipient emails (hardcoded defaults) | ok |
| `ZAI_API_KEY` | chat, seo, writer, blog, whatsapp, test-z-ai | server | for AI | Zhipu GLM | `.env` real key |
| `ZAI_API_BASE` / `ZAI_MODEL` | blog/generate, chat | server | no | overrides | ok |
| `OLLAMA_BASE_URL` | `api/chat` | server | no | default `http://ollama:11434` | ok |
| `BLOG_API_SECRET_KEY` | `api/blog/init` | server | no | **fallback literal `'secret'`** | ❌ |
| `STRIPE_SECRET_KEY` | `api/store/checkout/stripe` | server | for Stripe | checkout | ok (no fallback value logged) |
| `WAHA_API_URL` / `WAHA_SESSION` | `api/whatsapp` | server | no | default `http://localhost:3000` (suspect) | ❌ default points at self |
| `WHATSAPP_PHONE_NUMBER_ID` / `WHATSAPP_ACCESS_TOKEN` / `WHATSAPP_RECIPIENT_NUMBER` | `lib/whatsapp-api` | server | for WhatsApp | Cloud API | `.env` missing → order notifications silently fail |
| `GOOGLE_CLIENT_EMAIL` / `GOOGLE_PRIVATE_KEY` | `lib/seo/google-search-console` | server | for GSC | **never actually used (TODO)** | n/a |
| `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_BASE_URL` | blogs, init, stripe | client+server | no | localhost fallbacks | ❌ fallback to `http://localhost:3000` in prod |
| `NEXT_PUBLIC_CONTACT_API_URL` | `contact/page.tsx` | client | no | override contact API | ok |
| `NEXT_PUBLIC_CHATBOT_ENABLED` | docker-compose only (not in code grep) | — | no | toggle | defined but unused in code — **dead** |
| `RE_SUBDOMAIN` | `proxy.ts` | server | no | subdomain | defined but unused in .env |
| `N8N_*`, `POSTGRES_*`, `DATABASE_URL_UNPOOLED`, `PG*`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `OPENAI/ANTHROPIC/GOOGLE/OPENROUTER_API_KEY`, `CRON_SECRET`, `OLLAMA` | docker-compose pass-through | server | no | **defined in compose, never referenced in code** | unused |

Missing/inconsistent: `POSTGRES_URL` used by stock Vercel templates but the app only reads `DATABASE_URL`; `STRIPE_WEBHOOK_SECRET`/`STRIPE_PUBLISHABLE_KEY` are passed but **never used** (webhook has no verification). `NEXT_PUBLIC_API_URL` is referenced by blog/init (server). `.env.example` does **not exist** although the README instructs `cp .env.example .env`.

---

## 22. Dependencies

| Package | Status | Notes |
|---|---|---|
| next 16.1.1, react 19.2.3 | core | — |
| prisma / @prisma/client 5.22 | core | — |
| zod 4.3.6 | underused | only 7 SEO routes |
| node‑mailer | core | emails |
| tailwindcss 4 + @tailwindcss/postcss + typography | core | — |
| framer-motion 12 | used 18 files | anim |
| three + @react-three/* | used 1-2 files | ChatBotScene only |
| lucide-react | used widely | — |
| react-icons | 2 files | could be removed (duplicates lucide) |
| react-quill-new | admin editor | — |
| sharp | scripts only | dev tooling (fine) |
| **better-sqlite3** | **not imported anywhere** in app/scripts | ❌ remove |
| **@vercel/blob** | **not imported anywhere** | ❌ remove (uploads use FS) |
| @next/bundle-analyzer 13 (dev) | with next 16 — version skew | verify compatibility |
| cross-env | analyze script | ok |
| @types/* | dev | ok |

No overlap beyond react-icons vs lucide-react. No heavy UI kit. The real cost-centers: three/fiber/drei bundle weight (lazy-loaded) and framer-motion everywhere.

---

## 23. Error Handling

- **Swallowing failures as success:**
  - `POST /api/store/orders` —WhatsApp/email errors caught and ignored (notifications silently lost) (`route.ts:113,125`).
  - `api/whatsapp-notify` always returns `ok:true` even when send() fails (`route.ts` confirmed).
  - `api/demo/real-estate/inquiry` returns `{success:true, demo:true}` on DB error.
  - `api/store/products` GET catches DB errors → returns `success:true, products:[]` (false empty list).
  - `api/store/coupons/*` and reviews/`[id]` catch blocks do not log.
- **Missing 400 vs 500 distinction:** `store/products/[id]` PUT collapses validation errors into generic 500.
- **No global error boundary / not-found UI polish** — `app/error.tsx` and `app/global-error.tsx` absent; `not-found.tsx` duplicates html/body.
- **Loading states:** most admin forms show spinners; marketing components are static. Empty states exist for cart & blog; store list has no skeleton/empty fallback (renders empty grid); demo track always renders mocks (no empty state).
- **Network errors:** chat returns a canned fallback on total failure (acceptable); contact hides email failure from the user.
- **Frontend fetch error handling** is frequently `.catch(console.error)` or `.catch(()=>{})` (analytics track, contact backup).

---

## 24. CRUD Completeness

| Entity | Create | Read | Update | Delete | Backend | Database | Status |
|---|---|---|---|---|---|---|---|
| Products | ✅ API+admin | ✅ public store list (API) | ✅ API+admin | ✅ API | Yes (Prisma) | Yes | **Detail page ignores API (hardcoded).** DELETE/POST unauthenticated. |
| Orders | ⚠️ API exists; **no UI calls it** | ✅ admin + track | ⚠️ PUT unauthenticated | ❌ none | Yes | Yes | Checkout never creates orders. |
| Coupons | ✅ API+admin | ✅ | ✅ | ✅ | Yes | Yes | public CRUD |
| Reviews | ✅ API (approved false) | ⚠️ public blocked; admin `?all` | ✅ approve | ✅ | Yes | Yes | moderation open |
| Blog posts | ✅ API+admin | ✅ public | ✅ | ✅ | Yes | Yes | public CRUD |
| SEO meta/redirects/robots/schema/keywords | ✅ | ✅ | ✅ | ✅ | Yes | Yes | auth/contract bugs (see §8) |
| Pages content | Admin only | ✅ public via API | ✅ | ❌ no delete | JSON file | **public/data/pages-content.json** | FS-backed; unauthenticated PUT |
| Pricing | ✅ | ✅ | ✅ | ❌ no delete | JSON file | same | same |
| Real-estate props | Demo admin (localStorage) | Demo (localStorage) | Demo | Demo | APIs exist unused | Yes (if seeded) | Demo-only |
| Demo-store products/orders/etc | Demo admin (localStorage) | Demo | Demo | Demo | — | — | Simulation |

---

## 25. Feature Completeness

| Feature | UI | Logic | API | Backend | Database | Complete? | Notes |
|---|---|---|---|---|---|---|---|
| Marketing pages | ✅ | ✅ | — | — | — | ✅ | static |
| Contact inquiries | ✅ | ✅ | ✅ | SMTP | — | ⚠️ | errors hidden; no validation |
| Pricing editor | ✅ | ✅ | ✅ | JSON file | — | ⚠️ | FS-backed |
| Chatbot | ✅ | ✅ | ✅ | AI models | — | ✅ | real multi-provider |
| AI blog generator | ⚠️ (admin-only trigger) | ✅ | ✅ | ✅ | ✅ | ⚠️ | auto-publish disabled; manual init |
| Blog (public) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | XSS risk |
| Store catalog | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | list OK |
| Store product detail | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | hardcoded DB; ignores API |
| Cart | ✅ | ✅ | — | — | — | ⚠️ | local only; not used by checkout |
| Checkout | ✅ | ❌ fake | ❌ | ✅ exists | ✅ exists | ❌ | simulated; no order |
| Payment (Stripe) | ❌ | ✅ API | ✅ | ✅ | — | ❌ | route unused; webhook forgeable |
| Order tracking | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Coupons | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | public CRUD; min-order bypass |
| Reviews | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | approval open |
| SEO engine (admin) | ✅ | ✅ | ✅ | Prisma | ✅ | ⚠️ | 7 contract bugs + fake GSC + open auth |
| Analytics (visitor) | ⚠️ | ✅ | ✅ | JSON file | — | ⚠️ | race-prone, non-atomic |
| Media manager | ✅ | ✅ | ✅ | FS | — | ⚠️ | SVG upload + no auth |
| Real-estate demo | ✅ | ✅ | ⚠️ unused APIs | ✅ | ✅ | ⚠️ | UI decoupled from DB |
| Influencer/sara | ✅ | ✅ | — | — | — | ✅ | static |
| PWA | ❌ fake | — | — | — | — | ❌ | simulation only |
| i18n EN | ⚠️ | ⚠️ | — | — | — | ⚠️ | dictionary partial; most UI Arabic-only |

---

## 26. Code Smells

- **Duplicated logic:** coupon discount ×3; checkout UI ×2; bank/payment lists ×2; SEO widgets ×2; pricing normalizer ×2; `SAUDI_CITIES` ×2.
- **Large files / god components:** `demo/store/admin/page.tsx` 2567 lines; `store/[slug]` 1305; `demo/store/checkout` 952; `store/checkout` 824; `StoreContext` 706; `store/page` 1240; `services/[id]` ~1200; `LanguageProvider` 796.
- **Long functions:** `handlePaymentSubmit`/step machines inside checkout pages; `AdminDashboardContent` renders 8 tabs in one function.
- **Deep nesting:** `pricing/page.tsx` has 3-level `.then().then().catch()` waterfall; `real-estate/HomeClient` multi-condition render.
- **Magic values:** colors (`#FF4D6D`, `#FF9A3C`, `#10B981`), tariffs (3,500/7,500/9,000 in chatbot prompts; 1,800/4,500/8,000/15,000 in pricing constants), timers (400/800/1500/2200/3000 ms) scattered.
- **Inconsistent naming:** `DE_arrow`, `D-Arrow`, `d_arrow`, `d-arrow` volume; `STORING_LABEL` agreements; `PRODUCTS_DATABASE` misuses "database".
- **Dead code:** `components/admin/seo/*` (unused), `chat/route_backup.ts`, `app/api/cron/blog.ts`, `.speed.json`, `live.html/live2.html/live_og.jpg`, `isMounted` in ThemeProvider.
- **Commented-out code:** `google-search-console.ts` (commented "example implementation"), `schema.prisma` migrations rely on commit history; `demo/store/admin` has commented sections; `store/index` CSS `overflow-x-clip` comments.
- **Mixed responsibilities:** `LanguageProvider` = i18n + site-data fetch + DOM mutations; `ClientLayout` = layout + loading screen + analytics tracking + arabic-digit converter; checkout pages = form + validation + payment-simulation + order state machine + banks UI.
- **Unnecessary abstractions:** `normalizePricingArray` is duplicated instead of shared; `components/util/link.tsx` tiny wrapper (verify — likely trivial).
- **Effects misuse:** `ThemeProvider` setState in effect; `CookieConsent` setState in effect (lint `react-hooks/set-state-in-effect`).
- **Access-before-declaration:** `applyTheme` referenced in `useEffect` before its const declaration (`ThemeProvider.tsx:33`).
- **Hardcoded values:** fake WhatsApp number `966500000000` in `store/[slug]`, `966500466349` defaults in whatsapp utils (real number, but hardcoded in multiple places), product prices inside `PRODUCTS_DATABASE`.

---

## 27. Technical Debt

| # | Issue | Location | Severity | Why it matters | Suggested fix | Complexity |
|---|---|---|---|---|---|---|
| 1 | Stripe webhook forgeable | `api/store/checkout/webhook/route.ts` | **CRITICAL** | Anyone marks orders paid | Verify `stripe-signature` with `STRIPE_WEBHOOK_SECRET` | Low |
| 2 | Unauthenticated admin/store/blog APIs | `app/api/admin,**/app/api/store,**/app/api/blog/**` | **CRITICAL** | PII leaks + content tampering + cost abuse | Middleware token check on `/api/admin`, `/api/store` mutations | Medium |
| 3 | Hardcoded admin passwords + JWT fallback | `api/admin/auth/route.ts` | **CRITICAL** | Forgeable tokens | Require env vars; fail closed in prod | Low |
| 4 | Stored XSS via blog HTML | `BlogPostClient.tsx:146` + public blog POST | **CRITICAL** | Malicious `<script>` executes | DOMPurify on content + sanitize on write | Medium |
| 5 | Checkout never persists orders | `store/checkout/page.tsx`, `demo/store/checkout` | **HIGH** | No sales tracked; Stripe/Webhook code dead | Wire checkout to `POST /api/store/orders` + Stripe session | Medium |
| 6 | Store detail ignores API | `store/[slug]/page.tsx` | **HIGH** | Admin edits invisible; hardcoded prices | Render from API with fallback only | Medium |
| 7 | GET orders = all PII, PUT arbitrary | `api/store/orders/route.ts` | **HIGH** | Data breach | Admin-auth on GET/PUT; scope update whitelist | Low |
| 8 | Fake GSC data fed into DB | `lib/seo/google-search-console.ts` + `keywords/sync` | **HIGH** | Fake SEO analytics presented as real | Implement real GSC or remove endpoint | Medium |
| 9 | Redirects/robots/schema UI broken (7 contract bugs) | `components/seo/*` vs `routes.ts` | **HIGH** | Admin cannot manage redirects/robots/schema | Align response contracts | Low |
| 10 | CSV keyword import broken | `api/admin/seo/keywords/import` | **MED** | Feature dead | Read body once | Low |
| 11 | JSON-file "databases" in `public/` | `admin/pages`, `admin/pricing`, `admin/track`, blog generate/schedule | **HIGH** | Publicly writable, non-atomic, ephemeral | Migrate to Prisma tables | Medium |
| 12 | Upload: SVG + no auth | `api/admin/upload` | **HIGH** | Stored XSS; abuse | Reject SVG, auth, verify MIME from content | Low |
| 13 | `admin/seo/analytics` always-true condition | `keywords/analytics/route.ts` | **MED** | Wrong "latest" ranking stats | Fix date comparison | Low |
| 14 | `new PrismaClient()` per request | `admin/seo/smart-fix` | **MED** | Pool exhaustion | Use `lib/prisma` | Low |
| 15 | `admin/seo/sync` self-fetches whole site | `sync/route.ts` | **MED** | Slow/deadlock | Analyze from DB instead | Medium |
| 16 | Order-number race | `api/store/orders` `count+1001` | **MED** | Collision 500s under concurrency | Use dedicated counter/random | Low |
| 17 | Contact/pricing email HTML subject bug + `<br/` tag | `api/contact/route.ts` | **MED** | Broken emails; injection | Fix subject; escape inputs; zod | Low |
| 18 | `store/products` GET silent-empty | `api/store/products` | **MED** | False empty store | Fail loudly / fallback seed | Low |
| 19 | RE inquiry returns fake success on DB error | `api/demo/real-estate/inquiry` | **MED** | Lost inquiries | Return real status | Low |
| 20 | `test-*` diagnostic endpoints public | `api/test-email`, `api/test-z-ai` | **MED** | Info disclosure; key logging | Disable in prod | Low |
| 21 | `proxy.ts` rewrites without domain allowlist | `proxy.ts` | **LOW** | Host-header abuse surface | Validate hostname | Low |
| 22 | `typescript.ignoreBuildErrors` | `next.config.js` | **HIGH** | Prevents CI from catching type errors | Enable during build | Low |
| 23 | No tests at all | repo | **HIGH** | Regression-prone payments/SEO | Add Vitest on validation + integration smoke | High |
| 24 | `react-icons` + `lucide-react` both | Footer, WhatsAppWidget | **LOW** | Bundle duplicate icon sets | Consolidate | Low |
| 25 | Unused deps `better-sqlite3`, `@vercel/blob` | package.json | **LOW** | Bundle/bloat | Remove | Low |
| 26 | Root clutter (`live.html`, `live2.html`, `.speed.json`, `build-output.log`, test scripts) | repo root | **LOW** | Confuses onboarding | Move to `scratch/` or delete | Low |
| 27 | `.env.example` missing | repo root | **LOW** | Setup friction per README | Add template | Low |
| 28 | `admin_token` in localStorage | `admin/layout.tsx`, login | **MED** | XSS-readable token | httpOnly cookie | Medium |
| 29 | Wrong screen sizes/zoom disabled | `app/layout.tsx:99` | **MED** | WCAG failure | allow user-scalable | Low |
| 30 | GOD admin page (2567 lines) | `demo/store/admin/page.tsx` | **MED** | Unmaintainable | Split per-tab components | Medium |

---

## 28. File-by-File Summary

| File | Responsibility | Quality | Issues | Backend | Static/Dynamic |
|---|---|---|---|---|---|
| `app/layout.tsx` | Root layout + SEO metadata + JSON-LD | Good | 2 `dangerouslySetInnerHTML` (controlled JSON); `YOUR_GOOGLE_VERIFICATION_CODE` placeholder; `user-scalable=0`; `revalidate=86400` | no | Static |
| `app/(main)/layout.tsx` | Wraps providers | Good | — | no | Static |
| `app/(main)/page.tsx` | Homepage | Good | dynamic lazy components + ISR, but `noStore` metadata counters caching | SEO only | Mostly static |
| `app/api/admin/pages/route.ts` | Page-content CRUD (JSON) | Fair | unauthenticated; FS writes; no validation | JSON file | Dynamic |
| `app/api/admin/pricing/route.ts` | Pricing CRUD (JSON) | Fair | unauthenticated | JSON file | Dynamic |
| `app/api/admin/track/route.ts` | Page-view tracking | Poor | race-prone file writes | JSON file | Dynamic |
| `app/api/admin/auth/route.ts` | Login (custom JWT) | Poor | hardcoded passwords/secret | — | — |
| `app/api/admin/upload/route.ts` | File upload | Poor | no auth, SVG allowed | FS | Dynamic |
| `app/api/admin/seo/**` (20 routes) | SEO admin API | Mixed | auth gaps; 7 UI-contract bugs; CSV broken; fake GSC; heavy self-fetch | Prisma | Dynamic |
| `app/api/blog/posts/route.ts` | Blog CRUD | Fair | no auth; mass-assign PUT; tags parse crash | Prisma | Dynamic |
| `app/api/blog/generate/route.ts` | AI blog generation | Fair | heavy logs; double persistence | Prisma+GLM | Dynamic |
| `app/api/chat/route.ts` | Chat (AI) | Fair | verbose logs; `any` ×3 | Ollama/GLM | Dynamic |
| `app/api/contact/route.ts` | Contact email | Poor | unvalidated; `<br/` bug; `<img>` subject; Ethereal in dev | SMTP | Dynamic |
| `app/api/store/products(+[id])` | Products CRUD | Fair | public create/delete; silent-empty GET | Prisma | Dynamic |
| `app/api/store/orders/route.ts` | Orders CRUD + notifications | Fair | PII GET; mass PUT; order-number race; notification swallow | Prisma+SMTP+WA | Dynamic |
| `app/api/store/orders/track` | Order lookup | Good | email+number gate | Prisma | Dynamic |
| `app/api/store/checkout/webhook` | Payment webhook | **Poor** | no signature; TODO delivery | Prisma | Dynamic |
| `app/api/store/checkout/stripe` | Stripe create-session | Fair | no consumer; GET side-effect; no salePrice | Stripe REST | Dynamic |
| `app/api/store/coupons(+validate)` | Coupons CRUD | Poor | public CRUD; min-order bypass | Prisma | Dynamic |
| `app/api/store/reviews` | Reviews CRUD | Poor | public moderation; `?all` leak; NaN rating | Prisma | Dynamic |
| `app/api/leads/capture` | Lead capture | Fair | no rate-limit/format | Prisma | Dynamic |
| `app/api/chat-log` | Chat email log | Fair | console dump fallback | SMTP | Dynamic |
| `app/(main)/store/page.tsx` | Store list page (client) | Mixed | god file 1240 lines; normalization inline | API | Dynamic |
| `app/(main)/store/[slug]/page.tsx` | Store detail | Poor | hardcoded PRODUCTS_DATABASE; fake wa.me number; 1305 lines | — | Mocked |
| `app/(main)/store/checkout/page.tsx` | Checkout | Poor | full fake simulation; no order | — | Mocked |
| `app/(main)/store/track/page.tsx` | Track order | Good | — | API | Dynamic |
| `app/(main)/demo/store/admin/page.tsx` | Demo store admin | Poor | 2567-line god; fake Google ping; fake SEO 98/100 | localStorage | Mocked |
| `app/(main)/demo/store/track/page.tsx` | Demo tracking | Poor | hardcoded SAR-8921 + GPS SVG | — | Mocked |
| `app/(main)/demo/real-estate/*` | RE demo | Mixed | localStorage-decoupled from its own APIs | — | Mocked |
| `app/(main)/contact/page.tsx` | Contact page | Fair | error swallowing; missing labels | SMTP+WA | Dynamic |
| `app/(main)/pricing/page.tsx` | Pricing | Mixed | 3-level data waterfall; `any` | JSON/API | Partial |
| `app/(main)/blog/[id]/page.tsx` | Blog post | Mixed | noStore; `any`; risk from content XSS | Prisma | Dynamic |
| `components/LanguageProvider.tsx` | i18n + siteData | Poor | 94KB dictionary; `any`; partial coverage | API(pages) | Static+Dynamic |
| `components/ClientLayout.tsx` | Layout shell | Fair | analytics tracking; global input digit converter; mixed responsibilities | API(track) | — |
| `components/demo/store/StoreContext.tsx` | Demo store state | Poor | 706 lines; localStorage DB | — | Mocked |
| `components/store/CartContext.tsx` | Main cart | Good | — | localStorage | Dynamic |
| `components/demo/real-estate/RealEstateContext.tsx` | RE demo state | Fair | localStorage overrides server data | — | Mocked |
| `components/seo/*` (SeoMetaForm etc.) | SEO admin widgets | Good/used | duplicated under components/admin | API | Dynamic |
| `components/admin/seo/*` | — | **Dead code** | imported by zero files | — | — |
| `lib/prisma.ts` | Prisma singleton | Good | — | Prisma | — |
| `lib/email.ts` / store-emails | SMTP + templates | Good | Ethereal dev fallback | SMTP | — |
| `lib/whatsapp-api.ts` | WhatsApp Cloud sender | Good | requires env; silent failures upstream | WA | — |
| `lib/seo/metadata.ts` | DB SEO merge | Good | `noStore()` defeats ISR | Prisma | Dynamic |
| `lib/seo/google-search-console.ts` | GSC | **Fake** | real impl is TODO; random data | — | MOCKED |
| `lib/real-estate/{data,queries}.ts` | RE data+queries | Mixed | queries unused by UI | Prisma+fallback | Partial |
| `lib/blog/fallback-posts.ts/json` | Seed content | ok | only used by seed | — | Static (seed) |
| `prisma/schema.prisma` | Schema | Good | 21 models; no indices beyond unique | — | — |
| `prisma/seed.js` | Blog seeding | Good | — | Prisma | — |
| `proxy.ts` | Subdomain rewrites | Fair | no host allowlist | — | — |
| `Dockerfile` | Production image | Mixed | clones GitHub inside build (supply-chain risk); CACHEBUST hack; apt insecure flags | — | — |
| `docker-compose.yml` | Services | Fair | default `changeme` secrets; `internal:false` network | — | — |
| `.github/workflows/deploy.yml` | CI/CD | Fair | no tests/lint in pipeline; SSH keys; rebuild no-cache every push | — | — |

---

## 29. Architecture Assessment

**Overall:** dual personalities. There is a **real, working Prisma-backed backend** (products, orders, blog, SEO, leads) with genuinely functional external integrations (chat AI, emails, WhatsApp notification, Stripe session creation). But the **public money flows are fake** (checkouts), the **admin surface is unauthenticated**, the **store product detail feeds from hardcoded data**, and **two entire major features (demo store, real-estate demo) run 100% inside localStorage**.

Dimension-by-dimension:

- **Architecture —** mixed: strong separation of concerns in the Prisma/API tier; weak in pages (god files, business logic in UI); two parallel shop systems with diverging data paths.
- **Code organization —** folder structure is logical; the collision is inside files and duplicated components.
- **TypeScript —** low value: `any` everywhere, build ignores type errors, inline duplicated types.
- **React/Next —** correct App-Router structure, good lazy-loading instincts, but ISR vs `noStore` conflict, all-clients pages, effects anti-patterns, runtime simulation instead of server actions.
- **API integration —** real but blind spots (no auth, inconsistent contracts, no caching).
- **Backend integration —** in-repo route handlers are the backend; but two JSON-file "databases" and localStorage "databases" compete with PostgreSQL.
- **State —** localStorage-heavy, no server-state cache.
- **Security —** critical: open webhook, open admin APIs, hardcoded secrets, unsanitized HTML render.
- **Performance —** reasonable instincts, undermined by no-cache-everything, unoptimized images, and dynamic metadata.
- **Accessibility/Responsiveness/SEO —** SEO strong; RTL strong for Arabic; a11y weak (no focus management, zoom disabled); responsive unverified on mobile, admin least mobile-safe.

---

## 30. Backend Readiness

| Feature | Classification | Why |
|---|---|---|
| Store catalog/list | **READY** | API + Prisma complete; only frontend contract is `{success, products}` which matches. Missing: auth for writes. |
| Store product detail | **NOT READY** | Frontend consumes hardcoded `PRODUCTS_DATABASE`; needs a `GET /api/store/products/[slug]` contract + render from API. Also the API is keyed by `id` for PUT, while pages use `slug`. |
| Checkout | **NOT READY** | Needs `POST /api/store/orders` payload contract and a real payment route; both exist but unused. Expected payload: `{customerName, customerEmail, customerPhone, items:[{productId, quantity}], couponCode, paymentMethod, notes}` (inferred from `orders/route.ts`). |
| Stripe | **PARTIALLY READY** | Route creates sessions but none of the checkout UI calls it; no webhook verification; `unit_amount` ignores `salePrice`. |
| Order tracking | **READY** | Contract `orderNumber+email` → order; works. |
| Coupons | **READY** (must-secure) | validate endpoint exists; UI in admin works; needs auth. |
| Reviews | **READY** (must-secure)** | works; needs auth + min-order real check. |
| Blog | **READY** | Prisma CRUD + public read; needs auth + sanitization. |
| SEO admin | **PARTIALLY READY** | 7 response-contract mismatches with the UI; CSV import broken; auth missing. |
| Pages/Pricing editors | **PARTIALLY READY** | works on JSON file; needs migration to Prisma to be production-hardened. |
| Chatbot | **READY** | real provider chain; only needs key config + log cleanup. |
| Contact/pricing emails | **PARTIALLY READY** | works but unvalidated/interpolated → must harden. |
| Real-estate demo | **NOT READY** (by design it is a demo) | decoupled: localStorage UI vs unused APIs. |
| GSC rankings | **NOT READY** | fake/simulated data; would pollute analytics if adopted. |
| Admin auth | **NOT READY** | client-side gate only; APIs open; secrets hardcoded. |

**Missing API contracts / types:** no OpenAPI/type package shared between pages and handlers; response shapes inconsistent (`{ok}` vs `{success}` vs raw arrays vs 204); no error-standard envelope.

---

## 31. Production Readiness

**Blockers (must fix before treating this as production-grade):**
1. Stripe webhook signature verification (order-payment forgery).
2. Authentication/authorization for all `/api/admin/**`, `/api/store/**` mutating routes, `/api/blog/**`, and coupon/review moderation.
3. Remove hardcoded admin passwords + JWT default secret (fail closed in prod).
4. Sanitize blog rich HTML (stored XSS).
5. `store/checkout` and `demo/store/*` are simulated — if `/store` is meant to sell, checkout must create real orders.
6. `GOOGLE_VERIFICATION` placeholder + `_headers` CSP never applied on Docker (headers come from `next.config.js` only → include a real `Content-Security-Policy`).
7. Expose `.env` credentials hygiene — rotate the currently-plaintext SMTP/AI/DB secrets if they have ever been shared; enforce strong env at runtime.

**Important issues:** store detail hardcoded catalog drift; fake GSC data; 7 broken SEO UI contracts; JSON-file "DBs" in `public/`; missing tests; `typescript.ignoreBuildErrors=true`; order-number race; unauthenticated file upload (SVG).

**Minor issues:** root clutter, unused deps, `_headers`/vercel artifacts conflict with Docker deployment, `user-scalable=0`, missing `.env.example`, diagnostic endpoints exposed, verbose console logging of secrets-adjacent info in `test-z-ai`.

**Improvements:** CI lint+typecheck gate; error boundaries; rate limiting on leads/contact; e2e smoke tests for checkout+auth; split god components.

**Positive signals:** a functioning real store API, working chat AI, DB-driven SEO, Docker+Portainer setup, GH Actions pipeline with secrets validation, cross-language RTL foundation, and thoughtful lazy-loading — the *plumbing* is real; the *business loop* (payments) and the *security shell* are not.

---

## 32. Prioritized Action Plan

### Phase 1 — Critical fixes
| Task | Location | Why | Dep | Complexity | Result |
|---|---|---|---|---|---|
| Verify Stripe webhook signature | `api/store/checkout/webhook` | payment forgery | STRIPE_WEBHOOK_SECRET | Low | Only Stripe can mark paid |
| Auth middleware for `/api/admin/**` + `/api/store/**` writes + `/api/blog/**` | `proxy.ts` + handlers | open admin/PII | auth route | Medium | Enforce server-side auth |
| Remove hardcoded passwords/JWT fallback | `api/admin/auth` | forgeable tokens | env vars | Low | Fail closed |
| Sanitize blog HTML (DOMPurify/sanitize-html on render + write) | `BlogPostClient` / blog routes | stored XSS | dep | Medium | Safe blog |
| Guard upload (reject SVG, verify magic bytes, require auth) | `api/admin/upload` | stored XSS/abuse | — | Low | Safer uploads |
| Real CSP + security headers for Docker | `next.config.js` headers | headers never applied | — | Low | XSS/CSP active |
| Rotate/secure `.env` credentials & add `.env.example` | repo/README | credential hygiene | — | Low | Safe secrets workflow |
| Disable `dangerouslyAllowSVG` or allowlist | `next.config.js` | XSS amplifier | — | Low | Reduced blast radius |

### Phase 2 — Backend integration
| Task | Location | Why | Dep | Complexity | Result |
|---|---|---|---|---|---|
| Wire checkout → `POST /api/store/orders`; then → Stripe session / webhook | `store/checkout/page.tsx` + orders/stripe | currently fake | Phase-1 auth | Medium | Real sales + orders in DB |
| Render `/store/[slug]` from API `GET /api/store/products/[slug]` (add slug-based GET) | `store/[slug]/page.tsx` + products route | catalog drift | — | Medium | Admin edits visible |
| Fix order-number generator (dedicated field/counter) | `api/store/orders` | race/collisions | — | Low | Stable ordering |
| Migrate `pages-content`, `pricing`, `analytics` from `public/*.json` to Prisma tables | `api/admin/pages`, `pricing`, `track` | FS-as-DB unsafe | — | High | Durable, atomic |
| Harden contact/pricing: zod schemas + HTML-escape + fix subject `<br/` bug | `api/contact`, `api/pricing` | injection/broken email | — | Low | Safe mail |
| Replace fake GSC with real API or remove | `lib/seo/google-search-console`, keywords/sync | fake analytics | googleapis | Medium | Truthful analytics |
| Fix 7 redirects/robots/schema contract mismatches + CSV import + analytics "latest" bug | `api/admin/seo/**` + widgets | broken admin UX | — | Low–Med | Working SEO admin |

### Phase 3 — Architecture / code quality
| Task | Location | Why | Dep | Complexity | Result |
|---|---|---|---|---|---|
| Enable type-checking during build (remove `ignoreBuildErrors`) & fix `any` hotspots | `next.config.js` + ~20 files | type safety | — | Medium | CI catches errors |
| Split god components (demo admin, store checkout, store list, products detail, services [id]) | multiple pages | maintainability | — | High | Modular UI |
| Create shared types + shared API client (single `fetch` wrapper) + unified response envelope | new `lib/api` + `types/` | duplication | — | Medium | Contract consistency |
| Centralize coupon/pricing/order math in a service module | route handlers + pages | duplication | — | Medium | Single source of truth |
| Add Error Boundaries & unify loading/empty/error states | app + components | UX resilience | — | Low | Fail gracefully |
| Use httpOnly cookie for admin token | admin auth/layout | XSS token theft | — | Medium | Stronger sessions |

### Phase 4 — Performance
| Task | Location | Why | Dep | Complexity | Result |
|---|---|---|---|---|---|
| Remove `noStore()` / reconcile `revalidate` (per-page ISR for static routes) | `lib/seo/metadata`, pages | caching disabled | — | Medium | Cheaper renders |
| Add caching headers suitable for CDN (only dynamic routes no-store) | `next.config.js` | global no-cache | — | Low | Faster UX |
| Lazy-load heavy demo/checkout/3D modules per-route | pages | bundle bloat | — | Medium | Smaller JS |
| Replace `analytics.json` writes with DB/counter or dedupe | `api/admin/track` | race/performance | Phase2 migration | Low | Accurate stats |
| Use `lib/prisma` everywhere (fix smart-fix) | `admin/seo/smart-fix` | pool exhaustion | — | Low | Stability |

### Phase 5 — Accessibility / SEO
| Task | Location | Why | Dep | Complexity | Result |
|---|---|---|---|---|---|
| Focus traps + Escape + `aria-modal` for all modals/drawers | modals, MobileNav | a11y | — | Medium | Keyboard-usable |
| Remove `user-scalable=0` | `app/layout.tsx` | WCAG 1.4.4 | — | Low | Zoom enabled |
| Add `<label htmlFor>`/aria-labels to admin/demo forms | admin + demo stores | a11y | — | Low | Accessible forms |
| Replace `YOUR_GOOGLE_VERIFICATION_CODE`; add per-product structured data; hreflang for ar/en | `app/layout` + product pages | SEO completeness | — | Low | Better crawling |
| Fix `not-found.tsx` duplicate html/body | `app/not-found.tsx` | hydration/semantics | — | Low | Correct 404 |

### Phase 6 — Final cleanup
| Task | Location | Why | Dep | Complexity | Result |
|---|---|---|---|---|---|
| Add tests: validation unit tests + API integration smoke (auth, orders, checkout) | new `__tests__` | regression | Phase 1–3 | Medium | Safety net |
| Delete dead code: `components/admin/seo/*`, `chat/route_backup.ts`, `app/api/cron/blog.ts`, `.speed.json`, `live*.html`, `better-sqlite3`, `@vercel/blob` | repo | clarity | — | Low | Leaner repo |
| Consolidate icon libs (react-icons→lucide) | Footer, WhatsAppWidget | bundle | — | Low | One icon set |
| Enforce lint in CI; add timeout hardening & remove verbose logging of AI keys/first-chars | chat/blog/test-z-ai | hygiene | — | Low | Cleaner prod logs |

---

## 33. Final Executive Summary

1. **What is actually implemented:** A Next.js 16 (App Router, RTL Arabic) platform with a **working PostgreSQL/Prisma backend** for products, orders, blog, SEO metadata, leads, and real estate; a **real AI chatbot** (Ollama + Zhipu GLM); **real email + WhatsApp notifications**; admin dashboard for content/SEO/store; subdomain rewrites; Docker+Portainer+VPS CI/CD; thoughtful SEO/metadata infrastructure. This "plumbing" is genuine and tested.

2. **What is static:** All marketing pages (services, why-us, process, projects, provisions, influencer, sara, lp), the i18n dictionary, pricing fallbacks, footer/contact details, seed images.

3. **What is mocked:** The **checkout flows of both stores** (fake processing + fake success), **Google Search Console rankings** (random numbers written to DB), **AI SEO analysis** (hardcoded Arabic blurb without a key), the **entire demo store** (products, orders, tracking, coupons, pixels, admin), the **real-estate demo** (localStorage), social-proof popups, price-alert, PWA install banner, "Google indexing ping", and the SEO "98/100 (A+)" score on the demo store admin.

4. **What is locally dynamic:** cart (localStorage), language/theme (localStorage), admin token (localStorage), demo store/RE admin data (localStorage), page-views counters (JSON file), Arabic-digit conversion (client script).

5. **What is connected to backend:** store catalog list, order tracking, blog (read+write), leads capture, SEO meta/keywords/redirects/robots/schema CRUD, contact/pricing emails, chat, real-estate seed/inquiry APIs (endpoints exist; inquiry not consumed by UI), shipping-grade Stripe session creation route (not consumed by UI). Database: PostgreSQL via Prisma on the store/blog/SEO/RE models.

6. **What is partially connected:** pricing (JSON→static chain), admin pages/pricing editors (JSON files), store admin (DB APIs) with a detail page that ignores them, `admin/seo/ai-analysis` (real+mock), store checkout (API exists, UI simulated).

7. **Biggest architectural problems:** (a) two parallel store systems with diverging data paths and a hardcoded product "database" shadowing the real API; (b) filesystem-as-database (`public/data/*.json`) and localStorage-as-database competing with PostgreSQL; (c) business logic embedded in 2,500-line page components; (d) no service/type/validation layer between UI and DB.

8. **Biggest code-quality problems:** god components 800–2,500 lines; duplicated coupons/checkout/pricing/SEO-widget logic; `any`-heavy typing with `typescript.ignoreBuildErrors` shielding it; unstructured response contracts (7 proven UI/API mismatches); dead code duplication; 94KB i18n provider; copy-pasted bank/payment data and timers everywhere.

9. **Biggest backend-integration gaps:** checkout never creates orders nor initiates Stripe; webhook forgeable; no auth on ~45 admin/store/blog write endpoints; GSC simulated; real-estate APIs disconnected from its UI; order-number race; silent-failure error handling across notifications, inquiries, and product listings.

10. **Biggest production risks:** Stripe-webhook forgery; full admin API exposure (customer PII, coupon enumeration, arbitrary content mutation, unauthenticated uploads incl. SVG); stored XSS through unsanitized blog HTML; hardcoded admin passwords/JWT defaults; fake data being presented as production analytics (GSC "rankings"); no tests and no build-time type checking.

11. **Most important next steps:** secure the webhook and all admin/store/blog APIs (Phase 1), wire the checkout to the real order/Stripe paths (Phase 2), then fix the 7 broken SEO-admin contracts and the hardcoded product detail page; enable type-checking in the build; add tests for auth + checkout; and finally clean up dead code, legacy artifacts, and duplicated modules.