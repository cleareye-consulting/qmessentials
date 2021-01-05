namespace QMEssentials.Models
{
    public record Lot
    {
        public string LotId { get; init; }
        public string ProductId { get; init; }
        public string? CustomerIdentifier { get; init; }
        public DateTime CreatedDate { get; init; }
        public string LotStatus { get; set; }
    }
}