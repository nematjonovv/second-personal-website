"use client";

import { useLayoutEffect, useRef } from "react";
import { motion, useMotionValue, useAnimationFrame, animate } from "framer-motion";
import { marqueeItems } from "@/shared/data/marque.data";

const BASE_SPEED = 80;

export default function Marquee({ items = marqueeItems }: { items?: string[] }) {
  const x = useMotionValue(0);
  const speed = useMotionValue(BASE_SPEED);
  const trackRef = useRef<HTMLDivElement>(null);
  const setWidth = useRef(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setWidth.current = trackRef.current.scrollWidth / 2;
      }
    };
    measure();
    const id = setTimeout(measure, 300);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", measure);
    };
  }, [items]);

  useAnimationFrame((_, delta) => {
    const moveBy = (speed.get() * delta) / 1000;
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

  return (
    <div
      className="w-full overflow-hidden border-y-2 border-ink bg-accent py-3 select-none"
      onMouseEnter={slowDown}
      onMouseLeave={speedUp}
    >
      <motion.div ref={trackRef} style={{ x }} className="flex w-max">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="px-6 font-display text-[clamp(2rem,5vw,4rem)] tracking-wide text-paper">
              {item}
            </span>
            <span className="text-[clamp(1.25rem,3vw,2.5rem)] text-paper" aria-hidden>
              ✦
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}