import type { Metadata } from 'next';
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
};

/**
 * Fetches SEO metadata from the database for a given slug,
 * falling back to hardcoded defaults when the slug has no DB entry.
 */
export async function getSeoMetadata(slug: string): Promise<Metadata> {
  const fallback = DEFAULTS[slug] ?? {};

  try {
    const entry = await prisma.seoMeta.findUnique({ where: { slug } });

    if (!entry) return fallback;

    // Merge: DB values override defaults; nullish DB fields keep default
    const metadata: Metadata = {
      ...fallback,
      ...(entry.title && { title: entry.title }),
      ...(entry.description && { description: entry.description }),
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

    if (entry.ogTitle || entry.ogDescription || entry.ogImage) {
      metadata.openGraph = {
        type: 'website',
        locale: 'en_US',
        siteName: 'D Arrow - Digital Marketing Agency',
        url: `https://d-arrow.com${slug === '/' ? '' : slug}`,
        ...(entry.ogTitle && { title: entry.ogTitle }),
        ...(entry.ogDescription && { description: entry.ogDescription }),
        ...(entry.ogImage && {
          images: [{ url: entry.ogImage, width: 1200, height: 630 }],
        }),
      };
    }

    if (entry.twitterCard) {
      metadata.twitter = {
        card: entry.twitterCard as any,
        ...(entry.ogTitle && { title: entry.ogTitle }),
        ...(entry.ogDescription && { description: entry.ogDescription }),
        ...(entry.ogImage && { images: [entry.ogImage] }),
      };
    }

    return metadata;
  } catch (error) {
    console.error(`[SEO] Error fetching metadata for ${slug}:`, error);
    return fallback;
  }
}
