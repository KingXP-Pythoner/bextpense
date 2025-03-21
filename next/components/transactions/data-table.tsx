import * as React from "react"
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"

import { getCommonPinningStyles } from "@/lib/data-table/styles"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/ui/table"
import { TTransaction } from "@/lib/types/transaction"

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
	 * @type TanstackTable<TData>
	 */
	table: TanstackTable<TData>
}
export function DataTable<TData = TTransaction>({ table, className }: DataTableProps<TData>) {
	return (
		<Table className="rounded-md isolate relative">
			<TableHeader className="bg-accent">
				{table.getHeaderGroups().map((headerGroup) => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map((header) => {
							return (
								<TableHead
									key={header.id}
									colSpan={header.colSpan}
									style={{
										...getCommonPinningStyles({ column: header.column }),
									}}
									className={cn({
										"bg-muted!": header.column.id === "actions",
										"min-w-[124px]": header.column.id === "createdAt",
										"max-w-[76px]": header.column.id === "author",
										"max-w-[64px]": header.column.id === "select",
									})}
								>
									{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
								</TableHead>
							)
						})}
					</TableRow>
				))}
			</TableHeader>
			<TableBody>
				{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map((row) => (
						<TableRow className="group/table-row" key={row.id} data-state={row.getIsSelected() && "selected"}>
							{row.getVisibleCells().map((cell) => (
								<TableCell
									key={cell.id}
									style={{
										...getCommonPinningStyles({ column: cell.column }),
									}}
									className={cn("text-start", {
										"group-data-[state=selected]/table-row:bg-muted! group-hover/table-row:bg-muted!":
											cell.column.id === "actions",
										"min-w-[124px]": cell.column.id === "createdAt",
										"max-w-[48px]": cell.column.id === "select",
									})}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell
							colSpan={table.getAllColumns().length}
							className="h-[264px] text-muted-foreground font-medium text-center"
						>
							No results found, try tweaking your filters.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	)
}
