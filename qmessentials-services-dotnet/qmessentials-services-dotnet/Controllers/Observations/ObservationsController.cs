using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QMEssentials.Models;
using QMEssentials.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QMEssentials.Controllers.Observations
{
    [Route("observations/[controller]")]
    [ApiController]
    public class ObservationsController : ControllerBase
    {
        private readonly IObservationQueue queue;

        public ObservationsController(IObservationQueue queue)
        {
            this.queue = queue;
        }

        [HttpPost]
        public void Post(Observation observation)
        {
            queue.AddObservation(observation);
        }
    }
}
