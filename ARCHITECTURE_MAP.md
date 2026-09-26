# D-Arrow Platform — الدليل المعماري الشامل والمواصفات الفنية للـ APIs

هذا المستند هو المرجع الهندسي الكامل للمشروع (Developer Handover Document). موجّه للمطورين والمهندسين المسؤولين عن التطوير، إدارة السيرفر، أو إضافة مزايا جديدة، بعيداً عن التوصيفات الإنشائية أو النماذج السطحية.

---

## 1. البنية المعمارية ومنظومة الاستضافة (VPS & Docker Architecture)

### 1.1 حقيقة بيئة الاستضافة: خادم محلي / VPS بالكامل (On-Prem / Linux VPS)
المشروع **لا يعتمد على منصة Vercel إطلاقاً في بيئة الإنتاج**. النظام مصمم ليعمل كمنظومة حاويات متكاملة (Docker Compose) تُدار عبر **Portainer** على خادم Linux VPS، وتتكون من الآتي:

```
[ Internet / Clients ]
         │
         ▼
[ Nginx Reverse Proxy / SSL Termination ]
         │
         ▼ (Port 127.0.0.1:3031)
┌─────────────────────────────────────────────────────────────┐
│ Docker Network: `backend`                                    │
│                                                             │
│  ┌───────────────────────────┐   ┌────────────────────────┐ │
│  │ Container: `d-arrow-app`  │───│ `d-arrow-postgres`     │ │
│  │ Next.js 16 (Port 3000)    │   │ PostgreSQL 16 Alpine   │ │
│  └─────────────┬─────────────┘   └───────────┬────────────┘ │
│                │                             │              │
│                ▼                             ▼              │
│       Volume: `d_arrow_uploads`      Volume: `d_arrow_pgdata`│
│       (/app/public/uploads)          (/var/lib/postgresql/…) │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 توضيح متعلقات Vercel الموجودة بالمستودع (Legacy Clean-up)
* **حزمة `@vercel/blob` في `package.json`:**
  * **الوضع الفعلي:** حزمة مهجورة (Dead Dependency). لا يوجد أي استدعاء لها داخل الكود البرمجي نهائياً.
  * **آلية الرفع الحالية:** تتم محلياً 100% عبر Node.js File System (`fs/promises`) إلى المسار `/app/public/uploads` والمربوط بـ Docker Volume دائم اسمه `d_arrow_uploads`.
  * **الإجراء الموصى به للمطور:** حذف الحزمة بأمر `npm uninstall @vercel/blob` لمنع أي تشويش.
* **ملفات `.env.vercel` و `.env.vercel.production`:**
  * **الوضع الفعلي:** مخلفات قديمة نتجت عن ربط تجريبي عبر Vercel CLI في بدايات المشروع.
  * **الإجراء الموصى به للمطور:** حذف هذه الملفات نهائياً، والاعتماد حصراً على ملف `.env` الفعلي بناءً على قالب `.env.example`.

### 1.3 مراحل بناء الحاوية (Dockerfile Multi-Stage Pipeline)
ملف `Dockerfile` ينفذ بناءً ثلاثي المراحل:
1. **مرحلة التبعيات (`deps`):** تثبيت حزم النظام الأساسية لتجميع المكتبات الثنائية (Sharp، Better-SQLite3، Prisma Client).
2. **مرحلة التجميع (`builder`):** استنساخ أحدث Commit وتوليد Prisma Client ثم تشغيل أمر `npm run build`.
   * **ملاحظة حرجة:** فشل أي اختبار للأنواع (TypeScript Errors) يوقف عملية `npm run build` ويمنع تحديث الحاوية على السيرفر تماماً.
3. **مرحلة التشغيل (`runner`):** تشغيل السيرفر باستخدام `tini` كـ Init Process لتفادي الـ Zombie Processes، مع تطبيق الـ Migrations التلقائية عبر `prisma migrate deploy` قبل تشغيل `next start`.

---

## 2. تفكيك وتصنيف محتوى الموقع (Hardcoded vs. Database vs. External APIs)

للإجابة عن سؤال: **ما هي الأجزاء الثابتة، وما هي الديناميكية من قاعدة البيانات، وما هي المتصلة بـ APIs خارجية؟** يوضح الجدول التالي المعمارية الدقيقة لكل جزء من المشروع:

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           مكونات منصة D-Arrow                            │
├───────────────────────┬───────────────────────────┬───────────────────────┤
│ 1. Hardcoded (ثابت)   │ 2. PostgreSQL (Prisma DB) │ 3. External APIs      │
├───────────────────────┼───────────────────────────┼───────────────────────┤
│ • معرض المشاريع       │ • مقالات وتصنيفات المدونة │ • محركات الذكاء (AI)  │
│   (lib/data/portfolio)│ • عملاء المحتوى المقفول   │   (Ollama / Zhipu)    │
│ • نصوص صفحات الخدمات  │   (Captured Leads)        │ • إشعارات واتساب      │
│ • صفحات الهبوط الخاصة │ • منتجات وطلبات المتجر    │   (Meta Graph v21.0)  │
│ • باقات الأسعار       │ • كوبونات الخصم والتقييم  │ • بوابة الدفع         │
│   الافتراضية (Fallback)│ • إعدادات الـ SEO والميتا │   (Stripe API)        │
│ • سياسات الخصوصية     │ • روابط التحويل 301/302   │ • خادم البريد         │
│   والشروط             │ • قواعد ملف Robots.txt    │   (Nodemailer SMTP)   │
│ • هيكل القوائم        │ • الكلمات المفتاحية وسجلها│ • أتمتة الـ CRM       │
│   (Header / Footer)   │ • العقارات والوسطاء       │   (N8N Webhooks)      │
└───────────────────────┴───────────────────────────┴───────────────────────┘
```

