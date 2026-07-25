"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroCta() {
  return (
    <Link href="/work">
      <motion.span
        whileHover="hover"
        className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-mono text-xs font-bold uppercase tracking-wide text-paper"
      >
        See selected work
        <motion.span
          variants={{ hover: { x: 4 } }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ArrowRight className="h-4 w-4" />
        </motion.span>
      </motion.span>
    </Link>
  );
}