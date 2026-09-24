import StoreClient from "@/components/store/StoreClient";
import StoreSkeleton from "@/components/skeletons/StoreSkeleton";
import { Suspense } from "react";
import { getProducts } from "@/features/store/data";

export const dynamic = "force-dynamic";

async function StoreContent() {
  const products = await getProducts();

  return <StoreClient initialProducts={products} />;
}

export default function StorePage() {
  return (
    <Suspense fallback={<StoreSkeleton />}>
      <StoreContent />
    </Suspense>
  );
}