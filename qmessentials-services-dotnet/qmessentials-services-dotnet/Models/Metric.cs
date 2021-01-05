namespace QMEssentials.Models
{
    public record Metric
    {
        public string MetricId { get; init; }
        public string MetricName { get; init; }
        public string ProductId { get; init; }
        public double MinValue { get; init; }
        public double MaxValue { get; init; }
        public string Unit { get; init; }
        public string? Standard { get; init; }
        public string? InternalReference { get; init; }
    }
}