"use client";

import { ArrowUpRight, Check, MoveRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Container from "@/components/Container";
import { useProject } from "../project.hook";
import type { Locale } from "../project.type";
import BackButton from "./BackButton";
import ProjectGallery from "./ProjectGallery";
import ProjectSection from "./ProjectSection";

const PARAGRAPH = "font-mono text-sm leading-relaxed md:text-base";

export default function ProjectDetail({ slug }: { slug: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("ProjectPage");
  const { data: project, isPending } = useProject(slug);

  if (isPending) {
    return (
      <Container>
        <div className="py-24">
          <div className="h-8 w-32 animate-pulse rounded-full bg-paper/10" />
          <div className="mt-10 h-24 w-2/3 animate-pulse bg-paper/10" />
          <div className="mt-10 h-56 max-h-[50svh] w-full animate-pulse bg-paper/5 md:h-96" />
        </div>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container>
        <div className="flex min-h-svh flex-col items-start justify-center gap-8 py-24">
          <h1
            className="font-display uppercase"
            style={{ fontSize: "clamp(2rem, 7vw, 4.5rem)", lineHeight: 0.85 }}
          >
            {t("notFound")}
          </h1>
          <BackButton label={t("back")} />
        </div>
      </Container>
    );
  }

  const content = project.content[locale] ?? project.content.uz;
  const month = new Intl.DateTimeFormat(locale === "uz" ? "uz-UZ" : "en-US", {
    month: "long",
  }).format(new Date(project.date.year, project.date.month - 1));

  return (
    <article className="pb-24">
      <Container>
        <div className="py-6">
          <BackButton label={t("back")} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t-2 border-paper/20 pt-6 font-mono text-xs font-bold uppercase tracking-wide">
          <span className="flex items-center gap-3">
            {project.liveUrl && (
              <>
                <span className="text-accent">{t("live")}</span>
                <span className="text-paper/40">•</span>
              </>
            )}
            {project.role.join(" + ")}
          </span>
          <span className="text-paper/40">
            {month} — {project.date.year}
          </span>
        </div>

        <h1
          className="mt-8 font-display uppercase"
          style={{
            fontSize: "clamp(2.5rem, 10vw, 7rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
          }}
        >
          {project.title}
        </h1>

        <p className="mt-8 max-w-172 font-display text-lg font-normal leading-normal md:text-2xl">
          {content.description}
        </p>

        <div className="mt-12">
          <ProjectGallery images={project.gallery} title={project.title} />
        </div>

        <div className="mt-16 h-0.5 bg-paper/20" />

        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-x-16">
          <ProjectSection label={t("problem")}>
            <p className={PARAGRAPH}>{content.problem}</p>
          </ProjectSection>
          <ProjectSection label={t("solution")}>
            <p className={PARAGRAPH}>{content.solution}</p>
          </ProjectSection>
        </div>

        <div className="mt-16">
          <ProjectSection label={t("contribution")}>
            <ul className="grid gap-3 md:grid-cols-2 md:gap-x-16">
              {content.myContribution.map((item) => (
                <li key={item} className="flex items-start gap-3 font-mono text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ProjectSection>
        </div>

        <div className="mt-16">
          <ProjectSection label={t("challenge")}>
            <p className={`${PARAGRAPH} max-w-172`}>{content.challenge}</p>
          </ProjectSection>
        </div>

        <div className="mt-16">
          <ProjectSection label={t("result")}>
            <ul className="flex flex-col gap-3">
              {content.result.map((item) => (
                <li key={item} className="flex items-start gap-3 font-mono text-sm md:text-base">
                  <MoveRight className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ProjectSection>
        </div>

        <div className="mt-16 flex flex-wrap gap-3">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border-2 border-paper/40 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-paper/70"
            >
              {tech}
            </span>
          ))}
        </div>

        {(project.liveUrl || project.githubUrl) && (
          <div className="mt-12 flex flex-wrap gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 rounded-full bg-paper px-6 py-3 font-mono text-xs font-bold uppercase tracking-wide text-ink"
              >
                {t("liveDemo")}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 rounded-full border-2 border-paper px-6 py-3 font-mono text-xs font-bold uppercase tracking-wide transition-colors duration-200 hover:bg-paper/10"
              >
                {t("sourceCode")}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
            )}
          </div>
        )}
      </Container>
    </article>
  );
}
