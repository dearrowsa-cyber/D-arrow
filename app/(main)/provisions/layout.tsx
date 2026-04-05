import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Projects - D Arrow Digital Marketing Agency',
  description: 'Explore our portfolio of successful projects showcasing our expertise in digital marketing, web design, and brand development.',
  keywords: 'portfolio, projects, case studies, digital marketing projects, web design portfolio',
};

export default function ProvisionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
