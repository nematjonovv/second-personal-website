import type { Project } from "../../generated/prisma/client";
import type { ProjectContentInput } from "./project.validation";

export type ProjectResponse = {
  slug: string;
  title: string;
  date: { month: number; year: number };
  techStack: string[];
  role: string[];
  gallery: string[];
  githubUrl?: string;
  liveUrl?: string;
  content: { uz: ProjectContentInput; en: ProjectContentInput };
};

export function toProjectResponse(project: Project): ProjectResponse {
  return {
    slug: project.slug,
    title: project.title,
    date: { month: project.month, year: project.year },
    techStack: project.techStack,
    role: project.role,
    gallery: project.gallery,
    ...(project.githubUrl ? { githubUrl: project.githubUrl } : {}),
    ...(project.liveUrl ? { liveUrl: project.liveUrl } : {}),
    content: {
      uz: project.uz as unknown as ProjectContentInput,
      en: project.en as unknown as ProjectContentInput,
    },
  };
}
