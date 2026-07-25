"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { setLocale } from "../i18n/set-locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type LocaleCode = "uz" | "en";

const locales: Record<LocaleCode, { code: LocaleCode; label: string; short: string }> = {
  uz: { code: "uz", label: "O'zbek", short: "UZ" },
  en: { code: "en", label: "English", short: "EN" },
};

export default function LanguageSwitcher() {
  const router = useRouter();
  const currentLocale = useLocale() as LocaleCode;

  const change = async (locale: LocaleCode) => {
    await setLocale(locale);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full border-2 border-ink px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-ink
                     transition-colors duration-200 hover:bg-ink/10 hover:text-paper"
        >
          <Globe className="h-3.5 w-3.5" />
          {locales[currentLocale].short}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-44 rounded-2xl border-2 border-ink bg-paper p-1"
      >
        {Object.values(locales).map((locale) => {
          const isActive = locale.code === currentLocale;

          return (
            <DropdownMenuItem
              key={locale.code}
              onClick={() => change(locale.code)}
              aria-current={isActive}
              className="flex cursor-pointer items-center gap-3 rounded-xl font-mono text-xs
                         font-bold uppercase tracking-wide text-ink
                         transition-colors duration-200 focus:bg-ink/10"
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full transition-colors duration-200 ${
                  isActive ? "bg-accent" : "bg-ink/20"
                }`}
              />
              <span className={isActive ? "text-accent!" : "text-ink!"}>{locale.label}</span>
              <span className="ml-auto text-ink/40!">{locale.short}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}