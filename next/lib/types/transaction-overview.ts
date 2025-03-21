export type MonthlyData = {
    month: string;
    amount: number;
};

export type RecurringMetric = {
    currentValue: number;
    growthPercentage: number;
    monthlyData: MonthlyData[];
};

export type CategoryBreakdown = {
    category: string;
    count: number;
    totalAmount: number;
};

export type RecentTransactions = {
    totalTransactions: number;
    growthPercentage: number;
    categoryBreakdown: CategoryBreakdown[];
};

export type TTransactionOverviewResponse = {
    userId: string;
    recurringRevenue: RecurringMetric;
    recurringExpenses: RecurringMetric;
    savings: RecurringMetric;
}; 