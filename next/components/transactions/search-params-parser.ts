import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { TRANSACTION_TYPES } from "@/constants/transaction"
import { TRANSACTION_CATEGORIES } from "@/constants/transaction"
import { getFiltersStateParser } from "@/lib/data-table/parsers"
import { parseAsTimestamp } from "nuqs/server"
import { parseAsArrayOf } from "nuqs/server"
import { parseAsString } from "nuqs/server"
import { getSortingStateParser } from "@/lib/data-table/parsers"
import { parseAsInteger } from "nuqs/server"
import { TTransaction } from "@/lib/types/transaction"
import { createSearchParamsCache } from "nuqs/server"
import { z } from "zod"

dayjs.extend(utc)
dayjs.extend(timezone)

export const transactionSearchParamsCache = createSearchParamsCache({
	pageIndex: parseAsInteger.withDefault(1),
	pageSize: parseAsInteger.withDefault(10),
	sortBy: getSortingStateParser<TTransaction>().withDefault([{ id: "updatedAt", desc: true }]),
	title: parseAsString.withDefault(""),
	search: parseAsString.withDefault(""),
	type: parseAsArrayOf(z.enum(TRANSACTION_TYPES)).withDefault([]),
	category: parseAsArrayOf(z.enum([...Object.values(TRANSACTION_CATEGORIES.income), ...Object.values(TRANSACTION_CATEGORIES.expense)] as [string, ...string[]])).withDefault([]),
	fromDate: parseAsTimestamp.withDefault(dayjs.utc().startOf("month").subtract(1, "month").toDate()),
	toDate: parseAsTimestamp.withDefault(dayjs.utc().add(1, "day").toDate()),
	// Advanced filter
	filters: getFiltersStateParser().withDefault([]),
})

// Create a mutable version of the search params type for internal use
export type MutableTransactionSearchParams = {
    pageIndex: number;
    pageSize: number;
    sortBy: any[];
    title: string;
    search: string;
    type: string[];
    category: string[];
    fromDate: Date;
    toDate: Date;
    filters: any[];
    [key: string]: any;
};

export type TransactionsParsedSearchParams = Awaited<ReturnType<typeof transactionSearchParamsCache.parse>>;

export const getAllTransactionsSearchParamsBuilder = (input: TransactionsParsedSearchParams | MutableTransactionSearchParams) => {
    const searchParams = new URLSearchParams()
    console.log("SEARCH PARAMS BUILDER INPUT:", JSON.stringify(input, null, 2))
    
    // Ensure we have default values for everything to avoid undefined errors
    const safeInput = {
        pageIndex: input.pageIndex ?? 1,
        pageSize: input.pageSize ?? 10,
        sortBy: input.sortBy ?? [{ id: "updatedAt", desc: true }],
        title: input.title ?? "",
        search: input.search ?? "",
        type: Array.isArray(input.type) ? input.type : [],
        category: Array.isArray(input.category) ? input.category : [],
        fromDate: input.fromDate,
        toDate: input.toDate,
        filters: Array.isArray(input.filters) ? input.filters : []
    };
    
    // Pagination - make sure we're always using pageIndex/pageSize consistently
    searchParams.append("pageIndex", safeInput.pageIndex.toString())
    searchParams.append("pageSize", safeInput.pageSize.toString())
    
    // Sorting
    if (safeInput.sortBy && safeInput.sortBy.length > 0) {
        searchParams.append("sortBy", safeInput.sortBy[0].id)
        searchParams.append("sortDesc", safeInput.sortBy[0].desc.toString())
    }

    // Simple search
    if (safeInput.search) {
        searchParams.append("search", safeInput.search)
    }
    
    // Title filter
    if (safeInput.title) {
        searchParams.append("title", safeInput.title)
    }
    
    // Types filter (can be multiple)
    if (safeInput.type && safeInput.type.length > 0) {
        safeInput.type.forEach(type => {
            searchParams.append("type", type as string)
        })
    }
    
    // Category filter (can be multiple)
    if (safeInput.category && safeInput.category.length > 0) {
        safeInput.category.forEach(category => {
            searchParams.append("category", category as string)
        })
    }
    
    // Date range filters
    if (safeInput.fromDate) {
        const fromDate = dayjs(safeInput.fromDate).valueOf()
        searchParams.append("fromDate", fromDate.toString())
    }
    
    if (safeInput.toDate) {
        const toDate = dayjs(safeInput.toDate).valueOf()
        searchParams.append("toDate", toDate.toString())
    }
    
    // Advanced filters
    if (safeInput.filters && safeInput.filters.length > 0) {
        const filtersObj: Record<string, string> = {}
        
        safeInput.filters.forEach((filter: any) => {
            if (filter.id && filter.value !== undefined) {
                filtersObj[filter.id] = filter.value.toString()
            }
        })
        
        for (const [key, value] of Object.entries(filtersObj)) {
            searchParams.append(`Filters[${key}]`, value)
        }
    }
    
    return searchParams
}