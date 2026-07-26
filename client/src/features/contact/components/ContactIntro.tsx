import { getTranslations } from "next-intl/server";
import Container from "@/components/Container";
import Marquee from "@/components/Marquee";

export default async function ContactIntro() {
  const t = await getTranslations("ContactPage");
  const title = t("title");

  return (
    <section className="pt-4 md:pt-8">
      <Container>
        <p className="font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
          05 / {t("section")}
        </p>
      </Container>

      <div className="mt-6">
        <Marquee
          items={[title, title, title]}
          variant="plain"
          separator="—"
          direction="right"
        />
      </div>

      <Container>
        <div className="mt-6 h-0.5 bg-ink" />
      </Container>
    </section>
  );
}
