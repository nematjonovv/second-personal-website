"use client";

import { motion } from "framer-motion";
import Container from "@/components/Container";
import { useProjects } from "../project.hook";
import ProjectListItem from "./ProjectListItem";
import { EASE, SKELETON_COUNT } from "@/shared/contstans/constants";



export default function ProjectList() {
  const { data, isPending } = useProjects();

  return (
    <Container>
      {isPending ? (
        <div className="border-t-2 border-ink">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse border-b-2 border-ink bg-ink/5 md:h-80"
            />
          ))}
        </div>
      ) : (
        <ul className="border-t-2 border-ink">
          {(data ?? []).map((project, i) => (
            <motion.li
              key={project.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <ProjectListItem project={project} index={i} />
            </motion.li>
          ))}
        </ul>
      )}
    </Container>
  );
}
