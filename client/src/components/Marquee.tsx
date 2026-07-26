"use client";

import { useLayoutEffect, useRef } from "react";
import { motion, useMotionValue, useAnimationFrame, animate } from "framer-motion";
import { marqueeItems } from "@/messages/shared/data/marque.data";
import { cn } from "@/lib/utils";

const BASE_SPEED = 80;

// accent — bosh sahifadagi vermilion tasma (chegaralar bilan).
// plain — fonsiz, ink rangdagi katta sarlavha (contact sahifasi).
type Variant = "accent" | "plain";

export default function Marquee({
  items = marqueeItems,
  variant = "accent",
  separator = "✦",
  direction = "left",
}: {
  items?: string[];
  variant?: Variant;
  separator?: string;
  direction?: "left" | "right";
}) {
  const reverse = direction === "right";
  const x = useMotionValue(0);
  const speed = useMotionValue(BASE_SPEED);
  const trackRef = useRef<HTMLDivElement>(null);
  const setWidth = useRef(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setWidth.current = trackRef.current.scrollWidth / 2;
        // O'ngga harakatda lenta bitta to'plam chapga surilgan holda
        // boshlanadi — aks holda birinchi soniyada chapda bo'shliq ochiladi
        if (reverse && x.get() === 0) x.set(-setWidth.current);
      }
    };
    measure();
    const id = setTimeout(measure, 300);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", measure);
    };
  }, [items, reverse]);

  useAnimationFrame((_, delta) => {
    const moveBy = (speed.get() * delta) / 1000;

    if (reverse) {
      let next = x.get() + moveBy;
      if (setWidth.current > 0 && next >= 0) next -= setWidth.current;
      x.set(next);
      return;
    }

    let next = x.get() - moveBy;
    if (setWidth.current > 0 && next <= -setWidth.current) {
      next += setWidth.current;
    }
    x.set(next);
  });

  const slowDown = () => {
    animate(speed, 0, { duration: 0.9, ease: "easeOut" });
  };
  const speedUp = () => {
    animate(speed, BASE_SPEED, { duration: 1.1, ease: "easeIn" });
  };

  const doubled = [...items, ...items];
  const isAccent = variant === "accent";

  return (
    <div
      className={cn(
        "w-full overflow-hidden select-none",
        isAccent ? "border-y-2 border-ink bg-accent py-3" : "py-2"
      )}
      onMouseEnter={slowDown}
      onMouseLeave={speedUp}
    >
      <motion.div ref={trackRef} style={{ x }} className="flex w-max">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center">
            <span
              className={cn(
                "font-display",
                isAccent
                  ? "px-6 text-[clamp(2rem,5vw,4rem)] tracking-wide text-paper"
                  : "px-5 text-[clamp(3rem,13vw,12rem)] uppercase tracking-tight text-ink"
              )}
              style={isAccent ? undefined : { lineHeight: 0.9, letterSpacing: "-0.04em" }}
            >
              {item}
            </span>
            <span
              className={cn(
                isAccent
                  ? "text-[clamp(1.25rem,3vw,2.5rem)] text-paper"
                  : "text-[clamp(2rem,8vw,6rem)] text-ink"
              )}
              aria-hidden
            >
              {separator}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}