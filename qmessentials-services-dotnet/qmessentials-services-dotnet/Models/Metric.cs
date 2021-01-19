namespace QMEssentials.Models
{
    public record Metric
    {
        public Metric(string metricId, string metricName, string productId, double minValue, double maxValue,
            string unit, string? standard, string? internalReference)
        {
            MetricId = metricId;
            MetricName = metricName;
            ProductId = productId;
            MinValue = minValue;
            MaxValue = maxValue;
            Unit = unit;
            Standard = standard;
            InternalReference = internalReference;
        }

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