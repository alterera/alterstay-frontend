import { load } from "@cashfreepayments/cashfree-js";

export type CashfreeMode = "production" | "sandbox";

export type CashfreeSessionInput = {
  paymentSessionId?: string | null;
  checkoutUrl?: string | null;
  cashfreeMode?: CashfreeMode | string | null;
};

type CashfreeCheckoutInstance = NonNullable<Awaited<ReturnType<typeof load>>>;

const loaders = new Map<CashfreeMode, Promise<CashfreeCheckoutInstance>>();

async function loadCashfree(mode: CashfreeMode): Promise<CashfreeCheckoutInstance> {
  const existing = loaders.get(mode);
  if (existing) return existing;

  const loader = load({ mode }).then((instance) => {
    if (!instance) {
      throw new Error("Cashfree checkout could not be loaded in this browser");
    }
    return instance;
  });
  loaders.set(mode, loader);
  return loader;
}

function firstNonEmpty(...values: Array<string | null | undefined>): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

function sessionIdFromCheckoutUrl(checkoutUrl?: string | null): string | undefined {
  if (!checkoutUrl) return undefined;
  try {
    const hash = new URL(checkoutUrl).hash.replace(/^#/, "").trim();
    return hash.length > 0 ? hash : undefined;
  } catch {
    const hashIndex = checkoutUrl.indexOf("#");
    if (hashIndex < 0) return undefined;
    const hash = checkoutUrl.slice(hashIndex + 1).trim();
    return hash.length > 0 ? hash : undefined;
  }
}

function modeFromCheckoutUrl(checkoutUrl?: string | null): CashfreeMode | undefined {
  if (!checkoutUrl) return undefined;
  if (checkoutUrl.includes("payments-test.cashfree.com")) return "sandbox";
  if (checkoutUrl.includes("payments.cashfree.com")) return "production";
  return undefined;
}

export function resolveCashfreeCheckout(
  session: CashfreeSessionInput,
): { paymentSessionId: string; mode: CashfreeMode } {
  const paymentSessionId = firstNonEmpty(
    session.paymentSessionId,
    sessionIdFromCheckoutUrl(session.checkoutUrl),
  );
  if (!paymentSessionId) {
    throw new Error("Cashfree payment session is missing. Please try paying again.");
  }

  const mode: CashfreeMode =
    session.cashfreeMode === "sandbox" || session.cashfreeMode === "production"
      ? session.cashfreeMode
      : (modeFromCheckoutUrl(session.checkoutUrl) ?? "production");

  return { paymentSessionId, mode };
}

/**
 * Opens Cashfree hosted checkout via their JS SDK.
 *
 * On mobile, checkout() often resolves before the `_self` redirect finishes.
 * When that happens we force a full-page navigation with checkoutUrl.
 *
 * Callers must NOT navigate to a result page after this — Cashfree returnUrl
 * is responsible for bringing the user back after payment.
 */
export async function openCashfreeCheckout(
  session: CashfreeSessionInput,
): Promise<void> {
  const { paymentSessionId, mode } = resolveCashfreeCheckout(session);
  const checkoutUrl = firstNonEmpty(session.checkoutUrl);
  const cashfree = await loadCashfree(mode);

  const result = await cashfree.checkout({
    paymentSessionId,
    redirectTarget: "_self",
  });

  if (result?.error) {
    const message =
      typeof result.error === "object" &&
      result.error !== null &&
      "message" in result.error &&
      typeof result.error.message === "string"
        ? result.error.message
        : "Cashfree could not open checkout";
    throw new Error(message);
  }

  // SDK already started a redirect — leave the page alone.
  if (result?.redirect) {
    return;
  }

  // Mobile frequently returns without redirect=true and without leaving.
  // Hard-navigate so SPA routers cannot steal the page to a result screen.
  if (checkoutUrl && typeof window !== "undefined") {
    window.location.assign(checkoutUrl);
  }
}
