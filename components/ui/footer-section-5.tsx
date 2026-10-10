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

function SocialIcon({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const common = { className, fill: "currentColor", "aria-hidden": true };
  switch (id) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path
            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
          />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path
            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path
            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
          />
        </svg>
      );
    default:
      return null;
  }
}

type FooterSection5Props = {
  className?: string;
};

export function FooterSection5({ className }: FooterSection5Props) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "relative w-full overflow-hidden bg-background antialiased lg:pb-0",
        className,
      )}
    >
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

        <Container
          className="relative z-10 flex flex-col justify-between gap-12 py-12 pb-28 sm:py-14 sm:pb-32 md:py-16 md:pb-36 lg:flex-row lg:gap-16 lg:py-20 lg:pb-24"
        >
          <div className="flex max-w-sm flex-col justify-between gap-10">
            <div className="flex flex-col gap-4">
              <Logo
                size="lg"
                className="w-fit [&_img]:brightness-0 [&_img]:invert"
              />
              <p className="text-sm leading-relaxed text-white/75">
                {footerConfig.description}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-white">
                  {footerConfig.followUsLabel}
                </p>
                <ul
                  className="flex flex-wrap items-center gap-2 sm:gap-3"
                  aria-label={footerConfig.followUsLabel}
                >
                  {footerConfig.socialLinks.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 hover:text-white"
                        aria-label={link.name}
                      >
                        <SocialIcon
                          id={link.id}
                          className="size-[18px]"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
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

          <ul
            className="absolute bottom-6 right-4 flex max-w-[min(100%,20rem)] flex-wrap items-center justify-end gap-3 sm:right-6 sm:gap-4 lg:bottom-12 lg:right-8"
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
        </Container>
      </div>
    </footer>
  );
}
