import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة ملفات تعريف الارتباط',
  description: 'سياسة ملفات تعريف الارتباط (الكوكيز) لموقع D Arrow. تعرف على أنواع الكوكيز المستخدمة وكيفية التحكم فيها.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'سياسة الكوكيز',
    description: 'سياسة ملفات تعريف الارتباط في D Arrow.',
    url: 'https://d-arrow.com/cookies',
  },
  alternates: { canonical: 'https://d-arrow.com/cookies' },
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
