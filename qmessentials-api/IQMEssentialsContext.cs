using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using QMEssentials.API.Models;

namespace QMEssentials.API
{
    public interface IQMEssentialsContext
    {
        DbSet<Metric> Metrics { get; set; }

    }
}