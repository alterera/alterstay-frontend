import { cn } from "@/lib/utils";
import type { Testimonial } from "@/config/testimonials";

type TestimonialCardProps = {
  testimonial: Testimonial;
  className?: string;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function TestimonialCard({
  testimonial,
  className,
}: TestimonialCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-md bg-white p-5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.28)] ring-1 ring-black/5 sm:p-6",
        className,
      )}
    >
      <p className="flex-1 text-[15px] leading-relaxed text-slate-text sm:text-base">
        “{testimonial.quote}”
      </p>

      <div className="mt-6 flex items-start gap-3 border-t border-border/70 pt-4">
        <div
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#dbe4ff] text-sm font-semibold text-[#1e2a5a]"
        >
          {initials(testimonial.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#1e2a5a]">
            {testimonial.name}
          </p>
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground sm:text-[13px]">
            Stayed using Alterstay in {testimonial.city} {testimonial.stayDate}
          </p>
        </div>
      </div>
    </article>
  );
}
