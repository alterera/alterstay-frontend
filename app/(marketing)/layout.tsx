import { MarketingShell } from "@/components/layout/marketing-shell";

export default function MarketingLayout({
  children,
}: LayoutProps<"/">) {
  return <MarketingShell>{children}</MarketingShell>;
}
