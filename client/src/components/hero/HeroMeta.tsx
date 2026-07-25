"use client";

import { useTranslations } from "next-intl";

export default function HeroMeta() {
  const t = useTranslations("HomePage.hero.HeroMeta");

  const items = [t("available"), t("role"), t("location"), t("since")];

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6.5  font-mono text-xs font-bold uppercase tracking-wide text-ink">
      <span className="flex items-center gap-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-green opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-green" />
        </span>
        {items[0]}
      </span>

      {items.slice(1).map((label) => (
        <span key={label} className="flex items-center gap-3">
          <span className="text-ink/40">/</span>
          {label}
        </span>
      ))}
    </div>
  );
}