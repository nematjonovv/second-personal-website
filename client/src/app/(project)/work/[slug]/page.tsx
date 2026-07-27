// app/(project)/work/[slug]/page.tsx
import { notFound } from "next/navigation";
import ProjectDetail from "@/features/project/components/ProjectDetail";
import { getProjectBySlugServer } from "@/features/project/project.api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlugServer(slug);
  if (!project) return {};

  const title = project.title;
  const description = project.content.uz.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: project.gallery?.length
        ? [{ url: project.gallery[0], width: 1200, height: 630, alt: title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.gallery?.length ? [project.gallery[0]] : undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlugServer(slug);

  if (!project) notFound();

  return <ProjectDetail project={project} />;
}