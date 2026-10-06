"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RATE_PLAN_NAME_CUSTOM,
  RATE_PLAN_NAME_PRESETS,
} from "@/constants/rate-plan-names";
import { cn } from "@/lib/utils";

type RatePlanNameFieldProps = {
  value: string;
  onChange: (value: string) => void;
  presets?: readonly string[];
  className?: string;
  id?: string;
};

function resolveSelectValue(
  name: string,
  presets: readonly string[],
): string {
  if (!name) return "";
  return presets.includes(name) ? name : RATE_PLAN_NAME_CUSTOM;
}

export function RatePlanNameField({
  value,
  onChange,
  presets = RATE_PLAN_NAME_PRESETS,
  className,
  id = "rate-plan-name",
}: RatePlanNameFieldProps) {
  const [customMode, setCustomMode] = useState(
    () => Boolean(value) && !presets.includes(value),
  );

  const selectValue = useMemo(() => {
    if (customMode || resolveSelectValue(value, presets) === RATE_PLAN_NAME_CUSTOM) {
      return RATE_PLAN_NAME_CUSTOM;
    }
    return resolveSelectValue(value, presets);
  }, [customMode, presets, value]);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>Plan name</Label>
      <Select
        value={selectValue}
        onValueChange={(next) => {
          if (!next) return;
          if (next === RATE_PLAN_NAME_CUSTOM) {
            setCustomMode(true);
            if (presets.includes(value)) onChange("");
            return;
          }
          setCustomMode(false);
          onChange(next);
        }}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Select a plan name" />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset} value={preset}>
              {preset}
            </SelectItem>
          ))}
          <SelectItem value={RATE_PLAN_NAME_CUSTOM}>Custom name</SelectItem>
        </SelectContent>
      </Select>

      {selectValue === RATE_PLAN_NAME_CUSTOM ? (
        <Input
          placeholder="Enter custom plan name"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : null}
    </div>
  );
}
