
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../shared/ui/card";
import { Circle } from "lucide-react";
import { ChartDataNumber, ChartGrowthPercentage } from "./chart-numbers";
import { toSentenceCase } from "@/lib/utils/format";
type HomeChartCardProps = {
	title: string;
	chart: React.ReactNode;
	legend?: React.ReactNode;
	currentValue?: number;
	growthPercentage?: number;
	isExpense?: boolean;
};

const LegendDisplaySlot = ({ children }: { children: React.ReactNode }) => {
	return <div className="flex flex-row gap-2">{children}</div>;
};

const LegendBadge = ({ color, label }: { color: string; label: string }) => {
	return (
		<div
			style={{ "--circle-stroke": color } as React.CSSProperties}
			className="flex flex-row gap-2 items-center"
		>
			<Circle
				className={`size-2.5 rounded-full stroke-[var(--circle-stroke)] fill-[var(--circle-stroke)]`}
			/>
			<p className="text-xs text-muted-foreground font-medium">{label}</p>
		</div>
	);
};

const HomeChartCard = ({ 
	title, 
	chart, 
	legend,
}: HomeChartCardProps) => {

	return (
		<Card className="shadow-none min-h-[540px] rounded-none bg-transparent">
			<CardHeader className="flex flex-row items-center justify-between">
				<div className="flex flex-col gap-1">
					<CardTitle className="text-lg capitalize">{toSentenceCase(title)}</CardTitle>
				
						{title !== "Revenue vs Expenses" && <div className="flex items-center gap-2">
							<span className="text-2xl font-semibold">
								<ChartDataNumber title={title} format={{
									style: 'currency',
									currency: 'GBP',
									trailingZeroDisplay: 'stripIfInteger',
								}} />
							</span>
							<ChartGrowthPercentage   title={title} isExpense={title === "Recurring Expenses"} />
						</div>}
					
				</div>
				{legend && (
					<div className="flex justify-end">
						<LegendDisplaySlot>
							{legend}
						</LegendDisplaySlot>
					</div>
				)}
			</CardHeader>
			<CardContent>{chart}</CardContent>
		</Card>
	);
};


export { LegendBadge };
export default HomeChartCard;
