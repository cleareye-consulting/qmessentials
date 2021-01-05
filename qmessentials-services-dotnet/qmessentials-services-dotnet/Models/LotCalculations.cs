using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QMEssentials.Models
{
    public record LotCalculations
    {
        public string LotId { get; init; }
        public IEnumerable<MetricCalculations> MetricCalculations { get; init; }
    }
}
