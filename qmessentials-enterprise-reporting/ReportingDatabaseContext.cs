using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace QMEssentials.Reporting
{
    internal class ReportingDatabaseContext : DbContext
    {

        internal DbSet<Observation> Observations { get; set; }

        internal class Observation
        {
            public string MetricName { get; set; }
            public string ItemId { get; set; }
            public IEnumerable<double> Values { get; set; }
        }

    }
}