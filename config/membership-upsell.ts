import type { LucideIcon } from "lucide-react";
import {
  BadgePercentIcon,
  CoinsIcon,
  GiftIcon,
  HeadsetIcon,
} from "lucide-react";

export type MembershipUpsellBenefit = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export const membershipUpsellConfig = {
  title: "Join Membership",
  ctaLabel: "Join Membership",
  benefits: [
    {
      id: "discount",
      label: "Get upto 10% discount on your stays",
      icon: BadgePercentIcon,
    },
    {
      id: "support",
      label: "On priority support",
      icon: HeadsetIcon,
    },
    {
      id: "first-stay",
      label: "First stay on Us",
      icon: GiftIcon,
    },
    {
      id: "coins",
      label: "Earn coins on every stay",
      icon: CoinsIcon,
    },
  ] satisfies MembershipUpsellBenefit[],
  highlight: {
    eyebrow: "Alterstay Membership",
    headline: "Travel more. Spend less.",
    description:
      "Unlock member-only rates, earn Alterstay coins on every booking, and enjoy priority support whenever you need it.",
    stats: [
      { label: "Member savings", value: "Up to 10%" },
      { label: "Coins on stays", value: "Every trip" },
      { label: "Support", value: "Priority" },
    ],
  },
};
