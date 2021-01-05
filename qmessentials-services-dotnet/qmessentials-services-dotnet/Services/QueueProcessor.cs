using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using QMEssentials.Repositories;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace QMEssentials.Services
{
    public class QueueProcessor : BackgroundService
    {

        private readonly IObservationQueue queue;
        private readonly IObservationsRepository observationsRepository;
        private readonly ILogger<QueueProcessor> logger;

        public QueueProcessor(IObservationQueue queue, IObservationsRepository observationsRepository, ILogger<QueueProcessor> logger)
        {
            this.queue = queue;
            this.observationsRepository = observationsRepository;
            this.logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Yield();
                var observation = await queue.GetNextObservation();
                await observationsRepository.AddObservation(observation);
            }
        }
    }
}