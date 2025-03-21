import { parseAsArrayOf, parseAsInteger, parseAsString, Parser, useQueryState, UseQueryStateOptions, useQueryStates } from 'nuqs'
import { DataTableFilterField, ExtendedSortingState, } from '@/lib/types/data-table'
import React, { TransitionStartFunction, useMemo, useState } from 'react'
import {
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    getFilteredRowModel,
    ColumnFiltersState, TableOptions,
    RowSelectionState,
    PaginationState,
    Updater,
    getFacetedRowModel,
    getFacetedUniqueValues,
    TableState
} from "@tanstack/react-table"
import { getSortingStateParser } from '@/lib/data-table/parsers'
import { useDebouncedCallback } from './use-debounced-callback'

interface UseDataTableProps<TData>
	extends Omit<
			TableOptions<TData>,
			"state" | "pageCount" | "getCoreRowModel" | "manualFiltering" | "manualPagination" | "manualSorting"
		>,
		Required<Pick<TableOptions<TData>, "pageCount">> {
	/**
	 * Defines filter fields for the table. Supports both dynamic faceted filters and search filters.
	 * - Faceted filters are rendered when `options` are provided for a filter field.
	 * - Otherwise, search filters are rendered.
	 *
	 * The indie filter field `value` represents the corresponding column name in the database table.
	 * @default []
	 * @type { label: string, value: keyof TData, placeholder?: string, options?: { label: string, value: string, icon?: ComponentType<{ className?: string }> }[] }[]
	 * @example
	 * ```ts
	 * // Render a search filter
	 * const filterFields = [
	 *   { label: "Title", value: "title", placeholder: "Search titles" }
	 * ];
	 * // Render a faceted filter
	 * const filterFields = [
	 *   {
	 *     label: "Status",
	 *     value: "status",
	 *     options: [
	 *       { label: "Todo", value: "todo" },
	 *       { label: "In Progress", value: "in-progress" },
	 *     ]
	 *   }
	 * ];
	 * ```
	 */
	filterFields?: DataTableFilterField<TData>[]

	/**
	 * Determines how query updates affect history.
	 * `push` creates a new history entry; `replace` (default) updates the current entry.
	 * @default "replace"
	 */
	history?: "push" | "replace"

	/**
	 * Indicates whether the page should scroll to the top when the URL changes.
	 * @default false
	 */
	scroll?: boolean

	/**
	 * Shallow mode keeps query states client-side, avoiding server calls.
	 * Setting to `false` triggers a network request with the updated querystring.
	 * @default true
	 */
	shallow?: boolean

	/**
	 * Maximum time (ms) to wait between URL query string updates.
	 * Helps with browser rate-limiting. Minimum effective value is 50ms.
	 * @default 50
	 */
	throttleMs?: number

	/**
	 * Debounce time (ms) for filter updates to enhance performance during rapid input.
	 * @default 300
	 */
	debounceMs?: number

	/**
	 * Observe Server Component loading states for non-shallow updates.
	 * Pass `startTransition` from `useTransition()`.
	 * Sets `shallow` to `false` automatically.
	 * So shallow: true` and `startTransition` cannot be used at the same time.
	 * @see https://react.dev/reference/react/useTransition
	 */
	startTransition?: TransitionStartFunction

	/**
	 * Clear URL query key-value pair when state is set to default.
	 * Keep URL meaning consistent when defaults change.
	 * @default false
	 */
	clearOnDefault?: boolean

	/**
	 * Enable notion like column filters.
	 * Advanced filters and column filters cannot be used at the same time.
	 * @default false
	 * @type boolean
	 */
	enableAdvancedFilter?: boolean

	initialState?: Omit<Partial<TableState>, "sorting"> & {
		// Extend to make the sorting id typesafe
		sorting?: ExtendedSortingState<TData>
	}
}
export function useTransactionsTable<TData>({ pageCount = -1,
	history = "replace",
    scroll = false,
    filterFields = [],
	shallow = true,
	throttleMs = 50,
	debounceMs = 240,
	clearOnDefault = false,
	initialState, startTransition, ...props}: UseDataTableProps<TData>) {

    const queryStateOptions = useMemo<Omit<UseQueryStateOptions<string>, "parse">>(() => {
		return {
			history,
			scroll,
			shallow,
			throttleMs,
			clearOnDefault,
			startTransition,
		}
	}, [history, scroll, shallow, throttleMs, clearOnDefault, startTransition])
    const [rowSelection, setRowSelection] = useState<RowSelectionState>(
		initialState?.rowSelection ?? {}
	)

	const [page, setPage] = useQueryState("pageIndex", parseAsInteger.withOptions(queryStateOptions).withDefault(1))
	const [pageSize, setPerPage] = useQueryState(
		"pageSize",
		parseAsInteger.withOptions(queryStateOptions).withDefault(initialState?.pagination?.pageSize ?? 10)
	)
	const [sorting, setSorting] = useQueryState(
		"sortBy",
		getSortingStateParser<TData>()
			.withOptions(queryStateOptions)
			.withDefault(initialState?.sorting ?? [])
    )
    	// Create parsers for each filter field
	const filterParsers = React.useMemo(() => {
		return filterFields.reduce<Record<string, Parser<string> | Parser<string[]>>>((acc, field) => {
			if (field.options) {
				// Faceted filter
				acc[field.id] = parseAsArrayOf(parseAsString, ",").withOptions(queryStateOptions)
			} else {
				// Search filter
				acc[field.id] = parseAsString.withOptions(queryStateOptions)
			}
			return acc
		}, {})
	}, [filterFields, queryStateOptions])
	const [filterValues, setFilterValues] = useQueryStates(filterParsers)

    const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
		return Object.entries(filterValues).reduce<ColumnFiltersState>((filters, [key, value]) => {
					if (value !== null) {
						filters.push({
							id: key,
							value: Array.isArray(value) ? value : [value],
						})
					}
					return filters
				}, [])
	}, [filterValues])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(initialColumnFilters)
    const debouncedSetFilterValues = useDebouncedCallback(setFilterValues, debounceMs)
	// Memoize the pagination state that comes from URL
	const pagination: PaginationState = useMemo(() => ({
		pageIndex: page - 1, // zero-based index -> one-based index
		pageSize: pageSize,
	}), [page, pageSize]);

	// Update the URL when pagination changes
    function onPaginationChange(updaterOrValue: Updater<PaginationState>) {
		if (typeof updaterOrValue === "function") {
			const newPagination = updaterOrValue(pagination)
			// Manually force the state update without conditions
			console.log("Setting page to", newPagination.pageIndex + 1)
			setPage(newPagination.pageIndex + 1)
			setPerPage(newPagination.pageSize)
		} else {
			// Directly set the values from the updater
			console.log("Direct setting page to", updaterOrValue.pageIndex + 1)
			setPage(updaterOrValue.pageIndex + 1)
			setPerPage(updaterOrValue.pageSize)
		}
    }
    
    	// Sort
	function onSortingChange(updaterOrValue: Updater<SortingState>) {
		if (typeof updaterOrValue === "function") {
			const newSorting = updaterOrValue(sorting) as ExtendedSortingState<TData>
			void setSorting(newSorting)
		}
    }
    
	// Memoize computation of searchableColumns and filterableColumns
	const { searchableColumns, filterableColumns } = useMemo(() => {
		return {
					searchableColumns: filterFields.filter((field) => !field.options),
					filterableColumns: filterFields.filter((field) => field.options),
				}
    }, [filterFields])
    

    const onColumnFiltersChange = React.useCallback(
		(updaterOrValue: Updater<ColumnFiltersState>) => {

			React.startTransition(() => {
				const next = typeof updaterOrValue === "function" ? updaterOrValue(columnFilters) : updaterOrValue

				const filterUpdates = next.reduce<Record<string, string | string[] | null>>((acc, filter) => {
					if (searchableColumns.some((col) => col.id === filter.id)) {
						// For search filters, use the value directly
						acc[filter.id] = filter.value as string
					} else if (filterableColumns.some((col) => col.id === filter.id)) {
						// For faceted filters, use the array of values
						acc[filter.id] = filter.value as string[]
					}
					return acc
				}, {})

				columnFilters.forEach((prevFilter) => {
					if (!next.some((filter) => filter.id === prevFilter.id)) {
						filterUpdates[prevFilter.id] = null
					}
				})
				setColumnFilters(next)

				setFilterValues(filterUpdates)
			})
			if (page !== 1) {
				setPage(1)
			}
		},
		[debouncedSetFilterValues, filterableColumns, searchableColumns, page, columnFilters, setPage]
	)
	const table = useReactTable({
		...props,
		initialState,
		pageCount,
		state: {
			pagination,
			sorting,
			rowSelection,
			columnFilters,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onPaginationChange,
		onSortingChange,
		onColumnFiltersChange,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel:  getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
	})
	return { table }

} 