import { type Table } from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/shared/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/shared/ui/select";
import {
	DEFAULT_PER_PAGE_MAX,
	DEFAULT_PER_PAGE_MIN,
} from "@/constants/transaction";

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
	pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
	table,
	pageSizeOptions = [10, 20, 30],
}: DataTablePaginationProps<TData>) {
	console.log("PAGE-SIZE-OPTIONS: ", table.getState().pagination.pageIndex);
	return (
		<div
			draggable={false}
			className="flex w-full select-none flex-col-reverse items-center justify-between gap-4 overflow-auto px-1 py-3 sm:flex-row sm:gap-8"
		>
			<div className="flex select-none items-center justify-center text-sm font-medium">
				Page {table.getState().pagination.pageIndex + 1} of{" "}
				{table.getPageCount()}
			</div>
			<div className="flex-1 select-none whitespace-nowrap text-sm text-muted-foreground">
				{table.getFilteredSelectedRowModel().rows.length} of{" "}
				{table.getFilteredRowModel().rows.length} row(s) selected
			</div>
			<div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
				<div className="flex items-center space-x-2">
					<p className="whitespace-nowrap text-sm font-medium">Rows per page</p>
					<Select
						value={`${Math.min(DEFAULT_PER_PAGE_MAX, Math.max(DEFAULT_PER_PAGE_MIN, Math.round(table.getState().pagination.pageSize / 10) * 10))}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-[4.5rem]">
							<span>{table.getState().pagination.pageSize}</span>
						</SelectTrigger>
						<SelectContent side="top">
							{pageSizeOptions.map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center space-x-2">
					<Button
						aria-label="Go to first page"
						variant="outline"
						className="hidden size-8 p-0 lg:flex"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<ChevronsLeft className="size-3.5" aria-hidden="true" />
					</Button>
					<Button
						aria-label="Go to previous page"
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<ChevronLeft className="size-3.5" aria-hidden="true" />
					</Button>
					<Button
						aria-label="Go to next page"
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<ChevronRight className="size-3.5" aria-hidden="true" />
					</Button>
					<Button
						aria-label="Go to last page"
						variant="outline"
						size="icon"
						className="hidden size-8 lg:flex"
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<ChevronsRight className="size-3.5" aria-hidden="true" />
					</Button>
				</div>
			</div>
		</div>
	);
}
