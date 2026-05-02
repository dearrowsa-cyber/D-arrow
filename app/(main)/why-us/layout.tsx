import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'لماذا تختارنا | D Arrow - مميزاتنا',
  description: 'لماذا تختار D Arrow؟ فريق خبير، نتائج مبنية على البيانات، دعم 24/7، حلول مخصصة، تقارير شفافة، وسجل حافل بالنجاحات في التسويق الرقمي.',
  keywords: 'لماذا D Arrow, مميزات التسويق الرقمي, فريق خبير, نتائج مضمونة',
  openGraph: {
    title: 'لماذا تختارنا | D Arrow',
    description: 'اكتشف لماذا D Arrow هي الخيار الأمثل لاحتياجاتك في التسويق الرقمي.',
    url: 'https://d-arrow.com/why-us',
    images: [{ url: 'https://d-arrow.com/DR-LOGO.png', width: 1200, height: 630, alt: 'D Arrow Why Us' }],
  },
  alternates: { canonical: 'https://d-arrow.com/why-us' },
};

export default function WhyUsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
