"use client";

import Container from "@/components/Container";
import { useContact } from "../contact.hook";
import ContactAdminForm from "./ContactAdminForm";

export default function ContactAdmin() {
  const { data, isPending, error } = useContact();

  return (
    <Container>
      <div className="py-12 md:py-16">
        <h1 className="font-display text-3xl uppercase tracking-tight text-ink md:text-4xl">
          Kontakt
        </h1>
        <p className="mt-2 font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
          Saytdagi kontakt kanallari
        </p>

        {isPending && (
          <div className="mt-8 flex max-w-140 flex-col gap-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse bg-ink/5" />
            ))}
          </div>
        )}

        {error && (
          <p className="mt-8 font-mono text-xs font-bold uppercase tracking-wide text-accent">
            {error.message}
          </p>
        )}

        {data && <ContactAdminForm initial={data} />}
      </div>
    </Container>
  );
}
