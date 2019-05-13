using System.Collections.Generic;

namespace QMEssentials.API.Models
{
    public sealed class Metric
    {
        public string Name { get; set; }
        public string[] AvailableQualifiers { get; set; }
        public string[] AvailableUnits { get; set; }
        public string ResultType { get; set; }
        public bool HasMultipleValues { get; set; }
        public string[] IndustryStandards { get; set; }
        public string[] MethodologyReferences { get; set; }

    }
}