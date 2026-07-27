export type Locale = "uz" | "en";

export type BlogTheme =
  | "architecture"
  | "typescript"
  | "postgres"
  | "frontend"
  | "devops"
  | string

export type BlogPostContent = {
  title: string;
  post: string;
};

export type BlogPost = {
  slug: string;
  theme: BlogTheme;
  createdAt: string;
  content: Record<Locale, BlogPostContent>;
};

export const BLOG_THEMES = [
  "architecture",
  "typescript",
  "postgres",
  "frontend",
  "devops",
] as const;

export type BlogFormValues = {
  slug: string;
  theme: string;
  createdAt: string;
  content: Record<Locale, BlogPostContent>;
};
