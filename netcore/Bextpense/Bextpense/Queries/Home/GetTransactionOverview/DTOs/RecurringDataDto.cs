namespace Bextpense.Queries.Home.GetTransactionOverview.DTOs;

public record RecurringDataDto
{
    public decimal CurrentValue { get; init; }
    public decimal GrowthPercentage { get; init; }
    public List<MonthlyRevenueDto> MonthlyData { get; init; } = [];
}
