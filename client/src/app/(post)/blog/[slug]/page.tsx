import BlogDetail from "@/features/blog/components/BlogDetail";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <BlogDetail slug={slug} />;
}
