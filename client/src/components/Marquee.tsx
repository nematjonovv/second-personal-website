"use client";

import { useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useAnimationFrame, animate } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAbout } from "@/features/about/about.hook";

const BASE_SPEED = 80;

type Variant = "accent" | "plain";

export default function Marquee({
  items,
  variant = "accent",
  separator,
  direction = "left",
}: {
  items?: string[];
  variant?: Variant;
  separator?: ReactNode;
  direction?: "left" | "right";
}) {
  const { data } = useAbout({ enabled: items === undefined });
  const stack = useMemo(
    () => data?.toolbox.flatMap((group) => group.items) ?? [],
    [data]
  );
  const list = items ?? stack;

  const reverse = direction === "right";
  const x = useMotionValue(0);
  const speed = useMotionValue(BASE_SPEED);
  const trackRef = useRef<HTMLDivElement>(null);
  const setWidth = useRef(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setWidth.current = trackRef.current.scrollWidth / 2;
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
  }, [list, reverse, x]);

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

  const isAccent = variant === "accent";
  const doubled = [...list, ...list];

  const separatorNode = separator ?? (
    <span className="font-mono font-bold opacity-70">{"//"}</span>
  );

  if (list.length === 0) {
    return (
      <div
        className={cn(
          "w-full",
          isAccent ? "border-y-2 border-ink bg-accent py-3" : "py-2"
        )}
        style={{ height: isAccent ? "clamp(3.5rem, 7vw, 5.5rem)" : undefined }}
        aria-hidden
      />
    );
  }

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
          <div key={`${item}-${i}`} className="flex items-center">
            <span
              className={cn(
                "font-display",
                isAccent
                  ? "px-6 text-[clamp(2rem,5vw,4rem)] uppercase tracking-wide text-paper"
                  : "px-5 text-[clamp(3rem,13vw,12rem)] uppercase tracking-tight text-ink"
              )}
              style={isAccent ? undefined : { lineHeight: 0.9, letterSpacing: "-0.04em" }}
            >
              {item}
            </span>
            <span
              className={cn(
                "flex items-center",
                isAccent
                  ? "text-[clamp(1.25rem,3vw,2.5rem)] text-paper"
                  : "text-[clamp(2rem,8vw,6rem)] text-ink"
              )}
              aria-hidden
            >
              {separatorNode}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
