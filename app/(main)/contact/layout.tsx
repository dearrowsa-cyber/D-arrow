import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تواصل معنا',
  description: 'تواصل مع فريق D Arrow للتسويق الرقمي. احصل على استشارة مجانية لمشروعك. نخدم الأحساء، الخبر، والمنطقة الشرقية. اتصل بنا أو أرسل رسالة عبر واتساب.',
  keywords: 'تواصل معنا, وكالة تسويق الأحساء, تسويق رقمي الخبر, استشارة مجانية, D Arrow',
  openGraph: {
    title: 'تواصل معنا',
    description: 'تواصل مع فريق D Arrow واحصل على استشارة مجانية لمشروعك الرقمي.',
    url: 'https://d-arrow.com/contact',
    images: [{ url: 'https://d-arrow.com/og-image.jpg', width: 1200, height: 630, alt: 'D Arrow Contact' }],
  },
  alternates: { canonical: 'https://d-arrow.com/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
