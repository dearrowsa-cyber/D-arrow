import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why Choose D Arrow? | Trusted Digital Marketing Agency with Proven Results',
  description: 'Discover why 500+ businesses trust D Arrow for their digital marketing needs. Data-driven strategies, expert team with 20+ years experience, 24/7 support, and guaranteed results.',
  keywords: 'why choose us, digital marketing agency, expert digital marketing team, proven results, customer success stories, digital transformation partner, trusted marketing agency',
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
    title: 'Why Choose D Arrow? | Trusted Digital Marketing Agency',
    description: 'Join 500+ satisfied clients who trust D Arrow for data-driven digital marketing solutions with proven track record and expert support.',
    url: 'https://d-arrow.com/why-us',
    type: 'website',
    locale: 'en_US',
    siteName: 'D Arrow - Digital Marketing Agency',
    images: [
      {
        url: 'https://d-arrow.com/Darrow-1.png',
        width: 1200,
        height: 630,
        alt: 'Why Choose D Arrow',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Why Choose D Arrow Digital Marketing?',
    description: 'Trusted by 500+ businesses for proven digital marketing results',
    images: ['https://d-arrow.com/Darrow-1.png'],
  },
  alternates: {
    canonical: 'https://d-arrow.com/why-us',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
