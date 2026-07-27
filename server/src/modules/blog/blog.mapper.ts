import type { BlogPost } from "../../generated/prisma/client";
import type { BlogPostContentInput } from "./blog.validation";

export type BlogPostResponse = {
  slug: string;
  theme: string;
  createdAt: string;
  content: { uz: BlogPostContentInput; en: BlogPostContentInput };
};

export function toBlogPostResponse(post: BlogPost): BlogPostResponse {
  return {
    slug: post.slug,
    theme: post.theme,
    createdAt: post.createdAt.toISOString(),
    content: {
      uz: post.uz as unknown as BlogPostContentInput,
      en: post.en as unknown as BlogPostContentInput,
    },
  };
}
