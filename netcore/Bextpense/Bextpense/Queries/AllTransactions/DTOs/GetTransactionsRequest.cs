namespace Bextpense.Queries.AllTransactions.DTOs;

public class GetTransactionsRequest
{
    public int PageIndex { get; set; } = 0;
    public int PageSize { get; set; } = 10;

    public string? SortBy { get; set; }
    public bool SortDesc { get; set; }

    public string? Search { get; set; }

    public string[]? Type { get; set; }
    public string[]? Category { get; set; }
    public string? Title { get; set; }
    public long? FromDate { get; set; }
    public long? ToDate { get; set; }

    // Support for general filters (can be used for advanced filtering)
    public Dictionary<string, string>? Filters { get; set; }
}

public class GetTransactionsResponse
{
    public IEnumerable<TransactionDto> Data { get; set; } = new List<TransactionDto>();
    public int PageCount { get; set; }
    public int TotalCount { get; set; }
}
