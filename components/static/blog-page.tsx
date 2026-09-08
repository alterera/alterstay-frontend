import Link from "next/link";

import { SubpageHeader } from "@/components/common/subpage-header";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function BlogPage() {
  return (
    <>
      <SubpageHeader title="Blog" backHref={ROUTES.home} />
      <section className="bg-background pb-16 pt-6 sm:pt-8">
        <Container className="max-w-3xl">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Travel guides, stay inspiration, and Alterstay updates are on the way.
            Check back soon for stories from across India.
          </p>

          <div className="mt-10 rounded-2xl border border-dashed bg-muted/20 px-6 py-12 text-center">
            <p className="text-sm font-medium text-foreground">
              No posts yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;re preparing our first articles on weekend getaways, city
              stays, and member savings.
            </p>
            <Button
              className="mt-6 rounded-xl"
              render={<Link href={ROUTES.search} />}
            >
              Explore stays
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
