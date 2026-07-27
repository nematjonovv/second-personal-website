import { getLocale, getTranslations } from "next-intl/server";
import ProjectList from "@/features/project/components/ProjectList";
import WorkIntro from "@/features/project/components/WorkIntro";
import { getAllProjectsServer } from "@/features/project/project.api";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "WorkMeta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/work" },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "/work",
      type: "website",
    },
  };
}

export default async function WorkPage() {
  const projects = await getAllProjectsServer();

  return (
    <div className="pb-20 md:pb-28">
      <WorkIntro />
      <ProjectList projects={projects} />
    </div>
  );
}