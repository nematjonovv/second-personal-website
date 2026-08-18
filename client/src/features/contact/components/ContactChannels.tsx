"use client";

import { useTranslations } from "next-intl";
import type { ContactChannel } from "../contact.type";

const IDENTITY_CHANNELS = ["linkedin", "github", "telegram"];

export default function ContactChannels({
  channels,
}: {
  channels: ContactChannel[];
}) {
  const t = useTranslations("ContactPage.channels");

  return (
    <div className="grid grid-cols-1 gap-0.5 border-2 border-ink bg-ink md:grid-cols-4">
      {channels.map((channel) => {
        const isExternal = channel.href.startsWith("http");
        const isIdentity = IDENTITY_CHANNELS.includes(channel.id);

        const relValues = [
          isExternal ? "noreferrer" : null,
          isIdentity ? "me" : null,
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <a
            key={channel.id}
            href={channel.href}
            target={isExternal ? "_blank" : undefined}
            rel={relValues || undefined}
            className={`group bg-paper px-6 py-6 transition-colors duration-200 hover:bg-accent md:py-7 ${channel.id === "phone" ? "md:col-span-4" : ""
              }`}
          >
            <p className="font-mono text-xs font-bold uppercase tracking-wide text-ink/40 transition-colors duration-200 group-hover:text-paper/70">
              {t(channel.id)}
            </p>
            <p className="mt-2 truncate font-display text-xl tracking-[-0.02em] transition-colors duration-200 group-hover:text-paper md:text-2xl">
              {channel.display}
            </p>
          </a>
        );
      })}
    </div>
  );
}