"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import LanguageSwitcher from "@/components/LnaguageSwitcher";
import { Locale, navLinks } from "../menu.data";
import MobileMenu from "./MobileMenu";

export default function NavMenu() {
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const links = navLinks[locale];

  return (
    <nav className="flex items-center gap-1">
      <div className="hidden items-center gap-1 md:flex">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className="relative px-5 py-2 font-mono text-xs font-bold uppercase tracking-wide"
          >
            {isActive && (
              <motion.span
                layoutId="active-pill"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 transition-colors duration-200 ${isActive ? "text-paper" : "text-ink"
                }`}
            >
              {link.label}
            </span>
          </Link>
        );
      })}
      </div>
      <LanguageSwitcher />
      <MobileMenu />
    </nav>
  );
}