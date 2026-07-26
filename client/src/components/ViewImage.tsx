"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { EASE } from "@/shared/contstans/constants";


export default function ViewImage({
  src,
  alt = "",
  closeLabel = "Close",
  onClose,
}: {
  src: string | null;
  alt?: string;
  closeLabel?: string;
  onClose: () => void;
}) {
  const open = Boolean(src);

  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevTouchAction = body.style.touchAction;
    body.style.overflow = "hidden";
    body.style.touchAction = "none";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      body.style.overflow = prevOverflow;
      body.style.touchAction = prevTouchAction;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {src && (
        <motion.div
          key="view-image"
          role="dialog"
          aria-modal
          aria-label={alt}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-ink/95 p-6 backdrop-blur-sm md:p-10"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border-2 border-paper text-paper transition-colors duration-200 hover:bg-paper/10 md:right-10 md:top-10"
          >
            <X className="h-5 w-5" />
          </button>

          <motion.img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="max-h-[90svh] max-w-full cursor-default object-contain"
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
