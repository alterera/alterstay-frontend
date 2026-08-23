"use client";

import { useState } from "react";
import { BriefcaseIcon, Loader2Icon } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDisplayPhone } from "@/lib/format";
import type { GuestFormFieldErrors } from "@/lib/booking-mapper";
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
  onSubmit?: (values: GuestFormState) => void;
  showPayButton?: boolean;
  payLabel?: string;
  disabled?: boolean;
  isSubmitting?: boolean;
  fieldErrors?: GuestFormFieldErrors;
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
  onSubmit,
  showPayButton = true,
  payLabel = "Pay Now",
  disabled = false,
  isSubmitting = false,
  fieldErrors,
}: BookingGuestFormProps) {
  const [form, setForm] = useState<GuestFormState>(() => getGuestDefaults(user));

  function updateField<K extends keyof GuestFormState>(
    key: K,
    value: GuestFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (disabled || isSubmitting) return;
    onSubmit?.(form);
  }

  const inputsDisabled = disabled || isSubmitting;

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className={cn("space-y-5", className)}
    >
      <div>
        <h2 className="text-lg font-semibold">Guest Information</h2>

        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="guest-name" className="text-sm font-medium text-foreground">
              Guest Name
            </Label>
            <Input
              id="guest-name"
              value={form.guestName}
              onChange={(event) => updateField("guestName", event.target.value)}
              placeholder="Enter guest name"
              className="h-11 rounded-lg border-input/80 bg-white px-3 text-sm"
              required
              disabled={inputsDisabled}
            />
            {fieldErrors?.guestName ? (
              <p className="text-xs text-destructive">{fieldErrors.guestName}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="guest-email" className="text-sm font-medium text-foreground">
              Email Address
            </Label>
            <Input
              id="guest-email"
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="Enter email address"
              className="h-11 rounded-lg border-input/80 bg-white px-3 text-sm"
              required
              disabled={inputsDisabled}
            />
            {fieldErrors?.email ? (
              <p className="text-xs text-destructive">{fieldErrors.email}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="guest-mobile" className="text-sm font-medium text-foreground">
              Mobile Number
            </Label>
            <Input
              id="guest-mobile"
              type="tel"
              inputMode="numeric"
              value={form.mobile}
              onChange={(event) => updateField("mobile", event.target.value)}
              placeholder="Enter mobile number"
              className="h-11 rounded-lg border-input/80 bg-white px-3 text-sm"
              required
              disabled={inputsDisabled}
            />
            {fieldErrors?.mobile ? (
              <p className="text-xs text-destructive">{fieldErrors.mobile}</p>
            ) : null}
          </div>
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3">
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

      <div className="space-y-3">
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3">
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
          <div className="space-y-4 rounded-xl border bg-muted/10 p-4">
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

      {showPayButton ? (
        <>
          <button
            type="submit"
            disabled={inputsDisabled}
            className="hidden h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-base font-semibold text-brand-foreground transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60 lg:inline-flex"
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
