using System.ComponentModel.DataAnnotations;

namespace Bextpense.Common.Entities;

public class TransactionType : ITransactionType
{
    // Income or Expense
    [Key]
    public required string Type { get; set; }
}
