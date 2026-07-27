"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import Container from "@/components/Container";
import { imageUrl } from "@/shared/api/imageUrl";
import { useToast } from "@/shared/providers/ToastProvider";
import { useDeleteProject, useProjects } from "../project.hook";

export default function ProjectAdminList() {
  const { data, isPending, error } = useProjects();
  const remove = useDeleteProject();
  const toast = useToast();
  const [confirming, setConfirming] = useState<string | null>(null);

  return (
    <Container>
      <div className="py-12 md:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl uppercase tracking-tight text-ink md:text-4xl">
              Proyektlar
            </h1>
            <p className="mt-2 font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
              {data ? `${data.length} ta yozuv` : "Yuklanmoqda"}
            </p>
          </div>

          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-mono text-xs font-bold
                       uppercase tracking-wide text-paper transition-opacity duration-200 hover:opacity-80"
          >
            <Plus className="h-3.5 w-3.5" />
            Yangi
          </Link>
        </div>

        {isPending && (
          <div className="mt-8 flex flex-col gap-0.5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-24 animate-pulse bg-ink/5" />
            ))}
          </div>
        )}

        {(error || remove.error) && (
          <p className="mt-8 font-mono text-xs font-bold uppercase tracking-wide text-accent">
            {(error ?? remove.error)?.message}
          </p>
        )}

        {data && data.length === 0 && (
          <p className="mt-8 font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
            Hali proyekt yo&apos;q
          </p>
        )}

        {data && data.length > 0 && (
          <ul className="mt-8 border-t-2 border-ink">
            {data.map((project) => (
              <li
                key={project.slug}
                className="flex flex-wrap items-center gap-4 border-b-2 border-ink py-5"
              >
                <div className="h-16 w-24 shrink-0 overflow-hidden border-2 border-ink bg-ink/5">
                  {project.gallery[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl(project.gallery[0])}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-xl uppercase tracking-tight text-ink">
                    {project.title}
                  </p>
                  <p className="mt-1 font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
                    {String(project.date.month).padStart(2, "0")}/{project.date.year} · {project.slug}
                    {" · "}
                    {project.gallery.length} rasm
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/projects/${project.slug}`}
                    className="rounded-full border-2 border-ink px-4 py-2 font-mono text-xs font-bold
                               uppercase tracking-wide transition-colors duration-200 hover:bg-ink/10"
                  >
                    Tahrirlash
                  </Link>

                  {confirming === project.slug ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          remove.mutate(project.slug, {
                            onSuccess: () => toast("Proyekt o'chirildi"),
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
                      onClick={() => setConfirming(project.slug)}
                      className="rounded-full border-2 border-ink px-4 py-2 font-mono text-xs font-bold
                                 uppercase tracking-wide transition-colors duration-200 hover:bg-accent hover:border-accent hover:text-paper"
                    >
                      O&apos;chirish
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}
