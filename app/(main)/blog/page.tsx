import BlogClient from "@/components/blog/BlogClient";
import BlogSkeleton from "@/components/skeletons/BlogSkeleton";
import { Suspense } from "react";
import { getBlogPosts } from "@/features/blog/data";

export const dynamic = "force-dynamic";

async function BlogContent() {
  const posts = await getBlogPosts();

  return <BlogClient initialPosts={posts} />;
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogSkeleton />}>
      <BlogContent />
    </Suspense>
  );
}
