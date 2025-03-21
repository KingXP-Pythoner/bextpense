using Bextpense.Common.Entities;
using Bextpense.Queries.Home.GetTransactionOverview.DTOs;

namespace Bextpense.Queries.Home.GetTransactionOverview.Services;

public class TransactionAnalysisService : ITransactionAnalysisService
{
    public List<MonthlyRevenueDto> GetMonthlyData(
        List<Transaction> transactions,
        DateTimeOffset startDate,
        DateTimeOffset endDate
    )
    {
        var allMonths = Enumerable
            .Range(0, 12)
            .Select(i => startDate.AddMonths(i))
            .ToDictionary(date => date.ToString("MMM yyyy"), date => 0m);

        var monthlyTotals = transactions
            .GroupBy(t =>
                DateTimeOffset.FromUnixTimeMilliseconds(t.TransactionDate).ToString("MMM yyyy")
            )
            .ToDictionary(g => g.Key, g => g.Sum(t => t.Amount));

        return
        [
            .. allMonths.Select(month => new MonthlyRevenueDto(
                month.Key,
                monthlyTotals.ContainsKey(month.Key) ? monthlyTotals[month.Key] : month.Value
            )),
        ];
    }

    public List<MonthlyRevenueDto> CalculateMonthlySavings(
        List<MonthlyRevenueDto> income,
        List<MonthlyRevenueDto> expenses
    )
    {
        return
        [
            .. income.Select(
                (inc, i) => new MonthlyRevenueDto(inc.Month, inc.Amount - expenses[i].Amount)
            ),
        ];
    }

    public RecurringDataDto CalculateRecurringData(List<MonthlyRevenueDto> monthlyData)
    {
        var growthPercentage = 0m;
        if (monthlyData.Count != 0)
        {
            var firstMonth = monthlyData.First().Amount;
            var lastMonth = monthlyData.Last().Amount;
            growthPercentage = firstMonth > 0 ? ((lastMonth - firstMonth) / firstMonth) * 100 : 0;
        }

        return new RecurringDataDto
        {
            CurrentValue = monthlyData.LastOrDefault()?.Amount ?? 0,
            GrowthPercentage = growthPercentage,
            MonthlyData = monthlyData,
        };
    }

    public RecentTransactionsDto GetRecentTransactionsData(
        List<Transaction> transactions,
        DateTimeOffset now
    )
    {
        var threeMonthsAgo = new DateTimeOffset(
            now.Year,
            now.Month,
            1,
            0,
            0,
            0,
            TimeSpan.Zero
        ).AddMonths(-3);

        var recentTransactions = transactions
            .Where(t =>
                DateTimeOffset.FromUnixTimeMilliseconds(t.TransactionDate) >= threeMonthsAgo
            )
            .ToList();

        var categoryBreakdown = recentTransactions
            .GroupBy(t => t.CategoryId)
            .Select(g => new CategoryFrequencyDto(g.Key, g.Count(), g.Sum(t => t.Amount)))
            .OrderByDescending(c => c.Count)
            .ToList();

        var previousPeriodStart = threeMonthsAgo.AddMonths(-3);
        var previousTransactions = transactions
            .Where(t =>
            {
                var date = DateTimeOffset.FromUnixTimeMilliseconds(t.TransactionDate);
                return date >= previousPeriodStart && date < threeMonthsAgo;
            })
            .ToList();

        var growthPercentage = 0m;
        if (previousTransactions.Count != 0)
        {
            var previousCount = previousTransactions.Count;
            var currentCount = recentTransactions.Count;
            growthPercentage = ((currentCount - previousCount) / (decimal)previousCount) * 100;
        }

        return new RecentTransactionsDto
        {
            TotalTransactions = recentTransactions.Count,
            GrowthPercentage = growthPercentage,
            CategoryBreakdown = categoryBreakdown,
        };
    }
}
