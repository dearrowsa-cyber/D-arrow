import type { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import prisma from '@/lib/prisma';

/** Default metadata per slug — used as fallback when no DB entry exists */
const DEFAULTS: Record<string, Metadata> = {
  '/': {
    title: 'D Arrow - Next-Generation Digital Marketing Agency | Get Results Fast',
    description: 'Award-winning digital marketing agency delivering measurable results through SEO, web design, branding, and digital marketing solutions. Get your free consultation today.',
    keywords: 'digital marketing, SEO services, web design agency, branding services, marketing agency',
  },
  '/services': {
    title: 'Digital Marketing Services & Solutions - Get Custom Services - D Arrow',
    description: 'Explore our comprehensive digital marketing services and solutions including SEO optimization, web design, app development, branding, social media marketing.',
    keywords: 'digital marketing services, SEO services, web design, app development, branding services',
  },
  '/pricing': {
    title: 'Pricing Plans - D Arrow | Affordable Digital Marketing Solutions',
    description: 'Explore flexible pricing plans for digital marketing, web design, branding, and more. Starting from 800 SAR. Custom packages available.',
    keywords: 'digital marketing pricing, web design pricing, branding packages, SEO pricing',
  },
  '/process': {
    title: 'Digital Marketing Process | Get Our Step-by-Step Methodology - D Arrow',
    description: 'Discover our proven digital marketing process. Get expert guidance through every step from initial consultation to measurable results.',
    keywords: 'digital marketing process, marketing methodology, strategy development',
  },
  '/contact': {
    title: 'Contact Us | D Arrow - Free Digital Marketing Consultation',
    description: "Get in touch with D Arrow's digital marketing experts. Receive a free consultation and learn how we can help grow your business.",
    keywords: 'contact digital marketing agency, free consultation, marketing inquiry',
  },
  '/why-us': {
    title: 'Why Choose D Arrow? | Trusted Digital Marketing Agency with Proven Results',
    description: 'Discover why 500+ businesses trust D Arrow for their digital marketing needs. Data-driven strategies and expert team.',
    keywords: 'why choose us, digital marketing agency, expert team, proven results',
  },
  '/blog': {
    title: 'Blog - D Arrow | Digital Marketing Insights & Tips',
    description: 'Read the latest digital marketing insights, tips, and strategies from D Arrow experts.',
    keywords: 'digital marketing blog, marketing tips, SEO insights',
  },
  '/provisions': {
    title: 'Our Projects - D Arrow Digital Marketing Agency',
    description: 'Explore our portfolio of successful projects showcasing our expertise in digital marketing, web design, and brand development.',
    keywords: 'portfolio, projects, case studies, digital marketing projects',
  },
  '/custom-package': {
    title: 'Custom Package - D Arrow | Build Your Perfect Marketing Solution',
    description: 'Design your custom digital marketing package with D Arrow. Mix and match services like SEO, web design, branding, and more.',
    keywords: 'custom marketing package, tailored marketing solutions, bespoke services',
  },
  '/privacy': {
    title: 'سياسة الخصوصية | D Arrow',
    description: 'سياسة الخصوصية لموقع D Arrow للتسويق الرقمي. تعرف على كيفية جمع واستخدام وحماية بياناتك الشخصية.',
    keywords: 'سياسة الخصوصية, حماية البيانات, D Arrow',
  },
  '/cookies': {
    title: 'سياسة ملفات تعريف الارتباط | D Arrow',
    description: 'سياسة ملفات تعريف الارتباط (الكوكيز) لموقع D Arrow. تعرف على أنواع الكوكيز المستخدمة وكيفية التحكم فيها.',
    keywords: 'سياسة الكوكيز, ملفات تعريف الارتباط, D Arrow',
  },
  '/store': {
    title: 'المتجر | D Arrow - منتجات وخدمات رقمية',
    description: 'تصفح منتجاتنا وخدماتنا الرقمية الجاهزة. قوالب، أدوات تسويقية، وحلول رقمية احترافية.',
    keywords: 'متجر رقمي, منتجات رقمية, أدوات تسويقية',
  },
};

/**
 * Fetches SEO metadata from the database for a given slug,
 * falling back to hardcoded defaults when the slug has no DB entry.
 */
export async function getSeoMetadata(slug: string): Promise<Metadata> {
  noStore(); // Always fetch fresh SEO data from DB
  const fallback = DEFAULTS[slug] ?? {};

  try {
    const entry = await prisma.seoMeta.findUnique({ where: { slug } });

    if (!entry) return fallback;

    // Use title directly — it IS the Arabic title as edited from admin dashboard
    // titleAr is a legacy field, only use as secondary fallback
    const titleToUse = entry.title || entry.titleAr;
    const descriptionToUse = entry.description || entry.descriptionAr;

    // Merge: DB values override defaults; nullish DB fields keep default
    const metadata: Metadata = {
      ...fallback,
      ...(titleToUse && { title: titleToUse }),
      ...(descriptionToUse && { description: descriptionToUse }),
    };

    if (entry.canonicalUrl) {
      metadata.alternates = { canonical: entry.canonicalUrl };
    }

    if (entry.robots) {
      const parts = entry.robots.split(',').map(r => r.trim().toLowerCase());
      metadata.robots = {
        index: !parts.includes('noindex'),
        follow: !parts.includes('nofollow'),
        googleBot: {
          index: !parts.includes('noindex'),
          follow: !parts.includes('nofollow'),
          'max-video-preview': -1,
          'max-image-preview': 'large' as const,
          'max-snippet': -1,
        },
      };
    }

    // OpenGraph: use ogTitle > title, ogDescription > description
    const ogTitleToUse = entry.ogTitle || entry.ogTitleAr || titleToUse;
    const ogDescToUse = entry.ogDescription || entry.ogDescriptionAr || descriptionToUse;

    // Default image fallback if none in DB
    const fallbackImage = 'https://d-arrow.com/og-image.jpg?v=2';
    const ogImageToUse = entry.ogImage || fallbackImage;

    if (ogTitleToUse || ogDescToUse || entry.ogImage) {
      metadata.openGraph = {
        type: 'website',
        locale: 'ar_SA',
        siteName: 'D Arrow - Digital Marketing Agency',
        url: `https://d-arrow.com${slug === '/' ? '' : slug}`,
        ...(ogTitleToUse && { title: ogTitleToUse }),
        ...(ogDescToUse && { description: ogDescToUse }),
        images: [{ url: ogImageToUse, width: 1200, height: 630 }],
      };
    }

    if (entry.twitterCard) {
      metadata.twitter = {
        card: entry.twitterCard as any,
        ...(ogTitleToUse && { title: ogTitleToUse }),
        ...(ogDescToUse && { description: ogDescToUse }),
        images: [ogImageToUse],
      };
    }

    return metadata;
  } catch (error) {
    console.error(`[SEO] Error fetching metadata for ${slug}:`, error);
    return fallback;
  }
}
