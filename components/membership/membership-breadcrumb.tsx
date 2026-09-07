import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Container } from "@/components/common/container";
import { ROUTES } from "@/constants/routes";

type MembershipBreadcrumbProps = {
  current?: string;
};

export function MembershipBreadcrumb({
  current = "Membership",
}: MembershipBreadcrumbProps) {
  const isPlans = current !== "Membership";

  return (
    <Container className="py-3">
      <Breadcrumb>
        <BreadcrumbList className="text-[10px] sm:text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={ROUTES.home} />}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={ROUTES.profile} />}>
              My Account
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {isPlans ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href={ROUTES.membership} />}>
                  Membership
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{current}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage>{current}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </Container>
  );
}
