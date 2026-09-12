import type { Metadata } from 'next';
import { getDemoProperties } from '@/lib/real-estate/queries';
import { RealEstateProvider } from '@/components/demo/real-estate/RealEstateContext';
import RealEstateHome from '@/components/demo/real-estate/HomeClient';
import './real-estate.css';

export const metadata: Metadata = {
  title: 'منصة عقارات دي-آرو | ديمو المنظومة العقارية المتكاملة',
  description:
    'المنظومة العقارية السعودية الذكية — فلل فاخرة، شقق، تراخيص فال، جولة افتراضية 360°، وحاسبة تمويل عقاري.',
};

export const dynamic = 'force-dynamic';

export default async function RealEstateDemoPage() {
  const properties = await getDemoProperties();
  return (
    <RealEstateProvider initialProperties={properties}>
      <RealEstateHome />
    </RealEstateProvider>
  );
}
