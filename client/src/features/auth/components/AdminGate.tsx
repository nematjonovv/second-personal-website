"use client";

import { useAuth } from "@/shared/providers/AuthProvider";
import LoginForm from "./LoginForm";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();

  if (status === "loading") {
    return <div className="min-h-svh bg-paper" />;
  }

  if (status === "anonymous") {
    return <LoginForm />;
  }

  return <>{children}</>;
}
