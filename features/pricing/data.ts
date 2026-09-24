import { api } from "@/lib/api";

export type PricingPlan = {
  id: string;
  nameAr: string;
  nameEn: string;
  audienceAr: string;
  audienceEn: string;
  priceRange: string;
  priceUnitAr: string;
  priceUnitEn: string;
  noteAr?: string | null;
  noteEn?: string | null;
  featured: boolean;
  badgeAr?: string | null;
  badgeEn?: string | null;
  features: PricingFeature[];
  ctaAr: string;
  ctaEn: string;
  status?: "published" | "draft";
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type PricingFeature = {
  ar: string;
  en: string;
};

type PricingPlansResponse = {
  success: boolean;
  plans: PricingPlan[];
  count: number;
};

export async function getPricingPlans(): Promise<PricingPlan[]> {
  try {
    const response = await api.get<PricingPlansResponse>("/api/pricing/plans", {
      cache: "force-cache",
      revalidate: 60,
      tags: ["pricing-plans"],
    });
    return Array.isArray(response.plans) ? response.plans : [];
  } catch (error) {
    console.error("Error fetching pricing plans from the backend API:", error);
    return [];
  }
}

export async function getPricingPlan(id: string): Promise<PricingPlan | null> {
  try {
    const response = await api.get<PricingPlansResponse>("/api/pricing/plans", {
      cache: "force-cache",
      revalidate: 60,
      tags: ["pricing-plans"],
    });
    const plan = response.plans?.find((p) => p.id === id);
    return plan || null;
  } catch (error) {
    console.error("Error fetching pricing plan:", error);
    return null;
  }
}
