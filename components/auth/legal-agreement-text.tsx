import Link from "next/link";

import { authConfig } from "@/config/auth";
import { cn } from "@/lib/utils";

type LegalAgreementTextProps = {
  className?: string;
};

export function LegalAgreementText({ className }: LegalAgreementTextProps) {
  const { legalPrefix, legalLinks } = authConfig;

  return (
    <p
      className={cn(
        "text-center text-[11px] leading-relaxed text-muted-foreground sm:text-xs",
        className
      )}
    >
      {legalPrefix}{" "}
      <Link
        href={legalLinks.terms.href}
        className="font-medium text-foreground underline underline-offset-2"
      >
        {legalLinks.terms.label}
      </Link>{" "}
      and{" "}
      <Link
        href={legalLinks.privacy.href}
        className="font-medium text-foreground underline underline-offset-2"
      >
        {legalLinks.privacy.label}
      </Link>
    </p>
  );
}
