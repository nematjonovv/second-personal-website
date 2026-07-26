"use client";

import { useTranslations } from "next-intl";
import type { ContactChannel } from "../contact.type";

export default function ContactChannels({
  channels,
}: {
  channels: ContactChannel[];
}) {
  const t = useTranslations("ContactPage.channels");

  return (
    <div className="grid grid-cols-1 gap-0.5 border-2 border-ink bg-ink md:grid-cols-4">
      {channels.map((channel) => (
        <a
          key={channel.id}
          href={channel.href}
          target={channel.href.startsWith("http") ? "_blank" : undefined}
          rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
          className={`group bg-paper px-6 py-6 transition-colors duration-200 hover:bg-accent md:py-7 ${
            channel.id === "phone" ? "md:col-span-4" : ""
          }`}
        >
          <p className="font-mono text-xs font-bold uppercase tracking-wide text-ink/40 transition-colors duration-200 group-hover:text-paper/70">
            {t(channel.id)}
          </p>
          <p className="mt-2 truncate font-display text-xl tracking-[-0.02em] transition-colors duration-200 group-hover:text-paper md:text-2xl">
            {channel.display}
          </p>
        </a>
      ))}
    </div>
  );
}
