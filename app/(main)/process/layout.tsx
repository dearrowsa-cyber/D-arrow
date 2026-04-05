import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Marketing Process | Get Our Step-by-Step Methodology - D Arrow',
  description: 'Discover our proven digital marketing process. Get expert guidance through every step from initial consultation, analysis, strategy development, execution to measurable results.',
  keywords: 'digital marketing process, marketing methodology, process steps, market analysis, strategy development, marketing execution, digital marketing steps',
  authors: [{ name: 'D Arrow Digital' }],
  creator: 'D Arrow Digital',
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
  openGraph: {
    title: 'Our Process - D Arrow | Step-by-Step Digital Marketing Approach',
    description: 'Discover how D Arrow executes digital marketing strategies with proven methodology and transparent reporting.',
    url: 'https://d-arrow.com/process',
    type: 'website',
    locale: 'en_US',
    siteName: 'D Arrow - Digital Marketing Agency',
    images: [
      {
        url: 'https://d-arrow.com/Darrow-1.png',
        width: 1200,
        height: 630,
        alt: 'D Arrow Process',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Process - D Arrow Digital Marketing',
    description: 'Learn about our step-by-step digital marketing process',
    images: ['https://d-arrow.com/Darrow-1.png'],
  },
  alternates: {
    canonical: 'https://d-arrow.com/process',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
