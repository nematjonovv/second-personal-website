"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/Container";
import { useProject } from "../project.hook";
import ProjectAdminForm from "./ProjectAdminForm";

export default function ProjectAdminEditor({ slug }: { slug?: string }) {
  const { data, isPending, error } = useProject(slug ?? "");

  return (
    <Container>
      <div className="py-12 md:py-16">
        <Link
          href="/admin/projects"
          className="flex w-fit items-center gap-2 font-mono text-xs font-bold uppercase tracking-wide
                     text-ink/40 transition-colors duration-200 hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Proyektlar
        </Link>

        <h1 className="mt-6 font-display text-3xl uppercase tracking-tight text-ink md:text-4xl">
          {slug ? (data?.title ?? "Tahrirlash") : "Yangi proyekt"}
        </h1>

        {slug && isPending && (
          <div className="mt-8 flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse bg-ink/5" />
            ))}
          </div>
        )}

        {error && (
          <p className="mt-8 font-mono text-xs font-bold uppercase tracking-wide text-accent">
            {error.message}
          </p>
        )}

        {slug ? data && <ProjectAdminForm project={data} /> : <ProjectAdminForm />}
      </div>
    </Container>
  );
}
