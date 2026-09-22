'use client';

import ContactHero from '@/components/contact/ContactHero';
import ContactInfoCards from '@/components/contact/ContactInfoCards';
import ContactFormSection from '@/components/contact/ContactFormSection';
import ContactSocials from '@/components/contact/ContactSocials';
import ContactCTA from '@/components/contact/ContactCTA';

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* JSON-LD Schema for Contact/Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'D Arrow Digital Marketing',
            description: 'Digital Marketing Agency with 20+ years of experience',
            url: 'https://d-arrow.com',
            telephone: '+966138121213',
            email: 'info@d-arrow.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress:
                'Eastern Province, Al Ahsa, Mubarraz, Dhahran St., Bu Khamseen Tower 8560, Office 401',
              addressLocality: 'Al Mubarraz',
              addressRegion: 'Eastern Province',
              postalCode: '31982',
              addressCountry: 'SA',
            },
            areaServed: [
              { '@type': 'City', name: 'Al Khobar' },
              { '@type': 'City', name: 'Al Ahsa' },
              { '@type': 'State', name: 'SA' },
              { '@type': 'State', name: 'AE' },
              { '@type': 'State', name: 'KW' },
            ],
            priceRange: '$$',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: 4.9,
              reviewCount: 500,
            },
          }),
        }}
      />

      <ContactHero />
      <ContactInfoCards />
      <ContactFormSection />
      <ContactSocials />
      <ContactCTA />
    </div>
  );
}