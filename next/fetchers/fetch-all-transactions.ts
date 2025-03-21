import "server-only";
import { endpoints } from "./endpoints";
import { TTransaction } from "@/lib/types/transaction";
import { TransactionsParsedSearchParams } from "@/components/transactions/search-params-parser";
import { getAllTransactionsSearchParamsBuilder } from "@/components/transactions/search-params-parser";
import { unstable_cache } from "next/cache";

export const fetchAllTransactions = async (
	searchParamsObject: TransactionsParsedSearchParams,
) => {
	return await unstable_cache(
		async () => {
			const parsedSearchParams =
				getAllTransactionsSearchParamsBuilder(searchParamsObject);

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_DEV_MODE_FRONTEND_URL}${endpoints.bff.transactions.listAllTransactions}?${parsedSearchParams.toString()}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			const data = await response.json();
			return data as { transactions: TTransaction[]; pageCount: number };
		},
		["expense-tracker-all-transactions"],
		{
			tags: ["expense-tracker-all-transactions"],
			revalidate: 12 * 60 * 60, // 12 hours
		},
	)();
};
