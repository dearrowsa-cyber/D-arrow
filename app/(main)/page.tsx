
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



export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/');
}

// Enable ISR with 3600 seconds (1 hour) revalidation
export const revalidate = 3600;

export default function Home() {
  return (
    <main className="scroll-smooth">
      <Hero />
      <Stats />

      <LazySection>
        <AboutCompany />
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
