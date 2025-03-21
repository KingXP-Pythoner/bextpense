using System;
using System.ComponentModel.DataAnnotations;

namespace Bextpense.Commands.UpdateTransaction.DTOs;

public class UpdateTransactionRequest
{
    [Required]
    public string Id { get; set; } = string.Empty;

    [Required]
    [StringLength(64)]
    public string Title { get; set; } = string.Empty;

    [StringLength(256)]
    public string? Description { get; set; }

    [Required]
    public decimal Amount { get; set; }

    [Required]
    public string Type { get; set; } = string.Empty;

    [Required]
    public string CategoryId { get; set; } = string.Empty;

    [Required]
    public long TransactionDate { get; set; }
}
