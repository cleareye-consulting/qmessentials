using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QMEssentials.Models
{
    public class MetricCalculations
    {
        public string? MetricId { get; init; }
        public int? Count { get; set; }
        public double? MinValue { get; set; }
        public double? MaxValue { get; set; }
        public double? Average { get; set; }
        public double? Sum { get; set; }
        public double? FirstQuartile { get; set; }
        public double? Median { get; set; }
        public double? ThirdQuartile { get; set; }
        public double? StandardDeviation { get; set; }
    }
}
