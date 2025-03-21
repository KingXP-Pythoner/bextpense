using Bextpense.Commands.CreateTransaction.DTOs;
using Bextpense.Commands.DeleteTransaction.DTOs;
using Bextpense.Commands.UpdateTransaction.DTOs;
using Bextpense.Common.Entities;
using Bextpense.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Bextpense.Commands.Services;

public class TransactionCommandService : ITransactionCommandService
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<TransactionCommandService> _logger;

    public TransactionCommandService(
        AppDbContext dbContext,
        ILogger<TransactionCommandService> logger
    )
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task<CreateTransactionResponse> CreateTransactionAsync(
        string userId,
        CreateTransactionRequest request
    )
    {
        try
        {
            // Validate transaction type exists
            var transactionType =
                await _dbContext.TransactionTypes.FirstOrDefaultAsync(t => t.Type == request.Type)
                ?? throw new Exception($"Transaction type '{request.Type}' does not exist");

            // Validate category exists
            var category =
                await _dbContext.Categories.FirstOrDefaultAsync(c => c.Id == request.CategoryId)
                ?? throw new Exception($"Category '{request.CategoryId}' does not exist");

            // Create transaction entity
            var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = request.Title,
                Description = request.Description,
                Amount = request.Amount,
                TransactionDate = request.TransactionDate,
                CategoryId = request.CategoryId,
                Type = request.Type,
                CreatedAt = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                UpdatedAt = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                IsDeleted = false,
            };

            // Save transaction
            await _dbContext.Transactions.AddAsync(transaction);
            await _dbContext.SaveChangesAsync();

            // Return response
            return new CreateTransactionResponse
            {
                Id = transaction.Id.ToString(),
                Title = transaction.Title,
                Description = transaction.Description,
                Amount = transaction.Amount,
                Type = transaction.Type,
                CategoryId = transaction.CategoryId,
                TransactionDate = DateTimeOffset
                    .FromUnixTimeMilliseconds(transaction.TransactionDate)
                    .DateTime,
                CreatedAt = DateTimeOffset.FromUnixTimeMilliseconds(transaction.CreatedAt).DateTime,
                UpdatedAt = DateTimeOffset.FromUnixTimeMilliseconds(transaction.UpdatedAt).DateTime,
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating transaction: {Message}", ex.Message);
            throw;
        }
    }

    public async Task<UpdateTransactionResponse> UpdateTransactionAsync(
        string userId,
        UpdateTransactionRequest request
    )
    {
        try
        {
            // Find the transaction by ID
            if (!Guid.TryParse(request.Id, out var transactionId))
            {
                throw new ArgumentException("Invalid transaction ID format");
            }

            var transaction = await _dbContext.Transactions.FirstOrDefaultAsync(t =>
                t.Id == transactionId && t.UserId == userId && !t.IsDeleted
            );

            if (transaction == null)
            {
                throw new Exception($"Transaction with ID '{request.Id}' not found");
            }

            // Validate transaction type exists
            var transactionType =
                await _dbContext.TransactionTypes.FirstOrDefaultAsync(t => t.Type == request.Type)
                ?? throw new Exception($"Transaction type '{request.Type}' does not exist");

            // Validate category exists
            var category =
                await _dbContext.Categories.FirstOrDefaultAsync(c => c.Id == request.CategoryId)
                ?? throw new Exception($"Category '{request.CategoryId}' does not exist");

            // Update transaction properties
            transaction.Title = request.Title;
            transaction.Description = request.Description;
            transaction.Amount = request.Amount;
            transaction.TransactionDate = request.TransactionDate;
            transaction.CategoryId = request.CategoryId;
            transaction.Type = request.Type;
            transaction.UpdatedAt = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            // Save changes
            _dbContext.Transactions.Update(transaction);
            await _dbContext.SaveChangesAsync();

            // Return response
            return new UpdateTransactionResponse
            {
                Id = transaction.Id.ToString(),
                Title = transaction.Title,
                Description = transaction.Description,
                Amount = transaction.Amount,
                Type = transaction.Type,
                CategoryId = transaction.CategoryId,
                TransactionDate = DateTimeOffset
                    .FromUnixTimeMilliseconds(transaction.TransactionDate)
                    .DateTime,
                CreatedAt = DateTimeOffset.FromUnixTimeMilliseconds(transaction.CreatedAt).DateTime,
                UpdatedAt = DateTimeOffset.FromUnixTimeMilliseconds(transaction.UpdatedAt).DateTime,
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating transaction: {Message}", ex.Message);
            throw;
        }
    }

    public async Task<DeleteTransactionResponse> DeleteTransactionAsync(
        string userId,
        DeleteTransactionRequest request
    )
    {
        try
        {
            // Find the transaction by ID
            if (!Guid.TryParse(request.Id, out var transactionId))
            {
                throw new ArgumentException("Invalid transaction ID format");
            }

            var transaction = await _dbContext.Transactions.FirstOrDefaultAsync(t =>
                t.Id == transactionId && t.UserId == userId && !t.IsDeleted
            );

            if (transaction == null)
            {
                throw new Exception($"Transaction with ID '{request.Id}' not found");
            }

            // Soft delete the transaction (mark as deleted)
            transaction.IsDeleted = true;
            transaction.UpdatedAt = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            // Save changes
            _dbContext.Transactions.Update(transaction);
            await _dbContext.SaveChangesAsync();

            return new DeleteTransactionResponse { Id = transaction.Id.ToString(), Success = true };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting transaction: {Message}", ex.Message);
            throw;
        }
    }
}
