using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using QMEssentials.API.Models;

namespace QMEssentials.API
{
    public class QMEssentialsContext : DbContext
    {
        public DbSet<Metric> Metrics { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Database=qmessentials;");
        }

    }
}