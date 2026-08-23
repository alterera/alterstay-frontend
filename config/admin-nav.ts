import type { LucideIcon } from "lucide-react";
import {
  Building2Icon,
  CalendarCheckIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import { ROUTES } from "@/constants/routes";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const adminNav: AdminNavItem[] = [
  { href: ROUTES.admin.root, label: "Dashboard", icon: LayoutDashboardIcon },
  { href: ROUTES.admin.properties, label: "Properties", icon: Building2Icon },
  { href: ROUTES.admin.bookings, label: "Bookings", icon: CalendarCheckIcon },
  { href: ROUTES.admin.users, label: "Users", icon: UsersIcon },
  { href: ROUTES.admin.settings, label: "Settings", icon: SettingsIcon },
];
