"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRightIcon,
  HeadphonesIcon,
  Loader2Icon,
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Logo } from "@/components/common/logo";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import {
  BookingApiError,
  fetchBooking,
  fetchMyBookings,
} from "@/lib/booking-api";
import { formatHelpStayLine } from "@/lib/booking-format";
import { cn } from "@/lib/utils";
import type { BookingResponse } from "@/types/booking";

const PAGE_SIZE = 3;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400";

type HelpBookingCardProps = {
  booking: BookingResponse;
  onSelect: (reservationNumber: string) => void;
};

function HelpBookingCard({ booking, onSelect }: HelpBookingCardProps) {
  const imageUrl = booking.property.imageUrl ?? FALLBACK_IMAGE;

  return (
    <button
      type="button"
      onClick={() => onSelect(booking.reservationNumber)}
      className="flex w-full items-center gap-3 rounded-xl border bg-white p-3 text-left transition-colors hover:border-brand/40 hover:bg-brand/2"
    >
      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-xs text-muted-foreground">
          {booking.property.city ?? "India"}
        </p>
        <p className="line-clamp-2 text-sm font-semibold text-foreground">
          {booking.property.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatHelpStayLine(
            booking.checkIn,
            booking.checkOut,
            booking.nights,
          )}
        </p>
      </div>
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-20">
        <Image
          src={imageUrl}
          alt={booking.property.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
    </button>
  );
}

type BookingSectionProps = {
  title: string;
  bookings: BookingResponse[];
  loading: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  onSelect: (reservationNumber: string) => void;
  emptyLabel: string;
};

function BookingSection({
  title,
  bookings,
  loading,
  hasMore,
  loadingMore,
  onLoadMore,
  onSelect,
  emptyLabel,
}: BookingSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <p className="rounded-xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
          {emptyLabel}
        </p>
      ) : (
        <>
          <ul className="space-y-2">
            {bookings.map((booking) => (
              <li key={booking.reservationNumber}>
                <HelpBookingCard booking={booking} onSelect={onSelect} />
              </li>
            ))}
          </ul>
          {hasMore ? (
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl"
              disabled={loadingMore}
              onClick={onLoadMore}
            >
              {loadingMore ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Loading…
                </>
              ) : (
                "Load more"
              )}
            </Button>
          ) : null}
        </>
      )}
    </section>
  );
}

