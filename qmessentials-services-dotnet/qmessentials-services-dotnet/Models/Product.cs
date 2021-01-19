namespace QMEssentials.Models
{
    public record Product
    {
        public Product(string productId, string productName)
        {
            ProductId = productId;
            ProductName = productName;
        }

        public string ProductId { get; }
        public string ProductName { get; }
    }
}