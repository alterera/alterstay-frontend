export type StayBenefit = {
  id: string;
  title: string;
  description: string;
};

export const STAY_BENEFIT_ICON_SRC = "/offer/offers.webp";

export const stayBenefitsConfig = {
  benefits: [
    {
      id: "flexible-check-in",
      title: "Flexible Check-in",
      description:
        "Decide when you check-in with hourly stays of 3, 6 and 12 hours",
    },
    {
      id: "elegant-experience",
      title: "Elegant Experience",
      description:
        "Luxury and premium hotels with exceptional amenities and service",
    },
    {
      id: "exciting-offers",
      title: "Exciting Offers",
      description: "Enjoy your stay with amazing deals across the website",
    },
  ] satisfies StayBenefit[],
} as const;
