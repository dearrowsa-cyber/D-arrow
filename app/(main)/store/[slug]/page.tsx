import { Metadata } from "next";
import StoreProductClient from "@/components/store/StoreProductClient";
import { notFound } from "next/navigation";
import { getProduct } from "@/features/store/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return { title: "المنتج غير موجود | D Arrow" };

  const title = product.nameAr || product.name;
  const description =
    product.summaryAr ||
    product.summaryEn ||
    product.keyHighlightAr ||
    product.keyHighlightEn;

  return {
    title: `${title} | D Arrow`,
    description,
    openGraph: {
      title,
      description,
      url: `https://d-arrow.com/store/${product.slug}`,
      type: "website",
      images: product.image
        ? [{ url: product.image, width: 1200, height: 630, alt: title }]
        : [
            {
              url: "https://d-arrow.com/og-image.jpg",
              width: 1200,
              height: 630,
              alt: "D Arrow Store",
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.image ? [product.image] : undefined,
    },
    alternates: {
      canonical: `https://d-arrow.com/store/${product.slug}`,
    },
  };
}

export default async function StoreProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nameAr || product.name,
    description:
      product.summaryAr ||
      product.summaryEn ||
      product.keyHighlightAr ||
      product.keyHighlightEn,
    image: product.image || "https://d-arrow.com/og-image.jpg",
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "SAR",
      availability: "https://schema.org/InStock",
      url: `https://d-arrow.com/store/${product.slug}`,
    },
    aggregateRating:
      product.reviewsCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewsCount,
          }
        : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://d-arrow.com/store/${product.slug}`,
    },
    inLanguage: ["ar", "en"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StoreProductClient product={product} />
    </>
  );
}