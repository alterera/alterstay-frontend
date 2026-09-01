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

export function MembershipBreadcrumb() {
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
          <BreadcrumbItem>
            <BreadcrumbPage>Membership</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Container>
  );
}
