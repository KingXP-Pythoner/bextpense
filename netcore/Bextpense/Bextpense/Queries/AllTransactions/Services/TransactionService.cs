using System.Linq.Expressions;
using Bextpense.Common.Entities;
using Bextpense.Infrastructure.Data;
using Bextpense.Queries.AllTransactions.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Bextpense.Queries.AllTransactions.Services;

public class TransactionService : ITransactionService
{
    private readonly AppDbContext _dbContext;

    public TransactionService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<GetTransactionsResponse> GetTransactionsAsync(
        string userId,
        GetTransactionsRequest request
    )
    { // must be authed, not a deleted transaction and updated at cannot be a future date from now
        var query = _dbContext.Transactions.Where(t =>
            t.UserId == userId
            && t.IsDeleted == false
            && t.UpdatedAt < DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
        );

        // Apply search term (across multiple fields)
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var searchTerm = "%" + request.Search.ToLower() + "%";
            query = query.Where(t =>
                EF.Functions.Like(t.Title.ToLower(), searchTerm)
                || (t.Description != null && EF.Functions.Like(t.Description.ToLower(), searchTerm))
            );
        }

        // Apply title filter
        if (!string.IsNullOrWhiteSpace(request.Title))
        {
            var titleTerm = "%" + request.Title + "%";
            query = query.Where(t => EF.Functions.Like(t.Title, titleTerm));
        }

        // Apply type filter (multiple types)
        if (request.Type != null && request.Type.Length > 0)
        {
            query = query.Where(t => request.Type.Contains(t.Type));
        }

        // Apply category filter (multiple categories)
        if (request.Category != null && request.Category.Length > 0)
        {
            query = query.Where(t => request.Category.Contains(t.CategoryId));
        }

        // Apply date range filters
        if (request.FromDate.HasValue)
        {
            query = query.Where(t => t.TransactionDate >= request.FromDate.Value);
        }

        if (request.ToDate.HasValue)
        {
            query = query.Where(t => t.TransactionDate <= request.ToDate.Value);
        }

        // Apply general filters
        if (request.Filters != null)
        {
            foreach (var filter in request.Filters)
            {
                query = ApplyFilter(query, filter.Key, filter.Value);
            }
        }

        try
        {
            // Get total count for pagination
            var totalCount = await query.CountAsync();

            // Apply sorting
            if (!string.IsNullOrEmpty(request.SortBy))
            {
                query = ApplySorting(query, request.SortBy, request.SortDesc);
            }
            else
            {
                // Default sorting by most recent transactions
                query = query.OrderByDescending(t => t.UpdatedAt);
            }

            // Apply pagination
            var pageCount = (int)Math.Ceiling(totalCount / (double)request.PageSize);

            var data = await query
                .Skip(request.PageIndex * request.PageSize)
                .Take(request.PageSize)
                .Select(t => new TransactionDto
                {
                    Id = t.Id.ToString(),
                    Title = t.Title,
                    Description = t.Description,
                    Amount = t.Amount,
                    Type = t.Type,
                    CategoryId = t.CategoryId,
                    TransactionDate = DateTimeOffset
                        .FromUnixTimeMilliseconds(t.TransactionDate)
                        .DateTime,
                    CreatedAt = DateTimeOffset.FromUnixTimeMilliseconds(t.CreatedAt).DateTime,
                    UpdatedAt = DateTimeOffset.FromUnixTimeMilliseconds(t.UpdatedAt).DateTime,
                })
                .ToListAsync();

            return new GetTransactionsResponse
            {
                Data = data,
                PageCount = pageCount,
                TotalCount = totalCount,
            };
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to fetch transactions: {ex.Message}", ex);
        }
    }

    private IQueryable<Transaction> ApplyFilter(
        IQueryable<Transaction> query,
        string key,
        string value
    )
    {
        return key.ToLower() switch
        {
            "title" => query.Where(t =>
                EF.Functions.Like(t.Title, "%" + value + "%")
                || t.Description != null && EF.Functions.Like(t.Description, "%" + value + "%")
            ),
            "type" => query.Where(t => t.Type == value),
            "category" or "categoryid" => query.Where(t => t.CategoryId == value),
            "minamount" => decimal.TryParse(value, out var minAmount)
                ? query.Where(t => t.Amount >= minAmount)
                : query,
            "maxamount" => decimal.TryParse(value, out var maxAmount)
                ? query.Where(t => t.Amount <= maxAmount)
                : query,
            "fromdate" => long.TryParse(value, out var fromDate)
                ? query.Where(t => t.TransactionDate >= fromDate)
                : query,
            "todate" => long.TryParse(value, out var toDate)
                ? query.Where(t => t.TransactionDate <= toDate)
                : query,
            _ => query,
        };
    }

    private IQueryable<Transaction> ApplySorting(
        IQueryable<Transaction> query,
        string sortBy,
        bool sortDesc
    )
    {
        return sortBy.ToLower() switch
        {
            "title" => sortDesc
                ? query.OrderByDescending(t => t.Title)
                : query.OrderBy(t => t.Title),
            "amount" => sortDesc
                ? query.OrderByDescending(t => t.Amount)
                : query.OrderBy(t => t.Amount),
            "transactiondate" => sortDesc
                ? query.OrderByDescending(t => t.TransactionDate)
                : query.OrderBy(t => t.TransactionDate),
            "createdat" => sortDesc
                ? query.OrderByDescending(t => t.CreatedAt)
                : query.OrderBy(t => t.CreatedAt),
            "updatedat" => sortDesc
                ? query.OrderByDescending(t => t.UpdatedAt)
                : query.OrderBy(t => t.UpdatedAt),
            "type" => sortDesc ? query.OrderByDescending(t => t.Type) : query.OrderBy(t => t.Type),
            "category" or "categoryid" => sortDesc
                ? query.OrderByDescending(t => t.CategoryId)
                : query.OrderBy(t => t.CategoryId),
            _ => sortDesc
                ? query.OrderByDescending(t => t.UpdatedAt)
                : query.OrderBy(t => t.UpdatedAt),
        };
    }
}
