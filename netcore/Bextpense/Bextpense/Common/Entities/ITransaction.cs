namespace Bextpense.Common.Entities;

public interface ITransaction
{
    public Guid Id { get; set; }

    public string UserId { get; set; }

    public string Title { get; set; }
    public string? Description { get; set; }
    public decimal Amount { get; set; }
    public long TransactionDate { get; set; }
    public long CreatedAt { get; set; }
    public long UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
}
