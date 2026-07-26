import { getLocale } from "next-intl/server";
import Container from "@/components/Container";
import { stats, type Locale } from "../stats.data";

export default async function Stats() {
  const locale = (await getLocale()) as Locale;

  return (
    <section className="pb-20 md:pb-28">
      <Container>
        <div className="grid grid-cols-2 gap-0.5 border-2 border-ink bg-ink md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.value} className="bg-paper px-6 py-8 md:px-8 md:py-10">
              <p
                className="font-display leading-none"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.03em" }}
              >
                {stat.value}
              </p>
              <p className="mt-4 font-mono text-xs font-bold uppercase tracking-wide text-ink/80">
                {stat.label[locale]}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
