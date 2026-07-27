"use client";

import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/features/auth/auth.api";
import type { AuthUser } from "@/features/auth/auth.type";
import { clearToken, getToken, setToken, subscribeToken } from "@/shared/api/token";

type AuthStatus = "loading" | "authenticated" | "anonymous";

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  signIn: (token: string, user: AuthUser) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const noopSubscribe = () => () => {};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const queryClient = useQueryClient();

  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const token = useSyncExternalStore(subscribeToken, getToken, () => null);

  const status: AuthStatus = !hydrated ? "loading" : token ? "authenticated" : "anonymous";

  useEffect(() => {
    if (hydrated && !token) {
      queryClient.clear();
    }
  }, [hydrated, token, queryClient]);

  const signIn = useCallback((nextToken: string, nextUser: AuthUser) => {
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const signOut = useCallback(() => {
    void authApi.logout().catch(() => {});
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ status, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth faqat AuthProvider ichida ishlatiladi");
  }
  return context;
}
