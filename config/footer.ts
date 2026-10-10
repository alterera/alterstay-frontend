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

export type SocialLink = {
  id: string;
  name: string;
  href: string;
};

export const footerConfig = {
  followUsLabel: "Follow Us",
  socialLinks: [
    {
      id: "facebook",
      name: "Facebook",
      href: "https://www.facebook.com/alterstay",
    },
    {
      id: "x",
      name: "X",
      href: "https://x.com/alterstay",
    },
    {
      id: "instagram",
      name: "Instagram",
      href: "https://www.instagram.com/alterstay",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/alterstay",
    },
  ] satisfies SocialLink[],
  description:
    "Alterstay helps you discover and book stunning resorts and elegant hotels across India. Enjoy seamless booking, trusted payments, and expert support for every stay.",
  linksSectionTitle: "Quick Links",
  links: [
    { label: "About Us", href: ROUTES.about },
    { label: "Terms & Conditions", href: ROUTES.terms },
    { label: "Privacy Policy", href: ROUTES.privacy },
    { label: "Cancellation Policy", href: ROUTES.cancellationPolicy },
    { label: "Blog", href: ROUTES.blog },
    { label: "Contact Us", href: ROUTES.contact },
    { label: "Careers", href: ROUTES.careers },
    { label: "Help", href: ROUTES.help.root },
    { label: "FAQs", href: ROUTES.faqs },
  ] satisfies FooterLink[],
  paymentLogos: [
    { id: "mastercard", name: "Mastercard", src: "/payment-logo/mastercard.svg" },
    { id: "visa", name: "Visa", src: "/payment-logo/visa.svg" },
    { id: "rupay", name: "RuPay", src: "/payment-logo/rupay.svg" },
    { id: "upi", name: "UPI", src: "/payment-logo/upi.svg" },
    { id: "paytm", name: "Paytm", src: "/payment-logo/paytm.svg" },
  ] satisfies PaymentLogo[],
  copyright: (year: number) =>
    `© ${year} Alterstay. All rights reserved.`,
} as const;
