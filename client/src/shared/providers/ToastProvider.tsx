"use client";

import { createContext, useCallback, useContext, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/shared/contstans/constants";

type ToastTone = "success" | "error";

type Toast = { id: number; message: string; tone: ToastTone };

type ToastContextValue = {
  toast: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DURATION_MS = 3000;

const noopSubscribe = () => () => {};

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const toast = useCallback((message: string, tone: ToastTone = "success") => {
    const id = Date.now() + Math.random();
    setToasts((previous) => [...previous, { id, message, tone }]);
    setTimeout(() => setToasts((previous) => previous.filter((item) => item.id !== id)), DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed inset-x-0 bottom-6 z-100 flex flex-col items-center gap-2 px-6">
            <AnimatePresence>
              {toasts.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className={`pointer-events-auto border-2 border-ink px-6 py-3 font-mono text-xs font-bold
                              uppercase tracking-wide ${
                                item.tone === "error"
                                  ? "bg-accent text-paper"
                                  : "bg-ink text-paper"
                              }`}
                >
                  {item.message}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast faqat ToastProvider ichida ishlatiladi");
  }
  return context.toast;
}
