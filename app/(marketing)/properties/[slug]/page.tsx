import { Suspense } from "react";

import { PropertyPage } from "@/components/property/property-page";

type PropertyRoutePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PropertyRoutePage({
  params,
}: PropertyRoutePageProps) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
          Loading property…
        </div>
      }
    >
      <PropertyPage slug={slug} />
    </Suspense>
  );
}
