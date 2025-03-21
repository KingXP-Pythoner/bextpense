using Bextpense.Queries.AllTransactions.DTOs;

namespace Bextpense.Queries.AllTransactions.Services;

public interface ITransactionService
{
    Task<GetTransactionsResponse> GetTransactionsAsync(
        string userId,
        GetTransactionsRequest request
    );
}
