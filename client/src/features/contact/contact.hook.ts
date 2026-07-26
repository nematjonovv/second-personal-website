"use client";

import { useQuery } from "@tanstack/react-query";
import { contactApi } from "./contact.api";

export const contactKeys = {
  all: ["contact"] as const,
};

export function useContact() {
  return useQuery({
    queryKey: contactKeys.all,
    queryFn: () => contactApi.get(),
  });
}
