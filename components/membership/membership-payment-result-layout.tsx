"use client";

import type { ReactNode } from "react";

import { Container } from "@/components/common/container";
import { ConfettiFireworks } from "@/components/ui/confetti-fireworks";
import { BookingResultTicket } from "@/components/ui/ticket-confirmation-card";
import type { BookingResultTicketProps } from "@/components/ui/ticket-confirmation-card";
import { cn } from "@/lib/utils";

type MembershipPaymentResultLayoutProps = {
  ticket: BookingResultTicketProps;
  actions?: ReactNode;
  footer?: ReactNode;
  showFireworks?: boolean;
  className?: string;
};

export function MembershipPaymentResultLayout({
  ticket,
  actions,
  footer,
  showFireworks = false,
  className,
}: MembershipPaymentResultLayoutProps) {
  return (
    <div className={cn("min-h-[70vh] bg-background", className)}>
      {showFireworks ? <ConfettiFireworks active /> : null}
      <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-4 py-10 sm:py-12">
        <BookingResultTicket {...ticket} showConfetti={false} />
        {actions ? (
          <div className="z-10 grid w-full max-w-sm grid-cols-1 gap-2 sm:grid-cols-2">
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
