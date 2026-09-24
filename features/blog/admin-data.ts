import { clientApi } from "@/lib/client-api";
import type { BlogPost } from "./data";

type BlogPostsResponse = {
    success: boolean;
    posts: BlogPost[];
    count: number;
};

type BlogPostResponse = {
    success: boolean;
    post: BlogPost;
};

export type AdminBlogPostInput = Partial<BlogPost> & {
    id?: string;
    title?: string;
    titleAr?: string;
    slug?: string;
    content?: string;
    contentAr?: string;
    excerpt?: string;
    excerptAr?: string;
    author?: string;
    date?: string;
    time?: string;
    category?: string;
    categoryAr?: string;
    imageUrl?: string;
    readTime?: number;
    tags?: string[];
    isGated?: boolean;
    gatedContent?: string;
    gatedContentAr?: string;
    ctaType?: string;
    status?: "published" | "draft";
};

export async function getAdminBlogPosts(status?: "published" | "draft"): Promise<BlogPost[]> {
    try {
        const params = status ? { status } : undefined;
        const response = await clientApi.get<BlogPostsResponse>("/api/blog/posts", {
            params,
            cache: "no-store",
            token: true,
        });
        return Array.isArray(response.posts) ? response.posts : [];
    } catch (error) {
        console.error("Error fetching admin blog posts:", error);
        return [];
    }
}

export async function getAdminBlogPost(id: string): Promise<BlogPost | null> {
    try {
        const response = await clientApi.get<BlogPostsResponse>("/api/blog/posts", {
            token: true,
            cache: "no-store",
        });
        const post = response.posts?.find((p) => p.id === id);
        return post || null;
    } catch (error) {
        console.error("Error fetching admin blog post:", error);
        return null;
    }
}

export async function createAdminBlogPost(data: AdminBlogPostInput): Promise<BlogPost | null> {
    try {
        const response = await clientApi.post<BlogPostResponse>("/api/blog/posts", data, {
            token: true,
        });
        return response.post || null;
    } catch (error) {
        console.error("Error creating admin blog post:", error);
        return null;
    }
}

export async function updateAdminBlogPost(data: AdminBlogPostInput): Promise<BlogPost | null> {
    try {
        const response = await clientApi.put<BlogPostResponse>("/api/blog/posts", data, {
            token: true,
        });
        return response.post || null;
    } catch (error) {
        console.error("Error updating admin blog post:", error);
        return null;
    }
}

export async function deleteAdminBlogPost(id: string): Promise<boolean> {
    try {
        await clientApi.delete<void>(`/api/blog/posts?id=${encodeURIComponent(id)}`, {
            token: true,
        });
        return true;
    } catch (error) {
        console.error("Error deleting admin blog post:", error);
        return false;
    }
}
