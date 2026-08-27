"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { createPaymentSession } from "@/lib/booking-api";
import {
  bookingNeedsPayment,
  formatBookedOn,
  formatPayableAmount,
  formatStayLine,
  getDirectionsUrl,
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

export function BookingListCard({ booking, tab, className }: BookingListCardProps) {
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const imageUrl = booking.property.imageUrl ?? FALLBACK_IMAGE;
  const cityLabel = booking.property.city ?? "—";
  const bookedOn = formatBookedOn(booking.createdAt);
  const stayLine = formatStayLine(
    booking.checkIn,
    booking.checkOut,
    booking.nights,
  );
  const refundLabel = getRefundStatusLabel(booking);

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
        "overflow-hidden rounded-2xl border bg-white shadow-sm",
        className,
      )}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_96px] gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_120px] sm:gap-4">
        <div className="min-w-0 space-y-2">
          <p className="text-xs text-muted-foreground">
            {cityLabel} · BOOKED ON {bookedOn}
          </p>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground sm:text-base">
            {booking.property.name}
          </h3>
          <p className="text-sm text-muted-foreground">{stayLine}</p>
          {tab === "upcoming" ? (
            <p className="text-sm font-medium text-foreground">
              Payable amount: {formatPayableAmount(booking)}
            </p>
          ) : null}
        </div>

        <div className="relative size-24 justify-self-end overflow-hidden rounded-xl bg-muted sm:size-[7.5rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={booking.property.name}
            className="size-full object-cover"
          />
        </div>
      </div>

      {tab === "upcoming" ? (
        <div className="border-t px-4 py-3">
          <p className="mb-3 text-base font-semibold">
            {formatPayableAmount(booking)}
          </p>
          {payError ? (
            <p className="mb-2 text-xs text-destructive">{payError}</p>
          ) : null}
          <div className="flex flex-col gap-2">
            {bookingNeedsPayment(booking) ? (
              <Button
                type="button"
                className="w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
                disabled={paying}
                onClick={() => void handlePayNow()}
              >
                {paying ? "Redirecting..." : "Pay now"}
              </Button>
            ) : null}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={getDirectionsUrl(booking)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-input bg-background px-4 text-sm font-medium hover:bg-muted"
              >
                Get Direction
              </a>
              <Link
                href={ROUTES.help.contact}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-input bg-background px-4 text-sm font-medium hover:bg-muted"
              >
                Need Help?
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "ongoing" ? (
        <div className="border-t px-4 py-3">
          <Link
            href={ROUTES.propertyDetail(booking.property.slug)}
            className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-input bg-background text-sm font-medium hover:bg-muted"
          >
            Book again
          </Link>
        </div>
      ) : null}

      {tab === "cancelled" ? (
        <div className="border-t px-4 py-3">
          {refundLabel ? (
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              Refund status: {refundLabel}
            </p>
          ) : null}
          <Link
            href={ROUTES.propertyDetail(booking.property.slug)}
            className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-input bg-background text-sm font-medium hover:bg-muted"
          >
            Book again
          </Link>
        </div>
      ) : null}
    </article>
  );
}
