"use client";

import Link from "next/link";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cancellationSections } from "@/config/legal";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type CancellationPolicy = {
  name: string;
  description: string;
} | null;

type PropertyBookingLegalFooterProps = {
  cancellationPolicy?: CancellationPolicy;
  className?: string;
  compact?: boolean;
  policyLinkLabel?: string;
  showAgreementText?: boolean;
};

export function PropertyBookingLegalFooter({
  cancellationPolicy,
  className,
  compact = false,
  policyLinkLabel = "Cancellation Policy",
  showAgreementText = true,
}: PropertyBookingLegalFooterProps) {
  const fallbackIntro = cancellationSections[0]?.paragraphs?.[0];

  return (
    <div
      className={cn(
        "space-y-1.5 text-center text-muted-foreground",
        compact ? "text-[10px]" : "text-[11px]",
        className,
      )}
    >
      <Popover>
        <PopoverTrigger
          type="button"
          className="font-medium text-brand underline-offset-2 hover:underline"
        >
          {policyLinkLabel}
        </PopoverTrigger>
        <PopoverContent
          align="center"
          className={cn(
            "gap-1.5",
            compact ? "w-64 p-2.5" : "w-72 p-3",
          )}
        >
          <PopoverHeader className="gap-0.5">
            <PopoverTitle className={compact ? "text-xs" : "text-sm"}>
              {cancellationPolicy?.name ?? "Cancellation Policy"}
            </PopoverTitle>
            <PopoverDescription
              className={cn(
                "leading-relaxed",
                compact ? "text-[10px]" : "text-[11px]",
              )}
            >
              {cancellationPolicy?.description ??
                fallbackIntro ??
                "Cancellation terms depend on your selected rate plan."}
            </PopoverDescription>
          </PopoverHeader>
          <Link
            href={ROUTES.cancellationPolicy}
            className={cn(
              "mt-2 inline-block font-medium text-brand hover:underline",
              compact ? "text-[10px]" : "text-[11px]",
            )}
          >
            Read full policy
          </Link>
        </PopoverContent>
      </Popover>

      {showAgreementText ? (
        <p>
          By proceeding, you agree to our{" "}
          <Link
            href={ROUTES.terms}
            className="font-medium text-brand underline-offset-2 hover:underline"
          >
            Guest Policies
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
