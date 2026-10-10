"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { format, parseISO } from "date-fns";

import { useAuth } from "@/components/auth/auth-provider";
import { MembershipPaymentResultLayout } from "@/components/membership/membership-payment-result-layout";
import { PaymentResultShell } from "@/components/payment/payment-result-shell";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/lib/format";
import { fetchMembershipPurchase } from "@/lib/membership-api";
import type { MembershipPurchaseStatus } from "@/types/membership";

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_MS = 5 * 60 * 1000;

type Phase = "loading" | "confirming" | "success" | "failed" | "invalid";

function purchaseReference(purchase: MembershipPurchaseStatus): string {
  return purchase.id.replace(/-/g, "").slice(0, 14).toUpperCase() || purchase.id;
}

function purchaseDateIso(purchase: MembershipPurchaseStatus): string {
  return purchase.paidAt ?? new Date().toISOString();
}

export function MembershipResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const purchaseId = searchParams.get("ref");

  const [phase, setPhase] = useState<Phase>("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [purchase, setPurchase] = useState<MembershipPurchaseStatus | null>(
    null,
  );
  const startedAt = useMemo(() => Date.now(), []);

  useEffect(() => {
    if (!purchaseId) {
      setPhase("invalid");
      return;
    }
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace(
        `${ROUTES.auth.login}?redirect=${encodeURIComponent(`${ROUTES.membershipResult}?ref=${purchaseId}`)}`,
      );
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function poll() {
      try {
        const next = await fetchMembershipPurchase(purchaseId!);
        if (cancelled) return;
        setPurchase(next);

        if (next.status === "CAPTURED" && next.membership) {
          setPhase("success");
          setMessage(
            `Your ${next.planName} is active until ${format(parseISO(next.membership.expiresAt), "d MMM yyyy")}.`,
          );
          return;
        }

        if (next.status === "FAILED" || next.status === "EXPIRED") {
          setPhase("failed");
          setMessage(
            "Payment was not completed. You can try again from the membership plans page.",
          );
          return;
        }

        if (Date.now() - startedAt >= MAX_POLL_MS) {
          setPhase("confirming");
          setMessage(
            "We're still confirming your payment. Check your membership page in a few minutes.",
          );
          return;
        }

        setPhase("confirming");
        timer = setTimeout(() => void poll(), POLL_INTERVAL_MS);
      } catch {
        if (!cancelled) {
          setPhase("failed");
          setMessage("Could not verify payment status.");
        }
      }
    }

    void poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [purchaseId, isAuthenticated, authLoading, router, startedAt]);

  const amountLabel = formatCurrency(purchase?.amount ?? 0, purchase?.currency ?? "INR");

  if (phase === "loading" || (phase === "confirming" && !purchase)) {
    return (
      <PaymentResultShell
        tone="info"
        icon={<Loader2Icon className="size-7 animate-spin" />}
        title="Confirming your membership"
        description="Please wait while we verify your purchase."
      >
        {purchase?.planName ? (
          <div className="rounded-md border border-border bg-muted/20 px-4 py-3 text-left text-sm">
            <p className="text-muted-foreground">Plan</p>
            <p className="mt-0.5 font-medium">{purchase.planName}</p>
          </div>
        ) : null}
      </PaymentResultShell>
    );
  }

  if (phase === "confirming" && purchase) {
    return (
      <MembershipPaymentResultLayout
        ticket={{
          variant: "processing",
          title: "Still confirming",
          subtitle: message ?? "This can take a minute. You can check membership shortly.",
          reservationNumber: purchase.id.slice(0, 12).toUpperCase(),
          amountLabel: "Amount",
          amount: amountLabel,
          dateIso: purchaseDateIso(purchase),
          propertyName: purchase.planName,
          detailLabel: "Plan",
          detailValue: purchase.planName,
          barcodeValue: purchaseReference(purchase),
          iconSpin: true,
        }}
        actions={
          <Button
            variant="outline"
            render={<Link href={ROUTES.membership} />}
            className="col-span-full h-10 w-full rounded-md text-sm"
          >
            Go to membership
          </Button>
        }
      />
    );
  }

  if (phase === "success" && purchase?.membership) {
    const expiresLabel = format(
      parseISO(purchase.membership.expiresAt),
      "d MMM yyyy",
    );

    return (
      <MembershipPaymentResultLayout
        showFireworks
        ticket={{
          variant: "success",
          title: "Membership activated",
          subtitle: message ?? undefined,
          reservationNumber: purchase.id.slice(0, 12).toUpperCase(),
          amount: amountLabel,
          dateIso: purchaseDateIso(purchase),
          propertyName: purchase.planName,
          detailLabel: "Valid until",
          detailValue: expiresLabel,
          barcodeValue: purchaseReference(purchase),
        }}
        actions={
          <>
            <Button
              render={<Link href={ROUTES.membership} />}
              className="h-10 w-full rounded-md bg-brand text-sm text-brand-foreground hover:bg-brand/90"
            >
              Go to membership
            </Button>
            <Button
              variant="outline"
              render={<Link href={ROUTES.home} />}
              className="h-10 w-full rounded-md text-sm"
            >
              Go to home
            </Button>
          </>
        }
      />
    );
  }

  if (phase === "invalid") {
    return (
      <MembershipPaymentResultLayout
        ticket={{
          variant: "warning",
          title: "Invalid link",
          subtitle: "This result link is missing a purchase reference.",
          reservationNumber: "—",
          amount: "—",
          dateIso: new Date().toISOString(),
          propertyName: "Membership",
          barcodeValue: "INVALID",
        }}
        actions={
          <Button
            render={<Link href={ROUTES.membershipPlans} />}
            className="col-span-full h-10 w-full rounded-md bg-brand text-sm text-brand-foreground hover:bg-brand/90"
          >
            View plans
          </Button>
        }
      />
    );
  }

  return (
    <MembershipPaymentResultLayout
      ticket={{
        variant: "failed",
        title: "Payment incomplete",
        subtitle:
          message ?? "Something went wrong with this payment. Try again from plans.",
        reservationNumber:
          purchase?.id.slice(0, 12).toUpperCase() ?? purchaseId?.slice(0, 12) ?? "—",
        amountLabel: "Amount",
        amount: purchase ? amountLabel : "—",
        dateIso: purchase ? purchaseDateIso(purchase) : new Date().toISOString(),
        propertyName: purchase?.planName ?? "Membership plan",
        barcodeValue: purchase
          ? purchaseReference(purchase)
          : (purchaseId ?? "FAILED").replace(/\W/g, "").slice(0, 14),
      }}
      actions={
        <>
          <Button
            render={<Link href={ROUTES.membershipPlans} />}
            className="h-10 w-full rounded-md bg-brand text-sm text-brand-foreground hover:bg-brand/90"
          >
            Back to plans
          </Button>
          <Button
            variant="outline"
            render={<Link href={ROUTES.home} />}
            className="h-10 w-full rounded-md text-sm"
          >
            Go to home
          </Button>
        </>
      }
    />
  );
}
