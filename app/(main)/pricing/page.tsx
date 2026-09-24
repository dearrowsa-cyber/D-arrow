import PricingClient from "@/components/pricing/PricingClient";
import PricingSkeleton from "@/components/skeletons/PricingSkeleton";
import { Suspense } from "react";
import { getPricingPlans } from "@/features/pricing/data";

export const dynamic = "force-dynamic";

async function PricingContent() {
  const plans = await getPricingPlans();
  return <PricingClient initialPlans={plans} />;
}

export default function PricingPage() {
  return (
    <Suspense fallback={<PricingSkeleton />}>
      <PricingContent />
    </Suspense>
  );
}