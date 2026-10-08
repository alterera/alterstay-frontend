"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BriefcaseIcon,
  ChevronRightIcon,
  CoinsIcon,
  Loader2Icon,
  PlusIcon,
  TicketIcon,
  UserRoundIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDisplayPhone, normalizeBookingPhone } from "@/lib/format";
import type { GuestFormFieldErrors } from "@/lib/booking-mapper";
import {
  createSavedGuest,
  fetchSavedGuests,
  type SavedGuest,
} from "@/lib/guests-api";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";

export type GuestFormState = {
  guestName: string;
  email: string;
  mobile: string;
  whatsappNotify: boolean;
  isBusinessBooking: boolean;
  gstNumber: string;
  companyName: string;
  companyAddress: string;
};

type BookingGuestFormProps = {
  user: AuthUser | null;
  formId?: string;
  className?: string;
  layout?: "default" | "mobile-checkout";
  onSubmit?: (values: GuestFormState) => void;
  showPayButton?: boolean;
  payLabel?: string;
  disabled?: boolean;
  isSubmitting?: boolean;
  fieldErrors?: GuestFormFieldErrors;
  coinsBalance?: number;
  maxCoinsRedeemable?: number;
  coinsToRedeem?: number;
  onCoinsToRedeemChange?: (value: number) => void;
  coinsInputDisabled?: boolean;
};

function getGuestDefaults(user: AuthUser | null): GuestFormState {
  return {
    guestName: [user?.firstName, user?.lastName].filter(Boolean).join(" "),
    email: user?.email ?? "",
    mobile: user?.phone ? formatDisplayPhone(user.phone) : "",
    whatsappNotify: true,
    isBusinessBooking: false,
    gstNumber: "",
    companyName: "",
    companyAddress: "",
  };
}

