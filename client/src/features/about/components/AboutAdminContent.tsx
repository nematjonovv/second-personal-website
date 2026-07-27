"use client";

import { useState } from "react";
import LocaleTabs from "@/components/admin/LocaleTabs";
import SubmitButton from "@/components/admin/SubmitButton";
import TextAreaField from "@/components/admin/TextAreaField";
import { useToast } from "@/shared/providers/ToastProvider";
import type { AboutContent, AccentText, Locale } from "../about.type";
import { useUpdateAboutContent } from "../about.hook";
import AccentTextField from "./AccentTextField";

export default function AboutAdminContent({ initial }: { initial: Record<Locale, AboutContent> }) {
  const toast = useToast();
  const [values, setValues] = useState(initial);
  const [locale, setLocale] = useState<Locale>("uz");
  const { mutate, isPending, error } = useUpdateAboutContent();

  const content = values[locale];

  const patch = (next: Partial<AboutContent>) =>
    setValues((previous) => ({ ...previous, [locale]: { ...previous[locale], ...next } }));

  const setBio = (next: Partial<AboutContent["bio"]>) =>
    patch({ bio: { ...content.bio, ...next } });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    mutate(values, { onSuccess: () => toast("About matni saqlandi") });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 border-2 border-ink p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-lg uppercase tracking-tight text-ink">Matn</h2>
        <LocaleTabs active={locale} onChange={setLocale} />
      </div>

      <AccentTextField
        name={`headline-${locale}`}
        label="Sarlavha"
        value={content.headline}
        onChange={(headline: AccentText) => patch({ headline })}
      />

      <AccentTextField
        name={`bio-primary-${locale}`}
        label="Bio — birinchi paragraf"
        value={content.bio.primary}
        onChange={(primary: AccentText) => setBio({ primary })}
      />

      <TextAreaField
        name={`bio-secondary-${locale}`}
        label="Bio — ikkinchi paragraf"
        value={content.bio.secondary}
        onChange={(secondary) => setBio({ secondary })}
        rows={5}
        hint="aksentsiz oddiy matn"
      />

      {error && (
        <p className="font-mono text-xs font-bold uppercase tracking-wide text-accent">
          {error.message}
        </p>
      )}

      <div>
        <SubmitButton pending={isPending}>Saqlash</SubmitButton>
      </div>
    </form>
  );
}
