import { ROUTES } from "@/constants/routes";
import { popularIndianCities } from "@/config/popular-cities";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqsConfig = {
  eyebrow: "Support",
  title: "FAQs",
  description:
    "Everything you need to know about booking stays with AlterStays. Can't find the answer you're looking for?",
  supportLink: {
    label: "chat to our friendly team",
    href: ROUTES.help.support,
  },
  items: [
    {
      id: "why-book",
      question: "Why should we book rooms with Alterstay?",
      answer:
        "AlterStays makes it easy to discover verified resorts and hotels with transparent pricing, flexible stay options, and dedicated booking support. From short hourly stays to full overnight bookings, you get trusted partner properties and a smooth check-in experience in one place.",
    },
    {
      id: "cities",
      question: "In which all cities it is possible to get Alterstay?",
      answer: `AlterStays is available across major Indian cities including ${popularIndianCities.slice(0, 12).join(", ")}, and more destinations are being added regularly. Use the search bar on the home page to explore stays in your preferred city.`,
    },
    {
      id: "local-id",
      question: "Can people with local id book hotel rooms with alterstay?",
      answer:
        "Yes. Guests can book with valid government-issued local ID proof such as Aadhaar, Voter ID, Driving Licence, or Passport, as accepted by the partner hotel. Please carry original ID for verification at check-in, as policies may vary by property.",
    },
    {
      id: "safety",
      question: "Are Alterstay partnered hotels safe?",
      answer:
        "Yes. We partner with verified hotels and resorts that meet our quality and safety standards. Properties are reviewed for guest safety, hygiene, and service reliability. If you face any issue during your stay, our support team is available to help resolve it quickly.",
    },
    {
      id: "under-18-couple",
      question:
        "We are an unmarried couple and one of us is below 18 years of age. Can we still book an hourly hotel room?",
      answer:
        "No. All guests checking in must be 18 years of age or older. Bookings where any guest is under 18 cannot be accepted for hourly or overnight stays, even if accompanying an adult. Please ensure all guests meet the minimum age requirement before booking.",
    },
    {
      id: "unmarried-couples",
      question: "Are unmarried couples allowed to check-in?",
      answer:
        "Yes, unmarried couples are welcome at many AlterStays partner hotels, provided both guests are 18+ and carry valid government ID. Some properties may have specific house rules, so we recommend checking the property policy on the listing page before you book.",
    },
  ] satisfies FaqItem[],
} as const;
