using System.Collections.Generic;

namespace QMEssentials.Reporting.Models
{
    internal class Observation
    {

        public Item Item { get; set; }

        internal Metric<Observation> Metric { get; set; }
    }
}