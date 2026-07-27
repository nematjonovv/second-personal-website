// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllPostsServer } from "@/features/blog/blog.api";
import { getAllProjectsServer } from "@/features/project/project.api";

const SITE_URL = "https://nematjonovx.uz";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/work`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];

  let blogRoutes: MetadataRoute.Sitemap = [];
  let projectRoutes: MetadataRoute.Sitemap = [];

  try {
    const posts = await getAllPostsServer();
    blogRoutes = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.createdAt),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
  }

  try {
    const projects = await getAllProjectsServer();
    projectRoutes = projects.map((project) => ({
      url: `${SITE_URL}/work/${project.slug}`,
      lastModified: new Date(project.date.year, project.date.month - 1, 1),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
  }

  return [...staticRoutes, ...blogRoutes, ...projectRoutes];
}