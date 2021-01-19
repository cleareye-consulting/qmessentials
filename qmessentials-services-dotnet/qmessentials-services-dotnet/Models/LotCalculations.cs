using System.Collections.Generic;

namespace QMEssentials.Models
{
    public record LotCalculations
    {
        public LotCalculations(string lotId, IEnumerable<MetricCalculations> metricCalculations)
        {
            LotId = lotId;
            MetricCalculations = metricCalculations;
        }

        public string LotId { get; init; }
        public IEnumerable<MetricCalculations> MetricCalculations { get; init; }
    }
}
