import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | D Arrow - Free Digital Marketing Consultation',
  description: 'Get in touch with D Arrow\'s digital marketing experts. Receive a free consultation and learn how we can help grow your business. Call +966 13 812 1213 or email us.',
  keywords: 'contact digital marketing agency, free consultation, marketing inquiry, get in touch, business consultation, web design contact',
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
    title: 'Contact Us | D Arrow - Free Digital Marketing Consultation',
    description: 'Reach out to D Arrow for a free digital marketing consultation. Our experts are ready to help.',
    url: 'https://d-arrow.com/contact',
    type: 'website',
    locale: 'en_US',
    siteName: 'D Arrow - Digital Marketing Agency',
    images: [
      {
        url: 'https://d-arrow.com/Darrow-1.png',
        width: 1200,
        height: 630,
        alt: 'Contact D Arrow',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact D Arrow - Free Consultation',
    description: 'Get in touch with D Arrow for digital marketing services',
    images: ['https://d-arrow.com/Darrow-1.png'],
  },
  alternates: {
    canonical: 'https://d-arrow.com/contact',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
