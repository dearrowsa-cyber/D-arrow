import { api } from "@/lib/api";

export type ProductCategory = "templates" | "realestate" | "payments" | "ai" | "hosting";

export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  category: ProductCategory;
  categoryNameAr: string;
  categoryNameEn: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  ordersCount: number;
  badge?: string;
  image: string;
  descriptionAr: string;
  descriptionEn: string;
  keyHighlightAr: string;
  keyHighlightEn: string;
  featuresAr: string[];
  featuresEn: string[];
  demoUrl?: string;
  deliveryTimeAr: string;
  deliveryTimeEn: string;
  isPopular?: boolean;
};

export type StoreProductDetail = StoreProduct & {
  summaryAr: string;
  summaryEn: string;
  techStack: string[];
  keyBenefitsAr: { title: string; desc: string }[];
  keyBenefitsEn: { title: string; desc: string }[];
  faqsAr: { q: string; a: string }[];
  faqsEn: { q: string; a: string }[];
};

export type StoreProductDB = {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  description?: string | null;
  descriptionAr?: string | null;
  price: number;
  salePrice?: number | null;
  currency?: string | null;
  images?: string | null;
  category?: string | null;
  categoryAr?: string | null;
  type?: string | null;
  downloadUrl?: string | null;
  demoUrl?: string | null;
  features?: string | null;
  featuresAr?: string | null;
  status?: string | null;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  reviews?: { rating: number }[];
  _count?: { reviews: number; orderItems: number };
};

type StoreProductsResponse = {
  success: boolean;
  products: StoreProductDB[];
  count: number;
};

const SLUG_IMAGE_MAP: Record<string, string> = {
  "saudi-ecommerce-store-system": "/store/ecommerce.jpg",
  "saudi-ecommerce-store-template": "/store/ecommerce.jpg",
  "saudi-real-estate-platform": "/store/realestate.jpg",
  "saudi-real-estate-template": "/store/realestate.jpg",
  "influencer-marketing-platform": "/store/influencer.jpg",
  "digital-marketing-seo-course": "/store/seo.jpg",
};

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  templates: "/store/ecommerce.jpg",
  realestate: "/store/realestate.jpg",
  influencer: "/store/influencer.jpg",
  ai: "/store/ai-chatbot.jpg",
  payments: "/store/payments.jpg",
  hosting: "/store/hosting.png",
  seo: "/store/seo.jpg",
};

const parseArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
};

const resolveCategory = (product: StoreProductDB): ProductCategory => {
  const value = `${product.category || ""} ${product.categoryAr || ""}`.toLowerCase();
  if (value.includes("real") || value.includes("عقار")) return "realestate";
  if (value.includes("pay") || value.includes("دفع")) return "payments";
  if (value.includes("ai") || value.includes("ذك")) return "ai";
  if (value.includes("host") || value.includes("استضاف")) return "hosting";
  return "templates";
};

const resolveImage = (product: StoreProductDB, category: ProductCategory): string => {
  const rawImage = parseArray(product.images)[0];
  return (
    SLUG_IMAGE_MAP[product.slug] ||
    (rawImage && !rawImage.includes("unsplash.com") ? rawImage : "") ||
    CATEGORY_IMAGE_MAP[category] ||
    "/store/ecommerce.jpg"
  );
};

const resolveRating = (reviews?: { rating: number }[]): number => {
  if (Array.isArray(reviews) && reviews.length > 0) {
    const sum = reviews.reduce((acc, review) => acc + Number(review.rating), 0);
    return Number((sum / reviews.length).toFixed(1));
  }
  return 5;
};

const normalizeProduct = (product: StoreProductDB): StoreProduct => {
  const featuresAr = parseArray(product.featuresAr);
  const featuresEn = parseArray(product.features);
  const category = resolveCategory(product);

  return {
    id: product.id,
    slug:
      product.slug === "saudi-real-estate-template"
        ? "saudi-real-estate-platform"
        : product.slug,
    name: product.name,
    nameAr: product.nameAr || product.name,
    category,
    categoryNameAr: product.categoryAr || product.category || "الأنظمة الرقمية",
    categoryNameEn: product.category || "Digital Systems",
    price: Number(product.salePrice ?? product.price),
    originalPrice: Number(product.price),
    rating: resolveRating(product.reviews),
    reviewsCount: Number(product._count?.reviews || 0),
    ordersCount: Number(product._count?.orderItems || 0),
    badge: product.featured ? "الأكثر طلباً" : undefined,
    image: resolveImage(product, category),
    descriptionAr: product.descriptionAr || product.description || "",
    descriptionEn: product.description || product.descriptionAr || "",
    keyHighlightAr: featuresAr[0] || "حل رقمي متكامل لنشاطك التجاري",
    keyHighlightEn:
      featuresEn[0] || "Complete digital solution for your business",
    featuresAr,
    featuresEn,
    demoUrl: product.demoUrl || undefined,
    deliveryTimeAr: "تسليم وتشغيل فوري",
    deliveryTimeEn: "Instant setup and delivery",
    isPopular: Boolean(product.featured),
  };
};

export async function getProducts(): Promise<StoreProduct[]> {
  try {
    const response = await api.get<StoreProductsResponse>("/api/store/products", {
      params: { status: "published" },
      cache: "force-cache",
      revalidate: 60,
      tags: ["store-products"],
    });
    const products = Array.isArray(response.products) ? response.products : [];
    const normalized = products.map(normalizeProduct);
    return normalized;
  } catch (error) {
    console.error("Error fetching store products from the backend API:", error);
    return [];
  }
}

export async function getProduct(identifier: string): Promise<StoreProductDetail | null> {
  const decodedIdentifier = decodeURIComponent(identifier);
  const products = await getProducts();

  const matching =
    products.find(
      (product) =>
        product.id === identifier ||
        product.slug === identifier ||
        product.id === decodedIdentifier ||
        product.slug === decodedIdentifier ||
        (identifier === "saudi-real-estate-platform" &&
          product.slug === "saudi-real-estate-template") ||
        (identifier === "saudi-ecommerce-store-template" &&
          product.slug.includes("ecommerce")),
    ) ?? null;

  const product: StoreProductDetail | null = matching
    ? {
        ...matching,
        summaryAr: matching.descriptionAr,
        summaryEn: matching.descriptionEn,
        techStack: [],
        keyBenefitsAr: [],
        keyBenefitsEn: [],
        faqsAr: [],
        faqsEn: [],
      }
    : null;

  console.log("[Store SSR] Single product:", product);
  return product;
}