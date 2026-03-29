
import type { Metadata } from 'next';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';

// Lazy load below-fold components with loading priority
const Process = dynamic(() => import('@/components/Process'), {
  loading: () => <div className="py-8 lg:py-16 bg-gray-900" />,
  ssr: false,
});

const CTA = dynamic(() => import('@/components/CTA'), {
  loading: () => <div className="py-8 lg:py-12 bg-gray-900" />,
  ssr: false,
});

const PartnersInSuccess = dynamic(() => import('@/components/PartnersInSuccess'), {
  loading: () => <div className="py-8 lg:py-16 bg-gray-900" />,
  ssr: false,
});

const Portfolio = dynamic(() => import('@/components/Portfolio'), {
  loading: () => <div className="py-8 lg:py-16 bg-gray-900" />,
  ssr: false,
});


export const metadata: Metadata = {
  title: 'D Arrow - Next-Generation Digital Marketing Agency | Get Results Fast',
  description: 'Award-winning digital marketing agency delivering measurable results through SEO, web design, branding, and digital marketing solutions. Get your free consultation today.',
  keywords: 'digital marketing, SEO services, web design agency, next-generation marketing solutions, deliver measurable results, branding services, marketing agency',
  openGraph: {
    title: 'D Arrow - Digital Marketing Agency | Transform Your Business',
    description: 'Award-winning digital marketing agency providing SEO, web design, branding, and digital marketing solutions.',
    url: 'https://d-arrow.com',
    siteName: 'D Arrow',
    images: [
      {
        url: 'https://d-arrow.com/Darrow-1.png',
        width: 1200,
        height: 630,
        alt: 'D Arrow Digital Marketing',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'D Arrow - Digital Marketing Agency',
    description: 'Transform your business with professional digital marketing solutions',
  },
  alternates: {
    canonical: 'https://d-arrow.com',
    languages: {
      'en-US': 'https://d-arrow.com',
      'ar-SA': 'https://d-arrow.com/ar',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

// Enable ISR with 3600 seconds (1 hour) revalidation
export const revalidate = 3600;

export default function Home() {
  return (
    <main className="scroll-smooth">
      <Hero />
      <Stats />
      <Process />
      <CTA />
      <PartnersInSuccess />
    </main>
  );
}
