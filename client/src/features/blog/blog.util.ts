import type { Locale } from "./blog.type";

export function formatMonthYear(iso: string, locale: Locale): string {
  const date = new Date(iso);
  const month = new Intl.DateTimeFormat(locale === "uz" ? "uz-UZ" : "en-US", {
    month: "short",
    timeZone: "UTC",
  }).format(date);

  return `${month} ${date.getUTCFullYear()}`.toUpperCase();
}
