namespace QMEssentials.Models
{

    public record Item
    {
        public string ItemId { get; init; }
        public string LotId { get; init; }
        public DateTime CreatedDate { get; init; }
        public string ItemStatus { get; init; }
    }
}