using System;
using System.Linq;
using System.Text.Json;
using Bextpense.Common.Entities;
using Microsoft.EntityFrameworkCore;

namespace Bextpense.Infrastructure.Data;

/// <summary>
/// Handles the seeding of initial data into the application database.
/// </summary>
public class AppDbSeeder
{
    private readonly AppDbContext _context;
    private readonly ILogger<AppDbSeeder> _logger;
    private readonly JsonSerializerOptions _jsonOptions;
    private const int DefaultBatchSize = 1000;

    public AppDbSeeder(AppDbContext context, ILogger<AppDbSeeder> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = System
                .Text
                .Json
                .Serialization
                .JsonIgnoreCondition
                .WhenWritingNull,
            ReadCommentHandling = JsonCommentHandling.Skip,
            AllowTrailingCommas = true,
        };
    }

    /// <summary>
    /// Seeds the database with initial data from JSON files.
    /// </summary>
    /// <returns>A task representing the asynchronous operation.</returns>
    /// <exception cref="InvalidOperationException">Thrown when JSON files are missing or invalid.</exception>
    public async Task SeedAsync()
    {
        try
        {
            await SeedTransactionTypesAsync();
            await SeedCategoriesAsync();
            await SeedTransactionsAsync();
            await _context.SaveChangesAsync();
            _logger.LogInformation("Database seeding completed successfully");
        }
        catch (JsonException ex)
        {
            LogJsonError(ex);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Detected error while seeding the database");
            throw;
        }
    }

    private void LogJsonError(JsonException ex)
    {
        _logger.LogError(ex, "JSON deserialization error: {Message}", ex.Message);
        _logger.LogError("JSON path: {Path}", ex.Path);
        _logger.LogError(
            "Line number: {LineNumber}, Position: {BytePosition}",
            ex.LineNumber,
            ex.BytePositionInLine
        );
    }

    private static string GetJsonFilePath(string fileName)
    {
        var currentDir =
            Path.GetDirectoryName(typeof(AppDbSeeder).Assembly.Location)
            ?? throw new InvalidOperationException("Could not determine the assembly directory");

        var dataDir = Path.Combine(currentDir, "Infrastructure", "Data");
        if (!Directory.Exists(dataDir))
        {
            throw new InvalidOperationException($"Data directory not found at: {dataDir}");
        }

        var filePath = Path.Combine(dataDir, fileName);
        if (!File.Exists(filePath))
        {
            throw new InvalidOperationException($"JSON file not found at: {filePath}");
        }

        return filePath;
    }

    private async Task<List<T>> ReadJsonFileAsync<T>(string fileName)
    {
        var jsonPath = GetJsonFilePath(fileName);
        var jsonContent = await File.ReadAllTextAsync(jsonPath);

        try
        {
            var items = JsonSerializer.Deserialize<List<T>>(jsonContent, _jsonOptions);
            if (items == null || items.Count == 0)
            {
                throw new InvalidOperationException($"No items found in {fileName}");
            }
            return items;
        }
        catch (JsonException ex)
        {
            _logger.LogError(
                ex,
                "Failed to deserialize {FileName}. JSON content: {Content}",
                fileName,
                jsonContent
            );
            throw;
        }
    }

    private async Task SeedTransactionTypesAsync()
    {
        if (await _context.TransactionTypes.AnyAsync())
        {
            _logger.LogInformation("Transaction types already exist, skipping seeding...");
            return;
        }

        var transactionTypes = await ReadJsonFileAsync<TransactionType>("transactionTypes.json");
        await _context.TransactionTypes.AddRangeAsync(transactionTypes);
        _logger.LogInformation("Seeded {Count} transaction types", transactionTypes.Count);
    }

    private async Task SeedCategoriesAsync()
    {
        if (await _context.Categories.AnyAsync())
        {
            _logger.LogInformation("Categories already exist, skipping seeding...");
            return;
        }

        var categories = await ReadJsonFileAsync<Category>("categories.json");
        await _context.Categories.AddRangeAsync(categories);
        _logger.LogInformation("Seeded {Count} categories", categories.Count);
    }

    private async Task SeedTransactionsAsync(int batchSize = DefaultBatchSize)
    {
        if (await _context.Transactions.AnyAsync())
        {
            _logger.LogInformation("Transactions already exist, skipping seeding...");
            return;
        }

        var transactions = await ReadJsonFileAsync<Transaction>("transactions.json");

        for (int i = 0; i < transactions.Count; i += batchSize)
        {
            var batch = transactions.Skip(i).Take(batchSize).ToList();
            await _context.Transactions.AddRangeAsync(batch);
            await _context.SaveChangesAsync();
            _logger.LogInformation(
                "Seeded batch of {Count} transactions ({Start}-{End} of {Total})",
                batch.Count,
                i + 1,
                Math.Min(i + batchSize, transactions.Count),
                transactions.Count
            );
        }
    }
}
