"use client";

import { useState, useEffect, useCallback } from "react";
import type { StoreProductDB } from "./data";
import {
  getAdminProducts,
  getAdminProduct,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  type AdminProductInput,
} from "./admin-data";

export function useAdminProducts(status?: "published" | "draft") {
  const [products, setProducts] = useState<StoreProductDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminProducts(status);
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const success = await deleteAdminProduct(id);
      if (success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to delete product:", err);
      return false;
    }
  }, []);

  const updateProductStatus = useCallback(async (id: string, status: "published" | "draft") => {
    try {
      const updated = await updateAdminProduct({ id, status });
      if (updated) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status } : p))
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update product status:", err);
      return false;
    }
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    deleteProduct,
    updateProductStatus,
  };
}

export function useAdminProduct(id: string) {
  const [product, setProduct] = useState<StoreProductDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminProduct(id);
      setProduct(data);
    } catch (err) {
      setError("Failed to fetch product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const updateProduct = useCallback(async (data: AdminProductInput) => {
    try {
      const updated = await updateAdminProduct(data);
      if (updated) {
        setProduct(updated);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update product:", err);
      return false;
    }
  }, []);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
    updateProduct,
  };
}

export function useAdminProductMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = useCallback(async (data: AdminProductInput) => {
    setLoading(true);
    setError(null);
    try {
      const created = await createAdminProduct(data);
      if (created) {
        return { success: true, product: created };
      }
      return { success: false, error: "Failed to create product" };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create product";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (data: AdminProductInput) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateAdminProduct(data);
      if (updated) {
        return { success: true, product: updated };
      }
      return { success: false, error: "Failed to update product" };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update product";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createProduct,
    updateProduct,
  };
}