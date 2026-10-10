"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { createPaymentSession } from "@/lib/booking-api";
import {
  bookingNeedsPayment,
  buildRebookUrl,
  canPayWithHoldRemaining,
  formatBookingCheckInDate,
  formatBookingCheckOutDate,
  formatHoldCountdown,
  formatPayableAmount,
  getDirectionsUrl,
  getHoldRemainingMs,
  getRefundStatusLabel,
} from "@/lib/booking-format";
import { cn } from "@/lib/utils";
import type { BookingListTab, BookingResponse } from "@/types/booking";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800";

type BookingListCardProps = {
  booking: BookingResponse;
  tab: BookingListTab;
  className?: string;
};

function DashedDivider() {
  return (
    <div
      className="border-t border-dashed border-border"
      aria-hidden="true"
    />
  );
}

export function BookingListCard({ booking, tab, className }: BookingListCardProps) {
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [holdRemainingMs, setHoldRemainingMs] = useState<number | null>(
    () => getHoldRemainingMs(booking.holdExpiresAt),
  );

  useEffect(() => {
    if (tab !== "pending" || !booking.holdExpiresAt) return undefined;

    const tick = () => {
      setHoldRemainingMs(getHoldRemainingMs(booking.holdExpiresAt));
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [booking.holdExpiresAt, tab]);

  const imageUrl = booking.property.imageUrl ?? FALLBACK_IMAGE;
  const cityLabel = booking.property.city ?? "—";
  const checkInLabel = formatBookingCheckInDate(booking.checkIn);
  const checkOutLabel = formatBookingCheckOutDate(booking.checkOut);
  const nightsLabel = `-${booking.nights}N-`;
  const refundLabel = getRefundStatusLabel(booking);
  const canPay =
    tab === "pending" &&
    bookingNeedsPayment(booking) &&
    canPayWithHoldRemaining(booking.holdExpiresAt);
  const holdExpired =
    tab === "pending" &&
    holdRemainingMs !== null &&
    holdRemainingMs <= 0;

  async function handlePayNow() {
    setPayError(null);
    setPaying(true);
    try {
      const session = await createPaymentSession(booking.reservationNumber);
      window.location.href = session.checkoutUrl;
    } catch (error) {
      setPayError(
        error instanceof Error ? error.message : "Could not start payment",
      );
    } finally {
      setPaying(false);
    }
  }

  return (
    <article
      className={cn(
        "overflow-hidden rounded-md border border-border bg-white",
        className,
      )}
    >
      <div className="flex gap-3 p-4 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-anybody line-clamp-2 text-base font-semibold leading-snug text-foreground">
            {booking.property.name}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{cityLabel}</p>
        </div>
        <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted sm:size-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            className="size-full object-cover"
          />
        </div>
      </div>

      <div className="px-4">
        <DashedDivider />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 px-4 py-4">
        <div>
          <p className="text-sm font-semibold text-foreground">{checkInLabel}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Check-in</p>
        </div>
        <span
          className="mt-0.5 rounded border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground"
        >
          {nightsLabel}
        </span>
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">{checkOutLabel}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Checkout</p>
        </div>
      </div>

      {(tab === "pending" || tab === "upcoming") && (
        <div className="border-t border-border px-4 py-2.5">
          <p className="text-sm text-foreground">
            <span className="text-muted-foreground">Payable </span>
            <span className="font-medium">{formatPayableAmount(booking)}</span>
          </p>
          {tab === "pending" && holdRemainingMs !== null && holdRemainingMs > 0 ? (
            <p className="mt-1 text-xs font-medium text-brand">
              Complete payment in {formatHoldCountdown(holdRemainingMs)}
            </p>
          ) : null}
        </div>
      )}

      {tab === "pending" ? (
        <div className="border-t border-border px-4 py-3">
          {payError ? (
            <p className="mb-2 text-xs text-destructive">{payError}</p>
          ) : null}
          <div className="flex flex-col gap-2">
            {canPay ? (
              <Button
                type="button"
                className="h-10 w-full rounded-md bg-brand text-brand-foreground hover:bg-brand/90"
                disabled={paying}
                onClick={() => void handlePayNow()}
              >
                {paying ? "Redirecting..." : "Pay now"}
              </Button>
            ) : null}
            {holdExpired || !canPayWithHoldRemaining(booking.holdExpiresAt) ? (
              <Link
                href={buildRebookUrl(booking)}
                className="inline-flex h-10 w-full items-center justify-center rounded-md border border-border bg-background text-sm font-medium hover:bg-muted/50"
              >
                Rebook
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      {tab === "upcoming" ? (
        <div className="border-t border-border px-4 py-3">
          <div className="grid grid-cols-2 gap-2">
            <a
              href={getDirectionsUrl(booking)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background text-sm font-medium hover:bg-muted/50"
            >
              Get direction
            </a>
            <Link
              href={ROUTES.contact}
              className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background text-sm font-medium hover:bg-muted/50"
            >
              Contact us
            </Link>
          </div>
        </div>
      ) : null}

      {tab === "ongoing" ? (
        <div className="border-t border-border px-4 py-3">
          <Link
            href={ROUTES.propertyDetail(booking.property.slug)}
            className="inline-flex h-10 w-full items-center justify-center rounded-md border border-border bg-background text-sm font-medium hover:bg-muted/50"
          >
            Book again
          </Link>
        </div>
      ) : null}

      {tab === "cancelled" || tab === "previous" ? (
        <div className="border-t border-border px-4 py-3">
          {tab === "cancelled" && refundLabel ? (
            <p className="mb-2 text-sm text-muted-foreground">
              Refund: <span className="font-medium text-foreground">{refundLabel}</span>
            </p>
          ) : null}
          <Link
            href={ROUTES.propertyDetail(booking.property.slug)}
            className="inline-flex h-10 w-full items-center justify-center rounded-md border border-border bg-background text-sm font-medium hover:bg-muted/50"
          >
            Book again
          </Link>
        </div>
      ) : null}
    </article>
  );
}
