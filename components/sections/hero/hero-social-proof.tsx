import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type HeroSocialProofProps = {
  className?: string;
};

export function HeroSocialProof({ className }: HeroSocialProofProps) {
  const { avatars, label } = siteConfig.socialProof;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-2.5 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.1)] backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-inset ring-white/20",
        className
      )}
    >
      <AvatarGroup className="*:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-white">
        {avatars.map((avatar) => (
          <Avatar key={avatar.src} size="sm">
            <AvatarImage src={avatar.src} alt={avatar.alt} />
            <AvatarFallback>{avatar.fallback}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>

      <span className="pr-0.5 text-xs font-semibold tracking-tight text-white sm:text-sm">
        {label}
      </span>
    </div>
  );
}
