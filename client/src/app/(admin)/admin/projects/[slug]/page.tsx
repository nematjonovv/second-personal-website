import ProjectAdminEditor from "@/features/project/components/ProjectAdminEditor";

export default async function AdminProjectEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ProjectAdminEditor slug={slug} />;
}
