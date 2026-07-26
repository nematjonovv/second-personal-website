"use client";

import { useLocale, useTranslations } from "next-intl";
import Container from "@/components/Container";
import { useBlogPost } from "../blog.hook";
import { formatMonthYear } from "../blog.util";
import type { Locale } from "../blog.type";
import BlogBackButton from "./BlogBackButton";
import Markdown from "./Markdown";

export default function BlogDetail({ slug }: { slug: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("BlogPage");
  const { data: post, isPending } = useBlogPost(slug);

  if (isPending) {
    return (
      <Container>
        <div className="py-24">
          <div className="h-8 w-40 animate-pulse rounded-full bg-ink/10" />
          <div className="mt-10 h-20 w-2/3 animate-pulse bg-ink/10" />
          <div className="mt-12 h-72 max-w-172 animate-pulse bg-ink/5" />
        </div>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container>
        <div className="flex min-h-svh flex-col items-start justify-center gap-8 py-24">
          <h1
            className="font-display uppercase"
            style={{ fontSize: "clamp(2rem, 7vw, 4.5rem)", lineHeight: 0.85 }}
          >
            {t("notFound")}
          </h1>
          <BlogBackButton label={t("back")} />
        </div>
      </Container>
    );
  }

  const content = post.content[locale] ?? post.content.uz;

  return (
    <article className="pb-24">
      <Container>
        <div className="py-6">
          <BlogBackButton label={t("back")} />
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t-2 border-ink pt-6 font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
          <span>{formatMonthYear(post.createdAt, locale)}</span>
          <span className="text-accent" aria-hidden>
            •
          </span>
          <span>{t(`themes.${post.theme}`)}</span>
        </div>

        <h1
          className="mt-8 max-w-172 font-display uppercase"
          style={{
            fontSize: "clamp(2.25rem, 8vw, 5rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
          }}
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
