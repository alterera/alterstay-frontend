import type { ReactNode } from "react";
import Link from "next/link";

import { SubpageHeader } from "@/components/common/subpage-header";
import { Container } from "@/components/common/container";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

type LegalPageShellProps = {
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
  className?: string;
  footerNote?: ReactNode;
};

export function LegalPageShell({
  title,
  updatedAt,
  intro,
  sections,
  className,
  footerNote,
}: LegalPageShellProps) {
  return (
    <>
      <SubpageHeader title={title} backHref={ROUTES.home} />
      <section className={cn("bg-background pb-16 pt-6 sm:pt-8", className)}>
        <Container className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-wide text-brand">
            Legal
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: {updatedAt}
          </p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {intro}
          </p>

          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-lg font-semibold tracking-tight">
                  {section.heading}
                </h2>
                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets?.length ? (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border bg-muted/20 p-5 text-sm text-muted-foreground">
            {footerNote ?? (
              <p>
                Questions? Visit our{" "}
                <Link href={ROUTES.help.root} className="font-medium text-brand underline">
                  Help Centre
                </Link>{" "}
                or email{" "}
                <a
                  href="mailto:support@alterstay.com"
                  className="font-medium text-brand underline"
                >
                  support@alterstay.com
                </a>
                .
              </p>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
