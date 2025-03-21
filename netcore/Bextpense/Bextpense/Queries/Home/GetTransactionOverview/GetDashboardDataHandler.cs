using Bextpense.Infrastructure.Data;
using Bextpense.Queries.Home.GetTransactionOverview.DTOs;
using Bextpense.Queries.Home.GetTransactionOverview.Services;
using Microsoft.EntityFrameworkCore;

namespace Bextpense.Queries.Home.GetTransactionOverview;

public class GetTransactionOverviewHandler(
    AppDbContext db,
    ITransactionAnalysisService transactionAnalysis
)
{
    private readonly AppDbContext _db = db;
    private readonly ITransactionAnalysisService _transactionAnalysis = transactionAnalysis;

    public async Task<TransactionOverviewResponseDto> Run(string userId)
    {
        var now = DateTimeOffset.UtcNow;
        var endDate = new DateTimeOffset(now.Year, now.Month, 1, 0, 0, 0, TimeSpan.Zero).AddMonths(
            1
        );
        var startDate = endDate.AddMonths(-12);

        var transactions = await _db
            .Transactions.Where(t =>
                t.UserId == userId
                && t.TransactionDate >= startDate.AddMonths(-3).ToUnixTimeMilliseconds()
                && t.TransactionDate < endDate.ToUnixTimeMilliseconds()
                && !t.IsDeleted
            )
            .OrderBy(t => t.TransactionDate)
            .ToListAsync();

        var incomeTransactions = transactions.Where(t => t.Type == "income").ToList();
        var expenseTransactions = transactions.Where(t => t.Type == "expense").ToList();

        var monthlyIncome = _transactionAnalysis.GetMonthlyData(
            incomeTransactions,
            startDate,
            endDate
        );

        var monthlyExpenses = _transactionAnalysis.GetMonthlyData(
            expenseTransactions,
            startDate,
            endDate
        );

        var monthlySavings = _transactionAnalysis.CalculateMonthlySavings(
            monthlyIncome,
            monthlyExpenses
        );

        return new TransactionOverviewResponseDto
        {
            UserId = userId,
            RecurringRevenue = _transactionAnalysis.CalculateRecurringData(monthlyIncome),
            RecurringExpenses = _transactionAnalysis.CalculateRecurringData(monthlyExpenses),
            Savings = _transactionAnalysis.CalculateRecurringData(monthlySavings),
        };
    }
}
