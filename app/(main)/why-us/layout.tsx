import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/why-us');
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
