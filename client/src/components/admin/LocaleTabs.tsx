"use client";

type Locale = "uz" | "en";

const locales: { code: Locale; label: string }[] = [
  { code: "uz", label: "O'zbekcha" },
  { code: "en", label: "English" },
];

export default function LocaleTabs({
  active,
  onChange,
}: {
  active: Locale;
  onChange: (locale: Locale) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {locales.map((locale) => {
        const isActive = locale.code === active;

        return (
          <button
            key={locale.code}
            type="button"
            onClick={() => onChange(locale.code)}
            aria-current={isActive}
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs font-bold uppercase
                        tracking-wide transition-colors duration-200 ${
                          isActive ? "text-accent" : "text-ink hover:bg-ink/10"
                        }`}
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full transition-colors duration-200 ${
                isActive ? "bg-accent" : "bg-ink/20"
              }`}
            />
            {locale.label}
          </button>
        );
      })}
    </div>
  );
}
