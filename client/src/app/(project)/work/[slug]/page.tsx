import ProjectDetail from "@/features/project/components/ProjectDetail";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ProjectDetail slug={slug} />;
}
