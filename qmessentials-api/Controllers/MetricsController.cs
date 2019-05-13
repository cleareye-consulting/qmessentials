using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QMEssentials.API.Models;

namespace QMEssentials.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class MetricsController : ControllerBase
    {
        private IQMEssentialsContext repository;

        public MetricsController(IQMEssentialsContext repository) => this.repository = repository;

        [HttpGet]
        public async Task CreateMetric(Metric metric)
        {
            await repository.Metrics.AddAsync(metric);
        }

    }

}