import type { Metadata } from 'next';
import { getDemoProperties } from '@/lib/real-estate/queries';
import { RealEstateProvider } from '@/components/demo/real-estate/RealEstateContext';
import RealEstateAdmin from '@/components/demo/real-estate/AdminClient';
import '../real-estate.css';

export const metadata: Metadata = {
  title: 'لوحة التحكم | عقارات دي-آرو (ديمو)',
  description: 'لوحة تحكم تجريبية لإدارة العقارات وطلبات المعاينة وإعدادات الموقع.',
  robots: { index: false },
};

export const dynamic = 'force-dynamic';

export default async function RealEstateAdminPage() {
  const properties = await getDemoProperties();
  return (
    <RealEstateProvider initialProperties={properties}>
      <RealEstateAdmin />
    </RealEstateProvider>
  );
}
