"use client";

import { TTransactionOverviewResponse } from "@/lib/types/transaction-overview";
import { createContext, useState, ReactNode, use, useMemo } from "react";

export type TimeRange = "1m" | "3m" | "6m" | "12m";

type TChartsDataViewContext = {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  chartData: TTransactionOverviewResponse;
};

const ChartsDataViewContext = createContext<TChartsDataViewContext>({
  timeRange: "12m",
  setTimeRange: () => {},
  chartData: {} as TTransactionOverviewResponse,
});

export const useChartsDataView = () => {
  const context = use(ChartsDataViewContext);
  if (!context) {
    throw new Error("useChartsDataView must be used within a ChartsDataViewProvider");
  }
  return context;
};

// Calculate metrics from filtered data
const calculateMetrics = (data: TTransactionOverviewResponse["recurringRevenue"]["monthlyData"]) => {
  // Current value is the most recent month
  const currentValue = data.length > 0 ? data[data.length - 1].amount : 0;
  
  // Growth percentage calculation
  let growthPercentage = 0;
  if (data.length > 1) {
    const firstValue = data[0].amount;
    const lastValue = data[data.length - 1].amount;
    
    if (firstValue > 0) {
      growthPercentage = ((lastValue - firstValue) / firstValue) * 100;
    }
  }
  
  return { currentValue, growthPercentage };
};

export const TransactionOverviewProvider = ({ children, initialData }: { children: ReactNode, initialData: TTransactionOverviewResponse }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("12m");
  
  // Helper to filter data by time range
  const filterDataByTimeRange = (data: TTransactionOverviewResponse["recurringRevenue"]["monthlyData"], timeRange: TimeRange) => {
    const monthsToInclude = parseInt(timeRange.replace("m", ""));
    return data.slice(-monthsToInclude);
  };
  
  const filteredData = useMemo(() => {
    // Filter monthly data for each metric
    const filteredRevenueData = filterDataByTimeRange(initialData.recurringRevenue.monthlyData, timeRange);
    const filteredExpensesData = filterDataByTimeRange(initialData.recurringExpenses.monthlyData, timeRange);
    const filteredSavingsData = filterDataByTimeRange(initialData.savings.monthlyData, timeRange);
    
    // Calculate new metrics based on filtered data
    const revenueMetrics = calculateMetrics(filteredRevenueData);
    const expensesMetrics = calculateMetrics(filteredExpensesData);
    const savingsMetrics = calculateMetrics(filteredSavingsData);
    
    return {
      ...initialData,
      recurringRevenue: {
        ...initialData.recurringRevenue,
        monthlyData: filteredRevenueData,
        currentValue: revenueMetrics.currentValue,
        growthPercentage: revenueMetrics.growthPercentage
      },
      recurringExpenses: {
        ...initialData.recurringExpenses,
        monthlyData: filteredExpensesData,
        currentValue: expensesMetrics.currentValue,
        growthPercentage: expensesMetrics.growthPercentage
      },
      savings: {
        ...initialData.savings,
        monthlyData: filteredSavingsData,
        currentValue: savingsMetrics.currentValue,
        growthPercentage: savingsMetrics.growthPercentage
      }
    };
  }, [initialData, timeRange]);
  
  return (
    <ChartsDataViewContext.Provider value={{ timeRange, setTimeRange, chartData: filteredData }}>
      {children}
    </ChartsDataViewContext.Provider>
  );
}; 