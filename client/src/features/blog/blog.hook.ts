"use client";

import { useQuery } from "@tanstack/react-query";
import { blogApi } from "./blog.api";

export const blogKeys = {
  all: ["posts"] as const,
  detail: (slug: string) => ["posts", slug] as const,
};

export function useBlogPosts() {
  return useQuery({
    queryKey: blogKeys.all,
    queryFn: () => blogApi.getAll(),
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: blogKeys.detail(slug),
    queryFn: () => blogApi.getBySlug(slug),
    enabled: Boolean(slug),
  });
}
