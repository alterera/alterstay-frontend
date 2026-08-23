import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";

type GuestCounterRowProps = {
  label: string;
  description: string;
  value: number;
  min?: number;
  max?: number;
  onDecrement: () => void;
  onIncrement: () => void;
};

export function GuestCounterRow({
  label,
  description,
  value,
  min = 0,
  max = 20,
  onDecrement,
  onIncrement,
}: GuestCounterRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="size-9 rounded-full"
          disabled={value <= min}
          onClick={onDecrement}
          aria-label={`Decrease ${label}`}
        >
          <MinusIcon />
        </Button>
        <span className="w-6 text-center text-sm font-semibold">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="size-9 rounded-full"
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
