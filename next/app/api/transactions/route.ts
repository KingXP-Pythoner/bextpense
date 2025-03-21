import { NextRequest, NextResponse } from "next/server";
import { tryCatchAsync } from "@/lib/helpers/try-catch";
import {
	getAllTransactionsSearchParamsBuilder,
	transactionSearchParamsCache,
	MutableTransactionSearchParams,
} from "@/components/transactions/search-params-parser";
import { z } from "zod";
import {
	transactionRequestSchema,
	transactionListResponseSchema,
	type TransactionRequestParams,
} from "@/schemas/transactions";
import dayjs from "dayjs";

// The function to actually fetch transactions from the core API
const fetchTransactions = async (validatedInput: TransactionRequestParams) => {
	const settled = await tryCatchAsync(async () => {
		const searchParams = getAllTransactionsSearchParamsBuilder(
			validatedInput as any as MutableTransactionSearchParams,
		);
		console.log(
			"SEARCH-PARAMS-ROUTE-FETCH (final params being sent to API):",
			searchParams.toString(),
		);

		// Make the API request
		const response = await fetch(
			`${process.env.CORE_API_URL}/api/transactions?${searchParams.toString()}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch transactions: ${response.status} ${response.statusText}`,
			);
		}

		// Parse the response
		const responseObj = await response.json();

		// Validate the response with Zod
		const result = transactionListResponseSchema.parse({
			data: responseObj.data,
			pageCount: responseObj.pageCount,
			totalCount: responseObj.totalCount,
		});

		return {
			transactions: result.data,
			pageCount: result.pageCount,
			totalCount: result.totalCount,
		};
	});

	return settled;
};

export async function GET(request: NextRequest) {
	try {
		// Get search params
		const searchParams = request.nextUrl.searchParams;
		console.log("SEARCH-PARAMS-ROUTE (raw from URL):", searchParams.toString());
		console.log("SEARCH PARAM VALUE:", searchParams.get("search"));

		const searchParamsObject = Object.fromEntries(searchParams.entries());
		console.log(
			"SEARCH-PARAMS-OBJECT-ROUTE (as object):",
			JSON.stringify(searchParamsObject, null, 2),
		);

		// First parsing using nuqs (converts strings to proper types)
		const parsedSearchParams =
			transactionSearchParamsCache.parse(searchParamsObject);
		console.log(
			"PARSED-SEARCH-PARAMS-ROUTE (after nuqs parsing):",
			JSON.stringify(parsedSearchParams, null, 2),
		);
		console.log("PARSED SEARCH VALUE:", parsedSearchParams.search);

		const mutableParams: MutableTransactionSearchParams = {
			...(parsedSearchParams as any),
			// Ensure these required fields have defaults
			pageIndex:
				parsedSearchParams.pageIndex ||
				parseInt(searchParamsObject.pageIndex, 10) ||
				1,
			pageSize:
				parsedSearchParams.pageSize ||
				parseInt(searchParamsObject.pageSize, 10) ||
				10,
			type: parsedSearchParams.type || [],
			search: parsedSearchParams.search || "",
			title: parsedSearchParams.title || "",
			category: parsedSearchParams.category || [],
			filters: parsedSearchParams.filters || [],
		};

		const validatedParams = transactionRequestSchema.parse(mutableParams);

		const processedParams = {
			...validatedParams,
			fromDate:
				validatedParams.fromDate ||
				dayjs.utc().startOf("month").subtract(1, "month").toDate(),
			toDate: validatedParams.toDate || dayjs.utc().add(1, "day").toDate(),
			// Cast type to the expected format - this is safe as we validated with Zod
			type: validatedParams.type as ("income" | "expense")[],
		};

		const [response, error] = await fetchTransactions(processedParams);

		if (error) {
			console.error("Error fetching transactions:", error);
			return NextResponse.json(
				{ error: "Failed to fetch transactions", details: error.message },
				{ status: 500 },
			);
		}

		return NextResponse.json(response);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid request parameters", details: error.errors },
				{ status: 400 },
			);
		}

		console.error("Error processing request:", error);
		return NextResponse.json(
			{ error: "Failed to process request" },
			{ status: 500 },
		);
	}
}
