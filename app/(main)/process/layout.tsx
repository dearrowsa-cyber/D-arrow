import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'كيف نعمل',
  description: 'تعرف على عملية العمل في D Arrow: من الاستشارة الأولية والتخطيط الاستراتيجي إلى التنفيذ والتحليل. نتبع منهجية منظمة لضمان نجاح مشروعك.',
  keywords: 'عملية التسويق الرقمي, منهجية العمل, استشارة تسويقية, تخطيط استراتيجي',
  openGraph: {
    title: 'كيف نعمل',
    description: 'عملية عمل منظمة وشفافة لضمان نجاح مشروعك الرقمي من البداية إلى النهاية.',
    url: 'https://d-arrow.com/process',
    images: [{ url: 'https://d-arrow.com/og-image.jpg', width: 1200, height: 630, alt: 'D Arrow Process' }],
  },
  alternates: { canonical: 'https://d-arrow.com/process' },
};

export default function ProcessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
