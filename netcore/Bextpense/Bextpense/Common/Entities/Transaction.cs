using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bextpense.Common.Entities;

public class Transaction : ITransaction
{
    [Key]
    public required Guid Id { get; set; }

    [Required]
    public required string UserId { get; set; }

    [StringLength(64)]
    public required string Title { get; set; }

    [StringLength(256)]
    public string? Description { get; set; }

    [Required]
    public required decimal Amount { get; set; }

    [Required]
    public required long TransactionDate { get; set; }

    public required long CreatedAt { get; set; }
    public required long UpdatedAt { get; set; }
    public bool IsDeleted { get; set; } = false;

    [ForeignKey("Category")]
    public required string CategoryId { get; set; }
    public Category? Category { get; set; }

    [Required]
    [ForeignKey("Type")]
    public required string Type { get; set; }
    public TransactionType? TransactionType { get; set; }
}
