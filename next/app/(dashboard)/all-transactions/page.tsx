import { transactionSearchParamsCache } from "@/components/transactions/search-params-parser";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import dayjs from "dayjs";
import { fetchAllTransactions } from "@/fetchers/fetch-all-transactions";
import { TTransaction } from "@/lib/types/transaction";

type AllTransactionsPageProps = {
	searchParams: Promise<{
		[key: string]: string | string[] | undefined;
	}>;
};

export default async function AllTransactionsPage({
	searchParams,
}: AllTransactionsPageProps) {
	const awaitedSearchParams = await searchParams;
	const parsedSearchParams =
		transactionSearchParamsCache.parse(awaitedSearchParams);
	const initialData = await fetchAllTransactions(parsedSearchParams);

	return (
		<div className="max-w-6xl mx-auto p-4">
			<TransactionsTable
				initialData={initialData.transactions.map((t) => {
					// Create properly typed transaction object
					const transaction = {
						...t,
						category: t.category || (t as any).categoryId,
						transactionDate:
							typeof t.transactionDate === "string"
								? t.transactionDate
								: dayjs(t.transactionDate).toISOString(),
						createdAt:
							typeof t.createdAt === "string"
								? t.createdAt
								: dayjs(t.createdAt).toISOString(),
						updatedAt:
							typeof t.updatedAt === "string"
								? t.updatedAt
								: dayjs(t.updatedAt).toISOString(),
					};

					// Cast to expected type
					return transaction as unknown as TTransaction & {
						transactionDate: string;
						createdAt: string;
						updatedAt: string;
					};
				})}
				initialPageCount={initialData.pageCount}
			/>
		</div>
	);
}
