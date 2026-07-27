"use client";

import Field from "@/components/admin/Field";
import type { AccentText } from "../about.type";

export default function AccentTextField({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: AccentText;
  onChange: (value: AccentText) => void;
}) {
  return (
    <div className="flex flex-col gap-4 border-2 border-ink/15 p-5">
      <span className="font-mono text-xs font-bold uppercase tracking-wide text-ink">{label}</span>

      <Field
        name={`${name}-before`}
        label="Oldingi qism"
        value={value.before}
        onChange={(before) => onChange({ ...value, before })}
        hint="oxiridagi bo'shliqni ham yozing"
      />

      <Field
        name={`${name}-accent`}
        label="Aksent so'z"
        value={value.accent}
        onChange={(accent) => onChange({ ...value, accent })}
        hint="kursiv serif, vermilion rangda chiqadi"
        required
      />

      <Field
        name={`${name}-after`}
        label="Keyingi qism"
        value={value.after}
        onChange={(after) => onChange({ ...value, after })}
        hint="boshidagi bo'shliqni ham yozing"
      />

      <p className="font-mono text-xs uppercase tracking-wide text-ink/40">
        Ko&apos;rinishi: {value.before}
        <span className="font-accent text-sm italic text-accent">{value.accent}</span>
        {value.after}
      </p>
    </div>
  );
}
