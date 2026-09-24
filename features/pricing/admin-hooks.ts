"use client";

import { useState, useEffect, useCallback } from "react";
import type { PricingPlan } from "./data";
import {
  getAdminPricingPlans,
  getAdminPricingPlan,
  createAdminPricingPlan,
  updateAdminPricingPlan,
  deleteAdminPricingPlan,
  type AdminPricingPlanInput,
} from "./admin-data";

export function useAdminPricingPlans(status?: "published" | "draft") {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminPricingPlans(status);
      const sorted = data.sort((a, b) => a.sortOrder - b.sortOrder);
      setPlans(sorted);
    } catch (err) {
      setError("Failed to fetch pricing plans");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const deletePlan = useCallback(async (id: string) => {
    try {
      const success = await deleteAdminPricingPlan(id);
      if (success) {
        setPlans((prev) => prev.filter((p) => p.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to delete pricing plan:", err);
      return false;
    }
  }, []);

  const updatePlanStatus = useCallback(async (id: string, status: "published" | "draft") => {
    try {
      const updated = await updateAdminPricingPlan({ id, status });
      if (updated) {
        setPlans((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status } : p))
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update pricing plan status:", err);
      return false;
    }
  }, []);

  return {
    plans,
    loading,
    error,
    refetch: fetchPlans,
    deletePlan,
    updatePlanStatus,
  };
}

export function useAdminPricingPlan(id: string) {
  const [plan, setPlan] = useState<PricingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminPricingPlan(id);
      setPlan(data);
    } catch (err) {
      setError("Failed to fetch pricing plan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const updatePlan = useCallback(async (data: AdminPricingPlanInput) => {
    try {
      const updated = await updateAdminPricingPlan(data);
      if (updated) {
        setPlan(updated);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update pricing plan:", err);
      return false;
    }
  }, []);

  return {
    plan,
    loading,
    error,
    refetch: fetchPlan,
    updatePlan,
  };
}

export function useAdminPricingPlanMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPlan = useCallback(async (data: AdminPricingPlanInput) => {
    setLoading(true);
    setError(null);
    try {
      const created = await createAdminPricingPlan(data);
      if (created) {
        return { success: true, plan: created };
      }
      return { success: false, error: "Failed to create pricing plan" };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create pricing plan";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePlan = useCallback(async (data: AdminPricingPlanInput) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateAdminPricingPlan(data);
      if (updated) {
        return { success: true, plan: updated };
      }
      return { success: false, error: "Failed to update pricing plan" };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update pricing plan";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createPlan,
    updatePlan,
  };
}
