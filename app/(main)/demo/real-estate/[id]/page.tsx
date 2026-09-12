import type { Metadata } from 'next';
import { getDemoProperties } from '@/lib/real-estate/queries';
import { RealEstateProvider } from '@/components/demo/real-estate/RealEstateContext';
import RealEstateDetail from '@/components/demo/real-estate/DetailClient';
import '../real-estate.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const { getDemoPropertyBySlug } = await import('@/lib/real-estate/queries');
    const property = await getDemoPropertyBySlug(id);
    return {
      title: property ? `${property.title} | عقارات دي-آرو` : 'عقار غير موجود',
      description: property?.description,
    };
  } catch {
    return { title: 'عقارات دي-آرو' };
  }
}

export default async function RealEstateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const properties = await getDemoProperties();
  return (
    <RealEstateProvider initialProperties={properties}>
      <RealEstateDetail slug={id} />
    </RealEstateProvider>
  );
}
