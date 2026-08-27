"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { BookingBillSummary } from "@/components/booking/booking-bill-summary";
import {
  BookingGuestForm,
  type GuestFormState,
} from "@/components/booking/booking-guest-form";
import { BookingHotelCard } from "@/components/booking/booking-hotel-card";
import { BookingLoginPrompt } from "@/components/booking/booking-login-prompt";
import { BookingMobilePayDock } from "@/components/booking/booking-mobile-pay-dock";
import { Container } from "@/components/common/container";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { fetchPropertyDetail } from "@/lib/property-api";
import { planToSelection } from "@/lib/property-booking";
import { buildCheckoutUrl, estimateBillFromPlan } from "@/lib/booking-url";
import { quoteToBill } from "@/lib/quote-utils";
import { buildPropertyUrl } from "@/lib/property-url";
import { parseSearchParams, formatDateParam } from "@/lib/search-params";
import {
  clearCheckoutSession,
  getOrCreateCheckoutIdempotencyKey,
  loadCheckoutSession,
  saveCheckoutSession,
} from "@/lib/booking-checkout-state";
import {
  mapGuestFormToCreateBooking,
  type GuestFormFieldErrors,
} from "@/lib/booking-mapper";
import {
  mapCheckoutError,
  startCheckoutFromIntent,
} from "@/lib/booking-pay-flow";
import { createBookingIntent } from "@/lib/quote-api";
import type { BookingIntentResponse } from "@/types/quote";
import type { QuoteSelectionInput } from "@/types/quote";
import type { PropertyDetail, SelectedRoomPlan } from "@/types/property-detail";

type CheckoutPageProps = {
  slug: string;
};

