import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type CouponBannerSectionProps = {
  className?: string;
};

export function CouponBannerSection({ className }: CouponBannerSectionProps) {
  return (
    <section className={cn("bg-background py-4 sm:py-6", className)}>
      <Container>
        <Link
          href={ROUTES.search}
          className="block overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 transition-opacity hover:opacity-95"
          aria-label="New user offer — start searching stays"
        >
          <Image
            src="/newuser.webp"
            alt="New user coupon offer"
            width={1600}
            height={480}
            className="h-auto w-full object-cover"
            sizes="(max-width: 768px) 100vw, 72rem"
            priority={false}
          />
        </Link>
      </Container>
    </section>
  );
}
