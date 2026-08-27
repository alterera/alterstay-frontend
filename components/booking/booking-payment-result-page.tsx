"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { BookingApiError, fetchBooking } from "@/lib/booking-api";
import {
  clearCheckoutSession,
  isTerminalBookingStatus,
} from "@/lib/booking-checkout-state";
import { buildRebookUrl } from "@/lib/booking-format";
import { retryPaymentForBooking } from "@/lib/booking-payment";
import { setPostLoginRedirect } from "@/lib/booking-url";
import { formatCurrency } from "@/lib/format";
import { toCustomerPaymentFailureMessage } from "@/lib/payment-failure-copy";
import {
  BOOKING_RESULT_POLL_INTERVAL_MS,
  shouldEnterStillProcessing,
} from "@/lib/booking-result-polling";
import {
  canRetryPayment,
  isAwaitingPaymentConfirmation,
  isBookingSuccess,
  needsRefundNotice,
} from "@/lib/booking-status-ui";
import type { BookingResponse } from "@/types/booking";

type ResultPhase =
  | "loading"
  | "processing"
  | "still_processing"
  | "success"
  | "failed"
  | "refund"
  | "expired";

export function BookingPaymentResultPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("ref");
  const { isAuthenticated, isLoading: authLoading, openLogin, user } = useAuth();

  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [phase, setPhase] = useState<ResultPhase>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pollStartedAt = useRef<number | null>(null);
  const pollTimer = useRef<number | null>(null);
  const loginPrompted = useRef(false);

  const resultUrl = useMemo(() => {
    if (!reference) return ROUTES.bookingResult;
    return `${ROUTES.bookingResult}?ref=${encodeURIComponent(reference)}`;
  }, [reference]);

  const resolvePhase = useCallback((next: BookingResponse): ResultPhase => {
    if (isBookingSuccess(next)) return "success";
    if (needsRefundNotice(next)) return "refund";
    if (next.status === "EXPIRED" || next.status === "CANCELLED") {
      return "expired";
    }
    if (canRetryPayment(next)) return "failed";
    if (isAwaitingPaymentConfirmation(next)) return "processing";
    return "processing";
  }, []);

  const clearCheckoutForBooking = useCallback(
    (next: BookingResponse) => {
      if (!isTerminalBookingStatus(next.status)) return;
      const item = next.items[0];
      if (!item) return;
      clearCheckoutSession({
        propertySlug: next.property.slug,
        roomTypeId: item.roomTypeId,
        ratePlanId: item.ratePlanId,
        checkIn: next.checkIn,
        checkOut: next.checkOut,
        rooms: item.quantity,
        adults: next.guests.length || 1,
      });
    },
    [],
  );

  const applyBooking = useCallback(
    (next: BookingResponse) => {
      setBooking(next);
      clearCheckoutForBooking(next);
      setPhase(resolvePhase(next));
    },
    [clearCheckoutForBooking, resolvePhase],
  );

  const loadBooking = useCallback(async () => {
    if (!reference) return null;
    try {
      const next = await fetchBooking(reference);
      applyBooking(next);
      return next;
    } catch (error) {
      if (error instanceof BookingApiError && error.statusCode === 404) {
        setErrorMessage("We could not find this booking.");
      } else {
        setErrorMessage(
          error instanceof Error ? error.message : "Could not load booking status.",
        );
      }
      return null;
    }
  }, [applyBooking, reference]);

  const stopPolling = useCallback(() => {
    if (pollTimer.current !== null) {
      window.clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    pollStartedAt.current = Date.now();

    void loadBooking();

    pollTimer.current = window.setInterval(() => {
      const started = pollStartedAt.current ?? Date.now();
      if (shouldEnterStillProcessing(started, Date.now())) {
        stopPolling();
        setPhase((current) =>
          current === "processing" || current === "loading"
            ? "still_processing"
            : current,
        );
        return;
      }

      void loadBooking().then((next) => {
        if (!next) return;
        const nextPhase = resolvePhase(next);
        if (
          nextPhase === "success" ||
          nextPhase === "failed" ||
          nextPhase === "refund" ||
          nextPhase === "expired"
        ) {
          stopPolling();
        }
      });
    }, BOOKING_RESULT_POLL_INTERVAL_MS);
  }, [loadBooking, resolvePhase, stopPolling]);

  useEffect(() => {
    if (authLoading || !isAuthenticated || !reference) return undefined;
    const timer = window.setTimeout(() => {
      startPolling();
    }, 0);
    return () => {
      window.clearTimeout(timer);
      stopPolling();
    };
  }, [authLoading, isAuthenticated, reference, startPolling, stopPolling]);

  useEffect(() => {
    if (authLoading || isAuthenticated || !reference || loginPrompted.current) {
      return;
    }
    loginPrompted.current = true;
    setPostLoginRedirect(resultUrl);
    openLogin();
  }, [authLoading, isAuthenticated, openLogin, reference, resultUrl]);

  async function handleRefresh() {
    setIsRefreshing(true);
    await loadBooking();
    setIsRefreshing(false);
  }

  async function handleRetryPayment() {
    if (!reference) return;
    setIsRetrying(true);
    try {
      await retryPaymentForBooking(reference);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not start payment again.",
      );
      setIsRetrying(false);
    }
  }

  if (!reference) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-lg rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold">Invalid booking link</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This payment result link is not valid.
          </p>
          <Button render={<Link href={ROUTES.home} />} className="mt-6">
            Go home
          </Button>
        </div>
      </Container>
    );
  }

  if (!authLoading && !isAuthenticated) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-lg rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold">Sign in to view your booking</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete sign-in to check your payment status. We&apos;ll bring you
            back here automatically.
          </p>
          <Button type="button" className="mt-6" onClick={openLogin}>
            Sign in
          </Button>
        </div>
      </Container>
    );
  }

  if (errorMessage && !booking) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-lg rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold">Invalid booking link</h1>
          <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
          <Button render={<Link href={ROUTES.home} />} className="mt-6">
            Go home
          </Button>
        </div>
      </Container>
    );
  }

  if ((phase === "loading" || phase === "processing") && !booking) {
    return (
      <Container className="flex min-h-[50vh] items-center justify-center py-16">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" />
          Processing your payment…
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-lg rounded-2xl border bg-white p-8 shadow-sm">
        {phase === "success" && booking ? (
          <>
            <h1 className="text-2xl font-semibold text-emerald-700">
              Booking confirmed
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Reference {booking.reservationNumber}
            </p>
            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Property</dt>
                <dd className="font-medium">{booking.property.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Stay</dt>
                <dd className="font-medium">
                  {booking.checkIn} → {booking.checkOut}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Total paid</dt>
                <dd className="font-medium">
                  {formatCurrency(booking.totalAmount, booking.currency)}
                </dd>
              </div>
            </dl>
          </>
        ) : null}

        {phase === "processing" || phase === "still_processing" ? (
          <>
            <h1 className="text-xl font-semibold">
              {phase === "still_processing"
                ? "Payment still processing"
                : "Processing payment"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {phase === "still_processing"
                ? "This is taking longer than usual. Your payment may still be on its way — refresh to check the latest status."
                : "Please wait while we confirm your payment with the hotel."}
            </p>
            {phase === "processing" ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2Icon className="size-4 animate-spin" />
                Checking status…
              </div>
            ) : null}
            <Button
              type="button"
              variant="outline"
              className="mt-6"
              disabled={isRefreshing}
              onClick={() => void handleRefresh()}
            >
              {isRefreshing ? "Refreshing…" : "Refresh status"}
            </Button>
          </>
        ) : null}

        {phase === "failed" && booking ? (
          <>
            <h1 className="text-xl font-semibold">Payment failed</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {toCustomerPaymentFailureMessage(booking.payment?.failureReason)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Booking reference {booking.reservationNumber}
            </p>
            <Button
              type="button"
              className="mt-6"
              disabled={isRetrying}
              onClick={() => void handleRetryPayment()}
            >
              {isRetrying ? "Starting checkout…" : "Try payment again"}
            </Button>
          </>
        ) : null}

        {phase === "refund" && booking ? (
          <>
            <h1 className="text-xl font-semibold">Refund in progress</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We received your payment but could not confirm this booking. A
              refund is being processed.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Reference {booking.reservationNumber}
            </p>
          </>
        ) : null}

        {phase === "expired" && booking ? (
          <>
            <h1 className="text-xl font-semibold">Hold expired</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This booking is no longer holding the rooms. Please search again
              to book your stay.
            </p>
            <Button
              render={
                <Link href={buildRebookUrl(booking)} />
              }
              className="mt-6"
            >
              Book again
            </Button>
          </>
        ) : null}

        {errorMessage ? (
          <p className="mt-4 text-sm text-destructive">{errorMessage}</p>
        ) : null}
      </div>
    </Container>
  );
}