export function CheckoutPage({ slug }: CheckoutPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const guestFormId = "checkout-guest-form";

  const searchKey = searchParams.toString();
  const search = useMemo(
    () => parseSearchParams(new URLSearchParams(searchKey)),
    [searchKey],
  );
  const ratePlanId = searchParams.get("ratePlanId");
  const roomTypeId = searchParams.get("roomTypeId");

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [intent, setIntent] = useState<BookingIntentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [intentLoading, setIntentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intentError, setIntentError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<GuestFormFieldErrors>({});

  const selectedPlan = useMemo<SelectedRoomPlan | null>(() => {
    if (!property || !ratePlanId || !roomTypeId) return null;
    const roomType = property.roomTypes.find((item) => item.id === roomTypeId);
    if (!roomType) return null;
    return planToSelection(roomType, ratePlanId);
  }, [property, ratePlanId, roomTypeId]);

  const quoteSelection = useMemo(() => {
    if (!selectedPlan) return null;
    const checkIn = search.dateRange.from
      ? formatDateParam(search.dateRange.from)
      : "";
    const checkOut = search.dateRange.to
      ? formatDateParam(search.dateRange.to)
      : "";
    if (!checkIn || !checkOut) return null;
    return {
      propertySlug: slug,
      roomTypeId: selectedPlan.roomTypeId,
      ratePlanId: selectedPlan.ratePlanId,
      checkIn,
      checkOut,
      rooms: search.guests.rooms,
      adults: search.guests.adults,
    };
  }, [selectedPlan, search, slug]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPropertyDetail(slug, search);
        if (!cancelled) setProperty(data);
      } catch {
        if (!cancelled) {
          setError("Could not load checkout details.");
          setProperty(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [search, slug]);

  useEffect(() => {
    if (!isAuthenticated || !quoteSelection) {
      setIntent(null);
      return;
    }
    const selection: QuoteSelectionInput = quoteSelection;

    const stored = loadCheckoutSession(selection);
    if (stored && new Date(stored.expiresAt).getTime() > Date.now()) {
      setIntent({
        quoteToken: stored.quoteToken,
        expiresAt: stored.expiresAt,
        quote: stored.quote,
        property: {
          name: property?.name ?? "",
          slug,
        },
        roomType: {
          id: selection.roomTypeId,
          name:
            property?.roomTypes.find((r) => r.id === selection.roomTypeId)
              ?.name ?? "",
        },
        ratePlan: {
          id: selection.ratePlanId,
          name: selectedPlan?.ratePlanName ?? "",
        },
      });
      return;
    }

    let cancelled = false;
    async function loadIntent() {
      setIntentLoading(true);
      setIntentError(null);
      try {
        const next = await createBookingIntent(selection);
        if (!cancelled) {
          setIntent(next);
          saveCheckoutSession(selection, {
            quoteToken: next.quoteToken,
            expiresAt: next.expiresAt,
            quote: next.quote,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setIntent(null);
          setIntentError(
            err instanceof Error ? err.message : "Could not prepare checkout",
          );
        }
      } finally {
        if (!cancelled) setIntentLoading(false);
      }
    }

    void loadIntent();
    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    quoteSelection,
    property,
    slug,
    selectedPlan?.ratePlanName,
  ]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Loading checkout…
      </div>
    );
  }

  if (error || !property || !selectedPlan || !quoteSelection) {
    return (
      <Container className="py-16">
        <div className="rounded-2xl border bg-white p-10 text-center">
          <p className="text-muted-foreground">
            {error ?? "Invalid or expired checkout selection."}
          </p>
          <Button render={<Link href={buildPropertyUrl(slug, search)} />} className="mt-4">
            Back to property
          </Button>
        </div>
      </Container>
    );
  }

  const bill = intent ? quoteToBill(intent.quote) : estimateBillFromPlan(selectedPlan);
  const checkoutHref = buildCheckoutUrl(slug, search, selectedPlan);
  const payLabel = `Pay ${formatCurrency(bill.toPay, bill.currency)}`;

  function handlePayNow() {
    const form = document.getElementById(guestFormId);
    if (form instanceof HTMLFormElement) {
      form.requestSubmit();
    }
  }

  async function handleSubmit(form: GuestFormState) {
    if (
      !isAuthenticated ||
      !user ||
      !intent ||
      !selectedPlan ||
      !quoteSelection ||
      isPaying
    ) {
      return;
    }

    setPayError(null);
    setFieldErrors({});

    const mapped = mapGuestFormToCreateBooking(form, slug, search, selectedPlan);
    if (!mapped.ok) {
      setFieldErrors(mapped.errors);
      return;
    }

    setIsPaying(true);
    try {
      const idempotencyKey = getOrCreateCheckoutIdempotencyKey(quoteSelection);
      await startCheckoutFromIntent({
        quoteToken: intent.quoteToken,
        request: mapped.request,
        idempotencyKey,
      });
      clearCheckoutSession(quoteSelection);
    } catch (err) {
      const mappedError = mapCheckoutError(err);
      setPayError(mappedError.message);
      if (mappedError.clearCheckout) {
        clearCheckoutSession(quoteSelection);
        setIntent(null);
      }
    } finally {
      setIsPaying(false);
    }
  }

  return (
    <div className="bg-muted/20 pb-28 pt-6 lg:pb-10">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="rounded-lg"
                onClick={() => router.back()}
                aria-label="Go back"
              >
                <ArrowLeftIcon className="size-4" />
              </Button>
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Checkout
              </h1>
            </div>

            {isAuthenticated || authLoading ? (
              <>
                <BookingHotelCard
                  property={property}
                  search={search}
                  selectedPlan={selectedPlan}
                />

                {intentLoading ? (
                  <div className="rounded-2xl border bg-white p-6 text-sm text-muted-foreground">
                    Preparing your checkout price…
                  </div>
                ) : null}

                {intentError ? (
                  <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                    {intentError}
                  </div>
                ) : null}

                {isAuthenticated ? (
                  <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
                    {payError ? (
                      <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                        {payError}
                      </div>
                    ) : null}
                    <BookingGuestForm
                      key={user?.id ?? "guest"}
                      formId={guestFormId}
                      user={user}
                      payLabel={payLabel}
                      onSubmit={(values) => void handleSubmit(values)}
                      disabled={isPaying || !intent}
                      isSubmitting={isPaying}
                      fieldErrors={fieldErrors}
                    />
                  </div>
                ) : (
                  <BookingLoginPrompt
                    summaryUrl={checkoutHref}
                    showBack={false}
                  />
                )}
              </>
            ) : (
              <BookingLoginPrompt summaryUrl={checkoutHref} showBack={false} />
            )}
          </div>

          <BookingBillSummary bill={bill} className="lg:sticky lg:top-24" />
        </div>
      </Container>

      {isAuthenticated && intent ? (
        <BookingMobilePayDock
          bill={bill}
          onPay={handlePayNow}
          disabled={isPaying || !intent}
          isSubmitting={isPaying}
        />
      ) : null}
    </div>
  );
}
