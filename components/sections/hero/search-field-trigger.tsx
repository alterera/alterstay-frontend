import { cn } from "@/lib/utils";

type SearchFieldTriggerProps = React.ComponentProps<"button"> & {
  icon: React.ReactNode;
  label: string;
  value: string;
  /**
   * Collapses the icon and label to a single line. Driven by CSS so the field
   * can morph between states instead of swapping markup.
   */
  compact?: boolean;
};

export function SearchFieldTrigger({
  icon,
  label,
  value,
  compact = false,
  className,
  ...props
}: SearchFieldTriggerProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full min-w-0 items-center rounded-2xl text-left transition-all duration-500 ease-in-out hover:bg-muted/60",
        compact ? "gap-0 px-3 py-1.5" : "gap-3 px-3 py-3 sm:px-4",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted/40 text-muted-foreground transition-all duration-500 ease-in-out",
          compact
            ? "size-0 border-0 opacity-0"
            : "size-9 border border-border/60 opacity-100",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block overflow-hidden text-xs text-muted-foreground transition-all duration-500 ease-in-out",
            compact ? "max-h-0 opacity-0" : "max-h-5 opacity-100",
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "block truncate font-semibold text-foreground transition-all duration-500 ease-in-out",
            compact ? "text-sm" : "text-sm sm:text-base",
          )}
        >
          {value}
        </span>
      </span>
    </button>
  );
}
