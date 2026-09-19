import { ROUTES } from "@/constants/routes";

export type NavLinkItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavItem =
  | {
      type: "link";
      label: string;
      href: string;
    }
  | {
      type: "dropdown";
      label: string;
      items: NavLinkItem[];
    };

export type MobileDockItem = {
  id: "home" | "bookings" | "offers" | "profile";
  label: string;
  href: string;
};

export const mainNavigation: NavItem[] = [
  {
    type: "link",
    label: "Offers",
    href: ROUTES.offers,
  },
  {
    type: "dropdown",
    label: "Help & Support",
    items: [
      {
        label: "Help Center",
        href: ROUTES.help.root,
      },
      {
        label: "FAQs",
        href: ROUTES.help.faq,
      },
      {
        label: "Contact Us",
        href: ROUTES.contact,
      },
    ],
  },
];

export const mobileDockNavigation: MobileDockItem[] = [
  {
    id: "home",
    label: "Home",
    href: ROUTES.home,
  },
  {
    id: "bookings",
    label: "Bookings",
    href: ROUTES.bookings,
  },
  {
    id: "offers",
    label: "Offers",
    href: ROUTES.offers,
  },
  {
    id: "profile",
    label: "Profile",
    href: ROUTES.profile,
  },
];
