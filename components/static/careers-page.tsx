import Link from "next/link";

import { SubpageHeader } from "@/components/common/subpage-header";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function CareersPage() {
  return (
    <>
      <SubpageHeader title="Careers" backHref={ROUTES.home} />
      <section className="bg-background pb-16 pt-6 sm:pt-8">
        <Container className="max-w-3xl">
          <p className="text-sm leading-relaxed text-muted-foreground">
            We&apos;re building India&apos;s most trusted way to discover and book
            stays. If you care about hospitality, design, and thoughtful product
            work, we&apos;d love to hear from you.
          </p>

          <div className="mt-10 space-y-6">
            <section className="rounded-2xl border bg-white p-6">
              <h2 className="text-lg font-semibold">Open roles</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We don&apos;t have public listings yet. Send your resume and a short
                note about what you&apos;d like to work on.
              </p>
            </section>

            <section className="rounded-2xl border bg-muted/20 p-6">
              <h2 className="text-lg font-semibold">Get in touch</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Email{" "}
                <a
                  href="mailto:careers@alterstay.com"
                  className="font-medium text-brand underline"
                >
                  careers@alterstay.com
                </a>{" "}
                with your portfolio or LinkedIn profile.
              </p>
              <Button
                className="mt-4 rounded-xl"
                variant="outline"
                render={<Link href={ROUTES.about} />}
              >
                Learn about Alterstay
              </Button>
            </section>
          </div>
        </Container>
      </section>
    </>
  );
}
