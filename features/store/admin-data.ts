import { clientApi } from "@/lib/client-api";
import type { StoreProductDB } from "./data";

type StoreProductsResponse = {
  success: boolean;
  products: StoreProductDB[];
  count: number;
};

type StoreProductResponse = {
  success: boolean;
  product: StoreProductDB;
};

export type AdminProductInput = {
  id?: string;
  name?: string;
  nameAr?: string;
  slug?: string;
  description?: string;
  descriptionAr?: string;
  price?: number | string;
  salePrice?: number | string;
  currency?: string;
  images?: string[] | string;
  category?: string;
  categoryAr?: string;
  type?: string;
  downloadUrl?: string;
  demoUrl?: string;
  features?: string[] | string;
  featuresAr?: string[] | string;
  status?: "published" | "draft";
  featured?: boolean;
};

const serializeArray = (value: string[] | string | undefined): string | undefined => {
  if (Array.isArray(value)) {
    return JSON.stringify(value.filter((item) => item && item.trim()));
  }
  return value;
};

const toPayload = (data: AdminProductInput): Record<string, unknown> => ({
  ...data,
  images: serializeArray(data.images),
  features: serializeArray(data.features),
  featuresAr: serializeArray(data.featuresAr),
});

export async function getAdminProducts(status?: "published" | "draft"): Promise<StoreProductDB[]> {
  try {
    const params = status ? { status } : undefined;
    const response = await clientApi.get<StoreProductsResponse>("/api/store/products", {
      params,
      cache: "no-store",
      token: true,
    });
    return Array.isArray(response.products) ? response.products : [];
  } catch (error) {
    console.error("Error fetching admin store products:", error);
    return [];
  }
}

export async function getAdminProduct(id: string): Promise<StoreProductDB | null> {
  try {
    const response = await clientApi.get<StoreProductResponse>(
      `/api/store/products/${encodeURIComponent(id)}`,
      { token: true, cache: "no-store" },
    );
    return response.product || null;
  } catch (error) {
    console.error("Error fetching admin store product:", error);
    return null;
  }
}

export async function createAdminProduct(data: AdminProductInput): Promise<StoreProductDB | null> {
  try {
    const response = await clientApi.post<StoreProductResponse>("/api/store/products", toPayload(data), {
      token: true,
    });
    return response.product || null;
  } catch (error) {
    console.error("Error creating admin store product:", error);
    return null;
  }
}

export async function updateAdminProduct(data: AdminProductInput): Promise<StoreProductDB | null> {
  try {
    const response = await clientApi.put<StoreProductResponse>(
      `/api/store/products/${encodeURIComponent(data.id || "")}`,
      toPayload(data),
      { token: true },
    );
    return response.product || null;
  } catch (error) {
    console.error("Error updating admin store product:", error);
    return null;
  }
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  try {
    await clientApi.delete<void>(`/api/store/products/${encodeURIComponent(id)}`, {
      token: true,
    });
    return true;
  } catch (error) {
    console.error("Error deleting admin store product:", error);
    return false;
  }
}