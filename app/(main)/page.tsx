
import type { Metadata } from 'next';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import LazySection from '@/components/LazySection';
import { getSeoMetadata } from '@/lib/seo/metadata';

// Lazy load below-fold components with loading priority
const AboutCompany = dynamic(() => import('@/components/AboutCompany'), {
  loading: () => <div className="py-8 lg:py-16 bg-gray-900" />,
  ssr: true,
});

const Process = dynamic(() => import('@/components/Process'), {
  loading: () => <div className="py-8 lg:py-16 bg-gray-900" />,
  ssr: true,
});

const CTA = dynamic(() => import('@/components/CTA'), {
  loading: () => <div className="py-8 lg:py-12 bg-gray-900" />,
  ssr: true,
});

const PartnersInSuccess = dynamic(() => import('@/components/PartnersInSuccess'), {
  loading: () => <div className="py-8 lg:py-16 bg-gray-900" />,
  ssr: true,
});

const Vision2030 = dynamic(() => import('@/components/Vision2030'), {
  loading: () => <div className="py-8 lg:py-16 bg-gray-900" />,
  ssr: true,
});



export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/');
}

// Enable ISR with 3600 seconds (1 hour) revalidation
export const revalidate = 3600;

export default function Home() {
  return (
    <main className="scroll-smooth">
      {/* JSON-LD Schema for WebSite and WebPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              '@id': 'https://d-arrow.com/#website',
              url: 'https://d-arrow.com',
              name: 'D Arrow Digital Marketing Agency',
              description: 'Award-winning digital marketing agency providing comprehensive digital solutions including SEO, web design, branding, app development, and digital marketing services.',
              publisher: {
                '@id': 'https://d-arrow.com/#organization',
              },
              inLanguage: ['en', 'ar'],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              '@id': 'https://d-arrow.com/#webpage',
              url: 'https://d-arrow.com',
              name: 'D Arrow - Digital Marketing Agency | SEO, Web Design, Branding',
              isPartOf: {
                '@id': 'https://d-arrow.com/#website',
              },
              about: {
                '@id': 'https://d-arrow.com/#organization',
              },
              description: 'Transform your business with D Arrow\'s digital marketing solutions. Expert SEO, web design, branding, and digital marketing services.',
              inLanguage: ['en', 'ar'],
            }
          ]),
        }}
      />
      <Hero />
      <Stats />

      <LazySection>
        <AboutCompany />
      </LazySection>
      
      <LazySection>
        <Vision2030 />
      </LazySection>

      <LazySection>
        <Process />
      </LazySection>

      <LazySection>
        <CTA />
      </LazySection>

      <LazySection>
        <PartnersInSuccess />
      </LazySection>
    </main>
  );
}
