"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatMonthYear } from "../blog.util";
import type { BlogPost, Locale } from "../blog.type";

export default function BlogListItem({ post }: { post: BlogPost }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("BlogPage");
  const content = post.content[locale] ?? post.content.uz;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex items-center gap-6 border-b-2 border-ink py-8 transition-colors duration-200 hover:bg-ink hover:text-paper md:py-10"
    >
      <div className="min-w-0 flex-1 transition-transform duration-200 group-hover:translate-x-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs font-bold uppercase tracking-wide">
          <span className="text-ink/40 transition-colors duration-200 group-hover:text-paper/50">
            {formatMonthYear(post.createdAt, locale)}
          </span>
          <span className="text-accent" aria-hidden>
            •
          </span>
          <span className="text-ink/40 transition-colors duration-200 group-hover:text-paper/50">
            {t(`themes.${post.theme}`)}
          </span>
        </div>

        <h2
          className="mt-4 font-display uppercase leading-none"
          style={{ fontSize: "clamp(1.5rem, 5vw, 3rem)", letterSpacing: "-0.03em" }}
        >
          {content.title}
        </h2>
      </div>

      <ArrowUpRight className="h-6 w-6 shrink-0 text-ink/40 transition-all duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-paper" />
    </Link>
  );
}
