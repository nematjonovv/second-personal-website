"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/shared/providers/AuthProvider";
import { authApi } from "./auth.api";
import type { LoginInput } from "./auth.type";

export function useLogin() {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: ({ token, user }) => signIn(token, user),
  });
}
