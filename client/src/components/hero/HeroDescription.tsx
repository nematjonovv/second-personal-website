import { useTranslations } from "next-intl";

export default function HeroDescription() {
  const t = useTranslations("HomePage.hero");

  return (
    <p className="max-w-172 font-display text-lg font-normal leading-normal text-ink md:text-2xl">
      {t.rich("description", {
        accent: (chunks) => (
          <span className="font-accent text-xl italic md:text-2xl">
            {chunks}
          </span>
        ),
      })}
    </p>
  );
}