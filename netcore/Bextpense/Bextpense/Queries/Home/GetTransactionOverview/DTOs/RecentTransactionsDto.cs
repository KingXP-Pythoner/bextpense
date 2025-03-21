namespace Bextpense.Queries.Home.GetTransactionOverview.DTOs;

public record RecentTransactionsDto
{
    public int TotalTransactions { get; init; }
    public decimal GrowthPercentage { get; init; }
    public List<CategoryFrequencyDto> CategoryBreakdown { get; init; } = [];
}
