using System;
using System.ComponentModel.DataAnnotations;

namespace Bextpense.Common.Entities;

public class Category : ICategory
{
    [Key]
    public required string Id { get; set; }
    public required long CreatedAt { get; set; }
    public required long UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
}
