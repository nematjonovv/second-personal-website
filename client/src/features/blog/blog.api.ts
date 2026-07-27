import { api } from "@/shared/api/client";
import type { BlogFormValues, BlogPost } from "./blog.type";

function toPayload(values: BlogFormValues) {
  return {
    ...(values.slug.trim() ? { slug: values.slug.trim() } : {}),
    theme: values.theme,
    ...(values.createdAt ? { createdAt: new Date(values.createdAt).toISOString() } : {}),
    content: values.content,
  };
}

export const blogApi = {
  async getAll(): Promise<BlogPost[]> {
    return api.get<BlogPost[]>("/api/blog");
  },

  async getBySlug(slug: string): Promise<BlogPost> {
    return api.get<BlogPost>(`/api/blog/${slug}`);
  },

  async create(values: BlogFormValues): Promise<BlogPost> {
    return api.post<BlogPost>("/api/blog", toPayload(values));
  },

  async update(slug: string, values: BlogFormValues): Promise<BlogPost> {
    return api.patch<BlogPost>(`/api/blog/${slug}`, toPayload(values));
  },

  async remove(slug: string): Promise<void> {
    await api.delete(`/api/blog/${slug}`);
  },
};
