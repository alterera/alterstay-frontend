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
  id: "home" | "favourites" | "bookings" | "offers" | "profile";
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
        description: "Browse guides and resources for your stay.",
      },
      {
        label: "FAQ",
        href: ROUTES.help.faq,
        description: "Find answers to commonly asked questions.",
      },
      {
        label: "Contact Support",
        href: ROUTES.help.contact,
        description: "Reach our team for booking assistance.",
      },
      {
        label: "Live Support",
        href: ROUTES.help.support,
        description: "Chat with us for real-time help.",
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
    id: "favourites",
    label: "Favourite",
    href: ROUTES.favourites,
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
