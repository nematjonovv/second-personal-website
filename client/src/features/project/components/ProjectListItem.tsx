"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Locale, Project } from "../project.type";

export default function ProjectListItem({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("WorkPage");
  const content = project.content[locale] ?? project.content.uz;

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group flex items-start gap-4 border-b-2 border-ink py-10 transition-colors duration-200 hover:bg-ink hover:text-paper md:gap-6 md:py-14"
    >
      <span className="mt-3 font-mono text-xs font-bold uppercase tracking-wide text-ink/40 transition-[color,transform] duration-200 group-hover:translate-x-3 group-hover:text-paper/50 md:mt-5">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="min-w-0 flex-1 transition-transform duration-200 group-hover:translate-x-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h2
            className="font-display uppercase leading-none"
            style={{ fontSize: "clamp(2rem, 7vw, 4.5rem)", letterSpacing: "-0.03em" }}
          >
            {project.title}
          </h2>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs font-bold tracking-wide text-paper transition-colors duration-200 group-hover:bg-paper group-hover:text-ink">
            {project.date.year}
          </span>
        </div>

        <p className="mt-6 max-w-172 font-display text-lg font-normal leading-normal md:text-xl">
          {content.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border-2 border-ink px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wide transition-colors duration-200 group-hover:border-paper/40 group-hover:text-paper/70"
            >
              {tech}
            </span>
          ))}
        </div>

        <p className="mt-5 font-mono text-xs font-bold uppercase tracking-wide text-ink/40 transition-colors duration-200 group-hover:text-paper/50">
          {t("role")}: {project.role.join(", ")}
        </p>
      </div>

      <ArrowUpRight className="mt-3 h-6 w-6 shrink-0 text-ink/40 transition-all duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-paper md:mt-5" />
    </Link>
  );
}
