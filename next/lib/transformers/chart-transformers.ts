"use client";
import { Options, SeriesColumnOptions } from "highcharts";
import { TTransactionOverviewResponse } from "../types/transaction-overview";
import { HIGHCHART_DEFAULT_OPTIONS } from "@/constants/highchart-default-options";
import { TTransaction } from "../types/transaction";
import dayjs from "dayjs";


export const toRecurringRevenueChart = (data: TTransactionOverviewResponse): Options => ({
    ...HIGHCHART_DEFAULT_OPTIONS,
    xAxis: {
        ...HIGHCHART_DEFAULT_OPTIONS.xAxis,
        categories: data.recurringRevenue.monthlyData.map(item => item.month),

    },
    yAxis: {
        ...HIGHCHART_DEFAULT_OPTIONS.yAxis,
        min: 0,
        max: data.recurringRevenue.monthlyData.reduce((max, item) => Math.max(max, item.amount), 0),
        tickInterval: Math.ceil(data.recurringRevenue.monthlyData.reduce((max, item) => Math.max(max, item.amount), 0) / 4)
    },
    series: [{
        type: "column",
        name: "Revenue",
        data: data.recurringRevenue.monthlyData.map(item => item.amount),
        color: "var(--color-primary)"
    }],

});

export const toRecurringExpensesChart = (data: TTransactionOverviewResponse): Options => ({
    ...HIGHCHART_DEFAULT_OPTIONS,
    xAxis: {
        ...HIGHCHART_DEFAULT_OPTIONS.xAxis,
        categories: data.recurringExpenses.monthlyData.map(item => item.month),

    },
    yAxis: {
        ...HIGHCHART_DEFAULT_OPTIONS.yAxis,
        min: 0,
        max: data.recurringExpenses.monthlyData.reduce((max, item) => Math.max(max, item.amount), 0),
        tickInterval: Math.ceil(data.recurringExpenses.monthlyData.reduce((max, item) => Math.max(max, item.amount), 0) / 4)
    },
    series: [{
        type: "column",
        name: "Expenses",
        data: data.recurringExpenses.monthlyData.map(item => item.amount),
        color: "var(--color-destructive)"
    }],

});

export const toSavingsChart = (data: TTransactionOverviewResponse): Options => {
    const max = data.savings.monthlyData.reduce((max, item) => Math.max(max, item.amount), 0);
    return {...HIGHCHART_DEFAULT_OPTIONS,
    chart: {
        ...HIGHCHART_DEFAULT_OPTIONS.chart,
        type: "line"
    },
    xAxis: {
        ...HIGHCHART_DEFAULT_OPTIONS.xAxis,
        categories: data.savings.monthlyData.map(item => item.month),

    },
    yAxis: {
        ...HIGHCHART_DEFAULT_OPTIONS.yAxis,
        min: 0,
        max: max,
        tickInterval: Math.ceil(max / 4)
    },
    plotOptions: {
        line: {
            marker: {
                enabled: false
            },
            lineWidth: 2
        }
    },
    series: [{
        type: "line",
        name: "Savings",
        data: data.savings.monthlyData.map(item => item.amount),
        color: "var(--color-chart-2)"
    }],
}
};

export const toIncomeVsExpensesChart = (data: TTransactionOverviewResponse): Options => ({
    ...HIGHCHART_DEFAULT_OPTIONS,
    xAxis: {
        ...HIGHCHART_DEFAULT_OPTIONS.xAxis,
        categories: data.recurringRevenue.monthlyData.map(item => item.month),

    },
    yAxis: {
        ...HIGHCHART_DEFAULT_OPTIONS.yAxis,
        min: undefined,
        max: Math.max(
            data.recurringRevenue.monthlyData.reduce((max, item) => Math.max(max, item.amount), 0),
            data.recurringExpenses.monthlyData.reduce((max, item) => Math.max(max, item.amount), 0)
        ),
        tickInterval: undefined
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            borderWidth: 0
        }
    },
    series: [{
        type: "column",
        name: "Revenue",
        data: data.recurringRevenue.monthlyData.map(item => item.amount),
        color: "var(--color-primary)"
    } as SeriesColumnOptions,
    {
        type: "column",
        name: "Expenses",
        data: data.recurringExpenses.monthlyData.map(item => -item.amount),
        color: "var(--color-destructive)"
    } as SeriesColumnOptions],

});

