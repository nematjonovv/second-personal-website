"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import { useToast } from "@/shared/providers/ToastProvider";
import type { ToolboxGroup } from "../about.type";
import { useDeleteToolboxGroup, useUpdateToolboxGroup } from "../about.hook";
import ToolboxForm from "./ToolboxForm";

const iconButton =
  "border-2 border-ink p-2 transition-colors duration-200 hover:bg-ink hover:text-paper disabled:opacity-30 disabled:hover:bg-paper disabled:hover:text-ink";

export default function AboutAdminToolbox({ items }: { items: ToolboxGroup[] }) {
  const toast = useToast();
  const remove = useDeleteToolboxGroup();
  const update = useUpdateToolboxGroup();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;

    const moved = items[index];
    const swapped = items[target];

    update.mutate(
      { id: moved.id, values: { ...moved, position: target } },
      {
        onSuccess: () =>
          update.mutate({ id: swapped.id, values: { ...swapped, position: index } }),
      },
    );
  };

  return (
    <section className="flex flex-col gap-5 border-2 border-ink p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-lg uppercase tracking-tight text-ink">
          Toolbox — {items.length} ta guruh
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

      {creating && <ToolboxForm onDone={() => setCreating(false)} />}

      {(remove.error || update.error) && (
        <p className="font-mono text-xs font-bold uppercase tracking-wide text-accent">
          {(remove.error ?? update.error)?.message}
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {items.map((group, index) =>
          editing === group.id ? (
            <li key={group.id}>
              <ToolboxForm group={group} onDone={() => setEditing(null)} />
            </li>
          ) : (
            <li key={group.id} className="flex flex-wrap items-center gap-4 border-2 border-ink/15 p-4">
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0 || update.isPending}
                  aria-label="Yuqoriga"
                  className={iconButton}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1 || update.isPending}
                  aria-label="Pastga"
                  className={iconButton}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-display text-lg uppercase tracking-tight text-ink">
                  {group.label.uz} / {group.label.en}
                </p>
                <p className="mt-1 font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
                  {group.items.join(", ")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(group.id)}
                  className="rounded-full border-2 border-ink px-4 py-2 font-mono text-xs font-bold
                             uppercase tracking-wide transition-colors duration-200 hover:bg-ink/10"
                >
                  Tahrirlash
                </button>

                {confirming === group.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        remove.mutate(group.id, {
                          onSuccess: () => toast("Guruh o'chirildi"),
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
                    onClick={() => setConfirming(group.id)}
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
        Tartib o&apos;q tugmalari bilan o&apos;zgaradi — saytda ham shu ketma-ketlikda chiqadi.
      </p>
    </section>
  );
}
