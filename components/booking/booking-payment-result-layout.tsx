"use client";

import type { ReactNode } from "react";

import { Container } from "@/components/common/container";
import { BookingResultTicket } from "@/components/ui/ticket-confirmation-card";
import type { BookingResultTicketProps } from "@/components/ui/ticket-confirmation-card";
import { cn } from "@/lib/utils";

type BookingPaymentResultLayoutProps = {
  ticket: BookingResultTicketProps;
  actions?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function BookingPaymentResultLayout({
  ticket,
  actions,
  footer,
  className,
}: BookingPaymentResultLayoutProps) {
  const glow =
    ticket.variant === "success"
      ? "from-brand/8 via-white to-white"
      : ticket.variant === "failed"
        ? "from-rose-50 via-white to-white"
        : "from-sky-50/80 via-white to-white";

  return (
    <div
      className={cn(
        "relative min-h-[70vh] overflow-hidden bg-linear-to-b",
        glow,
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 size-64 rounded-full bg-brand/5 blur-3xl"
      />
      <Container className="relative flex min-h-[70vh] flex-col items-center justify-center gap-6 py-12 sm:py-16">
        <BookingResultTicket {...ticket} />
        {actions ? (
          <div className="z-10 flex w-full max-w-sm flex-col gap-2 sm:flex-row sm:justify-center">
            {actions}
          </div>
        ) : null}
        {footer ? (
          <p className="z-10 max-w-sm text-center text-xs text-muted-foreground">
            {footer}
          </p>
        ) : null}
      </Container>
    </div>
  );
}
