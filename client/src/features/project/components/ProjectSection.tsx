import type { ReactNode } from "react";

export default function ProjectSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-5 font-mono text-xs font-bold uppercase tracking-wide text-accent">
        {label}
      </h2>
      {children}
    </section>
  );
}
