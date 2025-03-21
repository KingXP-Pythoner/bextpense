"use client"

import { useMemo, useTransition } from "react"
import { getColumns } from "./columns"
import { DataTable } from "./data-table"
import { useTransactionsTable } from "@/hooks/use-transactions-table"
import { TTransaction } from "@/lib/types/transaction"
import { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from "@/constants/transaction"
import { toSentenceCase } from "@/lib/utils/format"
import { DataTableFilterField } from "@/lib/types/data-table"
import { DataTableToolbar } from "./data-table-toolbar"
import { DateRangePicker } from "../shared/ui/date-range-picker"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { DataTablePagination } from "./data-table-pagination"
import { ScrollArea, ScrollBar } from "../shared/ui/scroll-area"
import { TransactionsSummaryChart } from "@/components/transactions/transactions-summary-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { Button } from "../shared/ui/button"
import { FileDown } from "lucide-react"

dayjs.extend(utc)
dayjs.extend(timezone)

export function TransactionsTable({ initialData, initialPageCount }: { initialData: (TTransaction & {
    transactionDate: string;
    createdAt: string;
    updatedAt: string;
})[], initialPageCount: number }) {
	const [isPending, startTransition] = useTransition()
    const [exportPending, setExportPending] = useTransition()

    const columns = useMemo(() => getColumns(), [])
    const filterFields: DataTableFilterField<TTransaction>[] = useMemo(
		() => [
			
			{
				id: "title",
				label: "Title",
				placeholder: "Filter titles...",
			},
			{
				id: "type",
				label: "Cash flow",
				options: Object.values(TRANSACTION_TYPES)
					.flat()
					.map((type) => ({
						label: toSentenceCase(type),
						value: type,
					})),
			},
			{
				id: "category",
				label: "Category",
				options: Object.values(TRANSACTION_CATEGORIES)
					.flat()
					.map((category) => ({
						label: toSentenceCase(category),
						value: category,
					})),
			},
		
		],
		[]
	)
    const { table } = useTransactionsTable({
		data: initialData,
		columns,
		pageCount: initialPageCount,
		filterFields,
		enableAdvancedFilter: true,
		initialState: {
			sorting: [{ id: "updatedAt", desc: true }],
			columnPinning: { right: ["actions"] },
		},
		getRowId: (originalRow) => originalRow.id,
		shallow: false,
		clearOnDefault: true,
		startTransition,
	})
	
	// Get the filtered data from the table for the chart
	const filteredData = useMemo(() => {
        return table.getFilteredRowModel().rows
            .map(row => row.original) as (TTransaction & {
                updatedAt: string;
                createdAt: string;
                transactionDate: string;
            })[];
    }, [table.getFilteredRowModel().rows]);
    
    // Handle export to PDF
    const handleExportPDF = async () => {
        setExportPending(async () => {
            try {
                // Get full page URL to send to API
                const fullPageUrl = window.location.href;
                
                // Call the export endpoint with the page URL
                const response = await fetch(`/api/transactions/export-pdf?page=${encodeURIComponent(fullPageUrl)}`, {
                    method: 'GET',
                });
                
                if (!response.ok) {
                    throw new Error('Failed to generate PDF');
                }
                
                // Create a blob from the PDF data
                const blob = await response.blob();
                
                // Create a download link and trigger download
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `transactions-export-${dayjs().format('YYYY-MM-DD')}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error exporting PDF:', error);
            }
        });
    };
	
    return (
        <div className="w-full flex flex-col gap-6">
            <ScrollArea className="w-full">
            <div className="flex items-center justify-between gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={handleExportPDF}
                    disabled={exportPending}
                >
                    <FileDown className="size-4" />
                    Export PDF
                </Button>
                <DateRangePicker
                    defaultDateRange={{
                        fromDate: dayjs.utc().subtract(12, "month").startOf("day").valueOf(),
                        toDate: dayjs.utc().add(1, "day").valueOf(),
                    }}
                    triggerSize="sm"
                    triggerClassName="ml-auto w-56"
                    align="start"
                    shallow={false}
                />
                <DataTableToolbar table={table} filterFields={filterFields} />
            </div>
            <ScrollBar orientation="horizontal" />
            </ScrollArea>
            
            {/* Transaction Summary Chart */}
            <Card className="min-h-[364px]">
                <CardHeader >
                    <CardTitle>Transaction Summary</CardTitle>
                </CardHeader>
                <CardContent >
                    <TransactionsSummaryChart data={filteredData} isPending={isPending} />
                </CardContent>
            </Card>
            <div className="w-full rounded-xl border border-border overflow-hidden">
            <DataTable
     
      table={table}
            /></div>
            <div className="w-full flex flex-col bg-background h-fit gap-2.5">
				<DataTablePagination table={table} />
			</div>
      </div>
    
  )
} 