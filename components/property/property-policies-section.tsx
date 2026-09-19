"use client";

import { useState } from "react";
import { CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPropertyTime } from "@/lib/format";
import type { PropertyPolicyDetail } from "@/types/property-detail";

type PropertyPoliciesSectionProps = {
  policies: PropertyPolicyDetail[];
  checkInTime: string | null;
  checkOutTime: string | null;
};

const VISIBLE_POLICY_COUNT = 5;

function PolicyBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 text-sm text-muted-foreground">
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/5 text-brand">
        <CheckIcon className="size-3" strokeWidth={3} />
      </span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

export function PropertyPoliciesSection({
  policies,
  checkInTime,
  checkOutTime,
}: PropertyPoliciesSectionProps) {
  const [policiesOpen, setPoliciesOpen] = useState(false);

  const checkInPolicies = policies.filter(
    (policy) =>
      policy.policyType.toUpperCase().includes("CHECK") ||
      policy.policyType.toUpperCase().includes("REQUIRE"),
  );
  const otherPolicies = policies.filter(
    (policy) => !checkInPolicies.some((item) => item.id === policy.id),
  );

  const defaultBullets = [
    "Primary Guest should be atleast 18 years of age.",
    "Passport, Aadhaar, Govt. ID and Driving License are accepted as ID proof(s)",
  ];

  const policyItems: { id: string; text: string }[] = [
    ...defaultBullets.map((text, index) => ({
      id: `default-${index}`,
      text,
    })),
    ...checkInPolicies.map((policy) => ({
      id: policy.id,
      text: policy.description
        ? `${policy.title}: ${policy.description}`
        : policy.title,
    })),
    ...otherPolicies.map((policy) => ({
      id: policy.id,
      text: policy.description
        ? `${policy.title}: ${policy.description}`
        : policy.title,
    })),
  ];

  const visiblePolicies = policyItems.slice(0, VISIBLE_POLICY_COUNT);
  const hiddenCount = Math.max(0, policyItems.length - VISIBLE_POLICY_COUNT);

  const checkInLabel = checkInTime
    ? formatPropertyTime(checkInTime)
    : null;
  const checkOutLabel = checkOutTime
    ? formatPropertyTime(checkOutTime)
    : null;

  return (
    <section id="policies" className="scroll-mt-36 space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Policies
        </p>
        <h2 className="mt-1 text-xl font-semibold">What you must know</h2>
      </div>

      <div className="overflow-hidden rounded-md border bg-white">
        {(checkInLabel || checkOutLabel) && (
          <div className="border-b bg-brand/8 px-5 py-4">
            <p className="text-sm font-semibold text-foreground sm:text-base">
              {checkInLabel ? (
                <>
                  Check-in Time:{" "}
                  <span className="text-brand">{checkInLabel}</span>
                </>
              ) : null}
              {checkInLabel && checkOutLabel ? (
                <span className="mx-2 text-muted-foreground">|</span>
              ) : null}
              {checkOutLabel ? (
                <>
                  Check-out Time:{" "}
                  <span className="text-brand">{checkOutLabel}</span>
                </>
              ) : null}
            </p>
          </div>
        )}

        <div className="p-5">
          <ul className="space-y-3">
            {visiblePolicies.map((policy) => (
              <PolicyBullet key={policy.id}>{policy.text}</PolicyBullet>
            ))}
          </ul>

          {hiddenCount > 0 ? (
            <Button
              type="button"
              variant="ghost"
              className="mt-4 h-auto px-0 text-sm font-semibold text-brand hover:bg-transparent hover:text-brand/80"
              onClick={() => setPoliciesOpen(true)}
            >
              View all {policyItems.length} policies
            </Button>
          ) : null}
        </div>
      </div>

      <Dialog open={policiesOpen} onOpenChange={setPoliciesOpen}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-hidden">
          <DialogHeader>
            <DialogTitle>All property policies</DialogTitle>
          </DialogHeader>
          <ul className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
            {policyItems.map((policy) => (
              <PolicyBullet key={policy.id}>{policy.text}</PolicyBullet>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </section>
  );
}