export const toTransactionSummaryChart = (
    transactions: (TTransaction & {
        transactionDate: string;
        createdAt: string;
        updatedAt: string;
    })[]
): Options => {
    // Group by month for time series
    const monthlyData = transactions.reduce((acc, transaction) => {
        const month = dayjs(transaction.transactionDate).format("MMM YYYY");
        
        if (!acc[month]) {
            acc[month] = {
                income: 0,
                expense: 0,
                count: 0,
            };
        }
        
        // Add to income or expense based on transaction type
        if (transaction.type === "income") {
            acc[month].income += transaction.amount;
        } else {
            acc[month].expense += transaction.amount;
        }
        
        acc[month].count += 1;
        
        return acc;
    }, {} as Record<string, { income: number; expense: number; count: number }>);
    
    // Get the date range to ensure we show all months even if no transactions
    let minDate = dayjs();
    let maxDate = dayjs();
    
    if (transactions.length > 0) {
        // Find min and max dates in the transactions
        minDate = transactions.reduce(
            (min, t) => {
                const date = dayjs(t.transactionDate);
                return date.isBefore(min) ? date : min;
            },
            dayjs(transactions[0].transactionDate)
        );
        
        maxDate = transactions.reduce(
            (max, t) => {
                const date = dayjs(t.transactionDate);
                return date.isAfter(max) ? date : max;
            },
            dayjs(transactions[0].transactionDate)
        );
    } else {
        // Default to 6 months if no transactions
        minDate = dayjs().subtract(6, "month");
        maxDate = dayjs();
    }
    
    // Round to beginning/end of month
    minDate = minDate.startOf("month");
    maxDate = maxDate.endOf("month");
    
    // Generate all months between min and max
    const allMonths: string[] = [];
    let currentDate = minDate.clone();
    
    while (currentDate.isBefore(maxDate) || currentDate.isSame(maxDate, "month")) {
        allMonths.push(currentDate.format("MMM YYYY"));
        currentDate = currentDate.add(1, "month");
    }
    
    // Fill in missing months with zero values
    const completeMonthlyData = allMonths.reduce((acc, month) => {
        acc[month] = monthlyData[month] || { income: 0, expense: 0, count: 0 };
        return acc;
    }, {} as Record<string, { income: number; expense: number; count: number }>);

    return {
        ...HIGHCHART_DEFAULT_OPTIONS,
        chart: {
            ...HIGHCHART_DEFAULT_OPTIONS.chart,
            type: "column",
            height: 250,
            style: {
                backgroundColor: "var(--color-card)",
                color: "var(--color-card-foreground)",
            },
        },
        title: {
            text: undefined,
        },
        xAxis: {
            ...HIGHCHART_DEFAULT_OPTIONS.xAxis,
            categories: allMonths,
            // Always show first and last month, plus show some middle months if there are many
            labels: {
                formatter: function() {
                    const index = this.pos as number;
                    const totalMonths = allMonths.length;
                    // Show first, last and some middle months if there are many
                    if (index === 0 || index === totalMonths - 1 || 
                        (totalMonths > 8 && index % Math.ceil(totalMonths / 8) === 0)) {
                        return String(this.value);
                    }
                    return "";
                },
                style: {
                    color: "var(--color-muted-foreground)",
                },
            },
        },
        yAxis: {
            ...HIGHCHART_DEFAULT_OPTIONS.yAxis,
            title: {
                text: undefined,
            },
            min: 0,
        },
        plotOptions: {
            column: {
                borderWidth: 0,
            },
        },
        series: [
            {
                type: "column",
                name: "Income",
                data: allMonths.map(month => completeMonthlyData[month].income),
                color: "var(--color-primary)",
            },
            {
                type: "column",
                name: "Expense",
                data: allMonths.map(month => completeMonthlyData[month].expense),
                color: "var(--color-destructive)",
            },
            {
                type: "line",
                name: "Net",
                data: allMonths.map(month => 
                    completeMonthlyData[month].income - completeMonthlyData[month].expense
                ),
                color: "var(--color-chart-2)",
                zIndex: 1,
            },
        ],
        legend: {
            enabled: false,
        },
    };
};


