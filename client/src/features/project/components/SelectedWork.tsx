"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Container from "@/components/Container";
import { useProjects } from "../project.hook";
import ProjectCard from "./ProjectCard";
import { CARD_VARIANTS, EASE, VISIBLE_COUNT } from "@/shared/contstans/constants";

export default function SelectedWork() {
  const t = useTranslations("HomePage.selectedWork");
  const { data, isPending } = useProjects();

  const items = data?.slice(0, VISIBLE_COUNT) ?? [];

  return (
    <section className="pt-17.5 pb-10">
      <Container>
        <div className="flex items-center justify-between gap-6">
          <h2
            className="max-w-[8ch] font-display uppercase"
            style={{
              fontSize: "clamp(2rem, 6vw, 4.5rem)",
              lineHeight: 0.85,
              letterSpacing: "-0.03em",
            }}
          >
            {t("title")}
          </h2>

          <Link
            href="/work"
            className="group mt-2 flex shrink-0 items-center gap-2 font-mono text-xs font-bold uppercase tracking-wide underline underline-offset-4"
          >
            {t("allProjects")}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 " />
          </Link>
        </div>
      </Container>

      <Container>
        {isPending ? (
          <div className="mt-10 border-t-2 border-ink">
            {Array.from({ length: VISIBLE_COUNT }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse border-b-2 border-ink bg-ink/5 md:h-32"
              />
            ))}
          </div>
        ) : (
          <motion.div
            className="mt-10 border-t-2 border-ink"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
            }}
          >
            {items.map((project, i) => (
              <motion.div
                key={project.slug}
                variants={CARD_VARIANTS}
                transition={{ duration: 0.8, ease: EASE }}
              >
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
