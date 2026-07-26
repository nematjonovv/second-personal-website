import { projects } from "./project.data";
import type { Project } from "./project.type";

export const projectApi = {
  async getAll(): Promise<Project[]> {
    return projects;
  },

  async getBySlug(slug: string): Promise<Project | null> {
    return projects.find((project) => project.slug === slug) ?? null;
  },
};
