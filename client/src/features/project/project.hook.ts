"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectApi } from "./project.api";
import type { ProjectFormValues } from "./project.type";

export const projectKeys = {
  all: ["projects"] as const,
  detail: (slug: string) => ["projects", slug] as const,
};

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.all,
    queryFn: () => projectApi.getAll(),
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: projectKeys.detail(slug),
    queryFn: () => projectApi.getBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ values, files }: { values: ProjectFormValues; files: File[] }) =>
      projectApi.create(values, files),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all }),
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "x-revalidate-secret": process.env.NEXT_PUBLIC_REVALIDATE_SECRET! },
        });
    }
  });
}

export function useUpdateProject(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      values,
      keepGallery,
      files,
    }: {
      values: ProjectFormValues;
      keepGallery: string[];
      files: File[];
    }) => projectApi.update(slug, values, keepGallery, files),
    onSuccess: (project) => {
      queryClient.setQueryData(projectKeys.detail(project.slug), project);
      if (project.slug !== slug) {
        queryClient.removeQueries({ queryKey: projectKeys.detail(slug) });
      }
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => projectApi.remove(slug),
    onSuccess: (_data, slug) => {
      queryClient.removeQueries({ queryKey: projectKeys.detail(slug) });
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}
