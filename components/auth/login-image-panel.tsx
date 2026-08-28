import Image from "next/image";

import { Logo } from "@/components/common/logo";
import { authConfig } from "@/config/auth";
import { cn } from "@/lib/utils";

type LoginImagePanelProps = {
  className?: string;
};

export function LoginImagePanel({ className }: LoginImagePanelProps) {
  return (
    <div
      className={cn(
        "relative hidden min-h-full overflow-hidden bg-[#1a1410] md:block",
        className,
      )}
    >
      <Image
        src="/auth-image.webp"
        alt="Discover premium stays with Alterstay"
        fill
        priority
        className="object-cover object-center"
        sizes="(min-width: 768px) 58vw, 0"
      />

      <div className="absolute inset-0 bg-linear-to-br from-black/35 via-black/10 to-black/25" />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

      <div className="relative z-10 flex h-full min-h-[480px] flex-col justify-between p-7 sm:p-8">
        <Logo size="sm" className="[&_img]:brightness-0 [&_img]:invert" />

        <div className="max-w-xs space-y-2">
          <p className="text-lg font-semibold leading-snug tracking-tight text-white">
            {authConfig.benefitsPanel.headline}
          </p>
          <p className="text-sm leading-relaxed text-white/80">
            {authConfig.benefitsPanel.subheadline}
          </p>
        </div>
      </div>
    </div>
  );
}
