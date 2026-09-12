<div align="center">

# 🚀 D-Arrow Digital Marketing & Intelligent Software

### منصة دي آرو الرقمية — حلول التسويق والأنظمة البرمجية الذكية

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Portainer](https://img.shields.io/badge/Portainer-Host-13BEBB?style=for-the-badge&logo=portainer&logoColor=white)](https://apps.d-arrow.com)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/dearrowsa-cyber/D-arrow/actions)

<p align="center">
  <b>بوابة رقمية متكاملة لخدمات التسويق، المتاجر الإلكترونية، المنصات العقارية الذكية، وإدارة أعمال المؤثرين.</b>
</p>

[🌐 الموقع الرسمي](https://d-arrow.com) • [🐳 لوحة إدارة Portainer](https://apps.d-arrow.com) • [🛍️ متجر الديمو](https://d-arrow.com/demo/store) • [🏡 منصة العقارات](https://d-arrow.com/demo/real-estate) • [🌟 منصة المؤثرين](https://d-arrow.com/influencer)

---

</div>

## 📌 نبذة عن المشروع (Overview)

منصة **D-Arrow** هي نظام رقمي شامل مبني بأحدث تقنيات الويب الحديثة، ومصمم لتلبية متطلبات السوق السعودي والخليجي وفق أعلى معايير الأداء والجمالية وتجربة المستخدم.

تجمع المنصة بين:

1. **واجهة وكالة التسويق والحلول الرقمية (Corporate Agency Portal):** استعراض الهوية، الخدمات، سابقة الأعمال، ونماذج التواصل التفاعلية.
2. **متجر دي آرو الرقمي والديمو التفاعلي (`/demo/store` & `/store`):** نظام متاجر إلكترونية تجريبي وحي يدعم تخصيص القوالب المباشر، سلة المشتريات، وتتبع الطلبات المباشر.
3. **منصة التقنية العقارية المتطورة (`/demo/real-estate`):** عروض عقارية تفاعلية في الرياض ومختلف مناطق المملكة مع فلاتر ذكية وحاسبة أقساط ونظام استفسارات فوري.
4. **منصة واستعراضات المشاهير والمؤثرين (`/influencer`):** ملفات تعريفية إعلامية للمؤثرين ونماذج الحملات الإعلانية والإحصائيات الموثقة.
5. **لوحة التحكم والمحرك الذكي (`/admin`):** إدارة الأسعار، تحسين محركات البحث (SEO Engine)، تحليلات الزوار، وإدارة المحتوى.

---

## 🏗️ البنية التقنية (Tech Stack & Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / SSL (Cloudflare / Nginx)
┌──────────────────────────────▼──────────────────────────────┐
│                    VPS Production Host                      │
│                       (188.68.38.154)                       │
│                                                             │
│   ┌─────────────────────┐       ┌────────────────────────┐  │
│   │   Nginx Web Server  ├──────►│  d-arrow-app (Next.js) │  │
│   │   SSL Reverse Proxy │       │  Container: Port 3031  │  │
│   └─────────────────────┘       └───────────┬────────────┘  │
│                                             │               │
│                                 ┌───────────▼────────────┐  │
│                                 │ d-arrow-postgres (DB)  │  │
│                                 │ Container: Port 5432   │  │
│                                 └────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                               ▲
                               │ SSH Continuous Deployment
┌──────────────────────────────┴──────────────────────────────┐
│                    GitHub Actions (CI/CD)                   │
│         Push to main ➔ Build ➔ Re-deploy Container           │
└─────────────────────────────────────────────────────────────┘
```

| الطبقة                 | التقنية المستخدمة                     | الوصف                                                |
| :--------------------- | :------------------------------------ | :--------------------------------------------------- |
| **Frontend Framework** | **Next.js 15 (App Router)**           | أداء فائق وسرعة تحميل عبر SSR & Client Components    |
| **Language & Typing**  | **TypeScript**                        | أمان نمطي كامل وقابلية صيانة عالية للكود             |
| **Styling**            | **Tailwind CSS & Vanilla CSS Tokens** | تصميم هوية داكنة فاخرة، وتأثيرات بصرية حديثة         |
| **Database & ORM**     | **PostgreSQL 16 + Prisma ORM**        | قاعدة بيانات موثوقة مع إدارة المخطط عبر Prisma       |
| **AI Integration**     | **Multi-Model AI Engine**             | محرك ذكاء اصطناعي للمساعد الآلي ونماذج n8n           |
| **Containerization**   | **Docker & Docker Compose**           | بيئة حاويات مستقلة ومعزولة للإنتاج                   |
| **Server Management**  | **Portainer CE**                      | لوحة تحكم سحابية لإدارة الـ Stacks والحاويات         |
| **CI / CD**            | **GitHub Actions**                    | أتمتة كاملة للسحب والبناء وإعادة التشغيل عند كل Push |

---

## ✨ الأقسام والميزات الرئيسية (Key Modules)

### 1. المتجر الإلكتروني والديمو التفاعلي (`/demo/store`)

- **Live Theme Customizer:** درج تفاعلي لتغيير سمة المتجر في الوقت الفعلي (عصري، كلاسيكي، فاخر).
- **Smart Cart & Checkout:** سلة مشتريات منبثقة، وتوجيه سريع لإنهاء الطلب عبر الواتساب أو الدفع الإلكتروني.
- **Order Tracking (`/demo/store/track`):** نظام محاكاة تتبع مباشر لمراحل معالجة وشحن وتوصيل الطلبات مع إشعارات حالة واقعية.

### 2. منصة العقارات الذكية (`/demo/real-estate`)

- استعراض العقارات والمشاريع السكنية والتجارية مع فلاتر حسب المدينة، السعر، ونوع العقار.
- حاسبة تمويل عقاري وأقساط شهرية تفاعلية.
- لوحة استفسارات فورية للربط بين العميل وفريق المبيعات.

### 3. منصة المؤثرين وصناع المحتوى (`/influencer`)

- صفحات خاصة للمؤثرين (مثل `/influencer/mahmoud-sorour` و `/sara`).
- عرض الإحصائيات الديموغرافية ومعدلات التفاعل ونماذج الفيديو عالية الجودة.
- باقات وحملات تسويقية جاهزة للشركات والجهات الراغبة في التعاون.

### 4. مركز التحكم وتحسين محركات البحث (`/admin`)

- **Pricing Engine:** إدارة باقات وأسعار الخدمات وتحديثها ديناميكياً.
- **SEO Command Center:** تخصيص الـ Meta Tags، ملف `robots.txt`، ومخططات `Schema.org` المهيكلة.
- **Analytics Dashboard:** إحصائيات حية لعدد الزيارات والتحويلات.

---

## 🚀 البدء والتشغيل المحلي (Local Development)

### المتطلبات الأساسية:

- **Node.js**: الإصدار 18 أو أحدث (يوصى بـ Node 20+)
- **npm** أو **pnpm**
- **Docker Desktop** (اختياري، في حال رغبت بتشغيل قاعدة البيانات محلياً عبر Docker)

### خطوات التثبيت والتشغيل:

1. **استنساخ المستودع (Clone):**

   ```bash
   git clone https://github.com/dearrowsa-cyber/D-arrow.git
   cd D-arrow
   ```

2. **تثبيت الحزم (Install Dependencies):**

   ```bash
   npm install
   ```

3. **إعداد متغيرات البيئة (Environment Variables):**
   قم بإنشاء ملف `.env` بناءً على النموذج:

   ```bash
   cp .env.example .env
   ```

   _(قم بملء بيانات الاتصال بقاعدة البيانات والمفاتيح السرية)_

4. **تحديث قاعدة البيانات عبر Prisma:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **تشغيل خادم التطوير (Development Server):**
   ```bash
   npm run dev
   ```
   افتح المتصفح على: `http://localhost:3000`

---

## 🐳 النشر على السيرفر عبر Portainer و Docker

المشروع لا يعتمد على منصات استضافة خارجية محدودة مثل Vercel، بل يعمل بالكامل على خادم VPS خاص تحت إدارة **Portainer** عبر Docker Compose:

### 1. الوصول إلى لوحة إدارة Portainer:

- **الرابط:** [https://apps.d-arrow.com](https://apps.d-arrow.com)
- **المسار على السيرفر:** `/data/compose/17` و `/home/darrow/project`

### 2. تشغيل الـ Stack يدوياً على السيرفر:

```bash
cd /home/darrow/project
# بناء الحاوية بأحدث كود
docker compose build d-arrow-app --no-cache
# تشغيل الحاوية في الخلفية
docker compose up -d d-arrow-app
```

### 3. إعداد الـ Reverse Proxy (Nginx):

يتم توجيه حركة المرور من النطاق الخارجي `d-arrow.com` إلى منفذ التطبيق المحلي:

- **Host Port:** `127.0.0.1:3031`
- **Internal Container Port:** `3000`

---

## ⚡ خط النشر التلقائي (CI/CD Pipeline)

المشروع مزوّد بخط نشر آلي متطور عبر **GitHub Actions** في الملف:
📂 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

### كيف يعمل النشر التلقائي؟

```
[المطور يعمل Push لـ main]
           │
           ▼
[GitHub Actions تستشعر التعديل]
           │
           ▼
[الاتصال بالـ VPS عبر مفتاح SSH آمن ومشفّر]
           │
           ▼
[سحب التعديلات: git pull origin main]
           │
           ▼
[إعادة بناء حاوية Next.js: docker compose build --no-cache]
           │
           ▼
[إعادة تشغيل التطبيق في ثوانٍ بدون أي انقطاع للخدمة]
```

### المتغيرات السرية في GitHub Secrets:

تم تكوين المتغيرات التالية مسبقاً في إعدادات المستودع لضمان أمان الاتصال:

- `VPS_HOST`: عنوان الـ IP للسيرفر.
- `VPS_USER`: اسم المستخدم المصرح له (`root`).
- `VPS_SSH_KEY`: مفتاح SSH المشفر للاتصال.
- `VPS_PORT`: منفذ الاتصال (`22`).

---

## 📁 هيكل المجلدات (Directory Structure)

```
D-arrow/
├── .github/
│   └── workflows/
│       └── deploy.yml            # خط النشر التلقائي للـ VPS
├── app/
│   ├── (main)/                   # صفحات الواجهة الرئيسية
│   │   ├── demo/
│   │   │   ├── store/            # ديمو المتجر الإلكتروني والسلة
│   │   │   └── real-estate/      # منصة الديمو العقارية
│   │   ├── store/                # المتجر الرقمي الحي
│   │   ├── pricing/              # صفحة الباقات والأسعار
│   │   ├── influencer/           # منصة المؤثرين والمشاهير
│   │   ├── mahmoud-sorour/       # صفحة المؤثر محمود سرور
│   │   └── sara/                 # صفحة المؤثرة سارة
│   ├── admin/                    # لوحة الإدارة والتحكم
│   │   ├── pricing/              # إدارة الأسعار
│   │   └── seo/                  # محرك تحسين الـ SEO
│   └── api/                      # مسارات الـ API الخلفية
├── components/                   # المكونات البرمجية القابلة لإعادة الاستخدام
│   ├── demo/                     # مكونات المتاجر والعقارات التجريبية
│   └── seo/                      # مكونات إدارة وتوليد الميتا
├── prisma/
│   └── schema.prisma             # مخطط قاعدة البيانات
├── public/                       # الملفات الثابتة، الصور، والفيديوهات
├── docker-compose.yml            # إعدادات تشغيل خدمات Docker
├── Dockerfile                    # مواصفات بناء صورة Next.js
└── proxy.ts                      # محرك التوجيه والـ Proxy
```

---

## 🤝 تعليمات المساهمة والتعاون (Collaboration Guidelines)

للحفاظ على استقرار بيئة الإنتاج على الـ VPS:

1. يمنع الرفع المباشر على فرع `main` لأي ميزات تجريبية.
2. قم بإنشاء فرع جديد لعملك:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. بعد الانتهاء واختبار التعديلات، افتح **Pull Request (PR)** على GitHub.
4. بمجرد مراجعة الـ PR ودمجه (Merge) في `main`، سيتولى **GitHub Actions** نشر التحديث فوراً على السيرفر الحي.

---

<div align="center">
  <sub>حقوق النشر والتطوير محفوظة © 2026 <b>D-Arrow Digital Agency</b>.</sub>
</div>
