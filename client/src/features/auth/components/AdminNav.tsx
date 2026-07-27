"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/Container";
import { useAuth } from "@/shared/providers/AuthProvider";

const sections = [
  { href: "/admin/projects", label: "Proyekt" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/contact", label: "Kontakt" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-ink bg-paper/70 backdrop-blur-md backdrop-saturate-150">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4 py-4">
          <Link href="/admin" className="font-display text-xl font-bold uppercase text-ink">
            Admin
          </Link>

          <nav className="flex flex-wrap items-center gap-1">
            {sections.map((section) => {
              const isActive = pathname.startsWith(section.href);

              return (
                <Link
                  key={section.href}
                  href={section.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide
                              transition-colors duration-200 ${
                                isActive ? "text-accent" : "text-ink hover:bg-ink/10"
                              }`}
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full transition-colors duration-200 ${
                      isActive ? "bg-accent" : "bg-ink/20"
                    }`}
                  />
                  {section.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {user && (
              <span className="font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
                {user.username}
              </span>
            )}
            <button
              onClick={signOut}
              className="rounded-full border-2 border-ink px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-ink
                         transition-colors duration-200 hover:bg-ink/10"
            >
              Chiqish
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}
