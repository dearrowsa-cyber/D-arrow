import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الأسعار والباقات | D Arrow - وكالة تسويق رقمي',
  description: 'باقات تسويق رقمي احترافية تبدأ من 2,950 ريال. باقة الأساس، النمو، الاحتراف، والباقة المخصصة. حزم تطوير المواقع والتطبيقات. نتائج قابلة للقياس ودعم مخصص.',
  keywords: 'أسعار تسويق رقمي, باقات تسويق, أسعار تصميم مواقع, باقات سوشيال ميديا, تسويق رقمي السعودية',
  openGraph: {
    title: 'الأسعار والباقات | D Arrow',
    description: 'باقات تسويق رقمي احترافية تبدأ من 2,950 ريال سعودي. اختر الباقة المناسبة لعملك.',
    url: 'https://d-arrow.com/pricing',
    images: [{ url: 'https://d-arrow.com/DR-LOGO.png', width: 1200, height: 630, alt: 'D Arrow Pricing' }],
  },
  alternates: { canonical: 'https://d-arrow.com/pricing' },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
