import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "../project.type";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const tech = project.techStack.join(" / ");

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group flex items-center gap-6 border-b-2 border-ink py-6 transition-colors duration-200 hover:bg-ink hover:text-paper md:gap-10 md:py-8"
    >
      <span className="font-mono text-xs font-bold uppercase tracking-wide text-ink/40 transition-[color,transform] duration-200 group-hover:translate-x-3 group-hover:text-paper/50">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="min-w-0 flex-1 transition-transform duration-200 group-hover:translate-x-3">
        <h3
          className="font-display uppercase leading-none"
          style={{ fontSize: "clamp(1.75rem, 5vw, 3.5rem)", letterSpacing: "-0.03em" }}
        >
          {project.title}
        </h3>
        <p className="mt-2 font-mono text-xs font-bold uppercase tracking-wide text-ink/40 transition-colors duration-200 group-hover:text-paper/60">
          {tech} · {project.date.year}
        </p>
      </div>

      <ArrowUpRight className="h-6 w-6 shrink-0 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" />
    </Link>
  );
}
