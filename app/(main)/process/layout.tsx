import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/process');
}

export default function ProcessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
