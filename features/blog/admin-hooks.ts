"use client";

import { useState, useEffect, useCallback } from "react";
import type { BlogPost } from "./data";
import {
    getAdminBlogPosts,
    getAdminBlogPost,
    createAdminBlogPost,
    updateAdminBlogPost,
    deleteAdminBlogPost,
    type AdminBlogPostInput,
} from "./admin-data";

export function useAdminBlogPosts(status?: "published" | "draft") {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminBlogPosts(status);
            const sorted = data.sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            setPosts(sorted);
        } catch (err) {
            setError("Failed to fetch posts");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [status]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const deletePost = useCallback(async (id: string) => {
        try {
            const success = await deleteAdminBlogPost(id);
            if (success) {
                setPosts((prev) => prev.filter((p) => p.id !== id));
                return true;
            }
            return false;
        } catch (err) {
            console.error("Failed to delete post:", err);
            return false;
        }
    }, []);

    const updatePostStatus = useCallback(async (id: string, status: "published" | "draft") => {
        try {
            const updated = await updateAdminBlogPost({ id, status });
            if (updated) {
                setPosts((prev) =>
                    prev.map((p) => (p.id === id ? { ...p, status } : p))
                );
                return true;
            }
            return false;
        } catch (err) {
            console.error("Failed to update post status:", err);
            return false;
        }
    }, []);

    return {
        posts,
        loading,
        error,
        refetch: fetchPosts,
        deletePost,
        updatePostStatus,
    };
}

export function useAdminBlogPost(id: string) {
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPost = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminBlogPost(id);
            setPost(data);
        } catch (err) {
            setError("Failed to fetch post");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    const updatePost = useCallback(async (data: AdminBlogPostInput) => {
        try {
            const updated = await updateAdminBlogPost(data);
            if (updated) {
                setPost(updated);
                return true;
            }
            return false;
        } catch (err) {
            console.error("Failed to update post:", err);
            return false;
        }
    }, []);

    return {
        post,
        loading,
        error,
        refetch: fetchPost,
        updatePost,
    };
}

export function useAdminBlogPostMutation() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createPost = useCallback(async (data: AdminBlogPostInput) => {
        setLoading(true);
        setError(null);
        try {
            const created = await createAdminBlogPost(data);
            if (created) {
                return { success: true, post: created };
            }
            return { success: false, error: "Failed to create post" };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to create post";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    const updatePost = useCallback(async (data: AdminBlogPostInput) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await updateAdminBlogPost(data);
            if (updated) {
                return { success: true, post: updated };
            }
            return { success: false, error: "Failed to update post" };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to update post";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        createPost,
        updatePost,
    };
}
