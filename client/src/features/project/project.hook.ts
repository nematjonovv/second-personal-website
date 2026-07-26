"use client";

import { useQuery } from "@tanstack/react-query";
import { projectApi } from "./project.api";

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
