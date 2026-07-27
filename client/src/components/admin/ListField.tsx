"use client";

import { Plus, X } from "lucide-react";

type ListFieldProps = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  hint?: string;
};

export default function ListField({
  label,
  values,
  onChange,
  placeholder,
  hint,
}: ListFieldProps) {
  const update = (index: number, value: string) =>
    onChange(values.map((item, i) => (i === index ? value : item)));

  const remove = (index: number) => onChange(values.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
        {label}
      </span>

      <div className="flex flex-col gap-2">
        {values.map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              value={value}
              placeholder={placeholder}
              onChange={(event) => update(index, event.target.value)}
              className="w-full border-2 border-ink bg-paper px-4 py-3 font-mono text-sm text-ink
                         outline-none transition-colors duration-200 focus:border-accent"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              aria-label="O'chirish"
              className="shrink-0 border-2 border-ink p-3 transition-colors duration-200 hover:bg-ink hover:text-paper"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange([...values, ""])}
        className="flex w-fit items-center gap-2 rounded-full border-2 border-ink px-4 py-2 font-mono text-xs
                   font-bold uppercase tracking-wide transition-colors duration-200 hover:bg-ink/10"
      >
        <Plus className="h-3.5 w-3.5" />
        Qo&apos;shish
      </button>

      {hint && <p className="font-mono text-xs uppercase tracking-wide text-ink/40">{hint}</p>}
    </div>
  );
}
