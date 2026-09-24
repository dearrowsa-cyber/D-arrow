"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import type { BlogPost } from "@/features/blog/data";

export function useBlogPosts(initialPosts: BlogPost[]) {
    const { lang } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tagFromUrl = searchParams.get("tag");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
    const selectedTag = tagFromUrl;

    const categories = ["all", ...new Set(initialPosts.map((post) => post.category))];
    const filteredPosts = initialPosts.filter((post) => {
        const matchesCategory =
            selectedCategory === "all" || post.category === selectedCategory;
        const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
        return matchesCategory && matchesTag;
    });

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const parts = dateString.split("T")[0].split("-").map(Number);
        if (parts.length !== 3 || parts.some(Number.isNaN)) return dateString;
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        if (Number.isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            calendar: "gregory",
        });
    };

    const getDisplayText = (englishText?: string | null, arabicText?: string | null) =>
        lang === "ar" ? arabicText || englishText || "" : englishText || arabicText || "";
    const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, "");
    const getPostHref = (post: BlogPost) => {
        let targetSlug = post.slug || post.id;
        if (targetSlug.startsWith("http://") || targetSlug.startsWith("https://")) {
            targetSlug = targetSlug.split("/blog/").pop() || targetSlug.split("/").pop() || post.id;
        }
        return `/blog/${targetSlug}`;
    };
    const handleImageError = (postId: string) => {
        setFailedImages((previous) => ({ ...previous, [postId]: true }));
    };

    return {
        categories,
        failedImages,
        filteredPosts,
        formatDate,
        getDisplayText,
        getPostHref,
        handleImageError,
        lang,
        selectedCategory,
        selectedTag,
        setSelectedCategory,
        setSelectedTag: () => router.replace("/blog", { scroll: false }),
        stripHtml,
    };
}

export function useBlogPost(post: BlogPost) {
    const { lang } = useLanguage();
    const [imageError, setImageError] = useState(false);
    const getDisplayText = (englishText?: string | null, arabicText?: string | null) =>
        lang === "ar" ? arabicText || englishText || "" : englishText || arabicText || "";
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const parts = dateString.split("T")[0].split("-").map(Number);
        if (parts.length !== 3 || parts.some(Number.isNaN)) return dateString;
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        if (Number.isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            calendar: "gregory",
        });
    };
    let content = getDisplayText(post.content, post.contentAr);
    if (lang === "ar") {
        content = content
            .replace(/&nbsp;/g, " ")
            .replace(/\u00A0/g, " ")
            .replace(/text-align:\s*justify;?/gi, "text-align: right;")
            .replace(/white-space:\s*nowrap;?/gi, "white-space: normal;")
            .replace(/word-break:\s*[^"';]+;?/gi, "")
            .replace(/ql-align-justify/g, "ql-align-right");
    }
    return {
        category: getDisplayText(post.category, post.categoryAr),
        content,
        formatDate,
        gatedContent: getDisplayText(post.gatedContent, post.gatedContentAr),
        imageError,
        lang,
        setImageError,
        tags: Array.isArray(post.tags) ? post.tags : [],
        title: getDisplayText(post.title, post.titleAr),
    };
}