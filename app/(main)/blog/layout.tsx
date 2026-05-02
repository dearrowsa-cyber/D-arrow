import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المدونة | D Arrow - مقالات تسويق رقمي',
  description: 'مقالات ونصائح في التسويق الرقمي، تحسين محركات البحث، إدارة السوشيال ميديا، وأحدث اتجاهات التسويق الإلكتروني.',
  keywords: 'مدونة تسويق رقمي, مقالات SEO, نصائح سوشيال ميديا, تسويق إلكتروني',
  openGraph: {
    title: 'المدونة | D Arrow',
    description: 'أحدث المقالات والنصائح في عالم التسويق الرقمي من فريق D Arrow.',
    url: 'https://d-arrow.com/blog',
    images: [{ url: 'https://d-arrow.com/DR-LOGO.png', width: 1200, height: 630, alt: 'D Arrow Blog' }],
  },
  alternates: { canonical: 'https://d-arrow.com/blog' },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
