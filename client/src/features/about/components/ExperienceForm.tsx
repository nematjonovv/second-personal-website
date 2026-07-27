"use client";

import { useState } from "react";
import Field from "@/components/admin/Field";
import LocaleTabs from "@/components/admin/LocaleTabs";
import SubmitButton from "@/components/admin/SubmitButton";
import TextAreaField from "@/components/admin/TextAreaField";
import { useToast } from "@/shared/providers/ToastProvider";
import type { Experience, ExperienceFormValues, Locale } from "../about.type";
import { useCreateExperience, useUpdateExperience } from "../about.hook";

const emptyValues: ExperienceFormValues = {
  id: "",
  company: "",
  period: { from: new Date().getFullYear(), to: null },
  content: {
    uz: { role: "", summary: "" },
    en: { role: "", summary: "" },
  },
};

export default function ExperienceForm({
  experience,
  onDone,
}: {
  experience?: Experience;
  onDone: () => void;
}) {
  const toast = useToast();
  const [values, setValues] = useState<ExperienceFormValues>(experience ?? emptyValues);
  const [locale, setLocale] = useState<Locale>("uz");

  const create = useCreateExperience();
  const update = useUpdateExperience();
  const mutation = experience ? update : create;

  const current = values.content[locale];
  const isCurrentJob = values.period.to === null;

  const setContent = (field: "role" | "summary", value: string) =>
    setValues((previous) => ({
      ...previous,
      content: {
        ...previous.content,
        [locale]: { ...previous.content[locale], [field]: value },
      },
    }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const done = () => {
      toast(experience ? "Tajriba saqlandi" : "Tajriba qo'shildi");
      onDone();
    };

    if (experience) {
      update.mutate({ id: experience.id, values }, { onSuccess: done });
      return;
    }

    create.mutate(values, { onSuccess: done });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 border-2 border-ink/15 bg-ink/[0.02] p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="font-mono text-xs font-bold uppercase tracking-wide text-ink">
          {experience ? "Tahrirlash" : "Yangi tajriba"}
        </span>
        <LocaleTabs active={locale} onChange={setLocale} />
      </div>

      {!experience && (
        <Field
          name="experience-id"
          label="ID"
          value={values.id}
          onChange={(id) => setValues((previous) => ({ ...previous, id }))}
          hint="kichik harf, raqam va defis — masalan freelance. Keyin o'zgartirib bo'lmaydi"
          required
        />
      )}

      <Field
        name="company"
        label="Kompaniya"
        value={values.company}
        onChange={(company) => setValues((previous) => ({ ...previous, company }))}
        hint="tarjimasiz — ikkala tilda bir xil"
        required
      />

      <div className="grid grid-cols-2 gap-5">
        <Field
          name="from"
          label="Boshlangan yil"
          value={String(values.period.from)}
          onChange={(from) =>
            setValues((previous) => ({
              ...previous,
              period: { ...previous.period, from: Number(from) || 0 },
            }))
          }
          required
        />

        <Field
          name="to"
          label="Tugagan yil"
          value={isCurrentJob ? "" : String(values.period.to)}
          onChange={(to) =>
            setValues((previous) => ({
              ...previous,
              period: { ...previous.period, to: Number(to) || 0 },
            }))
          }
        />
      </div>

      <label className="flex w-fit cursor-pointer items-center gap-3 font-mono text-xs font-bold uppercase tracking-wide text-ink">
        <input
          type="checkbox"
          checked={isCurrentJob}
          onChange={(event) =>
            setValues((previous) => ({
              ...previous,
              period: {
                ...previous.period,
                to: event.target.checked ? null : new Date().getFullYear(),
              },
            }))
          }
          className="h-4 w-4 accent-[var(--vermilion)]"
        />
        Hozirgacha
      </label>

      <Field
        name={`role-${locale}`}
        label="Lavozim"
        value={current.role}
        onChange={(value) => setContent("role", value)}
        required
      />

      <TextAreaField
        name={`summary-${locale}`}
        label="Izoh"
        value={current.summary}
        onChange={(value) => setContent("summary", value)}
        rows={3}
        hint="bir jumla"
      />

      {mutation.error && (
        <p className="font-mono text-xs font-bold uppercase tracking-wide text-accent">
          {mutation.error.message}
        </p>
      )}

      <div className="flex items-center gap-4">
        <SubmitButton pending={mutation.isPending}>
          {experience ? "Saqlash" : "Qo'shish"}
        </SubmitButton>

        <button
          type="button"
          onClick={onDone}
          className="rounded-full border-2 border-ink px-6 py-3 font-mono text-xs font-bold uppercase
                     tracking-wide transition-colors duration-200 hover:bg-ink/10"
        >
          Bekor qilish
        </button>
      </div>
    </form>
  );
}
