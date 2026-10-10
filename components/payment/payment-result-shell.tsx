"use client";

import type { ReactNode } from "react";

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

const toneIconWrap = {
  success: "bg-brand/10 text-brand",
  danger: "bg-destructive/10 text-destructive",
  warning: "bg-amber-50 text-amber-700",
  info: "bg-muted text-muted-foreground",
  neutral: "bg-muted text-muted-foreground",
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
  return (
    <div className={cn("min-h-[70vh] bg-background", className)}>
      <Container className="flex min-h-[70vh] items-center justify-center py-10 sm:py-12">
        <div className="w-full max-w-md rounded-md border border-border bg-white p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div
              className={cn(
                "flex size-14 items-center justify-center rounded-full",
                toneIconWrap[tone],
              )}
            >
              {icon}
            </div>
            <h1 className="font-anybody mt-4 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {title}
            </h1>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          {children ? <div className="mt-6">{children}</div> : null}
          {actions ? (
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              {actions}
            </div>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
