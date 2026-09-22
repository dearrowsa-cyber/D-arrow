"use client";

import WhyUsHero from "@/components/whyus/WhyUsHero";
import WhyUsFeatures from "@/components/whyus/WhyUsFeatures";
import WhyUsStats from "@/components/whyus/WhyUsStats";
import WhyUsDifferent from "@/components/whyus/WhyUsDifferent";
import WhyUsCTA from "@/components/whyus/WhyUsCTA";

export default function WhyUsPage() {
  return (
    <div className="min-h-screen text-white">
      <WhyUsHero />
      <WhyUsFeatures />
      <WhyUsStats />
      <WhyUsDifferent />
      <WhyUsCTA />
    </div>
  );
}