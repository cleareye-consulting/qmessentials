using System;

namespace QMEssentials.Models
{

    public record Observation
    {
        public Observation(string itemId, string metricId, string lotId, string productId, double value,
            DateTime createdDate)
        {
            ItemId = itemId;
            MetricId = metricId;
            LotId = lotId;
            ProductId = productId;
            Value = value;
            CreatedDate = createdDate;
        }

        public string ItemId { get; }
        public string MetricId { get; }
        public string LotId { get;  }
        public string ProductId { get; }
        public double Value { get; }
        public DateTime CreatedDate { get; }
    }

}