"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Field from "@/components/admin/Field";
import SubmitButton from "@/components/admin/SubmitButton";
import { EASE } from "@/shared/contstans/constants";
import { useLogin } from "../auth.hook";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending, error } = useLogin();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    mutate({ username: username.trim(), password });
  };

  return (
    <div className="flex min-h-svh items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: EASE }}
        className="w-full max-w-100 border-2 border-ink bg-paper p-8"
      >
        <h1 className="font-display text-2xl uppercase tracking-tight text-ink">Admin</h1>
        <p className="mt-2 font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
          Kirish uchun ma&apos;lumotlarni kiriting
        </p>

        <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
          <Field
            name="username"
            label="Foydalanuvchi"
            value={username}
            onChange={setUsername}
            autoComplete="username"
            required
          />

          <Field
            name="password"
            label="Parol"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            required
          />

          {error && (
            <p className="font-mono text-xs font-bold uppercase tracking-wide text-accent">
              {error.message}
            </p>
          )}

          <div className="mt-2">
            <SubmitButton pending={isPending} pendingLabel="Kirilmoqda…">
              Kirish
            </SubmitButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
