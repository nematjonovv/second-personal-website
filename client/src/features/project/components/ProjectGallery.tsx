"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import ViewImage from "@/components/ViewImage";
import { cn } from "@/lib/utils";
import { AUTOPLAY_MS, EASE } from "@/shared/contstans/constants";


export default function ProjectGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const t = useTranslations("ProjectPage");
  const [active, setActive] = useState(0);
  const [viewing, setViewing] = useState<string | null>(null);

  const paused = viewing !== null || images.length < 2;

  useEffect(() => {
    if (paused) return;

    const id = setTimeout(
      () => setActive((i) => (i + 1) % images.length),
      AUTOPLAY_MS
    );
    return () => clearTimeout(id);
  }, [active, paused, images.length]);

  const closeViewer = useCallback(() => setViewing(null), []);

  if (images.length === 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setViewing(images[active])}
        aria-label={`${title} — ${active + 1}`}
        className="relative block h-56 max-h-[70svh] w-full cursor-zoom-in overflow-hidden border-2 border-paper/15 bg-paper/5 md:h-136"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={images[active]}
            src={images[active]}
            alt={`${title} — ${active + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="absolute inset-0 h-full w-full object-contain"
          />
        </AnimatePresence>
      </button>

      {images.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {images.map((image, i) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${title} — ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "h-1 overflow-hidden bg-paper/25 transition-all duration-200",
                i === active ? "w-10" : "w-4 hover:bg-paper/50"
              )}
            >
              {i === active && (
                // Aktiv nuqta progress bo'lib to'ladi — keyingi rasmgacha qancha
                // qolganini ko'rsatadi; pauza vaqtida darhol to'lgan holatda turadi
                <motion.span
                  key={`${active}-${paused}`}
                  className="block h-full w-full origin-left bg-accent"
                  initial={{ scaleX: paused ? 1 : 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: paused ? 0 : AUTOPLAY_MS / 1000,
                    ease: "linear",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      <ViewImage
        src={viewing}
        alt={`${title} — ${active + 1}`}
        closeLabel={t("close")}
        onClose={closeViewer}
      />
    </div>
  );
}
