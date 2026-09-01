import { ROUTES } from "@/constants/routes";

export type FooterLink = {
  label: string;
  href: string;
};

export type PaymentLogo = {
  id: string;
  name: string;
  src: string;
};

export const footerConfig = {
  tagline: "Discover stunning stays.\nBook with confidence.",
  description:
    "AlterStay helps you discover and book stunning resorts and elegant hotels across India. Enjoy seamless booking, trusted payments, and expert support for every stay.",
  linksSectionTitle: "Quick Links",
  links: [
    { label: "About Us", href: ROUTES.about },
    { label: "Terms & Conditions", href: ROUTES.terms },
    { label: "Blog", href: ROUTES.blog },
    { label: "Privacy Policy", href: ROUTES.privacy },
    { label: "Contact Us", href: ROUTES.contact },
    { label: "Careers", href: ROUTES.careers },
    { label: "FAQs", href: ROUTES.help.faq },
  ] satisfies FooterLink[],
  paymentLogos: [
    { id: "mastercard", name: "Mastercard", src: "/payment-logo/mastercard.svg" },
    { id: "visa", name: "Visa", src: "/payment-logo/visa.svg" },
    { id: "rupay", name: "RuPay", src: "/payment-logo/rupay.svg" },
    { id: "upi", name: "UPI", src: "/payment-logo/upi.svg" },
    { id: "paytm", name: "Paytm", src: "/payment-logo/paytm.svg" },
  ] satisfies PaymentLogo[],
  copyright: (year: number) =>
    `© ${year} Alterstay Corporation. All rights reserved.`,
} as const;
