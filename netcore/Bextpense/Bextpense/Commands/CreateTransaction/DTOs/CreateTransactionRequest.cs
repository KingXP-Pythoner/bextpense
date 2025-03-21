using System.ComponentModel.DataAnnotations;

namespace Bextpense.Commands.CreateTransaction.DTOs;

public class CreateTransactionRequest
{
    [Required]
    [StringLength(64, MinimumLength = 1)]
    public string Title { get; set; } = string.Empty;

    [StringLength(256)]
    public string? Description { get; set; }

    [Required]
    [Range(0, Double.MaxValue)]
    public decimal Amount { get; set; }

    [Required]
    public long TransactionDate { get; set; }

    [Required]
    public string Type { get; set; } = string.Empty;

    [Required]
    public string CategoryId { get; set; } = string.Empty;
}
