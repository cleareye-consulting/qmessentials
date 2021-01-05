using System;

namespace QMEssentials.Models
{

    public record Observation
    {
        public string ItemId { get; init; }
        public string MetricId { get; init; }
        public string LotId { get; init; }
        public string ProductId { get; init; }
        public double Value { get; init; }
        public DateTime CreatedDate { get; init; }
    }

}