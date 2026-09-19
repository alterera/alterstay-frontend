"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRightIcon,
  HeadphonesIcon,
  Loader2Icon,
  SearchIcon,
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
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
      className="flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left shadow-sm transition-all hover:border-brand/30 hover:shadow-md"
    >
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
        <Image
          src={imageUrl}
          alt={booking.property.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {booking.property.city ?? "India"}
        </p>
        <p className="line-clamp-2 text-base font-semibold text-foreground">
          {booking.property.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatHelpStayLine(
            booking.checkIn,
            booking.checkOut,
            booking.nights,
          )}
        </p>
      </div>
      <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground" />
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
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <p className="rounded-2xl border border-dashed bg-white px-4 py-8 text-center text-sm text-muted-foreground">
          {emptyLabel}
        </p>
      ) : (
        <>
          <ul className="space-y-3">
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
    <section className="bg-muted/20 pb-16 pt-8 sm:pt-10 lg:pt-12">
      <Container className="max-w-6xl">
        <div className="mx-auto max-w-3xl text-center lg:max-w-none lg:text-left">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <HeadphonesIcon className="size-7" />
          </div>
          <p className="mt-5 text-sm font-medium text-muted-foreground">
            Need help with your booking?
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Choose the booking you need help with
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Select a completed or cancelled stay, or search by booking ID to get
            support faster.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="space-y-6">
            {!authLoading && !isAuthenticated ? (
              <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
                <p className="text-base text-muted-foreground">
                  Sign in to see your completed and cancelled stays, or enter a
                  booking ID in the panel on the right.
                </p>
                <Button
                  type="button"
                  className="mt-5 rounded-xl px-8"
                  onClick={openLogin}
                >
                  Sign in
                </Button>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-2">
                <BookingSection
                  title="Completed stays"
                  bookings={completed}
                  loading={authLoading || loadingCompleted}
                  hasMore={completedHasMore}
                  loadingMore={loadingMoreCompleted}
                  onLoadMore={() => void loadMoreCompleted()}
                  onSelect={goToBookingHelp}
                  emptyLabel="No completed stays yet."
                />

                <BookingSection
                  title="Cancelled bookings"
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
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <SearchIcon className="size-5" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold">
                    Find by booking ID
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Can&apos;t see your stay in the list?
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <Input
                  value={bookingId}
                  onChange={(event) => {
                    setBookingId(event.target.value);
                    setLookupError(null);
                  }}
                  placeholder="e.g. AS-XXXXXXXX"
                  className="h-12 rounded-xl"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void handleProceed();
                  }}
                />
                {lookupError ? (
                  <p className="text-sm text-destructive">{lookupError}</p>
                ) : null}
                <Button
                  type="button"
                  className="h-12 w-full rounded-xl"
                  disabled={lookingUp}
                  onClick={() => void handleProceed()}
                >
                  {lookingUp ? "Checking…" : "Proceed"}
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">
                Looking for quick answers instead?
              </p>
              <Link
                href={ROUTES.help.faq}
                className="mt-2 inline-flex text-sm font-semibold text-brand underline"
              >
                Browse FAQs
              </Link>
              <span className="mx-2 text-muted-foreground">·</span>
              <Link
                href={ROUTES.contact}
                className="inline-flex text-sm font-semibold text-brand underline"
              >
                Contact us
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
