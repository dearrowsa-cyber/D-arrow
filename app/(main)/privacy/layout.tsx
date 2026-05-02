import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية',
  description: 'سياسة الخصوصية لموقع D Arrow للتسويق الرقمي. تعرف على كيفية جمع واستخدام وحماية بياناتك الشخصية.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'سياسة الخصوصية',
    description: 'سياسة الخصوصية وحماية البيانات في D Arrow.',
    url: 'https://d-arrow.com/privacy',
  },
  alternates: { canonical: 'https://d-arrow.com/privacy' },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
