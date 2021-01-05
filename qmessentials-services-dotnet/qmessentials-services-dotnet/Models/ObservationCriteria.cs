using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QMEssentials.Models
{
    public record ObservationCriteria
    {
        public IEnumerable<string> MetricNames { get; init; }
        public IEnumerable<string> ItemIds { get; init; }
        public IEnumerable<string> ProductIds { get; init; }
        public IEnumerable<string> LotIds { get; init; }
    }
}
