namespace Bextpense.Queries.Home.GetTransactionOverview.DTOs;

public record TransactionOverviewResponseDto
{
    public required string UserId { get; init; }
    public required RecurringDataDto RecurringRevenue { get; init; }
    public required RecurringDataDto RecurringExpenses { get; init; }
    public required RecurringDataDto Savings { get; init; }
}
