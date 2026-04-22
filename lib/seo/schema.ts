type SchemaType = 'Article' | 'Product' | 'FAQPage' | 'Organization' | 'WebPage';

export function generateSchema(type: SchemaType, data: any): string {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  let schemaContent = {};

  switch (type) {
    case 'Article':
      schemaContent = {
        headline: data.title,
        description: data.description,
        image: data.image,
        author: {
          '@type': 'Person',
          name: data.authorName,
        },
        datePublished: data.publishedAt,
        dateModified: data.updatedAt,
      };
      break;
    case 'Product':
      schemaContent = {
        name: data.name,
        description: data.description,
        image: data.image,
        offers: {
          '@type': 'Offer',
          price: data.price,
          priceCurrency: data.currency || 'USD',
          availability: data.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      };
      break;
    case 'FAQPage':
      schemaContent = {
        mainEntity: data.faqs?.map((faq: any) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      };
      break;
    case 'Organization':
      schemaContent = {
         name: data.name,
         url: data.url,
         logo: data.logo,
         sameAs: data.socialLinks || []
      }
      break;
    case 'WebPage':
    default:
        schemaContent = {
            name: data.title,
            description: data.description,
        }
        break;
  }

  return JSON.stringify({ ...baseSchema, ...schemaContent });
}
