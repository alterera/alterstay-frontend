"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Clock3Icon,
  Loader2Icon,
  RefreshCwIcon,
  TriangleAlertIcon,
  XCircleIcon,
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { BookingPaymentResultLayout } from "@/components/booking/booking-payment-result-layout";
import { PaymentResultShell } from "@/components/payment/payment-result-shell";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { BookingApiError, fetchBooking } from "@/lib/booking-api";
import {
  clearCheckoutSession,
  isTerminalBookingStatus,
} from "@/lib/booking-checkout-state";
import {
  buildRebookUrl,
  formatHelpStayLine,
  formatPayableAmount,
} from "@/lib/booking-format";
import { retryPaymentForBooking } from "@/lib/booking-payment";
import { setPostLoginRedirect } from "@/lib/booking-url";
import { toCustomerPaymentFailureMessage } from "@/lib/payment-failure-copy";
import {
  BOOKING_RESULT_POLL_INTERVAL_MS,
  isHoldExpired,
  shouldEnterStillProcessing,
  shouldGiveUpWaitingForPayment,
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
  | "payment_timeout"
  | "success"
  | "failed"
  | "refund"
  | "expired";

function ticketDateIso(booking: BookingResponse): string {
  return booking.confirmedAt ?? booking.payment?.paidAt ?? booking.createdAt;
}

function ticketBarcode(booking: BookingResponse): string {
  const ref = booking.payment?.paymentReference ?? booking.reservationNumber;
  return ref.replace(/\W/g, "").slice(0, 14) || booking.reservationNumber;
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
    if (
      next.status === "EXPIRED" ||
      next.status === "CANCELLED" ||
      (next.status === "PAYMENT_PENDING" && isHoldExpired(next.holdExpiresAt))
    ) {
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
      const now = Date.now();

      if (shouldGiveUpWaitingForPayment(started, now)) {
        stopPolling();
        void loadBooking().then((next) => {
          if (!next) {
            setPhase("payment_timeout");
            return;
          }
          const nextPhase = resolvePhase(next);
          if (nextPhase === "processing") {
            setPhase("payment_timeout");
          }
        });
        return;
      }

      if (shouldEnterStillProcessing(started, now)) {
        setPhase((current) =>
          current === "processing" || current === "loading"
            ? "still_processing"
            : current,
        );
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
      <BookingPaymentResultLayout
        ticket={{
          variant: "success",
          title: "You're all set!",
          reservationNumber: booking.reservationNumber,
          amount: formatPayableAmount(booking),
          dateIso: ticketDateIso(booking),
          propertyName: booking.property.name,
          stayLine: formatHelpStayLine(
            booking.checkIn,
            booking.checkOut,
            booking.nights,
          ),
          barcodeValue: ticketBarcode(booking),
          showConfetti: true,
        }}
        actions={
          <>
            <Button
              render={<Link href={ROUTES.bookings} />}
              className="h-9 w-full rounded-md bg-brand text-sm text-brand-foreground hover:bg-brand/90"
            >
              View booking
            </Button>
            <Button
              variant="outline"
              render={<Link href={ROUTES.home} />}
              className="h-9 w-full rounded-md text-sm"
            >
              Back home
            </Button>
          </>
        }
      />
    );
  }

  if (
    (phase === "processing" || phase === "still_processing") &&
    booking
  ) {
    const waitingSubtitle =
      phase === "still_processing"
        ? "This is taking longer than usual. Your payment may still be on its way — refresh for the latest status."
        : "Please wait while we confirm your payment. You can keep this page open.";

    return (
      <BookingPaymentResultLayout
        ticket={{
          variant: "processing",
          title:
            phase === "still_processing"
              ? "Still confirming"
              : "Processing payment",
          subtitle: waitingSubtitle,
          reservationNumber: booking.reservationNumber,
          amountLabel: "Amount",
          amount: formatPayableAmount(booking),
          dateIso: booking.createdAt,
          propertyName: booking.property.name,
          stayLine: formatHelpStayLine(
            booking.checkIn,
            booking.checkOut,
            booking.nights,
          ),
          barcodeValue: ticketBarcode(booking),
          iconSpin: phase === "processing",
        }}
        actions={
          <Button
            type="button"
            variant="outline"
            className="col-span-full h-9 w-full rounded-md text-sm"
            disabled={isRefreshing}
            onClick={() => void handleRefresh()}
          >
            <RefreshCwIcon className="size-4" />
            {isRefreshing ? "Refreshing…" : "Refresh status"}
          </Button>
        }
      />
    );
  }

  if (phase === "payment_timeout" && booking) {
    return (
      <BookingPaymentResultLayout
        ticket={{
          variant: "warning",
          title: "Payment not confirmed",
          subtitle:
            "We didn't receive payment confirmation in time. Your room hold may have been released — try again or check My bookings.",
          reservationNumber: booking.reservationNumber,
          amountLabel: "Amount",
          amount: formatPayableAmount(booking),
          dateIso: booking.createdAt,
          propertyName: booking.property.name,
          stayLine: formatHelpStayLine(
            booking.checkIn,
            booking.checkOut,
            booking.nights,
          ),
          barcodeValue: ticketBarcode(booking),
        }}
        actions={
          <>
            <Button
              type="button"
              className="h-9 w-full rounded-md bg-brand text-sm text-brand-foreground hover:bg-brand/90"
              disabled={isRefreshing}
              onClick={() => void handleRefresh()}
            >
              {isRefreshing ? "Refreshing…" : "Refresh status"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9 w-full rounded-md text-sm"
              disabled={isRetrying}
              onClick={() => void handleRetryPayment()}
            >
              {isRetrying ? "Starting…" : "Try payment again"}
            </Button>
          </>
        }
        footer="If you were charged, it will be reversed automatically or contact support with your booking ID."
      />
    );
  }

  if (phase === "failed" && booking) {
    return (
      <BookingPaymentResultLayout
        ticket={{
          variant: "failed",
          title: "Payment didn't go through",
          subtitle: toCustomerPaymentFailureMessage(
            booking.payment?.failureReason,
          ),
          reservationNumber: booking.reservationNumber,
          amountLabel: "Amount",
          amount: formatPayableAmount(booking),
          dateIso: booking.createdAt,
          propertyName: booking.property.name,
          stayLine: formatHelpStayLine(
            booking.checkIn,
            booking.checkOut,
            booking.nights,
          ),
          barcodeValue: ticketBarcode(booking),
        }}
        actions={
          <>
            <Button
              type="button"
              className="h-9 w-full rounded-md bg-brand text-sm text-brand-foreground hover:bg-brand/90"
              disabled={isRetrying}
              onClick={() => void handleRetryPayment()}
            >
              {isRetrying ? "Starting checkout…" : "Try payment again"}
            </Button>
            <Button
              variant="outline"
              render={<Link href={ROUTES.help.root} />}
              className="h-9 w-full rounded-md text-sm"
            >
              Need help?
            </Button>
          </>
        }
        footer={
          errorMessage ? (
            <span className="text-destructive">{errorMessage}</span>
          ) : undefined
        }
      />
    );
  }

  if (phase === "refund" && booking) {
    return (
      <BookingPaymentResultLayout
        ticket={{
          variant: "warning",
          title: "Refund in progress",
          subtitle:
            "We received your payment but couldn't confirm this stay. A refund is being sent to your original payment method.",
          reservationNumber: booking.reservationNumber,
          amount: formatPayableAmount(booking),
          dateIso: ticketDateIso(booking),
          propertyName: booking.property.name,
          stayLine: formatHelpStayLine(
            booking.checkIn,
            booking.checkOut,
            booking.nights,
          ),
          barcodeValue: ticketBarcode(booking),
        }}
        actions={
          <Button
            render={<Link href={ROUTES.help.root} />}
            className="col-span-full h-9 w-full rounded-md bg-brand text-sm text-brand-foreground hover:bg-brand/90"
          >
            Talk to support
          </Button>
        }
      />
    );
  }

  if (phase === "expired" && booking) {
    return (
      <BookingPaymentResultLayout
        ticket={{
          variant: "warning",
          title: "This hold has expired",
          subtitle:
            "These rooms are no longer reserved. Search again to lock in your next stay.",
          reservationNumber: booking.reservationNumber,
          amountLabel: "Quoted total",
          amount: formatPayableAmount(booking),
          dateIso: booking.createdAt,
          propertyName: booking.property.name,
          stayLine: formatHelpStayLine(
            booking.checkIn,
            booking.checkOut,
            booking.nights,
          ),
          barcodeValue: ticketBarcode(booking),
        }}
        actions={
          <>
            <Button
              render={<Link href={buildRebookUrl(booking)} />}
              className="h-9 w-full rounded-md bg-brand text-sm text-brand-foreground hover:bg-brand/90"
            >
              Book again
            </Button>
            <Button
              variant="outline"
              render={<Link href={ROUTES.search} />}
              className="h-9 w-full rounded-md text-sm"
            >
              Browse stays
            </Button>
          </>
        }
      />
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
