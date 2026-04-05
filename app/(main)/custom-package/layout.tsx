import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Custom Package - D Arrow | Build Your Perfect Marketing Solution',
  description: 'Design your custom digital marketing package with D Arrow. Mix and match services like SEO, web design, branding, social media, and app development. Get tailored solutions for your unique business needs.',
  keywords: 'custom marketing package, build your own package, custom digital marketing, tailored marketing solutions, bespoke services, professional marketing bundles',
  authors: [{ name: 'D Arrow Digital' }],
  creator: 'D Arrow Digital',
  publisher: 'D Arrow Digital',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'Digital Marketing',
  classification: 'Business Services',
  openGraph: {
    title: 'Custom Package - D Arrow | Build Your Perfect Marketing Solution',
    description: 'Create your custom digital marketing package by selecting the services that matter most to your business growth.',
    url: 'https://d-arrow.com/custom-package',
    type: 'website',
    locale: 'en_US',
    siteName: 'D Arrow - Digital Marketing Agency',
    images: [
      {
        url: 'https://d-arrow.com/Darrow-1.png',
        width: 1200,
        height: 630,
        alt: 'D Arrow Custom Package',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Package - D Arrow Digital Marketing',
    description: 'Build your perfect marketing solution with custom service packages',
    images: ['https://d-arrow.com/Darrow-1.png'],
  },
  alternates: {
    canonical: 'https://d-arrow.com/custom-package',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
