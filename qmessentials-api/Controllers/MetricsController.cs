using System;
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

        public async Task Post(Metric metric)
        {
            Console.WriteLine($"Request received: {metric.Name} {metric.ResultType}");
            await repository.Metric.AddAsync(metric);
            await repository.SaveChangesAsync();
        }

    }

}