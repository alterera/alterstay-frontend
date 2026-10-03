import { ROUTES } from "@/constants/routes";
import { popularIndianCities } from "@/config/popular-cities";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqsConfig = {
  eyebrow: "The AlterStay Experience",
  title: "Frequently Asked Questions",
  description:
    "From discovering exceptional stays to making the most of your membership, find everything you need to know about booking with AlterStay.",
  supportLink: {
    label: "speak with our support team",
    href: ROUTES.help.support,
  },
  items: [
    {
      id: "why-alterstays",
      question: "What makes Alterstay different?",
      answer:
        "Alterstay helps you discover premium hotels and resorts through a seamless booking experience. Explore carefully selected properties, compare available room options, review transparent pricing, and manage your reservations in one place.",
    },
    {
      id: "membership",
      question: "What is an Alterstay membership?",
      answer:
        "An Alterstay membership is designed to bring additional value to your hotel bookings through membership-specific benefits.",
    },
    {
      id: "booking-confirmation",
      question: "How do I know my reservation is confirmed?",
      answer:
        "Check the booking status and confirmation details displayed in your AlterStay  booking history.",
    },
    {
      id: "local-id",
      question: "Can I check in using a local address or local ID?",
      answer:
        "Check-in eligibility and accepted identification documents depend on the partner property's policies and applicable requirements. Review the property's check-in rules before booking, and ensure every guest carries valid original identification accepted by the hotel.",
    },
    {
      id: "couples",
      question: "Can unmarried couples book through Alterstay?",
      answer:
        "Policies can vary by hotel, so review the listing carefully before booking. All guests must meet the property's age and identification requirements.",
    },
    {
      id: "refunds",
      question: "How long do booking refunds take?",
      answer:
        "Refund eligibility and processing time depend on the cancellation terms, booking status, payment method, and payment provider. Contact support if the expected processing period has passed.",
    },
    {
      id: "booking-support",
      question: "What if I face an issue during check-in or my stay?",
      answer:
        "If you encounter a booking or check-in issue, contact our support team with your booking reference and the relevant details.",
    },
  ] satisfies FaqItem[],
} as const;
