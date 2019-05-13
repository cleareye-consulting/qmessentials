using System.Collections.Generic;

namespace QMEssentials.API.Models
{
    public sealed class Metric
    {
        public string Name { get; set; }
        public IEnumerable<string> AvailableQualifiers { get; set; }
        public IEnumerable<string> AvailableUnits { get; set; }
        public MetricType Type { get; set; }
        public bool IsMultiValue { get; set; }
        public IEnumerable<string> IndustryStandards { get; set; }
        public IEnumerable<string> MethodologyReferences { get; set; }

    }
}