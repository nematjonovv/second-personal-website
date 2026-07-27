"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/shared/providers/ToastProvider";
import type { Experience } from "../about.type";
import { useDeleteExperience } from "../about.hook";
import ExperienceForm from "./ExperienceForm";

export default function AboutAdminExperience({ items }: { items: Experience[] }) {
  const toast = useToast();
  const remove = useDeleteExperience();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);

  return (
    <section className="flex flex-col gap-5 border-2 border-ink p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-lg uppercase tracking-tight text-ink">
          Tajriba — {items.length} ta
        </h2>

        {!creating && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 rounded-full border-2 border-ink px-4 py-2 font-mono text-xs
                       font-bold uppercase tracking-wide transition-colors duration-200 hover:bg-ink/10"
          >
            <Plus className="h-3.5 w-3.5" />
            Yangi
          </button>
        )}
      </div>

      {creating && <ExperienceForm onDone={() => setCreating(false)} />}

      {remove.error && (
        <p className="font-mono text-xs font-bold uppercase tracking-wide text-accent">
          {remove.error.message}
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {items.map((experience) =>
          editing === experience.id ? (
            <li key={experience.id}>
              <ExperienceForm experience={experience} onDone={() => setEditing(null)} />
            </li>
          ) : (
            <li
              key={experience.id}
              className="flex flex-wrap items-center gap-4 border-2 border-ink/15 p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg uppercase tracking-tight text-ink">
                  {experience.company}
                </p>
                <p className="mt-1 font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
                  {experience.period.from} — {experience.period.to ?? "Hozir"} ·{" "}
                  {experience.content.uz.role} · {experience.id}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(experience.id)}
                  className="rounded-full border-2 border-ink px-4 py-2 font-mono text-xs font-bold
                             uppercase tracking-wide transition-colors duration-200 hover:bg-ink/10"
                >
                  Tahrirlash
                </button>

                {confirming === experience.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        remove.mutate(experience.id, {
                          onSuccess: () => toast("Tajriba o'chirildi"),
                          onSettled: () => setConfirming(null),
                        })
                      }
                      disabled={remove.isPending}
                      className="rounded-full bg-accent px-4 py-2 font-mono text-xs font-bold uppercase
                                 tracking-wide text-paper transition-opacity duration-200 disabled:opacity-40"
                    >
                      Tasdiqlash
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirming(null)}
                      className="rounded-full border-2 border-ink px-4 py-2 font-mono text-xs font-bold
                                 uppercase tracking-wide transition-colors duration-200 hover:bg-ink/10"
                    >
                      Bekor
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirming(experience.id)}
                    className="rounded-full border-2 border-ink px-4 py-2 font-mono text-xs font-bold
                               uppercase tracking-wide transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-paper"
                  >
                    O&apos;chirish
                  </button>
                )}
              </div>
            </li>
          ),
        )}
      </ul>

      <p className="font-mono text-xs uppercase tracking-wide text-ink/40">
        Tartib boshlangan yil bo&apos;yicha — yangisi yuqorida.
      </p>
    </section>
  );
}
