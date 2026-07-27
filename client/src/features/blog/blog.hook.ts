"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blogApi } from "./blog.api";
import type { BlogFormValues } from "./blog.type";

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

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: BlogFormValues) => blogApi.create(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: blogKeys.all }),
  });
}

export function useUpdateBlogPost(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: BlogFormValues) => blogApi.update(slug, values),
    onSuccess: (post) => {
      queryClient.setQueryData(blogKeys.detail(post.slug), post);
      if (post.slug !== slug) {
        queryClient.removeQueries({ queryKey: blogKeys.detail(slug) });
      }
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => blogApi.remove(slug),
    onSuccess: (_data, slug) => {
      queryClient.removeQueries({ queryKey: blogKeys.detail(slug) });
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}
