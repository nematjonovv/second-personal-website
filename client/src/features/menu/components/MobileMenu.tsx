"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Locale, navLinks } from "../menu.data";

const EASE = [0.2, 0.8, 0.2, 1] as const;

export default function MobileMenu() {
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const links = navLinks[locale];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevTouchAction = body.style.touchAction;
    body.style.overflow = "hidden";
    body.style.touchAction = "none";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      body.style.overflow = prevOverflow;
      body.style.touchAction = prevTouchAction;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink
                   text-ink transition-colors duration-200 md:hidden"
      >
        <span className="flex h-3 w-4 flex-col justify-between">
          <motion.span
            className="block h-0.5 w-full origin-center rounded-full bg-ink"
            animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          />
          <motion.span
            className="block h-0.5 w-full rounded-full bg-ink"
            animate={open ? { opacity: 0, scaleX: 0.4 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2, ease: EASE }}
          />
          <motion.span
            className="block h-0.5 w-full origin-center rounded-full bg-ink"
            animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          />
        </span>
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="backdrop"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.3, ease: EASE }}
                className="fixed inset-0 z-30 bg-ink/30 md:hidden"
                aria-hidden
              />
            )}
          </AnimatePresence>,
          document.body
        )}

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.42, ease: EASE }}
            className="absolute left-0 right-0 top-full z-40 overflow-hidden
                       border-b-2 border-ink bg-paper md:hidden"
          >
              <motion.nav
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
                  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
                }}
                className="flex flex-col px-6 py-4"
              >
                {links.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <motion.div
                      key={link.href}
                      variants={{
                        open: { opacity: 1, y: 0 },
                        closed: { opacity: 0, y: -12 },
                      }}
                      transition={{ duration: 0.32, ease: EASE }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 border-b border-ink/15 py-3
                                   font-display text-2xl uppercase tracking-tight"
                      >
                        <span
                          className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                            isActive ? "bg-accent" : "bg-ink/20"
                          }`}
                        />
                        <span className={isActive ? "text-accent" : "text-ink"}>
                          {link.label}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
