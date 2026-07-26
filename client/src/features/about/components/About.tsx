"use client";

import { useLocale } from "next-intl";
import Container from "@/components/Container";
import { useAbout } from "../about.hook";
import type { Locale } from "../about.type";
import AboutIntro from "./AboutIntro";
import ExperienceSection from "./ExperienceSection";
import ToolboxSection from "./ToolboxSection";

export default function About() {
  const locale = useLocale() as Locale;
  const { data, isPending } = useAbout();

  if (isPending || !data) {
    return (
      <Container>
        <div className="pt-12 pb-20 md:pt-16">
          <div className="h-6 w-24 animate-pulse rounded-full bg-ink/10" />
          <div className="mt-6 h-40 w-full animate-pulse bg-ink/10 md:h-64" />
          <div className="mt-12 h-32 w-full animate-pulse bg-ink/5" />
          <div className="mt-16 h-64 w-full animate-pulse bg-ink/5" />
        </div>
      </Container>
    );
  }

  const content = data.content[locale] ?? data.content.uz;

  return (
    <Container>
      <div className="pb-20 md:pb-28">
        <AboutIntro content={content} />
        <ExperienceSection items={data.experience} locale={locale} />
        <ToolboxSection groups={data.toolbox} locale={locale} />
      </div>
    </Container>
  );
}
