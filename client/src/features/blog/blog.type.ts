export type Locale = "uz" | "en";

export type BlogTheme =
  | "architecture"
  | "typescript"
  | "postgres"
  | "frontend"
  | "devops";

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
