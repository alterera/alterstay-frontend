import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site";

export type LogoVariant = "default" | "hero";

type LogoProps = {
  className?: string;
  /** Visual size of the logo mark + wordmark */
  size?: "sm" | "default" | "lg";
  /** Light logo treatment for dark/hero backgrounds */
  variant?: LogoVariant;
  /** Link target; pass `false` when the logo is already inside another link */
  href?: string | false;
};

const sizeClasses = {
  sm: "h-7 w-auto",
  default: "h-7 w-auto sm:h-8",
  lg: "h-8 w-auto sm:h-9",
} as const;

export function Logo({
  className,
  size = "default",
  variant = "default",
  href = ROUTES.home,
}: LogoProps) {
  const image = (
    <Image
      src="/alterstay-logo.png"
      alt={siteConfig.name}
      width={268}
      height={40}
      priority
      className={cn(
        sizeClasses[size],
        variant === "hero" && "brightness-0 invert",
      )}
    />
  );

  if (href === false) {
    return (
      <span className={cn("inline-flex items-center", className)} aria-hidden>
        {image}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center transition-opacity hover:opacity-90",
        className,
      )}
      aria-label={`${siteConfig.name} home`}
    >
      {image}
    </Link>
  );
}
