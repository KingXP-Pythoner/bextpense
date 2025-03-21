using System.ComponentModel.DataAnnotations;

namespace Bextpense.Commands.DeleteTransaction.DTOs;

public class DeleteTransactionRequest
{
    [Required]
    public string Id { get; set; } = string.Empty;
}
