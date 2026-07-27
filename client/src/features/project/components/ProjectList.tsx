"use client";

import { motion } from "framer-motion";
import Container from "@/components/Container";
import type { Project } from "../project.type";
import ProjectListItem from "./ProjectListItem";
import { EASE } from "@/shared/contstans/constants";

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <Container>
      <ul className="border-t-2 border-ink">
        {projects.map((project, i) => (
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
    </Container>
  );
}