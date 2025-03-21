"use client";

import { TTransaction } from "@/lib/types/transaction";
import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { toTransactionSummaryChart } from "@/lib/transformers/chart-transformers";
import { LegendBadge } from "@/features/dashboard";
import { Loader } from "lucide-react";
import { Separator } from "../shared/ui/separator";

export function TransactionsSummaryChart({
  data,
  isPending,
}: {
  data: (TTransaction & {
    transactionDate: string;
    createdAt: string;
    updatedAt: string;
  })[];
  isPending: boolean;
}) {
  // Transform data for the chart using the transformer
  const chartOptions = useMemo(() => toTransactionSummaryChart(data), [data]);
  
  // Determine if we have data to display
  const showChart = data.length > 0 && !isPending;
  
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-end gap-3">
          <LegendBadge color="var(--color-primary)" label="Income" />
          <LegendBadge color="var(--color-destructive)" label="Expense" />
          <LegendBadge color="var(--color-chart-2)" label="Net" />
              </div>
              <Separator className="h-4 bg-transparent" />
      </div>
      
      {isPending && (
        <div className="flex items-center justify-center h-[188px] gap-2 w-full">
          <Loader className="animate-spin size-4" /> Loading chart data...
        </div>
      )}
      
      {!showChart && !isPending && (
        <div className="flex items-center justify-center h-[188px] w-full">
          <p className="text-muted-foreground">No transaction data available for the selected filters</p>
        </div>
      )}
      
          {showChart && (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      )}
    </>
  );
} 