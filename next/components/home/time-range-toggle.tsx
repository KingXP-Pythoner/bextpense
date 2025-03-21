"use client";

import { useChartsDataView, TimeRange } from "@/context/charts-data-view";
import { cn } from "@/lib/utils";

type TimeRangeOption = {
  value: TimeRange;
  label: string;
};

const timeRangeOptions: TimeRangeOption[] = [
  { value: "1m", label: "1M" },
  { value: "3m", label: "3M" },
  { value: "6m", label: "6M" },
  { value: "12m", label: "12M" },
];

export function TimeRangeToggle() {
  const { timeRange, setTimeRange } = useChartsDataView();

  return (
    <div className="inline-flex items-center bg-card border rounded-md p-1">
      {timeRangeOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setTimeRange(option.value)}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded transition-colors",
            timeRange === option.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
} 