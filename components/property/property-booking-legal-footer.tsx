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
        <PopoverContent align="center" className="w-80 p-4">
          <PopoverHeader>
            <PopoverTitle>
              {cancellationPolicy?.name ?? "Cancellation Policy"}
            </PopoverTitle>
            <PopoverDescription className="text-xs leading-relaxed">
              {cancellationPolicy?.description ??
                fallbackIntro ??
                "Cancellation terms depend on your selected rate plan."}
            </PopoverDescription>
          </PopoverHeader>
          <Link
            href={ROUTES.cancellationPolicy}
            className="mt-3 inline-block text-xs font-medium text-brand hover:underline"
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
