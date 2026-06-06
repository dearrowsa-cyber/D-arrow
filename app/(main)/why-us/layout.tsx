import type { Metadata } from 'next';

export const revalidate = 60; // Revalidate every minute to sync SEO changes from DB
import { getSeoMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/why-us');
}

export default function WhyUsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
