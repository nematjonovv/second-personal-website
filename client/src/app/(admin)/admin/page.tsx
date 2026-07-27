import Link from "next/link";
import Container from "@/components/Container";

const sections = [
  { href: "/admin/projects", label: "Proyekt", hint: "Rasm, tech stack, ikki tilli kontent", ready: true },
  { href: "/admin/blog", label: "Blog", hint: "Markdown postlar", ready: true },
  { href: "/admin/about", label: "About", hint: "Matn, tajriba, toolbox", ready: true },
  { href: "/admin/contact", label: "Kontakt", hint: "Email, username'lar, telefon", ready: true },
];

export default function AdminPage() {
  return (
    <Container>
      <div className="py-12 md:py-16">
        <h1 className="font-display text-3xl uppercase tracking-tight text-ink md:text-4xl">
          Boshqaruv
        </h1>

        <div className="mt-8 grid gap-0.5 border-2 border-ink bg-ink md:grid-cols-2">
          {sections.map((section) => (
            <div key={section.href} className="bg-paper p-6">
              {section.ready ? (
                <Link
                  href={section.href}
                  className="font-display text-xl uppercase tracking-tight text-ink transition-colors duration-200 hover:text-accent"
                >
                  {section.label}
                </Link>
              ) : (
                <span className="font-display text-xl uppercase tracking-tight text-ink/40">
                  {section.label}
                </span>
              )}

              <p className="mt-2 font-mono text-xs font-bold uppercase tracking-wide text-ink/40">
                {section.ready ? section.hint : "Tayyorlanmoqda"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
