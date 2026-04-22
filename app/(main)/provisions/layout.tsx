import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/provisions');
}

export default function ProvisionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
