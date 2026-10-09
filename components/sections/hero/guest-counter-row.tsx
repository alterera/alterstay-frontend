import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type GuestCounterRowProps = {
  label: string;
  description: string;
  value: number;
  min?: number;
  max?: number;
  dense?: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
};

export function GuestCounterRow({
  label,
  description,
  value,
  min = 0,
  max = 20,
  dense = false,
  onDecrement,
  onIncrement,
}: GuestCounterRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3",
        dense ? "py-1.5" : "gap-4 py-3",
      )}
    >
      <div>
        <p
          className={cn(
            "font-medium text-foreground",
            dense ? "text-xs" : "text-sm",
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "text-muted-foreground",
            dense ? "text-[10px]" : "text-xs",
          )}
        >
          {description}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className={cn("rounded-full", dense ? "size-7" : "size-9")}
          disabled={value <= min}
          onClick={onDecrement}
          aria-label={`Decrease ${label}`}
        >
          <MinusIcon />
        </Button>
        <span
          className={cn(
            "w-5 text-center font-semibold",
            dense ? "text-xs" : "text-sm",
          )}
        >
          {value}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className={cn("rounded-full", dense ? "size-7" : "size-9")}
          disabled={value >= max}
          onClick={onIncrement}
          aria-label={`Increase ${label}`}
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}
