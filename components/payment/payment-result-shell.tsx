"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

import { Container } from "@/components/common/container";
import { cn } from "@/lib/utils";

type PaymentResultShellProps = {
  tone?: "success" | "danger" | "warning" | "info" | "neutral";
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

const toneStyles = {
  success: {
    glow: "from-emerald-100/80 via-white to-white",
    iconWrap: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  },
  danger: {
    glow: "from-rose-100/80 via-white to-white",
    iconWrap: "bg-rose-50 text-destructive ring-rose-100",
  },
  warning: {
    glow: "from-amber-100/70 via-white to-white",
    iconWrap: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  info: {
    glow: "from-sky-100/70 via-white to-white",
    iconWrap: "bg-sky-50 text-sky-700 ring-sky-100",
  },
  neutral: {
    glow: "from-neutral-100 via-white to-white",
    iconWrap: "bg-muted text-muted-foreground ring-border",
  },
} as const;

export function PaymentResultShell({
  tone = "neutral",
  icon,
  title,
  description,
  children,
  actions,
  className,
}: PaymentResultShellProps) {
  const styles = toneStyles[tone];

  return (
    <div
      className={cn(
        "relative min-h-[70vh] overflow-hidden bg-linear-to-b",
        styles.glow,
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 size-64 rounded-full bg-brand/5 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-32 size-56 rounded-full bg-premium/10 blur-3xl"
      />

      <Container className="relative flex min-h-[70vh] items-center justify-center py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8">
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.08, type: "spring", stiffness: 220, damping: 18 }}
                className={cn(
                  "flex size-16 items-center justify-center rounded-full ring-8",
                  styles.iconWrap,
                )}
              >
                {icon}
              </motion.div>
              <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>

            {children ? <div className="mt-6">{children}</div> : null}
            {actions ? (
              <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
                {actions}
              </div>
            ) : null}
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
