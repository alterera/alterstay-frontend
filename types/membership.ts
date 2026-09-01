export type MembershipPlan = {
  code: string;
  name: string;
  price: number;
  durationDays: number;
  discountPercent: number;
  benefitsDescription?: string | null;
};

export type MembershipPeriod = {
  id: string;
  planName: string;
  periodLabel: string;
  status: string;
  bookingsCount: number;
  coinsEarned: number;
};

export type MembershipStatus = {
  tier: string;
  active: {
    planCode: string;
    planName: string;
    discountPercent: number;
    activatedAt: string;
    expiresAt: string;
  } | null;
  activeMembership?: {
    planName: string;
    expiresAt: string;
    earnPercent: number;
  } | null;
  stats?: {
    completedBookings: number;
    coinsBalance: number;
    coinsEarnedLifetime: number;
  };
  periods?: MembershipPeriod[];
};

export type UpgradePreview = {
  planCode: string;
  planName: string;
  price: number;
  purchasedDays: number;
  bonusDays: number;
  totalDays: number;
  remainingValue: number;
  expiresAt: string;
};

export type MembershipPurchaseResponse = {
  purchaseId: string;
  paymentReference: string;
  checkoutUrl: string;
  paymentSessionId: string;
  cashfreeMode: "production" | "sandbox";
  sessionExpiresAt: string | null;
  amount: string;
  currency: string;
  planCode: string;
  planName: string;
};

export type MembershipPurchaseStatus = {
  id: string;
  status: string;
  planCode: string;
  planName: string;
  amount: number;
  currency: string;
  paidAt: string | null;
  membership: {
    status: string;
    expiresAt: string;
  } | null;
};
