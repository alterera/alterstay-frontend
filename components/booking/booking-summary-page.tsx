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
import {
  buildBookingSummaryUrl,
  estimateBillFromPlan,
} from "@/lib/booking-url";
import { buildPropertyUrl } from "@/lib/property-url";
import { parseSearchParams, formatDateParam } from "@/lib/search-params";
import {
  clearCheckoutAttempt,
  type CheckoutSelection,
} from "@/lib/booking-checkout-state";
import {
  mapGuestFormToCreateBooking,
  type GuestFormFieldErrors,
} from "@/lib/booking-mapper";
import { mapCheckoutError, startCheckout } from "@/lib/booking-pay-flow";
import type { PropertyDetail, SelectedRoomPlan } from "@/types/property-detail";

type BookingSummaryPageProps = {
  slug: string;
};

export function BookingSummaryPage({ slug }: BookingSummaryPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const guestFormId = "booking-guest-form";

  const searchKey = searchParams.toString();
  const search = useMemo(
    () => parseSearchParams(new URLSearchParams(searchKey)),
    [searchKey],
  );
  const ratePlanId = searchParams.get("ratePlanId");
  const roomTypeId = searchParams.get("roomTypeId");

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<GuestFormFieldErrors>({});

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
          setError("Could not load booking details.");
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

  const selectedPlan = useMemo<SelectedRoomPlan | null>(() => {
    if (!property || !ratePlanId || !roomTypeId) return null;
    const roomType = property.roomTypes.find((item) => item.id === roomTypeId);
    if (!roomType) return null;
    return planToSelection(roomType, ratePlanId);
  }, [property, ratePlanId, roomTypeId]);

  const bill = selectedPlan ? estimateBillFromPlan(selectedPlan) : null;

  const checkoutSelection = useMemo<CheckoutSelection | null>(() => {
    if (!user?.id || !selectedPlan) return null;
    const checkIn = search.dateRange.from
      ? formatDateParam(search.dateRange.from)
      : "";
    const checkOut = search.dateRange.to
      ? formatDateParam(search.dateRange.to)
      : "";
    if (!checkIn || !checkOut) return null;
    return {
      slug,
      checkIn,
      checkOut,
      roomTypeId: selectedPlan.roomTypeId,
      ratePlanId: selectedPlan.ratePlanId,
      userId: user.id,
    };
  }, [user, selectedPlan, search.dateRange.from, search.dateRange.to, slug]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Loading booking summary…
      </div>
    );
  }

  if (error || !property || !selectedPlan || !bill) {
    return (
      <Container className="py-16">
        <div className="rounded-2xl border bg-white p-10 text-center">
          <p className="text-muted-foreground">
            {error ?? "Invalid or expired booking selection."}
          </p>
          <Button render={<Link href={buildPropertyUrl(slug, search)} />} className="mt-4">
            Back to property
          </Button>
        </div>
      </Container>
    );
  }

  const bookingSummaryHref = buildBookingSummaryUrl(slug, search, selectedPlan);
  const payLabel = `Pay ${formatCurrency(bill.toPay, bill.currency)}`;

  function handlePayNow() {
    const form = document.getElementById(guestFormId);
    if (form instanceof HTMLFormElement) {
      form.requestSubmit();
    }
  }

  async function handleSubmit(form: GuestFormState) {
    if (!isAuthenticated || !user || !selectedPlan || !checkoutSelection || isPaying) {
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
      await startCheckout({
        selection: checkoutSelection,
        request: mapped.request,
      });
    } catch (err) {
      const mappedError = mapCheckoutError(err);
      setPayError(mappedError.message);
      if (mappedError.clearCheckout && checkoutSelection) {
        clearCheckoutAttempt(checkoutSelection);
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
                Your Booking Summary
              </h1>
            </div>

            {isAuthenticated || authLoading ? (
              <>
                <BookingHotelCard
                  property={property}
                  search={search}
                  selectedPlan={selectedPlan}
                />

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
                      disabled={isPaying}
                      isSubmitting={isPaying}
                      fieldErrors={fieldErrors}
                    />
                  </div>
                ) : (
                  <BookingLoginPrompt
                    summaryUrl={bookingSummaryHref}
                    showBack={false}
                  />
                )}
              </>
            ) : (
              <BookingLoginPrompt summaryUrl={bookingSummaryHref} showBack={false} />
            )}
          </div>

          <BookingBillSummary bill={bill} className="lg:sticky lg:top-24" />
        </div>
      </Container>

      {isAuthenticated ? (
        <BookingMobilePayDock
          bill={bill}
          onPay={handlePayNow}
          disabled={isPaying}
          isSubmitting={isPaying}
        />
      ) : null}
    </div>
  );
}
