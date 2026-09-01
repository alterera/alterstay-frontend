import Image from "next/image";
import Link from "next/link";
import { Building2Icon } from "lucide-react";

import type { CityItem } from "@/config/cities";
import { cn } from "@/lib/utils";

type CityCardProps = {
  city: CityItem;
  className?: string;
};

export function CityCard({ city, className }: CityCardProps) {
  return (
    <Link
      href={city.href}
      className={cn(
        "group flex w-[4.25rem] shrink-0 flex-col items-center gap-1.5 sm:w-[5.25rem] md:w-24 lg:w-[6.5rem] lg:gap-2",
        className
      )}
    >
      <span className="relative aspect-square w-full overflow-hidden bg-muted shadow-sm ring-1 ring-black/5 transition-transform duration-200 group-hover:shadow-md group-active:shadow-sm rounded-lg">
        <Image
          src={city.image}
          alt={city.imageAlt}
          fill
          sizes="(max-width: 640px) 68px, (max-width: 1024px) 84px, 104px"
          className="object-cover"
        />
      </span>
      <span className="text-center text-[11px] font-medium text-foreground sm:text-xs lg:text-sm">
        {city.name}
      </span>
    </Link>
  );
}

type AllCitiesCardProps = {
  name: string;
  href: string;
  className?: string;
};

export function AllCitiesCard({ name, href, className }: AllCitiesCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex w-[4.25rem] shrink-0 flex-col items-center gap-1.5 sm:w-[5.25rem] md:w-24 lg:w-[6.5rem] lg:gap-2",
        className
      )}
    >
      <span className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-neutral-900 shadow-sm ring-1 ring-black/10 transition-transform duration-200 group-hover:scale-[1.03] group-active:scale-[0.98] sm:rounded-2xl lg:rounded-3xl">
        <Building2Icon
          className="size-5 text-white sm:size-6 lg:size-8"
          strokeWidth={1.5}
        />
      </span>
      <span className="text-center text-[11px] font-medium text-foreground sm:text-xs lg:text-sm">
        {name}
      </span>
    </Link>
  );
}
