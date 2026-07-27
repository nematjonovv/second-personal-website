// AboutIntro.tsx
import { getTranslations } from "next-intl/server";
import type { AboutContent } from "../about.type";
import AccentPhrase from "./AccentPhrase";

export default async function AboutIntro({ content }: { content: AboutContent }) {
  const t = await getTranslations("AboutPage");

  return (
    <section className="pt-12 md:pt-16">
      <p className="font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
        03 / {t("section")}
      </p>
      <h1 className="mt-6 font-display uppercase" style={{ fontSize: "clamp(2.5rem, 9vw, 8rem)", lineHeight: 0.85, letterSpacing: "-0.04em" }}>
        <AccentPhrase text={content.headline} />
      </h1>
      <div className="mt-12 h-0.5 bg-ink" />
      <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-16">
        <p className="font-display text-lg font-normal leading-normal md:text-2xl">
          <AccentPhrase text={content.bio.primary} className="text-xl md:text-3xl" />
        </p>
        <p className="text-base leading-relaxed text-ink/60">{content.bio.secondary}</p>
      </div>
    </section>
  );
}