using System;
namespace QMEssentials.Models
{
    public record ProductCriteria
    {
        public string? ProductIdStartsWith { get; init; }
        public string? ProductNameIncludes { get; init; }
    }
}
