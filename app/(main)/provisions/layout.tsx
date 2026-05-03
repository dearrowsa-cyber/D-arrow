import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'أعمالنا ومشاريعنا',
  description: 'استعرض مشاريعنا الناجحة في التسويق الرقمي وتصميم المواقع والهوية التجارية. مشاريع حقيقية مع نتائج قابلة للقياس لعملاء في السعودية والخليج.',
  keywords: 'أعمال D Arrow, مشاريع تسويق رقمي, معرض أعمال, بورتفوليو',
  openGraph: {
    title: 'أعمالنا ومشاريعنا',
    description: 'اكتشف مشاريعنا الناجحة في التسويق الرقمي وتصميم المواقع.',
    url: 'https://d-arrow.com/provisions',
    images: [{ url: 'https://d-arrow.com/og-image.jpg', width: 1200, height: 630, alt: 'D Arrow Portfolio' }],
  },
  alternates: { canonical: 'https://d-arrow.com/provisions' },
};

export default function ProvisionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
