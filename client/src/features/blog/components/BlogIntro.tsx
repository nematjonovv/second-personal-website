import { getTranslations } from "next-intl/server";
import Container from "@/components/Container";

export default async function BlogIntro() {
  const t = await getTranslations("BlogPage");

  return (
    <section className="pt-12 pb-10 md:pt-16">
      <Container>
        <p className="font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
          04 / {t("section")}
        </p>

        <h1
          className="mt-6 font-display uppercase"
          style={{
            fontSize: "clamp(3rem, 12vw, 10rem)",
            lineHeight: 0.82,
            letterSpacing: "-0.04em",
          }}
        >
          {t("title")}
          <span
            className="ml-[0.04em] inline-block h-[0.18em] w-[0.18em] bg-accent align-baseline"
            aria-hidden
          />
        </h1>

        <p className="mt-8 max-w-172 font-display text-lg font-normal leading-normal md:text-2xl">
          {t("description")}
        </p>
      </Container>
    </section>
  );
}
