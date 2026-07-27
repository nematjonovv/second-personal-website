"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aboutApi } from "./about.api";
import type { AboutContent, ExperienceFormValues, Locale, ToolboxFormValues } from "./about.type";

export const aboutKeys = {
  all: ["about"] as const,
};

export function useAbout() {
  return useQuery({
    queryKey: aboutKeys.all,
    queryFn: () => aboutApi.get(),
  });
}

function useAboutMutation<TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: aboutKeys.all }),
  });
}

export function useUpdateAboutContent() {
  return useAboutMutation((content: Record<Locale, AboutContent>) =>
    aboutApi.updateContent(content),
  );
}

export function useCreateExperience() {
  return useAboutMutation((values: ExperienceFormValues) => aboutApi.createExperience(values));
}

export function useUpdateExperience() {
  return useAboutMutation(({ id, values }: { id: string; values: ExperienceFormValues }) =>
    aboutApi.updateExperience(id, values),
  );
}

export function useDeleteExperience() {
  return useAboutMutation((id: string) => aboutApi.removeExperience(id));
}

export function useCreateToolboxGroup() {
  return useAboutMutation((values: ToolboxFormValues) => aboutApi.createToolboxGroup(values));
}

export function useUpdateToolboxGroup() {
  return useAboutMutation(({ id, values }: { id: string; values: ToolboxFormValues }) =>
    aboutApi.updateToolboxGroup(id, values),
  );
}

export function useDeleteToolboxGroup() {
  return useAboutMutation((id: string) => aboutApi.removeToolboxGroup(id));
}
