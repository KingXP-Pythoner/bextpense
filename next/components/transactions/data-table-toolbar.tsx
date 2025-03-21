"use client"
import * as React from "react"
import type { DataTableFilterField } from "@/lib/types/data-table"
import type { Column, Table } from "@tanstack/react-table"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/shared/ui/button"
import { useDebouncedCallback } from "@/hooks/use-debounced-callback"
import { Input } from "@/components/shared/ui/input"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
	table: Table<TData>
	filterFields?: DataTableFilterField<TData>[]
}

export function DataTableToolbar<TData>({
	table,
	filterFields = [],
	children,
	className,
	...props
}: DataTableToolbarProps<TData>) {


    const [isInputEmpty, setIsInputEmpty] = React.useState(!table.getColumn("title")?.getFilterValue())
    

	const inputRef = React.useRef<HTMLInputElement>(null)
    const isFiltered = table.getState().columnFilters.length > 0
    

	// Memoize computation of searchableColumns and filterableColumns
	const { filterableColumns } = React.useMemo(() => {
		return {
			filterableColumns: filterFields.filter((field) => field.options),
		}
    }, [filterFields])
    
	const [filterableColumnStates, setFilterableColumnStates] = React.useState(
		filterableColumns.map((field) => {
			return {
				field,
				tableColumn: table.getColumn(field.id ? String(field.id) : ""),
				localSelectedValues: new Set(
					(table.getColumn(field.id ? String(field.id) : "")?.getFilterValue() as string[]) ?? []
				),
			}
		})
	)
	const isFilteredLocal =
        filterableColumnStates.filter((state) => state.localSelectedValues.size > 0).length > 0 || !isInputEmpty
    
	const _setDebouncedFilterValues = useDebouncedCallback((column: Column<TData>, value: string[]) => {
		column.setFilterValue(value.length > 0 ? value : undefined)
    }, 240)
    

	const debouncedSetTitleFilterValue = useDebouncedCallback(
		(value: string | Record<string, string[] | string | null>, id: string) => {
			table.getColumn(id)?.setFilterValue(value)
		},
		240
	)
	const onInputChange = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			React.startTransition(() => {
				setIsInputEmpty(!e.target.value)
				debouncedSetTitleFilterValue(e.target.value, "title")
			})
		},
		[isInputEmpty]
    )
    
    
	return (
		<div className={cn("flex bg-background w-full items-center p-1 justify-between gap-2 ", className)} {...props}>
			<div className="flex flex-1 items-center gap-2">
				<div className="relative flex-1">
					<Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						defaultValue={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
						ref={inputRef}
						placeholder={"Search transactions..."}
						className="h-8 w-40 lg:w-56 pl-8"
						onChange={onInputChange}
					/>
				</div>
				{children}

				{isFilteredLocal && (
					<Button
						aria-label="Reset filters"
						variant="ghost"
						className="h-8 px-2 lg:px-3"
						disabled={!isFiltered}
						onMouseDown={() => {
							setFilterableColumnStates((prev) => prev.map((state) => ({ ...state, localSelectedValues: new Set([]) })))
							if (inputRef.current) {
								inputRef.current.value = ""
							}
							setIsInputEmpty(true)
							table.resetColumnFilters()
						}}
					>
						Reset
						<X className="ml-2 size-3.5" aria-hidden="true" />
					</Button>
				)}
				{filterableColumnStates.length > 0 &&
					filterableColumnStates.map(
						({ field, localSelectedValues, tableColumn }) =>
							tableColumn && (
								<DataTableFacetedFilter
									key={String(field.id)}
									localSelectedValues={localSelectedValues}
									setLocalSelectedValues={(newValues) => {
										setFilterableColumnStates((prev) =>
											prev.map((state) => {
												if (state.field.id === field.id) {
													return { ...state, localSelectedValues: newValues }
												}
												return state
											})
										)
										React.startTransition(() => {
											_setDebouncedFilterValues(tableColumn, Array.from(newValues))
										})
									}}
									column={tableColumn}
									title={field.label}
									options={field.options ?? []}
								/>
							)
					)}
			</div>
		</div>
	)
}
