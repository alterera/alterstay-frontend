import Image from "next/image";

import { Container } from "@/components/common/container";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import { HeroSearchForm } from "./hero-search-form";
import { HeroSocialProof } from "./hero-social-proof";

type HeroSectionProps = {
  className?: string;
};

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden lg:-mt-14",
        className
      )}
    >
      <div className="absolute inset-0">
        <Image
          src={siteConfig.hero.backgroundImage}
          alt={siteConfig.hero.backgroundAlt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/30 to-black/55" />
      </div>

      <Container className="relative flex flex-col items-center justify-center pb-12 pt-10 text-center sm:pb-14 sm:pt-12 lg:pb-16 lg:pt-32">
        <div className="flex w-full max-w-4xl flex-col items-center gap-5 sm:gap-6">
          <HeroSocialProof />

          <div className="space-y-3">
            <h1 className="text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl md:text-4xl">
              {siteConfig.tagline}
            </h1>
            <p className="mx-auto max-w-xl text-sm text-white/85 sm:text-base">
              {siteConfig.subtagline}
            </p>
          </div>

          <div className="w-full max-w-5xl pt-1">
            <HeroSearchForm dateLayout="combined" />
          </div>
        </div>
      </Container>
    </section>
  );
}
