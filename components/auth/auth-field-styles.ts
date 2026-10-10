import { cn } from "@/lib/utils";

/** Shared premium field chrome for login modal inputs */
export const authFieldShellClass = cn(
  "flex overflow-hidden rounded-md border border-border/70 bg-muted/25 shadow-sm",
  "transition-[border-color,box-shadow] duration-200",
  "focus-within:border-brand/40 focus-within:ring-2 focus-within:ring-brand/15",
);

export const authFieldInputClass = cn(
  "h-12 flex-1 rounded-none border-0 bg-transparent text-base shadow-none",
  "placeholder:text-muted-foreground/80",
  "focus-visible:ring-0 md:text-base",
);

export const authFieldPrefixClass = cn(
  "flex items-center border-r border-border/70 bg-muted/40 px-3.5 text-sm font-medium text-foreground",
);
