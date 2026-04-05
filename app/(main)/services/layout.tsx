import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Digital Marketing Services & Solutions - Get Custom Services - D Arrow',
  description: 'Explore our comprehensive digital marketing services and solutions including SEO optimization, web design, app development, branding, social media marketing. Get custom marketing solutions tailored for your business.',
  keywords: 'digital marketing services, digital marketing solutions, SEO services, web design, app development, branding services, social media marketing, get custom services, digital transformation',
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
    title: 'Our Services - D Arrow | Digital Marketing, SEO & Web Design',
    description: 'Comprehensive digital marketing solutions including SEO, web design, branding, app development, and social media marketing that drive real results.',
    url: 'https://d-arrow.com/services',
    type: 'website',
    locale: 'en_US',
    siteName: 'D Arrow - Digital Marketing Agency',
    images: [
      {
        url: 'https://d-arrow.com/Darrow-1.png',
        width: 1200,
        height: 630,
        alt: 'D Arrow Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Services - D Arrow Digital Marketing',
    description: 'Professional digital marketing and web design services',
    images: ['https://d-arrow.com/Darrow-1.png'],
  },
  alternates: {
    canonical: 'https://d-arrow.com/services',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
