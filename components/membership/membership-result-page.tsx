"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Container } from "@/components/common/container";
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
  const startedAt = useMemo(() => Date.now(), []);

  useEffect(() => {
    if (!purchaseId) {
      setPhase("invalid");
      return;
    }
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace(`${ROUTES.auth.login}?redirect=${encodeURIComponent(`${ROUTES.membershipResult}?ref=${purchaseId}`)}`);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function poll() {
      try {
        const purchase = await fetchMembershipPurchase(purchaseId!);
        if (cancelled) return;

        if (purchase.status === "CAPTURED" && purchase.membership) {
          setPhase("success");
          setMessage(
            `Your ${purchase.planName} is active until ${new Date(purchase.membership.expiresAt).toLocaleDateString("en-IN")}.`,
          );
          return;
        }

        if (purchase.status === "FAILED" || purchase.status === "EXPIRED") {
          setPhase("failed");
          setMessage("Payment was not completed. You can try again from the membership page.");
          return;
        }

        if (Date.now() - startedAt >= MAX_POLL_MS) {
          setPhase("confirming");
          setMessage(
            "We are still confirming your payment. This can take a few minutes — check your profile shortly.",
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

  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      {phase === "loading" || phase === "confirming" ? (
        <>
          <Loader2Icon className="size-12 animate-spin text-brand" />
          <h1 className="mt-6 text-2xl font-semibold">Confirming payment…</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Please wait while we verify your membership purchase. Do not close
            this page.
          </p>
        </>
      ) : null}

      {phase === "success" ? (
        <>
          <CheckCircle2Icon className="size-12 text-emerald-600" />
          <h1 className="mt-6 text-2xl font-semibold">Membership activated</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
          <div className="mt-8 flex gap-3">
            <Button render={<Link href={ROUTES.profile} />}>View profile</Button>
            <Button
              variant="outline"
              render={<Link href={ROUTES.search} />}
            >
              Book a stay
            </Button>
          </div>
        </>
      ) : null}

      {phase === "failed" || phase === "invalid" ? (
        <>
          <XCircleIcon className="size-12 text-destructive" />
          <h1 className="mt-6 text-2xl font-semibold">
            {phase === "invalid" ? "Invalid link" : "Payment incomplete"}
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {message ??
              (phase === "invalid"
                ? "This result link is missing a purchase reference."
                : "Something went wrong.")}
          </p>
          <Button className="mt-8" render={<Link href={ROUTES.membership} />}>
            Back to membership
          </Button>
        </>
      ) : null}
    </Container>
  );
}
