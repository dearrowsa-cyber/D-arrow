import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'خدماتنا | D Arrow - وكالة تسويق رقمي',
  description: 'خدمات تسويق رقمي متكاملة: تحسين محركات البحث SEO، إدارة وسائل التواصل الاجتماعي، تصميم المواقع، تطوير التطبيقات، هوية العلامة التجارية، والإعلانات المدفوعة.',
  keywords: 'خدمات تسويق رقمي, SEO, تصميم مواقع, تطوير تطبيقات, هوية تجارية, إعلانات مدفوعة, سوشيال ميديا',
  openGraph: {
    title: 'خدماتنا | D Arrow - وكالة تسويق رقمي',
    description: 'خدمات تسويق رقمي متكاملة تشمل SEO وتصميم المواقع وإدارة السوشيال ميديا',
    url: 'https://d-arrow.com/services',
    images: [{ url: 'https://d-arrow.com/DR-LOGO.png', width: 1200, height: 630, alt: 'D Arrow Services' }],
  },
  alternates: { canonical: 'https://d-arrow.com/services' },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
