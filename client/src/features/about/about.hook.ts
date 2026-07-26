"use client";

import { useQuery } from "@tanstack/react-query";
import { aboutApi } from "./about.api";

export const aboutKeys = {
  all: ["about"] as const,
};

export function useAbout() {
  return useQuery({
    queryKey: aboutKeys.all,
    queryFn: () => aboutApi.get(),
  });
}
