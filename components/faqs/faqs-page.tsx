"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { SubpageHeader } from "@/components/common/subpage-header";
import { Container } from "@/components/common/container";
import { FaqAccordion } from "@/components/sections/faqs/faq-accordion";
import { coinsFaqs } from "@/config/coins-faqs";
import { faqsConfig } from "@/config/faqs";
import { membershipFaqs } from "@/config/membership-faqs";
import { ROUTES } from "@/constants/routes";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

type FaqCategory = "general" | "membership" | "coins";

const CATEGORIES: { id: FaqCategory; label: string }[] = [
  { id: "general", label: "General" },
  { id: "membership", label: "Membership" },
  { id: "coins", label: "Coins" },
];

function categoryItems(category: FaqCategory) {
  switch (category) {
    case "membership":
      return membershipFaqs;
    case "coins":
      return coinsFaqs;
    default:
      return faqsConfig.items;
  }
}

function CategoryTabs({
  active,
  onChange,
  className,
}: {
  active: FaqCategory;
  onChange: (id: FaqCategory) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            active === cat.id
              ? "border-brand bg-brand text-white"
              : "border-border bg-white text-foreground hover:bg-muted/50",
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

export function FaqsPage() {
  const [category, setCategory] = useState<FaqCategory>("general");
  const items = useMemo(() => categoryItems(category), [category]);

  return (
    <>
      <SubpageHeader
        title="FAQs"
        backHref={ROUTES.home}
        variant="brand"
        mobileOnly
      />

      <div className="border-b bg-background lg:border-0">
        <Container className="hidden py-4 lg:block">
          <Breadcrumb>
            <BreadcrumbList className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href={ROUTES.home} />}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>FAQs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="mt-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Frequently asked questions
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Booking, membership, and coins — everything you need to travel with
              Alterstay.
            </p>
          </div>
          <CategoryTabs
            active={category}
            onChange={setCategory}
            className="mt-6"
          />
        </Container>

        <div className="sticky top-[calc(2.75rem+env(safe-area-inset-top,0px))] z-20 border-b bg-background px-4 py-2.5 lg:hidden">
          <CategoryTabs active={category} onChange={setCategory} />
        </div>
      </div>

      <section className="bg-background pb-16 pt-4 lg:pt-8">
        <Container className="max-w-5xl">
          <div className="rounded-md border bg-white p-4 shadow-sm sm:p-6 lg:p-8">
            <FaqAccordion items={items} className="lg:grid-cols-1" />
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Still need help?{" "}
            <Link
              href={ROUTES.help.support}
              className="font-medium text-brand hover:underline"
            >
              Contact support
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
