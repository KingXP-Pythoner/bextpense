using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Bextpense.Queries.AllTransactions.DTOs;
using Bextpense.Queries.AllTransactions.Services;

namespace Bextpense.Queries.AllTransactions;

public class GetAllTransactionsHandler
{
    private readonly ITransactionService _transactionService;

    public GetAllTransactionsHandler(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    public async Task<GetTransactionsResponse> Run(string userId, GetTransactionsRequest request)
    {
        return await _transactionService.GetTransactionsAsync(userId, request);
    }
}
