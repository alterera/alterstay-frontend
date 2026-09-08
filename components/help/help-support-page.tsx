"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeftIcon,
  HeadphonesIcon,
  MailIcon,
  MessageCircleIcon,
  PhoneIcon,
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { fetchBooking } from "@/lib/booking-api";
import { formatHelpStayLine } from "@/lib/booking-format";
import type { BookingResponse } from "@/types/booking";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400";

const SUPPORT_PHONE = "+91 1800 000 0000";
const SUPPORT_EMAIL = "support@alterstay.com";

export function HelpSupportPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("ref");
  const { isAuthenticated, isLoading: authLoading, openLogin } = useAuth();
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(reference));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reference || authLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetchBooking(reference)
      .then((data) => {
        if (!cancelled) setBooking(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load booking.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, reference]);

  return (
    <section className="bg-background pb-12 pt-6">
      <Container className="max-w-lg">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 rounded-lg"
          render={<Link href={ROUTES.help.root} />}
        >
          <ArrowLeftIcon className="size-4" />
          Back to bookings
        </Button>

        <div className="flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-brand/10 text-brand">
            <HeadphonesIcon className="size-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            We&apos;re here to help
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Share your booking details with our support team and we&apos;ll get
            back to you quickly.
          </p>
        </div>

        {reference ? (
          <div className="mt-8 rounded-2xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Selected booking
            </p>
            {loading || authLoading ? (
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            ) : !isAuthenticated ? (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Sign in to view booking {reference}.
                </p>
                <Button type="button" className="mt-3" onClick={openLogin}>
                  Sign in
                </Button>
              </div>
            ) : error || !booking ? (
              <p className="mt-3 text-sm text-destructive">
                {error ?? "Booking not found."}
              </p>
            ) : (
              <div className="mt-3 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">
                    {booking.property.city ?? "India"} · {booking.reservationNumber}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold">
                    {booking.property.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatHelpStayLine(
                      booking.checkIn,
                      booking.checkOut,
                      booking.nights,
                    )}
                  </p>
                </div>
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={booking.property.imageUrl ?? FALLBACK_IMAGE}
                    alt={booking.property.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              </div>
            )}
          </div>
        ) : null}

        <div className="mt-6 space-y-3">
          <a
            href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
            className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3.5 transition-colors hover:bg-muted/40"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
              <PhoneIcon className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">Call support</span>
              <span className="block text-xs text-muted-foreground">
                {SUPPORT_PHONE}
              </span>
            </span>
          </a>

          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
              reference
                ? `Help with booking ${reference}`
                : "Alterstay booking help",
            )}`}
            className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3.5 transition-colors hover:bg-muted/40"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
              <MailIcon className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">Email us</span>
              <span className="block text-xs text-muted-foreground">
                {SUPPORT_EMAIL}
              </span>
            </span>
          </a>

          <a
            href={`https://wa.me/911800000000?text=${encodeURIComponent(
              reference
                ? `Hi Alterstay, I need help with booking ${reference}.`
                : "Hi Alterstay, I need help with my booking.",
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3.5 transition-colors hover:bg-muted/40"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <MessageCircleIcon className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">WhatsApp</span>
              <span className="block text-xs text-muted-foreground">
                Chat with our team
              </span>
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}
