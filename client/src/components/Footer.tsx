import { getTranslations } from "next-intl/server";
import Container from "./Container";

export default async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="border-t-2 border-ink">
      <Container>
        <div className="grid gap-4 py-6 font-mono text-xs font-bold uppercase tracking-wide md:grid-cols-3 md:items-center">
          <span>© {new Date().getFullYear()} Hikmatillo Nematjonov</span>

          <span className="flex items-center gap-3 md:justify-center">
            <span className="h-4 w-4 rotate-45 bg-accent animate-spin animation-duration-[4s]" aria-hidden />
            {t("tagline")}
          </span>

          <span className="md:justify-self-end">
            {t("location")} · 41.31°N
          </span>
        </div>
      </Container>
    </footer>
  );
}
