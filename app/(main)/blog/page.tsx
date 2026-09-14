import { headers } from "next/headers";
import BlogClient from "@/components/BlogClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

async function getPosts(): Promise<any[]> {
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol =
      headersList.get("x-forwarded-proto") ||
      (host.includes("localhost") ? "http" : "https");

    const apiUrl = `${protocol}://${host}/api/blog/posts`;
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (res.ok) {
      const data = await res.json();
      if (data.posts && Array.isArray(data.posts)) {
        return data.posts;
      }
    }
  } catch (error) {
    console.error("Error fetching blog posts from /api/blog/posts:", error);
  }

  return [];
}

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0e27] pt-32 text-center text-white">
          Loading blog...
        </div>
      }
    >
      <BlogClient initialPosts={posts} />
    </Suspense>
  );
}
