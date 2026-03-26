import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing Plans - D Arrow | Affordable Digital Marketing Solutions',
  description: 'Explore flexible pricing plans for digital marketing, web design, branding, and more. Starting from 800 SAR. Custom packages available. Get your free consultation today.',
  keywords: 'digital marketing pricing, web design pricing, branding packages, SEO pricing, affordable marketing solutions, custom packages, MENA marketing services, pricing plans',
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
    title: 'Pricing Plans - D Arrow | Affordable Digital Marketing Solutions',
    description: 'Explore our flexible pricing plans for digital marketing, web design, branding, and custom packages tailored to your business needs.',
    url: 'https://d-arrow.com/pricing/',
    type: 'website',
    locale: 'en_US',
    siteName: 'D Arrow - Digital Marketing Agency',
    images: [
      {
        url: 'https://d-arrow.com/Darrow-1.png',
        width: 1200,
        height: 630,
        alt: 'D Arrow Pricing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing Plans - D Arrow Digital Marketing',
    description: 'Affordable digital marketing pricing plans and custom packages',
    images: ['https://d-arrow.com/Darrow-1.png'],
  },
  alternates: {
    canonical: 'https://d-arrow.com/pricing/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
