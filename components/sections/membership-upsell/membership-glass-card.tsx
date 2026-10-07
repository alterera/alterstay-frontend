import { CrownIcon } from "lucide-react";

import { membershipUpsellConfig } from "@/config/membership-upsell";

export function MembershipGlassCard() {
  const { highlight } = membershipUpsellConfig;

  return (
    <div className="membership-glass-strong rounded-md p-6 backdrop-blur-md">
      <div className="relative z-10">
        <div className="flex items-start gap-2.5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
              {highlight.eyebrow}
            </p>
            <p className="mt-0.5 text-lg font-semibold leading-tight tracking-tight text-white drop-shadow-sm">
              {highlight.headline}
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-white/85">
          {highlight.description}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {highlight.stats.map((stat) => (
            <div
              key={stat.label}
              className="membership-glass-light rounded-md px-3 py-3 text-center"
            >
              <p className="text-sm font-bold tracking-tight text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
