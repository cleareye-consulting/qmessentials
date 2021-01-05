namespace QMEssentials.Controllers.Configuration {

    [Route("configuration/[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase {

        private readonly IConfigurationRepository configurationRepository;

        public ItemsController(IConfigurationRepository configurationRepository) {
            this.configurationRepository = configurationRepository;
        }



    }
}