using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using QMEssentials.API.Models;

namespace QMEssentials.API
{
    public class QMEssentialsContext : DbContext
    {

        public DbSet<Metric> Metric { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Database=qmessentials;Username=qmessentials;Password=qmessentials!");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Metric>().HasKey(m => m.Name);
            modelBuilder.Entity<Metric>().Property(m => m.Name).HasColumnName("name");
            modelBuilder.Entity<Metric>().Property(m => m.AvailableQualifiers).HasColumnName("available_qualifiers");
            modelBuilder.Entity<Metric>().Property(m => m.AvailableUnits).HasColumnName("available_units");
            modelBuilder.Entity<Metric>().Property(m => m.ResultType).HasColumnName("result_type");
            modelBuilder.Entity<Metric>().Property(m => m.HasMultipleValues).HasColumnName("has_multiple_values");
            modelBuilder.Entity<Metric>().Property(m => m.IndustryStandards).HasColumnName("industry_standards");
            modelBuilder.Entity<Metric>().Property(m => m.MethodologyReferences).HasColumnName("methodology_references");
        }

    }
}