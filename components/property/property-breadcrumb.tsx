import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ROUTES } from "@/constants/routes";

type PropertyBreadcrumbProps = {
  city?: string;
  propertyName: string;
};

export function PropertyBreadcrumb({
  city,
  propertyName,
}: PropertyBreadcrumbProps) {
  const cityLabel = city ? `${city} Hotels` : "Hotels";

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-[10px] sm:text-xs">
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href={ROUTES.home} />}>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {city ? (
            <BreadcrumbLink
              render={
                <Link
                  href={`${ROUTES.search}?city=${encodeURIComponent(city)}`}
                />
              }
            >
              {cityLabel}
            </BreadcrumbLink>
          ) : (
            <span>{cityLabel}</span>
          )}
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="truncate">{propertyName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
