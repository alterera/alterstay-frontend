"use client";

import Image from "next/image";
import Link from "next/link";
import { FlutedGlass } from "@paper-design/shaders-react";

import { Logo } from "@/components/common/logo";
import { Container } from "@/components/common/container";
import { SeoCityTagsSection } from "@/components/sections/seo-city-tags";
import { footerConfig } from "@/config/footer";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type FooterSection5Props = {
  className?: string;
};

export function FooterSection5({ className }: FooterSection5Props) {
  const year = new Date().getFullYear();
  const taglineLines = footerConfig.tagline.split("\n");

  return (
    <footer
      className={cn(
        "relative w-full overflow-hidden bg-background pb-15 antialiased lg:pb-0",
        className
      )}
    >
      {/*
        Stroke brand name is decorative background.
        SEO city tags sit above it in the same band (no extra gap).
      */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex items-end justify-center overflow-hidden"
        >
          <p className="select-none text-[72px] font-semibold leading-[0.75] text-transparent opacity-40 [-webkit-text-stroke:1px_rgba(0,0,0,0.35)] sm:text-[120px] md:text-[160px] lg:text-[200px]">
            {siteConfig.name}
          </p>
        </div>

        <div className="relative z-10 pb-8 pt-6 sm:pb-10 sm:pt-8 md:pb-12">
          <SeoCityTagsSection className="py-0" />
        </div>
      </div>

      {/* Primary panel */}
      <div className="relative z-10 min-h-[380px] w-full bg-gradient-premium">
        <div className="pointer-events-none absolute inset-0 z-0">
          <FlutedGlass
            size={0.89}
            shape="lines"
            angle={0}
            distortionShape="prism"
            distortion={0.5}
            shift={0}
            blur={0}
            edges={0.25}
            stretch={0}
            scale={1.11}
            fit="cover"
            highlights={0.1}
            shadows={0.2}
            grainMixer={0.1}
            grainOverlay={0.1}
            colorBack="#00000000"
            colorHighlight="#FFFFFF"
            colorShadow="#000000"
            className="h-full w-full bg-transparent"
          />
        </div>

        <Container className="relative z-10 flex flex-col justify-between gap-12 py-12 sm:py-14 md:py-16 lg:flex-row lg:gap-16 lg:py-20">
          <div className="flex max-w-sm flex-col justify-between gap-10">
            <div className="flex flex-col gap-4">
              <Logo
                size="lg"
                className="[&_img]:brightness-0 [&_img]:invert"
              />
              <h2 className="text-lg font-medium leading-snug text-white sm:text-xl">
                {taglineLines.map((line, index) => (
                  <span key={line}>
                    {line}
                    {index < taglineLines.length - 1 ? <br /> : null}
                  </span>
                ))}
              </h2>
              <p className="text-sm leading-relaxed text-white/75">
                {footerConfig.description}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <ul
                className="flex flex-wrap items-center gap-3 sm:gap-4"
                aria-label="Accepted payment methods"
              >
                {footerConfig.paymentLogos.map((logo) => (
                  <li key={logo.id}>
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={48}
                      height={32}
                      className="h-5 w-auto object-contain opacity-90 brightness-0 invert"
                    />
                  </li>
                ))}
              </ul>
              <p className="text-xs text-white/70 sm:text-[13px]">
                {footerConfig.copyright(year)}
              </p>
            </div>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-col gap-5 lg:min-w-[280px]"
          >
            <h3 className="text-lg font-semibold text-white sm:text-xl">
              {footerConfig.linksSectionTitle}
            </h3>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-3.5">
              {footerConfig.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-white/75 transition-colors hover:text-white sm:text-[15px]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </div>
    </footer>
  );
}
