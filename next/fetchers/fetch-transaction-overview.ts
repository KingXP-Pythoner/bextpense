import "server-only";
import { unstable_cache } from "next/cache";
import { endpoints } from "./endpoints";
import { TTransactionOverviewResponse } from "@/lib/types/transaction-overview";
export const fetchTransactionOverview = async () => {
	return await unstable_cache(
		async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_DEV_MODE_FRONTEND_URL}${endpoints.bff.transactions.overview}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			const data = await response.json();
			return data as TTransactionOverviewResponse;
		},
		["expense-tracker-overview"],
		{
			tags: ["expense-tracker-overview"],
			revalidate: 12 * 60 * 60, // 12 hours
		},
	)();
};
