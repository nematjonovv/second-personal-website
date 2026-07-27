"use client";

import { useState } from "react";
import Markdown from "./Markdown";

export default function MarkdownEditor({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const [preview, setPreview] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
          {label}
        </span>

        <button
          type="button"
          onClick={() => setPreview((previous) => !previous)}
          className="rounded-full border-2 border-ink px-4 py-1.5 font-mono text-xs font-bold uppercase
                     tracking-wide transition-colors duration-200 hover:bg-ink/10 md:hidden"
        >
          {preview ? "Tahrirlash" : "Ko'rinishi"}
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={22}
          spellCheck={false}
          className={`w-full resize-y border-2 border-ink bg-paper px-4 py-3 font-mono text-sm leading-relaxed
                      text-ink outline-none transition-colors duration-200 focus:border-accent
                      ${preview ? "hidden md:block" : ""}`}
        />

        <div
          className={`max-h-160 overflow-y-auto border-2 border-ink/15 bg-paper p-5 ${
            preview ? "" : "hidden md:block"
          }`}
        >
          {value.trim() ? (
            <Markdown source={value} />
          ) : (
            <p className="font-mono text-xs uppercase tracking-wide text-ink/40">
              Preview shu yerda chiqadi
            </p>
          )}
        </div>
      </div>

      <p className="font-mono text-xs uppercase tracking-wide text-ink/40">
        ## sarlavha · ``` kod · - va 1. ro&apos;yxat · **qalin** · `kod` · [matn](url)
      </p>
    </div>
  );
}
