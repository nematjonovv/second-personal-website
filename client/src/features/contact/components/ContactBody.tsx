"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Container from "@/components/Container";
import { useContact } from "../contact.hook";
import { toChannels } from "../contact.util";
import ContactChannels from "./ContactChannels";

export default function ContactBody() {
  const t = useTranslations("ContactPage");
  const { data: contact, isPending } = useContact();

  return (
    <Container>
      <div className="flex flex-col gap-10 pt-12 pb-14 md:flex-row md:items-end md:justify-between md:gap-16">
        <p
          className="max-w-130 font-body font-semibold text-[clamp(1.2rem,2.4vw,1.8rem)] leading-tight"
        >
          {t.rich("description", {
            accent: (chunks) => (
              <span className="font-accent font-normal italic">{chunks}</span>
            ),
          })}
        </p>

        {isPending ? (
          <div className="h-16 w-full shrink-0 animate-pulse rounded-full bg-ink/10 md:w-96" />
        ) : (
          contact && (
            <a
              href={`mailto:${contact.email}`}
              className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-accent px-8 py-5 font-display text-lg text-paper transition-colors duration-200 hover:bg-ink md:text-2xl"
            >
              {contact.email}
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 md:h-6 md:w-6" />
            </a>
          )
        )}
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 gap-0.5 border-2 border-ink bg-ink md:grid-cols-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-28 animate-pulse bg-paper ${i === 4 ? "md:col-span-4" : ""}`}
            />
          ))}
        </div>
      ) : (
        contact && <ContactChannels channels={toChannels(contact)} />
      )}
    </Container>
  );
}
