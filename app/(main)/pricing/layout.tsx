import type { Metadata } from 'next';

export const revalidate = 60; // Revalidate every minute to sync SEO changes from DB

export async function generateMetadata(): Promise<Metadata> {
  const { getSeoMetadata } = await import('@/lib/seo/metadata');
  return getSeoMetadata('/pricing');
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
