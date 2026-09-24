import { clientApi } from "@/lib/client-api";
import type { PricingPlan } from "./data";

type PricingPlansResponse = {
  success: boolean;
  plans: PricingPlan[];
  count: number;
};

type PricingPlanResponse = {
  success: boolean;
  plan: PricingPlan;
};

export type AdminPricingPlanInput = Partial<PricingPlan> & {
  id?: string;
  nameAr?: string;
  nameEn?: string;
  audienceAr?: string;
  audienceEn?: string;
  priceRange?: string;
  priceUnitAr?: string;
  priceUnitEn?: string;
  noteAr?: string;
  noteEn?: string;
  featured?: boolean;
  badgeAr?: string;
  badgeEn?: string;
  features?: PricingPlan["features"];
  ctaAr?: string;
  ctaEn?: string;
  status?: "published" | "draft";
  sortOrder?: number;
};

export async function getAdminPricingPlans(status?: "published" | "draft"): Promise<PricingPlan[]> {
  try {
    const params = status ? { status } : undefined;
    const response = await clientApi.get<PricingPlansResponse>("/api/pricing/plans", {
      params,
      cache: "no-store",
      token: true,
    });
    return Array.isArray(response.plans) ? response.plans : [];
  } catch (error) {
    console.error("Error fetching admin pricing plans:", error);
    return [];
  }
}

export async function getAdminPricingPlan(id: string): Promise<PricingPlan | null> {
  try {
    const response = await clientApi.get<PricingPlansResponse>("/api/pricing/plans", {
      token: true,
      cache: "no-store",
    });
    const plan = response.plans?.find((p) => p.id === id);
    return plan || null;
  } catch (error) {
    console.error("Error fetching admin pricing plan:", error);
    return null;
  }
}

export async function createAdminPricingPlan(data: AdminPricingPlanInput): Promise<PricingPlan | null> {
  try {
    const response = await clientApi.post<PricingPlanResponse>("/api/pricing/plans", data, {
      token: true,
    });
    return response.plan || null;
  } catch (error) {
    console.error("Error creating admin pricing plan:", error);
    return null;
  }
}

export async function updateAdminPricingPlan(data: AdminPricingPlanInput): Promise<PricingPlan | null> {
  try {
    const response = await clientApi.put<PricingPlanResponse>("/api/pricing/plans", data, {
      token: true,
    });
    return response.plan || null;
  } catch (error) {
    console.error("Error updating admin pricing plan:", error);
    return null;
  }
}

export async function deleteAdminPricingPlan(id: string): Promise<boolean> {
  try {
    await clientApi.delete<void>(`/api/pricing/plans?id=${encodeURIComponent(id)}`, {
      token: true,
    });
    return true;
  } catch (error) {
    console.error("Error deleting admin pricing plan:", error);
    return false;
  }
}
