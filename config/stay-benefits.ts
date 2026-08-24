import type { LucideIcon } from "lucide-react";
import {
  HandCoinsIcon,
  HeadsetIcon,
  RefreshCwIcon,
  WalletIcon,
} from "lucide-react";

export type StayBenefit = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export const stayBenefitsConfig = {
  headline: "Do More in every Alterstay",
  benefits: [
    {
      id: "save",
      label: "Save up to 30% instantly",
      icon: HandCoinsIcon,
    },
    {
      id: "rebook",
      label: "Automatic rebooking if the price drops",
      icon: RefreshCwIcon,
    },
    {
      id: "points",
      label: "Earn coins on every booking",
      icon: WalletIcon,
    },
    {
      id: "support",
      label: "24/7 customer support",
      icon: HeadsetIcon,
    },
  ] satisfies StayBenefit[],
};
