"use client";

import { useTranslations } from "next-intl";
import type { Locale, ToolboxGroup } from "../about.type";

export default function ToolboxSection({
  groups,
  locale,
}: {
  groups: ToolboxGroup[];
  locale: Locale;
}) {
  const t = useTranslations("AboutPage");

  return (
    <section className="pt-20 md:pt-28">
      <h2
        className="font-display uppercase"
        style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", letterSpacing: "-0.03em" }}
      >
        {t("toolbox")}
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-0.5 border-2 border-ink bg-ink md:grid-cols-4">
        {groups.map((group) => (
          <div key={group.id} className="bg-paper px-6 py-6 md:py-7">
            <p className="font-mono text-xs font-bold uppercase tracking-wide text-accent">
              {group.label[locale] ?? group.label.uz}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-display text-base leading-relaxed">
              {group.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
