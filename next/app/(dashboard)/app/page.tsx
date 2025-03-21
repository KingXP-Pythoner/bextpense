import { VerticalColumnBarChart } from "@/components/charts/bar";
import {
	HomeChartCard,
	LegendBadge,
	TimeRangeToggle,
} from "@/features/dashboard";
import { TransactionOverviewProvider } from "@/context/charts-data-view";
import { fetchTransactionOverview } from "@/fetchers/fetch-transaction-overview";

export const dynamic = "force-dynamic";
export default async function Page() {
	const data = await fetchTransactionOverview();

	return (
		<TransactionOverviewProvider initialData={data}>
			<div className="@container lg:px-8 md:px-6 px-4 w-full max-w-6xl mx-auto">
				<div className="flex justify-start mb-4">
					<TimeRangeToggle />
				</div>
				<div className="overflow-hidden">
					<div className="grid auto-rows-min @4xl:grid-cols-2 *:-ms-px *:-mt-px -m-px">
						<HomeChartCard
							title="Recurring Revenue"
							currentValue={data.recurringRevenue.currentValue}
							growthPercentage={data.recurringRevenue.growthPercentage}
							chart={<VerticalColumnBarChart title="Recurring Revenue" />}
							legend={
								<LegendBadge color="var(--color-primary)" label="Income" />
							}
						/>

						<HomeChartCard
							title="Recurring Expenses"
							currentValue={data.recurringExpenses.currentValue}
							growthPercentage={data.recurringExpenses.growthPercentage}
							isExpense={true}
							chart={<VerticalColumnBarChart title="Recurring Expenses" />}
							legend={
								<LegendBadge
									color="var(--color-destructive)"
									label="Expenses"
								/>
							}
						/>
						<HomeChartCard
							title="Revenue vs Expenses"
							chart={<VerticalColumnBarChart title="Revenue vs Expenses" />}
							legend={
								<>
									<LegendBadge color="var(--color-primary)" label="Income" />
									<LegendBadge
										color="var(--color-destructive)"
										label="Expenses"
									/>
								</>
							}
						/>
						<HomeChartCard
							title="Savings"
							currentValue={data.savings.currentValue}
							growthPercentage={data.savings.growthPercentage}
							chart={<VerticalColumnBarChart title="Savings" />}
						/>
					</div>
				</div>
			</div>
		</TransactionOverviewProvider>
	);
}
