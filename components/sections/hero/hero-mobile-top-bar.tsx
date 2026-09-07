"use client";

import { Logo } from "@/components/common/logo";

export function HeroMobileTopBar() {
  return (
    <div className="mb-4 flex w-full items-center lg:hidden">
      <Logo size="sm" />
    </div>
  );
}
