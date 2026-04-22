export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://d-arrow.com",
    "name": "D Arrow Digital",
    "url": "https://d-arrow.com",
    "logo": "https://d-arrow.com/DR-LOGO.png",
    "description": "Award-winning digital marketing agency providing comprehensive digital solutions including SEO, web design, branding, and marketing.",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+966138121213",
        "contactType": "Customer Service",
        "email": "info@d-arrow.com",
        "availableLanguage": ["en", "ar"]
      }
    ],
    "sameAs": [
      "https://www.facebook.com/darrowdigital",
      "https://www.instagram.com/darrow.co/",
      "https://www.linkedin.com/company/darrowdigital",
      "https://twitter.com/darrowdigital"
    ]
  };
}

export function generateArticleSchema(data: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.title,
    "description": data.description,
    "image": data.imageUrl || "https://d-arrow.com/DR-LOGO.png",
    "author": {
      "@type": "Organization",
      "name": data.authorName || "D Arrow Digital"
    },
    "publisher": {
      "@type": "Organization",
      "name": "D Arrow Digital",
      "logo": {
        "@type": "ImageObject",
        "url": "https://d-arrow.com/DR-LOGO.png"
      }
    },
    "datePublished": data.datePublished || new Date().toISOString(),
    "dateModified": data.dateModified || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": data.url
    }
  };
}

export function generateFAQSchema(questions: { question: string; answer: string }[]) {
  if (!questions || questions.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };
}
