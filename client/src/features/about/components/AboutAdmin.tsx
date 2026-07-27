"use client";

import Container from "@/components/Container";
import { useAbout } from "../about.hook";
import AboutAdminContent from "./AboutAdminContent";
import AboutAdminExperience from "./AboutAdminExperience";
import AboutAdminToolbox from "./AboutAdminToolbox";

export default function AboutAdmin() {
  const { data, isPending, error } = useAbout();

  return (
    <Container>
      <div className="py-12 md:py-16">
        <h1 className="font-display text-3xl uppercase tracking-tight text-ink md:text-4xl">
          About
        </h1>
        <p className="mt-2 font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
          Matn, tajriba va toolbox — uchalasi bitta sahifada
        </p>

        {isPending && (
          <div className="mt-8 flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-40 animate-pulse bg-ink/5" />
            ))}
          </div>
        )}

        {error && (
          <p className="mt-8 font-mono text-xs font-bold uppercase tracking-wide text-accent">
            {error.message}
          </p>
        )}

        {data && (
          <div className="mt-8 flex flex-col gap-6">
            <AboutAdminContent initial={data.content} />
            <AboutAdminExperience items={data.experience} />
            <AboutAdminToolbox items={data.toolbox} />
          </div>
        )}
      </div>
    </Container>
  );
}
