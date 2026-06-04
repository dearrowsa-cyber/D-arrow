import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { getSeoMetadata } = await import('@/lib/seo/metadata');
  return getSeoMetadata('/pricing');
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
