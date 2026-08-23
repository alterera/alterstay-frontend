import {
  BookOpenIcon,
  CalendarCheckIcon,
  CircleHelpIcon,
  FileTextIcon,
  GiftIcon,
  HeadsetIcon,
  HeartIcon,
  InfoIcon,
  LogOutIcon,
  ShieldCheckIcon,
  UserIcon,
  WalletIcon,
} from "lucide-react";

import { ROUTES } from "@/constants/routes";

export type ProfileMenuItem = {
  id: string;
  label: string;
  href?: string;
  icon: typeof HeadsetIcon;
  /** Destructive actions (e.g. logout) render in red. */
  tone?: "default" | "danger";
  action?: "logout";
};

export type ProfileMenuGroup = {
  id: string;
  title: string;
  items: ProfileMenuItem[];
};

export const profileConfig = {
  title: "My profile",
  welcomeBanner: {
    title: "Welcome to Alterstay",
    loginLabel: "Login",
  },
  guestNameFallback: "Guest",
  menuGroupsGuest: [
    {
      id: "help",
      title: "Help & Support",
      items: [
        {
          id: "customer-service",
          label: "Contact Customer Service",
          href: ROUTES.help.contact,
          icon: HeadsetIcon,
        },
      ],
    },
    {
      id: "settings",
      title: "Settings and Legal",
      items: [
        {
          id: "about",
          label: "About Alterstay",
          href: ROUTES.about,
          icon: InfoIcon,
        },
        {
          id: "terms",
          label: "Terms of Use",
          href: ROUTES.terms,
          icon: FileTextIcon,
        },
        {
          id: "privacy",
          label: "Privacy Policy",
          href: ROUTES.privacy,
          icon: ShieldCheckIcon,
        },
        {
          id: "faqs",
          label: "FAQs",
          href: ROUTES.help.faq,
          icon: CircleHelpIcon,
        },
      ],
    },
    {
      id: "other",
      title: "Other",
      items: [
        {
          id: "blog",
          label: "Blog",
          href: ROUTES.blog,
          icon: BookOpenIcon,
        },
      ],
    },
  ] satisfies ProfileMenuGroup[],
  menuGroupsAuthenticated: [
    {
      id: "profile",
      title: "Profile",
      items: [
        {
          id: "bookings",
          label: "My Bookings",
          href: ROUTES.bookings,
          icon: CalendarCheckIcon,
        },
        {
          id: "edit-profile",
          label: "Edit Profile",
          href: ROUTES.profileEdit,
          icon: UserIcon,
        },
        {
          id: "alter-cash",
          label: "My Alter Cash",
          href: ROUTES.alterCash,
          icon: WalletIcon,
        },
        {
          id: "offers",
          label: "My Offers",
          href: ROUTES.offers,
          icon: GiftIcon,
        },
      ],
    },
    {
      id: "help",
      title: "Help & Support",
      items: [
        {
          id: "customer-service",
          label: "Contact Customer Services",
          href: ROUTES.help.contact,
          icon: HeadsetIcon,
        },
      ],
    },
    {
      id: "settings",
      title: "Settings & Legal",
      items: [
        {
          id: "about",
          label: "About Alterstay",
          href: ROUTES.about,
          icon: InfoIcon,
        },
        {
          id: "terms",
          label: "Terms of Use",
          href: ROUTES.terms,
          icon: FileTextIcon,
        },
        {
          id: "privacy",
          label: "Privacy Policy",
          href: ROUTES.privacy,
          icon: ShieldCheckIcon,
        },
        {
          id: "faqs",
          label: "FAQs",
          href: ROUTES.help.faq,
          icon: CircleHelpIcon,
        },
      ],
    },
    {
      id: "other",
      title: "Other",
      items: [
        {
          id: "blog",
          label: "Blog",
          href: ROUTES.blog,
          icon: BookOpenIcon,
        },
        {
          id: "logout",
          label: "Logout",
          icon: LogOutIcon,
          tone: "danger",
          action: "logout",
        },
      ],
    },
  ] satisfies ProfileMenuGroup[],
  desktopAccountMenu: [
    {
      id: "profile",
      label: "Profile",
      href: ROUTES.profile,
      icon: UserIcon,
    },
    {
      id: "bookings",
      label: "Bookings",
      href: ROUTES.bookings,
      icon: CalendarCheckIcon,
    },
    {
      id: "alter-cash",
      label: "My Altercash",
      href: ROUTES.alterCash,
      icon: WalletIcon,
    },
    {
      id: "favourites",
      label: "Favourites",
      href: ROUTES.favourites,
      icon: HeartIcon,
    },
    {
      id: "logout",
      label: "Log out",
      icon: LogOutIcon,
      tone: "danger" as const,
      action: "logout" as const,
    },
  ],
} as const;