export function HelpPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, openLogin } = useAuth();

  const [completed, setCompleted] = useState<BookingResponse[]>([]);
  const [cancelled, setCancelled] = useState<BookingResponse[]>([]);
  const [completedPage, setCompletedPage] = useState(1);
  const [cancelledPage, setCancelledPage] = useState(1);
  const [completedHasMore, setCompletedHasMore] = useState(false);
  const [cancelledHasMore, setCancelledHasMore] = useState(false);
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [loadingCancelled, setLoadingCancelled] = useState(false);
  const [loadingMoreCompleted, setLoadingMoreCompleted] = useState(false);
  const [loadingMoreCancelled, setLoadingMoreCancelled] = useState(false);

  const [bookingId, setBookingId] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookingUp, setLookingUp] = useState(false);

  const goToBookingHelp = useCallback(
    (reservationNumber: string) => {
      router.push(
        `${ROUTES.help.support}?ref=${encodeURIComponent(reservationNumber)}`,
      );
    },
    [router],
  );

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    let cancelledFetch = false;
    async function loadInitial() {
      setLoadingCompleted(true);
      setLoadingCancelled(true);
      try {
        const [prev, canc] = await Promise.all([
          fetchMyBookings("previous", 1, PAGE_SIZE),
          fetchMyBookings("cancelled", 1, PAGE_SIZE),
        ]);
        if (cancelledFetch) return;
        setCompleted(prev.results);
        setCompletedHasMore(prev.hasMore);
        setCompletedPage(1);
        setCancelled(canc.results);
        setCancelledHasMore(canc.hasMore);
        setCancelledPage(1);
      } catch {
        if (!cancelledFetch) {
          setCompleted([]);
          setCancelled([]);
        }
      } finally {
        if (!cancelledFetch) {
          setLoadingCompleted(false);
          setLoadingCancelled(false);
        }
      }
    }

    void loadInitial();
    return () => {
      cancelledFetch = true;
    };
  }, [authLoading, isAuthenticated]);

  async function loadMoreCompleted() {
    const nextPage = completedPage + 1;
    setLoadingMoreCompleted(true);
    try {
      const response = await fetchMyBookings("previous", nextPage, PAGE_SIZE);
      setCompleted((current) => [...current, ...response.results]);
      setCompletedHasMore(response.hasMore);
      setCompletedPage(nextPage);
    } finally {
      setLoadingMoreCompleted(false);
    }
  }

  async function loadMoreCancelled() {
    const nextPage = cancelledPage + 1;
    setLoadingMoreCancelled(true);
    try {
      const response = await fetchMyBookings("cancelled", nextPage, PAGE_SIZE);
      setCancelled((current) => [...current, ...response.results]);
      setCancelledHasMore(response.hasMore);
      setCancelledPage(nextPage);
    } finally {
      setLoadingMoreCancelled(false);
    }
  }

  async function handleProceed() {
    const reference = bookingId.trim().toUpperCase();
    if (!reference) {
      setLookupError("Enter a booking ID to continue.");
      return;
    }
    if (!isAuthenticated) {
      openLogin();
      return;
    }

    setLookingUp(true);
    setLookupError(null);
    try {
      await fetchBooking(reference);
      goToBookingHelp(reference);
    } catch (error) {
      if (error instanceof BookingApiError && error.statusCode === 404) {
        setLookupError("We could not find a booking with that ID.");
      } else {
        setLookupError(
          error instanceof Error
            ? error.message
            : "Could not look up this booking.",
        );
      }
    } finally {
      setLookingUp(false);
    }
  }

  return (
    <section className="bg-background pb-12 pt-4 sm:pt-8">
      <Container className="max-w-lg">
        <Logo size="sm" />

        <div className="mt-8 flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-brand/10 text-brand">
            <HeadphonesIcon className="size-7" />
          </div>
          <p className="mt-4 text-xs font-medium text-muted-foreground">
            Need Help with your booking?
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
            Choose the booking you need help with
          </h1>
        </div>

        {!authLoading && !isAuthenticated ? (
          <div className="mt-8 rounded-2xl border bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-muted-foreground">
              Sign in to see your completed and cancelled stays, or enter a
              booking ID below.
            </p>
            <Button type="button" className="mt-4 rounded-xl" onClick={openLogin}>
              Sign in
            </Button>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            <BookingSection
              title="Completed"
              bookings={completed}
              loading={authLoading || loadingCompleted}
              hasMore={completedHasMore}
              loadingMore={loadingMoreCompleted}
              onLoadMore={() => void loadMoreCompleted()}
              onSelect={goToBookingHelp}
              emptyLabel="No completed stays yet."
            />

            <BookingSection
              title="Cancelled"
              bookings={cancelled}
              loading={authLoading || loadingCancelled}
              hasMore={cancelledHasMore}
              loadingMore={loadingMoreCancelled}
              onLoadMore={() => void loadMoreCancelled()}
              onSelect={goToBookingHelp}
              emptyLabel="No cancelled bookings."
            />
          </div>
        )}

        <div
          className={cn(
            "mt-10 rounded-2xl border bg-white p-5 shadow-sm sm:p-6",
          )}
        >
          <h2 className="text-base font-semibold">
            Did not find the booking you are looking for?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the booking ID
          </p>
          <div className="mt-4 space-y-3">
            <Input
              value={bookingId}
              onChange={(event) => {
                setBookingId(event.target.value);
                setLookupError(null);
              }}
              placeholder="e.g. AS-XXXXXXXX"
              className="h-11 rounded-xl"
              onKeyDown={(event) => {
                if (event.key === "Enter") void handleProceed();
              }}
            />
            {lookupError ? (
              <p className="text-sm text-destructive">{lookupError}</p>
            ) : null}
            <Button
              type="button"
              className="h-11 w-full rounded-xl"
              disabled={lookingUp}
              onClick={() => void handleProceed()}
            >
              {lookingUp ? "Checking…" : "Proceed"}
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Looking for something else?{" "}
          <Link href={ROUTES.help.faq} className="font-medium text-brand underline">
            Browse FAQs
          </Link>
        </p>
      </Container>
    </section>
  );
}
