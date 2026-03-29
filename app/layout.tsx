import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

import { LanguageProvider } from '@/components/LanguageProvider';
import { ThemeProvider } from '@/components/ThemeProvider';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'optional',
});

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-tajawal',
  display: 'optional',
});

export const revalidate = 86400; // 24 hours caching (LiteSpeed equivalent for Next)

export const metadata: Metadata = {
  title: "D Arrow - Digital Marketing Agency | SEO, Web Design, Branding",
  description: "Transform your business with D Arrow's digital marketing solutions. Expert SEO, web design, branding, and digital marketing services. Get your free consultation today.",
  keywords: "digital marketing, SEO services, web design, branding, social media marketing, digital marketing agency",
  authors: [{ name: "D Arrow Digital" }],
  creator: "D Arrow Digital",
  publisher: "D Arrow Digital",
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
  classification: 'Business',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://d-arrow.com',
    siteName: 'D Arrow - Digital Marketing Agency',
    title: 'D Arrow - Digital Marketing Agency | SEO, Web Design, Branding',
    description: 'Transform your business with D Arrow\'s digital marketing solutions. Expert SEO, web design, branding, and digital marketing services.',
    images: [
      {
        url: 'https://d-arrow.com/DR-LOGO.png',
        width: 1200,
        height: 630,
        alt: 'D Arrow Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'D Arrow - Digital Marketing Agency',
    description: 'Transform your business with D Arrow\'s digital marketing solutions',
    images: ['https://d-arrow.com/DR-LOGO.png'],
  },
  icons: {
    icon: [
      { url: "/DR-LOGO.png", sizes: "16x16", type: "image/png" },
      { url: "/DR-LOGO.png", sizes: "32x32", type: "image/png" },
      { url: "/DR-LOGO.png", sizes: "48x48", type: "image/png" },
    ],
    shortcut: "/DR-LOGO.png",
    apple: "/DR-LOGO.png",
  },
  alternates: {
    canonical: 'https://d-arrow.com',
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE', // Google Search Console se code lagega
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`lang-ar ${cairo.variable} ${tajawal.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FF4D6D" />
        
        {/* Preconnect to external resources for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical fonts to completely eliminate LCP delay (saving ~4000ms) */}
        <link rel="preload" href="/fonts/Gilroy-Bold.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/29ltbukra.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        
        {/* JSON-LD Schema Markup for Organization & LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': 'https://d-arrow.com',
              name: 'D Arrow Digital',
              url: 'https://d-arrow.com',
              logo: 'https://d-arrow.com/Darrow-1.png',
              description: 'Award-winning digital marketing agency providing comprehensive digital solutions including SEO, web design, branding, app development, and digital marketing services for businesses across the Gulf region.',
              image: 'https://d-arrow.com/Darrow-1.png',
              foundingDate: '2015',
              foundingLocation: 'Saudi Arabia',
              sameAs: [
                'https://www.facebook.com/darrowdigital',
                'https://www.instagram.com/darrow.co/',
                'https://www.linkedin.com/company/darrowdigital',
                'https://www.twitter.com/darrowdigital',
              ],
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  contactType: 'Customer Service',
                  telephone: '+966138121213',
                  email: 'info@d-arrow.com',
                  availableLanguage: ['en', 'ar'],
                  areaServed: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM'],
                  hoursAvailable: 'Mo-Fr 09:00-18:00',
                }
              ],
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Eastern Province, Mubarraz, Dhahran St., Bu Khamseen Tower 8560, Office 401',
                addressLocality: 'Mubarraz',
                addressRegion: 'Eastern Province',
                postalCode: '31982',
                addressCountry: 'SA',
              },
              areaServed: [
                {
                  '@type': 'State',
                  name: 'Saudi Arabia'
                },
                {
                  '@type': 'State',
                  name: 'United Arab Emirates'
                },
                {
                  '@type': 'State',
                  name: 'Kuwait'
                },
                {
                  '@type': 'State',
                  name: 'Qatar'
                },
                {
                  '@type': 'State',
                  name: 'Bahrain'
                },
                {
                  '@type': 'State',
                  name: 'Oman'
                }
              ],
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'SAR',
                offerCount: '20+',
                url: 'https://d-arrow.com/pricing',
              },
              numberOfEmployees: {
                '@type': 'QuantitativeValue',
                minValue: '10',
                maxValue: '50',
              },
              knowsAbout: [
                'Digital Marketing',
                'Search Engine Optimization',
                'Web Design',
                'App Development',
                'Branding',
                'Social Media Marketing',
                'Content Marketing',
                'Real Estate Marketing',
                'Software Development',
              ],
            }),
          }}
        />

        {/* JSON-LD Schema for LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              '@id': 'https://d-arrow.com#localbusiness',
              name: 'D Arrow Digital Marketing Agency',
              image: 'https://d-arrow.com/Darrow-1.png',
              url: 'https://d-arrow.com',
              telephone: '+966138121213',
              email: 'info@d-arrow.com',
              priceRange: '800-50000 SAR',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Bu Khamseen Tower 8560, Office 401',
                addressLocality: 'Mubarraz',
                addressRegion: 'Eastern Province',
                postalCode: '31982',
                addressCountry: 'SA',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: '26.1889',
                longitude: '49.5961',
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '18:00',
              },
              serviceType: [
                'Digital Marketing',
                'SEO Services',
                'Web Design',
                'App Development',
                'Branding',
                'Social Media Marketing',
              ],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '500+',
                bestRating: '5',
                worstRating: '1',
              },
            }),
          }}
        />

        {/* JSON-LD Schema for FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What digital marketing services does D Arrow provide?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'D Arrow provides comprehensive digital marketing services including SEO, web design, app development, branding, social media marketing, email marketing, PPC advertising, and real estate marketing solutions.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Does D Arrow offer free consultation?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, D Arrow offers free consultation to discuss your business needs and recommend the most suitable digital marketing solutions.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What is the price range for D Arrow services?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'D Arrow services start from 800 SAR monthly with custom packages available. Visit our pricing page for detailed information.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Does D Arrow work with businesses outside Saudi Arabia?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, D Arrow serves clients across the Gulf region including UAE, Kuwait, Qatar, Bahrain, and Oman, as well as international clients.',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </LanguageProvider>
        </ThemeProvider>
       
      </body>
    </html>
  );
}
