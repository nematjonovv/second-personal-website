import { blogPosts } from "./blog.data";
import type { BlogPost } from "./blog.type";

export const blogApi = {
  async getAll(): Promise<BlogPost[]> {
    return blogPosts;
  },

  async getBySlug(slug: string): Promise<BlogPost | null> {
    return blogPosts.find((post) => post.slug === slug) ?? null;
  },
};
