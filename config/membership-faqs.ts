import type { FaqItem } from "@/config/faqs";

export const membershipFaqs: FaqItem[] = [
  {
    id: "what-is-membership",
    question: "What is Alterstay membership?",
    answer:
      "Membership unlocks extra savings on eligible stays, coins on completed bookings, and access to member-only offers as they launch.",
  },
  {
    id: "how-coins-work",
    question: "How do coins work?",
    answer:
      "You earn Alterstay coins after completed stays. Coins can be redeemed on future bookings where redemption is enabled at checkout.",
  },
  {
    id: "upgrade-plan",
    question: "Can I upgrade my plan?",
    answer:
      "Yes. Visit Membership plans to compare tiers and upgrade anytime. Remaining value from your current plan may be applied toward an upgrade.",
  },
  {
    id: "membership-expiry",
    question: "What happens when my membership expires?",
    answer:
      "Once your plan expires, you return to the Free tier. Your coin balance stays in your wallet, but member discounts apply only while a plan is active.",
  },
];
