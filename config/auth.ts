import { ROUTES } from "@/constants/routes";

export type AuthBenefit = {
  id: string;
  title: string;
  description: string;
};

export const authConfig = {
  countryCode: "+91",
  brandName: "Alterstay",
  welcomeTitle: "Welcome to Alterstay",
  welcomeSubtitle: "Please enter your mobile number to login",
  getOtpLabel: "Get OTP",
  loginWithPasswordLabel: "Login with Password",
  whatsappOtpLabel: "Send OTP on WhatsApp",
  phonePlaceholder: "Enter mobile number",
  legalPrefix: "By Proceeding, you agree to our",
  benefitsPanel: {
    headline: "Book smarter stays with AlterStays",
    subheadline:
      "Discover trusted hotels, unlock member-only deals, and manage every booking with ease.",
  },
  benefits: [
    {
      id: "deals",
      title: "Exclusive deals",
      description: "Early access to offers and launches.",
    },
    {
      id: "booking",
      title: "Easy booking management",
      description: "Hassle-free cancellations and quick refunds.",
    },
    {
      id: "alter-cash",
      title: "Alter Cash",
      description: "Earn Fab credits for future savings.",
    },
  ] satisfies AuthBenefit[],
  legalLinks: {
    terms: { label: "T&Cs", href: ROUTES.terms },
    privacy: { label: "Privacy Policy", href: ROUTES.privacy },
  },
} as const;
