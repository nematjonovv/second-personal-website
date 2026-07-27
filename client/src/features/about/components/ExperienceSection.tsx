import { getTranslations } from "next-intl/server";
import type { Experience, Locale } from "../about.type";

export default async function ExperienceSection({
  items,
  locale,
}: {
  items: Experience[];
  locale: Locale;
}) {
  const t = await getTranslations("AboutPage");

  return (
    <section className="pt-20 md:pt-28">
      <h2
        className="font-display uppercase"
        style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", letterSpacing: "-0.03em" }}
      >
        {t("experience")}
      </h2>

      <ul className="mt-8 border-t-2 border-ink">
        {items.map((item) => {
          const content = item.content[locale] ?? item.content.uz;
          const to = item.period.to ?? t("now");

          return (
            <li
              key={item.id}
              className="group grid gap-2 border-b-2 border-ink px-4 py-6 transition-colors duration-200 hover:bg-accent hover:text-paper md:grid-cols-[10rem_1fr] md:gap-6 md:py-8"
            >
              <span className="font-mono text-xs font-bold uppercase tracking-wide text-ink/60 transition-colors duration-200 group-hover:text-paper/70 md:pt-2">
                {item.period.from} — {to}
              </span>

              <div>
                <h3
                  className="font-display uppercase leading-tight"
                  style={{ fontSize: "clamp(1.125rem, 3vw, 2rem)", letterSpacing: "-0.02em" }}
                >
                  {content.role} — {item.company}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-ink/70 transition-colors duration-200 group-hover:text-paper/80">
                  {content.summary}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
