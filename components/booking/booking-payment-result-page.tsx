"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2Icon,
  Clock3Icon,
  Loader2Icon,
  RefreshCwIcon,
  TriangleAlertIcon,
  XCircleIcon,
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { PaymentResultShell } from "@/components/payment/payment-result-shell";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { BookingApiError, fetchBooking } from "@/lib/booking-api";
import {
  clearCheckoutSession,
  isTerminalBookingStatus,
} from "@/lib/booking-checkout-state";
import { buildRebookUrl, formatHelpStayLine } from "@/lib/booking-format";
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

function BookingSummaryCard({ booking }: { booking: BookingResponse }) {
  return (
    <div className="rounded-2xl border bg-muted/20 p-4 text-left">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Booking summary
      </p>
      <p className="mt-2 text-sm font-semibold text-foreground">
        {booking.property.name}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {booking.property.city ? `${booking.property.city} · ` : ""}
        {booking.reservationNumber}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        {formatHelpStayLine(booking.checkIn, booking.checkOut, booking.nights)}
      </p>
      <div className="mt-3 flex items-center justify-between border-t pt-3 text-sm">
        <span className="text-muted-foreground">Amount</span>
        <span className="font-semibold">
          {formatCurrency(booking.totalAmount, booking.currency)}
        </span>
      </div>
    </div>
  );
}

export function BookingPaymentResultPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("ref");
  const { isAuthenticated, isLoading: authLoading, openLogin } = useAuth();

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

  const clearCheckoutForBooking = useCallback((next: BookingResponse) => {
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
  }, []);

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
      <PaymentResultShell
        tone="neutral"
        icon={<TriangleAlertIcon className="size-8" />}
        title="Invalid booking link"
        description="This payment result link is missing a booking reference."
        actions={
          <Button render={<Link href={ROUTES.home} />} className="rounded-xl">
            Go home
          </Button>
        }
      />
    );
  }

  if (!authLoading && !isAuthenticated) {
    return (
      <PaymentResultShell
        tone="info"
        icon={<Clock3Icon className="size-8" />}
        title="Sign in to view your booking"
        description="Complete sign-in to check your payment status. We'll bring you back here automatically."
        actions={
          <Button type="button" className="rounded-xl" onClick={openLogin}>
            Sign in
          </Button>
        }
      />
    );
  }

  if (errorMessage && !booking) {
    return (
      <PaymentResultShell
        tone="danger"
        icon={<XCircleIcon className="size-8" />}
        title="We couldn't find this booking"
        description={errorMessage}
        actions={
          <Button render={<Link href={ROUTES.bookings} />} className="rounded-xl">
            My bookings
          </Button>
        }
      />
    );
  }

  if ((phase === "loading" || phase === "processing") && !booking) {
    return (
      <PaymentResultShell
        tone="info"
        icon={<Loader2Icon className="size-8 animate-spin" />}
        title="Processing your payment"
        description="Hang tight — we're confirming your payment with the hotel."
      />
    );
  }

  if (phase === "success" && booking) {
    return (
      <PaymentResultShell
        tone="success"
        icon={<CheckCircle2Icon className="size-8" />}
        title="You're all set"
        description="Your stay is confirmed. A confirmation has been sent to your registered contact details."
        actions={
          <>
            <Button
              render={<Link href={ROUTES.bookings} />}
              className="rounded-xl sm:min-w-36"
            >
              View booking
            </Button>
            <Button
              variant="outline"
              render={<Link href={ROUTES.home} />}
              className="rounded-xl sm:min-w-36"
            >
              Back home
            </Button>
          </>
        }
      >
        <BookingSummaryCard booking={booking} />
      </PaymentResultShell>
    );
  }

  if (phase === "processing" || phase === "still_processing") {
    return (
      <PaymentResultShell
        tone="info"
        icon={
          phase === "still_processing" ? (
            <Clock3Icon className="size-8" />
          ) : (
            <Loader2Icon className="size-8 animate-spin" />
          )
        }
        title={
          phase === "still_processing"
            ? "Still confirming your payment"
            : "Processing payment"
        }
        description={
          phase === "still_processing"
            ? "This is taking a little longer than usual. Your payment may still be on its way — refresh anytime for the latest status."
            : "Please wait while we confirm your payment with the hotel. You can leave this page open."
        }
        actions={
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={isRefreshing}
            onClick={() => void handleRefresh()}
          >
            <RefreshCwIcon className="size-4" />
            {isRefreshing ? "Refreshing…" : "Refresh status"}
          </Button>
        }
      >
        {booking ? <BookingSummaryCard booking={booking} /> : null}
      </PaymentResultShell>
    );
  }

  if (phase === "failed" && booking) {
    return (
      <PaymentResultShell
        tone="danger"
        icon={<XCircleIcon className="size-8" />}
        title="Payment didn't go through"
        description={toCustomerPaymentFailureMessage(
          booking.payment?.failureReason,
        )}
        actions={
          <>
            <Button
              type="button"
              className="rounded-xl sm:min-w-40"
              disabled={isRetrying}
              onClick={() => void handleRetryPayment()}
            >
              {isRetrying ? "Starting checkout…" : "Try payment again"}
            </Button>
            <Button
              variant="outline"
              render={<Link href={ROUTES.help.root} />}
              className="rounded-xl"
            >
              Need help?
            </Button>
          </>
        }
      >
        <BookingSummaryCard booking={booking} />
        {errorMessage ? (
          <p className="mt-3 text-center text-sm text-destructive">{errorMessage}</p>
        ) : null}
      </PaymentResultShell>
    );
  }

  if (phase === "refund" && booking) {
    return (
      <PaymentResultShell
        tone="warning"
        icon={<RefreshCwIcon className="size-8" />}
        title="Refund in progress"
        description="We received your payment but could not confirm this booking. A refund is being processed to your original payment method."
        actions={
          <Button
            render={<Link href={ROUTES.help.root} />}
            className="rounded-xl"
          >
            Talk to support
          </Button>
        }
      >
        <BookingSummaryCard booking={booking} />
      </PaymentResultShell>
    );
  }

  if (phase === "expired" && booking) {
    return (
      <PaymentResultShell
        tone="warning"
        icon={<Clock3Icon className="size-8" />}
        title="This hold has expired"
        description="The rooms are no longer reserved for this booking. Search again to lock in your next stay."
        actions={
          <>
            <Button
              render={<Link href={buildRebookUrl(booking)} />}
              className="rounded-xl sm:min-w-36"
            >
              Book again
            </Button>
            <Button
              variant="outline"
              render={<Link href={ROUTES.search} />}
              className="rounded-xl"
            >
              Browse stays
            </Button>
          </>
        }
      >
        <BookingSummaryCard booking={booking} />
      </PaymentResultShell>
    );
  }

  return (
    <PaymentResultShell
      tone="info"
      icon={<Loader2Icon className="size-8 animate-spin" />}
      title="Checking payment status"
      description="One moment while we fetch the latest update."
    />
  );
}
