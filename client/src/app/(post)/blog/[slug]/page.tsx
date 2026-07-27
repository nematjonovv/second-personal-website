// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getPostBySlugServer } from "@/features/blog/blog.api";
import BlogDetail from "@/features/blog/components/BlogDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlugServer(slug);
  if (!post) return {};

  return {
    title: post.content.uz.title,
    description: post.content.uz.post.slice(0, 160),
    openGraph: {
      title: post.content.uz.title,
      description: post.content.uz.post.slice(0, 160),
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlugServer(slug);

  if (!post) notFound();

  return <BlogDetail post={post} />;
}