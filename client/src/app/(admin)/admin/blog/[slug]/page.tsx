import BlogAdminEditor from "@/features/blog/components/BlogAdminEditor";

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <BlogAdminEditor slug={slug} />;
}
