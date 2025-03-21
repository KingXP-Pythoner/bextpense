using System;

namespace Bextpense.Common.Entities;

public interface ICategory
{
    public string Id { get; set; }
    public bool IsDeleted { get; set; }
}
