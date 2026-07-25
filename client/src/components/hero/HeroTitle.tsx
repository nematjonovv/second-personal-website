"use client";

import { motion } from "framer-motion";

export default function HeroTitle() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1], delay: 0.08 }}
      className="font-display uppercase text-ink"
      style={{
        fontWeight: 900,
        lineHeight: 0.82,
        letterSpacing: "-0.04em",
        fontSize: "clamp(3rem, 15vw, 15rem)",
      }}
    >
      Hikmatillo
      <br />
      <span className="inline-flex flex-wrap items-baseline gap-[0.15em] pb-10">
        Nemat
        <span
          className="font-accent italic normal-case text-accent"
          style={{ letterSpacing: "-0.02em" }}
        >
          jonov
        </span>
      </span>
    </motion.h1>
  );
}