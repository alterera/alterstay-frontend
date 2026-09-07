"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PricingColumnCta = {
  variant?: "default" | "glow" | "glow-brand" | "outline";
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export type PricingColumnProps = {
  name: string;
  icon?: ReactNode;
  description?: string;
  price: number | string;
  originalPrice?: number | string;
  promotionText?: string;
  priceNote?: string;
  cta?: PricingColumnCta;
  features: string[];
  variant?: "default" | "glow" | "glow-brand";
  className?: string;
  currencyPrefix?: string;
  periodLabel?: string;
};

function formatPrice(price: number | string, currencyPrefix = "₹") {
  if (typeof price === "string") return price;
  return `${currencyPrefix}${price.toLocaleString("en-IN")}`;
}

export function PricingColumn({
  name,
  icon,
  description,
  price,
  originalPrice,
  promotionText,
  priceNote,
  cta,
  features,
  variant = "default",
  className,
  currencyPrefix = "₹",
  periodLabel = "/year",
}: PricingColumnProps) {
  const isGlowBrand = variant === "glow-brand";
  const isGlow = variant === "glow" || isGlowBrand;

  const ctaClass = cn(
    "h-11 w-full rounded-md text-sm font-semibold",
    cta?.variant === "glow-brand" || (isGlowBrand && !cta?.variant)
      ? "bg-brand text-brand-foreground hover:bg-brand/90"
      : cta?.variant === "glow" || (isGlow && !isGlowBrand && !cta?.variant)
        ? "bg-brand-dark text-white hover:bg-brand-dark/90"
        : cta?.variant === "outline"
          ? "border-border"
          : "bg-brand text-brand-foreground hover:bg-brand/90",
  );

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-md border bg-white p-6 shadow-sm sm:p-8",
        isGlow && "shadow-xl shadow-black/5",
        isGlowBrand &&
          "border-brand/40 ring-1 ring-brand/20 before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--brand)_18%,transparent),transparent_55%)]",
        className,
      )}
    >
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {icon ? (
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-brand/10 text-brand">
                {icon}
              </span>
            ) : null}
            <h3 className="text-xl font-semibold tracking-tight">{name}</h3>
          </div>
          {description ? (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>

      <div className="relative mt-6">
        {promotionText ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand">
            {promotionText}
          </p>
        ) : null}
        <div className="flex items-end gap-2">
          <p className="text-4xl font-bold tracking-tight">
            {formatPrice(price, currencyPrefix)}
          </p>
          {periodLabel ? (
            <span className="pb-1 text-sm text-muted-foreground">
              {periodLabel}
            </span>
          ) : null}
        </div>
        {originalPrice != null ? (
          <p className="mt-1 text-sm text-muted-foreground line-through">
            {formatPrice(originalPrice, currencyPrefix)}
          </p>
        ) : null}
        {priceNote ? (
          <p className="mt-2 text-sm text-muted-foreground">{priceNote}</p>
        ) : null}
      </div>

      {cta ? (
        <div className="relative mt-6">
          {cta.href && !cta.onClick ? (
            <Button
              render={<Link href={cta.href} />}
              disabled={cta.disabled}
              className={ctaClass}
            >
              {cta.label}
            </Button>
          ) : (
            <Button
              type="button"
              disabled={cta.disabled}
              className={ctaClass}
              onClick={cta.onClick}
            >
              {cta.label}
            </Button>
          )}
        </div>
      ) : null}

      <ul className="relative mt-8 flex flex-1 flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
              <CheckIcon className="size-3.5" />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
