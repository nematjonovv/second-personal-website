"use client";

import { useLocale, useTranslations } from "next-intl";
import Container from "@/components/Container";
import { formatMonthYear } from "../blog.util";
import type { BlogPost, Locale } from "../blog.type";
import BlogBackButton from "./BlogBackButton";
import Markdown from "./Markdown";

export default function BlogDetail({ post }: { post: BlogPost }) {
  console.log(post);
  const locale = useLocale() as Locale;
  const t = useTranslations("BlogPage");

  const content = post.content[locale] ?? post.content.uz;

  return (
    <article className="pb-24">
      <Container>
        <div className="py-6">
          <BlogBackButton label={t("back")} />
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t-2 border-ink pt-6 font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
          <span>{formatMonthYear(post.createdAt, locale)}</span>
          <span className="text-accent" aria-hidden>•</span>
          <span>{t(`themes.${post.theme}`)}</span>
        </div>

        <h1
          className="mt-8 max-w-172 font-display uppercase"
          style={{ fontSize: "clamp(2.25rem, 8vw, 5rem)", lineHeight: 0.85, letterSpacing: "-0.04em" }}
        >
          {content.title}
        </h1>

        <div className="mt-12 h-0.5 bg-ink" />
        <div className="mt-10">
          <Markdown source={content.post} />
        </div>

        <div className="mt-16 border-t-2 border-ink pt-8">
          <BlogBackButton label={t("back")} />
        </div>
      </Container>
    </article>
  );
}