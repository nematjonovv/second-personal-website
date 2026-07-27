import { api } from "@/shared/api/client";
import type { Project, ProjectFormValues } from "./project.type";

function toFormData(values: ProjectFormValues, files: File[], keepGallery?: string[]) {
  const form = new FormData();

  form.append("title", values.title.trim());
  if (values.slug.trim()) {
    form.append("slug", values.slug.trim());
  }

  form.append("date", JSON.stringify(values.date));
  form.append("techStack", JSON.stringify(values.techStack));
  form.append("role", JSON.stringify(values.role));
  form.append("content", JSON.stringify(values.content));

  const isUpdate = keepGallery !== undefined;
  for (const field of ["githubUrl", "liveUrl"] as const) {
    const value = values[field].trim();
    if (value || isUpdate) {
      form.append(field, value);
    }
  }

  if (keepGallery) {
    form.append("gallery", JSON.stringify(keepGallery));
  }
  for (const file of files) {
    form.append("gallery", file);
  }

  return form;
}

export const projectApi = {
  async getAll(): Promise<Project[]> {
    return api.get<Project[]>("/api/projects");
  },

  async getBySlug(slug: string): Promise<Project> {
    return api.get<Project>(`/api/projects/${slug}`);
  },

  async create(values: ProjectFormValues, files: File[]): Promise<Project> {
    return api.post<Project>("/api/projects", toFormData(values, files));
  },

  async update(
    slug: string,
    values: ProjectFormValues,
    keepGallery: string[],
    files: File[],
  ): Promise<Project> {
    return api.patch<Project>(`/api/projects/${slug}`, toFormData(values, files, keepGallery));
  },

  async remove(slug: string): Promise<void> {
    await api.delete(`/api/projects/${slug}`);
  },
};
