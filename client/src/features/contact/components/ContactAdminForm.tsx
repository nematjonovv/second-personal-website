"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Field from "@/components/admin/Field";
import SubmitButton from "@/components/admin/SubmitButton";
import { useToast } from "@/shared/providers/ToastProvider";
import type { Contact, UpdateContactInput } from "../contact.type";
import { useContact, useUpdateContact } from "../contact.hook";

const fields = [
  { name: "email", label: "Email", hint: "hello@hikmatillo.dev" },
  { name: "github", label: "GitHub", hint: "faqat username, havolasiz" },
  { name: "linkedin", label: "LinkedIn", hint: "faqat username, in/ prefiksisiz" },
  { name: "telegram", label: "Telegram", hint: "faqat username, @ belgisisiz" },
  { name: "phoneNumber", label: "Telefon", hint: "+998901234567 — bo'shliqsiz" },
] as const satisfies ReadonlyArray<{ name: keyof Contact; label: string; hint: string }>;

export default function ContactAdminForm({ initial }: { initial: Contact }) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState<Contact>(initial);
  const { data } = useContact();
  const { mutate, isPending, error } = useUpdateContact();

  const saved = data ?? initial;

  const changed = fields
    .map(({ name }) => name)
    .filter((name) => values[name].trim() !== saved[name]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (changed.length === 0) return;

    const input: UpdateContactInput = Object.fromEntries(
      changed.map((name) => [name, values[name].trim()]),
    );
    mutate(input, {
      onSuccess: () => {
        toast("Kontakt saqlandi");
        router.push("/admin");
      },
    });
  };

  return (
    <form onSubmit={submit} className="mt-8 flex max-w-140 flex-col gap-5">
      {fields.map((field) => (
        <Field
          key={field.name}
          name={field.name}
          label={field.label}
          hint={field.hint}
          value={values[field.name]}
          onChange={(value) => setValues((previous) => ({ ...previous, [field.name]: value }))}
          required
        />
      ))}

      {error && (
        <p className="font-mono text-xs font-bold uppercase tracking-wide text-accent">
          {error.message}
        </p>
      )}

      <div className="mt-2 flex items-center gap-4">
        <SubmitButton pending={isPending} disabled={changed.length === 0}>
          Saqlash
        </SubmitButton>

        <span className="font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
          {changed.length > 0 ? `${changed.length} ta maydon o'zgardi` : "O'zgarish yo'q"}
        </span>
      </div>
    </form>
  );
}
