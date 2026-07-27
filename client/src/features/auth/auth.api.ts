import { api } from "@/shared/api/client";
import type { LoginInput, LoginResult } from "./auth.type";

export const authApi = {
  async login(input: LoginInput): Promise<LoginResult> {
    return api.post<LoginResult>("/api/auth/login", input);
  },

  async logout(): Promise<void> {
    await api.post("/api/auth/logout");
  },
};
