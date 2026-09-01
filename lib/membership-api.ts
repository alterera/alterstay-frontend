import { getApiBase } from "@/lib/auth-api";
import { getAccessToken } from "@/lib/auth-storage";
import type {
  MembershipPlan,
  MembershipPurchaseResponse,
  MembershipPurchaseStatus,
  MembershipStatus,
  UpgradePreview,
} from "@/types/membership";

function randomIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `mem-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function authHeaders(extra?: HeadersInit): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return { ...headers, ...(extra as Record<string, string>) };
}

export async function fetchMembershipPlans(): Promise<MembershipPlan[]> {
  const res = await fetch(`${getApiBase()}/memberships/plans`);
  if (!res.ok) {
    throw new Error("Could not load membership plans");
  }
  return res.json();
}

export async function fetchMyMembership(): Promise<MembershipStatus> {
  const res = await fetch(`${getApiBase()}/memberships/me`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error("Could not load membership status");
  }
  return res.json();
}

export async function fetchUpgradePreview(
  planCode: string,
): Promise<UpgradePreview> {
  const res = await fetch(
    `${getApiBase()}/memberships/upgrade-preview?planCode=${encodeURIComponent(planCode)}`,
    { headers: authHeaders() },
  );
  if (!res.ok) {
    throw new Error("Could not load upgrade preview");
  }
  return res.json();
}

export async function fetchMembershipPurchase(
  purchaseId: string,
): Promise<MembershipPurchaseStatus> {
  const res = await fetch(`${getApiBase()}/memberships/purchases/${purchaseId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error("Could not load purchase status");
  }
  return res.json();
}

export async function createMembershipPurchase(
  planCode: string,
  idempotencyKey = randomIdempotencyKey(),
): Promise<MembershipPurchaseResponse> {
  const res = await fetch(`${getApiBase()}/memberships/purchase`, {
    method: "POST",
    headers: authHeaders({ "Idempotency-Key": idempotencyKey }),
    body: JSON.stringify({ planCode }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ??
        "Could not start membership checkout",
    );
  }
  return res.json();
}
