using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QMEssentials.Models;
using QMEssentials.Repositories;

namespace QMEssentials.Controllers.Configuration
{

    [Route("configuration/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {

        private readonly IConfigurationRepository configurationRepository;

        public ProductsController(IConfigurationRepository configurationRepository)
        {
            this.configurationRepository = configurationRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<Product>> Get(ProductCriteria criteria)
        {
            var products = await configurationRepository.ListProducts(criteria);
            return products;
        }

    }
}