export function BookingGuestForm({
  user,
  formId,
  className,
  layout = "default",
  onSubmit,
  showPayButton = true,
  payLabel = "Pay Now",
  disabled = false,
  isSubmitting = false,
  fieldErrors,
  coinsBalance,
  maxCoinsRedeemable,
  coinsToRedeem = 0,
  onCoinsToRedeemChange,
  coinsInputDisabled = false,
}: BookingGuestFormProps) {
  const [form, setForm] = useState<GuestFormState>(() => getGuestDefaults(user));
  const [savedGuests, setSavedGuests] = useState<SavedGuest[]>([]);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [guestsLoading, setGuestsLoading] = useState(false);
  const [addGuestOpen, setAddGuestOpen] = useState(false);
  const [addGuestForm, setAddGuestForm] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [addGuestError, setAddGuestError] = useState<string | null>(null);
  const [savingGuest, setSavingGuest] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setGuestsLoading(true);
    fetchSavedGuests()
      .then((items) => {
        if (!cancelled) setSavedGuests(items);
      })
      .catch(() => {
        if (!cancelled) setSavedGuests([]);
      })
      .finally(() => {
        if (!cancelled) setGuestsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  function updateField<K extends keyof GuestFormState>(
    key: K,
    value: GuestFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "guestName" || key === "email" || key === "mobile") {
      setSelectedGuestId(null);
    }
  }

  function applySavedGuest(guest: SavedGuest) {
    setSelectedGuestId(guest.id);
    setForm((prev) => ({
      ...prev,
      guestName: guest.name,
      email: guest.email ?? prev.email,
      mobile: formatDisplayPhone(guest.phone),
    }));
  }

  async function handleAddGuest() {
    setSavingGuest(true);
    setAddGuestError(null);
    try {
      const created = await createSavedGuest({
        name: addGuestForm.name.trim(),
        phone: normalizeBookingPhone(addGuestForm.phone),
        email: addGuestForm.email.trim() || undefined,
      });
      setSavedGuests((current) => [created, ...current]);
      applySavedGuest(created);
      setAddGuestForm({ name: "", phone: "", email: "" });
      setAddGuestOpen(false);
    } catch (error) {
      setAddGuestError(
        error instanceof Error ? error.message : "Could not save guest",
      );
    } finally {
      setSavingGuest(false);
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (disabled || isSubmitting) return;
    onSubmit?.(form);
  }

  const inputsDisabled = disabled || isSubmitting;
  const isMobileCheckout = layout === "mobile-checkout";
  const canRedeemCoins =
    isMobileCheckout &&
    typeof coinsBalance === "number" &&
    coinsBalance > 0 &&
    typeof onCoinsToRedeemChange === "function";

  const chooseGuestControl = user ? (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={inputsDisabled}
            className="h-8 shrink-0 rounded-md px-3 text-xs"
          >
            Choose Guest
          </Button>
        }
      />
      <PopoverContent align="end" className="w-72 p-3">
        <PopoverHeader>
          <PopoverTitle className="text-sm">Saved guests</PopoverTitle>
        </PopoverHeader>
        {guestsLoading ? (
          <p className="mt-2 text-xs text-muted-foreground">Loading…</p>
        ) : savedGuests.length === 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">
            No saved guests yet.
          </p>
        ) : (
          <div className="mt-2 max-h-48 space-y-1 overflow-y-auto">
            {savedGuests.map((guest) => (
              <button
                key={guest.id}
                type="button"
                disabled={inputsDisabled}
                onClick={() => applySavedGuest(guest)}
                className="flex w-full flex-col rounded-md border px-3 py-2 text-left text-sm hover:bg-muted/40"
              >
                <span className="font-medium">{guest.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDisplayPhone(guest.phone)}
                </span>
              </button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  ) : null;

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className={cn(isMobileCheckout ? "space-y-3" : "space-y-5", className)}
    >
      <div className={cn(isMobileCheckout && "rounded-md border bg-white px-4 py-3")}>
        <div className="flex items-center justify-between gap-2">
          <h2
            className={cn(
              "font-semibold",
              isMobileCheckout ? "text-sm" : "text-lg",
            )}
          >
            {isMobileCheckout ? "Guest's Details" : "Guest Information"}
          </h2>
          {isMobileCheckout ? chooseGuestControl : null}
        </div>

        {user && !isMobileCheckout ? (
          <div className="mt-4 space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Select saved guest
            </Label>
            {guestsLoading ? (
              <p className="text-xs text-muted-foreground">Loading guests…</p>
            ) : savedGuests.length === 0 ? (
              <Popover open={addGuestOpen} onOpenChange={setAddGuestOpen}>
                <PopoverTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      disabled={inputsDisabled}
                      className="h-10 rounded-md border-dashed px-4"
                    >
                      <PlusIcon className="size-4" />
                      Add guest
                    </Button>
                  }
                />
                <PopoverContent
                  align="start"
                  className="w-[min(100vw-2rem,320px)] rounded-md p-4"
                >
                  <PopoverHeader>
                    <PopoverTitle>Add guest</PopoverTitle>
                    <PopoverDescription>
                      Save a traveller for faster checkout on future bookings.
                    </PopoverDescription>
                  </PopoverHeader>
                  <div className="mt-3 space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="add-guest-name">Full name</Label>
                      <Input
                        id="add-guest-name"
                        value={addGuestForm.name}
                        onChange={(event) =>
                          setAddGuestForm((prev) => ({
                            ...prev,
                            name: event.target.value,
                          }))
                        }
                        placeholder="Guest name"
                        className="h-10 rounded-md"
                        disabled={savingGuest}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="add-guest-phone">Mobile number</Label>
                      <Input
                        id="add-guest-phone"
                        type="tel"
                        value={addGuestForm.phone}
                        onChange={(event) =>
                          setAddGuestForm((prev) => ({
                            ...prev,
                            phone: event.target.value,
                          }))
                        }
                        placeholder="10-digit mobile"
                        className="h-10 rounded-md"
                        disabled={savingGuest}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="add-guest-email">Email (optional)</Label>
                      <Input
                        id="add-guest-email"
                        type="email"
                        value={addGuestForm.email}
                        onChange={(event) =>
                          setAddGuestForm((prev) => ({
                            ...prev,
                            email: event.target.value,
                          }))
                        }
                        placeholder="email@example.com"
                        className="h-10 rounded-md"
                        disabled={savingGuest}
                      />
                    </div>
                    {addGuestError ? (
                      <p className="text-xs text-destructive">{addGuestError}</p>
                    ) : null}
                    <Button
                      type="button"
                      className="h-10 w-full rounded-md"
                      disabled={
                        savingGuest ||
                        !addGuestForm.name.trim() ||
                        !addGuestForm.phone.trim()
                      }
                      onClick={() => void handleAddGuest()}
                    >
                      {savingGuest ? "Saving…" : "Save guest"}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {savedGuests.map((guest) => {
                  const selected = selectedGuestId === guest.id;
                  return (
                    <button
                      key={guest.id}
                      type="button"
                      disabled={inputsDisabled}
                      onClick={() => applySavedGuest(guest)}
                      className={cn(
                        "flex min-w-[9.5rem] shrink-0 flex-col rounded-md border px-3 py-2.5 text-left transition-colors",
                        selected
                          ? "border-brand bg-brand/5"
                          : "border-border bg-white hover:bg-muted/40",
                      )}
                    >
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                        <UserRoundIcon className="size-3.5 text-muted-foreground" />
                        <span className="truncate">{guest.name}</span>
                      </span>
                      <span className="mt-1 truncate text-[11px] text-muted-foreground">
                        {formatDisplayPhone(guest.phone)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}

        <div className={cn("space-y-3", isMobileCheckout ? "mt-3" : "mt-4 space-y-4")}>
          <div className="space-y-1.5">
            <Label
              htmlFor="guest-name"
              className={cn(
                "font-medium text-foreground",
                isMobileCheckout ? "text-xs" : "text-sm",
              )}
            >
              Guest Name
            </Label>
            <Input
              id="guest-name"
              value={form.guestName}
              onChange={(event) => updateField("guestName", event.target.value)}
              placeholder="Enter guest name"
              className={cn(
                "rounded-lg border-input/80 bg-white px-3 text-sm",
                isMobileCheckout ? "h-10" : "h-11",
              )}
              required
              disabled={inputsDisabled}
            />
            {fieldErrors?.guestName ? (
              <p className="text-xs text-destructive">{fieldErrors.guestName}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="guest-mobile"
              className={cn(
                "font-medium text-foreground",
                isMobileCheckout ? "text-xs" : "text-sm",
              )}
            >
              Mobile Number
            </Label>
            <Input
              id="guest-mobile"
              type="tel"
              inputMode="numeric"
              value={form.mobile}
              onChange={(event) => updateField("mobile", event.target.value)}
              placeholder="Enter mobile number"
              className={cn(
                "rounded-lg border-input/80 bg-white px-3 text-sm",
                isMobileCheckout ? "h-10" : "h-11",
              )}
              required
              disabled={inputsDisabled}
            />
            {fieldErrors?.mobile ? (
              <p className="text-xs text-destructive">{fieldErrors.mobile}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="guest-email"
              className={cn(
                "font-medium text-foreground",
                isMobileCheckout ? "text-xs" : "text-sm",
              )}
            >
              Email Address
            </Label>
            <Input
              id="guest-email"
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="Enter email address"
              className={cn(
                "rounded-lg border-input/80 bg-white px-3 text-sm",
                isMobileCheckout ? "h-10" : "h-11",
              )}
              required
              disabled={inputsDisabled}
            />
            {fieldErrors?.email ? (
              <p className="text-xs text-destructive">{fieldErrors.email}</p>
            ) : null}
          </div>
        </div>
      </div>

      {isMobileCheckout ? (
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border bg-white px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-medium">
              <BriefcaseIcon className="size-4 text-muted-foreground" />
              Staying for business purpose?
            </span>
            <Checkbox
              checked={form.isBusinessBooking}
              onCheckedChange={(checked) =>
                updateField("isBusinessBooking", checked === true)
              }
              disabled={inputsDisabled}
              className="size-5 rounded-md"
            />
          </label>

          <Link
            href={ROUTES.offers}
            className="flex items-center justify-between gap-3 rounded-md border bg-white px-4 py-3 text-sm font-medium"
          >
            <span className="flex items-center gap-2">
              <TicketIcon className="size-4 text-muted-foreground" />
              View All Coupons
            </span>
            <ChevronRightIcon className="size-4 text-muted-foreground" />
          </Link>

          {canRedeemCoins ? (
            <div className="rounded-md border bg-white px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CoinsIcon className="size-4 text-brand" />
                Coins
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Total Available Coins: {coinsBalance!.toLocaleString("en-IN")}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={maxCoinsRedeemable ?? coinsBalance}
                  value={coinsToRedeem || ""}
                  placeholder="0"
                  disabled={coinsInputDisabled || inputsDisabled}
                  className="h-9"
                  onChange={(event) => {
                    const raw = event.target.value;
                    const next = raw === "" ? 0 : Number(raw);
                    if (!Number.isFinite(next) || next < 0) return;
                    const cap = maxCoinsRedeemable ?? coinsBalance!;
                    onCoinsToRedeemChange!(Math.min(next, cap));
                  }}
                />
                <button
                  type="button"
                  className="shrink-0 text-xs font-semibold text-brand disabled:opacity-50"
                  disabled={coinsInputDisabled || inputsDisabled}
                  onClick={() =>
                    onCoinsToRedeemChange!(
                      maxCoinsRedeemable ?? coinsBalance!,
                    )
                  }
                >
                  Apply
                </button>
              </div>
            </div>
          ) : null}

          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border bg-white px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-medium">
              <span className="text-base">💬</span>
              Receive booking details on Whatsapp
            </span>
            <Checkbox
              checked={form.whatsappNotify}
              onCheckedChange={(checked) =>
                updateField("whatsappNotify", checked === true)
              }
              disabled={inputsDisabled}
              className="size-5 rounded-md"
            />
          </label>
        </div>
      ) : null}

      {!isMobileCheckout ? (
      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-emerald-200 bg-emerald-50/70 px-4 py-3">
        <span className="flex items-center gap-3 text-sm font-medium text-emerald-900">
          <span className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-base">
            💬
          </span>
          Receive booking details on Whatsapp
        </span>
        <Checkbox
          checked={form.whatsappNotify}
          onCheckedChange={(checked) =>
            updateField("whatsappNotify", checked === true)
          }
          disabled={inputsDisabled}
          className="size-5 rounded-md border-emerald-400 data-checked:border-emerald-600 data-checked:bg-emerald-600"
        />
      </label>
      ) : null}

      {!isMobileCheckout ? (
      <div className="space-y-3">
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border px-4 py-3">
          <span className="flex items-center gap-3 text-sm font-medium">
            <BriefcaseIcon className="size-4 text-muted-foreground" />
            Is this a business booking?
          </span>
          <Checkbox
            checked={form.isBusinessBooking}
            onCheckedChange={(checked) =>
              updateField("isBusinessBooking", checked === true)
            }
            disabled={inputsDisabled}
            className="size-5 rounded-md"
          />
        </label>

        {form.isBusinessBooking ? (
          <div className="space-y-4 rounded-md border bg-muted/10 p-4">
            <div className="space-y-1.5">
              <Label htmlFor="gst-number" className="text-sm font-medium text-foreground">
                GST Number
              </Label>
              <Input
                id="gst-number"
                value={form.gstNumber}
                onChange={(event) => updateField("gstNumber", event.target.value)}
                placeholder="Enter GST number"
                className="h-11 rounded-lg border-input/80 bg-white px-3 text-sm"
                required
                disabled={inputsDisabled}
              />
              {fieldErrors?.gstNumber ? (
                <p className="text-xs text-destructive">{fieldErrors.gstNumber}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="company-name"
                className="text-sm font-medium text-foreground"
              >
                Company Name
              </Label>
              <Input
                id="company-name"
                value={form.companyName}
                onChange={(event) => updateField("companyName", event.target.value)}
                placeholder="Enter company name"
                className="h-11 rounded-lg border-input/80 bg-white px-3 text-sm"
                required
                disabled={inputsDisabled}
              />
              {fieldErrors?.companyName ? (
                <p className="text-xs text-destructive">{fieldErrors.companyName}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="company-address"
                className="text-sm font-medium text-foreground"
              >
                Company Address
              </Label>
              <Input
                id="company-address"
                value={form.companyAddress}
                onChange={(event) =>
                  updateField("companyAddress", event.target.value)
                }
                placeholder="Enter company address"
                className="h-11 rounded-lg border-input/80 bg-white px-3 text-sm"
                required
                disabled={inputsDisabled}
              />
              {fieldErrors?.companyAddress ? (
                <p className="text-xs text-destructive">
                  {fieldErrors.companyAddress}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
      ) : null}

      {form.isBusinessBooking && isMobileCheckout ? (
        <div className="space-y-3 rounded-md border bg-white px-4 py-3">
          <div className="space-y-1.5">
            <Label htmlFor="gst-number-mobile" className="text-xs font-medium">
              GST Number
            </Label>
            <Input
              id="gst-number-mobile"
              value={form.gstNumber}
              onChange={(event) => updateField("gstNumber", event.target.value)}
              placeholder="Enter GST number"
              className="h-10 rounded-lg text-sm"
              required
              disabled={inputsDisabled}
            />
            {fieldErrors?.gstNumber ? (
              <p className="text-xs text-destructive">{fieldErrors.gstNumber}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company-name-mobile" className="text-xs font-medium">
              Company Name
            </Label>
            <Input
              id="company-name-mobile"
              value={form.companyName}
              onChange={(event) =>
                updateField("companyName", event.target.value)
              }
              className="h-10 rounded-lg text-sm"
              required
              disabled={inputsDisabled}
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="company-address-mobile"
              className="text-xs font-medium"
            >
              Company Address
            </Label>
            <Input
              id="company-address-mobile"
              value={form.companyAddress}
              onChange={(event) =>
                updateField("companyAddress", event.target.value)
              }
              className="h-10 rounded-lg text-sm"
              required
              disabled={inputsDisabled}
            />
          </div>
        </div>
      ) : null}

      {showPayButton ? (
        <>
          <button
            type="submit"
            disabled={inputsDisabled}
            className="hidden h-12 w-full items-center justify-center gap-2 rounded-md bg-brand text-base font-semibold text-brand-foreground transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60 lg:inline-flex"
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Processing…
              </>
            ) : (
              payLabel
            )}
          </button>

          <p className="hidden text-center text-xs text-muted-foreground lg:block">
            By proceeding, I agree to AlterStays&apos;s Privacy Policy and T&amp;Cs
          </p>
        </>
      ) : null}
    </form>
  );
}
