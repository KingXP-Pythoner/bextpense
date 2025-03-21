using Bextpense.Commands.CreateTransaction.DTOs;
using Bextpense.Commands.DeleteTransaction.DTOs;
using Bextpense.Commands.UpdateTransaction.DTOs;

namespace Bextpense.Commands.Services;

public interface ITransactionCommandService
{
    Task<CreateTransactionResponse> CreateTransactionAsync(
        string userId,
        CreateTransactionRequest request
    );

    Task<UpdateTransactionResponse> UpdateTransactionAsync(
        string userId,
        UpdateTransactionRequest request
    );

    Task<DeleteTransactionResponse> DeleteTransactionAsync(
        string userId,
        DeleteTransactionRequest request
    );
}
