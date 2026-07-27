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



const API_BASE_URL = process.env.API_BASE_URL!;


export async function getAllProjectsServer(): Promise<Project[]> {
  const res = await fetch(`${API_BASE_URL}/api/projects`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  const json = await res.json()
  return json.data;
}

export async function getProjectBySlugServer(slug: string): Promise<Project | null> {
  const res = await fetch(`${API_BASE_URL}/api/projects/${slug}`, {
    next: { revalidate: 3600 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch project");
  const json = await res.json()
  return json.data;
}