### 2.1 التفصيل الميداني لكل طبقة:

#### أ) الطبقة الأولى: البيانات الثابتة في الكود (Hardcoded Static Data)
1. **معرض الأعمال والمشاريع (Portfolio):**
   * **الموقع:** معرّف ككائن ثابت داخل [lib/data/portfolio.ts](file:///c:/Users/omara/Music/mama%20list/Darrow/digital-marketing-d-arrow--main/lib/data/portfolio.ts) بمساحة تقارب 38KB.
   * **المحتوى:** بيانات المشاريع باللغتين العربية والإنجليزية (مثل: محطات بريق المستقبل Spark، هويات تجارية، تصاميم ويب، التحديات، الحلول، والصور).
   * **السبب المعماري:** ضمان سرعة تحميل قصوى (Zero Database Query Overhead) ولأن تحديث معرض الأعمال يتم مع كل إطلاق تسويقي جديد وليس يومياً.
2. **صفحات الخدمات الثابتة (Services Pages):**
   * مسارات `app/(main)/services/` و `services/[id]` تحتوي على شرح الخدمات، المميزات، والأسئلة الشائعة بصيغة Static React Components.
3. **صفحات الهبوط المخصصة (Landing Pages):**
   * صفحات المشاهير وحملات السوشيال مثل: `influencer/mahmoud-sorour` و `lp/social-media` و `why-us` و `process` و `sara`.
4. **باقات الأسعار الافتراضية (Fallback Pricing):**
   * كائن `DEFAULT_PACKAGES` داخل [app/(main)/pricing/page.tsx](file:///c:/Users/omara/Music/mama%20list/Darrow/digital-marketing-d-arrow--main/app/(main)/pricing/page.tsx) يعمل كنسخة احتياطية سريعة تُعرض فوراً للزائر في حال عدم توفر أو تأخر استجابة قاعدة البيانات.

#### ب) الطبقة الثانية: البيانات الديناميكية المتصلة بقاعدة البيانات (Database-Driven via Prisma)
كل ما يتم إدارته من لوحة التحكم (`/admin`) يتم حفظه وتعديله عبر PostgreSQL من خلال النماذج (Models) التالية في `prisma/schema.prisma`:
1. **المدونة ونظام الـ Leads:**
   * جدول `BlogPost`: مقالات كاملة، تاريخ، وقت القراءة، والوسوم.
   * خاصية `isGated` و `gatedContent`: المحتوى الحصري المقفول.
   * جدول `CapturedLead`: سجل بيانات العملاء الذين سجلوا للحصول على محتوى مقفول أو استشارة.
2. **المتجر الإلكتروني (E-Commerce):**
   * جدول `Product`: المنتجات الرقمية والخدمات، الأسعار، صور العرض، وروابط التحميل التجريبية.
   * جدول `Order` و `OrderItem`: أوامر الشراء، أسماء العملاء، حالة الدفع (`pending`, `paid`)، ومطابقة السداد.
   * جدول `Coupon`: أكواد الخصم، نسب التخفيض، وتاريخ الصلاحية وعدد مرات الاستخدام.
   * جدول `ProductReview`: تقييمات العملاء ومراجعاتهم للموافقة عليها أو رفضها.
3. **منظومة الـ SEO المركزية:**
   * جدول `SeoMeta`: بطاقات العنوان والوصف والـ Canonical وروابط OpenGraph لكل مسار.
   * جدول `Redirect`: تحويل الروابط 301 و 302 وحساب عداد الزيارات (Hit Count).
   * جدول `RobotsRule`: قواعد منع وسماح روبوتات محركات البحث من قراءة أجزاء الموقع.
   * جدول `SchemaMarkup`: حقن أكواد JSON-LD Structured Data.
   * جدول `TrackedKeyword` و `KeywordRanking`: مراقبة الكلمات المفتاحية ومراكز الترتيب.
4. **المنظومة العقارية (Real Estate):**
   * جداول `RealEstateProperty`, `RealEstateAgent`, `RealEstateInquiry`.

#### ج) الطبقة الثالثة: التكامل مع الـ APIs الخارجية (External 3rd-Party APIs)
الربط الخارجي في الموقع **لا يقتصر على الذكاء الاصطناعي فقط**، بل يشمل 4 قطاعات تكاملية مختلفة:
1. **الذكاء الاصطناعي (AI Engines):**
   * **المحرك المحلي:** `Ollama REST API` يستمع داخلياً على بورت `11434` لتنفيذ معالجة سريعة عبر موديل `qwen2.5:3b`.
   * **المحرك السحابي الاحتياطي:** واجهة `Zhipu AI (GLM-4 / BigModel API)` الصينية لمعالجة الطلبات في حال تعذر السيرفر المحلي.
   * **الأتمتة الخارجية:** `N8N Webhook` لاستقبال أحداث المحادثات وتوجيهها لأنظمة إدارة العملاء الخارجية.
   * **أين يُستخدم الذكاء الاصطناعي؟**
     1. الشات بوت التفاعلي للمبيعات والخدمات (`/api/chat`).
     2. كاتب المقالات التلقائي للمدونة (`/api/blog/generate` و `/api/admin/ai/writer`).
     3. أداة تحليل صفحات الـ SEO وتوليد التوصيات (`/api/admin/seo/ai-analysis` و `smart-fix`).
2. **منظومة التنبيهات المباشرة (Meta WhatsApp Cloud API):**
   * اتصال مباشر مع Meta Graph API v21.0 عبر HTTPS POST إلى سيرفرات فيسبوك.
   * **وظيفته:** إرسال إشعار فوري إلى رقم هاتف الإدارة المعتمد (`966500466349`) عند كل إجراء من العميل (مثل: إرسال نموذج اتصل بنا، تسجيل ليد جديد لفك محتوى مقال، أو استفسار على عقار).
3. **بوابة الدفع الإلكتروني (Stripe Payments API):**
   * الاتصال بواجهات Stripe السحابية لتوليد Checkout Sessions وتأمين استلام مبالغ الطلبات من المتجر، والتحقق المشفر من الـ Webhook Signatures.
4. **منظومة البريد الإلكتروني (SMTP / Nodemailer):**
   * اتصال شبكي عبر بروتوكول SMTP مع خادم البريد (مثل Google Workspace أو سيرفر بريدي مستقل) لإرسال رسائل الفواتير ونماذج التواصل.

---

## 3. دليل ومواصفات واجهات البرمجة (API Endpoints Specification)

جميع الـ Endpoints تقع تحت مسار `/app/api/` وتتعامل بمعيار JSON عبر HTTP.

### 3.1 المصادقة ولوحة التحكم (Admin & Core API)

#### `POST /api/admin/auth`
* **الصلاحية:** عام (Public).
* **الوظيفة:** تسجيل دخول الإدارة وإصدار Token.
* **Request Payload:**
  ```json
  { "password": "string" }
  ```
* **Response (200 OK):**
  ```json
  { "success": true, "token": "ey...", "message": "تم تسجيل الدخول بنجاح" }
  ```
* **Response (401 Unauthorized):**
  ```json
  { "success": false, "error": "كلمة المرور غير صحيحة" }
  ```

#### `GET /api/admin/auth`
* **الصلاحية:** محمي (يتطلب `Authorization: Bearer <token>`).
* **الوظيفة:** التحقق من سريان جلسة التوكن قبل فتح صفحات لوحة التحكم.

#### `POST /api/admin/upload`
* **الصلاحية:** إدارة.
* **نوع الطلب:** `multipart/form-data` (حقل `file`).
* **القيود:** الحد الأقصى 5MB. الصيغ المقبولة: `jpg`, `png`, `webp`, `gif`, `svg`.
* **آلية المعالجة:** توليد اسم فريد وحفظ الملف في `public/uploads/` على قرص الخادم، ثم إرجاع رابط الوصول.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "url": "/api/uploads/1720000000-xyz.webp",
    "filename": "uploads/1720000000-xyz.webp",
    "size": 120400,
    "type": "image/webp"
  }
  ```

#### `GET|POST /api/admin/pricing`
* **الوظيفة:** قراءة أو تحديث باقات الأسعار المعتمدة بالموقع ديناميكياً وتخزينها في قاعدة البيانات.

#### `GET /api/admin/analytics`
* **الوظيفة:** جلب ملخص شامل لعدد الزيارات، استفسارات العملاء، والطلبات المنفذة.

---

### 3.2 منظومة تحسين محركات البحث (SEO Suite API)

#### `GET|POST /api/admin/seo/meta`
* **الوظيفة:** إدارة الميتا تاج لكل صفحة أو مقال.
* **البيانات المدعومة:** `slug`, `titleAr`, `titleEn`, `descriptionAr`, `descriptionEn`, `canonicalUrl`, `robots`, `ogImage`, `schemaType`.

#### `GET|POST|DELETE /api/admin/seo/redirects`
* **الوظيفة:** محرك توجيه الروابط 301 (دائم) و 302 (مؤقت).
* **Request Body (POST):**
  ```json
  { "sourceUrl": "/old-page", "destinationUrl": "/new-page", "type": 301, "enabled": true }
  ```

#### `GET|POST|DELETE /api/admin/seo/robots`
* **الوظيفة:** توليد وقراءة قواعد `robots.txt` ديناميكياً من قاعدة البيانات بحسب الـ User-Agent والمسار.

#### `GET|POST|DELETE /api/admin/seo/schema`
* **الوظيفة:** حقن أكواد JSON-LD Structured Data لكل صفحة لتعريف أنواع مثل `Article`, `Product`, `FAQPage`, `LocalBusiness`.

#### `POST /api/admin/seo/analyze`
* **الوظيفة:** فحص On-Page لحظي لمحتوى الرابط وحساب طول العناوين ونسبة الكلمات المفتاحية وسرعة الصفحة وإرجاع نقاط الضعف.

---

### 3.3 المدونة ونظام استقطاب العملاء (Blog & Gated Leads API)

#### `GET|POST /api/blog/posts`
* **الوظيفة:** جلب المقالات أو إنشاء مقال جديد.
* **دعم المحتوى الحصري المقفول (Gated Content Engine):**
  * الحقول: `isGated: boolean`, `gatedContent: string`, `ctaType: string`.
  * يتم إخفاء المحتوى الحصري من واجهة الزائر العادي ولا يُعرض إلا بعد إدخال بياناته.

#### `POST /api/leads/capture`
* **الوظيفة:** استقبال بيانات العميل الراغب في فتح المحتوى المقفول أو التقرير التسويقي.
* **Request Payload:**
  ```json
  { "name": "أحمد", "email": "ahmed@example.com", "phone": "0501234567", "source": "blog_slug_gated" }
  ```
* **السلوك الإضافي:** حفظ الليد في جدول `CapturedLead` ثم إرسال تنبيه واتساب مباشر إلى رقم الإدارة.

#### `GET /api/blog/cron` و `/api/cron/blog`
* **الصلاحية:** محمي بـ `Authorization: Bearer <CRON_SECRET>`.
* **الوظيفة:** فحص المقالات المجدولة ونشر المقالات التي حان وقتها تلقائياً.

---

### 3.4 محرك المحادثات والذكاء الاصطناعي (AI Chatbot API)

#### `POST /api/chat`
* **الوظيفة:** الشات بوت الذكي الخاص بالخدمات والمبيعات.
* **Request Payload:**
  ```json
  {
    "message": "كم سعر باقة النمو عندكم؟",
    "language": "ar",
    "history": [
      { "user": "السلام عليكم", "bot": "يا هلا بك! حياك الله في دي آرو، تفضل كيف أقدر أخدمك؟" }
    ]
  }
  ```
* **سلسلة التراجع والتنفيذ (Execution Pipeline):**
  1. **المحاولة الأولى (Local Fast Ollama):** استدعاء `http://ollama:11434/api/chat` بموديل `qwen2.5:3b` بمهلة أقصاها 5 ثوانٍ.
  2. **المحاولة الثانية (Local Secondary):** في حال عدم التوفر، يجرب موديل `glm4:latest` محلياً.
  3. **المحاولة الثالثة (Cloud Zhipu AI):** في حال توقف سيرفر أولاما، يتم التحويل تلقائياً لواجهة `https://open.bigmodel.cn/api/paas/v4/chat/completions`.
  4. **المحاولة الرابعة (Fallback Template):** في حال انقطاع الإنترنت أو فشل كل المحركات، يرجع رد طوارئ رسمي يوجه الزائر لرابط الواتساب المباشر: `https://wa.me/966500466349`.

---

### 3.5 المتجر الإلكتروني التجريبي (E-Commerce Store API)

#### `GET|POST /api/store/products`
* **الوظيفة:** فهرس المنتجات الرقمية والخدمات.

#### `POST /api/store/coupons/validate`
* **الوظيفة:** فحص كود الخصم وإرجاع القيمة المخصومة والنوع (نسبة أو مبلغ مقطوع).

#### `POST /api/store/checkout/stripe`
* **الوظيفة:** إنشاء جلسة دفع Stripe Payment Intent بناءً على السلة.

#### `POST /api/store/checkout/webhook`
* **الوظيفة:** استقبال إشعار السداد من Stripe (`checkout.session.completed`)، والتأكد من توقيع الطلب عبر `STRIPE_WEBHOOK_SECRET` ثم تحديث حالة الطلب إلى `paid` وتفعيل روابط التحميل.

---

### 3.6 الإشعارات والاتصال الخارجي (Notifications API)

#### `POST /api/contact`
* **الوظيفة:** استلام بيانات نموذج الاتصال العام.
* **السلوك الداخلي:**
  1. إرسال بريد إلكتروني مفصل إلى `CONTACT_RECIPIENT` عبر Nodemailer.
  2. إرسال رسالة نصية فورية عبر Meta WhatsApp Cloud API إلى جوال المبيعات المعتمد.

#### `POST /api/whatsapp-notify`
* **الوظيفة:** إرسال إشعار خادمي موحد عبر WhatsApp Cloud API (Graph API v21.0).

---

## 4. تدقيق وإصلاح أخطاء الأنواع (TypeScript Compilation Errors)

هذه الأخطاء تم استخراجها عبر تشغيل `npx tsc --noEmit`، وهي المسؤولة عن تعطل بناء Docker (`npm run build`):

### المشكلة 1: تصدير دالة مساعدة داخل Route Handler
* **الملف:** [app/api/admin/auth/route.ts](file:///c:/Users/omara/Music/mama%20list/Darrow/digital-marketing-d-arrow--main/app/api/admin/auth/route.ts#L20)
* **الخطأ:** `TS2344: Type does not satisfy constraint '{ [x: string]: never; }'`
* **السبب:** وجود `export function verifyToken(token: string)` داخل ملف المسار. معمارية Next.js App Router تمنع تصدير أي دوال غير دوال HTTP Methods (`GET`, `POST`, إلخ).
* **خطوات الإصلاح:**
  1. إنشاء ملف [lib/auth.ts](file:///c:/Users/omara/Music/mama%20list/Darrow/digital-marketing-d-arrow--main/lib/auth.ts) ونقل دالتي `createToken` و `verifyToken` إليه.
  2. عمل `import { verifyToken, createToken } from '@/lib/auth'` داخل `route.ts`.

### المشكلة 2: عدم تطابق قيم الثيمات في المتجر
* **الملفات:**
  * [components/demo/store/LiveThemeDrawer.tsx](file:///c:/Users/omara/Music/mama%20list/Darrow/digital-marketing-d-arrow--main/components/demo/store/LiveThemeDrawer.tsx#L104)
  * [app/(main)/demo/store/admin/page.tsx](file:///c:/Users/omara/Music/mama%20list/Darrow/digital-marketing-d-arrow--main/app/(main)/demo/store/admin/page.tsx#L328)
* **الخطأ:** `TS2322: Type '"cyber-cyan"' / '"luxury-rose"' / '"titanium-silver"' is not assignable to type 'ThemePreset'`
* **السبب:** الواجهة تدعم هذه الثيمات الثلاثة ولكن لم تتم إضافتها إلى تعريف النوع في `StoreContext.tsx`.
* **خطوات الإصلاح:**
  تعديل السطر 63 في [components/demo/store/StoreContext.tsx](file:///c:/Users/omara/Music/mama%20list/Darrow/digital-marketing-d-arrow--main/components/demo/store/StoreContext.tsx#L63) ليصبح:
  ```ts
  export type ThemePreset =
    | 'neon-phosphor'
    | 'emerald-royal'
    | 'luxury-dark'
    | 'gold-vip'
    | 'modern-purple'
    | 'midnight-blue'
    | 'espresso-amber'
    | 'cyber-cyan'
    | 'luxury-rose'
    | 'titanium-silver';
  ```

### المشكلة 3: حقول تراخيص فال الإلزامية في عقود العقار
* **الملف:** [components/demo/real-estate/AdminClient.tsx](file:///c:/Users/omara/Music/mama%20list/Darrow/digital-marketing-d-arrow--main/components/demo/real-estate/AdminClient.tsx#L149)
* **الخطأ:** `TS2345: Argument of type ... is missing the following properties: falLicenseNumber, adLicenseNumber`
* **السبب:** تم تعديل واجهة `DemoProperty` لتشمل أرقام ترخيص فال والإعلان العقاري السعودي كحقول إجبارية، بينما كائن الإضافة في الواجهة لا يمررها.
* **خطوات الإصلاح:**
  في [components/demo/real-estate/RealEstateContext.tsx](file:///c:/Users/omara/Music/mama%20list/Darrow/digital-marketing-d-arrow--main/components/demo/real-estate/RealEstateContext.tsx)، جعل الحقلين اختياريين:
  ```ts
  falLicenseNumber?: string;
  adLicenseNumber?: string;
  ```

### المشكلة 4: خصائص مفقودة في إعدادات المنظومة العقارية
* **الملفات:**
  * [components/demo/real-estate/HomeClient.tsx](file:///c:/Users/omara/Music/mama%20list/Darrow/digital-marketing-d-arrow--main/components/demo/real-estate/HomeClient.tsx#L151)
  * [components/demo/real-estate/DetailClient.tsx](file:///c:/Users/omara/Music/mama%20list/Darrow/digital-marketing-d-arrow--main/components/demo/real-estate/DetailClient.tsx#L163)
* **الخطأ:** `TS2339: Property 'siteName' / 'tagline' / 'heroTitle' / 'heroSubtitle' does not exist on type 'RESettings'`
* **السبب:** الواجهة تستدعي هذه الخصائص لعرض الترويسة، لكن نوع `RESettings` لا يحتوي إلا على `agencyName`, `slogan`, `phone`, `themePreset`.
* **خطوات الإصلاح:**
  تحديث واجهة `RESettings` في [RealEstateContext.tsx](file:///c:/Users/omara/Music/mama%20list/Darrow/digital-marketing-d-arrow--main/components/demo/real-estate/RealEstateContext.tsx#L18) لدعم هذه الحقول اختيارياً:
  ```ts
  export interface RESettings {
    agencyName: string;
    slogan: string;
    phone: string;
    themePreset: ReThemePreset;
    siteName?: string;
    tagline?: string;
    heroTitle?: string;
    heroSubtitle?: string;
  }
  ```

### المشكلة 5: ملفات المسودات في مجلد `scratch/`
* **الملفات:** `scratch/bidi-text.tsx` و `scratch/home-contact-section.tsx`.
* **الخطأ:** `TS2307: Cannot find module '@/lib/format-digits'` و `TS2305: Module '@prisma/client' has no exported member 'HomePageSection'`
* **السبب:** ملفات تجريبية قديمة خارج مسار التطبيق الفعلي، ولكن يتم شملها بالبناء لأن `tsconfig.json` لا يستثني مجلد `scratch`.
* **خطوات الإصلاح:**
  تعديل [tsconfig.json](file:///c:/Users/omara/Music/mama%20list/Darrow/digital-marketing-d-arrow--main/tsconfig.json#L33) لإضافة `"scratch"` إلى قائمة الاستثناء:
  ```json
  "exclude": ["node_modules", "scratch"]
  ```

---

## 5. مصفوفة إعدادات البيئة لبيئة الـ VPS (.env Specification)

جميع المتغيرات يتم تمريرها لحاوية التطبيق عبر `docker-compose.yml`:

```ini
# =============================================================================
# D-Arrow Production Environment Config (Linux VPS / Docker)
# =============================================================================

# النطاق والـ URLs العامة
NEXT_PUBLIC_APP_URL=https://d-arrow.com
NEXT_PUBLIC_API_URL=https://d-arrow.com

# أسرار لوحة التحكم والمصادقة
ADMIN_PASSWORD=your_secure_admin_password
JWT_SECRET=generate_64_char_random_hex_string
CRON_SECRET=generate_random_secret_for_cron

# قاعدة بيانات PostgreSQL (الداخلية للحاوية)
POSTGRES_USER=darrow
POSTGRES_PASSWORD=your_db_password
POSTGRES_DATABASE=darrow
DATABASE_URL="postgresql://darrow:your_db_password@d-arrow-postgres:5432/darrow?schema=public"

# إشعارات واتساب الرسمية (Meta Cloud API)
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAAG...
WHATSAPP_RECIPIENT_NUMBER=966500466349

# سيرفر البريد (Nodemailer SMTP)
CONTACT_RECIPIENT=info@d-arrow.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="D-Arrow <noreply@d-arrow.com>"

# محركات الذكاء الاصطناعي (حسب المتاح)
OLLAMA_BASE_URL=http://ollama:11434
ZAI_API_BASE=https://open.bigmodel.cn/api/paas/v4/chat/completions
ZAI_API_KEY=your_zhipu_api_key

# المتجر والدفع الإلكتروني (Stripe)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
