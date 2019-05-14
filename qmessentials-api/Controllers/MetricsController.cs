using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QMEssentials.API.Models;

namespace QMEssentials.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class MetricsController
    {
        private QMEssentialsContext repository;

        public MetricsController(QMEssentialsContext repository) => this.repository = repository;

        [HttpGet]
        public IEnumerable<Metric> Get(string name)
        {
            Console.WriteLine($"Name: {name}");
            var metrics = repository.Metric.AsQueryable();
            if (name != null)
            {
                metrics = metrics.Where(m => m.Name == name);
            }
            return metrics.ToList();
        }

        [HttpPost]
        public async Task Post(Metric metric)
        {
            var existingMetric = repository.Metric.SingleOrDefault(m => m.Name == metric.Name);
            if (existingMetric != null)
            {
                existingMetric.AvailableQualifiers = metric.AvailableQualifiers;
                existingMetric.AvailableUnits = metric.AvailableUnits;
                existingMetric.HasMultipleValues = metric.HasMultipleValues;
                existingMetric.IndustryStandards = metric.IndustryStandards;
                existingMetric.MethodologyReferences = metric.MethodologyReferences;
                existingMetric.ResultType = metric.ResultType;
            }
            else
            {
                await repository.Metric.AddAsync(metric);
            }
            await repository.SaveChangesAsync();
        }

    }

}