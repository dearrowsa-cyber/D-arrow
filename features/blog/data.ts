import { api } from "@/lib/api";

export type BlogPost = {
    id: string;
    title: string;
    titleAr?: string | null;
    slug?: string | null;
    content: string;
    contentAr?: string | null;
    excerpt?: string | null;
    excerptAr?: string | null;
    author: string;
    date: string;
    time: string;
    category: string;
    categoryAr?: string | null;
    imageUrl?: string | null;
    readTime: number;
    tags: string[];
    status?: "draft" | "published";
    isGated?: boolean;
    gatedContent?: string | null;
    gatedContentAr?: string | null;
    ctaType?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

type BlogPostsResponse = {
    success: boolean;
    posts: BlogPost[];
    count: number;
};

export async function getBlogPosts(): Promise<BlogPost[]> {
    try {
        const response = await api.get<BlogPostsResponse>("/api/blog/posts", {
            cache: "force-cache",
            revalidate: 60,
            tags: ["blog-posts"],
        });
        return Array.isArray(response.posts) ? response.posts : [];
    } catch (error) {
        console.error("Error fetching blog posts from the backend API:", error);
        return [];
    }
}

export async function getBlogPost(identifier: string): Promise<BlogPost | null> {
    const decodedIdentifier = decodeURIComponent(identifier);
    const posts = await getBlogPosts();

    return (
        posts.find(
            (post) =>
                post.id === identifier ||
                post.slug === identifier ||
                post.id === decodedIdentifier ||
                post.slug === decodedIdentifier,
        ) ?? null
    );
}