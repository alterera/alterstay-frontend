import { footerConfig } from "@/config/footer";
import { ROUTES } from "@/constants/routes";

/** Marketing pages linked from the footer — app-style mobile chrome (no bottom dock). */
export const MARKETING_APP_STYLE_PATHS: readonly string[] = [
  ...footerConfig.links.map((link) => link.href),
  ROUTES.faqs,
];

export function isMarketingAppStylePage(pathname: string): boolean {
  if (MARKETING_APP_STYLE_PATHS.includes(pathname)) return true;
  if (pathname === ROUTES.help.faq) return true;
  return false;
}
