"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import Container from "@/components/Container";
import { useToast } from "@/shared/providers/ToastProvider";
import { useBlogPosts, useDeleteBlogPost } from "../blog.hook";
import { formatMonthYear } from "../blog.util";

export default function BlogAdminList() {
  const { data, isPending, error } = useBlogPosts();
  const remove = useDeleteBlogPost();
  const toast = useToast();
  const t = useTranslations("BlogPage.themes");
  const [confirming, setConfirming] = useState<string | null>(null);

  return (
    <Container>
      <div className="py-12 md:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl uppercase tracking-tight text-ink md:text-4xl">
              Blog
            </h1>
            <p className="mt-2 font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
              {data ? `${data.length} ta yozuv` : "Yuklanmoqda"}
            </p>
          </div>

          <Link
            href="/admin/blog/new"
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
              <div key={index} className="h-20 animate-pulse bg-ink/5" />
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
            Hali post yo&apos;q
          </p>
        )}

        {data && data.length > 0 && (
          <ul className="mt-8 border-t-2 border-ink">
            {data.map((post) => (
              <li
                key={post.slug}
                className="flex flex-wrap items-center gap-4 border-b-2 border-ink py-5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
                    <span>{formatMonthYear(post.createdAt, "uz")}</span>
                    <span className="text-accent" aria-hidden>
                      •
                    </span>
                    <span>{t(post.theme)}</span>
                  </div>

                  <p className="mt-1 truncate font-display text-xl uppercase tracking-tight text-ink">
                    {post.content.uz.title}
                  </p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink/40">
                    {post.slug}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/blog/${post.slug}`}
                    className="rounded-full border-2 border-ink px-4 py-2 font-mono text-xs font-bold
                               uppercase tracking-wide transition-colors duration-200 hover:bg-ink/10"
                  >
                    Tahrirlash
                  </Link>

                  {confirming === post.slug ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          remove.mutate(post.slug, {
                            onSuccess: () => toast("Post o'chirildi"),
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
                      onClick={() => setConfirming(post.slug)}
                      className="rounded-full border-2 border-ink px-4 py-2 font-mono text-xs font-bold
                                 uppercase tracking-wide transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-paper"
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
