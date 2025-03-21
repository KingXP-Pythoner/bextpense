using Bextpense.Common.Entities;
using Bextpense.Queries.Home.GetTransactionOverview.DTOs;

namespace Bextpense.Queries.Home.GetTransactionOverview.Services;

public interface ITransactionAnalysisService
{
    List<MonthlyRevenueDto> GetMonthlyData(
        List<Transaction> transactions,
        DateTimeOffset startDate,
        DateTimeOffset endDate
    );
    List<MonthlyRevenueDto> CalculateMonthlySavings(
        List<MonthlyRevenueDto> income,
        List<MonthlyRevenueDto> expenses
    );
    RecurringDataDto CalculateRecurringData(List<MonthlyRevenueDto> monthlyData);
    RecentTransactionsDto GetRecentTransactionsData(
        List<Transaction> transactions,
        DateTimeOffset now
    );
}
