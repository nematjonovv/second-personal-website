import Container from "@/components/Container";
import type { Locale } from "../about.type";
import type { About as AboutType } from "../about.type";
import AboutIntro from "./AboutIntro";
import ExperienceSection from "./ExperienceSection";
import ToolboxSection from "./ToolboxSection";

export default function About({ data, locale }: { data: AboutType; locale: Locale }) {
  const content = data.content[locale] ?? data.content.uz;

  return (
    <Container>
      <div className="pb-20 md:pb-28">
        <AboutIntro content={content} />
        <ExperienceSection items={data.experience} locale={locale} />
        <ToolboxSection groups={data.toolbox} locale={locale} />
      </div>
    </Container>
  );
}