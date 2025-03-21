"use client"
import { useChartsDataView } from "@/context/charts-data-view"
import { TTransactionOverviewResponse } from "@/lib/types/transaction-overview"
import NumberFlow, { continuous, NumberFlowProps } from "@number-flow/react"

type ChartDataKey = Extract<keyof TTransactionOverviewResponse, "recurringRevenue" | "recurringExpenses" | "savings">

const chartTitleToDataKey: Record<string, ChartDataKey> = {
	"Recurring Revenue": "recurringRevenue",
	"Recurring Expenses": "recurringExpenses",
	"Savings": "savings",
}

type ChartDataNumberProps = Omit<NumberFlowProps, 'value'> & { title: string }

export const ChartDataNumber = ({title, ...props}: ChartDataNumberProps) => {
    const {chartData} = useChartsDataView()
    const dataKey = chartTitleToDataKey[title as keyof typeof chartTitleToDataKey] ?? "recurringRevenue"
    return <NumberFlow {...props} value={chartData[dataKey].currentValue} />
}

type GrowthPercentageProps = {
    title: string;
    isExpense?: boolean;
    value?: number;
} & Omit<NumberFlowProps, 'value'>

export const ChartGrowthPercentage = ({ title, isExpense = false, ...props }: GrowthPercentageProps) => {
    const { chartData } = useChartsDataView()
    const dataKey = chartTitleToDataKey[title as keyof typeof chartTitleToDataKey] ?? "recurringRevenue"
    const growthPercentage = chartData[dataKey].growthPercentage / 100
    
    const isPositiveGrowth = isExpense ? 
        growthPercentage < 0 : 
        growthPercentage >= 0
    const isZeroGrowth = growthPercentage === 0
    return (
       
        <NumberFlow 
            plugins={[continuous]} 
            className={isZeroGrowth ? "text-gray-500" : isPositiveGrowth ? "text-emerald-500" : "text-red-400"} 
            value={growthPercentage} 
            format={{ 
                style: 'percent',
                signDisplay: 'always',
                useGrouping: false,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }} 
            {...props}  
        />
    )
} 