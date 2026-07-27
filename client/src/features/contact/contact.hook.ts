"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactApi } from "./contact.api";
import type { UpdateContactInput } from "./contact.type";

export const contactKeys = {
  all: ["contact"] as const,
};

export function useContact() {
  return useQuery({
    queryKey: contactKeys.all,
    queryFn: () => contactApi.get(),
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateContactInput) => contactApi.update(input),
    onSuccess: (contact) => queryClient.setQueryData(contactKeys.all, contact),
  });
}
