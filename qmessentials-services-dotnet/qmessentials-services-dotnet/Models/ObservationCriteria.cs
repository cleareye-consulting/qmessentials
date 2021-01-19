using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QMEssentials.Models
{
    public record ObservationCriteria
    {
        public ObservationCriteria(IEnumerable<string>? metricNames, IEnumerable<string>? itemIds,
            IEnumerable<string>? productIds, IEnumerable<string>? lotIds)
        {
            MetricNames = metricNames ?? Enumerable.Empty<string>();
            ItemIds = itemIds ?? Enumerable.Empty<string>();
            ProductIds = productIds ?? Enumerable.Empty<string>();
            LotIds = lotIds ?? Enumerable.Empty<string>();
        }

        public IEnumerable<string> MetricNames { get; }
        public IEnumerable<string> ItemIds { get; }
        public IEnumerable<string> ProductIds { get; }
        public IEnumerable<string> LotIds { get; }
    }
}
