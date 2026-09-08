"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2Icon,
  Loader2Icon,
  TriangleAlertIcon,
  XCircleIcon,
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { PaymentResultShell } from "@/components/payment/payment-result-shell";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { fetchMembershipPurchase } from "@/lib/membership-api";

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_MS = 5 * 60 * 1000;

type Phase = "loading" | "confirming" | "success" | "failed" | "invalid";

export function MembershipResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const purchaseId = searchParams.get("ref");

  const [phase, setPhase] = useState<Phase>("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [planName, setPlanName] = useState<string | null>(null);
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
        const purchase = await fetchMembershipPurchase(purchaseId!);
        if (cancelled) return;
        setPlanName(purchase.planName);

        if (purchase.status === "CAPTURED" && purchase.membership) {
          setPhase("success");
          setMessage(
            `Your ${purchase.planName} is active until ${new Date(purchase.membership.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.`,
          );
          return;
        }

        if (purchase.status === "FAILED" || purchase.status === "EXPIRED") {
          setPhase("failed");
          setMessage(
            "Payment was not completed. You can try again from the membership plans page.",
          );
          return;
        }

        if (Date.now() - startedAt >= MAX_POLL_MS) {
          setPhase("confirming");
          setMessage(
            "We're still confirming your payment. This can take a few minutes — check your membership page shortly.",
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

  if (phase === "loading" || phase === "confirming") {
    return (
      <PaymentResultShell
        tone="info"
        icon={<Loader2Icon className="size-8 animate-spin" />}
        title="Confirming your membership"
        description={
          message ??
          "Please wait while we verify your purchase. Keep this page open for a moment."
        }
        actions={
          phase === "confirming" && message ? (
            <Button
              variant="outline"
              render={<Link href={ROUTES.membership} />}
              className="rounded-xl"
            >
              Go to membership
            </Button>
          ) : undefined
        }
      >
        {planName ? (
          <div className="rounded-2xl border bg-muted/20 p-4 text-center text-sm">
            <p className="text-muted-foreground">Plan</p>
            <p className="mt-1 font-semibold">{planName}</p>
          </div>
        ) : null}
      </PaymentResultShell>
    );
  }

  if (phase === "success") {
    return (
      <PaymentResultShell
        tone="success"
        icon={<CheckCircle2Icon className="size-8" />}
        title="Membership activated"
        description={
          message ?? "Your membership is ready. Enjoy savings on your next stay."
        }
        actions={
          <>
            <Button
              render={<Link href={ROUTES.membership} />}
              className="rounded-xl sm:min-w-36"
            >
              View membership
            </Button>
            <Button
              variant="outline"
              render={<Link href={ROUTES.search} />}
              className="rounded-xl sm:min-w-36"
            >
              Book a stay
            </Button>
          </>
        }
      />
    );
  }

  return (
    <PaymentResultShell
      tone={phase === "invalid" ? "neutral" : "danger"}
      icon={
        phase === "invalid" ? (
          <TriangleAlertIcon className="size-8" />
        ) : (
          <XCircleIcon className="size-8" />
        )
      }
      title={phase === "invalid" ? "Invalid link" : "Payment incomplete"}
      description={
        message ??
        (phase === "invalid"
          ? "This result link is missing a purchase reference."
          : "Something went wrong with this payment.")
      }
      actions={
        <Button
          className="rounded-xl"
          render={<Link href={ROUTES.membershipPlans} />}
        >
          Back to plans
        </Button>
      }
    />
  );
}
