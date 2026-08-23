import type { LucideIcon } from "lucide-react";
import {
  HandCoinsIcon,
  HeadsetIcon,
  RefreshCwIcon,
  WalletIcon,
} from "lucide-react";

export type MembershipFeature = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export const membershipConfig = {
  headline: "It pays to be a member",
  subheadline: "Free membership, great benefits.",
  loginLabel: "Log in",
  joinLabel: "Join for free",
  memberNote: "You're signed in — member benefits apply to your bookings.",
  features: [
    {
      id: "save",
      label: "Save up to 50% instantly",
      icon: HandCoinsIcon,
    },
    {
      id: "rebook",
      label: "Automatic rebooking if the price drops",
      icon: RefreshCwIcon,
    },
    {
      id: "points",
      label: "Earn Alt Coins on every booking",
      icon: WalletIcon,
    },
    {
      id: "support",
      label: "24/7 customer support",
      icon: HeadsetIcon,
    },
  ] satisfies MembershipFeature[],
};
