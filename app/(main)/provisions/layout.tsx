import type { Metadata } from 'next';

export const revalidate = 60; // Revalidate every minute to sync SEO changes from DB
import { getSeoMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/provisions');
}

export default function ProvisionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
