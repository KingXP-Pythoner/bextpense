namespace Bextpense.Queries.AllTransactions.DTOs
{
    public class TableResponse<T>
    {
        public IEnumerable<T> Data { get; set; } = new List<T>();
        public int PageCount { get; set; }
        public int TotalCount { get; set; }
    }
}
